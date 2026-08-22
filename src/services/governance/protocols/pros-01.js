/**
 * Prosthodontics Clinical Protocol — PROS-01
 * Prosthodontic Assessment & Treatment Planning
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_01 = {
  id: "doc-pros-01",
  reference: "PROS-01",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Prosthodontic Assessment & Treatment Planning",
  subtitle: "Restorative need, prognosis, occlusion, periodontal status, options, costs and the sequencing of prosthetic care.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients being assessed for crowns, bridges, dentures or implant restorations",
    frequency: "At initial assessment and whenever the plan changes",
    lead:      "Dentist / restorative clinician",
    evidence:  "Assessment record, options, costs, prognosis and agreed plan",
  },

  standardLabel: "Planning standard",
  protocolStandard: "Prosthodontic treatment must be planned from a structured assessment of restorative need, periodontal status, occlusion, restorability and patient expectation. The plan must consider no-treatment and removable alternatives, set sequencing across phases and be agreed with the patient before any irreversible work is started.",

  workflow: [
    { n: 1, title: "Define the patient's concern and goal",  desc: "Record functional, aesthetic and psychological aims. Use photographs where useful. Distinguish what the patient is asking for from what they need clinically." },
    { n: 2, title: "Assess each tooth and the whole arch",    desc: "Update medical history, charting, periodontal status, mobility, caries, endodontic status, occlusion, parafunction and existing restorations. Take justified radiographs." },
    { n: 3, title: "Stabilise disease before prosthetic work", desc: "Treat caries, periodontal disease and active endodontic pathology before crowns, bridges or implant restorations. Stable foundations are non-negotiable." },
    { n: 4, title: "Discuss options including removable",      desc: "Include no treatment, monitoring, direct restorations, RPD, complete denture, fixed bridge, implant. Discuss prognosis, costs, longevity and maintenance for each." },
    { n: 5, title: "Agree sequencing and consent",             desc: "Plan staged treatment with review points. Record costs, alternatives, material risks, maintenance and the agreed sequence. Use written treatment plans for complex cases." },
  ],

  safetyBox: {
    title: "Do not progress to irreversible prosthetic work if",
    items: [
      "Active caries, periodontal disease or pulpal pathology is unstabilised.",
      "Restorability or strategic value of an abutment is doubtful.",
      "The patient's expectation cannot be predictably met by the proposed work.",
      "Maintenance commitments and long-term costs have not been understood.",
      "Complexity exceeds local competence and referral has not been considered.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Patient concerns and treatment goals recorded.",
    "Charting, periodontal and occlusal assessment recorded.",
    "Stabilisation of disease completed before prosthetic intervention.",
    "Options including no-treatment, removable and implant discussed.",
    "Sequencing, costs, alternatives and consent documented.",
  ],

  clinicalSources: [
    PROS_REF.fgdpStandards,
    PROS_REF.bsspdDentures,
    PROS_REF.bspPerio,
    PROS_REF.gdcConsentRecords,
    PROS_REF.localProsRef,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent standards, BSSPD denture guidance, BSP perio-restorative interface guidance and GDC Standards on consent and records. Requires Clinical Director review and local approval before live adoption.",
  },
};
