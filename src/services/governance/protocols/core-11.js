/**
 * Core Clinical Protocol — CORE-11
 * Managing Medically Compromised Patients
 *
 * Anchored to: SDCEP Drug Prescribing for Dentistry (medical complexity
 * chapters); BSP perio/diabetes guidance; NICE CG64 (infective
 * endocarditis prophylaxis); BDA medical history good practice; GDC
 * Standards Principle 7.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_11 = {
  id: "doc-core-11",
  reference: "CORE-11",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Managing Medically Compromised Patients",
  subtitle: "Medical history review, risk stratification, anticoagulants, antiresorptives, diabetes, immunosuppression, pregnancy, cardiac risk and infective endocarditis.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients with relevant medical history; updated each visit",
    frequency: "Every clinical encounter; risk-stratified at treatment planning",
    lead:      "Treating clinician; complex risk escalated to Clinical Lead",
    evidence:  "Medical history record, risk assessment, modifications made, liaison with GP / specialist",
  },

  standardLabel: "Medical risk standard",
  protocolStandard: "A current, accurate medical history is taken from every patient, reviewed at every visit, and the treatment plan modified where medical risk affects safety, dosing, bleeding, healing or infection. Where medical complexity exceeds practice competence, liaison with the GP / specialist or referral to secondary care is documented before invasive treatment.",

  workflow: [
    { n: 1, title: "Medical history — current and complete", desc: "Full history including medication, allergies, hospitalisations, previous reactions to LA / antibiotics, family history where relevant. Update at every visit verbally; full re-completion every 2 years or on significant change." },
    { n: 2, title: "Risk stratification",                    desc: "ASA grade or equivalent risk band. Identify factors affecting bleeding (anticoagulants / antiplatelets / bleeding disorders), healing (diabetes, smoking, steroids, immunosuppression), drug interactions, sedation suitability, mobility, capacity, communication needs." },
    { n: 3, title: "Treatment plan modifications",           desc: "Diabetes: schedule appointments to avoid hypoglycaemia, manage infection promptly. Anticoagulants: do not stop without prescriber advice — see SDCEP guidance. Antiresorptives: MRONJ risk assessment, defer non-urgent extractions where possible. Pregnancy: defer elective imaging where reasonable, avoid certain medications. Immunosuppression: low threshold for infection management. Cardiac: NICE CG64 — no routine prophylaxis except specific high-risk groups." },
    { n: 4, title: "Liaise with GP / specialist if needed",  desc: "Written or telephone liaison where treatment plan affects medical management or vice versa. Document the conversation, date, person spoken to, advice received." },
    { n: 5, title: "Consent with medical-risk specifics",    desc: "Material risks specific to the patient's medical history must be discussed and documented — e.g., bleeding risk for anticoagulated patient, MRONJ risk for antiresorptive patient." },
    { n: 6, title: "Post-treatment monitoring",              desc: "Closer review where medical risk indicates. Specific safety-net advice — e.g., signs of post-extraction bleeding for anticoagulated patient, signs of MRONJ for antiresorptive patient." },
  ],

  safetyBox: {
    title: "High-risk situations to escalate",
    items: [
      "Unstable cardiac disease, recent MI / stroke, unstable angina — defer elective treatment; urgent only with cardiology liaison.",
      "INR > 4.0 on warfarin — do not perform invasive treatment; check and re-test.",
      "Recent IV bisphosphonate / denosumab for cancer — high MRONJ risk; specialist setting recommended for extractions.",
      "Severe immunosuppression / neutropenia — liaise with oncologist; defer where possible.",
      "Pregnancy in first trimester — defer non-urgent treatment; avoid radiographs unless essential; check medication safety.",
      "Patients on multiple complex medications — risk of interaction; consult BNF and SDCEP for every prescribing decision.",
    ],
  },

  minimumRecordSet: [
    "Current medical history, medications, allergies.",
    "Risk band / ASA grade.",
    "Specific modifications to the treatment plan.",
    "GP / specialist liaison if undertaken.",
    "Consent discussion specific to medical-risk factors.",
    "Post-treatment review and safety-net advice.",
  ],

  auditPrompts: [
    "Is medical history reviewed at every visit (not just full re-take every 2 years)?",
    "Is INR / HbA1c / relevant blood result documented before invasive treatment in high-risk patients?",
    "Are anticoagulants managed per SDCEP — i.e. not stopped without prescriber advice?",
    "Is MRONJ risk assessed and documented for patients on antiresorptives?",
    "Is GP / specialist liaison documented where indicated?",
    "Are pregnancy and breast-feeding patients asked routinely?",
  ],

  clinicalSources: [
    CORE_REF.sdcepDrugPrescribing,
    CORE_REF.niceCg64,
    CORE_REF.bnf,
    CORE_REF.gdcSafety,
    CORE_REF.cqcReg12,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — medically compromised patient management with anticoagulant, antiresorptive, diabetes, cardiac and pregnancy considerations.",
  },
};
