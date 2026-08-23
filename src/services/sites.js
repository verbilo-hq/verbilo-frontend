/**
 * Canonical site/area model — the single source of truth for "where".
 *
 * The org map / Staff Directory (timeOff.service) defines these six sites
 * across two areas. Governance and various fixtures historically used a
 * DIFFERENT six-site set (Brighton/Hove/Worthing/Crawley/Guildford/
 * Portsmouth) plus legacy practice ids. SITE_ALIASES folds all of those
 * onto the canonical ids so the whole app converges on one taxonomy.
 *
 * See docs/superpowers/specs/2026-06-18-role-based-people-and-scope-design.md
 */

export const AREAS = [
  { id: "area-1", name: "Area 1", siteIds: ["site-southall", "site-reading", "site-new-cross"] },
  { id: "area-2", name: "Area 2", siteIds: ["site-london", "site-manchester", "site-birmingham"] },
];

export const SITES = [
  { id: "site-southall",   name: "Southall",   areaId: "area-1", practiceId: "practice-harley" },
  { id: "site-reading",    name: "Reading",    areaId: "area-1" },
  { id: "site-new-cross",  name: "New Cross",  areaId: "area-1" },
  { id: "site-london",     name: "London",     areaId: "area-2", practiceId: "practice-camden" },
  { id: "site-manchester", name: "Manchester", areaId: "area-2" },
  { id: "site-birmingham", name: "Birmingham", areaId: "area-2" },
];

/* Folds the old governance/fixture site names + legacy practice ids onto
 * canonical site ids. Keyed by both id form ("site-brighton") and a
 * normalised lowercase-hyphen form ("brighton", "brighton-dental-practice"). */
export const SITE_ALIASES = {
  "site-brighton": "site-southall",   brighton: "site-southall",   "brighton-dental-practice": "site-southall",
  "site-hove": "site-reading",        hove: "site-reading",        "hove-dental-practice": "site-reading",
  "site-worthing": "site-new-cross",  worthing: "site-new-cross",  "worthing-dental-practice": "site-new-cross",
  "site-crawley": "site-london",      crawley: "site-london",      "crawley-dental-practice": "site-london",
  "site-guildford": "site-manchester", guildford: "site-manchester", "guildford-dental-practice": "site-manchester",
  "site-portsmouth": "site-birmingham", portsmouth: "site-birmingham", "portsmouth-dental-practice": "site-birmingham",
  "practice-harley": "site-southall",
  "practice-camden": "site-london",
  "practice-area-1-2": "site-reading",
  "practice-area-1-3": "site-new-cross",
  "practice-area-2-2": "site-manchester",
  "practice-area-2-3": "site-birmingham",
};

const byId = Object.fromEntries(SITES.map((s) => [s.id, s]));
const byArea = Object.fromEntries(AREAS.map((a) => [a.id, a]));

/** Normalise any site reference (canonical id, legacy id, or display name)
 *  onto a canonical site id. Falls back to `fallback` (default Southall). */
export function resolveSiteId(raw, fallback = "site-southall") {
  if (!raw) return fallback;
  if (byId[raw]) return raw;
  const key = String(raw).toLowerCase().trim().replace(/\s+/g, "-");
  return SITE_ALIASES[raw] ?? SITE_ALIASES[key] ?? fallback;
}

export const getSite = (id) => byId[resolveSiteId(id)] ?? null;
export const siteName = (id) => byId[resolveSiteId(id)]?.name ?? "—";
export const siteArea = (id) => byId[resolveSiteId(id)]?.areaId ?? null;
export const areaName = (areaId) => byArea[areaId]?.name ?? "—";
export const sitesInArea = (areaId) => SITES.filter((s) => s.areaId === areaId);
