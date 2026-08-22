/**
 * Paediatric Dentistry Clinical Protocol — PAED-06
 * Extraction of Primary Teeth & Balancing / Compensating Strategy
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_06 = {
  id: "doc-paed-06",
  reference: "PAED-06",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "Extraction of Primary Teeth & Balancing / Compensating Strategy",
  subtitle: "Indications, technique, balancing/compensating decisions, occlusal development and post-operative care.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Primary teeth requiring extraction (caries, pulp failure, ortho indication, supernumerary)",
    frequency: "Per extraction appointment",
    lead:      "Dentist (consider sedation/GA referral for complex/anxious cases)",
    evidence:  "Indication, technique, any balancing/compensating decision, post-op review",
  },

  standardLabel: "Primary-extraction standard",
  protocolStandard: "Primary tooth extraction must be planned with awareness of occlusal development. The clinician must consider balancing or compensating extractions where indicated, and document the orthodontic implications of asymmetric loss.",

  workflow: [
    { n: 1, title: "Confirm indication and consent",       desc: "Document the reason (caries, failed pulp therapy, mobility, ortho, supernumerary). Confirm consent including the orthodontic implications of asymmetric loss." },
    { n: 2, title: "Plan balancing/compensating extraction", desc: "Consider balancing (same arch, contralateral) for first primary molars or canines where midline shift risk exists. Consider compensating (opposing arch) per BSPD guidance for carious first permanent molars later (link to PAED-08)." },
    { n: 3, title: "Achieve effective anaesthesia",          desc: "Use child-friendly LA technique per RES-03. Verify anaesthesia before extraction. Use behaviour management throughout." },
    { n: 4, title: "Extract atraumatically",                  desc: "Use appropriate forceps and luxators for primary teeth. Be aware of underlying permanent successor. Confirm complete root removal where possible without damage to successor." },
    { n: 5, title: "Post-op advice and review",                desc: "Give written aftercare to parent/guardian. Schedule review only if symptoms persist or balancing/compensating timing requires it." },
  ],

  safetyBox: {
    title: "Reconsider extraction or refer if",
    items: [
      "Underlying permanent successor would be at risk of damage.",
      "Anxious child needs sedation/GA — refer to a sedation or community dental service.",
      "Medical history requires liaison (e.g. anticoagulants, immunosuppression, bleeding disorder).",
      "Orthodontic implications of asymmetric loss have not been planned for.",
      "Multiple extractions are needed and a phased GA approach would be safer.",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Indication for extraction recorded.",
    "Balancing/compensating consideration documented.",
    "LA, technique and any complications recorded.",
    "Post-op advice provided to parent/guardian.",
    "Orthodontic review/referral arranged if needed.",
  ],

  clinicalSources: [
    PAED_REF.bspdGuidelines,
    PAED_REF.sdcepPrescribing,
    PAED_REF.localReferral,
    PAED_REF.gdcConsentRecords,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSPD UK national clinical guidelines on extraction of primary teeth, SDCEP drug prescribing guidance and local sedation/community referral pathway. Requires Clinical Director review and local approval before live adoption.",
  },
};
