/**
 * Paediatric Dentistry Clinical Protocol — PAED-01
 * Paediatric Assessment, Behaviour Management & Consent
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_01 = {
  id: "doc-paed-01",
  reference: "PAED-01",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "Paediatric Assessment, Behaviour Management & Consent",
  subtitle: "Age-appropriate examination, parental/guardian consent, Gillick competence, behaviour guidance and family-centred communication.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All children attending the practice for examination or treatment",
    frequency: "At new patient registration, recall and before any treatment",
    lead:      "Dentist (with trained nurse and child-friendly team)",
    evidence:  "Assessment record, consent route, behaviour-management approach and recall plan",
  },

  standardLabel: "Paediatric-assessment standard",
  protocolStandard: "Children must be assessed in an age-appropriate, family-centred way. Consent must come from someone with parental responsibility, and from the child themselves where they are competent to consent (Gillick). Behaviour management must use evidence-based, non-pharmacological approaches first.",

  workflow: [
    { n: 1, title: "Welcome the family and orient the child", desc: "Use age-appropriate language. Allow the child to explore the surgery. Explain what will happen with tell-show-do. Avoid jargon and medical terms that frighten." },
    { n: 2, title: "Take a structured history",                 desc: "Update medical history, medicines, allergies, developmental notes, diet, oral hygiene, fluoride exposure and previous dental experience. Ask about any safeguarding concerns sensitively." },
    { n: 3, title: "Examine appropriately for age",              desc: "Soft-tissue examination, charting of primary/mixed/permanent dentition, caries risk, occlusion development, oral habits. Use age-appropriate radiographs only where clinically justified." },
    { n: 4, title: "Confirm consent route",                       desc: "Identify person with parental responsibility. Assess Gillick competence where age and decision warrant. Record who consented and how the child's views were considered." },
    { n: 5, title: "Plan prevention-first care and recall",       desc: "Agree caries-risk-based recall, prevention plan and any treatment needs. Use written information for parent/guardian where helpful. Record the agreed plan." },
  ],

  safetyBox: {
    title: "Do not proceed with treatment if",
    items: [
      "Consent has not been obtained from a person with parental responsibility (or a Gillick-competent child).",
      "The child is acutely distressed and non-pharmacological behaviour management has not been attempted.",
      "Safeguarding concerns are present that require escalation before continuing.",
      "Treatment complexity, anxiety or behaviour requires sedation/GA referral.",
      "The accompanying adult cannot demonstrate parental responsibility and the situation is non-urgent.",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Person with parental responsibility identified and recorded.",
    "Gillick assessment recorded where applicable.",
    "Behaviour-management approach used recorded.",
    "Recall interval matched to caries risk per NICE CG19.",
    "Safeguarding considerations addressed at every visit.",
  ],

  clinicalSources: [
    PAED_REF.bspdGuidelines,
    PAED_REF.gdcConsent,
    PAED_REF.gillick,
    PAED_REF.childrenAct,
    PAED_REF.niceCG19,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSPD UK national clinical guidelines, GDC Standards on consent, Gillick competence framework, Children Act and NICE CG19. Requires Clinical Director review and local approval before live adoption.",
  },
};
