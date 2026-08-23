/**
 * Core Clinical Protocol — CORE-12
 * Failed Attendance and Dental Neglect Recognition
 *
 * Anchored to: British Society of Paediatric Dentistry — Dental Neglect
 * policy; Care Act 2014 (safeguarding adults at risk); Children Act
 * 1989/2004; CQC Reg 13; GDC Standards Principle 8 (raising concerns).
 *
 * Scope: when failed attendance (FTA) is a clinical safeguarding marker
 * — particularly in children and vulnerable adults — and how the
 * practice recognises, escalates and documents this distinct from
 * routine missed-appointment administrative processes.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_12 = {
  id: "doc-core-12",
  reference: "CORE-12",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Failed Attendance and Dental Neglect Recognition",
  subtitle: "FTA as a safeguarding marker in children and vulnerable adults — recognition, escalation, documentation, and the line between admin FTA and clinical neglect.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients with repeat FTAs — particular vigilance for children, vulnerable adults, and patients with active disease",
    frequency: "Every FTA reviewed; escalated where threshold met",
    lead:      "Treating clinician; Safeguarding Lead consulted where safeguarding concern raised",
    evidence:  "FTA log, clinical record annotation, safeguarding referral if escalated",
  },

  standardLabel: "FTA / dental neglect standard",
  protocolStandard: "Repeated FTAs by children or vulnerable adults — particularly where active disease, planned treatment or known safeguarding concerns exist — are a clinical safeguarding indicator and must be reviewed against the BSPD Dental Neglect framework. FTAs are not solely an administrative matter. Acting on FTA as a clinical concern is the responsibility of the treating clinician, not just reception.",

  workflow: [
    { n: 1, title: "Distinguish admin FTA from clinical concern", desc: "Single missed appointment with reasonable explanation = administrative. Patterns of FTA + active disease + vulnerability = clinical concern. The treating clinician reviews the FTA log monthly, not just reception staff." },
    { n: 2, title: "Identify safeguarding indicators",            desc: "Children with rampant caries / pain who repeatedly FTA. Adults with diabetes / immunosuppression and uncontrolled oral disease who FTA. Patients with known safeguarding flags. Inconsistent caregiver engagement. FTA following abuse disclosure." },
    { n: 3, title: "Document and attempt contact",                 desc: "Document each FTA in the patient record (not only the appointment system). Attempt contact — call, letter, secure message. Offer alternative appointment, transport help where available, reasonable adjustments." },
    { n: 4, title: "Internal escalation",                          desc: "After 2–3 FTAs in a child or vulnerable adult with active disease: escalate to the practice Safeguarding Lead. Discuss whether the threshold for external referral is met. Document the discussion." },
    { n: 5, title: "External referral if indicated",                desc: "Children: refer to school nurse, health visitor, local authority safeguarding hub / MASH. Adults: GP, adult social care safeguarding. Use the BSPD Dental Neglect template / local pathway. Do not delegate the decision to refer — clinician duty." },
    { n: 6, title: "Continue to offer care",                        desc: "Do not discharge from the practice as the response to FTA + safeguarding concern — that leaves the patient unsupported. Continue to offer care; document attempts; share information with the receiving safeguarding team." },
  ],

  safetyBox: {
    title: "Recognise and act",
    items: [
      "FTA in a child with untreated rampant caries / dental pain = potential neglect.",
      "FTA in a vulnerable adult with active disease = potential safeguarding concern under Care Act 2014.",
      "Withdrawing from the patient list as a response to FTA alone is not appropriate where safeguarding concern exists.",
      "Where parent / caregiver refuses recommended treatment for a child against the child's welfare interests — escalate as safeguarding.",
      "GDC Principle 8 — duty to raise concerns where a patient is at risk.",
      "Document attempts at contact; absence of documentation is the audit failure, not the FTA itself.",
    ],
  },

  minimumRecordSet: [
    "Each FTA recorded in the patient record with date.",
    "Attempted contact — method, date, outcome.",
    "Clinical concern assessment (admin vs safeguarding).",
    "Internal Safeguarding Lead discussion where relevant.",
    "External referral made — destination, date, reference.",
    "Continued offer of care documented.",
  ],

  auditPrompts: [
    "Are FTAs in children with active disease reviewed clinically each month?",
    "Are repeat FTAs in vulnerable adults flagged for safeguarding review?",
    "Are external referrals made where the BSPD threshold is met?",
    "Is the practice continuing to offer care rather than discharging?",
    "Are attempts at contact documented in the clinical record?",
    "Are FTA trends reviewed at the clinical governance meeting?",
  ],

  clinicalSources: [
    CORE_REF.bspdNeglect,
    CORE_REF.careAct,
    CORE_REF.childrenAct,
    CORE_REF.cqcReg13,
    CORE_REF.gdcRaiseConcerns,
    CORE_REF.govSafeguarding,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — FTA and dental neglect recognition aligned to BSPD policy and Care Act 2014, with clear escalation pathway.",
  },
};
