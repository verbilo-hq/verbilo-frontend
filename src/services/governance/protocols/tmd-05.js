/**
 * TMD & Occlusion Clinical Protocol — TMD-05
 * TMD-Related Imaging & Referral Criteria
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  TMD_CLINICAL_INTENT, TMD_LOCAL_SIGNOFF_NOTE, TMD_MINIMUM_RECORD_SET,
  TMD_VERSION_BASE, TMD_REF,
} from "./tmd-common";

export const TMD_05 = {
  id: "doc-tmd-05",
  reference: "TMD-05",
  packKey: "clinical_governance",
  category: "TMD & Occlusion",
  type: "sop",
  title: "TMD-Related Imaging & Referral Criteria",
  subtitle: "When to image, which imaging to choose and when to refer to oral medicine, OMFS or orofacial pain services.",

  clinicalIntent: TMD_CLINICAL_INTENT,
  localSignOffNote: TMD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "TMD patients where imaging or specialist input may change management",
    frequency: "At assessment and at review where management is not progressing",
    lead:      "Dentist (specialist for advanced imaging interpretation)",
    evidence:  "Imaging justification, findings, referral letter and outcome",
  },

  standardLabel: "TMD-imaging standard",
  protocolStandard: "Imaging for TMD is justified only where it will change management. Most TMD does not need imaging. Referral to specialist services is appropriate where conservative management has failed, symptoms are atypical, or specialist input is needed.",

  workflow: [
    { n: 1, title: "Decide if imaging is needed",     desc: "Most muscle-source TMD does not need imaging. Image only if degenerative joint disease, intra-articular pathology, suspected fracture, malignancy or guidance from a specialist." },
    { n: 2, title: "Choose the right imaging",         desc: "Panoramic radiograph for screening of jaw / TMJ degeneration. MRI for soft-tissue and disc pathology (specialist initiated). CBCT for bony detail of the joint where indicated. Per IR(ME)R, justify and record." },
    { n: 3, title: "Refer where indicated",             desc: "Persistent TMD despite 12 weeks of management — orofacial pain or oral medicine. Suspected serious pathology — same-day OMFS / 2WW per OMED-02. Surgical TMJ — OMFS." },
    { n: 4, title: "Write a clear referral letter",     desc: "Include duration, what's been tried, current findings, working diagnosis, the question being asked of the specialist, and any imaging done. Avoid 'please see and advise'." },
    { n: 5, title: "Coordinate care",                    desc: "Maintain dental care in the practice while the specialist sees the patient. On receipt of the specialist letter, review the plan with the patient and integrate ongoing dental needs." },
  ],

  decisionTable: {
    title: "When to Refer for TMD",
    columns: ["Trigger", "Referral destination"],
    rows: [
      ["Persistent TMD > 12 weeks despite conservative + splint",   "Orofacial pain specialist / oral medicine"],
      ["Severe limited opening (suspected closed lock)",              "Orofacial pain specialist or OMFS"],
      ["Joint locking, dislocation",                                   "OMFS"],
      ["Suspected joint pathology (DJD, internal derangement) needing imaging", "Oral medicine / OMFS for MRI / CBCT"],
      ["Suspected sinister pathology (rapid progression, lump, weight loss)",   "Same-day OMFS / 2-week-wait (OMED-02)"],
      ["Significant psychosocial component",                            "Orofacial pain or pain clinic (often multidisciplinary)"],
    ],
  },

  safetyBox: {
    title: "Refer urgently if",
    items: [
      "Suspected malignancy.",
      "Rapidly progressive limitation of mouth opening.",
      "Neurological signs (paraesthesia, facial weakness).",
      "Suspected septic arthritis or rapidly worsening systemic illness.",
      "Jaw dislocation that cannot be reduced.",
    ],
  },

  minimumRecordSet: TMD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Imaging justification recorded per IR(ME)R.",
    "Imaging findings interpreted and documented.",
    "Referral letter written with specific question.",
    "Continuity of dental care maintained during referral.",
    "Specialist outcome integrated into the dental plan.",
  ],

  clinicalSources: [
    TMD_REF.niceCKSTMD,
    TMD_REF.rcsFDS,
    TMD_REF.localOFP,
    TMD_REF.fgdpStandards,
  ],

  version: {
    ...TMD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from NICE CKS on TMD, RCS Faculty of Dental Surgery guidance, local orofacial pain referral pathway and FGDP/CGDent standards. Requires Clinical Director review and local approval before live adoption.",
  },
};
