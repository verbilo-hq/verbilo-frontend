/**
 * Prosthodontics Clinical Protocol — PROS-06
 * Complete Dentures — Impressions, Jaw Relations & Delivery
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_06 = {
  id: "doc-pros-06",
  reference: "PROS-06",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Complete Dentures — Impressions, Jaw Relations & Delivery",
  subtitle: "Primary and secondary impressions, jaw registration, try-in, delivery, post-fit review and patient expectations.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Edentulous patients planned for new complete dentures",
    frequency: "Across the planning, impression, registration, try-in, delivery and review appointments",
    lead:      "Dentist (with laboratory support)",
    evidence:  "Impression records, jaw relations, try-in approval and delivery review",
  },

  standardLabel: "Complete-denture standard",
  protocolStandard: "Complete-denture construction must follow a logical stage-by-stage sequence with each step verified before progressing. The patient must understand that adaptation, function and appearance limits are inherent to complete dentures and that review and adjustment are part of the treatment.",

  workflow: [
    { n: 1, title: "Assess and discuss expectations",  desc: "Examine ridges, mucosa, saliva, neuromuscular control and existing dentures. Discuss what new dentures can and cannot achieve, especially aesthetic and functional limits." },
    { n: 2, title: "Take primary and secondary impressions", desc: "Record peripheral seal, post-dam, retro-molar pads and tuberosities clearly. Use a custom tray for secondary impressions where indicated." },
    { n: 3, title: "Register vertical and centric jaw relations", desc: "Establish freeway space, occlusal plane and centric relation on stable record blocks. Verify before tooth try-in." },
    { n: 4, title: "Try in and verify",                 desc: "Confirm aesthetics, lip support, phonetics, occlusion and patient approval at wax try-in. Modify before processing if necessary." },
    { n: 5, title: "Deliver, adjust and review",        desc: "Check fit, occlusion, comfort and any pressure spots at delivery. Provide written care advice and arrange review at 24–48 hours and within 1–2 weeks for adjustment." },
  ],

  safetyBox: {
    title: "Do not deliver complete dentures if",
    items: [
      "Occlusion is unverified or jaw relations were not recorded with adequate stability.",
      "Aesthetic try-in approval was not obtained from the patient.",
      "Mucosal lesions or pathology were missed and not reviewed.",
      "Adaptation expectations and limits have not been explained.",
      "The patient cannot return for adjustment appointments.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Pre-treatment assessment and ridge / mucosal status recorded.",
    "Impression stage and material recorded.",
    "Jaw relations method and result recorded.",
    "Try-in approval and aesthetic discussion documented.",
    "Delivery and review adjustments recorded.",
  ],

  clinicalSources: [
    PROS_REF.bsspdDentures,
    PROS_REF.fgdpStandards,
    PROS_REF.labPrescription,
    PROS_REF.mhraDevices,
    PROS_REF.gdcOpenness,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSSPD complete-denture guidance, FGDP/CGDent standards, MHRA medical devices regulations and GDC Standards on openness. Requires Clinical Director review and local approval before live adoption.",
  },
};
