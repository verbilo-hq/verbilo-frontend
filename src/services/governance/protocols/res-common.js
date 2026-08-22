/**
 * Shared constants for the Restorative / Operative Dentistry clinical
 * protocol set.
 *
 * Provenance: this pack is drafted by Verbilo from UK public clinical
 * guidance (SDCEP, FGDP/CGDent, GDC Standards, NICE) rather than from a
 * supplied source PDF. Every protocol's change summary makes this
 * explicit and flags the requirement for Clinical Director review before
 * live adoption. The `localSignOffNote` shown on every page in the viewer
 * carries the same warning so the practice cannot mistake the pack for a
 * pre-approved final document.
 */

export const RES_CLINICAL_INTENT =
  "Standardise safe restorative decision-making, technical care, communication and records across the practice.";

export const RES_LOCAL_SIGNOFF_NOTE =
  "Drafted from UK public clinical guidance. Adapt to the practice's equipment, materials, prescribing formulary, referral routes and indemnity advice before live use. Requires Clinical Director review and sign-off before clinicians acknowledge.";

export const RES_MINIMUM_RECORD_SET = [
  "Tooth, diagnosis and planned treatment.",
  "Caries risk assessment and prevention plan.",
  "Local anaesthesia, isolation method and materials used.",
  "Restoration details, occlusal check and post-operative advice.",
  "Review interval, complications and any referral plan.",
];

export const RES_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

/* Reference standards cited across the Restorative pack. External
 * citations link to the published sources; internal references mirror
 * the practice's own documents and intentionally carry no URL. */
export const RES_REF = {
  sdcepCaries:        { name: "SDCEP — Prevention and Management of Dental Caries in Children",        url: "https://www.sdcep.org.uk/published-guidance/caries-in-children/" },
  sdcepPeriodontal:   { name: "SDCEP — Periodontal Care guidance",                                       url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
  sdcepPrescribing:   { name: "SDCEP — Drug Prescribing for Dentistry",                                  url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  sdcepAnticoag:      { name: "SDCEP — Management of Dental Patients Taking Anticoagulants or Antiplatelet Drugs", url: "https://www.sdcep.org.uk/published-guidance/anticoagulants-and-antiplatelets/" },
  fgdpOperative:      { name: "FGDP/CGDent — A Clinical Guide to Operative Dentistry",                   url: "https://cgdent.uk/standards-and-guidance/" },
  fgdpStandards:      { name: "FGDP/CGDent — Standards in Dentistry",                                    url: "https://cgdent.uk/standards-and-guidance/" },
  gdcConsent:         { name: "GDC Standards — obtain valid consent",                                    url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
  gdcConsentRecords:  { name: "GDC Standards — consent and records",                                     url: "https://standards.gdc-uk.org/" },
  gdcCompetence:      { name: "GDC Standards — working within competence",                                url: "https://standards.gdc-uk.org/pages/principle7/principle7.aspx" },
  gdcOpenness:        { name: "GDC Standards — openness and patient communication",                       url: "https://standards.gdc-uk.org/pages/principle1/principle1.aspx" },
  niceCaries:         { name: "NICE — Caries (general guidance summaries)",                              url: "https://cks.nice.org.uk/topics/" },
  niceRecall:         { name: "NICE CG19 — Dental recall: interval between routine examinations",        url: "https://www.nice.org.uk/guidance/cg19" },
  dbohQRG:            { name: "Delivering Better Oral Health — evidence-based prevention toolkit",       url: "https://www.gov.uk/government/publications/delivering-better-oral-health-an-evidence-based-toolkit-for-prevention" },
  bspPerio:           { name: "BSP — UK Clinical Practice Guidelines (perio-restorative interface)",     url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
  iadtTrauma:         { name: "IADT — Dental Trauma Guidelines",                                          url: "https://www.iadt-dentaltrauma.org/" },
  localRadiography:   { name: "Local radiography and IR(ME)R procedures",                                url: null },
  localReferral:      { name: "Local restorative referral criteria",                                      url: null },
  localCoshh:         { name: "Practice COSHH and material safety procedures",                            url: null },
  mfrInstructions:    { name: "Manufacturer instructions for materials and devices",                       url: null },
  practiceConsent:    { name: "Practice consent policy",                                                   url: null },
  localPrevention:    { name: "Local caries-risk and prevention pathway",                                  url: null },
};
