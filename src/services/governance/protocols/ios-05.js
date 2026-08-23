/**
 * Implants & Oral Surgery Clinical Protocol — IOS-05
 * Third Molar, Retained Root & Complex Extraction Pathway
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-05, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_05 = {
  id: "doc-ios-05",
  reference: "IOS-05",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Third Molar, Retained Root & Complex Extraction Pathway",
  subtitle: "Wisdom tooth assessment, coronectomy considerations, retained roots, nerve/sinus risk, imaging, consent, and referral criteria.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Third molars, retained roots, impacted teeth and extractions with high anatomical risk",
    frequency: "At assessment and before any surgical attempt",
    lead:      "Dentist / oral surgery lead / specialist provider where required",
    evidence:  "Complexity assessment, imaging review, consent and referral decision recorded",
  },

  standardLabel: "Complex-extraction standard",
  protocolStandard: "Third molars, retained roots and complex extractions require specific assessment of indication, anatomy, pathology, nerve or sinus proximity, patient factors and operator competence. Referral should be arranged before avoidable complications occur, not after repeated unsuccessful attempts.",

  workflow: [
    { n: 1, title: "Confirm the indication",            desc: "Record symptoms, pathology, recurrent pericoronitis, caries, periodontal impact, cystic change, orthodontic or restorative reasons and whether removal is actually needed." },
    { n: 2, title: "Assess anatomy and imaging",         desc: "Review root morphology, impaction, angulation, inferior alveolar canal proximity, lingual plate, sinus floor, adjacent teeth and retained root position." },
    { n: 3, title: "Consider options and alternatives",   desc: "Discuss monitoring, extraction, coronectomy where appropriate, leaving an asymptomatic root fragment, specialist referral and risks of intervention." },
    { n: 4, title: "Plan the surgical approach",          desc: "Confirm flap design, bone removal, sectioning, instrument set, nurse support, haemostasis, post-operative review and escalation arrangements." },
    { n: 5, title: "Refer early when indicated",          desc: "Refer if nerve/sinus risk, depth, access, medical complexity, anxiety, previous failed attempt or clinician experience makes in-practice care unsafe." },
  ],

  safetyBox: {
    title: "Referral triggers",
    items: [
      "Close radiographic relationship to the inferior alveolar nerve or high risk of lingual nerve injury.",
      "Complex impaction, limited access, unfavourable root morphology or risk of mandibular fracture.",
      "Root displacement, oro-antral communication risk or maxillary sinus involvement.",
      "Medically complex patient, anticoagulant uncertainty or high infection risk.",
      "Patient requires sedation, hospital setting or specialist-level consent discussion.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Indication for removal or monitoring recorded.",
    "Imaging findings and anatomical risks recorded.",
    "Options including referral and no-treatment option recorded.",
    "Nerve/sinus/fracture risks discussed where relevant.",
    "Referral decision and safety-netting recorded.",
  ],

  clinicalSources: [
    IOS_REF.niceBaosWisdom,
    IOS_REF.localOralSurgRef,
    IOS_REF.localRadioCBCT,
    IOS_REF.gdcConsentCompetenceAlt,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to NICE/BAOS wisdom tooth guidance resources, the practice's local oral surgery referral criteria and CBCT protocol, and GDC Standards on consent and competence.",
  },
};
