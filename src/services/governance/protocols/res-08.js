/**
 * Restorative / Operative Clinical Protocol — RES-08
 * Cracked Tooth, Deep Caries & Restorability
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_08 = {
  id: "doc-res-08",
  reference: "RES-08",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Cracked Tooth, Deep Caries & Restorability",
  subtitle: "Diagnosis of cracks and deep caries, restorability assessment, cuspal coverage decisions and the extraction-versus-saving threshold.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Teeth with cracks, deep caries or doubtful restorability",
    frequency: "At assessment, on emergency presentation and before any restorative intervention",
    lead:      "Dentist",
    evidence:  "Findings, restorability decision, options discussed and any referral",
  },

  standardLabel: "Restorability standard",
  protocolStandard: "Cracked teeth and deep carious lesions must be assessed for restorability before restoration. The clinician must consider remaining tooth tissue, ferrule, periodontal support, occlusal load, endodontic status and strategic value, and discuss extraction and replacement as a reasonable alternative.",

  workflow: [
    { n: 1, title: "Take a structured pain and crack history", desc: "Record cold sensitivity, bite-pain on release, sharp pain on specific cusps and triggers. Differentiate from reversible pulpitis, fractured restoration or root fracture." },
    { n: 2, title: "Perform crack-specific tests",              desc: "Use bite tests, transillumination, methylene blue where indicated and selective removal of restorations to inspect floor and walls. Document where the crack tracks." },
    { n: 3, title: "Assess restorability",                       desc: "Evaluate remaining tooth tissue, ferrule (≥1.5–2 mm circumferential), periodontal support, mobility, root anatomy, endodontic and prosthetic prognosis." },
    { n: 4, title: "Decide between cuspal coverage, extraction or referral", desc: "If restorable, plan cuspal coverage (onlay/crown) and stabilise occlusion. If not, discuss extraction with replacement options. Refer where complexity exceeds local competence." },
    { n: 5, title: "Consent the agreed plan",                    desc: "Record diagnosis, restorability decision, options, costs, prognosis and the agreed plan. Document if the patient declines the recommended approach." },
  ],

  decisionTable: {
    title: "Crack & Deep-Caries Decision Guide",
    columns: ["Finding", "Recommended action"],
    rows: [
      ["Superficial enamel craze with no symptoms",                "Monitor; reinforce risk-factor control; no operative intervention."],
      ["Cracked-tooth syndrome, vital pulp, restorable tooth",     "Cuspal coverage restoration (onlay or crown). Consider stabilising band before definitive work."],
      ["Crack extending to pulp / signs of irreversible pulpitis",  "Endodontic assessment per ENDO pack; reassess restorability before completing RCT."],
      ["Suspected vertical root fracture",                          "Extraction is usually the indicated outcome — discuss replacement options."],
      ["Deep caries close to pulp on radiograph",                    "Selective excavation + vital pulp therapy (RES-07) or endodontic treatment depending on pulpal status."],
      ["Tooth unrestorable, no ferrule, poor strategic value",       "Extraction and replacement discussion (denture, bridge, implant)."],
    ],
  },

  safetyBox: {
    title: "Refer or extract — do not restore — if",
    items: [
      "Vertical root fracture is suspected or confirmed.",
      "There is no realistic ferrule and definitive restoration is not feasible.",
      "Periodontal support is inadequate for the planned restoration.",
      "Pulpal pathology is present and the tooth is not strategically worth saving.",
      "Repeated previous restorations have failed and the underlying problem has not been addressed.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Pain and crack history recorded structurally, not as 'pain'.",
    "Crack-specific tests recorded with findings.",
    "Restorability decision and reasoning documented.",
    "Options including extraction/referral recorded.",
    "Consent recorded for the chosen approach.",
  ],

  clinicalSources: [
    RES_REF.fgdpOperative,
    RES_REF.fgdpStandards,
    RES_REF.bspPerio,
    RES_REF.localReferral,
    RES_REF.gdcCompetence,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent operative dentistry guide, BSP guidance on perio-restorative interface, local referral criteria and GDC Standards on competence. Requires Clinical Director review and local approval before live adoption.",
  },
};
