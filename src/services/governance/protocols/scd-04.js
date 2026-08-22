/**
 * Special Care Dentistry Clinical Protocol — SCD-04
 * Patients with Learning Disability or Cognitive Impairment
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  SCD_CLINICAL_INTENT, SCD_LOCAL_SIGNOFF_NOTE, SCD_MINIMUM_RECORD_SET,
  SCD_VERSION_BASE, SCD_REF,
} from "./scd-common";

export const SCD_04 = {
  id: "doc-scd-04",
  reference: "SCD-04",
  packKey: "clinical_governance",
  category: "Special Care",
  type: "sop",
  title: "Patients with Learning Disability or Cognitive Impairment",
  subtitle: "Communication strategies, desensitisation, capacity assessment, dementia-friendly care and onward referral.",

  clinicalIntent: SCD_CLINICAL_INTENT,
  localSignOffNote: SCD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with learning disability, autism, dementia or other cognitive impairment",
    frequency: "At each appointment; reviewed across visits",
    lead:      "Dentist with SCD awareness (specialist referral as needed)",
    evidence:  "Communication strategy used, capacity considerations, desensitisation progress, care plan",
  },

  standardLabel: "Cognitive-care standard",
  protocolStandard: "Care for patients with learning disability or cognitive impairment must be patient-centred, anticipatory, and use evidence-based communication and behaviour strategies. The practice must avoid assumptions about capacity and prioritise inclusion.",

  workflow: [
    { n: 1, title: "Use appropriate communication",   desc: "Use easy-read information, pictures, social stories, Makaton, BSL or written communication as the patient prefers. Speak directly to the patient — not just the carer. Take time." },
    { n: 2, title: "Use anticipatory adjustments",    desc: "Pre-visit photographs of the practice, video tours, familiarisation visits, sensory-friendly times, predictable routines. Offer a quiet waiting area." },
    { n: 3, title: "Desensitisation over multiple visits", desc: "For dental-fearful or pre-cooperative patients, plan a graded approach across visits — entering the surgery, sitting in the chair, mirror examination, prophylaxis, treatment. Document progress." },
    { n: 4, title: "Assess capacity per SCD-02",       desc: "Apply the MCA two-stage test for each significant decision. Involve family/carers in best-interest decisions. Use IMCA where indicated." },
    { n: 5, title: "Plan dementia-friendly care",      desc: "Maintain consistent clinical team, use written reminders, schedule earlier in the day, involve the carer for history and post-op support. Consider domiciliary visits where appropriate." },
  ],

  safetyBox: {
    title: "Refer to specialist SCD service if",
    items: [
      "Treatment cannot be delivered with available behaviour support.",
      "Sedation or GA referral is needed (see SCD-06).",
      "Capacity issues are complex and unfamiliar to the team.",
      "Multiple co-existing conditions require specialist expertise.",
      "Domiciliary care is needed and not provided locally.",
    ],
  },

  minimumRecordSet: SCD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Communication strategy documented per patient.",
    "Anticipatory adjustments offered and used.",
    "Desensitisation progress tracked across visits.",
    "Capacity assessment recorded per SCD-02.",
    "Carer/family involvement documented appropriately.",
  ],

  clinicalSources: [
    SCD_REF.bsdhStandards,
    SCD_REF.mcaCodeOfPractice,
    SCD_REF.equalityAct,
    SCD_REF.nhseSpecialCare,
    SCD_REF.gdcDiscrimination,
  ],

  version: {
    ...SCD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSDH Standards in Special Care Dentistry, MCA Code of Practice, the Equality Act 2010, NHS England commissioning standards and GDC Standards on non-discrimination. Requires Clinical Director review and local approval before live adoption.",
  },
};
