/**
 * Shared constants for the Oral Medicine clinical protocol set.
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (NICE NG12
 * suspected cancer referral, FGDP/CGDent standards, BSOM, OHIP, GDC
 * Standards). Every protocol's change summary makes this explicit and flags
 * the requirement for Clinical Director review before live adoption.
 */

export const OMED_CLINICAL_INTENT =
  "Standardise oral medicine assessment, lesion diagnosis, suspected-cancer referral and the management of oral mucosal disease across the practice.";

export const OMED_LOCAL_SIGNOFF_NOTE =
  "Drafted from UK public clinical guidance. Adapt to the practice's referral routes (NHS 2-week-wait, local oral medicine services), prescribing formulary, biopsy arrangements and indemnity advice before live use. Requires Clinical Director review and sign-off before clinicians acknowledge.";

export const OMED_MINIMUM_RECORD_SET = [
  "Patient, presenting complaint and duration.",
  "Medical history, medicines, allergies and risk factors (smoking, alcohol, HPV history).",
  "Lesion site, size, surface, colour, induration, lymphadenopathy.",
  "Photographs/images where consented; biopsy details if taken.",
  "Differential diagnosis, advice, urgency and referral plan.",
];

export const OMED_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

export const OMED_REF = {
  niceNG12:          { name: "NICE NG12 — Suspected cancer: recognition and referral (oral cancer pathway)", url: "https://www.nice.org.uk/guidance/ng12" },
  bsomGuidance:      { name: "BSOM — British Society of Oral Medicine guidance",                              url: "https://www.bsom.org.uk/" },
  fgdpStandards:     { name: "FGDP/CGDent — Standards in Dentistry (oral cancer screening section)",         url: "https://cgdent.uk/standards-and-guidance/" },
  sdcepPrescribing:  { name: "SDCEP — Drug Prescribing for Dentistry",                                         url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  gdcConsentRecords: { name: "GDC Standards — consent and records",                                            url: "https://standards.gdc-uk.org/" },
  gdcOpenness:       { name: "GDC Standards — openness and patient communication",                             url: "https://standards.gdc-uk.org/pages/principle1/principle1.aspx" },
  cruk:              { name: "Cancer Research UK — oral cancer information and risk factors",                   url: "https://www.cancerresearchuk.org/about-cancer/mouth-cancer" },
  bdaCancer:         { name: "BDA — mouth cancer screening advice for the dental team",                          url: "https://bda.org/" },
  localOralMed:      { name: "Local oral medicine / OMFS referral pathway",                                      url: null },
  local2WW:          { name: "Local NHS 2-week-wait suspected cancer referral form and route",                   url: null },
  localBiopsy:       { name: "Local biopsy and specimen-handling protocol",                                      url: null },
  practiceCamera:    { name: "Practice intra-oral camera and image storage policy",                              url: null },
};
