/**
 * scope.js — the single role/area scoping rule, applied site-wide.
 *
 * Mirrors how the Staff Directory already scopes (timeOff.service): a user
 * sees only the sites their role/scope covers. Group Admin / Company roles
 * see everything; an Area Manager sees their area's sites; a Practice
 * Manager / team / individual sees just their own site.
 *
 * Every page uses `visibleSites(user)` to drive its in-scope site selector
 * and to filter the people/rows it shows.
 */

import { allPeople } from "./people";
import { SITES, resolveSiteId } from "./sites";

const ALL_SITE_CAPS = ["group_admin", "company_management"];

/** True if the user can see every site (org-wide oversight). */
export function canSeeAllSites(user) {
  if (!user) return false;
  return user.scopeType === "global" || ALL_SITE_CAPS.includes(user.capabilityRole);
}

/** Canonical sites the user is allowed to see. */
export function visibleSites(user) {
  if (!user) return [];
  if (canSeeAllSites(user)) return SITES;
  if (user.scopeType === "area" && user.areaId) {
    return SITES.filter((s) => s.areaId === user.areaId);
  }
  // practice / team / self → just their own site.
  const own = user.siteId ?? (user.practiceId ? resolveSiteId(user.practiceId) : null);
  return SITES.filter((s) => s.id === own);
}

/** The site a page should default to for this user. */
export function defaultSiteFor(user) {
  return visibleSites(user)[0]?.id ?? "site-southall";
}

/** True if the user can choose between more than one site (show a switcher). */
export function hasMultiSiteScope(user) {
  return visibleSites(user).length > 1;
}

/** Roster people the user is allowed to see (site-bound people filtered to
 *  visible sites; unbound people — e.g. group execs — always included). */
export function visiblePeople(user) {
  const ids = new Set(visibleSites(user).map((s) => s.id));
  return allPeople().filter((p) => !p.siteId || ids.has(p.siteId));
}
