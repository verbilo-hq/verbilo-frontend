/**
 * Paediatric Dentistry Clinical Protocol — PAED-03
 * Fluoride Varnish, Fissure Sealants & Topical Prevention
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_03 = {
  id: "doc-paed-03",
  reference: "PAED-03",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "Fluoride Varnish, Fissure Sealants & Topical Prevention",
  subtitle: "Application protocol, indications, frequency, safety, contraindications and documentation for topical prevention in children.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Children eligible for fluoride varnish, fissure sealants or other professional prevention",
    frequency: "Per visit where prevention is delivered (typically 2–4× per year for fluoride varnish based on risk)",
    lead:      "Dentist, hygienist or therapist within scope",
    evidence:  "Product, batch, application sites, parental consent and any adverse effect recorded",
  },

  standardLabel: "Topical-prevention standard",
  protocolStandard: "Topical prevention must be applied per evidence-based UK schedules (Delivering Better Oral Health, SDCEP) with appropriate consent, product traceability and contraindication screening. Application alone is not a substitute for behaviour and diet support.",

  workflow: [
    { n: 1, title: "Confirm consent and contraindications",  desc: "Confirm parental consent. Screen for severe asthma requiring hospital admission, allergy to colophony/resins or ulcerative gingivitis (varnish caution). Record product, batch and expiry." },
    { n: 2, title: "Prepare the tooth/teeth",                 desc: "Dry teeth with cotton or air. Demonstrate to the child. Use minimal volume per manufacturer instructions. Avoid ingestion." },
    { n: 3, title: "Apply per product instructions",          desc: "Use a small brush for fluoride varnish; etch and bond for resin-based sealants per manufacturer's instructions; use glass-ionomer sealants where moisture control is difficult." },
    { n: 4, title: "Advise after application",                 desc: "Advise soft diet for a few hours after fluoride varnish, no toothbrushing the same evening (per product). Reinforce home-care fluoride toothpaste use." },
    { n: 5, title: "Document and recall",                      desc: "Record product, batch, sites treated, frequency, any adverse effect and next scheduled application. Link to the child's caries-risk recall (PAED-02)." },
  ],

  safetyBox: {
    title: "Do not apply if",
    items: [
      "Severe asthma requiring hospital admission in the last 12 months — defer or seek medical advice.",
      "Known colophony or resin allergy and product contains it.",
      "Ulcerative gingivitis or stomatitis — defer varnish until resolved.",
      "Child is acutely unwell or distressed.",
      "Adequate isolation cannot be achieved for resin sealants (consider glass-ionomer alternative).",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Consent recorded for prevention application.",
    "Contraindication screen documented per visit.",
    "Product, batch and expiry recorded.",
    "Application frequency matches caries-risk plan.",
    "Sealants reviewed at recall for integrity.",
  ],

  clinicalSources: [
    PAED_REF.dbohQRG,
    PAED_REF.sdcepCaries,
    PAED_REF.bspdGuidelines,
    PAED_REF.mfrInstructions,
    PAED_REF.gdcConsentRecords,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from Delivering Better Oral Health prevention toolkit, SDCEP caries guidance, BSPD UK national clinical guidelines, manufacturer instructions and GDC Standards on records. Requires Clinical Director review and local approval before live adoption.",
  },
};
