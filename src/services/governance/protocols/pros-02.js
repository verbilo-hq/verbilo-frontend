/**
 * Prosthodontics Clinical Protocol — PROS-02
 * Crowns & Onlays — Indications, Preparation & Impression
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_02 = {
  id: "doc-pros-02",
  reference: "PROS-02",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Crowns & Onlays — Indications, Preparation & Impression",
  subtitle: "Indications, material choice, preparation principles, soft-tissue management, impression/scan, lab prescription and try-in.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Indirect single-tooth restorations (onlays, partial- and full-coverage crowns)",
    frequency: "Per indirect restoration appointment and at fit / review",
    lead:      "Dentist",
    evidence:  "Indication, material, preparation detail, impression/scan, lab prescription and fit notes",
  },

  standardLabel: "Crown standard",
  protocolStandard: "Crowns and onlays should be prescribed for specific structural or functional indications, not as a default. Preparation must respect biological width and pulpal health; material choice must match the clinical context; and the lab prescription must communicate all relevant detail.",

  workflow: [
    { n: 1, title: "Justify the indication",        desc: "Record why a crown or onlay is needed (cuspal coverage after RCT, fracture, structural compromise, function) rather than 'large filling'. Discuss alternatives — direct restoration, onlay vs full crown, no treatment." },
    { n: 2, title: "Choose material and design",     desc: "Match material (lithium disilicate, zirconia, gold, PFM, composite) to occlusal load, aesthetics, opposing dentition and laboratory capability. Document the choice and rationale." },
    { n: 3, title: "Prepare conservatively",          desc: "Maintain ferrule, respect biological width, use adequate reduction for the chosen material, smooth margins and avoid unsupported tooth tissue. Provide pulp protection if required." },
    { n: 4, title: "Manage soft tissue and capture the impression/scan", desc: "Use retraction cord, paste or laser as appropriate without traumatising tissues. Capture all margins clearly with a chosen impression material or intraoral scan. Repeat if distorted." },
    { n: 5, title: "Write the lab prescription and provisionalise", desc: "Specify material, shade, occlusal scheme, opposing dentition, margins and any special requests. Place a well-fitting provisional that protects the prep and gingiva." },
  ],

  safetyBox: {
    title: "Reassess before committing to indirect restoration if",
    items: [
      "Ferrule is inadequate and definitive restoration would not be predictably retentive.",
      "Caries removal would compromise the pulp — vital pulp therapy or endodontics may be needed first.",
      "Periodontal stability is not achieved.",
      "Occlusion has not been planned and parafunction has not been addressed.",
      "The patient's expectation cannot be met by the planned material and design.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Indication for indirect restoration documented (not 'large filling').",
    "Material choice and rationale recorded.",
    "Impression/scan quality, retraction method and lab prescription recorded.",
    "Provisional restoration and post-op advice recorded.",
    "Fit appointment occlusion and seating verified.",
  ],

  clinicalSources: [
    PROS_REF.fgdpStandards,
    PROS_REF.fgdpOperative,
    PROS_REF.labPrescription,
    PROS_REF.mhraDevices,
    PROS_REF.gdcCompetence,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent standards and operative guide, MHRA medical devices regulations on custom-made appliances and GDC Standards on competence. Requires Clinical Director review and local approval before live adoption.",
  },
};
