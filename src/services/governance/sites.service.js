/**
 * Sites — tenant-scoped list of practices.
 * Reads from the seeded localStorage mirror until backend controllers exist.
 */

import { Store, TABLES, uuid } from "./store";
import { SiteStatus } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";

export function listSites(tenantId) {
  const rows = Store.list(tenantId, TABLES.sites);
  // Self-heal: collapse duplicate rows (same id). Older seed runs occasionally
  // appended duplicates because Store.insert didn't check existing ids. We
  // dedupe on read AND persist the cleaned list so it's a one-shot fix.
  const seen = new Set();
  const deduped = rows.filter((s) => {
    if (!s?.id || seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
  if (deduped.length !== rows.length) {
    for (const r of rows) {
      if (!seen.has(r.id)) continue;
    }
    Store.clear(tenantId, TABLES.sites);
    for (const r of deduped) Store.insert(tenantId, TABLES.sites, r);
  }
  return deduped;
}

export function getSite(tenantId, siteId) {
  return Store.get(tenantId, TABLES.sites, siteId);
}

export function createSite(user, { name, location, active = true }) {
  assertCan(user, "site.profile.edit");
  const row = Store.insert(user.tenantId, TABLES.sites, {
    id: uuid(),
    name,
    location,
    active,
    status: SiteStatus.not_configured,
  });
  logAction(user, { objectType: "site", objectId: row.id, action: "create", newValue: row });
  return row;
}

export function updateSiteStatus(user, siteId, status) {
  const prev = getSite(user.tenantId, siteId);
  if (!prev) return null;
  const next = Store.update(user.tenantId, TABLES.sites, siteId, { status });
  logAction(user, {
    objectType: "site",
    objectId: siteId,
    siteId,
    action: "status_change",
    previousValue: { status: prev.status },
    newValue: { status },
  });
  return next;
}
