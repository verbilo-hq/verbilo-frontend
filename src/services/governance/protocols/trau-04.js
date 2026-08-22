/**
 * Trauma Management Clinical Protocol — TRAU-04
 * Crown Fracture & Crown-Root Fracture
 *
 * Provenance: drafted by Verbilo from IADT 2020 guidelines.
 */

import {
  TRAU_CLINICAL_INTENT, TRAU_LOCAL_SIGNOFF_NOTE, TRAU_MINIMUM_RECORD_SET,
  TRAU_VERSION_BASE, TRAU_REF,
} from "./trau-common";

export const TRAU_04 = {
  id: "doc-trau-04",
  reference: "TRAU-04",
  packKey: "clinical_governance",
  category: "Trauma Management",
  type: "sop",
  title: "Crown Fracture & Crown-Root Fracture",
  subtitle: "Enamel fracture, enamel-dentine fracture, complicated fractures with pulp exposure, crown-root fracture and restorative options.",

  clinicalIntent: TRAU_CLINICAL_INTENT,
  localSignOffNote: TRAU_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Permanent teeth with crown or crown-root fractures",
    frequency: "On urgent attendance; follow-up per IADT",
    lead:      "Treating dentist (specialist for crown-root)",
    evidence:  "Fracture classification, treatment, pulp management, follow-up",
  },

  standardLabel: "Crown-fracture standard",
  protocolStandard: "Crown fractures must be classified by depth of involvement. The clinician must protect the pulp and restore the tooth promptly. Crown-root fractures usually require specialist management because the fracture extends below the gingiva.",

  workflow: [
    { n: 1, title: "Classify the fracture",                 desc: "Enamel-only (uncomplicated, no dentine). Enamel-dentine (uncomplicated, no pulp). Complicated (pulp exposed). Crown-root (extending below CEJ, uncomplicated or complicated)." },
    { n: 2, title: "Locate the fragment if possible",       desc: "If a fragment is found and intact, it can be bonded back. If not located, consider chest X-ray for aspiration in patients with cough or respiratory symptoms." },
    { n: 3, title: "Treat appropriately by class",           desc: "Enamel-only: smooth or composite. Enamel-dentine: cover exposed dentine with glass-ionomer or composite. Complicated (pulp exposed): partial pulpotomy (preferred for immature roots) or direct pulp cap with hydraulic calcium-silicate cement and definitive seal." },
    { n: 4, title: "Manage crown-root fractures",            desc: "Often requires specialist input. Options include gingival/crown-lengthening surgery to expose the fracture, orthodontic extrusion, surgical repositioning or extraction with replacement." },
    { n: 5, title: "Schedule IADT follow-up",                 desc: "Clinical and radiographic review at 6–8 weeks, 6 months, 12 months and then yearly for at least 5 years. Monitor pulp vitality." },
  ],

  decisionTable: {
    title: "Crown-Fracture Management",
    columns: ["Class", "Recommended action"],
    rows: [
      ["Enamel-only",                                      "Smooth or composite restoration. Monitor."],
      ["Enamel-dentine (uncomplicated)",                    "Cover dentine with glass-ionomer/composite. Bond fragment if available. Monitor pulp."],
      ["Complicated (pulp exposed) — closed apex",         "Direct pulp cap with hydraulic calcium-silicate cement if within hours; otherwise partial pulpotomy. Definitive seal."],
      ["Complicated (pulp exposed) — open apex",           "Partial pulpotomy with hydraulic calcium-silicate cement (preferred to preserve vitality and allow root maturation). Specialist follow-up."],
      ["Crown-root fracture",                                "Specialist referral. Options: crown-lengthening, orthodontic extrusion, surgical repositioning, extraction."],
    ],
  },

  safetyBox: {
    title: "Refer if",
    items: [
      "Crown-root fracture extends significantly subgingivally.",
      "Open-apex tooth with complicated fracture — vital pulp therapy needs specialist follow-up.",
      "Tooth is not restorable to a predictable seal.",
      "Fragment is not located and aspiration is suspected — refer to A&E for chest imaging.",
      "Patient is medically compromised and follow-up is uncertain.",
    ],
  },

  minimumRecordSet: TRAU_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Fracture classification recorded.",
    "Fragment location documented.",
    "Pulp management recorded with material details.",
    "Definitive seal placed and verified.",
    "IADT follow-up schedule booked.",
  ],

  clinicalSources: [
    TRAU_REF.iadtTrauma,
    TRAU_REF.dentalTraumaGuide,
    TRAU_REF.localOMFS,
    TRAU_REF.mfrSplint,
  ],

  version: {
    ...TRAU_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IADT 2020 dental trauma guidelines on crown and crown-root fractures, Dental Trauma Guide chairside support and manufacturer hydraulic calcium-silicate cement instructions. Requires Clinical Director review and local approval before live adoption.",
  },
};
