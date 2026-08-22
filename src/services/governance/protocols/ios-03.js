/**
 * Implants & Oral Surgery Clinical Protocol — IOS-03
 * Consent, Treatment Planning & Patient Communication
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-03, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_03 = {
  id: "doc-ios-03",
  reference: "IOS-03",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Consent, Treatment Planning & Patient Communication",
  subtitle: "Options, risks, benefits, alternatives, staged treatment, likely costs, failure risk, maintenance obligations, and written treatment plans.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All oral surgery and implant treatment discussions, including referrals and staged treatment plans",
    frequency: "Before treatment, before each staged phase and whenever the plan changes",
    lead:      "Treating dentist / implant clinician",
    evidence:  "Consent discussion, written plan, costs and questions recorded",
  },

  standardLabel: "Consent standard",
  protocolStandard: "Valid consent requires a documented conversation. The patient must understand diagnosis, reasonable options, no-treatment option, material risks, likely benefits, alternatives, possible costs, maintenance commitments and what may change during staged surgical care. A signed form supports but does not replace the discussion.",

  workflow: [
    { n: 1, title: "Explain the diagnosis and objective",       desc: "Use plain language to explain why surgery or implant treatment is being considered, what the clinician is trying to achieve and what problem may remain afterwards." },
    { n: 2, title: "Discuss alternatives",                       desc: "Include no treatment, monitoring, extraction only, restorative options, dentures, bridges, implant options, specialist referral and risks of delaying treatment." },
    { n: 3, title: "Explain material risks",                     desc: "Cover pain, swelling, bleeding, bruising, infection, dry socket, trismus, sinus communication, nerve disturbance, fracture, implant failure, graft failure and need for further treatment where relevant." },
    { n: 4, title: "Explain staged care and costs",              desc: "For implants, explain assessment, imaging, extraction, grafting, healing, implant placement, restoration, maintenance, possible additional costs and failure scenarios." },
    { n: 5, title: "Check understanding and record questions",   desc: "Ask what matters most to the patient, document questions and record the agreed plan, written information provided and consent status." },
  ],

  safetyBox: {
    title: "Consent safeguards",
    items: [
      "Do not proceed if the patient believes the result is guaranteed or has not understood failure and maintenance risks.",
      "Do not hide material uncertainty such as possible conversion to surgical extraction, graft need or referral.",
      "Where a plan is changed intra-operatively, stay within prior consent or stop and discuss where clinically safe.",
      "Use interpretation or support for language, capacity, anxiety or communication barriers.",
      "Record if the patient declines recommended referral, imaging, maintenance or staged treatment.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Diagnosis, proposed treatment and alternatives recorded.",
    "Material risks and limitations recorded.",
    "Costs, staged treatment and likely timeframes recorded.",
    "Written information and consent form use recorded.",
    "Patient questions and agreed plan recorded.",
  ],

  clinicalSources: [
    IOS_REF.gdcConsent,
    IOS_REF.practiceConsentForms,
    IOS_REF.localTreatmentPlan,
    IOS_REF.implantMaintGuidance,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to GDC Standards on valid consent, the practice's consent forms and treatment-planning policy, and implant maintenance guidance.",
  },
};
