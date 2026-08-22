/**
 * Shared constants for the Core Clinical Protocol set.
 *
 * The Core Clinical Protocols cover cross-cutting clinical decision-making
 * topics that every UK dental practice is expected to hold as a controlled
 * Clinical Governance document. They are distinct from the specialty packs
 * (Periodontal, Endodontic, Restorative, etc.) and from the operational
 * Governance & SOPs packs (Decontamination & IPC, Radiography & IR(ME)R,
 * Medical Emergencies, Safeguarding Governance). The Core set focuses on
 * the *clinical* decision-making layer that bridges those packs and is
 * what clinicians need at the chair when making safety-critical decisions.
 *
 * Each Core protocol is:
 *   - Anchored to a recognised UK standard (GDC / FGDP / CGDent / SDCEP /
 *     IR(ME)R / RCUK / NICE / CQC fundamental standards)
 *   - Cross-referenced to the corresponding Clinical Hub chairside
 *     quick-reference and the relevant operational Governance & SOPs pack
 *   - Adopted by the Clinical Director on behalf of the group, then
 *     acknowledged by each clinician
 *
 * Source-fidelity is the priority — clinical content is drafted to align
 * with the cited standards verbatim or in close paraphrase, so the
 * displayed text matches what the Clinical Director adopts and what an
 * inspector would expect to see in a CQC inspection file.
 */

export const CORE_CLINICAL_INTENT =
  "Standardise safe, defensible clinical decision-making across the practice for cross-cutting topics where multiple specialties, regulations and governance arrangements intersect.";

export const CORE_LOCAL_SIGNOFF_NOTE =
  "Adapt to the practice's referral routes, prescribing formulary, indemnity advice, local ICB / NHS commissioning arrangements and other site-specific arrangements before live use.";

export const CORE_MINIMUM_RECORD_SET = [
  "Clinical decision, rationale and supporting findings.",
  "Options discussed with the patient, including no treatment and alternatives.",
  "Consent process — verbal / written, capacity considered, risks and benefits explained.",
  "Plan, follow-up, safety-netting and escalation route.",
  "Any referrals, prescriptions or onward actions arising from the decision.",
];

/* Version metadata shared by every CORE-XX protocol in this initial pack.
 * The published date is set to the current Core protocols launch (May 2026)
 * with an annual review cycle. The named approver is the seeded group
 * Clinical Director (Dr. Callum Lead) so the demo signature flow ties
 * adoption to a real person. */
export const CORE_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

/* Reference standards cited across multiple Core protocols. Keeping them as
 * named objects lets individual protocols mix and match without repeating
 * URLs. Internal references (no URL) point to the platform's own controlled
 * documents in the relevant Governance & SOPs pack. */
export const CORE_REF = {
  // GDC Standards (universal)
  gdcStandards:        { name: "GDC Standards for the Dental Team",                                       url: "https://standards.gdc-uk.org/" },
  gdcConsent:          { name: "GDC Standards — Principle 3 (Obtain valid consent)",                      url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
  gdcRecords:          { name: "GDC Standards — Principle 4 (Maintain and protect patients' information)", url: "https://standards.gdc-uk.org/pages/principle4/principle4.aspx" },
  gdcCommunication:    { name: "GDC Standards — Principle 2 (Communicate effectively with patients)",     url: "https://standards.gdc-uk.org/pages/principle2/principle2.aspx" },
  gdcSafety:           { name: "GDC Standards — Principle 7 (Maintain, develop and work within professional knowledge and skills)", url: "https://standards.gdc-uk.org/pages/principle7/principle7.aspx" },
  gdcRaiseConcerns:    { name: "GDC Standards — Principle 8 (Raise concerns if patients are at risk)",    url: "https://standards.gdc-uk.org/pages/principle8/principle8.aspx" },

  // Statutory and regulatory
  mentalCapacityAct:   { name: "Mental Capacity Act 2005 + Code of Practice",                              url: "https://www.gov.uk/government/publications/mental-capacity-act-code-of-practice" },
  childrenAct:         { name: "Children Act 1989 and 2004",                                                url: "https://www.legislation.gov.uk/ukpga/2004/31/contents" },
  careAct:             { name: "Care Act 2014 — safeguarding adults",                                       url: "https://www.legislation.gov.uk/ukpga/2014/23/contents" },
  workingTogether:     { name: "Working Together to Safeguard Children (HM Government)",                    url: "https://www.gov.uk/government/publications/working-together-to-safeguard-children--2" },
  cqcReg11:            { name: "CQC Regulation 11 — Need for consent",                                      url: "https://www.cqc.org.uk/guidance-providers/regulations-enforcement/regulation-11-need-consent" },
  cqcReg12:            { name: "CQC Regulation 12 — Safe care and treatment",                               url: "https://www.cqc.org.uk/guidance-providers/regulations-enforcement/regulation-12-safe-care-treatment" },
  cqcReg13:            { name: "CQC Regulation 13 — Safeguarding service users from abuse",                 url: "https://www.cqc.org.uk/guidance-providers/regulations-enforcement/regulation-13-safeguarding-service-users-abuse" },
  cqcReg17:            { name: "CQC Regulation 17 — Good governance",                                       url: "https://www.cqc.org.uk/guidance-providers/regulations-enforcement/regulation-17-good-governance" },
  cqcReg18:            { name: "CQC Regulation 18 — Notification of other incidents",                       url: "https://www.cqc.org.uk/guidance-providers/regulations-enforcement/regulation-18-notification-other-incidents" },
  cqcReg20:            { name: "CQC Regulation 20 — Duty of candour",                                       url: "https://www.cqc.org.uk/guidance-providers/regulations-enforcement/regulation-20-duty-candour" },
  irmer2017:           { name: "Ionising Radiation (Medical Exposure) Regulations 2017 + 2024 amendments",  url: "https://www.legislation.gov.uk/uksi/2017/1322/contents" },
  ridor2013:           { name: "RIDDOR 2013 — Reporting of Injuries, Diseases and Dangerous Occurrences",   url: "https://www.hse.gov.uk/riddor/" },

  // Clinical guidance — universally cited
  rcukDental:          { name: "Resuscitation Council UK — Quality Standards for CPR Practice and Training (Dental)", url: "https://www.resus.org.uk/library/quality-standards-cpr" },
  sdcepDrugPrescribing:{ name: "SDCEP — Drug Prescribing for Dentistry",                                    url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
  sdcepAcuteProblems:  { name: "SDCEP — Management of Acute Dental Problems",                               url: "https://www.sdcep.org.uk/published-guidance/management-of-acute-dental-problems/" },
  fgdpAmrToolkit:      { name: "FGDP/CGDent — UK Dental Antimicrobial Stewardship Toolkit",                 url: "https://www.fgdp.org.uk/antimicrobial-prescribing-dentistry" },
  fgdpRecordKeeping:   { name: "FGDP/CGDent — Clinical Examination and Record-Keeping Good Practice Guidelines", url: "https://cgdent.uk/clinical-examination-and-record-keeping/" },
  fgdpRadiography:     { name: "FGDP/CGDent — Selection Criteria for Dental Radiography (3rd ed.)",         url: "https://cgdent.uk/selection-criteria-for-dental-radiography/" },
  niceNg12:            { name: "NICE NG12 — Suspected cancer: recognition and referral",                    url: "https://www.nice.org.uk/guidance/ng12" },
  niceCg64:            { name: "NICE CG64 — Prophylaxis against infective endocarditis",                    url: "https://www.nice.org.uk/guidance/cg64" },
  bspdNeglect:         { name: "British Society of Paediatric Dentistry — Dental Neglect policy",            url: "https://www.bspd.co.uk/Professionals/Resources" },
  bnf:                 { name: "BNF / BNF for Children — emergency and routine drug doses",                 url: "https://bnf.nice.org.uk/" },
  htm0105:             { name: "HTM 01-05 — Decontamination in primary care dental practices",              url: "https://www.england.nhs.uk/publication/decontamination-in-primary-care-dental-practices-htm-01-05/" },
  pheBbvExposure:      { name: "PHE — Eye of the Needle / BBV exposure management",                          url: "https://www.gov.uk/government/collections/post-exposure-prophylaxis-pep" },

  // Cross-references to platform content
  chairsideMedEmerg:   { name: "Clinical Hub — Medical Emergencies chairside quick reference",              url: null },
  chairsideDecon:      { name: "Clinical Hub — Decontamination & IPC chairside quick reference",            url: null },
  chairsideRadiograph: { name: "Clinical Hub — Radiography chairside quick reference",                       url: null },
  govMedEmerg:         { name: "Governance & SOPs — Medical Emergencies pack (drug box, AED, BLS)",          url: null },
  govDecon:            { name: "Governance & SOPs — Decontamination & IPC pack (HTM 01-05 SOPs)",             url: null },
  govRadiography:      { name: "Governance & SOPs — Radiography & IR(ME)R pack (Employer's Procedures, Local Rules)", url: null },
  govSafeguarding:     { name: "Governance & SOPs — Safeguarding Governance pack",                            url: null },
  govComplaints:       { name: "Governance & SOPs — Complaints, Incidents & Duty of Candour pack",            url: null },
  cqcHub:              { name: "CQC Compliance Hub — live evidence capture (audits, incidents)",              url: null },

  // Indemnity / professional bodies
  bda:                 { name: "BDA — Advice on indemnity, ethics and patient management",                    url: "https://bda.org/" },
  dentalProtection:    { name: "Dental Protection / DDU — risk management advice for dental teams",          url: "https://www.dentalprotection.org/" },
};
