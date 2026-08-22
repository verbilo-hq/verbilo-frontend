/**
 * Endodontic Clinical Protocol — ENDO-02
 * Case Selection, Restorability & Treatment Planning
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-02, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_02 = {
  id: "doc-endo-02",
  reference: "ENDO-02",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Case Selection, Restorability & Treatment Planning",
  subtitle: "Tooth restorability, periodontal status, strategic value, complexity assessment, alternatives, prognosis, and referral thresholds.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All planned primary RCT and retreatment cases",
    frequency: "Before booking or starting treatment",
    lead:      "Dentist",
    evidence:  "Restorability assessment, complexity grading and options discussed",
  },

  standardLabel: "Planning standard",
  protocolStandard: "Root canal treatment should only be offered where the tooth is restorable, periodontally appropriate, strategically valuable and capable of being isolated. The clinician must consider case complexity, prognosis, patient factors and whether referral is safer than treatment in general practice.",

  workflow: [
    { n: 1, title: "Assess restorability first",      desc: "Check remaining tooth tissue, caries extent, cracks, ferrule potential, margins, periodontal support, occlusal load and whether a predictable coronal seal can be achieved." },
    { n: 2, title: "Assess isolation",                 desc: "Confirm whether rubber dam isolation is practical. If isolation cannot be achieved, reconsider restorability, pre-endodontic build-up, referral or extraction options." },
    { n: 3, title: "Assess endodontic complexity",     desc: "Review root length, curvature, canal visibility, previous RCT, posts, separated instruments, perforation, resorption, open apices and limited mouth opening." },
    { n: 4, title: "Match the case to operator skill", desc: "Only accept cases within the clinician's competence and available equipment. Complex anatomy, retreatment and strategic teeth may require referral." },
    { n: 5, title: "Agree the overall treatment plan", desc: "Discuss RCT, extraction, monitoring, referral and restorative options. Plan the definitive restoration before starting RCT." },
  ],

  safetyBox: {
    title: "Do not proceed without reassessing if",
    items: [
      "The tooth cannot be predictably isolated with rubber dam.",
      "There is a suspected vertical root fracture or unrestorable crack.",
      "The final restoration is unaffordable, unsuitable or not accepted by the patient.",
      "The canal anatomy, retreatment difficulty or medical factors exceed the treating clinician's competence.",
      "The tooth has a poor strategic value and extraction may be the more reasonable option.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Restorability and periodontal status documented.",
    "Endodontic complexity and referral decision documented.",
    "Treatment alternatives and no-treatment option documented.",
    "Definitive restoration plan documented before RCT starts.",
    "Estimated visits, costs and prognosis documented.",
  ],

  clinicalSources: [
    ENDO_REF.besGoodPractice,
    ENDO_REF.localReferral,
    ENDO_REF.gdcCompetence,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to BES Guide to Good Endodontic Practice and GDC Standards on working within competence.",
  },
};
