/**
 * Implants & Oral Surgery Clinical Protocol — IOS-07
 * Post-Surgical Complications & Dry Socket Management
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-07, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_07 = {
  id: "doc-ios-07",
  reference: "IOS-07",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Post-Surgical Complications & Dry Socket Management",
  subtitle: "Alveolar osteitis, infection, swelling, trismus, oro-antral communication, nerve symptoms, delayed healing, antibiotics, and escalation.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients returning with symptoms after extraction, oral surgery, implant placement or grafting",
    frequency: "At urgent contact, review visit and follow-up until resolved or referred",
    lead:      "Treating dentist / oral surgery lead where significant",
    evidence:  "Diagnosis, complication management, advice and referral decision recorded",
  },

  standardLabel: "Complication standard",
  protocolStandard: "Post-surgical symptoms must be assessed systematically rather than assumed to be normal healing. The clinician should identify dry socket, infection, bleeding, haematoma, trismus, nerve disturbance, sinus involvement, delayed healing or implant/graft complications, then manage locally or refer promptly.",

  workflow: [
    { n: 1, title: "Triage severity",                    desc: "Check airway, spreading swelling, fever, malaise, dysphagia, trismus, bleeding, uncontrolled pain, numbness and medical vulnerability. Escalate red flags urgently." },
    { n: 2, title: "Diagnose the likely complication",    desc: "Examine the surgical site, clot/socket, swelling, lymph nodes, occlusion, sutures, soft tissues, sinus symptoms and neurosensory status. Take imaging only if clinically justified." },
    { n: 3, title: "Manage dry socket locally",            desc: "Irrigate gently where appropriate, avoid curettage of exposed bone, consider a suitable dressing, provide analgesia advice and arrange review if symptoms persist." },
    { n: 4, title: "Use antibiotics selectively",          desc: "Use local measures first. Prescribe antibiotics only where there is spreading infection, systemic involvement or another clear clinical indication." },
    { n: 5, title: "Escalate and communicate",             desc: "Refer urgently for airway risk, significant infection, nerve injury, oro-antral communication, suspected fracture, non-healing socket or implant/graft failure concern." },
  ],

  safetyBox: {
    title: "Same-day escalation triggers",
    items: [
      "Floor-of-mouth swelling, difficulty breathing or swallowing, systemic illness or rapidly spreading infection.",
      "Persistent or significant bleeding, especially in anticoagulated patients.",
      "New or persistent altered sensation after lower third molar or mandibular surgery.",
      "Suspected oro-antral communication, displaced root, fractured mandible or surgical site breakdown.",
      "Non-healing socket, exposed bone or suspected medication-related osteonecrosis.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Presenting symptoms and time since surgery recorded.",
    "Clinical findings and diagnosis recorded.",
    "Local treatment and dressing used recorded.",
    "Antibiotic rationale or reason not prescribed recorded.",
    "Review/referral and safety-netting recorded.",
  ],

  clinicalSources: [
    IOS_REF.sdcepPrescribingShort,
    IOS_REF.baosNhsDrySocket,
    IOS_REF.localOralSurgRefPath,
    IOS_REF.practiceIncidentPolicy,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to SDCEP prescribing guidance, BAOS/NHS dry socket and oral surgery aftercare advice, and the practice's local oral surgery referral pathway and incident policy.",
  },
};
