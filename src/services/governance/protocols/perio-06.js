/**
 * Periodontal Clinical Protocol — PERIO-06
 * Reassessment, Treatment Endpoints & Escalation
 */
export const PERIO_06 = {
  id: "doc-perio-06",
  reference: "PERIO-06",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Reassessment, Treatment Endpoints & Escalation",
  subtitle: "Review timing, response assessment, pocket closure, bleeding reduction, residual disease, further treatment, and referral triggers.",

  metaStrip: {
    appliesTo: "After active periodontal therapy",
    frequency: "Usually 8–12 weeks / 3 months",
    lead:      "Treating clinician",
    evidence:  "Reassessment chart",
  },

  protocolStandard: "Periodontal treatment should be followed by reassessment to confirm response, identify residual disease and decide whether to maintain, repeat, intensify or refer.",

  purpose: [
    "Prevent periodontal treatment from ending without objective reassessment.",
    "Define stability, partial response and non-response in a practical way.",
    "Support timely escalation for residual deep pockets, suppuration, furcations or rapid progression.",
  ],
  criticalControls: [
    "Do not label a patient stable if bleeding, suppuration or progressive pocketing remains uncontrolled.",
    "Residual pockets of concern require a documented plan, not indefinite observation.",
    "Check whether non-response is due to home care, smoking, diabetes, local anatomy, restorations, compliance or diagnosis.",
    "Escalate early where disease progression appears rapid or disproportionate.",
  ],

  workflow: [
    { n: 1, title: "Re-chart key findings", desc: "Repeat appropriate periodontal charting, bleeding, plaque, suppuration, mobility and furcation assessment." },
    { n: 2, title: "Compare with baseline", desc: "Assess changes in pocket depths, bleeding, plaque score, symptoms and patient home-care performance." },
    { n: 3, title: "Classify response",     desc: "Record stable, improving, residual active disease or non-response with reasons." },
    { n: 4, title: "Decide next step",      desc: "Move to supportive care, repeat Step 1/2 elements, consider advanced therapy or refer." },
    { n: 5, title: "Update prognosis",      desc: "Revise tooth-level prognosis, maintenance interval and patient responsibilities." },
  ],

  decisionTable: {
    title: "Reassessment Decision Guide",
    columns: ["Finding", "Action"],
    rows: [
      ["Low plaque/bleeding and pocket closure",                       "Move to supportive periodontal care with risk-based interval."],
      ["Residual 4–5 mm pockets with BoP",                              "Reinforce Step 1 and consider further site-specific instrumentation."],
      ["Residual ≥ 6 mm pockets, suppuration or furcation complexity", "Consider advanced treatment, specialist advice or referral."],
      ["Poor plaque control / non-attendance",                          "Revisit communication, motivation, risk discussion and prognosis."],
    ],
  },

  pathway: [
    { phase: "Re-chart", desc: "Measure response" },
    { phase: "Compare",  desc: "Baseline vs today" },
    { phase: "Classify", desc: "Stable/residual" },
    { phase: "Decide",   desc: "Maintain/escalate" },
    { phase: "Update",   desc: "Prognosis" },
  ],

  auditPrompts: [
    "Are reassessments booked and completed after active therapy?",
    "Are baseline and reassessment measurements comparable?",
    "Are residual disease sites given a documented plan?",
    "Are referral triggers applied consistently?",
  ],

  documentationPrompts: [
    { id: "reassessmentDate", label: "Reassessment Date" },
    { id: "plaqueBop",         label: "Plaque/BoP" },
    { id: "response",          label: "Response" },
    { id: "nextStep",          label: "Next Step" },
  ],

  clinicalSources: [
    { name: "BSP — UK Clinical Practice Guidelines for the Treatment of Periodontitis", url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
    { name: "SDCEP — Periodontal Care guidance",                                          url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
    { name: "EFP — S3-level clinical practice guideline for stage I–III periodontitis",    url: "https://www.efp.org/publications/projects/clinical-practice-guidelines/" },
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
    changeSummary:  "Initial published version. Reassessment + escalation triggers aligned to BSP S3 + EFP S3.",
  },
};
