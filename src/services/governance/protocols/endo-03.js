/**
 * Endodontic Clinical Protocol — ENDO-03
 * Endodontic Consent & Patient Communication
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-03, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_03 = {
  id: "doc-endo-03",
  reference: "ENDO-03",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Endodontic Consent & Patient Communication",
  subtitle: "Treatment options, risks, benefits, likely outcomes, costs, number of visits, aftercare, failure risk, and restoration needs.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients offered RCT, retreatment or endodontic referral",
    frequency: "Before treatment and whenever the plan changes",
    lead:      "Dentist",
    evidence:  "Consent discussion, written plan and patient questions recorded",
  },

  standardLabel: "Consent standard",
  protocolStandard: "Consent is a discussion, not a signature. The patient must understand the diagnosis, reasonable options, material risks, benefits, limitations, likely costs and the need for a definitive restoration. Consent must be revisited if new findings or complications alter the plan.",

  workflow: [
    { n: 1, title: "Explain the diagnosis in plain language", desc: "Describe whether the nerve is inflamed, infected, necrotic or whether infection is present around the root. Check the patient understands why RCT is being offered." },
    { n: 2, title: "Explain reasonable options",               desc: "Discuss RCT, no treatment or monitoring where appropriate, extraction and replacement options, referral and emergency-only stabilisation if relevant." },
    { n: 3, title: "Explain material risks",                   desc: "Include discomfort, swelling, flare-up, persistent infection, failure, fracture, perforation, separated instruments, missed canals, need for retreatment, referral or extraction." },
    { n: 4, title: "Explain practical commitments",            desc: "Discuss number of visits, rubber dam, local anaesthetic, radiographs, temporary dressings, aftercare, review and costs." },
    { n: 5, title: "Explain the restoration plan",             desc: "Make clear that RCT is not complete without a good coronal seal and that posterior teeth often need cuspal coverage." },
  ],

  safetyBox: {
    title: "Communication safeguards",
    items: [
      "Do not imply RCT is guaranteed to save the tooth indefinitely.",
      "Do not start treatment if the patient only understands emergency pain relief but not definitive options.",
      "Where prognosis is guarded, record the reason and confirm whether the patient still wishes to proceed.",
      "For language, capacity or anxiety barriers, use appropriate support and record how understanding was checked.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Diagnosis and options explained.",
    "Material risks and limitations explained.",
    "Costs and number of visits discussed.",
    "Definitive restoration and review requirements explained.",
    "Patient questions answered and consent recorded.",
  ],

  clinicalSources: [
    ENDO_REF.gdcConsent,
    ENDO_REF.besGoodPractice,
    ENDO_REF.localConsent,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to GDC Standards on valid consent and BES Guide to Good Endodontic Practice.",
  },
};
