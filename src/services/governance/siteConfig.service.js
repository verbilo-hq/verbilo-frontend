/**
 * Site spatial-files service — manages the per-site uploaded schematics
 * inspectors specifically ask for (decon-room flow, radiation shielding,
 * etc.). One file per (siteId × slotKey).
 *
 * Why a dedicated table (not just evidence):
 *   • These two files are *required* by name at CQC inspection — they
 *     need to be addressable by slot (`decon_layout`), not just by tag.
 *   • Practice Managers shouldn't have to hunt the evidence register for
 *     "the right one"; SiteProfile shows the two fixed dropzones and
 *     either ticks them off or flags them red.
 *
 * Scope deliberately tight: this file used to include local-emergency-
 * directory persistence too, but those contacts already live elsewhere
 * (pack-level LOCAL_LEAD_FIELDS_BY_PACK on the pack instance + RPA/MPE
 * fields on the radiography pack). The parallel store was removed in the
 * duplication rollback so the platform has one source of truth per thing.
 */

import { Store, TABLES, uuid } from "./store";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";

/**
 * Well-known map slots — IDs match the dropzones rendered on SiteProfile.
 * Adding a new required map = adding an entry here + the dropzone JSX;
 * nothing else changes. `requiredFor` ties the slot to a pack so the
 * dropzone only renders for sites running that pack.
 */
export const SITE_MAP_SLOTS = [
  {
    key:         "decon_layout",
    label:       "Dirty-to-Clean Decontamination Room Layout",
    accept:      "application/pdf,image/*",
    helpText:    "PDF or image of the decon room showing the dirty → setting → clean instrument flow. Required at every CQC IPC inspection.",
    requiredFor: "decontamination_ipc",
    regulatorRef: "HTM 01-05 §4.10",
  },
  {
    key:         "radiation_shielding",
    label:       "Surgery Radiation Shielding & Controlled Zone Schematic",
    accept:      "application/pdf,image/*",
    helpText:    "Schematic showing each X-ray surgery's controlled-area extent, lead-lined wall locations, and operator-protected zone.",
    requiredFor: "radiography_irmer",
    regulatorRef: "IRR17 Reg 17(2) · HSE L121 §388",
  },
];

export function listSiteMaps(tenantId, siteId) {
  return Store.list(tenantId, TABLES.site_maps).filter((m) => m.siteId === siteId);
}

export function getSiteMap(tenantId, siteId, slotKey) {
  return listSiteMaps(tenantId, siteId).find((m) => m.slotKey === slotKey) ?? null;
}

/**
 * Persist file metadata for one slot. One file per (siteId × slotKey) —
 * uploading again replaces the previous record.
 *
 *   metadata shape: { fileName, fileSize, mimeType, blobId? }
 *
 * The actual binary lives in IndexedDB (or S3 in prod) via the evidence
 * file-store; `blobId` is the pointer that store returns. Metadata-only
 * persistence keeps the query path cheap for the dashboard.
 */
export function saveSiteMap(user, siteId, slotKey, metadata) {
  assertCan(user, "site.edit", { tenantId: user.tenantId, siteId });
  const slot = SITE_MAP_SLOTS.find((s) => s.key === slotKey);
  if (!slot) {
    // eslint-disable-next-line no-console
    console.warn(`[saveSiteMap] Unknown slot key: ${slotKey}`);
    return null;
  }
  const existing = getSiteMap(user.tenantId, siteId, slotKey);
  const payload = {
    siteId,
    slotKey,
    slotLabel:    slot.label,
    fileName:     metadata.fileName,
    fileSize:     metadata.fileSize,
    mimeType:     metadata.mimeType,
    blobId:       metadata.blobId ?? null,
    uploadedAt:   new Date().toISOString(),
    uploadedByUserId: user.id,
  };

  let row;
  if (existing) {
    row = Store.update(user.tenantId, TABLES.site_maps, existing.id, payload);
  } else {
    row = Store.insert(user.tenantId, TABLES.site_maps, { id: uuid(), ...payload });
  }
  logAction(user, {
    objectType: "site_map",
    objectId:   row.id,
    siteId,
    action:     existing ? "replace" : "upload",
    newValue:   { slotKey, fileName: metadata.fileName, fileSize: metadata.fileSize },
  });
  return row;
}

export function removeSiteMap(user, siteId, slotKey) {
  assertCan(user, "site.edit", { tenantId: user.tenantId, siteId });
  const existing = getSiteMap(user.tenantId, siteId, slotKey);
  if (!existing) return false;
  Store.remove(user.tenantId, TABLES.site_maps, existing.id);
  logAction(user, {
    objectType: "site_map",
    objectId:   existing.id,
    siteId,
    action:     "delete",
    previousValue: { slotKey, fileName: existing.fileName },
  });
  return true;
}
