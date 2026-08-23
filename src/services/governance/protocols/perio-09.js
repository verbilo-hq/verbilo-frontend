/**
 * Periodontal Clinical Protocol — PERIO-09
 * Acute Periodontal Conditions & Antimicrobial Stewardship
 */
export const PERIO_09 = {
  id: "doc-perio-09",
  reference: "PERIO-09",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Acute Periodontal Conditions & Antimicrobial Stewardship",
  subtitle: "Periodontal abscesses, necrotising periodontal diseases, pericoronitis and antibiotic decisions aligned to UK antimicrobial stewardship guidance.",

  metaStrip: {
    appliesTo: "Acute presentations",
    frequency: "On urgent attendance",
    lead:      "Urgent care clinician",
    evidence:  "Diagnosis and rationale",
  },

  protocolStandard: "Acute periodontal conditions are managed with prompt local treatment, appropriate analgesia and antibiotic prescribing only where systemic involvement or specific clinical indications justify it.",

  purpose: [
    "Provide a consistent, evidence-based approach to acute periodontal presentations.",
    "Reduce inappropriate antibiotic prescribing in line with UK antimicrobial stewardship guidance.",
    "Make sure red-flag systemic symptoms are recognised and escalated quickly.",
  ],
  criticalControls: [
    "Local debridement and drainage are first-line for periodontal abscesses in patients who are systemically well.",
    "Antibiotics are not a substitute for treatment and must not be prescribed routinely for localised periodontal pain.",
    "Identify spreading infection, systemic upset, immunocompromise or airway concern and escalate or refer urgently.",
    "Record diagnosis, clinical findings, treatment, advice and any antibiotic rationale clearly.",
  ],

  workflow: [
    { n: 1, title: "Triage the presentation",  desc: "Assess pain, swelling, trismus, systemic symptoms, immune status, allergies and current medications." },
    { n: 2, title: "Confirm the diagnosis",    desc: "Differentiate periodontal abscess, necrotising periodontal disease, pericoronitis and endodontic pain using clinical signs and history." },
    { n: 3, title: "Provide local treatment",  desc: "Drain, debride or irrigate as indicated. Offer chlorhexidine where appropriate and review at short interval." },
    { n: 4, title: "Manage symptoms",          desc: "Recommend appropriate analgesia, give clear self-care advice and provide written safety-netting on red flags." },
    { n: 5, title: "Consider antibiotics",     desc: "Only prescribe where systemic involvement, spreading infection or specific clinical indications apply, following SDCEP Drug Prescribing." },
  ],

  decisionTable: {
    title: "Acute Condition Actions",
    columns: ["Condition", "Initial management"],
    rows: [
      ["Periodontal abscess, systemically well",                "Drain, debride, advise, analgesia. Antibiotics not indicated routinely."],
      ["Necrotising gingivitis or periodontitis",                "Gentle debridement, oral hygiene support, chlorhexidine and risk-factor discussion."],
      ["Spreading infection, fever or systemic upset",           "Treat locally, prescribe antibiotics per SDCEP and consider urgent referral."],
      ["Airway, eye involvement, immunocompromise, swelling",    "Same-day medical/secondary care referral and clear documentation."],
    ],
  },

  pathway: [
    { phase: "Triage",     desc: "Assess severity" },
    { phase: "Diagnose",   desc: "Differentiate" },
    { phase: "Treat",      desc: "Local first" },
    { phase: "Stewardship",desc: "Antibiotics by rule" },
    { phase: "Safety-net", desc: "Review/escalate" },
  ],

  auditPrompts: [
    "Are acute periodontal diagnoses recorded with supporting clinical findings?",
    "Are antibiotics prescribed only where systemic involvement or specific indications apply?",
    "Is the prescribing rationale documented and consistent with SDCEP Drug Prescribing?",
    "Are review appointments offered and red-flag advice given?",
  ],

  documentationPrompts: [
    { id: "diagnosis",          label: "Diagnosis" },
    { id: "redFlags",           label: "Red Flags" },
    { id: "analgesia",          label: "Analgesia" },
    { id: "antibioticRationale",label: "Antibiotic Rationale" },
  ],

  clinicalSources: [
    { name: "SDCEP — Drug Prescribing for Dentistry",                                       url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
    { name: "FGDP/CGDent — Antimicrobial Prescribing in Dentistry",                        url: "https://cgdent.uk/standards-and-guidance/" },
    { name: "BSP — UK Clinical Practice Guidelines for the Treatment of Periodontitis",  url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
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
    changeSummary:  "Initial published version. Acute periodontal management aligned to SDCEP Drug Prescribing + UK antimicrobial stewardship.",
  },
};
