/**
 * Restorative / Operative Clinical Protocol — RES-10
 * Tooth Wear & Restorative Monitoring
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_10 = {
  id: "doc-res-10",
  reference: "RES-10",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Tooth Wear & Restorative Monitoring",
  subtitle: "Diagnosis, BEWE-style screening, aetiology control, monitoring, restorative thresholds and review for tooth wear cases.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with attrition, erosion, abrasion or abfraction findings",
    frequency: "At baseline, at recall and before any restorative intervention for tooth wear",
    lead:      "Dentist",
    evidence:  "Wear severity score, aetiology, prevention plan and monitoring records",
  },

  standardLabel: "Tooth-wear standard",
  protocolStandard: "Tooth wear must be screened, classified, monitored over time and managed primarily through aetiology control. Operative intervention should be reserved for symptomatic, progressing or aesthetically compromising cases and must be planned around the patient's occlusion.",

  workflow: [
    { n: 1, title: "Screen and grade tooth wear",       desc: "Use a documented screening approach (e.g. BEWE) at routine exams. Record severity per sextant and any active wear surfaces." },
    { n: 2, title: "Identify aetiology",                 desc: "Differentiate erosion (dietary, gastric, environmental), attrition (parafunction, bruxism), abrasion (mechanical) and abfraction. Record contributory medical history, GORD risk and eating disorders sensitively." },
    { n: 3, title: "Plan prevention and monitoring",    desc: "Provide aetiology-specific advice (diet, fluoride, splints, occlusal review, medical liaison for GORD or eating disorders). Take baseline photographs and models or scans where appropriate." },
    { n: 4, title: "Re-assess for progression",         desc: "Compare with baseline at agreed interval. Repeat photographs/models. Confirm whether wear is active, stable or progressing despite intervention." },
    { n: 5, title: "Decide if operative intervention is required", desc: "Operate only where symptoms, function, aesthetics or progression justify it. Discuss alternatives, prognosis, costs and maintenance. Refer for complex full-mouth rehabilitation cases as appropriate." },
  ],

  safetyBox: {
    title: "Consider escalation or referral if",
    items: [
      "Wear is rapidly progressing despite documented aetiology control.",
      "Symptoms or function are significantly compromised.",
      "Eating disorder or unmanaged GORD is suspected — refer sensitively for medical assessment.",
      "Planned restorative scope exceeds local competence (full-mouth rehabilitation).",
      "Patient expectations of an aesthetic outcome cannot be predictably met.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Tooth-wear screening recorded at routine exam.",
    "Aetiology and prevention plan documented.",
    "Baseline records (photographs, models or scans) taken before intervention.",
    "Monitoring interval and outcome documented.",
    "Operative threshold justified per case.",
  ],

  clinicalSources: [
    RES_REF.fgdpOperative,
    RES_REF.fgdpStandards,
    RES_REF.dbohQRG,
    RES_REF.localReferral,
    RES_REF.gdcConsentRecords,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent operative dentistry guide, Delivering Better Oral Health prevention toolkit, local referral pathway and GDC Standards on records. Requires Clinical Director review and local approval before live adoption.",
  },
};
