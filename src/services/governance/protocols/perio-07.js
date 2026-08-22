/**
 * Periodontal Clinical Protocol — PERIO-07
 * Supportive Periodontal Care & Recall Planning
 */
export const PERIO_07 = {
  id: "doc-perio-07",
  reference: "PERIO-07",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Supportive Periodontal Care & Recall Planning",
  subtitle: "Long-term maintenance, risk-based recall intervals, monitoring stability, professional mechanical plaque removal, and managing relapse.",

  metaStrip: {
    appliesTo: "Patients after active therapy",
    frequency: "Risk-based ongoing care",
    lead:      "Dental team",
    evidence:  "SPT record",
  },

  protocolStandard: "Patients who have completed active periodontal therapy should receive supportive periodontal care that updates histories, reassesses risk control and provides maintenance treatment where needed.",

  purpose: [
    "Sustain the outcomes of active periodontal therapy through structured maintenance.",
    "Detect relapse, residual disease and changing risk factors early.",
    "Match recall intervals to the patient's current disease activity and risk profile, not a fixed routine.",
  ],
  criticalControls: [
    "Supportive care is not a routine scale and polish — it is a periodontal review with treatment as required.",
    "Patients with a periodontitis history should not drop out of structured recall without a documented decision.",
    "Reassess smoking, diabetes control, plaque performance and any new medications at each visit.",
    "Identify relapse promptly and return to active treatment rather than extending intervals.",
  ],

  workflow: [
    { n: 1, title: "Update history and risk", desc: "Review medical history, smoking, glycaemic control, medications, life events and any new symptoms." },
    { n: 2, title: "Monitor stability",       desc: "Targeted re-examination — plaque/bleeding scores, BPE or focused charting, mobility and any patient-reported concerns." },
    { n: 3, title: "Provide maintenance",     desc: "Reinforce home care, manage residual sites, perform professional mechanical plaque removal where indicated and address risk factors." },
    { n: 4, title: "Set the next interval",   desc: "Decide a risk-based recall interval and confirm responsibilities between dentist, hygienist and patient." },
    { n: 5, title: "Escalate on relapse",     desc: "Where disease has returned or progressed, return to active therapy or refer rather than continuing maintenance only." },
  ],

  decisionTable: {
    title: "Recall Interval Prompts",
    columns: ["Profile", "Recall approach"],
    rows: [
      ["Stable, low bleeding, good home care",                "Longer supportive interval with periodontal review at recall."],
      ["History of periodontitis with residual sites",         "Shorter SPT interval with targeted instrumentation at residual sites."],
      ["Smoker, diabetes, or persistent poor plaque control", "Closer maintenance with risk-factor discussion and home-care coaching."],
      ["Relapse or new active disease",                        "Reassess, return to active therapy and update prognosis."],
    ],
  },

  pathway: [
    { phase: "Update",   desc: "History/risk" },
    { phase: "Monitor",  desc: "Stability" },
    { phase: "Maintain", desc: "PMPR" },
    { phase: "Interval", desc: "Risk-based" },
    { phase: "Escalate", desc: "If relapse" },
  ],

  auditPrompts: [
    "Are supportive care appointments structured as periodontal reviews, not just hygiene visits?",
    "Are risk factors reassessed and discussed at each SPT visit?",
    "Are recall intervals justified by current disease activity and risk?",
    "Are relapsing patients returned to active treatment or referred?",
  ],

  documentationPrompts: [
    { id: "sptInterval",  label: "SPT Interval" },
    { id: "riskChanges",  label: "Risk Changes" },
    { id: "pmprGiven",    label: "PMPR Given" },
    { id: "ohiUpdated",   label: "OHI Updated" },
  ],

  clinicalSources: [
    { name: "SDCEP — Supportive Periodontal Care (Periodontal Care guidance)",            url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
    { name: "BSP — UK Clinical Practice Guidelines for the Treatment of Periodontitis",  url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
    { name: "EFP — S3-level clinical practice guideline for stage I–III periodontitis",  url: "https://www.efp.org/publications/projects/clinical-practice-guidelines/" },
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
    changeSummary:  "Initial published version. Supportive care and risk-based recall aligned to SDCEP + BSP S3 + EFP S3.",
  },
};
