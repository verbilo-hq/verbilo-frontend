/**
 * Protocol meta helpers — tier derivation, lifecycle/status variation and
 * role-based visibility for the Clinical Protocols library.
 *
 * Wraps the protocols defined in `protocols/*.js` with a layered view model:
 *   tier        — "core" | "specialty" | "advanced" | "site_specific" | "archived"
 *   status      — "draft" | "in_review" | "published" | "review_due" | "expired" |
 *                 "archived" | "rejected"
 *   visibleTo   — role-based visibility predicate
 *
 * The 97 specialty protocols defined in their .js files do not carry a `tier`
 * field. Tier is derived from category here so we don't need to edit 97 files.
 * Lifecycle variation is intentionally limited and explicit (DEMO_STATUS_OVERRIDES)
 * so the demo demonstrates the full status filter UI without misrepresenting
 * which protocols are actually published.
 */

/* Categories that map to the "Advanced / Optional Services" tier — these are
 * services not every dental practice offers (CBCT, sedation, complex implant
 * surgery, whitening, special care) so the user only sees them where relevant. */
const ADVANCED_CATEGORIES = new Set([
  "Implants & Oral Surgery",
  "Whitening & Aesthetics",
  "Sedation",
  "Special Care",
]);

/* Categories shown under the "Specialty" tier — these are conventional dental
 * specialties every practice deals with. */
const SPECIALTY_CATEGORIES = new Set([
  "Periodontal",
  "Restorative",
  "Endodontics",
  "Prosthodontics",
  "Paediatric",
  "Oral Medicine",
  "Trauma Management",
  "TMD & Occlusion",
]);

/* Deterministic demo lifecycle overrides — explicit, not hash-based, so we
 * can defend each choice in audit / inspection: nothing is randomly archived
 * or marked draft without an editorial reason. Adjust as the editorial team
 * adds genuine new versions. */
export const DEMO_STATUS_OVERRIDES = {
  // Review-due examples — protocols past their annual review window
  "PERIO-09": "review_due",
  "ENDO-10":  "review_due",
  "RES-10":   "review_due",
  "OMED-08":  "review_due",

  // In-review examples — new versions submitted for Clinical Director approval
  "PAED-09":  "in_review",
  "TRAU-08":  "in_review",

  // Draft examples — work in progress, gov-only
  "IOS-10":   "draft",
  "WH-CP-04": "draft",

  // Archived examples — superseded, gov-only access
  "SED-06":   "archived",
  "TMD-06":   "archived",
};

/* Roles considered "governance" for visibility purposes — see drafts, in-review,
 * archived items. Everyone else sees only published / review-due / expired
 * protocols (the latter two are still visible so clinicians know what to do
 * with a protocol whose review date has lapsed). */
const GOVERNANCE_ROLES = new Set([
  "super_admin",
  "group_admin",
  "clinical_director",
  "governance_lead",
]);

/* Statuses that are restricted to governance users. */
const GOVERNANCE_ONLY_STATUSES = new Set([
  "draft",
  "in_review",
  "rejected",
  "archived",
]);

/* Tier display metadata. */
export const TIER_META = {
  core:           { label: "Core Clinical Protocols",  color: "#0d7280", desc: "Everyday clinical decision-making" },
  specialty:      { label: "Specialty Protocols",       color: "#4338ca", desc: "Specialty-specific clinical protocols" },
  advanced:       { label: "Advanced / Optional",       color: "#b45309", desc: "Service-specific (CBCT, sedation, whitening, special care)" },
  site_specific:  { label: "Site-Specific Protocols",   color: "#7c3aed", desc: "Local clinical pathways for specific practices" },
  archived:       { label: "Archived Protocols",         color: "#6b7280", desc: "Superseded — view-only, governance access" },
};

/* Status display metadata. */
export const STATUS_META = {
  draft:        { label: "Draft",        color: "#6b7280", governanceOnly: true },
  in_review:    { label: "In Review",    color: "#b45309", governanceOnly: true },
  approved:     { label: "Approved",     color: "#0d7280", governanceOnly: false },
  published:    { label: "Published",    color: "#256f2a", governanceOnly: false },
  review_due:   { label: "Review Due",   color: "#a83836", governanceOnly: false },
  expired:      { label: "Expired",      color: "#a83836", governanceOnly: false },
  archived:     { label: "Archived",     color: "#525b76", governanceOnly: true },
  rejected:     { label: "Rejected",     color: "#a83836", governanceOnly: true },
};

/* ─── Public helpers ─────────────────────────────────────────────────────── */

/** Return the effective status — explicit override wins over the protocol's
 *  own `version.status`. */
export function effectiveStatus(protocol) {
  const override = DEMO_STATUS_OVERRIDES[protocol.reference];
  return override ?? protocol.version?.status ?? "published";
}

/** Derive tier from the protocol's category, scope and effective status. */
export function getTier(protocol) {
  if (protocol.tier) return protocol.tier;
  const status = effectiveStatus(protocol);
  if (status === "archived") return "archived";
  if (protocol.scope === "site" && protocol.appliesToSiteId) return "site_specific";
  if (protocol.category === "Core") return "core";
  if (ADVANCED_CATEGORIES.has(protocol.category)) return "advanced";
  if (SPECIALTY_CATEGORIES.has(protocol.category)) return "specialty";
  return "specialty";
}

/** Role-based visibility — governance users see everything; clinicians and
 *  staff only see protocols whose effective status is non-restricted. */
export function canSeeProtocol(user, protocol) {
  const status = effectiveStatus(protocol);
  if (!GOVERNANCE_ONLY_STATUSES.has(status)) return true;
  return GOVERNANCE_ROLES.has(user?.role);
}

export function isGovernanceUser(user) {
  return GOVERNANCE_ROLES.has(user?.role);
}

/** Convenience — protocol's published display string. */
export function protocolApplicabilitySummary(protocol) {
  if (protocol.scope === "site" && protocol.appliesToSiteId) return `Site-specific (${protocol.appliesToSiteId})`;
  if (protocol.appliesToRoles?.length) return `Roles: ${protocol.appliesToRoles.join(", ")}`;
  if (protocol.appliesToServices?.length) return `Services: ${protocol.appliesToServices.join(", ")}`;
  return "All clinical staff, all sites";
}

/** Apply role-visibility + tier + status + free-text-search filter. */
export function filterProtocols(protocols, { user, tier, statuses, query } = {}) {
  const q = (query ?? "").trim().toLowerCase();
  return protocols.filter((p) => {
    if (user && !canSeeProtocol(user, p)) return false;
    if (tier && getTier(p) !== tier) return false;
    if (statuses?.length && !statuses.includes(effectiveStatus(p))) return false;
    if (q) {
      const haystack = [
        p.reference, p.title, p.subtitle, p.category,
        p.metaStrip?.appliesTo, p.metaStrip?.lead,
      ].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Counts of each tier (and overall) for the summary cards. */
export function tierCounts(protocols, user) {
  const visible = protocols.filter((p) => !user || canSeeProtocol(user, p));
  const out = { total: visible.length, core: 0, specialty: 0, advanced: 0, site_specific: 0, archived: 0 };
  for (const p of visible) out[getTier(p)]++;
  return out;
}

/** Counts of selected status states — used for review-due and gov-only cards. */
export function statusCounts(protocols, user) {
  const visible = protocols.filter((p) => !user || canSeeProtocol(user, p));
  const out = { published: 0, review_due: 0, draft: 0, in_review: 0, expired: 0, archived: 0, rejected: 0, approved: 0 };
  for (const p of visible) {
    const s = effectiveStatus(p);
    if (out[s] !== undefined) out[s]++;
  }
  out.draftOrInReview = (out.draft ?? 0) + (out.in_review ?? 0);
  return out;
}
