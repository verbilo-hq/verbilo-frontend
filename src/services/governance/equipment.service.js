/**
 * Equipment & Systems Register — one record per piece of equipment per site profile.
 */

import { Store, TABLES, uuid } from "./store";
import { EquipmentStatus } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { ensureProfile, getProfile } from "./siteProfiles.service";
import { getPackInstance, DECON_PACK_KEY } from "./packs.service";

export function listForSite(tenantId, siteId, packKey = DECON_PACK_KEY) {
  const pack = getPackInstance(tenantId, packKey);
  const profile = pack ? getProfile(tenantId, siteId, pack.id) : null;
  if (!profile) return [];
  return Store.list(tenantId, TABLES.equipment).filter((r) => r.siteProfileId === profile.id);
}

export function listAll(tenantId) {
  return Store.list(tenantId, TABLES.equipment);
}

export function createEquipment(user, siteId, data, packKey = DECON_PACK_KEY) {
  assertCan(user, "equipment.edit", { siteId });
  const profile = ensureProfile(user, siteId, packKey);
  if (!profile) return null;
  const row = Store.insert(user.tenantId, TABLES.equipment, {
    id: uuid(),
    siteProfileId: profile.id,
    siteId,
    packKey,
    type: data.type,
    makeModel: data.makeModel,
    serialNumber: data.serialNumber ?? null,
    roomLocation: data.roomLocation ?? null,
    serviceProvider: data.serviceProvider ?? null,
    yearOfManufacture: data.yearOfManufacture ?? null,
    // For radiography assets `lastServiceDate` holds the date of the IRR17
    // statutory 3-year Routine Radiation Test (formerly "Critical Examination"
    // in earlier HSE guidance — terminology updated to match current wording).
    // `nextServiceDate` is auto-derived as lastServiceDate + 3 years if not supplied.
    lastServiceDate: data.lastServiceDate ?? null,
    nextServiceDate: data.nextServiceDate ?? null,
    // Handheld-only — IRR17 mandates a designated lockable cabinet / safe
    // for portable units to mitigate theft risk. Null for other modalities.
    secureStorageLocation: data.secureStorageLocation ?? null,
    status: data.status ?? EquipmentStatus.active,
    evidenceRequired: data.evidenceRequired ?? true,
    notes: data.notes ?? null,
    /* Free-form `data` blob for pack-specific structured fields that don't
     * deserve top-level columns (med-emergency pad expiries, cylinder size,
     * embedded suction / BVM checkboxes, etc.). Each pack-specialised step
     * defines its own schema for this object. Defaults to `{}` so consumers
     * can always `equipment.data?.foo` without null guards. */
    data: data.data ?? {},
  });
  logAction(user, {
    objectType: "equipment",
    objectId: row.id,
    siteId,
    action: "create",
    newValue: row,
  });
  return row;
}

export function updateEquipment(user, id, patch) {
  const prev = Store.get(user.tenantId, TABLES.equipment, id);
  if (!prev) return null;
  assertCan(user, "equipment.edit", { siteId: prev.siteId });
  const next = Store.update(user.tenantId, TABLES.equipment, id, patch);
  logAction(user, {
    objectType: "equipment",
    objectId: id,
    siteId: prev.siteId,
    action: "edit",
    previousValue: prev,
    newValue: next,
  });
  return next;
}

export function removeEquipment(user, id) {
  const prev = Store.get(user.tenantId, TABLES.equipment, id);
  if (!prev) return false;
  assertCan(user, "equipment.edit", { siteId: prev.siteId });
  Store.remove(user.tenantId, TABLES.equipment, id);
  logAction(user, {
    objectType: "equipment",
    objectId: id,
    siteId: prev.siteId,
    action: "delete",
    previousValue: prev,
  });
  return true;
}

/** Compute service-status flags for dashboard widgets. */
export function serviceStatusBucket(equipment, today = new Date()) {
  if (!equipment.nextServiceDate) return "unknown";
  const next = new Date(equipment.nextServiceDate);
  const diffMs = next.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "overdue";
  if (diffDays <= 30) return "due_soon";
  return "ok";
}
