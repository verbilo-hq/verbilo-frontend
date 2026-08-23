/**
 * Core Clinical Protocol — CORE-02
 * Urgent Dental Care — Pain & Swelling
 *
 * Anchored to: SDCEP Management of Acute Dental Problems; NHS contractual
 * urgent-care obligations; NICE NG12 (suspected cancer red flags); GDC
 * Standard 7 (working within competence).
 *
 * Scope: clinical decision-making for adult patients presenting with
 * acute dental pain, swelling, infection or trauma. Distinct from the
 * operational urgent-care booking pathway (which lives in Practice
 * Operations SOPs) — this is the clinical *what to do* layer.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_02 = {
  id: "doc-core-02",
  reference: "CORE-02",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Urgent Dental Care — Pain & Swelling",
  subtitle: "Triage, recognition of dental sepsis red flags, source control, prescribing decisions and onward escalation.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients presenting urgently with dental pain, swelling, infection, trauma or post-operative complications",
    frequency: "Every urgent presentation",
    lead:      "Treating clinician; escalated to Clinical Lead where complexity exceeds competence",
    evidence:  "Triage record, diagnosis, treatment given, follow-up plan",
  },

  standardLabel: "Acute care standard",
  protocolStandard: "Acute pain and swelling are managed using SDCEP Management of Acute Dental Problems principles: take a focused history, identify the source, prioritise drainage and source control over antibiotics, prescribe only where systemic features or specific indications are present, safety-net, and escalate to OMFS / hospital for airway risk, dysphagia, floor-of-mouth elevation, systemic sepsis or any other red flag.",

  workflow: [
    { n: 1, title: "Triage — same-day or routine?", desc: "Severity, duration, swelling extent, systemic features, ability to swallow / breathe, recent trauma, patient vulnerability. Document the triage decision and any safety-netting given to the patient." },
    { n: 2, title: "Focused history + exam",         desc: "Pain history (onset, character, triggers, relief), medical history including anticoagulants / bisphosphonates / immunosuppression, intra- and extra-oral exam, swelling extent, lymphadenopathy, trismus, mouth opening." },
    { n: 3, title: "Investigations",                  desc: "Justified radiograph(s) for source identification (PA / BW). Vitality testing where pulpitis suspected. Avoid imaging that won't change management." },
    { n: 4, title: "Source control first",            desc: "Drainage (pulpectomy, extirpation, incision and drainage), local measures, occlusal adjustment. Antibiotics are an adjunct — not a substitute for drainage / source control." },
    { n: 5, title: "Prescribe only where indicated",  desc: "Antibiotics only where systemic features (pyrexia, malaise, lymphadenopathy) OR specific indications (e.g. spreading infection, immunocompromised, NICE CG64 endocarditis). Follow SDCEP first-line: amoxicillin 500 mg TDS × 5 days or metronidazole 400 mg TDS × 5 days (pen allergy). Document indication." },
    { n: 6, title: "Safety-net + follow-up",          desc: "Clear written / verbal advice on what to do if symptoms worsen. Analgesia advice. Review or follow-up appointment. Escalate to OMFS / urgent care / hospital A&E for any red flag." },
  ],

  safetyBox: {
    title: "Red flags — same-day escalation",
    items: [
      "Airway compromise, floor-of-mouth swelling, dysphagia, trismus, systemic sepsis, altered consciousness — refer to A&E / 999 same day.",
      "Suspected oral malignancy (unexplained ulcer > 3 weeks, persistent neck lump, red-and-white patches) — 2-week wait pathway, not routine urgent care.",
      "Antibiotics without drainage rarely resolve dental sepsis. Avoid serial repeat scripts without re-examination.",
      "Patients on anticoagulants / antiresorptives / with bleeding disorders need risk-assessed care; do not delay if urgent.",
      "Children, vulnerable adults and patients in pain who repeatedly fail to attend may signal dental neglect — see CORE-12 Failed Attendance.",
    ],
  },

  minimumRecordSet: [
    "Triage decision and rationale.",
    "Focused history including red-flag screening.",
    "Diagnosis (pulpal / periapical / periodontal / soft-tissue / other).",
    "Treatment delivered including drainage / source control.",
    "Prescription with indication, agent, dose, duration, allergy status.",
    "Safety-netting advice, follow-up arrangement, escalation if any.",
  ],

  auditPrompts: [
    "Was the triage decision documented with a clear rationale?",
    "Was source control attempted before / alongside antibiotics where appropriate?",
    "Was antibiotic prescribing aligned with SDCEP first-line guidance and indication recorded?",
    "Was safety-netting documented?",
    "Were red flags screened and any escalation recorded?",
    "For frequent re-presenters: was the underlying cause and any safeguarding concern addressed?",
  ],

  clinicalSources: [
    CORE_REF.sdcepAcuteProblems,
    CORE_REF.sdcepDrugPrescribing,
    CORE_REF.fgdpAmrToolkit,
    CORE_REF.niceCg64,
    CORE_REF.niceNg12,
    CORE_REF.gdcSafety,
    CORE_REF.cqcReg12,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — clinical decision-making layer for urgent dental care, anchored to SDCEP Management of Acute Dental Problems.",
  },
};
