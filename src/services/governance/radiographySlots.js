/**
 * Radiography & IRMER — Step 4 → Step 8 slot-generation engine.
 *
 * Pure, side-effect-free helpers that translate a site's Step 4 profile flags
 * and Step 5 equipment register into the exact set of appendix rows that must
 * be generated on Step 8 (Site-Specific Appendices).
 *
 * Why per-asset (not per-flag) for radiography:
 *   IRR17 / IRMER local rules are written *per piece of radiation-emitting
 *   equipment* — a practice with two intraoral units needs two local-rules
 *   appendices (one per room / serial). Other packs (Decon, Med Emerg) stay
 *   per-flag because their SOPs apply once per site.
 *
 * The 4 statutorily mandatory IRR17/IRMER flags (local_rules, image_quality,
 * qa_records, maintenance_records) are silently kept `true` on every applied
 * profile — they're not user-toggleable but downstream activation still
 * reads them, so we keep the data shape consistent.
 */

import { EquipmentType } from "./types";

/* ─── Mandatory flags (hidden from UI, silently true) ──────────────────── */

/** Flag IDs that must be `true` on every applied radiography profile —
 *  statutorily required for any practice operating an X-ray set under IRR17. */
export const RADIOGRAPHY_MANDATORY_FLAG_IDS = [
  "controlledAreas",
  "localRulesRequired",
  "imageQualityAuditRequired",
  "qaRecordsRequired",
  "maintenanceRecordsRequired",
];

/** Returns a flag patch (subset of profile keys to set true) for any mandatory
 *  flags currently missing / falsy on the given profile. Returns null when the
 *  profile is already conformant — caller can skip the write. */
export function radiographyMandatoryFlagPatch(profile) {
  const patch = {};
  for (const id of RADIOGRAPHY_MANDATORY_FLAG_IDS) {
    if (!profile?.[id]) patch[id] = true;
  }
  return Object.keys(patch).length > 0 ? patch : null;
}

/* ─── Per-modality appendix specs ──────────────────────────────────────── */

/**
 * Each spec describes one *class* of per-asset appendix. The slot generator
 * walks specs and emits one slot per registered asset of matching type at
 * each site whose Step 4 flag is on.
 *
 *   flag           — Step 4 profile key that gates the modality
 *   equipmentType  — Step 5 equipment_records.type that counts as an asset
 *   titleSuffix    — "{Site name} — {titleSuffix}" gives the appendix title
 *   highRisk       — when true, the modality requires Step 10 verification
 *                    (CBCT cannot be in scope without a registered serial)
 *   modalityKey    — short stable id used for slot.key + telemetry
 */
export const MODALITY_APPENDIX_SPECS = [
  {
    modalityKey:   "intraoral",
    flag:          "intraoralXray",
    equipmentType: EquipmentType.intraoral_xray,
    titleSuffix:   "Intraoral Radiation Protection & Local Rules Appendix",
    highRisk:      false,
  },
  {
    modalityKey:   "opg",
    flag:          "opgXray",
    equipmentType: EquipmentType.opg_xray,
    titleSuffix:   "Panoramic Imaging (OPG) Local Rules Appendix",
    highRisk:      false,
  },
  {
    modalityKey:   "cbct",
    flag:          "cbctXray",
    equipmentType: EquipmentType.cbct_xray,
    titleSuffix:   "CBCT Advanced Imaging Protocol & 3D Local Rules Appendix",
    highRisk:      true,
  },
  {
    modalityKey:   "handheld",
    flag:          "handheldXray",
    equipmentType: EquipmentType.handheld_xray,
    titleSuffix:   "Handheld Unit Safe Operational Scope & Secure Storage Log",
    highRisk:      false,
  },
];

/* ─── Slot generation ──────────────────────────────────────────────────── */

/**
 * Compute the per-asset appendix slots required for ONE site.
 *
 * @param {object} siteProfile          The Step 4 profile row (flags + meta).
 * @param {Array}  equipmentForSite     Step 5 equipment_records for this site
 *                                      (already filtered to siteProfileId).
 * @returns {Array<{
 *   key: string,            // stable id: `${modalityKey}::${assetId}`
 *   modalityKey: string,    // intraoral | opg | cbct | handheld
 *   asset: object,          // the underlying equipment record
 *   titleSuffix: string,    // specialized appendix title suffix
 *   highRisk: boolean,      // CBCT only
 * }>}
 *
 * Returns `[]` when the site has no radiation-bound equipment enabled — the
 * caller should render the empty-state message and treat the slot count as 0
 * so Step 10 validation doesn't false-block.
 */
export function generateStep8Slots(siteProfile, equipmentForSite = []) {
  if (!siteProfile) return [];
  const slots = [];
  for (const spec of MODALITY_APPENDIX_SPECS) {
    if (!siteProfile[spec.flag]) continue;
    const assets = equipmentForSite.filter((e) => e.type === spec.equipmentType);
    for (const asset of assets) {
      slots.push({
        key:         `${spec.modalityKey}::${asset.id}`,
        modalityKey: spec.modalityKey,
        asset,
        titleSuffix: spec.titleSuffix,
        highRisk:    spec.highRisk,
      });
    }
  }
  return slots;
}

/**
 * Count slots without materialising them (cheaper for the rail badge).
 */
export function countStep8Slots(siteProfile, equipmentForSite = []) {
  return generateStep8Slots(siteProfile, equipmentForSite).length;
}

/* ─── CBCT high-risk gate (Step 10 hard block) ─────────────────────────── */

/**
 * Find applied profiles where the user toggled `cbctXray = true` in Step 4
 * but no CBCT asset is registered in Step 5. The Submit gate must block
 * approval until either the flag is cleared or a CBCT unit is added — IRMER
 * doesn't allow CBCT to be "in scope" without traceability to a real machine.
 *
 * @param {Array} appliedProfiles                  All step-3 applied profiles.
 * @param {Object<string, Array>} equipmentByProfileId  Keyed by siteProfileId.
 * @returns {Array<{ siteProfileId: string, siteId: string }>}
 */
export function findCbctRiskProfiles(appliedProfiles, equipmentByProfileId) {
  const out = [];
  for (const profile of appliedProfiles) {
    if (!profile.cbctXray) continue;
    const eq = equipmentByProfileId[profile.id] ?? [];
    const hasCbct = eq.some((e) => e.type === EquipmentType.cbct_xray);
    if (!hasCbct) out.push({ siteProfileId: profile.id, siteId: profile.siteId });
  }
  return out;
}
