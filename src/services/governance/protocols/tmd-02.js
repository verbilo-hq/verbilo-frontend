/**
 * TMD & Occlusion Clinical Protocol — TMD-02
 * Conservative Management of TMD
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  TMD_CLINICAL_INTENT, TMD_LOCAL_SIGNOFF_NOTE, TMD_MINIMUM_RECORD_SET,
  TMD_VERSION_BASE, TMD_REF,
} from "./tmd-common";

export const TMD_02 = {
  id: "doc-tmd-02",
  reference: "TMD-02",
  packKey: "clinical_governance",
  category: "TMD & Occlusion",
  type: "sop",
  title: "Conservative Management of TMD",
  subtitle: "Reversible, evidence-based first-line care — self-care, jaw exercises, dietary advice, analgesia and reassurance.",

  clinicalIntent: TMD_CLINICAL_INTENT,
  localSignOffNote: TMD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with myogenous or joint-source TMD on first presentation",
    frequency: "First-line approach over 4–12 weeks before considering further intervention",
    lead:      "Dentist (with physiotherapy / orofacial pain referral if needed)",
    evidence:  "Advice provided, exercises prescribed, follow-up outcome",
  },

  standardLabel: "Conservative-TMD standard",
  protocolStandard: "TMD must be managed first with reversible, evidence-based interventions — patient education, self-care, jaw exercises, dietary advice and simple analgesia. Most patients improve significantly with this approach within 4–12 weeks.",

  workflow: [
    { n: 1, title: "Explain the condition simply",     desc: "Reassure that TMD is common, usually benign and often self-limiting. Avoid medicalising. Use the practice TMD self-care leaflet." },
    { n: 2, title: "Advise on self-care",                desc: "Avoid wide opening, hard/chewy foods, gum, nail biting. Apply moist heat or ice for symptomatic relief. Maintain good sleep hygiene. Reduce caffeine if appropriate." },
    { n: 3, title: "Prescribe jaw exercises",            desc: "Gentle range-of-motion exercises, controlled opening, posture awareness. Refer to physiotherapy for hands-on treatment where indicated." },
    { n: 4, title: "Manage pain pharmacologically",      desc: "Per SDCEP prescribing — paracetamol and NSAIDs short-term. Avoid long courses. Do not prescribe opioids for chronic TMD." },
    { n: 5, title: "Review and reassess",                 desc: "Reassess at 4–6 weeks. If improving, continue. If not improving, consider splint therapy (TMD-03) or referral (TMD-06)." },
  ],

  safetyBox: {
    title: "Escalate if not improving by 12 weeks",
    items: [
      "No symptomatic improvement despite documented conservative care.",
      "Symptoms are worsening or function is increasingly limited.",
      "Sleep, work or quality of life is significantly affected.",
      "Patient is using analgesics inappropriately to cope.",
      "Imaging or specialist input would change management.",
    ],
  },

  minimumRecordSet: TMD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Diagnosis recorded per TMD-01 before management.",
    "Self-care advice and leaflet provided.",
    "Exercises prescribed and recorded.",
    "Analgesia prescribed per SDCEP.",
    "4–6 week review attended and outcome recorded.",
  ],

  clinicalSources: [
    TMD_REF.niceCKSTMD,
    TMD_REF.sdcepPrescribing,
    TMD_REF.rcsFDS,
    TMD_REF.practicePainAdvice,
  ],

  version: {
    ...TMD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from NICE CKS on TMD, SDCEP drug prescribing, RCS Faculty of Dental Surgery guidance and the practice's TMD self-care leaflet. Requires Clinical Director review and local approval before live adoption.",
  },
};
