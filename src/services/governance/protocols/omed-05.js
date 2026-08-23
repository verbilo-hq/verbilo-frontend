/**
 * Oral Medicine Clinical Protocol — OMED-05
 * Dry Mouth (Xerostomia) Assessment & Management
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  OMED_CLINICAL_INTENT, OMED_LOCAL_SIGNOFF_NOTE, OMED_MINIMUM_RECORD_SET,
  OMED_VERSION_BASE, OMED_REF,
} from "./omed-common";

export const OMED_05 = {
  id: "doc-omed-05",
  reference: "OMED-05",
  packKey: "clinical_governance",
  category: "Oral Medicine",
  type: "sop",
  title: "Dry Mouth (Xerostomia) Assessment & Management",
  subtitle: "Causes of dry mouth, dental risk implications, salivary substitutes, prevention intensification and referral criteria.",

  clinicalIntent: OMED_CLINICAL_INTENT,
  localSignOffNote: OMED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with dry mouth symptoms or risk factors (medications, radiotherapy, Sjogren's)",
    frequency: "At presentation, at routine exam where relevant",
    lead:      "Dentist (with GP / oral medicine liaison where required)",
    evidence:  "Cause identified, prevention intensified, salivary substitute recommended, referral where indicated",
  },

  standardLabel: "Xerostomia standard",
  protocolStandard: "Dry mouth significantly increases caries, periodontal disease and mucosal disease risk. The clinician must identify modifiable causes, intensify prevention, recommend appropriate symptomatic relief and refer where serious underlying cause is suspected.",

  workflow: [
    { n: 1, title: "Assess symptoms and impact",          desc: "Ask about dryness frequency, eating/swallowing/speaking impact, taste alteration, halitosis. Use a brief tool (e.g. Challacombe scale of clinical oral dryness) where helpful." },
    { n: 2, title: "Identify likely cause",                 desc: "Medications (anticholinergics, antidepressants, antihypertensives, diuretics), radiotherapy, autoimmune disease (Sjogren's), diabetes, dehydration, mouth breathing." },
    { n: 3, title: "Intensify prevention",                   desc: "High-fluoride toothpaste where appropriate, frequent fluoride varnish, dietary advice (especially sugar frequency), close recall. Discuss with GP about medication review if appropriate." },
    { n: 4, title: "Recommend symptomatic relief",            desc: "Sugar-free gum, saliva substitutes (sprays, gels, lozenges), frequent sips of water. Avoid alcohol-containing mouthwashes. Discuss humidification at night." },
    { n: 5, title: "Refer where indicated",                    desc: "Refer to oral medicine if persistent unexplained, suspected Sjogren's, post-radiotherapy with significant impact, or persistent oral candidiasis." },
  ],

  safetyBox: {
    title: "Consider referral or further investigation if",
    items: [
      "Suspected Sjogren's (often with dry eyes, joint symptoms, salivary gland enlargement).",
      "Post-radiotherapy patient with significant impact on quality of life.",
      "Persistent candidiasis despite treatment.",
      "Unexplained xerostomia without obvious cause.",
      "Rapidly progressing caries despite intensive prevention.",
    ],
  },

  minimumRecordSet: OMED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Symptoms and likely cause recorded.",
    "Medication review with GP arranged where indicated.",
    "Prevention intensified per risk.",
    "Salivary substitute recommendation recorded.",
    "Referral made where indicated.",
  ],

  clinicalSources: [
    OMED_REF.bsomGuidance,
    OMED_REF.sdcepPrescribing,
    OMED_REF.fgdpStandards,
    OMED_REF.localOralMed,
  ],

  version: {
    ...OMED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSOM xerostomia guidance, SDCEP drug prescribing, FGDP/CGDent standards and local oral medicine referral pathway. Requires Clinical Director review and local approval before live adoption.",
  },
};
