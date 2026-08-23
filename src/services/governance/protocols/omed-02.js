/**
 * Oral Medicine Clinical Protocol — OMED-02
 * Suspected Oral Cancer — Urgent (2-Week-Wait) Referral Pathway
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  OMED_CLINICAL_INTENT, OMED_LOCAL_SIGNOFF_NOTE, OMED_MINIMUM_RECORD_SET,
  OMED_VERSION_BASE, OMED_REF,
} from "./omed-common";

export const OMED_02 = {
  id: "doc-omed-02",
  reference: "OMED-02",
  packKey: "clinical_governance",
  category: "Oral Medicine",
  type: "sop",
  title: "Suspected Oral Cancer — Urgent (2-Week-Wait) Referral Pathway",
  subtitle: "NICE NG12-aligned criteria, referral template, patient communication and safety-netting.",

  clinicalIntent: OMED_CLINICAL_INTENT,
  localSignOffNote: OMED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Any patient with a clinical finding meeting NICE NG12 suspected cancer criteria",
    frequency: "On detection — same-day referral",
    lead:      "Treating dentist",
    evidence:  "Clinical findings, NICE-aligned criteria met, referral form sent, patient communication",
  },

  standardLabel: "Suspected-cancer-referral standard",
  protocolStandard: "Suspected oral cancer must trigger an urgent suspected-cancer (2-week-wait) referral on the same day as detection per NICE NG12. The patient must be told why they are being referred, what to expect, and how to seek help if symptoms change before the appointment.",

  workflow: [
    { n: 1, title: "Apply NICE NG12 criteria",          desc: "Refer urgently for unexplained lump in the neck, persistent (>3 weeks) ulceration of oral mucosa, persistent oral red or red-and-white patch, or unexplained tooth mobility/paraesthesia not associated with dental cause." },
    { n: 2, title: "Discuss with the patient",            desc: "Explain that the referral is to rule out serious disease, that quick referral is precautionary, and that most referrals do not turn out to be cancer. Provide written information." },
    { n: 3, title: "Complete the referral form fully",     desc: "Use the local 2-week-wait template. Include site, size, duration, photographs where available, risk factors and current findings. Avoid 'monitor and re-refer if no better'." },
    { n: 4, title: "Send the referral the same day",       desc: "Fax/secure email or upload to the local pathway the same day. Confirm receipt where possible. Record the referral in the patient's notes." },
    { n: 5, title: "Safety-net the patient",                desc: "Tell the patient to contact the referral centre if not seen within 2 weeks. Advise to return to the practice if symptoms worsen. Document the safety-net advice." },
  ],

  decisionTable: {
    title: "NICE NG12 — Suspected Oral Cancer Referral Triggers",
    columns: ["Finding", "Action"],
    rows: [
      ["Unexplained neck lump",                                                  "Urgent 2-week-wait referral."],
      ["Persistent unexplained oral ulceration > 3 weeks",                        "Urgent 2-week-wait referral."],
      ["Persistent oral red or red-and-white patch",                              "Urgent 2-week-wait referral."],
      ["Unexplained tooth mobility / paraesthesia without dental cause",          "Urgent 2-week-wait referral."],
      ["Lesion that has resolved on review at 3 weeks (e.g. traumatic ulcer)",    "Document resolution; no referral needed but document baseline."],
    ],
  },

  safetyBox: {
    title: "Do not delay the referral if",
    items: [
      "You are uncertain — refer rather than monitor.",
      "Awaiting biopsy — the 2-week-wait referral is for the specialist to plan investigation.",
      "The patient declines — record the discussion, advice given and any future safety-net.",
      "Site is hard to photograph or hard to describe — the specialist will examine.",
      "Concurrent dental treatment is needed — proceed with referral; treat in parallel.",
    ],
  },

  minimumRecordSet: OMED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "NICE NG12 criteria met and recorded.",
    "Same-day referral sent and confirmed.",
    "Patient communication and information leaflet provided.",
    "Safety-net advice documented.",
    "Outcome of referral (if known) added to the patient record.",
  ],

  clinicalSources: [
    OMED_REF.niceNG12,
    OMED_REF.bsomGuidance,
    OMED_REF.local2WW,
    OMED_REF.fgdpStandards,
    OMED_REF.gdcOpenness,
  ],

  version: {
    ...OMED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from NICE NG12 suspected cancer referral pathway, BSOM guidance, local 2-week-wait referral arrangements and FGDP/CGDent standards. Requires Clinical Director review and local approval before live adoption.",
  },
};
