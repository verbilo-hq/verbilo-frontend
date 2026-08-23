/**
 * Shared constants for the Conscious Sedation clinical protocol set.
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (IACSD
 * Standards for Conscious Sedation in the Provision of Dental Care 2020,
 * SDCEP, RCS Faculty of Dental Surgery, CQC sedation requirements, GDC
 * Standards). Every protocol's change summary makes this explicit and flags
 * the requirement for Clinical Director review before live adoption.
 *
 * This pack applies only where the practice provides conscious sedation —
 * if sedation is not offered locally the pack still functions as the
 * referral pathway documentation but the operational steps are not
 * delivered in-house.
 */

export const SED_CLINICAL_INTENT =
  "Standardise the assessment, safe delivery and recovery of conscious sedation for dental treatment, in line with IACSD 2020 standards.";

export const SED_LOCAL_SIGNOFF_NOTE =
  "Drafted from UK public clinical guidance (IACSD 2020 standards). Use only in practices providing conscious sedation under appropriate training, governance, monitoring and emergency arrangements. Adapt to the practice's drug formulary, equipment, escort arrangements and indemnity advice before live use. Requires Clinical Director review and sign-off before clinicians acknowledge.";

export const SED_MINIMUM_RECORD_SET = [
  "Patient, ASA grade and sedation history.",
  "Medical history, medicines, allergies and fasting/escort confirmation.",
  "Pre-procedure baseline observations and consent for sedation.",
  "Drug, dose, route, monitoring detail and any complications.",
  "Recovery, discharge criteria met and written advice issued.",
];

export const SED_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

export const SED_REF = {
  iacsd:             { name: "IACSD — Standards for Conscious Sedation in the Provision of Dental Care (2020)", url: "https://www.rcseng.ac.uk/dental-faculties/fds/publications-guidelines/standards-for-conscious-sedation-in-the-provision-of-dental-care-and-accreditation/" },
  sdcepPrescribing:  { name: "SDCEP — Drug Prescribing for Dentistry",                                            url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  rcsFDS:            { name: "RCS Faculty of Dental Surgery — sedation and pain control guidance",                 url: "https://www.rcseng.ac.uk/dental-faculties/fds/" },
  cqcSedation:       { name: "CQC — sedation services regulatory expectations",                                    url: "https://www.cqc.org.uk/" },
  niceConsciousSed:  { name: "NICE CG112 — Sedation in under-19s (where paediatric sedation is provided)",         url: "https://www.nice.org.uk/guidance/cg112" },
  gdcConsent:        { name: "GDC Standards — obtain valid consent",                                                url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
  gdcSafety:         { name: "GDC Standards — patient safety",                                                       url: "https://standards.gdc-uk.org/" },
  gdcCompetence:     { name: "GDC Standards — working within competence",                                            url: "https://standards.gdc-uk.org/pages/principle7/principle7.aspx" },
  rescusUK:          { name: "Resuscitation Council UK — quality standards for dental practices",                    url: "https://www.resus.org.uk/" },
  practiceEmergency: { name: "Practice medical emergency protocol",                                                   url: null },
  localGAreferral:   { name: "Local sedation/general anaesthesia referral pathway",                                  url: null },
  mfrSedationKit:    { name: "Manufacturer instructions for sedation drugs and monitoring equipment",                  url: null },
};
