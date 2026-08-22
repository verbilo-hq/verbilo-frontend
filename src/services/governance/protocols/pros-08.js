/**
 * Prosthodontics Clinical Protocol — PROS-08
 * Occlusion, Vertical Dimension & Mandibular Position
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_08 = {
  id: "doc-pros-08",
  reference: "PROS-08",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Occlusion, Vertical Dimension & Mandibular Position",
  subtitle: "Conformative versus reorganised approach, vertical dimension assessment, parafunction management and occlusal verification.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All restorative and prosthodontic treatment that alters occlusion",
    frequency: "At assessment, during planning, at try-in and at delivery",
    lead:      "Dentist",
    evidence:  "Occlusal assessment, planning approach (conformative/reorganised), verification at delivery",
  },

  standardLabel: "Occlusion standard",
  protocolStandard: "Restorative work must respect the patient's existing occlusion or — where increased vertical dimension or reorganisation is planned — proceed through documented steps including diagnostic wax-up, try-in and a trial period before irreversible work.",

  workflow: [
    { n: 1, title: "Assess existing occlusion",          desc: "Record MIP, retruded contact, lateral and protrusive guidance, freeway space, signs of parafunction, tooth wear, mobility and any TMD symptoms." },
    { n: 2, title: "Decide conformative vs reorganised", desc: "Use conformative for restorations that fit into the existing MIP. Reserve reorganised approach for cases needing increased vertical dimension, occlusal reconstruction or significant aesthetic change — always with documented planning." },
    { n: 3, title: "Plan with study casts or scans",     desc: "For reorganised cases use mounted study casts or digital articulation, a wax-up or trial restorations and a written occlusal scheme before any preparation." },
    { n: 4, title: "Verify at each stage",                desc: "Check occlusion at try-in (provisional, framework, wax try-in) before processing or definitive cementation. Adjust before commit, not after." },
    { n: 5, title: "Manage parafunction long term",      desc: "Where bruxism or clenching is present, plan splint therapy and review. Document the patient's role in maintaining the restoration." },
  ],

  safetyBox: {
    title: "Do not proceed with definitive prosthetic work if",
    items: [
      "Occlusion has not been assessed and documented at the planning stage.",
      "A reorganised approach is being used without diagnostic wax-up or trial.",
      "Active TMD symptoms are present and have not been investigated.",
      "Parafunction is uncontrolled and likely to fracture the planned restoration.",
      "The patient has not understood the role of occlusal balance in long-term success.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Existing occlusion documented in structured detail.",
    "Conformative-vs-reorganised decision recorded.",
    "Diagnostic wax-up or trial used for reorganised cases.",
    "Occlusion verified at each prosthetic stage.",
    "Parafunction management plan and splint provided where indicated.",
  ],

  clinicalSources: [
    PROS_REF.fgdpStandards,
    PROS_REF.fgdpOperative,
    PROS_REF.bspPerio,
    PROS_REF.gdcCompetence,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent standards and operative guide, BSP perio-prosthetic interface guidance and GDC Standards on competence. Requires Clinical Director review and local approval before live adoption.",
  },
};
