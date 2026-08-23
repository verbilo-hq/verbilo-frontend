/**
 * Restorative / Operative Clinical Protocol — RES-07
 * Pulp Protection & Vital Pulp Therapy
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_07 = {
  id: "doc-res-07",
  reference: "RES-07",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Pulp Protection & Vital Pulp Therapy",
  subtitle: "Selective excavation, indirect and direct pulp capping, partial and full pulpotomy, material selection and post-treatment monitoring.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Teeth with deep caries, traumatic exposure or carious pulp involvement where vitality may be preserved",
    frequency: "At the deep-caries / exposure visit and at follow-up review",
    lead:      "Dentist (specialist referral where indicated)",
    evidence:  "Pre-op vitality, caries-removal technique, capping material and review",
  },

  standardLabel: "Pulp-protection standard",
  protocolStandard: "Where pulp vitality can reasonably be preserved, the clinician should prefer selective caries excavation and vital pulp therapy over pulpectomy. Decisions must be based on pre-operative vitality, bleeding behaviour on exposure, restorability and the patient's preference, and must be reviewed.",

  workflow: [
    { n: 1, title: "Establish baseline pulpal status",        desc: "Record symptoms, sensibility tests (cold, electric pulp test as appropriate), tenderness to percussion and radiographic findings. Confirm a normal or reversibly inflamed pulp before vital therapy." },
    { n: 2, title: "Use selective caries removal",             desc: "Remove peripheral caries to sound dentine; over the pulp wall remove only enough to leave firm or leathery dentine when full removal would expose the pulp." },
    { n: 3, title: "Choose the appropriate vital pulp therapy", desc: "Indirect pulp cap for non-exposed deep caries; direct pulp cap for small traumatic or pin-point carious exposure with controlled bleeding; partial or full pulpotomy where exposure is larger but the radicular pulp appears vital." },
    { n: 4, title: "Place a biocompatible capping material",   desc: "Use a hydraulic calcium-silicate cement (e.g. MTA or equivalent) per manufacturer instructions. Avoid contamination. Seal with a high-quality definitive restoration." },
    { n: 5, title: "Review and re-assess",                      desc: "Review at 6–12 weeks and again at 12 months: symptoms, vitality, radiographic apical status. Plan endodontic treatment if signs of irreversible pulpitis or apical pathology develop." },
  ],

  decisionTable: {
    title: "Vital-Pulp-Therapy Decision Guide",
    columns: ["Finding", "Recommended approach"],
    rows: [
      ["Deep caries, no exposure, reversibly inflamed pulp",         "Selective caries removal + indirect pulp cap + definitive coronal seal."],
      ["Small carious or traumatic exposure, controlled bleeding",   "Direct pulp cap with hydraulic calcium-silicate cement + definitive seal."],
      ["Larger exposure, radicular pulp appears vital",              "Partial or full pulpotomy with hydraulic calcium-silicate cement + definitive seal."],
      ["Signs of irreversible pulpitis or non-vital pulp",            "Endodontic treatment per ENDO pack or specialist referral; vital pulp therapy not indicated."],
      ["Tooth restorability or strategic value doubtful",             "Discuss extraction and replacement options before extensive treatment."],
    ],
  },

  safetyBox: {
    title: "Do not attempt vital pulp therapy if",
    items: [
      "There are pre-operative signs of irreversible pulpitis or pulpal necrosis.",
      "Haemostasis cannot be achieved within a reasonable time on exposure.",
      "Apical radiolucency or sinus tract is present.",
      "The tooth is not restorable to a predictable definitive coronal seal.",
      "The patient cannot return for the required reviews.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Pre-operative pulpal status and tests recorded.",
    "Caries-removal technique and any exposure detail recorded.",
    "Capping material, batch and definitive restoration recorded.",
    "Review at 6–12 weeks and at 12 months documented.",
    "Endodontic plan if vital pulp therapy fails.",
  ],

  clinicalSources: [
    RES_REF.fgdpOperative,
    RES_REF.sdcepCaries,
    RES_REF.mfrInstructions,
    RES_REF.gdcConsentRecords,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent operative dentistry guide, SDCEP caries guidance, manufacturer hydraulic calcium-silicate cement instructions, and GDC Standards on records. Requires Clinical Director review and local approval before live adoption.",
  },
};
