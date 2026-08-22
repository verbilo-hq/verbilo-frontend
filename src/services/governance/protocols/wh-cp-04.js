/**
 * Whitening & Aesthetics Clinical Protocol — WH-CP-04
 * Sensitivity & Adverse Effects Management
 *
 * Source: Whitening Clinical Protocol Pack, WH-CP-04, reviewed May 2026.
 * Text preserved verbatim from the source PDF.
 */

import { WH_USAGE_NOTE, WH_VERSION_BASE, WH_REF } from "./wh-common";

export const WH_CP_04 = {
  id: "doc-wh-cp-04",
  reference: "WH-CP-04",
  packKey: "clinical_governance",
  category: "Whitening & Aesthetics",
  type: "sop",
  title: "Sensitivity & Adverse Effects Management",
  subtitle: "Sensitivity prevention, desensitising advice, gum irritation, non-response, relapse, and when to pause treatment.",

  localSignOffNote: WH_USAGE_NOTE,

  metaStrip: {
    appliesTo: "Patients with whitening-related sensitivity, irritation, non-response or relapse",
    frequency: "When an adverse effect occurs or is reported",
    lead:      "Dentist (reviewing clinician); supervised competent DCP may screen and triage",
    evidence:  "Incident record, revised prescription and restart/discontinue plan",
  },

  standardLabel: "Purpose",
  protocolStandard: "This protocol gives a consistent practice response to sensitivity, soft tissue irritation, poor response, uneven whitening, relapse and other adverse effects during or after tooth whitening.",

  /* Source: "PREVENTION BEFORE WHITENING" checklist — preventive measures
   * that count as critical pre-treatment controls. */
  criticalControls: [
    "Record baseline sensitivity and recession.",
    "Treat caries, fractures, defective margins and periodontal inflammation first.",
    "Advise sensitive toothpaste before and during whitening where indicated.",
    "Check custom tray fit before gel issue.",
    "Prescribe concentration and wear time based on risk.",
    "Give written instructions on gel quantity and stopping rules.",
  ],

  /* Source: "COMMON CAUSES TO CONSIDER" bullets. */
  purpose: [
    "Baseline dentine sensitivity, gingival recession, exposed root surfaces or enamel defects.",
    "Cracked teeth, defective margins, caries, pulpal inflammation or untreated periodontal inflammation.",
    "Overloading trays, poorly fitting trays, excess gingival overlap or gel leakage.",
    "Higher concentration, longer wear time, repeated cycles or patient overuse.",
    "Staining habits, smoking/vaping, white spot lesions, tetracycline staining or unrealistic expectations.",
  ],

  /* Source: "MANAGEMENT TABLE" 3-column. */
  decisionTable: {
    title: "Management table",
    columns: ["Finding", "Likely cause", "Practice response"],
    rows: [
      ["Mild transient sensitivity",                  "Expected temporary response to whitening",                              "Reassure, advise sensitive toothpaste, consider reduced wear time or alternate-day use if home whitening."],
      ["Moderate sensitivity affecting sleep or eating","Overuse, exposed dentine, tray pressure, higher concentration",         "Pause whitening, arrange review, check tray fit and teeth, restart only with adjusted schedule if safe."],
      ["Sharp spontaneous pain or lingering thermal pain","Pulpitis, cracked tooth, caries or restoration issue",                  "Stop whitening and arrange dentist assessment before any restart."],
      ["Gingival blanching or burning",                "Gel contact, tray overfill, poor isolation or poor tray fit",            "Remove gel, rinse, check tissues, review tray/application; pause until tissues heal."],
      ["Ulceration or persistent mucosal soreness",    "Chemical irritation, trauma or unrelated lesion",                        "Dentist review. Do not restart whitening until lesion is diagnosed or resolved."],
      ["Uneven whitening or white spots more visible", "Dehydration, enamel defects, fluorosis, plaque, early demineralisation","Review, allow rehydration, assess caries risk, consider remineralisation and revised expectations."],
      ["Poor response",                                 "Grey/tetracycline staining, non-compliance, product issue, restorations","Check use, product and expectations; discuss alternative restorative options if appropriate."],
      ["Relapse",                                       "Dietary staining, smoking/vaping, time since treatment",                "Assess oral health and provide dentist-approved top-up plan if appropriate."],
    ],
  },

  /* Source: "RESTARTING WHITENING AFTER AN ADVERSE EFFECT" numbered. */
  workflow: [
    { n: 1, title: "Pause treatment",             desc: "No further gel use until the symptoms are understood and safe next steps are agreed." },
    { n: 2, title: "Review cause",                  desc: "Check oral tissues, teeth, tray fit, product concentration, amount used, wear time and patient technique." },
    { n: 3, title: "Modify the plan",               desc: "Consider lower concentration, shorter wear time, alternate-day use, desensitising measures, tray adjustment or discontinuation." },
    { n: 4, title: "Record advice and safety net",  desc: "Document symptoms, diagnosis, advice, revised prescription and when the patient should contact the practice." },
  ],

  /* Source: "SAME-DAY DENTIST REVIEW IS REQUIRED FOR" callout. */
  safetyBox: {
    title: "Same-day dentist review is required for",
    items: [
      "Severe or spontaneous pain.",
      "Swelling, suppuration, trauma, fractured tooth or suspected pulpal pathology.",
      "Soft tissue burn, ulceration, sloughing or symptoms persisting beyond 24–48 hours.",
      "Possible eye exposure, significant ingestion or systemic symptoms.",
      "Any adverse effect where the team member is unsure whether whitening can safely continue.",
    ],
  },

  /* Source: "PATIENT STOPPING RULES" — patient-facing instructions kept
   * as a titled note so the team can show them verbatim. */
  notes: [
    {
      title: "Patient stopping rules",
      items: [
        "Stop whitening and contact the practice for severe pain, gum burns, swelling, ulceration, spontaneous pain or symptoms that do not settle after pausing.",
        "Do not increase gel amount, wear time or cycle frequency without clinical advice.",
        "Bring trays and gel to any review appointment so fit and use can be checked.",
      ],
    },
  ],

  auditPrompts: [
    "Whitening adverse events reviewed at clinical governance meetings.",
    "Audit triggered where harm, complaint, product failure or unclear delegation occurred.",
    "Incident, advice and restart/discontinue plan documented for every adverse event.",
  ],

  /* Source: "INCIDENT AND DOCUMENTATION RECORD" form fields. */
  documentationPrompts: [
    { id: "dateReported",          label: "Date Reported" },
    { id: "clinicianReviewing",    label: "Clinician Reviewing" },
    { id: "productAndConc",        label: "Product and Concentration" },
    { id: "batchNumber",           label: "Batch Number" },
    { id: "symptomsOnset",         label: "Symptoms and Onset" },
    { id: "likelyCause",           label: "Likely Cause" },
    { id: "adviceGiven",           label: "Advice Given" },
    { id: "restartDiscontinue",    label: "Restart / Discontinue Plan" },
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
