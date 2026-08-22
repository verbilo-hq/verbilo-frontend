/**
 * Shared constants for the Prosthodontics clinical protocol set.
 *
 * Provenance: this pack is drafted by Verbilo from UK public clinical
 * guidance (SDCEP, FGDP/CGDent, BSSPD, GDC Standards, NICE) rather than
 * from a supplied source PDF. Every protocol's change summary makes this
 * explicit and flags the requirement for Clinical Director review before
 * live adoption.
 */

export const PROS_CLINICAL_INTENT =
  "Standardise safe prosthodontic decision-making, technical care, communication and records across the practice.";

export const PROS_LOCAL_SIGNOFF_NOTE =
  "Drafted from UK public clinical guidance. Adapt to the practice's equipment, materials, laboratory arrangements, referral routes and indemnity advice before live use. Requires Clinical Director review and sign-off before clinicians acknowledge.";

export const PROS_MINIMUM_RECORD_SET = [
  "Tooth/site, diagnosis and planned prosthetic treatment.",
  "Restorability, periodontal status, occlusion and aesthetic discussion.",
  "Impression/scan, lab prescription, shade and materials.",
  "Try-in, fit, occlusal check, cementation/insertion details.",
  "Post-operative advice, review and maintenance plan.",
];

export const PROS_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

export const PROS_REF = {
  sdcepImplantCare:    { name: "SDCEP — dental implant care guidance",                                   url: "https://www.sdcep.org.uk/published-guidance/" },
  sdcepImplantMaint:   { name: "SDCEP — dental implant maintenance guidance",                            url: "https://www.sdcep.org.uk/published-guidance/" },
  sdcepPrescribing:    { name: "SDCEP — Drug Prescribing for Dentistry",                                 url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  fgdpStandards:       { name: "FGDP/CGDent — Standards in Dentistry",                                   url: "https://cgdent.uk/standards-and-guidance/" },
  fgdpOperative:       { name: "FGDP/CGDent — A Clinical Guide to Operative Dentistry",                  url: "https://cgdent.uk/standards-and-guidance/" },
  bsspdDentures:       { name: "BSSPD — Guidance on complete and partial dentures",                       url: "https://www.bsspd.org/" },
  bspPerio:            { name: "BSP — UK Clinical Practice Guidelines (perio-prosthetic interface)",     url: "https://www.bsperio.org.uk/professionals/" },
  gdcConsent:          { name: "GDC Standards — obtain valid consent",                                   url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
  gdcConsentRecords:   { name: "GDC Standards — consent and records",                                    url: "https://standards.gdc-uk.org/" },
  gdcCompetence:       { name: "GDC Standards — working within competence",                              url: "https://standards.gdc-uk.org/pages/principle7/principle7.aspx" },
  gdcOpenness:         { name: "GDC Standards — openness and patient communication",                     url: "https://standards.gdc-uk.org/pages/principle1/principle1.aspx" },
  mhraDevices:         { name: "MHRA — Medical Devices Regulations (custom-made appliances)",            url: "https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency" },
  mfrInstructions:     { name: "Manufacturer instructions for materials and luting agents",               url: null },
  labPrescription:     { name: "Laboratory prescription and traceability records",                         url: null },
  localImplantRef:     { name: "Local implant referral pathway",                                          url: null },
  localProsRef:        { name: "Local prosthodontic referral criteria",                                    url: null },
  practiceConsent:     { name: "Practice consent policy",                                                  url: null },
};
