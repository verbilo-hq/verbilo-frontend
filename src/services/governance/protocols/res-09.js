/**
 * Restorative / Operative Clinical Protocol — RES-09
 * Restoration Repair, Replacement & Failure
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_09 = {
  id: "doc-res-09",
  reference: "RES-09",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Restoration Repair, Replacement & Failure",
  subtitle: "When to repair, when to replace, marginal repair technique, failed-restoration assessment and audit-grade documentation.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Existing restorations under assessment, monitoring or intervention",
    frequency: "At recall and on emergency presentation with a failed restoration",
    lead:      "Dentist",
    evidence:  "Reason for intervention, repair or replacement decision and prognosis",
  },

  standardLabel: "Replacement standard",
  protocolStandard: "Existing restorations should be repaired in preference to replacement where the bulk of the restoration is sound and the failure is localised. Replacement must be justified by a specific failure mode rather than 'old' or 'big' restorations alone.",

  workflow: [
    { n: 1, title: "Assess the failed or ageing restoration",   desc: "Record marginal integrity, recurrent caries, fractures, surface wear, contour, contact tightness, occlusion, sensitivity and pulpal status." },
    { n: 2, title: "Choose repair, refurbish or replace",        desc: "Use repair where caries or defect is localised and the rest of the restoration is sound. Refurbish (polish and reseal) where only surface or marginal staining is present. Replace where a defined failure mode requires it." },
    { n: 3, title: "Plan minimally invasive intervention",       desc: "Avoid unnecessary tissue loss when refurbishing or repairing. Use selective excavation if recurrent caries exists. Re-isolate and bond per material instructions." },
    { n: 4, title: "Verify outcome",                              desc: "Confirm marginal seal, contact, occlusion in MIP and excursions. Provide post-op advice and review where prognosis is guarded." },
    { n: 5, title: "Record the failure mode",                     desc: "Document the specific reason for intervention (e.g. recurrent caries, marginal breakdown, cuspal fracture) — supports audit, restorative quality monitoring and clinician learning." },
  ],

  safetyBox: {
    title: "Reconsider replacement if",
    items: [
      "The defect is localised and the rest of the restoration is sound — repair is usually preferable.",
      "There is no current symptom and the patient prefers to monitor a small marginal stain.",
      "Replacement risks pulpal exposure or weakens cuspal integrity to a critical degree.",
      "Restorability of the tooth is doubtful after removal of the existing restoration.",
      "The cause of failure has not been addressed (caries risk, parafunction, occlusion) and will recur.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Specific failure mode recorded for every replacement.",
    "Repair-versus-replace decision rationale documented.",
    "Post-operative occlusion and seal verified and recorded.",
    "Cause of failure addressed (risk, parafunction, occlusion).",
    "Outcome reviewed where prognosis is guarded.",
  ],

  clinicalSources: [
    RES_REF.fgdpOperative,
    RES_REF.fgdpStandards,
    RES_REF.gdcOpenness,
    RES_REF.mfrInstructions,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent operative dentistry guidance and standards, manufacturer repair instructions and GDC Standards on openness. Requires Clinical Director review and local approval before live adoption.",
  },
};
