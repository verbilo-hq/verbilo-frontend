/**
 * Organisation Settings — singleton per tenant.
 *
 * Holds group-wide defaults pulled into every governance pack at setup time:
 *  - Group identity (name, logo, brand colour)
 *  - Governance roles that span all packs (Clinical Director, Governance Lead,
 *    default Approver / Reviewer)
 *  - Document defaults (review cycle, numbering format, evidence retention)
 *
 * Pack-level overrides still live on each pack_instance row; if a pack's
 * `clinicalDirectorUserId` (etc.) is null the wizard falls back to the
 * org-level value. This avoids re-entering the same person for every pack.
 *
 * Modelled as a 1-row "table" so it shares the Store abstraction; we just
 * always read the first row for the tenant and upsert into the same id.
 */

import { Store, TABLES, uuid } from "./store";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";

export const DEFAULT_ORG_SETTINGS = Object.freeze({
  groupName: "",
  logoDataUrl: null,
  brandColor: "#1e6dd8",
  clinicalDirectorUserId: null,
  governanceLeadUserId: null,
  defaultApproverUserId: null,
  defaultReviewerUserId: null,
  defaultReviewCycleMonths: 12,
  documentNumberingFormat: "{tenant}-{pack}-{seq}",
  defaultAckDays: 14,
  evidenceRetentionYears: 7,
});

/** Returns the tenant's org settings row, or null if none has been created. */
export function getOrgSettings(tenantId) {
  if (!tenantId) return null;
  const rows = Store.list(tenantId, TABLES.org_settings);
  return rows[0] ?? null;
}

/** Returns org settings merged with defaults (so callers always get a full row). */
export function getOrgSettingsWithDefaults(tenantId) {
  const row = getOrgSettings(tenantId);
  return { ...DEFAULT_ORG_SETTINGS, ...(row ?? {}) };
}

/** Create the tenant's org settings row if it doesn't already exist. */
export function ensureOrgSettings(tenantId, seed = {}) {
  const existing = getOrgSettings(tenantId);
  if (existing) return existing;
  return Store.insert(tenantId, TABLES.org_settings, {
    id: uuid(),
    ...DEFAULT_ORG_SETTINGS,
    ...seed,
  });
}

/** Patch the org settings row. Creates it lazily if missing. */
export function updateOrgSettings(user, patch) {
  if (!user?.tenantId) return null;
  assertCan(user, "pack.configure"); // reuse the same gate the pack wizard uses
  const existing = ensureOrgSettings(user.tenantId);
  const next = Store.update(user.tenantId, TABLES.org_settings, existing.id, patch);
  logAction(user, {
    objectType: "org_settings",
    objectId: existing.id,
    action: "update",
    previousValue: existing,
    newValue: next,
  });
  return next;
}

/** Pack-aware resolver: returns the pack instance's override or the org default. */
export function resolveOrgField(packInstance, orgSettings, field) {
  if (packInstance && packInstance[field] != null && packInstance[field] !== "") {
    return packInstance[field];
  }
  return orgSettings?.[field] ?? null;
}
