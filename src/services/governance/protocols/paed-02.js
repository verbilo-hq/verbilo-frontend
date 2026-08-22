/**
 * Paediatric Dentistry Clinical Protocol — PAED-02
 * Caries Risk Assessment & Prevention in Children
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_02 = {
  id: "doc-paed-02",
  reference: "PAED-02",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "Caries Risk Assessment & Prevention in Children",
  subtitle: "Risk scoring, dietary advice, toothbrushing instruction, fluoride strategy and recall planning per SDCEP / DBOH.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All children attending the practice",
    frequency: "At every examination and recall",
    lead:      "Dentist, hygienist or therapist within scope",
    evidence:  "Risk score, prevention interventions delivered and recall interval",
  },

  standardLabel: "Caries-risk standard",
  protocolStandard: "Every child must have a documented caries-risk assessment at each examination, with a documented prevention plan and a recall interval matched to that risk. Prevention must be the primary intervention; operative treatment alone will not change long-term outcomes.",

  workflow: [
    { n: 1, title: "Score caries risk",                  desc: "Use a documented approach (SDCEP / DBOH) considering caries experience, plaque, diet, fluoride exposure, social factors, medical history and ability to attend." },
    { n: 2, title: "Discuss diet sensitively",            desc: "Identify sugar frequency rather than quantity. Use family-centred language. Avoid blame and offer realistic, achievable changes." },
    { n: 3, title: "Reinforce toothbrushing",             desc: "Advise twice-daily brushing with age-appropriate fluoride toothpaste. Demonstrate technique with the parent for younger children. Recommend supervised brushing to age 7." },
    { n: 4, title: "Apply professional fluoride",         desc: "Apply fluoride varnish per DBOH schedule. Consider fissure sealants for permanent molars at high risk. Document application." },
    { n: 5, title: "Set risk-based recall",                desc: "Match recall interval to risk per NICE CG19 and DBOH. Document the rationale, the prevention plan and any school-age oral-health programme referral." },
  ],

  decisionTable: {
    title: "Caries-Risk Prevention Plan",
    columns: ["Risk", "Prevention plan"],
    rows: [
      ["Low",      "Standard oral hygiene advice, dietary advice, age-appropriate fluoride toothpaste, recall ≤ 12 months."],
      ["Standard", "OHI + dietary advice + 2× fluoride varnish per year + fissure sealants on susceptible permanent molars; recall 6–12 months."],
      ["High",      "Intensive OHI + dietary intervention + 2–4× fluoride varnish per year + sealants + high-fluoride toothpaste (where appropriate by age) + close recall."],
    ],
  },

  safetyBox: {
    title: "Escalate or reassess if",
    items: [
      "Caries is severe, atypical or progressing rapidly despite documented prevention.",
      "Diet, oral hygiene or non-attendance suggests dental neglect — follow PAED-10 safeguarding.",
      "Child has a medical condition or medication that increases caries risk (e.g. liquid medicines, dry mouth).",
      "Family circumstances prevent the prevention plan being followed.",
      "Sealants or fluoride varnish cannot be applied because of co-operation or co-existing pathology.",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Caries-risk score documented and dated at every exam.",
    "Diet, OHI and fluoride advice delivered and recorded.",
    "Fluoride varnish applications logged per child per year.",
    "Sealants placed on susceptible permanent molars where indicated.",
    "Recall interval matched to risk per NICE CG19.",
  ],

  clinicalSources: [
    PAED_REF.sdcepCaries,
    PAED_REF.dbohQRG,
    PAED_REF.bspdGuidelines,
    PAED_REF.niceCG19,
    PAED_REF.childSmile,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from SDCEP caries-in-children guidance, Delivering Better Oral Health, BSPD UK national clinical guidelines and NICE CG19. Requires Clinical Director review and local approval before live adoption.",
  },
};
