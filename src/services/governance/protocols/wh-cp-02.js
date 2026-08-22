/**
 * Whitening & Aesthetics Clinical Protocol — WH-CP-02
 * Home Tray Whitening Protocol
 *
 * Source: Whitening Clinical Protocol Pack, WH-CP-02, reviewed May 2026.
 * Text preserved verbatim from the source PDF.
 */

import { WH_USAGE_NOTE, WH_VERSION_BASE, WH_REF } from "./wh-common";

export const WH_CP_02 = {
  id: "doc-wh-cp-02",
  reference: "WH-CP-02",
  packKey: "clinical_governance",
  category: "Whitening & Aesthetics",
  type: "sop",
  title: "Home Tray Whitening Protocol",
  subtitle: "Impressions or scan, tray fit, gel prescription, first use, patient instructions, wear schedule, and review.",

  localSignOffNote: WH_USAGE_NOTE,

  metaStrip: {
    appliesTo: "Dentist-led home tray whitening for assessed and consented patients",
    frequency: "At impressions/scan, tray fit, first use and review",
    lead:      "Dentist prescribes; supervised competent DCP may support fit and review",
    evidence:  "Prescription, batch/expiry, tray-fit check, first use and review record",
  },

  standardLabel: "Purpose",
  protocolStandard: "This protocol describes the safe delivery of dentist-led home whitening using custom trays and prescribed whitening gel. It covers tray production, gel issue, first use, patient instruction, review and documentation.",

  /* Source: "BEFORE THIS PROTOCOL IS USED" prerequisites. */
  purpose: [
    "The patient must have completed the Whitening Assessment, Suitability & Consent protocol.",
    "A dentist must have confirmed suitability, oral health stability, legal eligibility and the agreed product/concentration.",
    "The patient must understand that whitening changes natural tooth colour only and will not whiten crowns, veneers, bridges, implants, dentures or composite restorations.",
  ],

  /* Source: "PRODUCT AND LEGAL CONTROLS". */
  criticalControls: [
    "Use only practice-approved whitening systems from reputable suppliers.",
    "Check product name, concentration, batch number and expiry before issue.",
    "Do not supply products that contain or release more than 6% hydrogen peroxide for cosmetic whitening.",
    "Do not issue whitening gel directly without a dentist-led treatment pathway and appropriate first use.",
    "Do not provide cosmetic whitening to under-18s using products above 0.1% hydrogen peroxide.",
  ],

  /* Source: "TEAM RESPONSIBILITIES" table — Stage / Lead / Requirement. */
  decisionTable: {
    title: "Team responsibilities",
    columns: ["Stage", "Lead", "Requirement"],
    rows: [
      ["Prescription",     "Dentist",                                "Confirms suitability, product, concentration, wear schedule and review interval."],
      ["Scan/impression",  "Competent clinician",                    "Accurate record for custom tray fabrication; repeats taken if distorted."],
      ["Fit/first use",    "Dentist or supervised competent DCP",    "Tray fit checked, first use completed where required, written instructions issued."],
      ["Review",           "Dentist or delegated competent clinician","Shade, sensitivity, compliance and adverse effects reviewed."],
    ],
  },

  /* Source: "WORKFLOW" numbered steps. */
  workflow: [
    { n: 1, title: "Confirm prescription and records",      desc: "Check assessment, consent, baseline shade, photographs and product plan are complete." },
    { n: 2, title: "Take impressions or scan",                desc: "Capture full arch detail, gingival margins and tooth surfaces to be whitened. Repeat if distorted." },
    { n: 3, title: "Fabricate custom trays",                  desc: "Trays must fit closely, be trimmed to the prescription, and avoid excessive gingival overlap. Reservoir use should follow the chosen system and clinician preference." },
    { n: 4, title: "Fit trays and check retention",           desc: "Check comfort, extension, pressure areas, occlusion, gel escape risk and patient insertion/removal." },
    { n: 5, title: "Complete first use and instruction",      desc: "Demonstrate the prescribed amount of gel, placement, wiping excess and safe storage. Record that instructions were understood." },
    { n: 6, title: "Arrange review",                          desc: "Review usually after the prescribed whitening course or sooner if sensitivity, irritation or uncertainty occurs." },
  ],

  /* Source: "SAFETY POINT" callout — single critical instruction. */
  safetyBox: {
    title: "Safety point",
    items: [
      "Never advise patients to increase wear time or gel volume to speed results. Overuse increases sensitivity, soft tissue irritation and dissatisfaction without guaranteeing a better final shade.",
    ],
  },

  /* Source: "PATIENT INSTRUCTIONS TO PROVIDE" checklist + "REVIEW
   * APPOINTMENT" bullets. */
  notes: [
    {
      title: "Patient instructions to provide",
      items: [
        "Use only the gel supplied by the practice.",
        "Apply only the prescribed amount to the advised teeth.",
        "Do not eat, drink or smoke while wearing trays.",
        "Wipe away excess gel from gums immediately.",
        "Keep gel away from children and pets.",
        "Follow storage instructions for the product.",
        "Stop and contact the practice for severe pain, burns or swelling.",
        "Bring trays and gel to the review appointment.",
      ],
    },
    {
      title: "Review appointment",
      items: [
        "Ask about sensitivity, soft tissue irritation, headaches, swallowing gel, compliance and wear time.",
        "Check tray fit and inspect gingiva, mucosa, teeth and restorations.",
        "Repeat shade record and photographs where appropriate.",
        "Confirm whether further gel, altered wear time, pause, desensitising treatment or restorative shade matching is needed.",
        "Reinforce top-up rules: no new gel should be issued without appropriate clinical review and documentation.",
      ],
    },
  ],

  auditPrompts: [
    "Annual audit for documentation of prescription and legal eligibility.",
    "First use, batch/expiry and written instructions documented.",
    "Outcome review and any adverse-effect management documented.",
  ],

  /* Source: "DOCUMENTATION REQUIREMENTS" form fields. */
  documentationPrompts: [
    { id: "assessmentConsentDone", label: "Assessment/Consent Completed" },
    { id: "baselineShade",          label: "Baseline Shade" },
    { id: "impressionScanDate",     label: "Impression/Scan Date" },
    { id: "trayFitCheckedBy",       label: "Tray Fit Checked By" },
    { id: "productName",            label: "Product Name" },
    { id: "concentration",          label: "Concentration" },
    { id: "batchExpiry",             label: "Batch and Expiry" },
    { id: "gelQuantityIssued",      label: "Gel Quantity Issued" },
    { id: "wearSchedule",           label: "Wear Schedule Prescribed" },
    { id: "reviewDate",             label: "Review Date" },
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
