/**
 * Core Clinical Protocol — CORE-13
 * Clinical Escalation and Raising Concerns
 *
 * Anchored to: GDC Standards Principle 8 (raising concerns if patients
 * are at risk); CQC Reg 17 (good governance, internal escalation);
 * Public Interest Disclosure Act 1998 (whistleblowing); BDA / Dental
 * Protection advice on internal escalation.
 *
 * Scope: how clinical concerns are raised within the practice — both
 * day-to-day clinical safety concerns (escalation to a more senior
 * clinician or the Clinical Lead) AND formal raising-concerns /
 * whistleblowing where serious patient safety, dishonesty or unfitness
 * to practise is observed.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_13 = {
  id: "doc-core-13",
  reference: "CORE-13",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Clinical Escalation and Raising Concerns",
  subtitle: "Internal escalation when treatment exceeds competence, peer concern, and formal raising of concerns under GDC Principle 8 / whistleblowing.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Every clinician and team member at every clinical encounter where escalation may be needed",
    frequency: "Continuous; documented in real time when used",
    lead:      "Treating clinician; Clinical Lead / Director receives escalations",
    evidence:  "Clinical record note for case escalation; separate raising-concerns log for safety concerns",
  },

  standardLabel: "Escalation standard",
  protocolStandard: "Clinicians must recognise when a case exceeds their competence, when a colleague's practice raises concern, or when patient safety, dishonesty or unfitness to practise is observed — and act on it. Day-to-day case escalation is documented in the clinical record. Formal raising of concerns follows the practice's policy and, ultimately, GDC Principle 8 — the duty cannot be delegated or avoided.",

  workflow: [
    { n: 1, title: "Recognise when escalation is needed", desc: "Case complexity exceeds your training / experience. A treatment risk has materialised beyond plan. A colleague's clinical practice or decision raises safety / honesty concerns. A team member is unfit to practise (illness, impairment, conduct)." },
    { n: 2, title: "Same-shift case escalation",          desc: "For complexity / risk during treatment: pause, stabilise the patient, consult a more senior clinician or Clinical Lead. If no internal senior available, refer onward. Document the escalation, who consulted, advice received, action taken." },
    { n: 3, title: "Internal concern about a colleague",  desc: "Speak directly to the colleague where appropriate and safe to do so. If not, escalate to the Clinical Director / Practice Owner. Document the discussion factually. Avoid speculation; describe observed behaviour." },
    { n: 4, title: "Formal raising of concerns",          desc: "Where patient safety or fitness to practise is at risk, raise concerns formally per practice policy — typically a written note to the Clinical Director or Governance Lead. Keep a copy. Continue the duty if the concern is not addressed: escalate to NHS England, ICB, indemnity provider or GDC as appropriate." },
    { n: 5, title: "Whistleblowing where indicated",      desc: "Public Interest Disclosure Act 1998 protections apply to disclosures made in the public interest. Use the practice whistleblowing policy. If practice channels fail, external bodies (CQC, GDC, NHS England Speak Up Guardian) accept disclosures." },
    { n: 6, title: "Support and follow-up",                desc: "The person raising the concern must be supported and protected from detriment. The matter is investigated. Outcome and learning recorded. Practice culture supports raising concerns." },
  ],

  safetyBox: {
    title: "GDC Principle 8 is not optional",
    items: [
      "Failing to raise a concern where patient safety is at risk is itself a fitness-to-practise issue.",
      "Confidentiality is not a bar to raising a concern where patients are at risk.",
      "Raising concerns in good faith — even if mistaken — is protected. Bullying / suppressing concerns is misconduct.",
      "Whistleblowing concerns can be raised externally (CQC, GDC, NHS England, ICB) where internal channels fail.",
      "Indemnity providers (Dental Protection, DDU, BDA) advise on raising concerns confidentially.",
      "The Clinical Director / Governance Lead must respond to internal concerns within a clearly defined timeframe.",
    ],
  },

  minimumRecordSet: [
    "Concern description — factual, observed behaviour / event.",
    "Person raising concern, date, time.",
    "To whom escalated, date, response.",
    "Investigation outcome and learning.",
    "Any external referral (GDC, CQC, NHS England) — destination, date, reference.",
    "Follow-up and support provided.",
  ],

  auditPrompts: [
    "Does the practice have an open raising-concerns culture documented and lived?",
    "Are internal concerns logged separately from clinical incidents?",
    "Are concerns investigated within an agreed timeframe?",
    "Is the person raising the concern supported and protected?",
    "Has the team had training on GDC Principle 8 and the practice raising-concerns policy?",
    "Are themes from concerns reviewed at the clinical governance meeting?",
  ],

  clinicalSources: [
    CORE_REF.gdcRaiseConcerns,
    CORE_REF.cqcReg17,
    CORE_REF.gdcSafety,
    CORE_REF.bda,
    CORE_REF.dentalProtection,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — clinical escalation and raising-concerns protocol aligned to GDC Principle 8 and CQC Reg 17.",
  },
};
