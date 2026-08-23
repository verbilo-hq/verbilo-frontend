/**
 * Whitening & Aesthetics Clinical Protocol — WH-CP-01
 * Whitening Assessment, Suitability & Consent
 *
 * Source: Whitening Clinical Protocol Pack, WH-CP-01, reviewed May 2026.
 * Text preserved verbatim from the source PDF.
 */

import { WH_USAGE_NOTE, WH_VERSION_BASE, WH_REF } from "./wh-common";

export const WH_CP_01 = {
  id: "doc-wh-cp-01",
  reference: "WH-CP-01",
  packKey: "clinical_governance",
  category: "Whitening & Aesthetics",
  type: "sop",
  title: "Whitening Assessment, Suitability & Consent",
  subtitle: "Age checks, diagnosis, contraindications, consent discussion, restorations, and legal requirements.",

  localSignOffNote: WH_USAGE_NOTE,

  metaStrip: {
    appliesTo: "Cosmetic tooth whitening enquiries, assessments and treatment planning",
    frequency: "At every whitening enquiry and treatment plan change",
    lead:      "Dentist (with trained DCP support under prescription)",
    evidence:  "Assessment, baseline shade, consent and product record",
  },

  /* Source: "PURPOSE" tile on page 1 — preserved verbatim, rendered as
   * the prominent Standard callout (the WH PDFs don't carry a separate
   * Standard line; the Purpose paragraph is the headline statement). */
  standardLabel: "Purpose",
  protocolStandard: "This protocol standardises how patients are assessed for tooth whitening before any gel is supplied, prescribed or applied. It is designed to protect patients, support lawful whitening provision in the UK, and make sure consent is specific, informed and documented.",

  /* Source: "SCOPE" bullets — pre-workflow context. */
  purpose: [
    "Applies to all cosmetic tooth whitening enquiries, assessments and treatment planning appointments.",
    "Applies to dentists and appropriately trained dental care professionals working within competence and under a dentist-led pathway.",
    "Does not replace the separate whitening consent form or the product manufacturer's instructions.",
  ],

  /* Source: "CORE LEGAL REQUIREMENTS" — non-negotiable controls. */
  criticalControls: [
    "Tooth whitening is the practice of dentistry and must only be provided by GDC-registered dental professionals.",
    "Cosmetic whitening products must not contain or release more than 6% hydrogen peroxide.",
    "Products containing or releasing over 0.1% and up to 6% hydrogen peroxide must not be supplied directly to the patient outside a dentist-led treatment pathway.",
    "For each treatment cycle, the first use must be carried out by a dental practitioner or under their direct supervision, then the patient may continue the cycle at home if appropriate.",
    "Patients must be 18 or over for cosmetic whitening using products above 0.1% hydrogen peroxide, unless the purpose is wholly to treat or prevent disease.",
  ],

  /* Source: "RESPONSIBILITIES" table — Role / Responsibility. */
  decisionTable: {
    title: "Responsibilities",
    columns: ["Role", "Responsibility"],
    rows: [
      ["Dentist",                       "Diagnoses suitability, prescribes treatment, obtains consent, confirms legal eligibility and records the plan."],
      ["Hygienist / therapist",         "May support assessment, first use, instruction and review where trained, competent and working to the dentist's prescription."],
      ["Nurse / treatment coordinator", "May provide approved information, arrange appointments and reinforce written instructions, but must not diagnose, prescribe or imply suitability."],
    ],
  },

  /* Source: "CLINICAL DECISION PATHWAY" numbered steps. */
  workflow: [
    { n: 1, title: "Receive enquiry and provide approved information", desc: "Reception or TCO may explain that assessment is required before whitening can be offered." },
    { n: 2, title: "Complete dentist-led assessment",                   desc: "Confirm diagnosis, suitability, oral health, legal eligibility and patient expectations." },
    { n: 3, title: "Resolve dental disease first",                       desc: "Stabilise caries, periodontal inflammation, pulpal symptoms, defective margins or oral lesions before whitening." },
    { n: 4, title: "Agree treatment option and consent",                 desc: "Record alternatives, risks, cost, likely outcome and planned review." },
    { n: 5, title: "Proceed to home or in-surgery protocol",             desc: "Follow the relevant protocol and product instructions. Record batch, concentration and issue details where gel is supplied." },
  ],

  /* Source: "DO NOT PROCEED WITHOUT DENTIST REVIEW" callout. */
  safetyBox: {
    title: "Do not proceed without dentist review",
    items: [
      "Patient is under 18 and the request is cosmetic.",
      "Uncontrolled caries, active periodontal disease, pulpal pain, fractured teeth or unexplained oral lesions.",
      "Severe baseline sensitivity, significant exposed root surfaces or cracked tooth symptoms.",
      "Known allergy or previous significant reaction to peroxide products.",
      "Unrealistic expectations, body image concern, coercion, or inability to follow instructions safely.",
      "Patient expects existing crowns, veneers, composite, bridges, implants or dentures to whiten.",
    ],
  },

  /* Source: "PRE-TREATMENT ASSESSMENT CHECKLIST" + "CONSENT DISCUSSION
   * MUST COVER" — preserved as titled bullet boxes. */
  notes: [
    {
      title: "Pre-treatment assessment checklist",
      items: [
        "Medical history checked and updated.",
        "Patient age confirmed and recorded.",
        "Dental examination completed before whitening is prescribed.",
        "Active caries, pulpal symptoms and defective restorations assessed.",
        "Periodontal status stable or treatment plan in place first.",
        "Baseline sensitivity, recession, exposed dentine and cracks recorded.",
        "Existing crowns, veneers, bridges, implants and fillings identified.",
        "Baseline shade, photographs and patient expectations recorded.",
        "Smoking/vaping/staining habits discussed.",
        "Pregnancy or breastfeeding status considered for elective deferral.",
      ],
    },
    {
      title: "Consent discussion must cover",
      items: [
        "Reason for whitening and expected limits of improvement.",
        "Options: no treatment, hygiene/stain removal, home whitening, in-surgery whitening, internal whitening where relevant, restorative options where appropriate.",
        "Material risks: sensitivity, gum irritation, uneven shade, white spots becoming more visible, non-response, relapse, and mismatch with restorations.",
        "Costs, review appointments, maintenance/top-ups, and possible future replacement of restorations for shade matching.",
        "Confirmation that consent remains valid at each stage and can be withdrawn before treatment is provided.",
      ],
    },
  ],

  /* Source: "REVIEW AND AUDIT" — audit cadence broken into prompts. */
  auditPrompts: [
    "Ten whitening records audited annually or after any incident.",
    "Patient age, dental assessment and consent documented.",
    "Shade record, photographs and product concentration documented.",
    "Batch/expiry and review outcome documented.",
  ],

  /* Source: "RECORD KEEPING REQUIREMENTS" form fields. */
  documentationPrompts: [
    { id: "assessmentDate",  label: "Assessment Date"  },
    { id: "treatingDentist", label: "Treating Dentist" },
    { id: "baselineShade",   label: "Baseline Shade"   },
    { id: "photographsTaken",label: "Photographs Taken"},
    { id: "productPlanned",  label: "Product Planned"  },
    { id: "concentration",   label: "Concentration"    },
    { id: "keyRisks",        label: "Key Patient-Specific Risks" },
    { id: "consentCompleted",label: "Consent Form Completed" },
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
