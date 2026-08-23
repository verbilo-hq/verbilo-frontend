/**
 * Endodontic Clinical Protocol — ENDO-08
 * Obturation, Coronal Seal & Definitive Restoration
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-08, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_08 = {
  id: "doc-endo-08",
  reference: "ENDO-08",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Obturation, Coronal Seal & Definitive Restoration",
  subtitle: "Master cone fit, obturation technique, radiographic verification, temporary seal, definitive restoration, crown/onlay planning, and review.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Completion of primary RCT and retreatment",
    frequency: "At obturation and restoration planning visits",
    lead:      "Dentist",
    evidence:  "Canal fill, post-op radiograph, coronal seal and restoration plan recorded",
  },

  standardLabel: "Completion standard",
  protocolStandard: "Root canal treatment is not complete until canals are adequately obturated and the tooth has a durable coronal seal. The final restoration plan must be made clear to the patient and recorded, especially where cuspal coverage is advised.",

  workflow: [
    { n: 1, title: "Confirm readiness to obturate",     desc: "Proceed when symptoms, canal conditions and disinfection status are appropriate. Reassess if the canal remains persistently wet, purulent or symptomatic." },
    { n: 2, title: "Verify cone fit and length",         desc: "Check master cone fit, tug-back where relevant and length control using radiographic verification when indicated." },
    { n: 3, title: "Obturate using a controlled technique", desc: "Use an obturation method within the clinician's competence and according to material instructions. Avoid overfilling, voids and missed canals." },
    { n: 4, title: "Take and report the completion image", desc: "Record a justified completion radiograph or image review, clinical evaluation and any limitations of the root filling." },
    { n: 5, title: "Protect the tooth promptly",         desc: "Place a high-quality temporary or definitive coronal seal and book definitive restoration without avoidable delay." },
  ],

  safetyBox: {
    title: "Review before completing treatment if",
    items: [
      "There is persistent discharge, uncontrolled pain, swelling or unresolved sinus tract.",
      "Working length or canal anatomy remains uncertain.",
      "The master cone does not fit or length control is unreliable.",
      "The tooth is at high fracture risk and the patient declines the recommended definitive restoration.",
      "The coronal seal is compromised before the final restoration is placed.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Obturation material and technique recorded.",
    "Final working lengths and canal completion recorded.",
    "Completion radiograph/evaluation recorded.",
    "Temporary or definitive restoration recorded.",
    "Cuspal coverage, crown/onlay or review plan recorded.",
  ],

  clinicalSources: [
    ENDO_REF.besGoodPractice,
    ENDO_REF.localRestorative,
    ENDO_REF.localRadiographyP,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to BES Guide to Good Endodontic Practice and the practice's local restorative and radiography protocols.",
  },
};
