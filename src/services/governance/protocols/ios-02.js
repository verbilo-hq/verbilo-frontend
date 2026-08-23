/**
 * Implants & Oral Surgery Clinical Protocol — IOS-02
 * Medical Risk, Anticoagulants & Surgical Precautions
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-02, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_02 = {
  id: "doc-ios-02",
  reference: "IOS-02",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Medical Risk, Anticoagulants & Surgical Precautions",
  subtitle: "Bleeding risk, anticoagulants, antiplatelets, diabetes, immunosuppression, bisphosphonates, radiotherapy history, and medical liaison.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients needing oral surgery or implant procedures where medical history may affect risk",
    frequency: "Before surgery and again on the day of procedure",
    lead:      "Treating dentist with clinical lead support where risk is complex",
    evidence:  "Risk assessment, medicine plan, medical liaison and haemostasis plan recorded",
  },

  standardLabel: "Medical-risk standard",
  protocolStandard: "Surgical treatment must not proceed until medical risk is understood, medicines have been assessed, bleeding and infection risks are planned for, and escalation routes are clear. Patients taking anticoagulants or antiplatelets require a structured bleeding-risk assessment and treatment plan rather than automatic cancellation or medicine changes.",

  workflow: [
    { n: 1, title: "Identify medicine-related risks",                  desc: "Record anticoagulants, antiplatelets, antiresorptives, steroids, immunosuppressants, diabetes medicines, chemotherapy, biologics, bisphosphonates, denosumab and recent changes." },
    { n: 2, title: "Assess bleeding risk by procedure",                 desc: "Consider extent of surgery, number of teeth, flap/bone removal, implant or graft surgery, local haemostatic measures, appointment timing and review access." },
    { n: 3, title: "Check systemic risk and stability",                 desc: "Consider HbA1c/diabetes control, blood pressure, cardiovascular history, immunosuppression, infective endocarditis advice, radiotherapy to jaws and history of osteonecrosis." },
    { n: 4, title: "Plan local precautions",                            desc: "Use atraumatic technique, local haemostatic packing, sutures, pressure, staged treatment, morning appointments and clear post-operative instructions where indicated." },
    { n: 5, title: "Seek medical or specialist advice when required",   desc: "Liaise with GP, anticoagulation clinic, haematology, oncology, cardiology or OMFS/oral surgery where risk cannot be safely managed in practice." },
  ],

  safetyBox: {
    title: "Escalate before treatment if",
    items: [
      "INR or anticoagulant information is unknown where the patient is on warfarin or risk is unclear.",
      "The patient reports previous uncontrolled bleeding, recent thromboembolic event or multiple interacting medicines.",
      "There is current chemotherapy, severe immunosuppression, poorly controlled diabetes or jaw radiotherapy history.",
      "The patient is taking antiresorptive/antiangiogenic medication and dentoalveolar surgery is elective or avoidable.",
      "The practice cannot provide appropriate haemostatic materials, review or urgent escalation.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Relevant medical and medicines history recorded.",
    "Bleeding-risk and procedure-risk assessment recorded.",
    "Any medical advice or liaison recorded.",
    "Local haemostasis plan documented.",
    "Post-operative safety-netting and emergency contact advice recorded.",
  ],

  clinicalSources: [
    IOS_REF.sdcepAnticoag,
    IOS_REF.sdcepPrescribing,
    IOS_REF.niceIE,
    IOS_REF.localMedEmergency,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to SDCEP anticoagulant and prescribing guidance, NICE infective endocarditis guidance, and the practice's local medical emergency protocol.",
  },
};
