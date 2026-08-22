/**
 * Restorative / Operative Clinical Protocol — RES-06
 * Direct Posterior Composite Restorations
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_06 = {
  id: "doc-res-06",
  reference: "RES-06",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Direct Posterior Composite Restorations",
  subtitle: "Matrix and wedging, bonding, layering or bulk-fill technique, occlusion, contact points and post-operative sensitivity prevention.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Direct composite restorations on posterior teeth",
    frequency: "Per posterior composite appointment",
    lead:      "Dentist",
    evidence:  "Isolation, materials, matrix/wedge, layering or bulk-fill detail, occlusion check",
  },

  standardLabel: "Posterior-composite standard",
  protocolStandard: "Posterior composite restorations require effective isolation, proper interproximal control with appropriate matrices and wedges, manufacturer-compliant bonding and a verified occlusion. Post-operative sensitivity should be minimised by attention to bonding technique and pulp protection where indicated.",

  workflow: [
    { n: 1, title: "Plan and prepare",                        desc: "Review caries extent, restorability, existing restoration condition and occlusion. Select sectional matrix, wedge and ring system before access." },
    { n: 2, title: "Achieve isolation and access",             desc: "Use rubber dam where appropriate (RES-04). Remove existing restoration as needed, perform selective caries excavation and assess remaining tissue." },
    { n: 3, title: "Set up the interproximal seal",            desc: "Place sectional matrix, wedge and separation ring to recreate anatomical contact and avoid open margins or overhangs." },
    { n: 4, title: "Bond and place composite",                 desc: "Follow the adhesive manufacturer's sequence exactly. Use layered or bulk-fill technique per material instructions; respect maximum increment thickness." },
    { n: 5, title: "Finish, polish and verify occlusion",      desc: "Remove matrix, refine anatomy, check contact tightness with floss, finish margins, polish, and verify occlusion in MIP and excursions. Provide post-op advice." },
  ],

  safetyBox: {
    title: "Reassess before completing if",
    items: [
      "Isolation has failed during bonding and re-isolation is not possible.",
      "Caries extends close to the pulp — apply pulp protection per RES-07 or reconsider the plan.",
      "Interproximal contact cannot be re-established and food packing is likely.",
      "Pulpal sensitivity has appeared during cavity preparation that is inconsistent with caries depth.",
      "Occlusal load on a heavily restored tooth indicates cuspal coverage may be safer than direct restoration.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Isolation method recorded.",
    "Matrix and wedge system recorded.",
    "Adhesive system and composite material with batch where relevant.",
    "Occlusal check in MIP and excursions documented.",
    "Post-operative advice and review plan recorded.",
  ],

  clinicalSources: [
    RES_REF.fgdpOperative,
    RES_REF.fgdpStandards,
    RES_REF.mfrInstructions,
    RES_REF.gdcCompetence,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent operative dentistry guidance, manufacturer adhesive and composite instructions, and GDC Standards on competence. Requires Clinical Director review and local approval before live adoption.",
  },
};
