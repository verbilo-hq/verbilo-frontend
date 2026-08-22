/**
 * Paediatric Dentistry Clinical Protocol — PAED-05
 * Pulp Therapy in Primary Teeth
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_05 = {
  id: "doc-paed-05",
  reference: "PAED-05",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "Pulp Therapy in Primary Teeth",
  subtitle: "Indirect / direct pulp cap, partial pulpotomy, full pulpotomy, pulpectomy and the threshold for extraction of primary teeth.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Primary teeth with deep caries, traumatic exposure or pulpal involvement",
    frequency: "Per pulp-therapy appointment",
    lead:      "Dentist (or therapist within scope of practice)",
    evidence:  "Diagnosis, technique, material, post-op review",
  },

  standardLabel: "Primary-pulp-therapy standard",
  protocolStandard: "Pulp therapy in primary teeth must be matched to the pulpal diagnosis, the tooth's expected life, the child's cooperation and the restorability of the tooth. Where pulp therapy is not appropriate, extraction with a documented balancing/compensating plan should be considered.",

  workflow: [
    { n: 1, title: "Establish pulpal diagnosis",   desc: "Differentiate reversible inflammation (cold/sweet sensitivity, no spontaneous pain) from irreversible pulpitis (spontaneous pain, lingering pain) or necrosis (sinus, mobility, radiolucency)." },
    { n: 2, title: "Confirm restorability",          desc: "Assess remaining tooth tissue, time to exfoliation, occlusion, periapical/furcation radiographic status, and whether a definitive seal can be placed." },
    { n: 3, title: "Choose the technique",            desc: "Indirect/direct pulp cap for vital pulps in reversible inflammation; partial/full pulpotomy with appropriate medicament for carious exposure with vital radicular pulp; pulpectomy for non-vital primary molars where restoration is feasible." },
    { n: 4, title: "Place medicament and seal",       desc: "Use evidence-based medicaments per SDCEP/BSPD guidance. Place a definitive coronal seal — typically a preformed metal crown — at the same visit where possible." },
    { n: 5, title: "Review and document",              desc: "Review at recall for symptoms, mobility, sinus formation and radiographic furcation status (if justified). Plan extraction (PAED-06) and balancing/compensating strategy if therapy fails." },
  ],

  decisionTable: {
    title: "Primary-Pulp-Therapy Decision Guide",
    columns: ["Diagnosis", "Recommended pulp therapy"],
    rows: [
      ["Reversible pulpitis, no exposure",                         "Indirect pulp cap + definitive seal."],
      ["Small carious exposure, vital pulp, controlled bleeding",  "Direct pulp cap or partial pulpotomy + preformed metal crown."],
      ["Carious exposure with vital radicular pulp",                "Full pulpotomy with evidence-based medicament + preformed metal crown."],
      ["Non-vital pulp, restorable tooth, no abscess",              "Pulpectomy + restorable coronal seal where time to exfoliation justifies."],
      ["Non-vital pulp with abscess, furcation involvement or unrestorable", "Extraction (PAED-06) with balancing/compensating plan as needed."],
    ],
  },

  safetyBox: {
    title: "Do not attempt pulp therapy if",
    items: [
      "Pulp is non-vital with abscess, furcation involvement or pathological mobility — extract.",
      "The tooth has insufficient time to exfoliation to justify the procedure.",
      "Restorability is poor and a coronal seal cannot be guaranteed.",
      "Child cooperation is inadequate and sedation/GA is not arranged.",
      "Underlying caries risk is not being controlled and recurrence is likely.",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Pulpal diagnosis documented.",
    "Technique chosen with rationale recorded.",
    "Medicament and definitive restoration recorded.",
    "Review interval and outcome documented.",
    "Plan for failure documented (extraction + space management).",
  ],

  clinicalSources: [
    PAED_REF.sdcepCaries,
    PAED_REF.bspdGuidelines,
    PAED_REF.dbohQRG,
    PAED_REF.mfrInstructions,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from SDCEP caries-in-children guidance, BSPD UK national clinical guidelines on pulp therapy and Delivering Better Oral Health. Requires Clinical Director review and local approval before live adoption.",
  },
};
