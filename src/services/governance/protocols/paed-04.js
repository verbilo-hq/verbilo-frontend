/**
 * Paediatric Dentistry Clinical Protocol — PAED-04
 * Primary Tooth Restorative Care
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_04 = {
  id: "doc-paed-04",
  reference: "PAED-04",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "Primary Tooth Restorative Care",
  subtitle: "Selective caries removal, Hall Technique, conventional restorations and the SDCEP / BSPD framework for primary teeth.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Primary teeth with caries needing operative care",
    frequency: "Per restorative appointment",
    lead:      "Dentist or appropriately trained therapist",
    evidence:  "Caries depth, technique used, material, behaviour-management approach and review",
  },

  standardLabel: "Primary-tooth restorative standard",
  protocolStandard: "Restorative care for primary teeth should match the child's cooperation, caries depth and the tooth's expected life. The clinician should consider biological approaches (Hall Technique, selective caries removal) alongside conventional restorations, and avoid invasive operative care that risks pulpal injury or behavioural sensitisation.",

  workflow: [
    { n: 1, title: "Confirm diagnosis and cooperation",   desc: "Assess caries extent radiographically where justified, child cooperation, time to exfoliation and parent/guardian preference. Plan a realistic technique." },
    { n: 2, title: "Choose the technique",                 desc: "Hall Technique for proximal caries in cooperative children with sound tooth structure. Conventional composite or glass-ionomer for accessible occlusal caries. Selective excavation where deep but pulp not exposed." },
    { n: 3, title: "Deliver with behaviour support",       desc: "Use tell-show-do, distraction, voice control and nitrous oxide where available. Avoid local anaesthesia for Hall Technique. Use LA when needed and per RES-03." },
    { n: 4, title: "Restore appropriately",                 desc: "Place a well-adapted, anatomical restoration. Match the technique to the tooth's expected life (years to exfoliation). Verify occlusion." },
    { n: 5, title: "Plan review and prevention",           desc: "Review at recall — caries activity, restoration integrity, occlusion adaptation (Hall). Reinforce prevention (PAED-02, PAED-03). Plan extraction balance if needed (PAED-06)." },
  ],

  decisionTable: {
    title: "Primary-Tooth Restorative Decision Guide",
    columns: ["Finding", "Recommended approach"],
    rows: [
      ["Small proximal lesion, sound tooth tissue",              "Hall Technique stainless-steel crown — non-invasive, evidence-based."],
      ["Accessible occlusal cavitated lesion, cooperative child","Conventional composite or glass-ionomer restoration."],
      ["Deep caries without exposure",                            "Selective caries removal + pulp protection + definitive seal (PAED-05 if exposure occurs)."],
      ["Multiple lesions, anxious child",                         "Consider phased prevention-first plan, fluoride varnish + sealants, then minimally invasive operative work."],
      ["Pulpal symptoms or large pulpal involvement",             "Pulp therapy (PAED-05) or extraction (PAED-06); consider sedation/GA referral if cooperation is the barrier."],
    ],
  },

  safetyBox: {
    title: "Reassess the approach if",
    items: [
      "The child cannot cope with the planned technique despite behaviour-management support.",
      "Pulpal symptoms or signs of irreversible pulpitis appear.",
      "The tooth has insufficient time to exfoliation to justify a complex restoration.",
      "Restorability is doubtful and extraction is more reasonable.",
      "Multiple repeated restorations have failed and the underlying caries risk is not controlled.",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Diagnosis and caries extent documented.",
    "Technique choice rationale recorded.",
    "Behaviour-management approach recorded.",
    "Restoration material and any complications recorded.",
    "Recall and prevention plan documented.",
  ],

  clinicalSources: [
    PAED_REF.sdcepCaries,
    PAED_REF.bspdGuidelines,
    PAED_REF.dbohQRG,
    PAED_REF.gdcConsentRecords,
    PAED_REF.mfrInstructions,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from SDCEP caries-in-children guidance (including Hall Technique), BSPD UK national clinical guidelines and Delivering Better Oral Health. Requires Clinical Director review and local approval before live adoption.",
  },
};
