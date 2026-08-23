/**
 * Oral Medicine Clinical Protocol — OMED-01
 * Oral Mucosal Examination & Cancer Screening Protocol
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  OMED_CLINICAL_INTENT, OMED_LOCAL_SIGNOFF_NOTE, OMED_MINIMUM_RECORD_SET,
  OMED_VERSION_BASE, OMED_REF,
} from "./omed-common";

export const OMED_01 = {
  id: "doc-omed-01",
  reference: "OMED-01",
  packKey: "clinical_governance",
  category: "Oral Medicine",
  type: "sop",
  title: "Oral Mucosal Examination & Cancer Screening Protocol",
  subtitle: "Systematic soft-tissue examination, risk-factor screening, documentation and the trigger for suspected-cancer referral.",

  clinicalIntent: OMED_CLINICAL_INTENT,
  localSignOffNote: OMED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Every patient attending for routine or new patient examination",
    frequency: "At every routine exam and recall",
    lead:      "Dentist (with hygienist/therapist support within scope)",
    evidence:  "Systematic soft-tissue examination record and any lesion findings",
  },

  standardLabel: "Mucosal-screening standard",
  protocolStandard: "Every routine dental examination must include a systematic soft-tissue examination of the lips, mucosa, palate, tongue (including lateral and ventral surfaces), floor of mouth and oropharynx. Findings — including 'NAD' — must be recorded, and risk factors (smoking, alcohol, HPV) discussed where appropriate.",

  workflow: [
    { n: 1, title: "Update risk-factor history",        desc: "Record smoking, smokeless tobacco, betel/areca nut, alcohol intake, HPV-relevant history. Use sensitive, non-judgemental language." },
    { n: 2, title: "Perform a systematic extra-oral exam", desc: "Inspect face, lips, cervical lymph nodes (submental, submandibular, deep cervical chains), salivary glands and skin." },
    { n: 3, title: "Perform a systematic intra-oral exam", desc: "Lips (vermilion, labial mucosa), buccal mucosa, hard and soft palate, tongue (dorsum, lateral borders, ventral surface — pull and inspect), floor of mouth, alveolar mucosa, oropharynx." },
    { n: 4, title: "Document findings",                  desc: "Record what was examined — including 'examination unremarkable'. For lesions, record site, size, shape, surface, colour, induration, mobility and any lymphadenopathy. Photograph where consent permits." },
    { n: 5, title: "Decide action",                       desc: "Reassure, monitor with documented review date, or escalate to OMED-02 (urgent 2-week-wait pathway). Discuss risk-factor change where modifiable." },
  ],

  safetyBox: {
    title: "Escalate immediately if",
    items: [
      "Persistent (>3 weeks) ulceration, induration or non-healing lesion without obvious cause.",
      "Unexplained red (erythroplakia) or red-and-white (speckled leukoplakia) patch.",
      "Lump or thickening of the cheek, neck or under the jaw.",
      "Persistent unexplained tooth mobility, paraesthesia or dysphagia.",
      "Lesion is changing in size, colour or texture between visits.",
    ],
  },

  minimumRecordSet: OMED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Soft-tissue exam recorded at every routine examination, not just 'NAD'.",
    "Risk factors (smoking, alcohol) updated and recorded.",
    "Any lesion described by site, size and characteristics.",
    "Photograph or sketch used where consent obtained.",
    "Review/referral decision recorded.",
  ],

  clinicalSources: [
    OMED_REF.niceNG12,
    OMED_REF.fgdpStandards,
    OMED_REF.bsomGuidance,
    OMED_REF.cruk,
    OMED_REF.bdaCancer,
  ],

  version: {
    ...OMED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from NICE NG12 suspected cancer referral, FGDP/CGDent standards on oral cancer screening, BSOM guidance and Cancer Research UK / BDA mouth cancer screening advice. Requires Clinical Director review and local approval before live adoption.",
  },
};
