/**
 * TMD & Occlusion Clinical Protocol — TMD-06
 * Persistent Orofacial Pain — When to Refer
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  TMD_CLINICAL_INTENT, TMD_LOCAL_SIGNOFF_NOTE, TMD_MINIMUM_RECORD_SET,
  TMD_VERSION_BASE, TMD_REF,
} from "./tmd-common";

export const TMD_06 = {
  id: "doc-tmd-06",
  reference: "TMD-06",
  packKey: "clinical_governance",
  category: "TMD & Occlusion",
  type: "sop",
  title: "Persistent Orofacial Pain — When to Refer",
  subtitle: "Chronic pain management, neuropathic features, multidisciplinary care and the threshold for specialist referral.",

  clinicalIntent: TMD_CLINICAL_INTENT,
  localSignOffNote: TMD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with persistent (>3 months) orofacial pain despite conservative care",
    frequency: "At review where pain is not resolving",
    lead:      "Dentist (orofacial pain or pain clinic for specialist input)",
    evidence:  "Pain history, conservative management attempted, referral decision and outcome",
  },

  standardLabel: "Persistent-pain referral standard",
  protocolStandard: "Persistent orofacial pain is a multidisciplinary problem. The clinician must not pursue irreversible dental treatment in an attempt to resolve unexplained chronic pain and must refer for specialist input — orofacial pain service or multidisciplinary pain clinic — at the appropriate point.",

  workflow: [
    { n: 1, title: "Confirm pain has been thoroughly assessed", desc: "Cross-check with OMED-06 if non-odontogenic pain has been considered. Confirm TMD-01 classification. Document the duration and management trajectory." },
    { n: 2, title: "Look for neuropathic features",              desc: "Burning, electric-shock, allodynia, hyperalgesia, well-defined dermatomes, response to neuropathic agents. Consider trigeminal neuralgia, postherpetic neuralgia, persistent idiopathic facial pain." },
    { n: 3, title: "Avoid irreversible dental treatment",         desc: "Do not extract, restore or perform endodontic treatment in an attempt to manage unexplained chronic pain. Document why irreversible treatment is being deferred." },
    { n: 4, title: "Refer for multidisciplinary care",             desc: "Orofacial pain service, oral medicine, pain clinic, neurology depending on the presentation. Use the local pathway. Provide a clear, structured referral letter." },
    { n: 5, title: "Support the patient in parallel",              desc: "Acknowledge the pain. Address sleep, mood, function. Avoid implying the pain is 'in their head'. Coordinate dental care alongside specialist management." },
  ],

  safetyBox: {
    title: "Refer urgently if",
    items: [
      "Trigeminal neuralgia features (electric shocks, brief paroxysms, trigger zones) — neurology referral.",
      "Suspected sinister cause (rapid progression, weight loss, neurological signs).",
      "Patient distress is severe or there is suicidal ideation — safeguarding and same-day GP/A&E.",
      "Pain is unresponsive to standard analgesia and is affecting function critically.",
      "Diagnostic uncertainty after structured workup.",
    ],
  },

  minimumRecordSet: TMD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Pain duration and trajectory documented.",
    "Conservative management trial recorded.",
    "Irreversible dental treatment paused with rationale.",
    "Referral letter sent with specific question.",
    "Multidisciplinary care coordinated.",
  ],

  clinicalSources: [
    TMD_REF.niceCKSTMD,
    TMD_REF.rcsFDS,
    TMD_REF.localOFP,
    TMD_REF.gdcConsentRecords,
  ],

  version: {
    ...TMD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from NICE CKS on TMD, RCS Faculty of Dental Surgery guidance, local orofacial pain referral pathway and GDC Standards on records. Cross-references OMED-06 (orofacial pain triage). Requires Clinical Director review and local approval before live adoption.",
  },
};
