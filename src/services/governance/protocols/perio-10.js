/**
 * Periodontal Clinical Protocol — PERIO-10
 * Periodontal Referral, Shared Care & Complex Cases
 */
export const PERIO_10 = {
  id: "doc-perio-10",
  reference: "PERIO-10",
  packKey: "clinical_governance",
  category: "Periodontal",
  type: "sop",
  title: "Periodontal Referral, Shared Care & Complex Cases",
  subtitle: "When to refer, how to refer, what to include, expected response, and shared-care arrangements with periodontists or hospital services.",

  metaStrip: {
    appliesTo: "Patients needing specialist input",
    frequency: "On clinical trigger",
    lead:      "Treating clinician",
    evidence:  "Referral record",
  },

  protocolStandard: "Patients whose periodontal needs exceed in-practice capability should be referred promptly with appropriate records, and shared-care responsibilities should be defined explicitly between referrer and specialist.",

  purpose: [
    "Identify cases where specialist or hospital periodontal input is justified.",
    "Set a clear standard for the content, quality and timeliness of referrals.",
    "Define how shared care is handed back to the referring practice and monitored over time.",
  ],
  criticalControls: [
    "Patients with rapid progression, complex defects, suspected systemic disease or non-response should not be retained indefinitely in primary care.",
    "Referrals must include diagnosis, current charting, radiographs, treatment to date, risk factors and reason for referral.",
    "Patient consent for referral and information sharing must be recorded.",
    "Shared-care plans should specify which clinician is responsible for which element of ongoing care.",
  ],

  workflow: [
    { n: 1, title: "Identify the trigger",      desc: "Recognise complexity, severity, non-response, systemic factors or patient-specific reasons that justify referral." },
    { n: 2, title: "Discuss with the patient",  desc: "Explain rationale, alternatives, expected timelines, costs and consent for information sharing." },
    { n: 3, title: "Prepare the referral",      desc: "Compile diagnosis, charting, radiographs, treatment to date, risks and a clear referral question." },
    { n: 4, title: "Send and track",            desc: "Use the locally agreed pathway (NHS, private specialist or hospital), record send-date and follow up on response." },
    { n: 5, title: "Agree shared care",         desc: "Define which provider does maintenance, monitoring, advanced treatment or further escalation, and document it." },
  ],

  decisionTable: {
    title: "Referral Trigger Examples",
    columns: ["Trigger", "Typical referral pathway"],
    rows: [
      ["Stage III/IV periodontitis with complexity",        "Specialist periodontist for advanced therapy or surgical planning."],
      ["Grade C / rapid progression in young patient",       "Specialist periodontist with consideration of systemic investigation."],
      ["Suspected systemic disease or immunocompromise",     "Liaise with GP/specialist medical team alongside periodontal referral."],
      ["Complex implant or restorative-perio interface",     "Shared-care discussion with restorative or implant specialist."],
    ],
  },

  pathway: [
    { phase: "Trigger",   desc: "Identify need" },
    { phase: "Consent",   desc: "Discuss/agree" },
    { phase: "Compile",   desc: "Records/question" },
    { phase: "Send",      desc: "Track response" },
    { phase: "Shared care",desc: "Define roles" },
  ],

  auditPrompts: [
    "Are referrals made when complexity or progression exceeds in-practice capability?",
    "Do referrals include diagnosis, charting, radiographs and a clear question?",
    "Is patient consent for referral and information sharing documented?",
    "Are shared-care responsibilities recorded and reviewed at recall?",
  ],

  documentationPrompts: [
    { id: "referralReason", label: "Referral Reason" },
    { id: "recordsSent",    label: "Records Sent" },
    { id: "urgency",        label: "Urgency" },
    { id: "sharedCarePlan", label: "Shared-Care Plan" },
  ],

  clinicalSources: [
    { name: "BSP — Referral Policy and Parameters of Care",                                 url: "https://www.bsperio.org.uk/professionals/referral-policy" },
    { name: "BSP — UK Clinical Practice Guidelines for the Treatment of Periodontitis",   url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
    { name: "SDCEP — Periodontal Care guidance",                                            url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
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
    changeSummary:  "Initial published version. Referral expectations + shared-care framework aligned to BSP Referral Policy and BSP UK CPG.",
  },
};
