/**
 * Shared constants for the TMD & Occlusion clinical protocol set.
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (SDCEP,
 * RCS Faculty of Dental Surgery, NICE Clinical Knowledge Summaries on TMD,
 * RDC/TMD diagnostic criteria for research where appropriate, GDC
 * Standards). Every protocol's change summary makes this explicit and
 * flags the requirement for Clinical Director review before live adoption.
 */

export const TMD_CLINICAL_INTENT =
  "Standardise the assessment, conservative management and onward referral of temporomandibular disorders (TMD) and parafunction across the practice.";

export const TMD_LOCAL_SIGNOFF_NOTE =
  "Drafted from UK public clinical guidance. Adapt to the practice's splint materials, imaging access, pain management formulary, referral routes and indemnity advice before live use. Requires Clinical Director review and sign-off before clinicians acknowledge.";

export const TMD_MINIMUM_RECORD_SET = [
  "Patient, presenting complaint and duration.",
  "Medical history, medicines, allergies and psychosocial context.",
  "TMD examination findings and any imaging justification.",
  "Diagnosis, management plan and any splint details.",
  "Advice, review and any specialist referral plan.",
];

export const TMD_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

export const TMD_REF = {
  niceCKSTMD:        { name: "NICE CKS — Temporomandibular disorders (TMD)",                                  url: "https://cks.nice.org.uk/topics/temporomandibular-disorders-tmds/" },
  sdcepPrescribing:  { name: "SDCEP — Drug Prescribing for Dentistry",                                         url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  rcsFDS:            { name: "RCS Faculty of Dental Surgery — TMD and orofacial pain guidance",                 url: "https://www.rcseng.ac.uk/dental-faculties/fds/" },
  fgdpStandards:     { name: "FGDP/CGDent — Standards in Dentistry (occlusion section)",                        url: "https://cgdent.uk/standards-and-guidance/" },
  rdcTMD:            { name: "DC/TMD — Diagnostic Criteria for Temporomandibular Disorders",                    url: "https://ubwp.buffalo.edu/rdc-tmdinternational/" },
  gdcConsentRecords: { name: "GDC Standards — consent and records",                                              url: "https://standards.gdc-uk.org/" },
  gdcCompetence:     { name: "GDC Standards — working within competence",                                        url: "https://standards.gdc-uk.org/pages/principle7/principle7.aspx" },
  localOFP:          { name: "Local orofacial pain / OMFS specialist referral pathway",                          url: null },
  practicePainAdvice:{ name: "Practice TMD self-care patient leaflet",                                            url: null },
  mfrSplint:         { name: "Manufacturer instructions for splint materials",                                    url: null },
};
