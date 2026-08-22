/**
 * Periodontal Clinical Protocol — PERIO-04
 * Step 1 Therapy: Oral Hygiene & Risk-Factor Control
 */
export const PERIO_04 = {
  id: "doc-perio-04",
  reference: "PERIO-04",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Step 1 Therapy: Oral Hygiene & Risk-Factor Control",
  subtitle: "Personalised oral hygiene instruction, interdental cleaning, plaque-retentive factors, smoking cessation, diabetes advice, and behaviour change.",

  metaStrip: {
    appliesTo: "Gingivitis and periodontitis care",
    frequency: "Before/during active care",
    lead:      "Dental team",
    evidence:  "OHI and risk plan",
  },

  protocolStandard: "Step 1 therapy builds the foundations for periodontal stability by improving oral hygiene, reducing inflammation and controlling modifiable risk factors before further active treatment.",

  purpose: [
    "Set a consistent baseline intervention before advanced or repeated instrumentation.",
    "Improve plaque control, bleeding scores and patient confidence.",
    "Reduce risk factors that undermine periodontal treatment outcomes.",
  ],
  criticalControls: [
    "Do not proceed through repeated advanced treatment if plaque control remains inadequate without documenting the rationale.",
    "Avoid generic advice such as “improve oral hygiene” without specific instructions.",
    "Adapt aids for dexterity, disability, orthodontic appliances, implants or bridges.",
    "Record patient engagement and barriers; this affects prognosis and maintenance interval.",
  ],

  workflow: [
    { n: 1, title: "Agree patient goals",   desc: "Ask what the patient can realistically change and agree a simple home-care plan." },
    { n: 2, title: "Demonstrate technique", desc: "Show toothbrushing and interdental cleaning using the patient's mouth, chart or mirror where possible." },
    { n: 3, title: "Prescribe aids",        desc: "Record brush type, interdental brush/floss sizes and frequency. Review fit and technique." },
    { n: 4, title: "Remove local barriers", desc: "Identify and address plaque-retentive calculus, overhangs, open margins or appliances where appropriate." },
    { n: 5, title: "Control systemic risk", desc: "Offer smoking cessation advice, diabetes signposting and tailored advice for dry mouth or dexterity barriers." },
  ],

  decisionTable: {
    title: "Step 1 Intervention Menu",
    columns: ["Intervention", "Record requirement"],
    rows: [
      ["Brushing",                 "Brush type, fluoride toothpaste advice, technique and frequency."],
      ["Interdental cleaning",      "Aid type, sizes, sites and demonstration given."],
      ["Risk control",              "Smoking/vaping advice, diabetes discussion and relevant signposting."],
      ["Plaque-retentive factors",  "Calculus, restoration overhangs, caries, appliance issues and planned corrections."],
    ],
  },

  pathway: [
    { phase: "Explain",   desc: "Why it matters" },
    { phase: "Show",      desc: "Technique" },
    { phase: "Prescribe", desc: "Specific aids" },
    { phase: "Support",   desc: "Risk change" },
    { phase: "Review",    desc: "Scores and barriers" },
  ],

  auditPrompts: [
    "Are interdental aid sizes recorded rather than only “OHI given”?",
    "Are smoking and diabetes interventions documented where relevant?",
    "Is plaque/BOP response reviewed before moving to further treatment?",
    "Are barriers such as dexterity, cognition or cost considered?",
  ],

  documentationPrompts: [
    { id: "brushAdvice",     label: "Brush Advice" },
    { id: "interdentalAids", label: "Interdental Aids" },
    { id: "bopScore",        label: "BoP Score" },
    { id: "riskAdvice",      label: "Risk Advice" },
  ],

  clinicalSources: [
    { name: "BSP — S3 Treatment Flow Chart for periodontal diseases", url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
    { name: "SDCEP — Periodontal Care guidance",                       url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
    { name: "Delivering Better Oral Health — periodontal disease prevention advice", url: "https://www.gov.uk/government/publications/delivering-better-oral-health-an-evidence-based-toolkit-for-prevention" },
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
    changeSummary:  "Initial published version. Step 1 therapy aligned to BSP S3 stepwise approach.",
  },
};
