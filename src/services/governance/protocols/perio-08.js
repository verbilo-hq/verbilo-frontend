/**
 * Periodontal Clinical Protocol — PERIO-08
 * Furcation, Mobility & Advanced Periodontal Defects
 */
export const PERIO_08 = {
  id: "doc-perio-08",
  reference: "PERIO-08",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Furcation, Mobility & Advanced Periodontal Defects",
  subtitle: "Recognising furcation involvement, tooth mobility, recession, infrabony defects, prognosis assessment and shared decisions about complex teeth.",

  metaStrip: {
    appliesTo: "Patients with advanced findings",
    frequency: "On detection or change",
    lead:      "Treating clinician",
    evidence:  "Charting + imaging",
  },

  protocolStandard: "Advanced periodontal findings — furcation involvement, increased mobility, vertical bone loss or marked recession — should be characterised, documented and used to shape prognosis and treatment options.",

  purpose: [
    "Make sure advanced findings are detected, classified and recorded rather than glossed over.",
    "Connect findings to a realistic tooth-level prognosis and treatment options.",
    "Support shared decisions about retention, replacement or referral for complex teeth.",
  ],
  criticalControls: [
    "Use validated grading systems (Hamp for furcations, Miller for mobility, Cairo for recession).",
    "Do not assign an optimistic prognosis to teeth with deep furcations or significant mobility without explicit reasoning.",
    "Discuss limitations, alternatives and risks with the patient before extensive restorative work on compromised teeth.",
    "Image when justified — vertical defects, furcations and prognosis decisions usually warrant up-to-date radiographs.",
  ],

  workflow: [
    { n: 1, title: "Detect on examination",   desc: "Probe furcations, test mobility, measure recession and identify suspected vertical defects." },
    { n: 2, title: "Classify and record",     desc: "Document Hamp furcation grade, Miller mobility grade and Cairo recession class with site-specific notes." },
    { n: 3, title: "Image where indicated",   desc: "Use periapical or, where appropriate, CBCT imaging to clarify bone loss pattern, furcation anatomy or defect morphology." },
    { n: 4, title: "Set prognosis honestly",  desc: "Use findings to assign a tooth-level prognosis, balancing periodontal, endodontic, restorative and patient factors." },
    { n: 5, title: "Discuss options",         desc: "Share treatment options including maintenance, advanced periodontal therapy, extraction, replacement or referral." },
  ],

  decisionTable: {
    title: "Advanced Finding Guide",
    columns: ["Finding", "Action"],
    rows: [
      ["Hamp Grade I furcation",                       "Maintain with targeted hygiene, monitor and reinforce home care."],
      ["Hamp Grade II or III furcation",                "Consider advanced therapy, referral or revised prognosis and discuss with patient."],
      ["Miller mobility ≥ Grade II",                    "Investigate cause, consider splinting only where indicated, review prognosis and restorative plan."],
      ["Marked recession or vertical defect",           "Document Cairo class, plan imaging where justified and consider surgical/specialist input."],
    ],
  },

  pathway: [
    { phase: "Detect",   desc: "Examination" },
    { phase: "Classify", desc: "Grade/record" },
    { phase: "Image",    desc: "If justified" },
    { phase: "Prognosis",desc: "Honest plan" },
    { phase: "Discuss",  desc: "Options/refer" },
  ],

  auditPrompts: [
    "Are furcations, mobility and recession recorded using accepted grading systems?",
    "Are advanced findings reflected in tooth-level prognosis?",
    "Are radiographs justified and clinically linked when used for advanced defects?",
    "Are complex cases discussed with the patient and offered referral where appropriate?",
  ],

  documentationPrompts: [
    { id: "furcationGrade", label: "Furcation Grade" },
    { id: "mobilityGrade",  label: "Mobility Grade" },
    { id: "radiograph",     label: "Radiograph" },
    { id: "optionsDiscussed", label: "Options Discussed" },
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
    changeSummary:  "Initial published version. Furcation/mobility/recession classification aligned to BSP + EFP S3.",
  },
};
