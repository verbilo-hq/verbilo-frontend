/**
 * Prosthodontics Clinical Protocol — PROS-03
 * Fixed Bridges — Design, Materials & Cementation
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_03 = {
  id: "doc-pros-03",
  reference: "PROS-03",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Fixed Bridges — Design, Materials & Cementation",
  subtitle: "Bridge design choice (conventional, resin-bonded, cantilever), abutment selection, span, materials and cementation protocol.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients planned for fixed bridgework",
    frequency: "Per bridge planning, prep and fit appointment",
    lead:      "Dentist",
    evidence:  "Indication, design choice, abutment status, materials, cementation and review",
  },

  standardLabel: "Bridge standard",
  protocolStandard: "Bridge design must respect abutment health, span, occlusal load and patient preference. Resin-bonded bridges are first choice for minimally restored abutments and small spans; conventional bridges are reserved for cases where abutments require significant restoration or load demands a more retentive design.",

  workflow: [
    { n: 1, title: "Confirm the indication and option choice", desc: "Discuss bridge versus implant, removable partial denture and no treatment. Record patient preference, costs, prognosis and maintenance requirements." },
    { n: 2, title: "Choose bridge design",                      desc: "Prefer resin-bonded (cantilever single-pontic where appropriate) for healthy abutments. Reserve conventional fixed-fixed designs for cases requiring greater retention. Avoid fixed-fixed designs across mobile or compromised abutments." },
    { n: 3, title: "Assess abutments thoroughly",                desc: "Confirm restorability, ferrule, periodontal support, endodontic status, occlusal load and parafunction risk. Stabilise any active disease before bridge work." },
    { n: 4, title: "Prepare, impress and prescribe to the lab", desc: "Prepare conservatively to the chosen design. Capture impression/scan with clear margins. Provide a clear lab prescription specifying material, shade, occlusal scheme and design." },
    { n: 5, title: "Cement and verify",                          desc: "Follow the bonding/cementation protocol exactly for the chosen material. Verify seating, occlusion in MIP and excursions, marginal seal and patient comfort before discharge. Provide post-op and maintenance advice." },
  ],

  safetyBox: {
    title: "Reconsider bridgework if",
    items: [
      "Abutments are mobile, periodontally compromised or restoratively unpredictable.",
      "Span exceeds the abutment surface area and occlusal load forecast.",
      "Patient parafunction is uncontrolled and likely to fracture the prosthesis.",
      "Implant or denture alternatives offer better long-term prognosis.",
      "The patient's expectation of longevity is unrealistic for the planned design.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Indication and design choice rationale recorded.",
    "Abutment health and prognosis recorded per tooth.",
    "Lab prescription and material/shade documented.",
    "Cementation protocol followed and verified.",
    "Post-fit occlusion and maintenance plan recorded.",
  ],

  clinicalSources: [
    PROS_REF.fgdpStandards,
    PROS_REF.fgdpOperative,
    PROS_REF.bspPerio,
    PROS_REF.labPrescription,
    PROS_REF.mfrInstructions,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent standards and operative guide, BSP perio-prosthetic interface guidance and manufacturer cementation instructions. Requires Clinical Director review and local approval before live adoption.",
  },
};
