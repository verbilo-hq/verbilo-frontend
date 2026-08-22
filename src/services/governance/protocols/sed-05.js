/**
 * Sedation Clinical Protocol — SED-05
 * Monitoring During Sedation
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (IACSD 2020).
 */

import {
  SED_CLINICAL_INTENT, SED_LOCAL_SIGNOFF_NOTE, SED_MINIMUM_RECORD_SET,
  SED_VERSION_BASE, SED_REF,
} from "./sed-common";

export const SED_05 = {
  id: "doc-sed-05",
  reference: "SED-05",
  packKey: "clinical_governance",
  category: "Sedation",
  type: "sop",
  title: "Monitoring During Sedation",
  subtitle: "Equipment standards, observation cadence, documentation and the team competence required for safe sedation monitoring.",

  clinicalIntent: SED_CLINICAL_INTENT,
  localSignOffNote: SED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients receiving conscious sedation",
    frequency: "Continuously during sedation and recovery",
    lead:      "Sedationist + trained sedation assistant",
    evidence:  "Monitoring equipment used, observation record at required intervals, any abnormal finding",
  },

  standardLabel: "Sedation-monitoring standard",
  protocolStandard: "All patients undergoing conscious sedation must be monitored to the standard set by IACSD 2020 — clinical observation supplemented by pulse oximetry (mandatory for IV) and other modalities as appropriate. The sedationist and assistant must both be trained, and observations recorded contemporaneously.",

  workflow: [
    { n: 1, title: "Set up equipment per IACSD",      desc: "IV midazolam: pulse oximetry, NIBP, ECG (where indicated). Inhalation: clinical observation primarily, pulse oximetry where indicated. All techniques: oxygen, suction, resuscitation equipment immediately available." },
    { n: 2, title: "Baseline observations",            desc: "Pulse, BP, SpO2 and respiratory rate before sedation begins. Document baseline." },
    { n: 3, title: "Continuous clinical monitoring",   desc: "Verbal contact, level of consciousness, breathing, colour and patient comfort. The sedationist focuses on the patient; the trained assistant supports both procedure and monitoring." },
    { n: 4, title: "Record at intervals",              desc: "Document observations every 5–10 minutes during IV sedation, and after every dose change. Inhalation: clinical observation continuous, document at start, mid-procedure and end." },
    { n: 5, title: "Escalate any abnormal finding",    desc: "Drop in SpO2, change in level of consciousness, respiratory or cardiovascular concern — pause treatment, manage immediately, document the event and the response." },
  ],

  safetyBox: {
    title: "Stop and manage immediately if",
    items: [
      "SpO2 < 95% sustained — give oxygen.",
      "Respiratory rate < 10/min — stimulate, give oxygen, consider reversal.",
      "Loss of verbal contact (over-sedation).",
      "Significant change in BP or pulse from baseline.",
      "Equipment failure — stop sedation; do not continue uninstrumented.",
    ],
  },

  minimumRecordSet: SED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Equipment check completed before each session.",
    "Baseline observations recorded.",
    "Observations recorded at IACSD-required intervals.",
    "Trained assistant present throughout.",
    "Any adverse event recorded and reviewed.",
  ],

  clinicalSources: [
    SED_REF.iacsd,
    SED_REF.rcsFDS,
    SED_REF.gdcSafety,
    SED_REF.mfrSedationKit,
  ],

  version: {
    ...SED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IACSD 2020 Standards for Conscious Sedation, RCS Faculty of Dental Surgery guidance, GDC Standards on patient safety and manufacturer equipment instructions. Requires Clinical Director review and local approval before live adoption.",
  },
};
