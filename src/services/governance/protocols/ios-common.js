/**
 * Shared constants for the Implants & Oral Surgery clinical protocol set.
 *
 * The source PDFs (Implants & Oral Surgery Clinical Protocols IOS-01..10,
 * reviewed May 2026) repeat several blocks verbatim across every protocol —
 * the clinical-intent boilerplate, the minimum-record-set bullets, the
 * local-sign-off adaptation note and the version header. Defining them once
 * here keeps each per-protocol data file focused on the bits that actually
 * differ and means a single edit propagates when the source pack is
 * republished.
 *
 * Source-fidelity is the priority: text is preserved verbatim from the
 * source pack so the displayed content matches what the Clinical Director
 * adopted and what an inspector would see on the source PDF page.
 */

export const IOS_CLINICAL_INTENT =
  "Standardise surgical assessment, consent, operative safety, aftercare, implant planning and escalation across the practice.";

export const IOS_LOCAL_SIGNOFF_NOTE =
  "Adapt to the practice equipment, clinician competence, implant system, referral routes and indemnity advice before live use.";

export const IOS_MINIMUM_RECORD_SET = [
  "Patient, site/tooth and diagnosis.",
  "Medical history, medicines, allergy and risk checks.",
  "Imaging justification, findings and clinical evaluation.",
  "Options, material risks, benefits, costs and consent discussion.",
  "Procedure details, materials used, complications, aftercare and review/referral plan.",
];

/* Version metadata shared by every IOS-XX protocol in this initial pack.
 * Source PDF says "Reviewed May 2026 · Version 1.0", annual review cycle,
 * "Owner: Clinical Lead" — preserved here exactly. Named approver is the
 * seeded group Clinical Director (Dr. Callum Lead) so the demo signature
 * flow ties adoption to a real person. */
export const IOS_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

/* Reference standards cited across the IOS protocols, kept as named objects
 * so individual protocols can mix and match without rewriting URLs each
 * time. Internal references (those without a URL) are intentional and
 * mirror the source PDF, which cites "Local …" or "Practice …" procedures
 * without external links. */
export const IOS_REF = {
  // BAOS / NICE / NHS
  baosFds:                 { name: "BAOS/FDS oral surgery guidance",                                                  url: "https://www.baos.org.uk/" },
  baosFdsResources:        { name: "BAOS/FDS oral surgery practice resources",                                        url: "https://www.baos.org.uk/" },
  baosPostOp:              { name: "BAOS post-operative oral surgery advice",                                          url: "https://www.baos.org.uk/" },
  baosNhsDrySocket:        { name: "BAOS/NHS dry socket and oral surgery aftercare advice",                            url: "https://www.baos.org.uk/" },
  niceBaosWisdom:          { name: "NICE/BAOS wisdom tooth guidance resources",                                        url: "https://www.nice.org.uk/" },
  niceIE:                  { name: "NICE infective endocarditis guidance",                                             url: "https://www.nice.org.uk/guidance/cg64" },
  nhsPostExtraction:       { name: "NHS post-extraction advice",                                                       url: "https://www.nhs.uk/" },

  // GDC Standards (variants cited in source)
  gdcConsentCompetence:    { name: "GDC Standards — consent and working within competence",                            url: "https://standards.gdc-uk.org/" },
  gdcConsent:              { name: "GDC Standards — obtain valid consent",                                             url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
  gdcConsentCompetenceAlt: { name: "GDC Standards — consent and competence",                                           url: "https://standards.gdc-uk.org/" },
  gdcPatientSafetyRecords: { name: "GDC Standards — patient safety and records",                                       url: "https://standards.gdc-uk.org/" },
  gdcCompetenceSafety:     { name: "GDC Standards — competence and patient safety",                                    url: "https://standards.gdc-uk.org/" },

  // SDCEP (variants cited in source)
  sdcepAnticoag:           { name: "SDCEP — Management of Dental Patients Taking Anticoagulants or Antiplatelet Drugs", url: "https://www.sdcep.org.uk/published-guidance/anticoagulants-and-antiplatelets/" },
  sdcepPrescribing:        { name: "SDCEP — Drug Prescribing for Dentistry",                                            url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  sdcepPrescribingShort:   { name: "SDCEP prescribing guidance",                                                        url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  sdcepAnticoagPrescribing:{ name: "SDCEP prescribing and anticoagulant guidance",                                      url: "https://www.sdcep.org.uk/published-guidance/" },
  sdcepImplantCare:        { name: "SDCEP — dental implant care guidance",                                              url: "https://www.sdcep.org.uk/published-guidance/" },
  sdcepImplantMaint:       { name: "SDCEP — dental implant maintenance guidance",                                       url: "https://www.sdcep.org.uk/published-guidance/" },
  sdcepPeriImplant:        { name: "SDCEP — peri-implant disease guidance",                                             url: "https://www.sdcep.org.uk/published-guidance/" },

  // BSP
  bspPerio:                { name: "BSP periodontal care guidance",                                                     url: "https://www.bsperio.org.uk/professionals/" },

  // Manufacturer
  mfrImplantSystem:        { name: "Manufacturer implant system instructions",                                          url: null },

  // Internal / practice-local references (no URL — preserved verbatim from source)
  localRadioReferral:      { name: "Local radiography and referral protocols",                                          url: null },
  localRadioCBCT:          { name: "Radiography and CBCT protocol",                                                     url: null },
  localOralSurgRef:        { name: "Local oral surgery referral criteria",                                              url: null },
  localOralSurgRefPath:    { name: "Local oral surgery referral pathway",                                               url: null },
  localImplantRef:         { name: "Local implant referral pathway",                                                    url: null },
  localImplantGov:         { name: "Local implant governance policy",                                                   url: null },
  localTreatmentPlan:      { name: "Local treatment planning and complaints policy",                                    url: null },
  implantMaintGuidance:    { name: "Implant maintenance guidance",                                                      url: null },
  practiceConsentForms:    { name: "Practice consent forms",                                                            url: null },
  localMedEmergency:       { name: "Local medical emergency protocol",                                                  url: null },
  practiceIPCDecon:        { name: "Practice IPC/decontamination protocols",                                            url: null },
  practiceIncidentPolicy:  { name: "Practice incident policy",                                                          url: null },
  localOOH:                { name: "Local out-of-hours policy",                                                         url: null },
};
