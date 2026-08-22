/**
 * Shared constants for the Special Care Dentistry clinical protocol set.
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (BSDH
 * standards in special care dentistry, Mental Capacity Act 2005 Code of
 * Practice, Equality Act 2010, NHS England commissioning standards for
 * special care dentistry, SDCEP, GDC Standards). Every protocol's change
 * summary makes this explicit and flags the requirement for Clinical
 * Director review before live adoption.
 */

export const SCD_CLINICAL_INTENT =
  "Standardise the assessment, consent, treatment adaptation and onward referral of patients with additional needs across the practice.";

export const SCD_LOCAL_SIGNOFF_NOTE =
  "Drafted from UK public clinical guidance. Adapt to the practice's accessibility arrangements, local special care dental service, capacity assessment processes and indemnity advice before live use. Requires Clinical Director review and sign-off before clinicians acknowledge.";

export const SCD_MINIMUM_RECORD_SET = [
  "Patient, additional needs, support person and communication preferences.",
  "Medical history, medicines, allergies and capacity considerations.",
  "Assessment findings, treatment adaptations and consent process.",
  "Best-interest decision process where applicable.",
  "Treatment provided, advice given and referral plan.",
];

export const SCD_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

export const SCD_REF = {
  bsdhStandards:      { name: "BSDH — Standards in Special Care Dentistry",                                       url: "https://www.bsdh.org/" },
  mcaCodeOfPractice:  { name: "Mental Capacity Act 2005 — Code of Practice",                                       url: "https://www.gov.uk/government/publications/mental-capacity-act-code-of-practice" },
  equalityAct:        { name: "Equality Act 2010 — reasonable adjustments duty",                                    url: "https://www.legislation.gov.uk/ukpga/2010/15/contents" },
  nhseSpecialCare:    { name: "NHS England — Commissioning Standard for Special Care Dental Services",             url: "https://www.england.nhs.uk/" },
  sdcepPrescribing:   { name: "SDCEP — Drug Prescribing for Dentistry",                                              url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  gdcConsent:         { name: "GDC Standards — obtain valid consent",                                                url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
  gdcConsentRecords:  { name: "GDC Standards — consent and records",                                                 url: "https://standards.gdc-uk.org/" },
  gdcDiscrimination:  { name: "GDC Standards — do not discriminate against patients",                                url: "https://standards.gdc-uk.org/" },
  workingTogether:    { name: "Working Together to Safeguard Adults at Risk (Care Act 2014 framework)",              url: "https://www.gov.uk/government/publications/care-act-statutory-guidance" },
  localSCD:           { name: "Local community / special care dental service referral pathway",                       url: null },
  localCapacity:      { name: "Local mental capacity assessment template and IMCA contacts",                          url: null },
  practiceAccess:     { name: "Practice accessibility statement and reasonable adjustments register",                  url: null },
};
