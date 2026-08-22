/**
 * Shared constants for the Whitening & Aesthetics clinical protocol set.
 *
 * The source PDFs (Whitening Clinical Protocols WH-CP-01..04, reviewed
 * May 2026) share several blocks verbatim across every protocol — the
 * "use this with…" usage note, the source-basis citation, the
 * "template for local approval" status and the protocol-record header.
 * Defining them once here keeps each per-protocol data file focused on
 * what actually differs between protocols and means a single edit
 * propagates when the source pack is republished.
 *
 * Source-fidelity is the priority: text is preserved verbatim from the
 * source pack so the displayed content matches what the Clinical Director
 * adopted and what an inspector would see on the source PDF page.
 */

/* Quick Status caption — same on every WH protocol. The source renders it
 * as a small annotation; we surface it via `localSignOffNote` because the
 * meaning ("read this protocol alongside the linked local documents") is
 * the same governance hook used by the other categories. */
export const WH_USAGE_NOTE =
  "Use this document with the practice whitening consent form, patient information leaflet, product instructions and local governance policies. This protocol is a governance template and should be reviewed locally before use.";

/* Version metadata shared by every WH-CP-XX protocol. Source PDF says
 * "Reviewed May 2026 · Status: Template for local approval", annual
 * review cycle, "Owner: Clinical Governance Lead" — preserved here. The
 * named approver is the seeded group Clinical Director (Dr. Callum Lead)
 * so the demo signature flow ties adoption to a real person. */
export const WH_VERSION_BASE = {
  number:         "1.0",
  status:         "published",
  publishedAt:    "2026-05-19T00:00:00.000Z",
  effectiveDate:  "2026-05-19T00:00:00.000Z",
  nextReviewDate: "2027-05-19T00:00:00.000Z",
  ownerName:      "Ryan Hale",       ownerRole:    "Clinical Governance Lead",
  approverName:   "Dr. Callum Lead",  approverRole: "Clinical Director",
  reviewerName:   "Dr. Hannah Reed",  reviewerRole: "Clinical Reviewer",
};

/* Reference standards cited across all 4 WH protocols — kept as named
 * objects so individual protocols can mix and match. Internal references
 * are intentional and mirror the source PDF, which cites "Practice …" or
 * "Product …" documents without external links. */
export const WH_REF = {
  gdcPrinciple3:        { name: "GDC Standards for the Dental Team, Principle 3",                 url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
  gdcWhiteningLegal:    { name: "GDC tooth whitening legal position statement",                    url: "https://www.gdc-uk.org/information-standards-guidance/standards-and-guidance/tooth-whitening" },
  gdcWorkingWithinLaw:  { name: "GDC working within the law guidance on tooth whitening",          url: "https://www.gdc-uk.org/" },
  bdaWhitening:         { name: "BDA tooth whitening advice",                                       url: "https://bda.org/" },
  practiceConsentForm:  { name: "Practice whitening consent form",                                  url: null },
  patientLeaflet:       { name: "Patient information leaflet",                                       url: null },
  productInstructions:  { name: "Product manufacturer instructions",                                 url: null },
  localGovernance:      { name: "Local governance policies",                                         url: null },
};
