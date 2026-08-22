/**
 * Prosthodontics Clinical Protocol — PROS-04
 * Provisional & Temporary Restorations
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_04 = {
  id: "doc-pros-04",
  reference: "PROS-04",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Provisional & Temporary Restorations",
  subtitle: "Function, aesthetics, periodontal protection, occlusion, materials and patient instructions for temporary crowns, bridges and inlays.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Any patient with a chairside or laboratory-fabricated provisional restoration",
    frequency: "At each indirect-restoration appointment between prep and definitive fit",
    lead:      "Dentist (DCP support within scope)",
    evidence:  "Provisional method, material, cement, occlusion check and patient instructions",
  },

  standardLabel: "Provisional standard",
  protocolStandard: "Provisional restorations must protect the prepared tooth, soft tissues and occlusion until the definitive restoration is fitted. They are not 'temporary fillings' and must be made and cemented to a standard appropriate to the planned time in service.",

  workflow: [
    { n: 1, title: "Plan the provisional before preparation",  desc: "Make a pre-prep silicone or matrix from the existing tooth or a wax-up. Plan the time the provisional will be in service and the cement to be used." },
    { n: 2, title: "Make the provisional accurately",           desc: "Fabricate chairside (bis-acryl) or laboratory provisional with adequate marginal fit, occlusion, contour and emergence profile. Avoid voids and contamination." },
    { n: 3, title: "Protect soft tissues",                       desc: "Ensure margins are smooth, contour supports gingiva and contacts are tight enough to prevent food packing or papilla loss." },
    { n: 4, title: "Cement appropriately",                       desc: "Choose a provisional cement based on planned duration and ease of removal. Clean excess thoroughly to avoid gingival irritation and recurrent caries." },
    { n: 5, title: "Instruct and review the patient",            desc: "Warn the patient about chewing on the provisional, flossing carefully, contact for de-cementation/fracture and the importance of attending the planned fit appointment." },
  ],

  safetyBox: {
    title: "Replace or remake the provisional if",
    items: [
      "It is repeatedly de-cementing or fracturing.",
      "Soft tissues are inflamed at the margin or papillae have been lost.",
      "The occlusion is uncomfortable or causing TMD-type symptoms.",
      "The patient is experiencing prolonged sensitivity that is inconsistent with the prep depth.",
      "Time in service has exceeded what the material and cement were designed for.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Provisional method and material recorded.",
    "Cement type and rationale recorded.",
    "Occlusal check on insertion documented.",
    "Patient instructions provided.",
    "Replacement provisionals where needed have been logged with cause.",
  ],

  clinicalSources: [
    PROS_REF.fgdpStandards,
    PROS_REF.fgdpOperative,
    PROS_REF.mfrInstructions,
    PROS_REF.gdcCompetence,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent standards and operative guide, manufacturer cement instructions and GDC Standards on competence. Requires Clinical Director review and local approval before live adoption.",
  },
};
