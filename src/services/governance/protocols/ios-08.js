/**
 * Implants & Oral Surgery Clinical Protocol — IOS-08
 * Pre-Implant Assessment, CBCT & Surgical Planning
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-08, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_08 = {
  id: "doc-ios-08",
  reference: "IOS-08",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Pre-Implant Assessment, CBCT & Surgical Planning",
  subtitle: "Periodontal stability, bone volume, restorative space, occlusion, CBCT indication, surgical guide planning, consent, and staged treatment.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients being assessed for implant placement, implant referral or implant restoration",
    frequency: "Before implant surgery, grafting or referral acceptance",
    lead:      "Implant clinician / dentist with implant training and competence",
    evidence:  "Implant assessment, periodontal status, imaging justification, restorative plan and consent recorded",
  },

  standardLabel: "Implant-planning standard",
  protocolStandard: "Implant treatment must be prosthetically driven, risk assessed and planned from diagnosis through to maintenance. The clinician must evaluate periodontal stability, bone volume, soft tissue, occlusion, restorative space, medical risk, patient expectations and whether CBCT or specialist referral is justified.",

  workflow: [
    { n: 1, title: "Assess whole-mouth risk",               desc: "Record periodontal status, plaque control, smoking, diabetes, caries risk, parafunction, occlusion, adjacent teeth, mucosal health and ability to maintain implants." },
    { n: 2, title: "Plan the restoration first",             desc: "Assess prosthetic space, emergence profile, aesthetics, occlusal load, opposing dentition, adjacent roots and whether the planned implant position can support the final restoration." },
    { n: 3, title: "Assess bone and soft tissue",            desc: "Use clinical examination and justified imaging to assess ridge width/height, defects, sinus/nerves, keratinised tissue, graft need and surgical access." },
    { n: 4, title: "Use CBCT appropriately",                  desc: "Justify CBCT where 3D information will change diagnosis, risk assessment or surgical planning. Record field of view, findings and reporting responsibility." },
    { n: 5, title: "Agree staged treatment and maintenance",  desc: "Explain extraction, healing, grafting, implant placement, integration, restoration, review, maintenance costs and failure or complication pathways." },
  ],

  safetyBox: {
    title: "Do not progress to implant surgery if",
    items: [
      "Active periodontitis, uncontrolled plaque, heavy smoking or uncontrolled diabetes has not been addressed.",
      "The restorative plan, bone volume or occlusion is unsuitable or unresolved.",
      "CBCT or imaging findings suggest anatomical risk beyond local competence.",
      "The patient has not accepted maintenance requirements and possible additional costs.",
      "There is untreated infection, suspicious pathology or medical risk requiring liaison/referral.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Periodontal and risk assessment recorded.",
    "Restorative-driven implant plan recorded.",
    "Radiograph/CBCT justification and findings recorded.",
    "Graft, sinus, guide or referral decisions recorded.",
    "Maintenance and consent discussion recorded.",
  ],

  clinicalSources: [
    IOS_REF.sdcepImplantCare,
    IOS_REF.localRadioCBCT,
    IOS_REF.gdcConsentCompetenceAlt,
    IOS_REF.localImplantRef,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to SDCEP dental implant care guidance, the practice's CBCT protocol, and GDC Standards on consent and competence.",
  },
};
