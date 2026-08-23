/**
 * Sedation Clinical Protocol — SED-03
 * Inhalation Sedation (Nitrous Oxide / Oxygen)
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (IACSD 2020).
 */

import {
  SED_CLINICAL_INTENT, SED_LOCAL_SIGNOFF_NOTE, SED_MINIMUM_RECORD_SET,
  SED_VERSION_BASE, SED_REF,
} from "./sed-common";

export const SED_03 = {
  id: "doc-sed-03",
  reference: "SED-03",
  packKey: "clinical_governance",
  category: "Sedation",
  type: "sop",
  title: "Inhalation Sedation (Nitrous Oxide / Oxygen)",
  subtitle: "Equipment, technique, scavenging, monitoring and recovery for inhalation sedation with nitrous oxide and oxygen.",

  clinicalIntent: SED_CLINICAL_INTENT,
  localSignOffNote: SED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients receiving inhalation sedation (children > 4 typically; cooperative adults)",
    frequency: "Per sedation appointment",
    lead:      "Sedationist (dentist) with trained dental nurse",
    evidence:  "Gas concentrations, monitoring, recovery and any adverse event",
  },

  standardLabel: "Inhalation-sedation standard",
  protocolStandard: "Inhalation sedation must be delivered with appropriate dedicated equipment, scavenging, training and monitoring. Nitrous oxide must never be delivered without oxygen, and the team must be trained to recognise and manage over-sedation.",

  workflow: [
    { n: 1, title: "Prepare equipment",           desc: "Check dedicated inhalation sedation machine (active scavenging, fail-safe oxygen, gas cylinders, anti-hypoxic device). Confirm hood/nasal mask available in appropriate sizes." },
    { n: 2, title: "Verify pre-sedation status",   desc: "Confirm consent, fasting, escort, medical history unchanged. Take baseline observations." },
    { n: 3, title: "Titrate gas concentration",    desc: "Begin with 100% oxygen, then introduce nitrous oxide slowly in 5–10% increments per IACSD. Target patient cooperation and verbal contact. Maximum typically 30–50% N2O." },
    { n: 4, title: "Monitor throughout",           desc: "Clinical observation (responsiveness, breathing, colour), pulse oximetry if indicated, ability to maintain verbal contact. Adjust dose to response." },
    { n: 5, title: "Recover with 100% oxygen",     desc: "End with 3–5 minutes of 100% oxygen to prevent diffusion hypoxia. Confirm full recovery before discharge (responsive, coordinated, no nausea, baseline observations)." },
  ],

  safetyBox: {
    title: "Pause or stop sedation if",
    items: [
      "Patient loses verbal contact (over-sedation — reduce N2O immediately).",
      "Respiratory depression, cyanosis or distress.",
      "Vomiting (turn head to side, suction, provide oxygen).",
      "Equipment malfunction or scavenging failure.",
      "Patient becomes uncooperative or distressed.",
    ],
  },

  minimumRecordSet: SED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Equipment checked before each session.",
    "Gas concentrations and timing recorded.",
    "Monitoring documented throughout.",
    "100% oxygen recovery completed and timed.",
    "Discharge criteria met and recorded.",
  ],

  clinicalSources: [
    SED_REF.iacsd,
    SED_REF.rcsFDS,
    SED_REF.niceConsciousSed,
    SED_REF.mfrSedationKit,
  ],

  version: {
    ...SED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IACSD 2020 Standards for Conscious Sedation, RCS Faculty of Dental Surgery guidance, NICE CG112 (where paediatric) and manufacturer equipment instructions. Requires Clinical Director review and local approval before live adoption.",
  },
};
