/**
 * Shared constants for the Trauma Management clinical protocol set.
 *
 * Provenance: drafted by Verbilo from UK and international public clinical
 * guidance (IADT Dental Trauma Guidelines 2020, BSPD paediatric trauma
 * guidance, SDCEP, NICE, GDC Standards). The IADT guidelines are the
 * authoritative international reference for dental trauma and are routinely
 * adopted in UK practice. Every protocol's change summary makes the
 * provenance explicit and flags the requirement for Clinical Director
 * review before live adoption.
 */

export const TRAU_CLINICAL_INTENT =
  "Standardise the assessment, immediate treatment and follow-up of acute dental trauma across the practice, in line with IADT guidance.";

export const TRAU_LOCAL_SIGNOFF_NOTE =
  "Drafted from UK and international public clinical guidance (IADT). Adapt to the practice's emergency arrangements, splint materials, prescribing formulary, referral routes and indemnity advice before live use. Requires Clinical Director review and sign-off before clinicians acknowledge.";

export const TRAU_MINIMUM_RECORD_SET = [
  "Patient, time of injury, mechanism and circumstances.",
  "Medical history, tetanus status, allergies and head-injury screening.",
  "Affected teeth, tissues and radiographic findings.",
  "Treatment provided, splint type, materials and follow-up dates.",
  "Advice given, safeguarding considerations and review/referral plan.",
];

export const TRAU_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

export const TRAU_REF = {
  iadtTrauma:        { name: "IADT — Dental Trauma Guidelines 2020 (permanent and primary dentition)",   url: "https://www.iadt-dentaltrauma.org/" },
  iadtAvulsion:      { name: "IADT — Guidelines on management of avulsion injuries",                       url: "https://www.iadt-dentaltrauma.org/" },
  bspdTrauma:        { name: "BSPD — paediatric dental trauma guidance",                                   url: "https://www.bspd.co.uk/Professionals/Resources" },
  sdcepPrescribing:  { name: "SDCEP — Drug Prescribing for Dentistry",                                     url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  niceHeadInjury:    { name: "NICE NG232 — Head injury: assessment and early management",                   url: "https://www.nice.org.uk/guidance/ng232" },
  gdcConsentRecords: { name: "GDC Standards — consent and records",                                        url: "https://standards.gdc-uk.org/" },
  gdcSafety:         { name: "GDC Standards — patient safety",                                              url: "https://standards.gdc-uk.org/" },
  gdcChildSafety:    { name: "GDC Standards — safeguarding children",                                       url: "https://standards.gdc-uk.org/" },
  dentalTraumaGuide: { name: "DentalTraumaGuide.org — chairside decision support (IADT-aligned)",           url: "https://dentaltraumaguide.org/" },
  localUrgent:       { name: "Local urgent dental care / emergency referral pathway",                       url: null },
  localOMFS:         { name: "Local OMFS / specialist trauma referral pathway",                              url: null },
  practiceEmergency: { name: "Practice medical emergency protocol",                                          url: null },
  mfrSplint:         { name: "Manufacturer instructions for splint and bonding materials",                    url: null },
};
