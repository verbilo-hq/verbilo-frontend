/**
 * Periodontal Clinical Protocol — PERIO-01
 * Periodontal Screening, BPE & Record Keeping
 *
 * Structured controlled-document content for the Clinical Governance pack
 * under Governance & SOPs. The shape mirrors what the PDF source represents
 * but is data, not a binary — so the platform can:
 *   - render it in the protocol-pattern viewer
 *   - track versions in the existing `document_versions` table
 *   - capture electronic sign-off per (practice, version)
 *   - link to staff acknowledgements + audit linkage
 *
 * Sourced from: BSP BPE Guidelines (2019) · BSP/BSPD under-18s · SDCEP
 * Periodontal Care. Citations preserved on the protocol so the practice can
 * defend the content during inspection.
 *
 * Once this protocol's structure is confirmed, the other 9 perio protocols
 * follow the same shape — only the data changes, not the renderer.
 */

export const PERIO_01 = {
  id: "doc-perio-01",
  reference: "PERIO-01",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Periodontal Screening, BPE & Record Keeping",
  subtitle: "Adult BPE, simplified BPE for under-18s, scoring, recording, risk flags, and when to complete a full periodontal chart.",

  /* ── Header strip (APPLIES TO / FREQUENCY / LEAD / EVIDENCE) ─────────── */
  metaStrip: {
    appliesTo: "All dentate patients",
    frequency: "New patient and recall",
    lead:      "Dentist / hygienist",
    evidence:  "BPE, risk notes, charting",
  },

  /* ── Top-of-page Protocol Standard (the one-line summary) ────────────── */
  protocolStandard: "Use BPE as a screening tool only. It indicates the level of further periodontal assessment required and does not replace a diagnosis or full periodontal assessment where indicated.",

  /* ── Purpose + Critical Controls (two-column section) ────────────────── */
  purpose: [
    "Standardise periodontal screening across dentists, hygienists and therapists.",
    "Identify patients needing full periodontal assessment, radiographs, active treatment or referral.",
    "Create clear, audit-ready records that support diagnosis, treatment planning and recall decisions.",
  ],
  criticalControls: [
    "BPE is not a diagnosis and must not be used alone to diagnose periodontitis.",
    "Do not ignore bleeding, suppuration, mobility or recession simply because BPE scores appear low.",
    "Radiographs must be clinically justified and linked to assessment or treatment planning needs.",
    "Document the patient's risk factors and whether further assessment has been accepted or declined.",
  ],

  /* ── Numbered workflow (Core Clinical Workflow on page 1) ─────────────── */
  workflow: [
    { n: 1, title: "Check risk and symptoms",   desc: "Review smoking, diabetes, bleeding, mobility, drifting, previous periodontal treatment and patient concerns." },
    { n: 2, title: "Carry out BPE",             desc: "Use a WHO/BPE probe, record the highest score in each sextant, and record an asterisk where furcation involvement is suspected." },
    { n: 3, title: "Screen younger patients",   desc: "Use age-appropriate simplified BPE for children and adolescents from 7 years where indicated by BSP/BSPD guidance." },
    { n: 4, title: "Trigger further charting",  desc: "Complete appropriate full periodontal charting where BPE 3, BPE 4, asterisk, recession, mobility, drifting or other clinical concern is present." },
    { n: 5, title: "Record and explain",        desc: "Record scores, advice, risk factors, plan and review date. Explain findings and next steps to the patient." },
  ],

  /* ── Decision table (BPE-Driven Action Guide on page 2) ──────────────── */
  decisionTable: {
    title: "BPE-Driven Action Guide",
    columns: ["Finding", "Minimum clinical response"],
    rows: [
      ["0–2", "Record BPE, reinforce prevention, address plaque-retentive factors and set risk-based recall."],
      ["3",   "Full periodontal charting in affected sextant or more widely if clinical judgement indicates."],
      ["4",   "Full-mouth periodontal charting, diagnosis, risk assessment and structured treatment planning."],
      ["*",   "Assess furcation involvement, record site-specific findings and consider radiographs/referral depending on complexity."],
    ],
  },

  /* ── Pathway snapshot (five-step strip on page 2) ────────────────────── */
  pathway: [
    { phase: "Screen",    desc: "BPE" },
    { phase: "Interpret", desc: "Risk flags" },
    { phase: "Chart",     desc: "When triggered" },
    { phase: "Plan",      desc: "Discuss options" },
    { phase: "Record",    desc: "Audit-ready" },
  ],

  /* ── Audit prompts (CQC-style) ───────────────────────────────────────── */
  auditPrompts: [
    "Are BPE scores recorded for all appropriate adult recall and new patient examinations?",
    "Are BPE 3/4 or asterisk findings followed by appropriate charting and diagnosis?",
    "Are risk factors and patient discussions documented clearly?",
    "Is recall interval justified by risk and disease status?",
  ],

  /* ── Documentation prompts (what must appear in the patient record) ──── */
  documentationPrompts: [
    { id: "bpeDate",        label: "BPE Date" },
    { id: "scoresRecorded", label: "Scores Recorded" },
    { id: "riskFactors",    label: "Risk Factors" },
    { id: "adviceGiven",    label: "Advice Given" },
  ],

  /* ── Clinical sources ────────────────────────────────────────────────── */
  clinicalSources: [
    { name: "BSP — BPE Guidelines (2019)",                                           url: "https://www.bsperio.org.uk/professionals/basic-periodontal-examination-bpe-information" },
    { name: "BSP/BSPD — Periodontal Screening & Management Under 18 Years of Age",   url: "https://www.bsperio.org.uk/professionals/under-18s" },
    { name: "SDCEP — Periodontal Care guidance",                                     url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
  ],

  /* ── Version metadata (mirrors document_versions row) ────────────────── */
  version: {
    number:         "1.0",
    status:         "published",
    publishedAt:    "2026-02-15T00:00:00.000Z",
    effectiveDate:  "2026-02-15T00:00:00.000Z",
    nextReviewDate: "2027-02-15T00:00:00.000Z",
    ownerName:      "Ryan Hale",            ownerRole:    "Governance Lead",
    approverName:   "Dr. Callum Lead",       approverRole: "Clinical Director",
    reviewerName:   "Dr. Hannah Reed",           reviewerRole: "Periodontist",
    changeSummary:  "Initial published version aligned to BSP 2019 BPE Guidelines + BSP/BSPD under-18s simplified BPE.",
  },
};
