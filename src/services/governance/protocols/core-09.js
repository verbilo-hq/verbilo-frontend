/**
 * Core Clinical Protocol — CORE-09
 * Post-Operative Complications
 *
 * Anchored to: GDC Standards Principle 7 (safe practice); BAOS post-op
 * advice; SDCEP Management of Acute Dental Problems; CQC Reg 20 (Duty
 * of Candour).
 *
 * Scope: cross-cutting recognition and management of common dental
 * post-operative complications — bleeding, dry socket, infection,
 * nerve injury, oro-antral communication, post-restorative sensitivity,
 * and the threshold for escalation back to the practice / OMFS / A&E.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_09 = {
  id: "doc-core-09",
  reference: "CORE-09",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Post-Operative Complications",
  subtitle: "Recognition and management of bleeding, dry socket, infection, nerve injury, OAC and post-restorative sensitivity, including escalation thresholds.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients with post-operative complaints after extraction, surgery, endodontic, restorative or hygienist treatment",
    frequency: "Every post-operative contact",
    lead:      "Treating clinician (or duty clinician if treating clinician unavailable)",
    evidence:  "Contact record, examination findings, treatment given, follow-up plan",
  },

  standardLabel: "Post-operative care standard",
  protocolStandard: "Every patient with a post-operative complication must be assessed promptly (same day for urgent symptoms), examined where indicated, given clear advice and treatment, and escalated to OMFS / A&E where airway risk, spreading infection, uncontrolled bleeding, suspected nerve injury or OAC is identified. Duty of Candour applies where the complication caused moderate harm or above.",

  workflow: [
    { n: 1, title: "Triage the call",                desc: "Telephone or in-person triage. Severity, duration, systemic features. Bring in same day for any red flag — uncontrolled bleeding, severe swelling, airway / swallowing concern, fever, altered sensation, severe pain unresponsive to analgesia." },
    { n: 2, title: "Examine and identify cause",     desc: "Inspect the surgical / treatment site. Identify cause — dry socket, infection, retained root / fragment, OAC, nerve injury, bleeding diathesis, allergic reaction, post-restorative pulpitis, sensitivity." },
    { n: 3, title: "Manage the complication",         desc: "Bleeding: local measures (pressure, sutures, haemostatic agents); review anticoagulant management. Dry socket: irrigation, dressing, analgesia. Infection: drainage + antibiotics only if indicated. OAC: avoid probing, sinus precautions, urgent referral. Nerve symptoms: document distribution and onset; refer if persistent." },
    { n: 4, title: "Safety-net and follow-up",       desc: "Written / verbal aftercare advice. Review date. Clear return-if-worse instructions. Document the conversation." },
    { n: 5, title: "Escalate where indicated",        desc: "999 / A&E for airway risk, spreading infection, systemic sepsis, uncontrolled haemorrhage. Urgent OMFS for OAC, persistent altered sensation, displaced root, severe infection not responding. Document the escalation, time, who advised, and outcome." },
    { n: 6, title: "Duty of Candour assessment",     desc: "Where the complication caused moderate harm or above (Reg 20): face-to-face apology + explanation, written follow-up within timeframes, log on the practice Complaints register, support the patient with their care plan." },
  ],

  safetyBox: {
    title: "Red flags — escalate same day",
    items: [
      "Airway compromise, floor-of-mouth swelling, dysphagia, trismus — 999 / A&E.",
      "Uncontrolled bleeding despite local measures — review anticoagulants, escalate to OMFS / A&E if not controlled.",
      "Suspected OAC (oro-antral communication) — avoid probing, sinus precautions, urgent OMFS.",
      "Persistent altered sensation in lip / chin / tongue — neurosensory mapping, document, urgent OMFS where established.",
      "Systemic features after extraction or surgery — fever, malaise, cellulitis — urgent assessment + antibiotics + drainage.",
      "Sodium hypochlorite accident in endodontics — urgent management, document, refer.",
    ],
  },

  minimumRecordSet: [
    "Date and method of post-op contact (call / in-person).",
    "Patient-reported symptoms and timeline.",
    "Examination findings (where in-person).",
    "Diagnosis and treatment given.",
    "Safety-net advice (verbal and / or written).",
    "Escalation if any — who, when, advice received.",
    "Duty of Candour assessment and any required notification.",
  ],

  auditPrompts: [
    "Are post-op contacts logged in the patient record?",
    "Are red flags screened and same-day appointments given where indicated?",
    "Is local-measures-first attempted before antibiotics for post-op infection?",
    "Are OACs, nerve injuries and uncontrolled bleeding escalated to OMFS / A&E?",
    "Is Duty of Candour considered and triggered where applicable?",
    "Are complications reviewed at clinical governance meetings for trends / learning?",
  ],

  clinicalSources: [
    CORE_REF.sdcepAcuteProblems,
    CORE_REF.gdcSafety,
    CORE_REF.cqcReg12,
    CORE_REF.cqcReg20,
    CORE_REF.govComplaints,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — cross-cutting post-operative complications protocol covering bleeding, dry socket, infection, nerve injury, OAC and Duty of Candour assessment.",
  },
};
