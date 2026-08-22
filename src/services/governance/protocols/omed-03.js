/**
 * Oral Medicine Clinical Protocol — OMED-03
 * Common Mucosal Lesions — Diagnosis & Management
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  OMED_CLINICAL_INTENT, OMED_LOCAL_SIGNOFF_NOTE, OMED_MINIMUM_RECORD_SET,
  OMED_VERSION_BASE, OMED_REF,
} from "./omed-common";

export const OMED_03 = {
  id: "doc-omed-03",
  reference: "OMED-03",
  packKey: "clinical_governance",
  category: "Oral Medicine",
  type: "sop",
  title: "Common Mucosal Lesions — Diagnosis & Management",
  subtitle: "Recognising and managing geographic tongue, oral lichen planus, candidiasis, recurrent ulceration, fibroepithelial polyps and similar lesions.",

  clinicalIntent: OMED_CLINICAL_INTENT,
  localSignOffNote: OMED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with common mucosal lesions identified at examination or on complaint",
    frequency: "At presentation and at review",
    lead:      "Dentist (with specialist referral where indicated)",
    evidence:  "Diagnosis, photographs where appropriate, advice and review plan",
  },

  standardLabel: "Mucosal-diagnosis standard",
  protocolStandard: "Common mucosal lesions must be recognised, distinguished from suspicious lesions, and managed with appropriate advice or referral. The clinician must not 'reassure' a lesion that has features requiring escalation per OMED-02.",

  workflow: [
    { n: 1, title: "Take a focused history",        desc: "Onset, duration, pain, triggers, change over time, related medications, systemic symptoms, recurrence pattern, family history where relevant." },
    { n: 2, title: "Examine systematically",         desc: "Site, size, surface, colour, border, induration, mobility, distribution (unilateral/bilateral), lymphadenopathy." },
    { n: 3, title: "Form a clinical diagnosis",       desc: "Use pattern recognition for common conditions. Where atypical or worrying features are present, treat as suspicious and follow OMED-02." },
    { n: 4, title: "Manage or refer",                  desc: "Provide condition-specific advice and review. For complex or persistent cases, refer to oral medicine. For suspected malignancy, follow OMED-02 same day." },
    { n: 5, title: "Document and review",              desc: "Record diagnosis, photograph where consented, advice given, and review interval. Audit any lesion that does not respond as expected." },
  ],

  decisionTable: {
    title: "Common-Lesion Pattern Guide",
    columns: ["Lesion", "Typical features", "Action"],
    rows: [
      ["Geographic tongue",                  "Migrating erythematous patches with white borders on dorsum",                   "Reassure, advise on triggers (spicy food, stress); review only if symptomatic."],
      ["Oral lichen planus (reticular)",     "Bilateral white striae on buccal mucosa, often asymptomatic",                   "Photograph, monitor, refer if erosive, ulcerative or atypical; biopsy if uncertain."],
      ["Candidiasis (acute pseudomembranous)","White curd-like plaques wiping away to reveal red mucosa",                       "Treat with antifungal per SDCEP; investigate underlying cause (denture, steroid inhaler, diabetes)."],
      ["Recurrent aphthous ulceration",       "Recurrent painful round/oval ulcers, healing 7–14 days",                       "Topical advice, identify triggers; refer if persistent, atypical or systemic features."],
      ["Fibroepithelial polyp",               "Firm, non-tender, pedunculated swelling — typically buccal mucosa or tongue",   "Excisional biopsy where indicated; photograph and monitor; refer for excision if symptomatic."],
      ["Lichenoid reaction",                  "Localised lichen-planus-like reaction adjacent to a restoration or medication", "Identify causative agent; review after change; refer if persistent."],
    ],
  },

  safetyBox: {
    title: "Treat as suspicious and follow OMED-02 if",
    items: [
      "Lesion is persistent (>3 weeks), unilateral or hard.",
      "Surface is ulcerated, induced or non-healing.",
      "Colour is red, mixed red-and-white, or speckled.",
      "Patient has high-risk history (smoking, alcohol, previous oral cancer, HPV).",
      "Lesion is changing in appearance between visits.",
    ],
  },

  minimumRecordSet: OMED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Diagnosis and supporting features recorded.",
    "Photograph or sketch where consented.",
    "Advice or treatment provided documented.",
    "Review interval matches the diagnosis.",
    "Any lesion not responding to expected management re-evaluated.",
  ],

  clinicalSources: [
    OMED_REF.bsomGuidance,
    OMED_REF.niceNG12,
    OMED_REF.sdcepPrescribing,
    OMED_REF.fgdpStandards,
    OMED_REF.localOralMed,
  ],

  version: {
    ...OMED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSOM guidance on common oral mucosal lesions, NICE NG12 suspected cancer pathway, SDCEP drug prescribing for antifungals and FGDP/CGDent standards. Requires Clinical Director review and local approval before live adoption.",
  },
};
