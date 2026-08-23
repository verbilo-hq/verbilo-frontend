/**
 * Whitening & Aesthetics Clinical Protocol — WH-CP-03
 * In-Surgery Whitening Protocol
 *
 * Source: Whitening Clinical Protocol Pack, WH-CP-03, reviewed May 2026.
 * Text preserved verbatim from the source PDF.
 */

import { WH_USAGE_NOTE, WH_VERSION_BASE, WH_REF } from "./wh-common";

export const WH_CP_03 = {
  id: "doc-wh-cp-03",
  reference: "WH-CP-03",
  packKey: "clinical_governance",
  category: "Whitening & Aesthetics",
  type: "sop",
  title: "In-Surgery Whitening Protocol",
  subtitle: "Chairside workflow, soft tissue isolation, shade recording, gel application, safety checks, and aftercare.",

  localSignOffNote: WH_USAGE_NOTE,

  metaStrip: {
    appliesTo: "Chairside in-surgery whitening for assessed and consented patients",
    frequency: "Per chairside whitening appointment",
    lead:      "Dentist with trained dental nurse support",
    evidence:  "Cycles, isolation method, post-treatment shade, aftercare and adverse-effect record",
  },

  standardLabel: "Purpose",
  protocolStandard: "This protocol describes the safe delivery of in-surgery tooth whitening where the practice offers chairside whitening. It focuses on patient preparation, isolation, product safety, monitoring, adverse-event response and documentation.",

  /* Source: "USE THIS PROTOCOL ONLY WHEN" prerequisites. */
  purpose: [
    "The practice has selected an approved chairside whitening system and staff have been trained in that system.",
    "The patient has completed assessment, suitability checks and whitening consent.",
    "The product concentration and method comply with UK legal requirements and manufacturer instructions.",
    "The patient understands that chairside whitening may still require home trays or later top-ups to maintain the result.",
  ],

  /* Source: "LEGAL AND PRODUCT CONTROLS". */
  criticalControls: [
    "Use only practice-approved products with traceable batch and expiry records.",
    "Do not use products containing or releasing more than 6% hydrogen peroxide for cosmetic whitening.",
    "Do not treat cosmetic whitening patients under 18 with products above 0.1% hydrogen peroxide.",
    "Do not delegate beyond the scope, competence and supervision requirements for the team member involved.",
    "Follow manufacturer instructions exactly, including application thickness, cycle timing, activation method and removal.",
  ],

  /* Source: "CHAIRSIDE WORKFLOW" numbered steps. */
  workflow: [
    { n: 1, title: "Confirm identity, consent and changes", desc: "Confirm patient details, medical changes, consent validity, expectations and planned product." },
    { n: 2, title: "Record baseline",                        desc: "Take shade, photographs and note any existing restorations, white spots, cracks, recession or sensitivity." },
    { n: 3, title: "Protect soft tissues and eyes",          desc: "Fit retraction, isolate gingiva and mucosa, protect lips, and provide suitable eye protection." },
    { n: 4, title: "Apply gel exactly as directed",          desc: "Use manufacturer timings and cycles. Avoid excess gel and avoid contact with gingiva or mucosa." },
    { n: 5, title: "Monitor throughout",                      desc: "Check comfort, soft tissue colour, leakage, swallowing risk and sensitivity during each cycle." },
    { n: 6, title: "Remove, rinse and reassess",              desc: "Suction gel carefully, rinse, remove isolation, inspect tissues and record post-treatment shade." },
  ],

  /* Source: "STOP TREATMENT IMMEDIATELY IF". */
  safetyBox: {
    title: "Stop treatment immediately if",
    items: [
      "The patient reports severe pain, burning, feeling unwell or difficulty swallowing.",
      "Gel leaks onto gingiva, lips, cheeks, tongue or skin.",
      "Soft tissues blanch, ulcerate or become painful.",
      "Eye exposure occurs or eye protection is displaced.",
      "There is any uncertainty about product concentration, timing, isolation or patient safety.",
    ],
  },

  /* Source: "EQUIPMENT AND PREPARATION" checklist + "SAFETY POINT"
   * callout + "POST-TREATMENT ADVICE" bullets. */
  notes: [
    {
      title: "Equipment and preparation",
      items: [
        "Medical history, consent and treatment plan checked.",
        "Baseline shade and photographs recorded.",
        "Product, batch, expiry and concentration checked.",
        "PPE and eye protection available for patient and team.",
        "Lip/cheek retraction and suction available.",
        "Gingival isolation/barrier material available.",
        "Emergency rinse/suction plan understood.",
        "Post-operative advice ready to issue.",
      ],
    },
    {
      title: "Safety point",
      items: [
        "If a lamp or heat/light activation system is used, follow the manufacturer's safety controls exactly. Do not improvise activation time, distance, shielding or cycles.",
      ],
    },
    {
      title: "Post-treatment advice",
      items: [
        "Explain the achieved shade and that further settling may occur.",
        "Advise the patient to contact the practice for persistent sensitivity, burns, ulceration, swelling or severe pain.",
        "Discuss staining habits, smoking/vaping, maintenance and whether home trays or top-ups are planned.",
        "Remind the patient that restorations will not whiten and may need replacement after the shade stabilises.",
        "Provide written aftercare consistent with the product/system used.",
      ],
    },
  ],

  auditPrompts: [
    "Annual audit of chairside whitening records.",
    "Audit after any adverse incident.",
    "Documentation of legal eligibility, consent, shade and product traceability confirmed.",
    "Isolation, cycles, aftercare and review documented.",
  ],

  /* Source: "DOCUMENTATION REQUIREMENTS" form fields. */
  documentationPrompts: [
    { id: "consentChecked",     label: "Consent Checked" },
    { id: "baselineShade",       label: "Baseline Shade" },
    { id: "productName",         label: "Product Name" },
    { id: "concentration",       label: "Concentration" },
    { id: "batchExpiry",          label: "Batch and Expiry" },
    { id: "cyclesCompleted",     label: "Cycles Completed" },
    { id: "isolationMethod",     label: "Isolation Method" },
    { id: "postShade",            label: "Post-Treatment Shade" },
    { id: "adverseEffects",      label: "Adverse Effects" },
    { id: "aftercareIssued",     label: "Aftercare Issued" },
  ],

  clinicalSources: [
    WH_REF.gdcPrinciple3,
    WH_REF.gdcWhiteningLegal,
    WH_REF.gdcWorkingWithinLaw,
    WH_REF.bdaWhitening,
  ],

  version: {
    ...WH_VERSION_BASE,
    changeSummary: "Initial published version. Template for local approval. Aligned to GDC Standards Principle 3, GDC tooth whitening legal position statement, GDC working within the law guidance on tooth whitening, and BDA tooth whitening advice.",
  },
};
