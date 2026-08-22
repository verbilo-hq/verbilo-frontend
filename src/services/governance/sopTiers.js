/**
 * SOP Tier classifier — maps every master template into one of three tiers
 * that drive activation behaviour:
 *
 *   • statutory   — locked-on. Always activates regardless of overrides.
 *                   These are SOPs a UK dental practice cannot legally skip
 *                   (IRR17, IRMER, COSHH, RIDDOR, Safeguarding, MCA, IPS).
 *                   UI must render the row read-only with a small lock icon.
 *
 *   • recommended — default-on. Activates automatically but can be skipped
 *                   *with a reason*. The most common case. The platform's
 *                   "inspection-ready by default" promise relies on the
 *                   recommended set being adopted unless explicitly opted out.
 *
 *   • optional    — default-off. Only activates when the user explicitly
 *                   opts in. Sits collapsed at the bottom of Step 7. Use
 *                   for SOPs that genuinely don't apply to every practice
 *                   (sedation, domiciliary, mock drills).
 *
 * Classification today is a heuristic over title / requiredFlag. The
 * Master Template Library admin UI can override per-template later by
 * setting an explicit `tier` field on the master row (heuristic only runs
 * when `master.tier` is unset).
 *
 * Why a heuristic now instead of hand-tagging all 95 SOPs:
 *   • Lets us ship Pattern C without blocking on content review
 *   • The list of always-statutory phrases is short and well-defined
 *   • Any miscategorisation defaults to "recommended" — safest
 *     compliance posture (auto-activates) while content is reviewed
 */

export const SopTier = Object.freeze({
  statutory:   "statutory",
  recommended: "recommended",
  optional:    "optional",
});

/* ─── Heuristic rule sets ───────────────────────────────────────────────
 * Order matters: each list is checked top-to-bottom. The first match wins.
 * Title comparison is case-insensitive, substring-based. */

/* Statutory — universally mandatory for any operating UK dental practice.
 * Anything matching these phrases is locked-on regardless of pack flags. */
const STATUTORY_TITLE_PATTERNS = [
  // IPC / Decontamination core (HTM 01-05 mandatory)
  "instrument decontamination",
  "instrument journey",
  "hand hygiene",
  "ppe sop",
  "personal protective equipment",
  "environmental cleaning",
  "sharps management",
  "sharps injury",
  "blood / body fluid",
  "blood/body fluid",
  "clinical waste",
  // Radiography statutory (IRR17 / IRMER)
  "local rules",
  "ir(me)r employer",
  "irmer employer",
  "operator entitlement",
  "controlled area",
  "rpa",
  "mpe",
  "radiation governance",
  "radiation risk assessment",
  "radiography incident",
  "saue reporting",
  // Medical emergencies — Resus Council baseline
  "medical emergency response",
  "medical emergency readiness",
  "emergency drugs check",
  "oxygen check",
  "aed check",
  // Safeguarding statutory
  "dbs",
  "disclosure & barring",
  "safeguarding lead",
  // Complaints / DoC statutory (NHS Complaints Regulations / DoC)
  "complaint handling",
  "complaint acknowledgement",
  "complaint investigation",
  "duty of candour",
  "incident reporting",
  "significant event analysis",
  "riddor",
  // Practice operations — CD safe is statutory if held
  "controlled drugs",
];

/* Optional — opt-in only. Practices without these workflows shouldn't see
 * the SOPs cluttering their wizard. */
const OPTIONAL_TITLE_PATTERNS = [
  "mock drill",
  "scenario drill",
  "domiciliary",
  "off-site care",
  "sedation",
  "amalgam waste",      // only practices still using amalgam need this
  "looked-after children",
];

/* Requirements that flip a SOP to statutory regardless of title.
 * If a master template carries one of these `requiredFlag`s AND that
 * flag is on at any applied site, the SOP becomes statutory at that site
 * (the practice has self-declared it does that procedure → law applies). */
const STATUTORY_FLAGS = new Set([
  "controlledAreas",            // IRR17 — once you have controlled areas, you need controlled-area SOP
  "localRulesRequired",         // IRR17
  "imageQualityAuditRequired",  // IRMER QA
  "qaRecordsRequired",          // IRMER QA
  "maintenanceRecordsRequired", // IRR17 maintenance
  "controlledDrugs",            // MDA 1971 / Regs 2001
]);

/* ─── Public API ───────────────────────────────────────────────────────── */

/**
 * Resolve the tier for a master template.
 *
 *   1. If `master.tier` is explicitly set (admin override) → use it
 *   2. If `requiredFlag` is in STATUTORY_FLAGS set → statutory
 *   3. If title matches any STATUTORY_TITLE_PATTERN → statutory
 *   4. If title matches any OPTIONAL_TITLE_PATTERN → optional
 *   5. Otherwise → recommended (safest default)
 */
export function tierFor(master) {
  if (!master) return SopTier.recommended;
  if (master.tier && Object.values(SopTier).includes(master.tier)) {
    return master.tier;
  }
  if (master.requiredFlag && STATUTORY_FLAGS.has(master.requiredFlag)) {
    return SopTier.statutory;
  }
  const titleLower = (master.title ?? "").toLowerCase();
  for (const pattern of STATUTORY_TITLE_PATTERNS) {
    if (titleLower.includes(pattern)) return SopTier.statutory;
  }
  for (const pattern of OPTIONAL_TITLE_PATTERNS) {
    if (titleLower.includes(pattern)) return SopTier.optional;
  }
  return SopTier.recommended;
}

/** Human-readable label + helper meta for UI badges / sections. */
export const SOP_TIER_META = {
  [SopTier.statutory]: {
    label:    "Statutory",
    plural:   "Statutory (always on)",
    color:    "#c62828",   // mandatory-red — matches the existing required field asterisk
    icon:     "lock",
    helpText: "Universally mandatory under UK regulation — these always activate and cannot be skipped.",
    order:    0,
  },
  [SopTier.recommended]: {
    label:    "Recommended",
    plural:   "Recommended (default on)",
    color:    "#1565c0",   // platform primary-blue
    icon:     "check",
    helpText: "Activates by default. Skip with a reason if you use a bespoke version or the procedure doesn't apply.",
    order:    1,
  },
  [SopTier.optional]: {
    label:    "Optional",
    plural:   "Optional (default off)",
    color:    "#6a1b9a",   // accent purple — visually distinct from default-on
    icon:     "plus",
    helpText: "Inactive by default. Activate if your practice runs these services / workflows.",
    order:    2,
  },
};

/**
 * Re-evaluation candidates — masters the user previously skipped that
 * have become applicable again because a flag was flipped on at Step 4
 * after the skip decision was made.
 *
 * A row qualifies when ALL of:
 *   • requiredFlag is set on the master
 *   • that flag is currently ON at some applied site (flagGated = false)
 *   • the master is NOT currently active in the tenant register
 *   • the user has an explicit 'skip' override on it
 *
 * The banner this drives lets the user either:
 *   • Activate     — clears the skip override, re-activates the SOP
 *   • Keep skipped — refreshes the confirmedAt timestamp on the existing
 *                    skip-reason so the audit trail shows the user
 *                    re-confirmed the decision under the new flag context
 *                    (defensible for CQC)
 *
 * Pure function — caller passes the already-computed `rows` from Step 7
 * to keep the data shape consistent.
 *
 *   rows[] shape: { master, tier, flagGated, override, doc, isLive }
 */
export function findReEvaluationCandidates(rows, skipReasons = {}) {
  return rows.filter((r) => {
    if (!r.master.requiredFlag) return false;
    if (r.flagGated)             return false;
    if (r.isLive)                return false;
    if (r.override !== "skip")   return false;
    // Once the user has explicitly re-confirmed this skip under the new
    // flag context (via "Keep skipped" → confirmSopSkipAfterReEvaluation),
    // hide it from the banner. The audit-trail entry captured the
    // decision; nagging them on every render is bad UX. The override
    // itself stays as 'skip' so the SOP remains skipped — only the
    // re-evaluation prompt dismisses.
    const meta = skipReasons[r.master.id];
    if (meta?.confirmedAt) return false;
    return true;
  });
}

/**
 * Decide whether a master template should activate given the pack's
 * selection overrides. Pure function — no localStorage reads.
 *
 *   overrides shape: { [masterTemplateId]: 'skip' | 'opt-in' }
 *
 *   • statutory:   ALWAYS active. Overrides on statutory SOPs are ignored
 *                  (with a console warning) — UI must prevent this anyway.
 *   • recommended: active UNLESS explicitly skipped.
 *   • optional:    inactive UNLESS explicitly opted-in.
 */
export function shouldActivate(master, overrides = {}) {
  const tier = tierFor(master);
  const override = overrides[master.id] ?? null;

  if (tier === SopTier.statutory) {
    if (override === "skip") {
      // eslint-disable-next-line no-console
      console.warn(`[sopTiers] Ignored 'skip' override on statutory master ${master.id} (${master.title}) — statutory SOPs cannot be skipped.`);
    }
    return true;
  }

  if (tier === SopTier.recommended) {
    return override !== "skip";
  }

  // optional
  return override === "opt-in";
}
