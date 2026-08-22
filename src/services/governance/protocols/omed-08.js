/**
 * Oral Medicine Clinical Protocol — OMED-08
 * Biopsy & Specimen Handling Protocol
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  OMED_CLINICAL_INTENT, OMED_LOCAL_SIGNOFF_NOTE, OMED_MINIMUM_RECORD_SET,
  OMED_VERSION_BASE, OMED_REF,
} from "./omed-common";

export const OMED_08 = {
  id: "doc-omed-08",
  reference: "OMED-08",
  packKey: "clinical_governance",
  category: "Oral Medicine",
  type: "sop",
  title: "Biopsy & Specimen Handling Protocol",
  subtitle: "Consent, technique, fixation, specimen handling, request-form completion and result tracking.",

  clinicalIntent: OMED_CLINICAL_INTENT,
  localSignOffNote: OMED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Lesions requiring biopsy in primary care or referred for biopsy",
    frequency: "Per biopsy procedure",
    lead:      "Trained dentist or specialist (per local agreement)",
    evidence:  "Consent, technique, specimen detail, request form and result tracking",
  },

  standardLabel: "Biopsy standard",
  protocolStandard: "Biopsy must be performed only by a clinician trained and competent in the technique. Specimens must be handled to preserve diagnostic quality, and the patient must be told how and when they will receive results.",

  workflow: [
    { n: 1, title: "Confirm biopsy is indicated",     desc: "Match the lesion to the indication — diagnostic biopsy for atypia/uncertainty, excisional for small benign lesions. For suspected malignancy, prefer urgent referral (OMED-02) rather than primary care biopsy unless agreed locally." },
    { n: 2, title: "Consent specifically for biopsy",  desc: "Explain the procedure, risks (bleeding, swelling, scarring, paraesthesia, recurrence, possible further treatment based on result), alternatives and the result-communication pathway. Record specific consent." },
    { n: 3, title: "Perform the biopsy",                desc: "Use appropriate LA, isolation and instruments. Take an adequate specimen of representative tissue including the edge of the lesion where possible. Use sutures as required. Photograph if consented." },
    { n: 4, title: "Handle the specimen correctly",     desc: "Place in 10% formalin in a labelled pot. Complete the histopathology request form with patient details, clinical history, site, lesion description, differential and contact details. Use the local courier/lab arrangement." },
    { n: 5, title: "Track the result and communicate", desc: "Maintain a biopsy register. Confirm receipt with the lab. On receipt of the report, communicate with the patient per the agreed pathway — same day for malignant or significantly abnormal results." },
  ],

  safetyBox: {
    title: "Do not biopsy in primary care if",
    items: [
      "Suspected malignancy — refer urgently per OMED-02 instead.",
      "Clinician is not trained or competent in the specific technique.",
      "Lesion is in an anatomically risky site (e.g. major salivary gland duct, near nerves).",
      "Bleeding risk is uncontrolled (anticoagulation without plan, bleeding disorder).",
      "The result-tracking pathway is not in place — biopsies must not be lost to follow-up.",
    ],
  },

  minimumRecordSet: OMED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Biopsy register maintained — every specimen tracked to result.",
    "Specific consent for biopsy recorded.",
    "Photograph or sketch of lesion before biopsy.",
    "Specimen fixed in formalin and labelled correctly.",
    "Result communicated to patient within local target.",
  ],

  clinicalSources: [
    OMED_REF.bsomGuidance,
    OMED_REF.niceNG12,
    OMED_REF.localBiopsy,
    OMED_REF.fgdpStandards,
    OMED_REF.gdcConsentRecords,
  ],

  version: {
    ...OMED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSOM biopsy guidance, NICE NG12, local biopsy and specimen-handling protocol, FGDP/CGDent standards and GDC Standards on consent and records. Requires Clinical Director review and local approval before live adoption.",
  },
};
