/**
 * Oral Medicine Clinical Protocol — OMED-04
 * Oral Ulceration — Causes, Workup & Referral
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  OMED_CLINICAL_INTENT, OMED_LOCAL_SIGNOFF_NOTE, OMED_MINIMUM_RECORD_SET,
  OMED_VERSION_BASE, OMED_REF,
} from "./omed-common";

export const OMED_04 = {
  id: "doc-omed-04",
  reference: "OMED-04",
  packKey: "clinical_governance",
  category: "Oral Medicine",
  type: "sop",
  title: "Oral Ulceration — Causes, Workup & Referral",
  subtitle: "Differential diagnosis of oral ulceration — traumatic, recurrent aphthous, infective, systemic, malignant — and the threshold for referral.",

  clinicalIntent: OMED_CLINICAL_INTENT,
  localSignOffNote: OMED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients presenting with oral ulceration of any duration",
    frequency: "At presentation and at review",
    lead:      "Dentist (oral medicine referral where indicated)",
    evidence:  "Ulcer characteristics, working diagnosis, advice, review or referral",
  },

  standardLabel: "Ulceration standard",
  protocolStandard: "Oral ulceration must be assessed systematically. Persistent (>3 weeks) ulcers without a clear cause trigger the suspected-cancer pathway. Recurrent ulceration warrants investigation for systemic causes.",

  workflow: [
    { n: 1, title: "Take an ulcer-focused history",   desc: "Onset, duration, pain, recurrence pattern, location, number, healing time, triggers, systemic symptoms, medications, recent illness, dietary history." },
    { n: 2, title: "Examine the ulcer",                 desc: "Site, size, shape, edge, base, induration, regional lymph nodes, extra-oral lesions, related skin or eye involvement, denture/orthodontic trauma sources." },
    { n: 3, title: "Identify the most likely cause",    desc: "Traumatic (denture, sharp tooth, bite), recurrent aphthous, infective (HSV, hand-foot-mouth), drug-related, autoimmune (Behcet's, lichen planus erosive), systemic (haematinic deficiency, IBD), suspected malignancy." },
    { n: 4, title: "Manage or investigate",              desc: "Remove trauma source. Topical advice or antimicrobial mouthwash as indicated. Refer to GP for haematinics if recurrent. Refer to oral medicine for atypical or persistent ulceration." },
    { n: 5, title: "Safety-net and review",              desc: "Tell the patient when to expect resolution and when to return. Document review interval. Persistent ulcers (>3 weeks) without explanation require OMED-02 same-day referral." },
  ],

  decisionTable: {
    title: "Ulceration Differential Guide",
    columns: ["Pattern", "Likely cause", "Action"],
    rows: [
      ["Single, related to trauma source",                      "Traumatic ulcer",                       "Remove cause; review in 2 weeks; refer if not healed."],
      ["Single, persistent > 3 weeks, no cause",                "Suspected malignancy",                  "Same-day 2-week-wait referral per OMED-02."],
      ["Recurrent crops of small ulcers, healing 7–14 days",     "Recurrent aphthous stomatitis",         "Trigger advice, GP for haematinics, refer if severe."],
      ["Painful clusters with vesicles, often febrile",          "Viral (HSV, hand-foot-mouth, herpangina)","Supportive care, hygiene; refer if severe or immunocompromised."],
      ["Erosive widespread lesions, often skin/eye involvement", "Autoimmune (e.g. pemphigoid, Behcet's)", "Oral medicine referral; biopsy usually required."],
      ["Recurrent with GI symptoms, weight loss",                "Possible IBD / coeliac",               "Refer to GP for haematinics and gastroenterology workup."],
    ],
  },

  safetyBox: {
    title: "Same-day referral if",
    items: [
      "Persistent ulcer > 3 weeks without explanation — follow OMED-02.",
      "Ulcer is hard, fixed or has rolled borders.",
      "Associated unexplained neck lump or paraesthesia.",
      "Patient is immunocompromised or has high-risk history.",
      "Severe recurrent ulceration with systemic features.",
    ],
  },

  minimumRecordSet: OMED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Ulcer site, size, duration and characteristics recorded.",
    "Cause considered and working diagnosis documented.",
    "Photograph or sketch where consented.",
    "Advice/treatment and review interval documented.",
    "Persistent or atypical ulcers escalated within local pathway.",
  ],

  clinicalSources: [
    OMED_REF.bsomGuidance,
    OMED_REF.niceNG12,
    OMED_REF.sdcepPrescribing,
    OMED_REF.localOralMed,
    OMED_REF.gdcConsentRecords,
  ],

  version: {
    ...OMED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSOM oral ulceration guidance, NICE NG12 suspected cancer referral, SDCEP drug prescribing and local oral medicine referral pathway. Requires Clinical Director review and local approval before live adoption.",
  },
};
