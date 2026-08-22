/**
 * Shared constants for the Endodontics clinical protocol set.
 *
 * The source PDFs (Endodontics Clinical Protocols ENDO-01..10, reviewed May
 * 2026) repeat several blocks verbatim across every protocol — the clinical-
 * intent boilerplate, the minimum-record-set bullets, the local-sign-off
 * adaptation note and the version header (reviewed date / annual cycle /
 * "Owner: Clinical Lead"). Defining them once here keeps each per-protocol
 * data file focused on the bits that actually differ between protocols and
 * means a single edit propagates when the source pack is republished.
 *
 * Source-fidelity is the priority: text is preserved verbatim from the
 * Endodontics protocol pack so the displayed content matches what the
 * Clinical Director adopted and what an inspector would see on the source
 * PDF page.
 */

export const ENDO_CLINICAL_INTENT =
  "Standardise safe endodontic decision-making, technical care, communication and records across the practice.";

export const ENDO_LOCAL_SIGNOFF_NOTE =
  "Adapt to the practice's equipment, prescribing formulary, referral routes and indemnity advice before live use.";

export const ENDO_MINIMUM_RECORD_SET = [
  "Tooth, diagnosis and planned treatment.",
  "Options, risks, benefits and consent discussion.",
  "Radiographs/images requested, reviewed and reported.",
  "Rubber dam, working length, irrigants, materials and restoration plan where relevant.",
  "Advice, prescription rationale, referral or review plan.",
];

/* Version metadata shared by every ENDO-XX protocol in this initial pack.
 * The source PDF says "Reviewed May 2026 · Version 1.0" with an annual
 * review cycle and "Owner: Clinical Lead" — preserved here exactly. The
 * named approver is the seeded group Clinical Director (Dr. Callum Lead)
 * so the demo signature flow ties adoption to a real person, but no other
 * named individuals are invented beyond what the source attributes. */
export const ENDO_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

/* Reference standards cited across multiple endo protocols — kept as named
 * objects so individual protocols can mix and match without rewriting URLs
 * each time. Internal references (those without a URL) are intentional and
 * mirror the source PDF, which cites "Local …" or "Practice …" procedures
 * without external links. */
export const ENDO_REF = {
  besGoodPractice:   { name: "BES — Guide to Good Endodontic Practice",                            url: "https://britishendodonticsociety.org.uk/professionals/" },
  besPeriradicular:  { name: "BES — guidance on periradicular surgery where applicable",            url: "https://britishendodonticsociety.org.uk/professionals/" },
  gdcConsent:        { name: "GDC Standards — obtain valid consent",                                url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
  gdcConsentRecords: { name: "GDC Standards — consent and records",                                 url: "https://standards.gdc-uk.org/" },
  gdcCompetence:     { name: "GDC Standards — working within competence",                           url: "https://standards.gdc-uk.org/pages/principle7/principle7.aspx" },
  gdcOpenness:       { name: "GDC Standards — openness and patient communication",                  url: "https://standards.gdc-uk.org/pages/principle1/principle1.aspx" },
  gdcSafety:         { name: "GDC Standards — patient safety",                                      url: "https://standards.gdc-uk.org/" },
  sdcepPrescribing:  { name: "SDCEP — Drug Prescribing for Dentistry",                              url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  amrToolkit:        { name: "UK dental antimicrobial stewardship toolkit",                          url: "https://www.fgdp.org.uk/antimicrobial-prescribing-dentistry" },
  localRadiography:  { name: "Local radiography and IR(ME)R procedures",                            url: null },
  localRadiographyP: { name: "Local radiography protocol",                                           url: null },
  localReferral:     { name: "Local referral criteria for endodontic care",                          url: null },
  localReferralNHS:  { name: "Local NHS/private endodontic referral criteria",                       url: null },
  localReferralG:    { name: "Local referral criteria",                                              url: null },
  localConsent:      { name: "Practice consent policy",                                              url: null },
  localIpc:          { name: "Practice IPC/decontamination protocol",                                url: null },
  localCoshh:        { name: "Practice COSHH and sodium hypochlorite safety procedures",             url: null },
  localRestorative:  { name: "Local restorative dentistry protocol",                                 url: null },
  localIncident:     { name: "Practice incident reporting policy",                                   url: null },
  mfrInstructions:   { name: "Manufacturer instructions for instruments and irrigants",              url: null },
};
