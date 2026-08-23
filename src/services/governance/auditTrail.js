/**
 * Append-only audit trail. Every governance mutation calls `logAction()`
 * before returning so a complete history is reconstructable.
 */

import { Store, TABLES, uuid } from "./store";

export function logAction(user, { objectType, objectId, action, siteId, previousValue, newValue }) {
  if (!user?.tenantId) return null;
  const row = {
    id: uuid(),
    tenantId: user.tenantId,
    siteId: siteId ?? user.siteId ?? null,
    userId: user.id ?? null,
    userDisplay: user.displayName ?? user.username ?? "Unknown",
    objectType,
    objectId: objectId ?? null,
    action,
    previousValue: previousValue ?? null,
    newValue: newValue ?? null,
    at: new Date().toISOString(),
  };
  return Store.insert(user.tenantId, TABLES.audit_trail, row);
}

export function listTrail(tenantId, filter = {}) {
  const rows = Store.list(tenantId, TABLES.audit_trail).slice().reverse();
  return rows.filter((r) => {
    if (filter.objectType && r.objectType !== filter.objectType) return false;
    if (filter.objectId && r.objectId !== filter.objectId) return false;
    if (filter.siteId && r.siteId !== filter.siteId) return false;
    return true;
  });
}
