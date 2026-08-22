/**
 * Practice branding — what appears on patient-facing print outputs:
 *   • PIL viewer header + footer
 *   • (future) consent forms, prescriptions, referral letters
 *
 * Data model
 * ──────────
 *   Rows live in TABLES.practice_branding, partitioned by tenantId.
 *
 *   • Group default      siteId === null  (singleton per tenant)
 *   • Per-site override  siteId === "site-…"
 *
 * Resolution: per-site override → group default → built-in fallback. A site
 * can leave any field blank to inherit the group value for that field only
 * (so a site can override the logo but keep the group name, for example).
 *
 * Logos are stored as data URLs in localStorage — same mechanism as the
 * existing client file store. Re-wire to S3 before pushing to dev/main.
 */

import { Store, TABLES, uuid } from "./store";
import { resolveSiteId } from "../sites";

/** System fallback when neither group nor site has set anything. */
const FALLBACK = {
  practiceName: "Your Dental Practice",
  logoDataUrl:  null,
  accentColor:  "#0d7280",
  address:      "",
  phone:        "",
};

function rowFor(tenantId, siteId) {
  return Store.list(tenantId, TABLES.practice_branding).find(
    (r) => (r.siteId ?? null) === (siteId ?? null),
  ) ?? null;
}

function emptyRow(tenantId, siteId) {
  return {
    id: uuid(),
    tenantId,
    siteId: siteId ?? null,
    practiceName: "",
    logoDataUrl:  null,
    accentColor:  "",
    address:      "",
    phone:        "",
  };
}

/** Group-wide default for the tenant. Returns null if not yet set. */
export function getGroupBranding(tenantId) {
  return rowFor(tenantId, null);
}

/** Per-site override (if any). Returns null when the site inherits the group default. */
export function getSiteBranding(tenantId, siteId) {
  return rowFor(tenantId, siteId);
}

/**
 * Resolved branding for a site — merge order is system → group → site.
 * Empty strings on a row count as "inherit"; explicit values win.
 */
export function effectiveBranding(tenantId, siteId) {
  const group = getGroupBranding(tenantId) ?? {};
  const site  = siteId ? (getSiteBranding(tenantId, siteId) ?? {}) : {};
  const merged = { ...FALLBACK };
  for (const key of Object.keys(FALLBACK)) {
    if (group[key] !== undefined && group[key] !== "" && group[key] !== null) merged[key] = group[key];
    if (site[key]  !== undefined && site[key]  !== "" && site[key]  !== null) merged[key] = site[key];
  }
  return merged;
}

/** Upsert helpers — siteId === null updates the group default. */
export function setBranding(user, siteId, patch) {
  const tenantId = user.tenantId;
  const existing = rowFor(tenantId, siteId);
  if (existing) return Store.update(tenantId, TABLES.practice_branding, existing.id, patch);
  return Store.insert(tenantId, TABLES.practice_branding, { ...emptyRow(tenantId, siteId), ...patch });
}

export function clearSiteBranding(user, siteId) {
  const existing = rowFor(user.tenantId, siteId);
  if (!existing) return null;
  Store.remove(user.tenantId, TABLES.practice_branding, existing.id);
  return null;
}

/** Convenience for the PIL viewer — accepts user + siteId and returns branding only. */
export function brandingFor(tenantId, siteId) {
  return effectiveBranding(tenantId, siteId);
}

/**
 * Seed sensible demo branding the first time the PIL tab loads for a tenant.
 * Idempotent — no-op once any row exists. Builds:
 *   • Group default → "Dental Group" (teal #006974)
 *   • Southall override → branded as the flagship site (deeper teal)
 *   • Reading override → branded with a different name + accent
 * Everything else inherits the group default. Bumping this writes nothing —
 * delete the rows manually if you want the seeder to repopulate.
 */
export function ensureDemoBranding(user) {
  if (!user?.tenantId) return;
  const existing = Store.list(user.tenantId, TABLES.practice_branding);
  if (existing.length > 0) return;
  // Group default
  Store.insert(user.tenantId, TABLES.practice_branding, {
    ...emptyRow(user.tenantId, null),
    practiceName: "Dental Group",
    accentColor:  "#006974",
    address:      "12 High Street, Southall UB1 3DA",
    phone:        "020 8574 0100",
  });
  // Southall — flagship, custom accent
  Store.insert(user.tenantId, TABLES.practice_branding, {
    ...emptyRow(user.tenantId, resolveSiteId("site-brighton")),
    practiceName: "Dental Group Southall",
    accentColor:  "#0d4d52",
    address:      "12 High Street, Southall UB1 3DA",
    phone:        "020 8574 0101",
  });
  // Reading — distinct brand within the group
  Store.insert(user.tenantId, TABLES.practice_branding, {
    ...emptyRow(user.tenantId, resolveSiteId("site-hove")),
    practiceName: "Reading Smile Studio",
    accentColor:  "#7a3e8a",
    address:      "44 Broad Street, Reading RG1 2BH",
    phone:        "0118 950 0102",
  });
}
