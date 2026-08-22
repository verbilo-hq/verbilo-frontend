/**
 * Endodontic Clinical Protocol — ENDO-10
 * Retreatment, Surgical Endodontics & Referral Pathways
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-10, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_10 = {
  id: "doc-endo-10",
  reference: "ENDO-10",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Retreatment, Surgical Endodontics & Referral Pathways",
  subtitle: "Retreatment indications, post removal, persistent apical disease, complex anatomy, apicectomy considerations, and specialist referral criteria.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Failed RCT, persistent apical disease and complex endodontic cases",
    frequency: "At assessment, treatment planning and review",
    lead:      "Dentist / specialist endodontic provider where required",
    evidence:  "Failure analysis, options, referral rationale and shared-care plan",
  },

  standardLabel: "Referral and retreatment standard",
  protocolStandard: "Retreatment should be planned only after identifying likely causes of failure, confirming restorability and considering prognosis, complexity and patient preference. Surgical endodontics or complex retreatment should be referred where beyond the clinician's competence or available equipment.",

  workflow: [
    { n: 1, title: "Confirm the problem",        desc: "Review symptoms, sinus tracts, periodontal status, occlusion, restoration quality, previous RCT quality and current radiographs. Consider CBCT only where justified." },
    { n: 2, title: "Assess why treatment failed", desc: "Consider missed canals, inadequate disinfection, leakage, fractured restoration, post/core issues, vertical root fracture, resorption or extraradicular pathology." },
    { n: 3, title: "Assess feasibility and risk", desc: "Review posts, cores, crowns, separated instruments, canal curvature, perforations, previous materials, remaining tooth tissue and ability to isolate." },
    { n: 4, title: "Discuss all options",         desc: "Explain non-surgical retreatment, surgical endodontics, extraction/replacement, monitoring, referral, costs, timescales and prognosis." },
    { n: 5, title: "Refer appropriately",         desc: "Use local referral criteria and include diagnosis, symptoms, radiographs, treatment history, medical history, restorability view and patient expectations." },
  ],

  safetyBox: {
    title: "Referral triggers",
    items: [
      "Severe curvature, calcified canals, resorption, open apex, immature root or unusual anatomy.",
      "Post removal with high perforation/fracture risk or complex restorative dismantling.",
      "Separated instrument, perforation, persistent infection or pain after guideline-quality treatment.",
      "Strategic tooth where failure would have major functional or restorative consequences.",
      "Complex medical, anxiety, limited opening or access factors beyond practice capability.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Reason for retreatment or referral recorded.",
    "Restorability and prognosis recorded.",
    "Options, risks, costs and likely outcomes discussed.",
    "Radiographs/images and previous treatment history included.",
    "Referral destination, urgency and shared-care plan recorded.",
  ],

  clinicalSources: [
    ENDO_REF.besGoodPractice,
    ENDO_REF.localReferralNHS,
    ENDO_REF.besPeriradicular,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to BES Guide to Good Endodontic Practice and BES guidance on periradicular surgery, plus local NHS/private endodontic referral criteria.",
  },
};
