/**
 * Endodontic Clinical Protocol — ENDO-07
 * Canal Preparation, Irrigation & Medicaments
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-07, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_07 = {
  id: "doc-endo-07",
  reference: "ENDO-07",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Canal Preparation, Irrigation & Medicaments",
  subtitle: "Mechanical preparation, irrigant selection, sodium hypochlorite safety, EDTA use, intracanal medicaments, and inter-visit dressing.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Cleaning and shaping stages of RCT and retreatment",
    frequency: "During each preparation or disinfection visit",
    lead:      "Dentist",
    evidence:  "Preparation sizes, irrigants, medicaments and temporary seal recorded",
  },

  standardLabel: "Disinfection standard",
  protocolStandard: "Canal preparation should create a shape that allows effective irrigation, disinfection and obturation while respecting anatomy. Irrigants must be used safely to minimise the risk of extrusion, chemical injury or contamination.",

  workflow: [
    { n: 1, title: "Confirm working length first",      desc: "Do not proceed with shaping beyond an uncertain working length. Recheck working length when anatomy, symptoms or instrument behaviour suggests change." },
    { n: 2, title: "Create a reproducible glide path",  desc: "Use hand or rotary instruments within the clinician's competence and according to manufacturer guidance. Avoid forcing instruments." },
    { n: 3, title: "Irrigate safely throughout",         desc: "Use practice-approved irrigants and delivery systems. Keep the needle loose in the canal, avoid wedging and avoid positive-pressure extrusion." },
    { n: 4, title: "Use adjuncts where indicated",       desc: "Use EDTA, activation methods or intracanal medicaments only where clinically indicated, trained for and compatible with the planned treatment." },
    { n: 5, title: "Seal securely between visits",       desc: "If treatment is staged, place an appropriate medicament where indicated and a robust temporary restoration to prevent contamination." },
  ],

  safetyBox: {
    title: "Irrigant and instrument safety",
    items: [
      "Never force irrigant into a canal or bind the irrigation needle at working length.",
      "Use eye protection, rubber dam and high-volume suction during irrigation.",
      "Stop if there is sudden severe pain, swelling, bleeding, chemical taste or suspected irrigant accident.",
      "Record and escalate separated instruments, perforation, ledging or irrigant incidents immediately.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Final preparation size/taper or method recorded.",
    "Irrigants and medicaments used recorded.",
    "Any instrument separation or procedural event recorded.",
    "Temporary restoration and seal quality recorded.",
    "Post-operative advice and next visit plan recorded.",
  ],

  clinicalSources: [
    ENDO_REF.besGoodPractice,
    ENDO_REF.localCoshh,
    ENDO_REF.mfrInstructions,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to BES Guide to Good Endodontic Practice and the practice's COSHH and sodium hypochlorite safety procedures.",
  },
};
