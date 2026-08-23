/**
 * Decon Equipment Register (Step 5 v2) — discriminated-union asset model.
 *
 * Each row in `equipment_assets`:
 *   { id, tenantId, siteProfileId, packKey, category, localIdentifier,
 *     status, data (JSON of per-category fields), createdAt, updatedAt }
 *
 * `category` is one of ASSET_CATEGORY (decon | water | waste | engineer).
 * `data` carries the category-specific fields defined in ASSET_FIELD_SCHEMA.
 * This shape maps cleanly to a future Postgres setup with a base table +
 * child tables per category (or JSONB column for `data` if preferred).
 *
 * Only used by Decon pack — other packs continue to use the existing
 * flag-gated `equipment_records` table.
 */

import { Store, TABLES, uuid } from "./store";
import { ASSET_CATEGORY } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { ensureProfile } from "./siteProfiles.service";
import { DECON_PACK_KEY } from "./packs.service";

/* ─── Reads ────────────────────────────────────────────────────────────── */

export function listAssetsBySite(tenantId, siteProfileId) {
  const rows = Store.list(tenantId, TABLES.equipment_assets)
    .filter((r) => r.siteProfileId === siteProfileId);
  return groupByCategory(rows);
}

/** Group a flat array of assets into { decon, water, waste, engineer }. */
function groupByCategory(rows) {
  const groups = { decon: [], water: [], waste: [], engineer: [] };
  for (const r of rows) {
    if (groups[r.category]) groups[r.category].push(r);
  }
  return groups;
}

export function getAsset(tenantId, id) {
  return Store.get(tenantId, TABLES.equipment_assets, id);
}

/* ─── Writes ───────────────────────────────────────────────────────────── */

export function createAsset(user, { siteId, category, data, localIdentifier }) {
  assertCan(user, "equipment.edit", { siteId });
  const profile = ensureProfile(user, siteId, DECON_PACK_KEY);
  if (!profile) return null;
  const now = new Date().toISOString();
  const row = Store.insert(user.tenantId, TABLES.equipment_assets, {
    id: uuid(),
    siteProfileId: profile.id,
    siteId,
    packKey: DECON_PACK_KEY,
    category,
    localIdentifier: localIdentifier ?? data?.localIdentifier ?? null,
    status: "active",
    data: stripIdentifierFromData(data),
    createdAt: now,
    updatedAt: now,
  });
  logAction(user, {
    objectType: "equipment_asset",
    objectId: row.id,
    siteId,
    action: "create",
    newValue: { category, localIdentifier: row.localIdentifier },
  });
  return row;
}

export function updateAsset(user, id, { data, localIdentifier, status }) {
  const prev = getAsset(user.tenantId, id);
  if (!prev) return null;
  assertCan(user, "equipment.edit", { siteId: prev.siteId });
  const next = Store.update(user.tenantId, TABLES.equipment_assets, id, {
    ...(data !== undefined ? { data: stripIdentifierFromData(data) } : {}),
    ...(localIdentifier !== undefined ? { localIdentifier } : {}),
    ...(status !== undefined ? { status } : {}),
    updatedAt: new Date().toISOString(),
  });
  logAction(user, {
    objectType: "equipment_asset",
    objectId: id,
    siteId: prev.siteId,
    action: "edit",
    previousValue: { data: prev.data, localIdentifier: prev.localIdentifier },
    newValue: { data: next.data, localIdentifier: next.localIdentifier },
  });
  return next;
}

export function removeAsset(user, id) {
  const prev = getAsset(user.tenantId, id);
  if (!prev) return false;
  assertCan(user, "equipment.edit", { siteId: prev.siteId });
  Store.remove(user.tenantId, TABLES.equipment_assets, id);
  logAction(user, {
    objectType: "equipment_asset",
    objectId: id,
    siteId: prev.siteId,
    action: "delete",
    previousValue: prev,
  });
  return true;
}

/* `localIdentifier` is promoted to a top-level column so we can index/search
 * on it without parsing JSON. Strip from `data` to keep storage tidy. */
function stripIdentifierFromData(data) {
  if (!data) return {};
  const { localIdentifier, ...rest } = data;
  return rest;
}

/* ─── Migration: legacy equipment_records → equipment_assets ───────────── */

const MIGRATION_KEY = (tenantId) => `verbilo.governance.${tenantId}._decon_assets_migrated_v1`;

/**
 * Maps legacy `equipment.type` strings to the new (category, equipmentType)
 * shape. Anything that doesn't match falls into "engineer" as a best-guess
 * bucket (tracking systems, logbook systems, service providers).
 */
const LEGACY_TYPE_MAP = {
  autoclave:          { category: ASSET_CATEGORY.decon,    equipmentType: "type_b_vacuum_autoclave" },
  washer_disinfector: { category: ASSET_CATEGORY.decon,    equipmentType: "washer_disinfector" },
  ultrasonic_bath:    { category: ASSET_CATEGORY.decon,    equipmentType: "ultrasonic_bath" },
  waterline_system:   { category: ASSET_CATEGORY.water,    systemType: "reverse_osmosis" },
  waste_contractor:   { category: ASSET_CATEGORY.waste },
  service_provider:   { category: ASSET_CATEGORY.engineer, providerCategory: "facilities" },
  tracking_system:    { category: ASSET_CATEGORY.engineer, providerCategory: "facilities" },
  logbook_system:     { category: ASSET_CATEGORY.engineer, providerCategory: "facilities" },
};

/**
 * One-shot migration. Runs once per tenant per browser (sentinel guarded).
 * Reads legacy `equipment_records` rows that belong to the Decon pack and
 * writes equivalent rows to `equipment_assets`. Doesn't delete legacy rows
 * — safe to re-run accidentally; idempotent via sentinel + identifier match.
 */
export function migrateLegacyEquipmentToAssets(tenantId) {
  if (!tenantId) return { migrated: 0, skipped: 0 };
  if (localStorage.getItem(MIGRATION_KEY(tenantId))) return { migrated: 0, skipped: 0, alreadyDone: true };

  const legacy = Store.list(tenantId, TABLES.equipment)
    .filter((r) => !r.packKey || r.packKey === DECON_PACK_KEY);
  // De-dupe target table by serial number per site to avoid re-inserts if
  // someone clears the sentinel manually.
  const existingAssets = Store.list(tenantId, TABLES.equipment_assets);
  const existingKeys = new Set(
    existingAssets.map((a) => `${a.siteProfileId}::${a.data?.serialNumber ?? a.localIdentifier ?? ""}`)
  );

  let migrated = 0;
  let skipped = 0;
  const now = new Date().toISOString();

  for (const r of legacy) {
    const mapping = LEGACY_TYPE_MAP[r.type];
    if (!mapping || !r.siteProfileId) { skipped += 1; continue; }
    const dedupKey = `${r.siteProfileId}::${r.serialNumber ?? r.makeModel ?? ""}`;
    if (existingKeys.has(dedupKey)) { skipped += 1; continue; }

    const data = buildLegacyData(r, mapping);
    Store.insert(tenantId, TABLES.equipment_assets, {
      id: uuid(),
      siteProfileId: r.siteProfileId,
      siteId: r.siteId,
      packKey: DECON_PACK_KEY,
      category: mapping.category,
      localIdentifier: r.makeModel ?? null,
      status: r.status ?? "active",
      data,
      createdAt: r.createdAt ?? now,
      updatedAt: now,
    });
    migrated += 1;
  }

  try { localStorage.setItem(MIGRATION_KEY(tenantId), new Date().toISOString()); } catch { /* noop */ }
  if (migrated > 0) {
    // eslint-disable-next-line no-console
    console.info(`[equipment-assets] migrated ${migrated} legacy row(s) for tenant ${tenantId}`);
  }
  return { migrated, skipped };
}

/** Best-effort field mapping per category from the legacy row shape. */
function buildLegacyData(r, mapping) {
  const base = {
    manufacturer: r.makeModel?.split(" ")[0] ?? null,
    modelNumber:  r.makeModel ?? null,
    serialNumber: r.serialNumber ?? null,
    lastStatutoryInspectionAt: r.lastServiceDate ?? null,
    nextValidationDueAt:       r.nextServiceDate ?? null,
  };
  switch (mapping.category) {
    case ASSET_CATEGORY.decon:
      return { ...base, equipmentType: mapping.equipmentType };
    case ASSET_CATEGORY.water:
      return {
        systemType: mapping.systemType ?? "reverse_osmosis",
        manufacturerModel: r.makeModel ?? "",
        installationLocation: r.roomLocation ?? "",
        lastServiceAt: r.lastServiceDate ?? null,
      };
    case ASSET_CATEGORY.waste:
      return {
        carrierName: r.serviceProvider ?? r.makeModel ?? "",
        wasteStreams: ["hazardous_clinical"],
        eaLicenseNumber: "",
      };
    case ASSET_CATEGORY.engineer:
      return {
        providerCategory: mapping.providerCategory ?? "facilities",
        companyName: r.serviceProvider ?? r.makeModel ?? "",
        emergencyTel: "",
        serviceAlertEmail: "",
      };
    default:
      return base;
  }
}
