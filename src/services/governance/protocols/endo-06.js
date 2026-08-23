/**
 * Endodontic Clinical Protocol — ENDO-06
 * Access Cavity, Canal Location & Working Length
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-06, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_06 = {
  id: "doc-endo-06",
  reference: "ENDO-06",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Access Cavity, Canal Location & Working Length",
  subtitle: "Access design, canal location, straight-line access, glide path, apex locator use, radiographic checks, and working length records.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Primary RCT, retreatment and emergency canal access",
    frequency: "At access and preparation visits",
    lead:      "Dentist",
    evidence:  "Access findings, canals located, working lengths and reference points recorded",
  },

  standardLabel: "Technical standard",
  protocolStandard: "Access should preserve tooth tissue while allowing safe canal location, irrigation and instrumentation. Working length must be established and recorded using appropriate clinical methods, typically an electronic apex locator supported by radiographic checks where required.",

  workflow: [
    { n: 1, title: "Plan the access",                         desc: "Review pre-operative radiographs for canal anatomy, root form, curvature, restorations, pulp stones, posts, resorption and proximity to the furcation." },
    { n: 2, title: "Remove barriers to diagnosis and isolation", desc: "Remove caries, leaking restorations and unsupported tooth tissue where required. Assess cracks and restorability before committing to full RCT." },
    { n: 3, title: "Create controlled access",                 desc: "Prepare an access cavity that allows visibility and safe instrument entry. Use magnification and illumination where available." },
    { n: 4, title: "Locate and negotiate canals",              desc: "Search systematically for expected canals. Establish patency or a reproducible glide path only where clinically appropriate and safe." },
    { n: 5, title: "Determine working length",                  desc: "Use an apex locator and radiographic confirmation where indicated. Record reference points, working lengths and any uncertainty." },
  ],

  safetyBox: {
    title: "Escalation triggers",
    items: [
      "Calcified canals, severe curvature, suspected perforation, unusual anatomy or inability to negotiate canals should prompt reassessment or referral.",
      "Do not excessively remove tooth tissue while searching for canals without a clear plan.",
      "Stop and reassess if the canal position is inconsistent with the radiograph or anatomy.",
      "If a procedural error is suspected, inform the patient, record it and arrange appropriate management.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Pre-operative radiographic findings recorded.",
    "Canals located and not located recorded.",
    "Working lengths and reference points recorded.",
    "Apex locator and radiographic checks recorded.",
    "Difficulties, procedural concerns and referral decisions recorded.",
  ],

  clinicalSources: [
    ENDO_REF.besGoodPractice,
    ENDO_REF.localRadiographyP,
    ENDO_REF.localReferralG,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to BES Guide to Good Endodontic Practice and the practice's local radiography and referral protocols.",
  },
};
