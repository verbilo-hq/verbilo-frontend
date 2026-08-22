/**
 * Oral Medicine Clinical Protocol — OMED-07
 * Oral Manifestations of Systemic Disease
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  OMED_CLINICAL_INTENT, OMED_LOCAL_SIGNOFF_NOTE, OMED_MINIMUM_RECORD_SET,
  OMED_VERSION_BASE, OMED_REF,
} from "./omed-common";

export const OMED_07 = {
  id: "doc-omed-07",
  reference: "OMED-07",
  packKey: "clinical_governance",
  category: "Oral Medicine",
  type: "sop",
  title: "Oral Manifestations of Systemic Disease",
  subtitle: "Recognising oral signs of haematological, autoimmune, GI and endocrine disease and routing through to the GP / secondary care.",

  clinicalIntent: OMED_CLINICAL_INTENT,
  localSignOffNote: OMED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with oral signs that may reflect systemic disease",
    frequency: "At presentation and at review",
    lead:      "Dentist (with GP / specialist liaison)",
    evidence:  "Findings, differential, advice and referral plan",
  },

  standardLabel: "Systemic-link standard",
  protocolStandard: "The dental team is often the first to identify oral signs of undiagnosed systemic disease. Findings that suggest haematological, autoimmune, endocrine or GI conditions must be communicated to the patient and to the GP through a clear referral.",

  workflow: [
    { n: 1, title: "Note relevant medical history",      desc: "Update medical history, medications, symptoms (fatigue, weight loss, joint pain, GI symptoms, skin changes, eye symptoms)." },
    { n: 2, title: "Recognise common patterns",            desc: "Glossitis, angular cheilitis — iron/B12/folate deficiency. Petechiae — haematological. Recurrent candidiasis — diabetes/immunosuppression. Multiple aphthous — coeliac/IBD. Pigmentation changes — Addison's, drugs." },
    { n: 3, title: "Communicate sensitively",              desc: "Tell the patient what you've noticed and that you'd like the GP to investigate. Avoid alarming language; provide context — many findings have benign explanations." },
    { n: 4, title: "Write a clear GP letter",               desc: "Include findings, duration, your differential, and what specific investigations you suggest (e.g. FBC, haematinics, HbA1c, coeliac screen, autoantibodies)." },
    { n: 5, title: "Document and follow up",                desc: "Record findings, the referral, and follow up at next dental visit. Update the medical history once results are known." },
  ],

  decisionTable: {
    title: "Oral Findings — Systemic Differentials Guide",
    columns: ["Oral finding", "Consider"],
    rows: [
      ["Glossitis, angular cheilitis, recurrent aphthous",            "Iron, B12, folate deficiency; coeliac; IBD"],
      ["Persistent candidiasis",                                       "Diabetes, immunosuppression, HIV, inhaled steroids"],
      ["Petechiae or unexplained bleeding",                            "Thrombocytopenia, haematological malignancy, leukaemia"],
      ["Persistent ulceration with skin or eye involvement",            "Pemphigoid, pemphigus, Behcet's, SLE"],
      ["Pigmentation, hyperpigmentation",                              "Addison's, drug effect, smoker's melanosis (benign)"],
      ["Gingival hyperplasia not explained by plaque",                  "Drug-induced (phenytoin, ciclosporin, calcium channel blockers); leukaemia (rare)"],
      ["Burning, dry mouth, glossitis with eye/joint symptoms",         "Sjogren's syndrome"],
    ],
  },

  safetyBox: {
    title: "Refer urgently if",
    items: [
      "Unexplained petechiae, bruising or bleeding tendency.",
      "Rapid weight loss, fever or night sweats alongside oral findings.",
      "Possible haematological malignancy (gingival hyperplasia, petechiae, persistent fatigue).",
      "Severe persistent ulceration with systemic features.",
      "Pre-existing systemic disease appears to be decompensating.",
    ],
  },

  minimumRecordSet: OMED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Medical history reviewed in light of oral findings.",
    "Differential considered and documented.",
    "GP letter sent with specific suggested investigations.",
    "Patient communication recorded.",
    "Follow-up at next dental visit recorded.",
  ],

  clinicalSources: [
    OMED_REF.bsomGuidance,
    OMED_REF.fgdpStandards,
    OMED_REF.niceNG12,
    OMED_REF.gdcOpenness,
  ],

  version: {
    ...OMED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSOM guidance on oral medicine, FGDP/CGDent standards, NICE NG12 and GDC Standards on openness. Requires Clinical Director review and local approval before live adoption.",
  },
};
