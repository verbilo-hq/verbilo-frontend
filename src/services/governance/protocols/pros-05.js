/**
 * Prosthodontics Clinical Protocol — PROS-05
 * Removable Partial Dentures — Design & Delivery
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_05 = {
  id: "doc-pros-05",
  reference: "PROS-05",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Removable Partial Dentures — Design & Delivery",
  subtitle: "Indications, design (saddle, support, retention, bracing, reciprocation), surveying, framework, try-in and delivery.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Partially dentate patients planned for removable partial dentures",
    frequency: "Across denture planning, impressions, framework, try-in, delivery and review",
    lead:      "Dentist (with laboratory support)",
    evidence:  "Design drawing, impressions, framework, try-in and post-delivery review notes",
  },

  standardLabel: "Partial-denture standard",
  protocolStandard: "Removable partial dentures must be designed by the dentist — not delegated to the laboratory — and the design must address support, retention, bracing, reciprocation and tissue health. The denture must be re-assessed at delivery and at review for fit, function and comfort.",

  workflow: [
    { n: 1, title: "Assess and design",                desc: "Survey study casts, classify the saddle (Kennedy), choose tooth- and/or mucosa-borne support, plan major connector and retention. Record the design as a drawing in the notes." },
    { n: 2, title: "Take primary and secondary impressions", desc: "Capture clear seating, periphery and detail. Use the appropriate special-tray and impression material for the chosen design." },
    { n: 3, title: "Register jaw relations and try-in framework", desc: "Record vertical and centric jaw relations. Try in metal framework or trial bases, verify fit, occlusal scheme and aesthetic try-in with the patient." },
    { n: 4, title: "Deliver and adjust",                  desc: "Check fit, retention, occlusion in MIP and excursions, periphery comfort and any pressure spots. Adjust as required and provide a written care plan." },
    { n: 5, title: "Review and plan maintenance",         desc: "Schedule review within an agreed interval; check tissue health, occlusion, denture hygiene and prevention. Plan relines/repairs/replacement as indicated." },
  ],

  safetyBox: {
    title: "Do not deliver an RPD if",
    items: [
      "Active caries, periodontal disease or unresolved oral pathology is present.",
      "Design has not been documented and the laboratory has been left to design it.",
      "Occlusion has not been verified at try-in.",
      "Retention or support is inadequate and the denture is unlikely to function safely.",
      "The patient does not understand the maintenance commitment and adaptation period.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Saddle classification and denture design drawing recorded.",
    "Impressions, jaw relations and try-in steps documented.",
    "Occlusion verified on delivery in MIP and excursions.",
    "Adjustments at delivery and at review recorded.",
    "Maintenance plan, hygiene advice and recall arranged.",
  ],

  clinicalSources: [
    PROS_REF.bsspdDentures,
    PROS_REF.fgdpStandards,
    PROS_REF.labPrescription,
    PROS_REF.mhraDevices,
    PROS_REF.gdcConsentRecords,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSSPD denture guidance, FGDP/CGDent standards, MHRA medical devices regulations on custom-made appliances and GDC Standards on records. Requires Clinical Director review and local approval before live adoption.",
  },
};
