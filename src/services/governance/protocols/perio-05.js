/**
 * Periodontal Clinical Protocol — PERIO-05
 * Step 2 Therapy: Non-Surgical Periodontal Treatment
 */
export const PERIO_05 = {
  id: "doc-perio-05",
  reference: "PERIO-05",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Step 2 Therapy: Non-Surgical Periodontal Treatment",
  subtitle: "Professional mechanical plaque removal, subgingival instrumentation, local anaesthetic, quadrant planning, and post-treatment advice.",

  metaStrip: {
    appliesTo: "Patients requiring active non-surgical therapy",
    frequency: "Planned treatment phase",
    lead:      "Dentist / hygienist",
    evidence:  "Treatment notes",
  },

  protocolStandard: "Non-surgical periodontal treatment should be delivered after diagnosis and patient preparation, with site-specific instrumentation, ongoing oral hygiene support and documented endpoints.",

  purpose: [
    "Standardise delivery of non-surgical periodontal therapy in general dental practice.",
    "Ensure instrumentation is linked to diagnosis, pocketing and treatment plan.",
    "Reduce repeated unstructured “scale and polish” episodes where active treatment is needed.",
  ],
  criticalControls: [
    "Antibiotics must not be used as a substitute for local debridement and risk-factor control.",
    "Review anticoagulants, bleeding risk, endocarditis advice and medical complexity before treatment.",
    "Do not instrument blindly beyond competence in complex furcation, deep defect or high-risk cases.",
    "Schedule reassessment; active therapy is incomplete without evaluating response.",
  ],

  workflow: [
    { n: 1, title: "Confirm readiness",       desc: "Check diagnosis, consent, medical history, plaque control, treatment plan and need for local anaesthesia." },
    { n: 2, title: "Plan treatment delivery", desc: "Agree full-mouth, staged, quadrant or site-specific treatment depending on complexity, tolerance and disease distribution." },
    { n: 3, title: "Instrument sites",        desc: "Carry out supra- and subgingival professional mechanical plaque removal using hand and/or powered instruments." },
    { n: 4, title: "Reinforce home care",     desc: "Recheck interdental aids and adapt instructions after instrumentation." },
    { n: 5, title: "Give aftercare",          desc: "Advise on tenderness, bleeding, analgesia, oral hygiene continuation and when to contact the practice." },
  ],

  decisionTable: {
    title: "Treatment Planning Controls",
    columns: ["Control", "Minimum expectation"],
    rows: [
      ["Consent",         "Discuss aims, limitations, sensitivity, recession, bleeding and need for maintenance."],
      ["Anaesthesia",     "Offer where needed for effective subgingival instrumentation and patient comfort."],
      ["Instrumentation", "Record areas treated, method used and any sites not completed."],
      ["Aftercare",       "Record advice, concerns, medications and reassessment timing."],
    ],
  },

  pathway: [
    { phase: "Prepare", desc: "Consent/history" },
    { phase: "Plan",    desc: "Sites/visits" },
    { phase: "Treat",   desc: "PMPR/RSI" },
    { phase: "Support", desc: "Home care" },
    { phase: "Review",  desc: "Reassess" },
  ],

  auditPrompts: [
    "Are active perio visits linked to a diagnosis and chart?",
    "Are areas treated and treatment type recorded clearly?",
    "Are reassessment dates planned at the end of active therapy?",
    "Are antibiotics avoided unless clear indications are documented?",
  ],

  documentationPrompts: [
    { id: "sitesTreated", label: "Sites Treated" },
    { id: "laUsed",       label: "LA Used" },
    { id: "tolerance",    label: "Tolerance" },
    { id: "aftercare",    label: "Aftercare" },
  ],

  clinicalSources: [
    { name: "BSP — UK Clinical Practice Guidelines for the Treatment of Periodontitis", url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
    { name: "SDCEP — Periodontal Care guidance",                                          url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
    { name: "SDCEP — Drug Prescribing for Dentistry (antimicrobial stewardship)",         url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  ],

  version: {
    number:         "1.0",
    status:         "published",
    publishedAt:    "2026-02-15T00:00:00.000Z",
    effectiveDate:  "2026-02-15T00:00:00.000Z",
    nextReviewDate: "2027-02-15T00:00:00.000Z",
    ownerName:      "Ryan Hale",      ownerRole:    "Governance Lead",
    approverName:   "Dr. Callum Lead", approverRole: "Clinical Director",
    reviewerName:   "Dr. Hannah Reed",     reviewerRole: "Periodontist",
    changeSummary:  "Initial published version. Step 2 therapy aligned to BSP S3 + SDCEP antimicrobial stewardship.",
  },
};
