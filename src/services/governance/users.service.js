/**
 * Users service — tenant-scoped read access to the seeded user list.
 *
 * Once a real backend exists, swap these for fetchJson calls to a
 * /tenants/:tenantId/users endpoint.
 */

import { Store, TABLES } from "./store";
import { resolveSiteId } from "../sites";

export function listUsers(tenantId, filter = {}) {
  // Users are now seeded with canonical siteIds. Fold any filter siteId onto the
  // canonical taxonomy too, so a caller passing a legacy id ("site-brighton") or a
  // display form still matches. resolveSiteId is idempotent for canonical ids.
  const wantSiteId = filter.siteId ? resolveSiteId(filter.siteId) : null;
  return Store.list(tenantId, TABLES.users).filter((u) => {
    if (filter.role && !userHasRole(u, filter.role)) return false;
    if (wantSiteId && u.siteId !== wantSiteId) return false;
    if (filter.active !== undefined && u.active !== filter.active) return false;
    return true;
  });
}

/** True if user has `role` as their primary role or as a secondary role. */
export function userHasRole(user, role) {
  if (!user) return false;
  if (user.role === role) return true;
  return Array.isArray(user.secondaryRoles) && user.secondaryRoles.includes(role);
}

/** Returns the union of primary + secondary roles a user carries. */
export function userRoles(user) {
  if (!user) return [];
  return [user.role, ...(user.secondaryRoles ?? [])].filter(Boolean);
}

export function getUser(tenantId, userId) {
  return Store.get(tenantId, TABLES.users, userId);
}

export function userDisplay(tenantId, userId, fallback = "—") {
  if (!userId) return fallback;
  const u = getUser(tenantId, userId);
  return u?.displayName ?? u?.username ?? fallback;
}
