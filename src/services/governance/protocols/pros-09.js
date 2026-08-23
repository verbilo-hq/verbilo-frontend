/**
 * Prosthodontics Clinical Protocol — PROS-09
 * Shade, Aesthetics & Patient Communication
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_09 = {
  id: "doc-pros-09",
  reference: "PROS-09",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Shade, Aesthetics & Patient Communication",
  subtitle: "Aesthetic case discussion, shade selection, photographs, try-in approval and managing expectations on restorative aesthetics.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Any restorative or prosthodontic treatment with an aesthetic component",
    frequency: "At assessment, shade-take, try-in and delivery",
    lead:      "Dentist (with TCO support for information only)",
    evidence:  "Shade record, photographs, patient approval and any specialist aesthetic discussion",
  },

  standardLabel: "Aesthetic-communication standard",
  protocolStandard: "Aesthetic outcomes must be discussed, documented and tested before definitive work. The clinician must communicate what is predictable, what is not, and how the patient will be involved in approval steps — particularly at try-in.",

  workflow: [
    { n: 1, title: "Open the aesthetic conversation early", desc: "Use reference photographs of the patient (smile, repose, profile) and ask what they like and dislike. Record this rather than assuming." },
    { n: 2, title: "Discuss alternatives and limits",        desc: "Cover whitening, orthodontics, direct composite, indirect restorations and the limits of each. Be explicit that exact shade match across multiple restorations and natural teeth is rarely guaranteed." },
    { n: 3, title: "Take shade and photographs systematically", desc: "Take shade on clean wet teeth in natural light. Use shade guides per the planned material and provide the lab with photographs including the shade tab in the same image." },
    { n: 4, title: "Use try-in approval steps",               desc: "For anterior crowns, bridges or veneers use a wax try-in, mock-up or provisional approval step. Document patient sign-off before committing to definitive work." },
    { n: 5, title: "Manage final aesthetic feedback",         desc: "At delivery, give the patient time to assess in natural light. Record their approval. Where they decline acceptance, follow the practice complaints and remake pathway transparently." },
  ],

  safetyBox: {
    title: "Reset expectations or pause if",
    items: [
      "The patient cannot articulate what they want to change about their smile.",
      "Body image concern or unrealistic comparison images suggest deeper-than-dental drivers.",
      "Material choice cannot deliver the requested colour, translucency or contour.",
      "Restorations of differing materials are needed across the anterior segment and shade match is not guaranteed.",
      "Try-in approval is uncertain and the patient is being asked to commit anyway.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Aesthetic discussion documented with patient's own words.",
    "Photographs and shade record stored with the lab prescription.",
    "Try-in approval step used and recorded for anterior work.",
    "Final approval recorded at delivery.",
    "Any complaint or remake handled per the practice pathway.",
  ],

  clinicalSources: [
    PROS_REF.fgdpStandards,
    PROS_REF.gdcConsent,
    PROS_REF.gdcOpenness,
    PROS_REF.practiceConsent,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent standards, GDC Standards on consent and openness and the practice consent policy. Requires Clinical Director review and local approval before live adoption.",
  },
};
