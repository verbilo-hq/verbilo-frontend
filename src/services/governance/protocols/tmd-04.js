/**
 * TMD & Occlusion Clinical Protocol — TMD-04
 * Parafunction Management (Bruxism, Clenching)
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  TMD_CLINICAL_INTENT, TMD_LOCAL_SIGNOFF_NOTE, TMD_MINIMUM_RECORD_SET,
  TMD_VERSION_BASE, TMD_REF,
} from "./tmd-common";

export const TMD_04 = {
  id: "doc-tmd-04",
  reference: "TMD-04",
  packKey: "clinical_governance",
  category: "TMD & Occlusion",
  type: "sop",
  title: "Parafunction Management (Bruxism, Clenching)",
  subtitle: "Recognising bruxism, addressing contributing factors, splint therapy decisions and managing restorative consequences.",

  clinicalIntent: TMD_CLINICAL_INTENT,
  localSignOffNote: TMD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with sleep bruxism, awake bruxism / clenching, or restorative consequences of parafunction",
    frequency: "At assessment and at recall",
    lead:      "Dentist",
    evidence:  "Diagnosis, contributing factors, splint or restorative plan, review outcome",
  },

  standardLabel: "Parafunction standard",
  protocolStandard: "Parafunction is a behaviour, not a disease, but its consequences — tooth wear, muscle pain, restoration fracture — must be recognised and managed. Splints protect teeth and may reduce symptoms but do not stop parafunction; behavioural and contributory factor management is essential.",

  workflow: [
    { n: 1, title: "Recognise the signs",            desc: "Tooth wear (attrition), masseter hypertrophy, scalloped tongue, linea alba, restoration fracture, morning jaw stiffness, headaches, partner-reported sleep grinding." },
    { n: 2, title: "Identify contributing factors",  desc: "Stress, sleep disorders (consider OSA referral if loud snoring + grinding), caffeine, alcohol, smoking, medications (SSRIs, stimulants), reflux." },
    { n: 3, title: "Patient education",                desc: "Explain bruxism, its consequences and that it is not curable by dental treatment. Awareness, stress management and addressing sleep are key." },
    { n: 4, title: "Splint therapy where indicated",    desc: "Stabilisation splint to protect teeth and may reduce muscle symptoms (TMD-03). Manage expectations — splint protects teeth, doesn't stop the bruxism." },
    { n: 5, title: "Manage restorative consequences",  desc: "Address worn dentition (see RES-10) carefully. Avoid extensive restorative reconstruction in an actively bruxing patient without addressing the parafunction." },
  ],

  safetyBox: {
    title: "Consider medical referral if",
    items: [
      "Severe sleep bruxism with loud snoring or apnoea symptoms — sleep medicine referral.",
      "Bruxism appears to relate to medication side effect — GP review.",
      "Significant psychological distress is driving parafunction.",
      "Parafunction is destroying teeth and behavioural change is not achievable in dental care alone.",
      "Botulinum toxin therapy is requested — specialist referral.",
    ],
  },

  minimumRecordSet: TMD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Bruxism signs documented at exam.",
    "Contributing factors discussed and recorded.",
    "Patient education recorded.",
    "Splint provision rationale and outcome recorded.",
    "Restorative implications managed appropriately.",
  ],

  clinicalSources: [
    TMD_REF.niceCKSTMD,
    TMD_REF.rcsFDS,
    TMD_REF.fgdpStandards,
    TMD_REF.practicePainAdvice,
  ],

  version: {
    ...TMD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from NICE CKS on TMD, RCS Faculty of Dental Surgery guidance, FGDP/CGDent standards on occlusion and the practice's TMD self-care leaflet. Requires Clinical Director review and local approval before live adoption.",
  },
};
