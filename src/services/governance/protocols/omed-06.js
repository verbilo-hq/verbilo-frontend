/**
 * Oral Medicine Clinical Protocol — OMED-06
 * Burning Mouth Syndrome & Orofacial Pain Triage
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  OMED_CLINICAL_INTENT, OMED_LOCAL_SIGNOFF_NOTE, OMED_MINIMUM_RECORD_SET,
  OMED_VERSION_BASE, OMED_REF,
} from "./omed-common";

export const OMED_06 = {
  id: "doc-omed-06",
  reference: "OMED-06",
  packKey: "clinical_governance",
  category: "Oral Medicine",
  type: "sop",
  title: "Burning Mouth Syndrome & Orofacial Pain Triage",
  subtitle: "Differentiating odontogenic from non-odontogenic pain, BMS workup, neuropathic features and the referral threshold.",

  clinicalIntent: OMED_CLINICAL_INTENT,
  localSignOffNote: OMED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with persistent oral pain or burning without an obvious dental cause",
    frequency: "At presentation; review interval matched to severity and progress",
    lead:      "Dentist (with oral medicine / orofacial pain specialist liaison)",
    evidence:  "Pain history, differential considered, workup done, advice and referral plan",
  },

  standardLabel: "Orofacial-pain triage standard",
  protocolStandard: "Persistent oral pain without an identifiable dental cause must not be 'managed' by repeated irreversible dental treatment. The clinician must consider neuropathic, mucosal, systemic and psychological contributors and refer where competence is exceeded.",

  workflow: [
    { n: 1, title: "Take a structured pain history",      desc: "Site, onset, quality (burning, sharp, dull, throbbing), duration, triggers, relievers, radiation, impact on sleep, life events, prior treatments and their effect." },
    { n: 2, title: "Rule out dental causes",                desc: "Examine teeth, restorations, periodontium, occlusion. Vitality testing where appropriate. Imaging only where justified." },
    { n: 3, title: "Consider non-dental causes",             desc: "Burning mouth syndrome (idiopathic, often bilateral, no clinical findings), neuropathic pain, TMD (link to TMD-01), sinus disease, salivary gland disease, neuralgia, oral candidiasis, haematinic deficiency." },
    { n: 4, title: "Arrange basic investigations or referral", desc: "GP for blood tests (haematinics, glucose, thyroid) where indicated. Refer to oral medicine or orofacial pain specialist for persistent pain without dental cause." },
    { n: 5, title: "Avoid irreversible treatment",            desc: "Do not extract or restore teeth in an attempt to resolve unexplained pain. Manage symptoms with topical advice where appropriate and refer in parallel." },
  ],

  safetyBox: {
    title: "Do not perform irreversible treatment if",
    items: [
      "No clear dental cause has been identified for the pain.",
      "Pain pattern is neuropathic (burning, electric-shock, allodynia, hyperalgesia).",
      "Previous similar treatment did not resolve symptoms.",
      "The patient describes the pain as 'moving' or affecting multiple unrelated sites.",
      "Specialist input has not been sought for persistent pain.",
    ],
  },

  minimumRecordSet: OMED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Structured pain history recorded.",
    "Dental causes ruled out before non-dental differential.",
    "Blood test or specialist referral arranged where appropriate.",
    "Irreversible treatment paused until cause identified.",
    "Referral and follow-up plan documented.",
  ],

  clinicalSources: [
    OMED_REF.bsomGuidance,
    OMED_REF.sdcepPrescribing,
    OMED_REF.fgdpStandards,
    OMED_REF.localOralMed,
  ],

  version: {
    ...OMED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSOM guidance on burning mouth syndrome and orofacial pain, SDCEP drug prescribing, FGDP/CGDent standards and local oral medicine referral pathway. Requires Clinical Director review and local approval before live adoption.",
  },
};
