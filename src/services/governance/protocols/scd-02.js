/**
 * Special Care Dentistry Clinical Protocol — SCD-02
 * Mental Capacity Act & Best-Interest Decisions in Dentistry
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  SCD_CLINICAL_INTENT, SCD_LOCAL_SIGNOFF_NOTE, SCD_MINIMUM_RECORD_SET,
  SCD_VERSION_BASE, SCD_REF,
} from "./scd-common";

export const SCD_02 = {
  id: "doc-scd-02",
  reference: "SCD-02",
  packKey: "clinical_governance",
  category: "Special Care",
  type: "sop",
  title: "Mental Capacity Act & Best-Interest Decisions in Dentistry",
  subtitle: "MCA-aligned capacity assessment, supported decision-making and the best-interest process for dental treatment.",

  clinicalIntent: SCD_CLINICAL_INTENT,
  localSignOffNote: SCD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Adults aged 16+ whose capacity to consent to dental treatment is in question",
    frequency: "At each consent decision; reassessed if capacity may have changed",
    lead:      "Treating clinician; with IMCA, family or LPA support as required",
    evidence:  "Capacity assessment record, best-interest process documented, IMCA involvement if applicable",
  },

  standardLabel: "Capacity standard",
  protocolStandard: "Capacity must be assessed in line with the Mental Capacity Act 2005 — decision-specific, time-specific and presumed unless proven otherwise. Where capacity is lacking, a best-interest decision must follow the statutory process and be clearly documented.",

  workflow: [
    { n: 1, title: "Presume capacity",                  desc: "Start from the presumption that the patient has capacity. Provide information in an accessible format. Allow time. Use a supporter if helpful." },
    { n: 2, title: "Apply the MCA two-stage test",       desc: "Stage 1: Is there an impairment of, or disturbance in the functioning of, the mind or brain? Stage 2: If so, is the patient unable to (a) understand, (b) retain, (c) use/weigh, or (d) communicate the relevant information for this decision?" },
    { n: 3, title: "Support decision-making",            desc: "Adapt communication. Use pictures, easy-read, sign, interpreter. Repeat over multiple visits where helpful. Capacity may fluctuate — assess at the time of the decision." },
    { n: 4, title: "If capacity is lacking — best interests", desc: "Consider past wishes, current wishes/feelings, beliefs/values, family/carer views, LPA/court-appointed deputy if any, IMCA involvement if no family. Choose the least restrictive option." },
    { n: 5, title: "Document thoroughly",                 desc: "Record what was assessed, who was consulted, why the decision was made, and that the patient was at the centre of the process even where they lacked capacity to consent." },
  ],

  decisionTable: {
    title: "MCA Decision Pathway",
    columns: ["Situation", "Pathway"],
    rows: [
      ["Patient has capacity",                                                          "Take consent normally per GDC Standards."],
      ["Patient lacks capacity, LPA for health and welfare in place",                  "Decision made by the LPA (subject to MCA principles); record the LPA's authority."],
      ["Patient lacks capacity, court-appointed deputy",                                "Decision made by deputy within scope of court order."],
      ["Patient lacks capacity, no LPA/deputy, has family/friends",                     "Best-interest decision; consult family/friends but the decision-maker is the clinician."],
      ["Patient lacks capacity, no family/friends, decision is serious",                 "Refer to IMCA before significant decisions (extractions of multiple teeth, GA, major treatment)."],
      ["Urgent treatment to save life or prevent serious harm",                          "Treat under necessity / best interests; document and review."],
    ],
  },

  safetyBox: {
    title: "Pause and seek advice if",
    items: [
      "Capacity is unclear or borderline — consult senior colleague or specialist SCD service.",
      "There is family disagreement about treatment.",
      "An LPA, deputy or advance decision exists and is unclear in scope.",
      "Treatment proposed is irreversible or significant and capacity is lacking — consider IMCA.",
      "Capacity issues coincide with safeguarding concerns — escalate per safeguarding pathway.",
    ],
  },

  minimumRecordSet: SCD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "MCA two-stage test applied and documented.",
    "Decision-specific capacity considered (not blanket).",
    "Best-interest process documented when capacity lacking.",
    "IMCA involvement considered where indicated.",
    "Least-restrictive option chosen and recorded.",
  ],

  clinicalSources: [
    SCD_REF.mcaCodeOfPractice,
    SCD_REF.bsdhStandards,
    SCD_REF.gdcConsent,
    SCD_REF.gdcDiscrimination,
    SCD_REF.localCapacity,
  ],

  version: {
    ...SCD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from Mental Capacity Act 2005 Code of Practice, BSDH Standards in Special Care Dentistry, GDC Standards on consent and the practice's local capacity assessment template. Requires Clinical Director review and local approval before live adoption.",
  },
};
