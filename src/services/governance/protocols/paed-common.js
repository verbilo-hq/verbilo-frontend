/**
 * Shared constants for the Paediatric Dentistry clinical protocol set.
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (SDCEP
 * Prevention and Management of Dental Caries in Children, BSPD UK national
 * clinical guidelines, IADT dental trauma guidelines, NICE guidance,
 * Delivering Better Oral Health, GDC Standards). Every protocol's change
 * summary makes this explicit and flags the requirement for Clinical
 * Director review before live adoption.
 */

export const PAED_CLINICAL_INTENT =
  "Standardise safe paediatric dental care, prevention, behaviour management, consent and safeguarding across the practice.";

export const PAED_LOCAL_SIGNOFF_NOTE =
  "Drafted from UK public clinical guidance. Adapt to the practice's equipment, materials, prescribing formulary, referral routes, safeguarding contacts and indemnity advice before live use. Requires Clinical Director review and sign-off before clinicians acknowledge.";

export const PAED_MINIMUM_RECORD_SET = [
  "Child, parent/guardian, age and presenting concern.",
  "Medical history, medicines, allergies and developmental notes.",
  "Caries risk and prevention plan; safeguarding considerations.",
  "Treatment provided, materials, behaviour-management approach.",
  "Advice given, review interval and any referral plan.",
];

export const PAED_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

export const PAED_REF = {
  sdcepCaries:        { name: "SDCEP — Prevention and Management of Dental Caries in Children",          url: "https://www.sdcep.org.uk/published-guidance/caries-in-children/" },
  sdcepPrescribing:   { name: "SDCEP — Drug Prescribing for Dentistry",                                    url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  bspdGuidelines:     { name: "BSPD — UK national clinical guidelines in paediatric dentistry",            url: "https://www.bspd.co.uk/Professionals/Resources/UK-national-clinical-guidelines" },
  bspdTrauma:         { name: "BSPD — paediatric dental trauma guidance",                                   url: "https://www.bspd.co.uk/Professionals/Resources" },
  iadtTrauma:         { name: "IADT — Dental Trauma Guidelines",                                            url: "https://www.iadt-dentaltrauma.org/" },
  dbohQRG:            { name: "Delivering Better Oral Health — evidence-based prevention toolkit",         url: "https://www.gov.uk/government/publications/delivering-better-oral-health-an-evidence-based-toolkit-for-prevention" },
  niceCG19:           { name: "NICE CG19 — Dental recall intervals",                                        url: "https://www.nice.org.uk/guidance/cg19" },
  niceMolar:          { name: "NICE — guidance on first permanent molar issues / MIH",                      url: "https://cks.nice.org.uk/topics/" },
  gdcConsent:         { name: "GDC Standards — obtain valid consent",                                       url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
  gdcConsentRecords:  { name: "GDC Standards — consent and records",                                        url: "https://standards.gdc-uk.org/" },
  gdcChildSafety:     { name: "GDC Standards — safeguarding children",                                       url: "https://standards.gdc-uk.org/" },
  childrenAct:        { name: "Children Act 1989/2004 — consent and safeguarding framework",                url: "https://www.legislation.gov.uk/ukpga/1989/41/contents" },
  workingTogether:    { name: "Working Together to Safeguard Children (statutory guidance)",                url: "https://www.gov.uk/government/publications/working-together-to-safeguard-children" },
  childSmile:         { name: "Childsmile (Scotland) / equivalent national child oral health programmes",   url: "https://www.child-smile.org.uk/" },
  gillick:            { name: "Gillick competence — assessment of child decision-making capacity",          url: null },
  localSafeguarding:  { name: "Local safeguarding pathway and named safeguarding lead",                      url: null },
  localReferral:      { name: "Local paediatric / community dental service referral criteria",              url: null },
  mfrInstructions:    { name: "Manufacturer instructions for paediatric materials and devices",              url: null },
};
