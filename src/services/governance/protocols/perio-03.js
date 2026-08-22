/**
 * Periodontal Clinical Protocol — PERIO-03
 * Periodontal Risk Assessment & Patient Communication
 */
export const PERIO_03 = {
  id: "doc-perio-03",
  reference: "PERIO-03",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Periodontal Risk Assessment & Patient Communication",
  subtitle: "Smoking, diabetes, plaque control, medical factors, prognosis, consent discussion, patient motivation, and shared decision-making.",

  metaStrip: {
    appliesTo: "Patients with gingivitis/periodontitis risk",
    frequency: "Baseline and reviews",
    lead:      "Treating clinician",
    evidence:  "Risk and consent notes",
  },

  protocolStandard: "Periodontal care must include explanation of disease, risk factors, treatment alternatives, likely benefits and risks, including the option of no treatment.",

  purpose: [
    "Create a consistent approach to explaining periodontal disease and prognosis.",
    "Make patient responsibility for home care, risk-factor control and maintenance explicit.",
    "Support informed consent for periodontal treatment and long-term supportive care.",
  ],
  criticalControls: [
    "Avoid implying periodontal treatment is a one-off cure. It is long-term disease control.",
    "Record refusal or non-attendance clearly and neutrally, including advice given and risks explained.",
    "When prognosis is guarded or poor, record tooth-specific prognosis and options.",
    "Use interpreters or accessible formats where communication needs require this.",
  ],

  workflow: [
    { n: 1, title: "Identify modifiable risk",   desc: "Record plaque control, smoking/vaping, diabetes control, diet, interdental cleaning, dry mouth and attendance pattern." },
    { n: 2, title: "Assess non-modifiable risk", desc: "Consider age, history of progression, previous tooth loss, family history and medical complexity." },
    { n: 3, title: "Explain the disease",        desc: "Use plain language to explain inflammation, bone support loss, pocketing, bleeding and stability versus active disease." },
    { n: 4, title: "Discuss options",            desc: "Explain prevention, non-surgical treatment, advanced therapy/referral, supportive care, no treatment and likely consequences." },
    { n: 5, title: "Document agreement",         desc: "Record questions, agreed plan, costs where relevant, patient responsibilities and whether the patient accepts or declines care." },
  ],

  decisionTable: {
    title: "Risk Communication Prompts",
    columns: ["Area", "Wording to cover"],
    rows: [
      ["Home care",      "Daily plaque removal and interdental cleaning are central to treatment success."],
      ["Smoking/vaping", "Smoking increases progression risk and reduces treatment response; offer cessation advice or referral."],
      ["Diabetes",       "Poor glycaemic control is linked with periodontal risk; advise liaison with GP/diabetes team where appropriate."],
      ["No treatment",   "Untreated active periodontitis may progress to mobility, drifting, abscesses and tooth loss."],
    ],
  },

  pathway: [
    { phase: "Assess",  desc: "Risk factors" },
    { phase: "Explain", desc: "Disease and prognosis" },
    { phase: "Options", desc: "Treat or monitor" },
    { phase: "Consent", desc: "Questions answered" },
    { phase: "Record",  desc: "Plan and duties" },
  ],

  auditPrompts: [
    "Are smoking, diabetes and plaque control routinely recorded?",
    "Do treatment notes show risks, alternatives and no-treatment options?",
    "Are patient responsibilities documented before active therapy starts?",
    "Are declined recommendations and missed appointments recorded appropriately?",
  ],

  documentationPrompts: [
    { id: "riskFactors",      label: "Risk Factors" },
    { id: "optionsExplained", label: "Options Explained" },
    { id: "patientQuestions", label: "Patient Questions" },
    { id: "planAccepted",     label: "Plan Accepted" },
  ],

  clinicalSources: [
    { name: "BSP — S3 Treatment Flow Chart for periodontal diseases", url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
    { name: "SDCEP — Periodontal Care guidance",                       url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
    { name: "GDC — Standards on consent and patient communication",    url: "https://www.gdc-uk.org/standards-guidance/standards-and-guidance/standards-for-the-dental-team" },
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
    changeSummary:  "Initial published version. Patient communication aligned to BSP S3 + GDC Standards on consent.",
  },
};
