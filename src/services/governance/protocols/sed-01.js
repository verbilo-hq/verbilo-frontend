/**
 * Sedation Clinical Protocol — SED-01
 * Sedation Assessment & Suitability
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (IACSD 2020).
 */

import {
  SED_CLINICAL_INTENT, SED_LOCAL_SIGNOFF_NOTE, SED_MINIMUM_RECORD_SET,
  SED_VERSION_BASE, SED_REF,
} from "./sed-common";

export const SED_01 = {
  id: "doc-sed-01",
  reference: "SED-01",
  packKey: "clinical_governance",
  category: "Sedation",
  type: "sop",
  title: "Sedation Assessment & Suitability",
  subtitle: "ASA grading, medical and psychosocial screening, technique selection (inhalation vs IV), referral threshold and contraindications.",

  clinicalIntent: SED_CLINICAL_INTENT,
  localSignOffNote: SED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients being assessed for dental conscious sedation",
    frequency: "Before sedation is prescribed and on the day of treatment",
    lead:      "Sedationist (dentist with appropriate training per IACSD 2020)",
    evidence:  "ASA grade, screening checklist, technique decision and onward referral if needed",
  },

  standardLabel: "Sedation-suitability standard",
  protocolStandard: "Conscious sedation must be offered only after a documented assessment confirming the patient's medical suitability (ASA I–II as standard), the suitability of the technique (inhalation, oral, IV) and the practice's capability to deliver and recover the patient safely.",

  workflow: [
    { n: 1, title: "Confirm sedation is the right option", desc: "Assess anxiety, treatment need, alternatives (behaviour management, GA referral, refer to specialist sedation service). Discuss with the patient and document why sedation is being offered." },
    { n: 2, title: "Grade ASA status",                       desc: "Use ASA classification (I–IV). Patients with ASA III/IV require specialist sedation service input, not general practice sedation." },
    { n: 3, title: "Screen for contraindications",            desc: "Medical conditions (severe respiratory, cardiac, neurological), medications (CNS depressants, anticoagulants), pregnancy, paediatric considerations, psychosocial (capacity, escort availability, language)." },
    { n: 4, title: "Choose the technique",                    desc: "Inhalation (nitrous oxide/oxygen) — preferred for mild-moderate anxiety, paediatric. IV midazolam — for adult moderate anxiety with adequate venous access. Specialist referral for advanced techniques." },
    { n: 5, title: "Document the assessment",                  desc: "Record ASA grade, screening outcome, chosen technique with rationale, alternatives discussed and any onward referral. Confirm escort and post-op support are in place." },
  ],

  decisionTable: {
    title: "Sedation Technique Decision Guide",
    columns: ["Profile", "Recommended technique"],
    rows: [
      ["Adult ASA I–II, moderate anxiety",                    "IV midazolam (per SED-04) or inhalation (per SED-03)."],
      ["Adult ASA I–II, mild anxiety",                        "Inhalation sedation (per SED-03) often sufficient."],
      ["Child > 12 with adequate cooperation",                "Inhalation sedation preferred; IV only in specialist services."],
      ["Child < 12",                                            "Inhalation sedation; advanced techniques in specialist services only."],
      ["ASA III/IV or complex medical conditions",             "Specialist sedation service or hospital-based GA."],
      ["Patient cannot meet escort / fasting / aftercare requirements", "Defer or refer; do not proceed."],
    ],
  },

  safetyBox: {
    title: "Do not provide sedation in general practice if",
    items: [
      "ASA III/IV without specialist support.",
      "Pregnancy (first trimester especially) — defer elective treatment.",
      "Severe respiratory disease (e.g. severe COPD).",
      "Cognitive impairment such that compliance cannot be predicted.",
      "Escort or post-procedure support is not available.",
    ],
  },

  minimumRecordSet: SED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "ASA grade documented for every sedation case.",
    "Contraindication screen recorded.",
    "Technique choice rationale recorded.",
    "Escort and post-op arrangements confirmed.",
    "Onward referral logged where indicated.",
  ],

  clinicalSources: [
    SED_REF.iacsd,
    SED_REF.sdcepPrescribing,
    SED_REF.rcsFDS,
    SED_REF.niceConsciousSed,
    SED_REF.gdcCompetence,
  ],

  version: {
    ...SED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IACSD 2020 Standards for Conscious Sedation, SDCEP drug prescribing, RCS Faculty of Dental Surgery guidance, NICE CG112 (under-19s) and GDC Standards on competence. Requires Clinical Director review and local approval before live adoption.",
  },
};
