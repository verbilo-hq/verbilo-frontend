/**
 * TMD & Occlusion Clinical Protocol — TMD-03
 * Splint Therapy — Indications & Design
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  TMD_CLINICAL_INTENT, TMD_LOCAL_SIGNOFF_NOTE, TMD_MINIMUM_RECORD_SET,
  TMD_VERSION_BASE, TMD_REF,
} from "./tmd-common";

export const TMD_03 = {
  id: "doc-tmd-03",
  reference: "TMD-03",
  packKey: "clinical_governance",
  category: "TMD & Occlusion",
  type: "sop",
  title: "Splint Therapy — Indications & Design",
  subtitle: "Indications, design choices (stabilisation, soft, anterior), impressions, fit and review for TMD splints.",

  clinicalIntent: TMD_CLINICAL_INTENT,
  localSignOffNote: TMD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "TMD patients not improving with conservative management, or with documented bruxism",
    frequency: "After 4–12 weeks of conservative management; at fit and review appointments",
    lead:      "Dentist",
    evidence:  "Indication, splint design, impression, fit and review notes",
  },

  standardLabel: "Splint standard",
  protocolStandard: "Splints are an evidence-based second-line management for TMD that has not responded to conservative care. The design and indication must be documented, and the patient must understand that splints are reversible adjuncts — not curative — and require review.",

  workflow: [
    { n: 1, title: "Confirm indication",            desc: "Conservative management (TMD-02) attempted and inadequate, persistent myalgia/arthralgia, documented bruxism causing tooth wear or muscle pain. Avoid splints as first-line." },
    { n: 2, title: "Choose the design",              desc: "Stabilisation (Michigan / Tanner) for most adult TMD — full coverage, hard acrylic. Soft splint for short-term bruxism management. Anterior repositioning only for specific TMJ indications, with caution and review." },
    { n: 3, title: "Capture impressions and prescribe lab", desc: "Take accurate full-arch impressions or scans. Prescribe the design clearly. Use a face-bow or articulator where the design requires balanced occlusion." },
    { n: 4, title: "Fit and adjust",                  desc: "Check fit, retention and occlusion. Aim for even contacts in MIP, canine guidance in lateral excursions for stabilisation splint. Adjust until balanced." },
    { n: 5, title: "Review at 1–2 weeks and beyond", desc: "Review at 1–2 weeks to adjust occlusion as the muscles relax. Review at 4–6 weeks for symptom progress. Reassess at 3 months — continue, modify or refer." },
  ],

  safetyBox: {
    title: "Be cautious — splints are not always benign",
    items: [
      "Anterior repositioning splints can cause permanent occlusal change — use only with specialist input.",
      "Soft splints can encourage clenching in some patients.",
      "Full-time wear of non-stabilisation splints risks occlusal change.",
      "Splints do not cure TMD — the patient must understand expectations.",
      "Symptoms not improving in 12 weeks of splint therapy warrants reassessment or referral.",
    ],
  },

  minimumRecordSet: TMD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Conservative management attempted before splint provision.",
    "Splint design and indication recorded.",
    "Impression / lab prescription documented.",
    "Fit and post-fit occlusion verified.",
    "Reviews scheduled and outcomes recorded.",
  ],

  clinicalSources: [
    TMD_REF.niceCKSTMD,
    TMD_REF.fgdpStandards,
    TMD_REF.rcsFDS,
    TMD_REF.mfrSplint,
  ],

  version: {
    ...TMD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from NICE CKS on TMD, FGDP/CGDent standards on occlusion, RCS Faculty of Dental Surgery guidance and manufacturer splint material instructions. Requires Clinical Director review and local approval before live adoption.",
  },
};
