/**
 * Special Care Dentistry Clinical Protocol — SCD-01
 * Special Care Assessment & Care Planning
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  SCD_CLINICAL_INTENT, SCD_LOCAL_SIGNOFF_NOTE, SCD_MINIMUM_RECORD_SET,
  SCD_VERSION_BASE, SCD_REF,
} from "./scd-common";

export const SCD_01 = {
  id: "doc-scd-01",
  reference: "SCD-01",
  packKey: "clinical_governance",
  category: "Special Care",
  type: "sop",
  title: "Special Care Assessment & Care Planning",
  subtitle: "Holistic assessment, reasonable adjustments, supported decision-making and treatment planning for patients with additional needs.",

  clinicalIntent: SCD_CLINICAL_INTENT,
  localSignOffNote: SCD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with disability, complex medical conditions, cognitive impairment or other additional needs",
    frequency: "At new patient assessment and whenever needs or circumstances change",
    lead:      "Dentist with special-care awareness (referral to specialist SCD service where indicated)",
    evidence:  "Holistic assessment, reasonable adjustments made, care plan agreed, referral where appropriate",
  },

  standardLabel: "SCD-assessment standard",
  protocolStandard: "Patients with additional needs require a holistic assessment that goes beyond a routine dental examination. The practice must offer reasonable adjustments under the Equality Act 2010, plan care collaboratively with the patient, family and support network, and refer to specialist services where needs exceed local capability.",

  workflow: [
    { n: 1, title: "Pre-visit planning",                desc: "Where possible, gather information before the visit — referral letter, care plan, GP/specialist letters. Identify communication needs (BSL, easy-read, accessible formats). Plan appointment length and quiet timing." },
    { n: 2, title: "Welcome and accessibility",          desc: "Confirm reasonable adjustments (wheelchair access, lighting, sensory needs, support person). Introduce the team. Use the patient's preferred name and pronouns." },
    { n: 3, title: "Take a holistic history",             desc: "Medical history, medications, mobility, communication, cognitive function, social circumstances, support network, eating/swallowing, anxiety, capacity considerations and care priorities." },
    { n: 4, title: "Examine within tolerance",            desc: "Adapt the examination to the patient's tolerance — partial exam better than no exam; use mirror and oxygen on standby where indicated for sensitive patients." },
    { n: 5, title: "Agree the care plan",                  desc: "Plan around realistic priorities (pain relief, prevention, function, aesthetics in that order if needed). Discuss with patient and supporter. Refer to specialist SCD service if needs exceed local scope." },
  ],

  safetyBox: {
    title: "Refer to specialist SCD service if",
    items: [
      "Treatment complexity exceeds practice competence or environment.",
      "Significant capacity, behavioural or medical complexity needs specialist input.",
      "Sedation or GA referral is needed (see SCD-06).",
      "Domiciliary care is required and not available locally.",
      "Local accessibility cannot meet the patient's needs.",
    ],
  },

  minimumRecordSet: SCD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Pre-visit planning and adjustments recorded.",
    "Communication preferences documented.",
    "Holistic assessment recorded — not just dental.",
    "Care plan reflects patient priorities and capacity.",
    "Referral to specialist service made where indicated.",
  ],

  clinicalSources: [
    SCD_REF.bsdhStandards,
    SCD_REF.equalityAct,
    SCD_REF.nhseSpecialCare,
    SCD_REF.gdcDiscrimination,
    SCD_REF.gdcConsentRecords,
  ],

  version: {
    ...SCD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSDH Standards in Special Care Dentistry, the Equality Act 2010, NHS England commissioning standards and GDC Standards. Requires Clinical Director review and local approval before live adoption.",
  },
};
