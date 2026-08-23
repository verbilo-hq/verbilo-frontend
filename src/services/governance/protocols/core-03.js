/**
 * Core Clinical Protocol — CORE-03
 * Antimicrobial & Analgesic Prescribing
 *
 * Anchored to: SDCEP Drug Prescribing for Dentistry (covers both AMR and
 * analgesia); FGDP/CGDent UK Dental Antimicrobial Stewardship Toolkit;
 * NICE CG64 (infective endocarditis prophylaxis); BNF; UKHSA AMR
 * strategy. Current CQC inspection focus area.
 *
 * Scope: clinical prescribing decision-making for adults and children
 * for both antimicrobials and analgesics — the two are conventionally
 * a single dental prescribing policy per SDCEP. Stewardship audit is
 * captured by the CQC Compliance Hub Antibiotic Prescribing Audit.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE, CORE_MINIMUM_RECORD_SET,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_03 = {
  id: "doc-core-03",
  reference: "CORE-03",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Antimicrobial & Analgesic Prescribing",
  subtitle: "First-line agents, duration, dose by age/weight, allergy status, and stewardship audit — antibiotics and analgesics together per SDCEP.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All prescribing of antibiotics and analgesics in the dental setting (adults and children)",
    frequency: "Every prescription; audit annually",
    lead:      "Prescribing clinician; audit lead reports to Clinical Director",
    evidence:  "Prescription record with indication, audit report, stewardship trail",
  },

  standardLabel: "Prescribing standard",
  protocolStandard: "Every prescription must have a recorded clinical indication, follow SDCEP Drug Prescribing for Dentistry first-line guidance, be appropriate for the patient's age / weight / allergies / medical history, and be the minimum effective dose and duration. Antibiotics are not a substitute for drainage or source control. Analgesia follows the WHO ladder and avoids opioid prescribing for routine dental pain.",

  workflow: [
    { n: 1, title: "Confirm the indication",        desc: "Is there a true clinical indication for an antibiotic? Drainage, extirpation or operative source control comes first. For analgesia, identify the underlying cause before prescribing." },
    { n: 2, title: "Check allergy and medical history", desc: "Penicillin allergy (genuine vs reported), pregnancy, breastfeeding, anticoagulants, renal/hepatic impairment, age extremes, current medications, interactions." },
    { n: 3, title: "Select first-line agent",        desc: "Antibiotics: amoxicillin 500 mg TDS × 5 days (or metronidazole 400 mg TDS × 5 days if pen allergy); add metronidazole 400 mg TDS for severe odontogenic infection. Analgesia: paracetamol 1 g QDS as first-line; ibuprofen 400 mg TDS as adjunct where no contraindications. Avoid routine codeine; reserve opioids for short-course severe pain only." },
    { n: 4, title: "Determine dose / duration",      desc: "Adult and paediatric doses per BNF / BNF for Children. Shortest effective duration. Single-dose prophylaxis for the few NICE CG64 indications; not routine for healthy patients." },
    { n: 5, title: "Document and safety-net",        desc: "Record indication, agent, dose, duration, allergy status, advice given. Tell the patient when to seek review if symptoms worsen or do not improve in 48–72 hours." },
    { n: 6, title: "Contribute to stewardship audit",desc: "Every clinician's prescriptions feed the annual Antibiotic Prescribing Audit. Targets: ≥ 95% indicated per SDCEP; ≤ 5% broad-spectrum; no routine pre-operative prophylaxis." },
  ],

  safetyBox: {
    title: "Stewardship — what to avoid",
    items: [
      "Antibiotics as a substitute for drainage / source control.",
      "Routine pre-operative antibiotic prophylaxis for healthy patients (against NICE CG64).",
      "Long courses (> 5 days) without strong indication.",
      "Repeat scripts without re-examination.",
      "Opioid analgesics for routine dental pain — strong NSAID + paracetamol is more effective and safer.",
      "Prescribing without documented indication in the clinical record.",
    ],
  },

  minimumRecordSet: [
    "Indication for the prescription.",
    "Allergy status (verified at point of prescribing).",
    "Agent, dose, route, frequency, duration.",
    "Patient advice given (when to take, side effects, when to seek review).",
    "Source control / operative actions taken alongside the prescription.",
    "Review or follow-up arrangement.",
  ],

  auditPrompts: [
    "Does every prescription have a documented clinical indication?",
    "Are first-line agents used in ≥ 95% of prescriptions?",
    "Is duration ≤ 5 days unless specifically justified?",
    "Is allergy status recorded at every prescription?",
    "Is drainage / source control documented alongside antibiotic scripts?",
    "Is the practice signed up to the TARGET / Dental AMR Toolkit, with annual feedback to prescribers?",
  ],

  clinicalSources: [
    CORE_REF.sdcepDrugPrescribing,
    CORE_REF.fgdpAmrToolkit,
    CORE_REF.niceCg64,
    CORE_REF.bnf,
    CORE_REF.gdcSafety,
    CORE_REF.cqcReg12,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — combined antimicrobial and analgesic prescribing policy per SDCEP Drug Prescribing for Dentistry, with stewardship audit linkage.",
  },
};
