/**
 * Implants & Oral Surgery Clinical Protocol — IOS-06
 * Post-Operative Care, Bleeding & Pain Control
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-06, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_06 = {
  id: "doc-ios-06",
  reference: "IOS-06",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Post-Operative Care, Bleeding & Pain Control",
  subtitle: "Written aftercare, haemostasis, analgesia, diet, oral hygiene, sutures, expected healing, emergency contact advice, and review.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients following extraction, minor oral surgery, implant placement or graft surgery",
    frequency: "At the end of every surgical appointment and at review where required",
    lead:      "Treating dentist and dental nurse",
    evidence:  "Haemostasis confirmed, aftercare issued and review plan recorded",
  },

  standardLabel: "Discharge standard",
  protocolStandard: "The patient must not leave until haemostasis, medical stability, understanding of aftercare and access to help are confirmed. Written instructions should explain expected symptoms, pain control, bleeding control, diet, oral hygiene, activity restrictions and when to seek urgent help.",

  workflow: [
    { n: 1, title: "Confirm haemostasis",                desc: "Check the socket or surgical site before discharge. Use pressure, sutures or local haemostatic measures where indicated. Do not discharge uncontrolled bleeding." },
    { n: 2, title: "Give clear written instructions",     desc: "Explain biting on gauze, avoiding rinsing/spitting initially, soft diet, avoiding smoking/vaping, oral hygiene, salt-water rinses after 24 hours where appropriate and suture review." },
    { n: 3, title: "Advise on pain control",              desc: "Recommend analgesia appropriate to the patient medical history and current medicines. Avoid unsafe combinations and record advice given." },
    { n: 4, title: "Set expectations",                    desc: "Explain that swelling, bruising, stiffness, mild oozing and discomfort may occur, with timing of peak symptoms and expected improvement." },
    { n: 5, title: "Provide safety-netting and review",   desc: "Give emergency contact details and advise urgent contact for persistent bleeding, spreading swelling, fever, severe pain, numbness or breathing/swallowing difficulty." },
  ],

  safetyBox: {
    title: "Urgent review triggers",
    items: [
      "Bleeding that does not stop after firm pressure and local measures.",
      "Rapidly increasing swelling, difficulty breathing, difficulty swallowing, trismus, fever or malaise.",
      "Severe pain not improving after expected post-operative period or suspected dry socket.",
      "Persistent numbness, altered sensation, sinus symptoms or suspected communication.",
      "Patient unable to understand or follow instructions without support.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Haemostasis confirmed before discharge.",
    "Written and verbal aftercare provided.",
    "Analgesia and medicine advice recorded.",
    "Sutures/review arrangements recorded where relevant.",
    "Emergency contact and red-flag advice recorded.",
  ],

  clinicalSources: [
    IOS_REF.baosPostOp,
    IOS_REF.nhsPostExtraction,
    IOS_REF.sdcepPrescribing,
    IOS_REF.localOOH,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to BAOS post-operative advice, NHS post-extraction advice, SDCEP Drug Prescribing for Dentistry, and the practice's local out-of-hours policy.",
  },
};
