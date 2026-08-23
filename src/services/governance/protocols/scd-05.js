/**
 * Special Care Dentistry Clinical Protocol — SCD-05
 * Patients with Complex Medical Conditions
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  SCD_CLINICAL_INTENT, SCD_LOCAL_SIGNOFF_NOTE, SCD_MINIMUM_RECORD_SET,
  SCD_VERSION_BASE, SCD_REF,
} from "./scd-common";

export const SCD_05 = {
  id: "doc-scd-05",
  reference: "SCD-05",
  packKey: "clinical_governance",
  category: "Special Care",
  type: "sop",
  title: "Patients with Complex Medical Conditions",
  subtitle: "Cardiac, oncology, neurological, transplant, bleeding-risk and other medically complex patients — risk assessment and referral.",

  clinicalIntent: SCD_CLINICAL_INTENT,
  localSignOffNote: SCD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with complex medical histories (cardiac, oncology, transplant, neurological, bleeding-risk)",
    frequency: "At assessment and before each significant treatment",
    lead:      "Dentist with appropriate medical liaison",
    evidence:  "Risk assessment, medical liaison record, treatment plan adapted to risk",
  },

  standardLabel: "Medical-complexity standard",
  protocolStandard: "Patients with complex medical conditions must have their dental treatment planned with awareness of their medical risk. The practice must liaise with the GP or specialist where the medical history may affect treatment safety, and refer to specialist services where local capability is exceeded.",

  workflow: [
    { n: 1, title: "Take a thorough medical history",  desc: "Update at every visit. Use a structured questionnaire. Record diagnosis, medications (prescription, OTC, complementary), allergies, recent changes, planned treatments and specialist contacts." },
    { n: 2, title: "Risk-stratify the dental treatment", desc: "Identify procedures with bleeding, infection, endocarditis, osteonecrosis or pharmacological-interaction risk. Match dental urgency to medical risk." },
    { n: 3, title: "Liaise with the GP / specialist",    desc: "Where significant, write to GP or specialist for clarification, INR check, antibiotic prophylaxis guidance, or treatment-timing advice. Document responses." },
    { n: 4, title: "Adapt treatment",                     desc: "Antibiotic prophylaxis only where indicated (NICE / SDCEP). Atraumatic technique. Local haemostatic measures. Morning appointments. Staged treatment. Reduced epinephrine where cardiac concern." },
    { n: 5, title: "Communicate risk and consent",         desc: "Discuss with the patient the medical risks of treatment and the alternatives. Document specific consent and any decisions to defer or refer." },
  ],

  decisionTable: {
    title: "Common Medical Complexities & Action",
    columns: ["Condition", "Key consideration"],
    rows: [
      ["Cardiac (recent MI, unstable angina, valvular)",  "Defer elective treatment; liaise with cardiology; consider IE prophylaxis per NICE/SDCEP."],
      ["Anticoagulation (warfarin, DOAC, antiplatelet)",   "Per SDCEP — do not stop without specialist advice; use local haemostasis."],
      ["Diabetes",                                          "HbA1c control; morning appointments; manage hypoglycaemia risk."],
      ["Immunosuppression / cancer treatment / transplant", "Defer non-urgent; liaise with oncology/transplant team; antibiotic prophylaxis per guidance."],
      ["Bisphosphonates / antiresorptives",                  "MRONJ risk for extractions; prevention-first; specialist referral for surgical work."],
      ["Pregnancy",                                          "Avoid elective treatment in first trimester; second-trimester window for routine work."],
      ["Bleeding disorder",                                  "Liaise with haematology; treat at appropriate centre if significant."],
    ],
  },

  safetyBox: {
    title: "Refer rather than treat in general practice if",
    items: [
      "Significant medical complexity beyond local competence.",
      "Treatment requires sedation/GA in a hospital setting.",
      "Bleeding risk cannot be managed with local measures and medical advice.",
      "Endocarditis risk requires specialist guidance and the patient is uncertain.",
      "MRONJ risk for extractions in a high-risk patient.",
    ],
  },

  minimumRecordSet: SCD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Medical history updated and risk-stratified at every visit.",
    "Medical liaison documented where indicated.",
    "Antibiotic prophylaxis decisions per NICE/SDCEP.",
    "Treatment adaptations recorded.",
    "Specific consent for medically complex treatment.",
  ],

  clinicalSources: [
    SCD_REF.bsdhStandards,
    SCD_REF.sdcepPrescribing,
    SCD_REF.nhseSpecialCare,
    SCD_REF.gdcConsentRecords,
  ],

  version: {
    ...SCD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSDH Standards in Special Care Dentistry, SDCEP drug prescribing (including anticoagulants, MRONJ), NHS England commissioning standards and GDC Standards on records. Requires Clinical Director review and local approval before live adoption.",
  },
};
