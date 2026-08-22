/**
 * Periodontal Clinical Protocol — PERIO-02
 * Comprehensive Periodontal Assessment & Diagnosis
 */
export const PERIO_02 = {
  id: "doc-perio-02",
  reference: "PERIO-02",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Comprehensive Periodontal Assessment & Diagnosis",
  subtitle: "Full periodontal charting, bleeding, plaque, recession, mobility, furcations, radiographs, diagnosis, staging and grading.",

  metaStrip: {
    appliesTo: "Patients needing full assessment",
    frequency: "When BPE/risk indicates",
    lead:      "Dentist / clinician",
    evidence:  "Perio chart, diagnosis",
  },

  protocolStandard: "A periodontal diagnosis should be based on clinical assessment, periodontal charting, risk factors and radiographic evidence where justified, using current classification principles.",

  purpose: [
    "Define the minimum elements of a full periodontal assessment.",
    "Support consistent diagnosis, staging, grading and prognosis across the practice.",
    "Ensure the treatment plan is linked to disease status, risk and patient priorities.",
  ],
  criticalControls: [
    "Do not stage and grade periodontitis without enough clinical and radiographic information.",
    "Consider diabetes, smoking and rapid progression when grading and prognosis are uncertain.",
    "Incidental radiographic or clinical findings must be recorded and acted upon.",
    "Where diagnosis is uncertain, arrange review, further records or referral rather than under-recording.",
  ],

  workflow: [
    { n: 1, title: "Update history",            desc: "Review medical history, medications, smoking, diabetes control, pregnancy, immunosuppression and previous periodontal care." },
    { n: 2, title: "Complete periodontal chart", desc: "Record six-point probing depths, bleeding on probing, recession, clinical attachment where required, plaque, suppuration and mucogingival concerns." },
    { n: 3, title: "Assess complexity",          desc: "Record mobility, furcation involvement, drifting, tooth prognosis, occlusal concerns and local plaque-retentive factors." },
    { n: 4, title: "Use radiographs appropriately", desc: "Take or review radiographs only where clinically justified to assess bone levels, local factors or treatment planning." },
    { n: 5, title: "Diagnose and plan",          desc: "Record periodontal diagnosis, extent, stage/grade where relevant, stability status, prognosis and agreed treatment pathway." },
  ],

  decisionTable: {
    title: "Assessment Components",
    columns: ["Component", "Record"],
    rows: [
      ["Periodontal chart", "Six-point probing, bleeding, plaque, recession/attachment loss, suppuration and furcations where relevant."],
      ["Tooth factors",     "Mobility, drifting, migration, restorability, caries, endodontic status and occlusal concerns."],
      ["Risk factors",      "Smoking status, diabetes control, plaque control, previous tooth loss, family history and compliance."],
      ["Diagnosis",         "Disease category, extent, stage, grade, stability, prognosis and treatment plan."],
    ],
  },

  pathway: [
    { phase: "History",  desc: "Risk and symptoms" },
    { phase: "Chart",    desc: "Sites and bleeding" },
    { phase: "Image",    desc: "Justified radiographs" },
    { phase: "Diagnose", desc: "Stage and grade" },
    { phase: "Plan",     desc: "Shared decision" },
  ],

  auditPrompts: [
    "Is full charting completed when BPE findings require it?",
    "Does the record show a clear diagnosis rather than only BPE scores?",
    "Are radiographs justified and interpreted in the notes?",
    "Is staging/grading consistent with clinical and radiographic evidence?",
  ],

  documentationPrompts: [
    { id: "diagnosis",         label: "Diagnosis" },
    { id: "stageGrade",        label: "Stage/Grade" },
    { id: "bopScore",          label: "BoP Score" },
    { id: "radiographsReviewed", label: "Radiographs Reviewed" },
  ],

  clinicalSources: [
    { name: "BSP — Implementation of the 2017 Classification of Periodontal Diseases and Conditions", url: "https://www.bsperio.org.uk/professionals/new-classification-of-periodontal-diseases" },
    { name: "SDCEP — Periodontal Care guidance",                                                       url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
    { name: "BSP — UK Clinical Practice Guidelines for the Treatment of Periodontitis",                url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
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
    changeSummary:  "Initial published version aligned to BSP 2018 classification + BSP S3 2021 guidelines.",
  },
};
