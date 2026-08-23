/**
 * Operator entitlement register — IRMER-specific.
 *
 * One row per (user, site, equipmentClass) combination. Tracks whether the
 * staff member is entitled to operate that imaging modality at that site,
 * with entitlement / review / expiry dates and optional evidence pointer.
 */

import { Store, TABLES, uuid } from "./store";
import { EquipmentClass, EQUIPMENT_CLASS_LABEL } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";

export function listEntitlements(tenantId, filter = {}) {
  return Store.list(tenantId, TABLES.operator_entitlements).filter((r) => {
    if (filter.userId && r.userId !== filter.userId) return false;
    if (filter.siteId && r.siteId !== filter.siteId) return false;
    if (filter.equipmentClass && r.equipmentClass !== filter.equipmentClass) return false;
    if (filter.entitled !== undefined && r.entitled !== filter.entitled) return false;
    return true;
  });
}

export function getEntitlement(tenantId, userId, siteId, equipmentClass) {
  return Store.list(tenantId, TABLES.operator_entitlements).find(
    (r) => r.userId === userId && r.siteId === siteId && r.equipmentClass === equipmentClass,
  ) ?? null;
}

export function setEntitlement(user, { targetUserId, siteId, equipmentClass, entitled, entitlementDate, reviewDate, expiryDate, evidenceFileKey, notes }) {
  assertCan(user, "entitlement.edit", { siteId });
  const existing = getEntitlement(user.tenantId, targetUserId, siteId, equipmentClass);
  if (existing) {
    const next = Store.update(user.tenantId, TABLES.operator_entitlements, existing.id, {
      entitled, entitlementDate, reviewDate, expiryDate, evidenceFileKey, notes,
    });
    logAction(user, {
      objectType: "operator_entitlement",
      objectId: existing.id,
      siteId,
      action: "update",
      previousValue: existing,
      newValue: next,
    });
    return next;
  }
  const row = Store.insert(user.tenantId, TABLES.operator_entitlements, {
    id: uuid(),
    userId: targetUserId,
    siteId,
    equipmentClass,
    entitled: entitled ?? true,
    entitlementDate: entitlementDate ?? null,
    reviewDate: reviewDate ?? null,
    expiryDate: expiryDate ?? null,
    evidenceFileKey: evidenceFileKey ?? null,
    notes: notes ?? null,
  });
  logAction(user, {
    objectType: "operator_entitlement",
    objectId: row.id,
    siteId,
    action: "create",
    newValue: row,
  });
  return row;
}

export function revokeEntitlement(user, entitlementId) {
  const prev = Store.get(user.tenantId, TABLES.operator_entitlements, entitlementId);
  if (!prev) return null;
  assertCan(user, "entitlement.edit", { siteId: prev.siteId });
  const next = Store.update(user.tenantId, TABLES.operator_entitlements, entitlementId, { entitled: false });
  logAction(user, {
    objectType: "operator_entitlement",
    objectId: entitlementId,
    siteId: prev.siteId,
    action: "revoke",
    previousValue: prev,
    newValue: next,
  });
  return next;
}

/** Computes entitlement coverage for a single equipment class at a site. */
export function coverageForSite(tenantId, siteId, equipmentClass) {
  const rows = listEntitlements(tenantId, { siteId, equipmentClass });
  const entitled = rows.filter((r) => r.entitled).length;
  return { total: rows.length, entitled, pct: rows.length ? Math.round((entitled / rows.length) * 100) : 0 };
}

/** Buckets for dashboard widgets: entitled / due_for_review / expired / no_evidence. */
export function entitlementStatusBucket(entitlement, today = new Date()) {
  if (!entitlement.entitled) return "revoked";
  if (entitlement.expiryDate && new Date(entitlement.expiryDate) < today) return "expired";
  if (entitlement.reviewDate && new Date(entitlement.reviewDate) < today) return "review_due";
  if (!entitlement.evidenceFileKey) return "no_evidence";
  return "entitled";
}

export const ENTITLEMENT_BUCKETS = {
  entitled:    { label: "Entitled",        color: "#2e7d32" },
  review_due:  { label: "Review due",      color: "#b36000" },
  expired:     { label: "Expired",         color: "#e53935" },
  revoked:     { label: "Revoked",         color: "#6b7280" },
  no_evidence: { label: "Missing evidence", color: "#1565c0" },
};
