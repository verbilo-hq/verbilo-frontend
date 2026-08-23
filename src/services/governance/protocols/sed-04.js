/**
 * Sedation Clinical Protocol — SED-04
 * Intravenous Sedation — Midazolam Protocol
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (IACSD 2020).
 */

import {
  SED_CLINICAL_INTENT, SED_LOCAL_SIGNOFF_NOTE, SED_MINIMUM_RECORD_SET,
  SED_VERSION_BASE, SED_REF,
} from "./sed-common";

export const SED_04 = {
  id: "doc-sed-04",
  reference: "SED-04",
  packKey: "clinical_governance",
  category: "Sedation",
  type: "sop",
  title: "Intravenous Sedation — Midazolam Protocol",
  subtitle: "Cannulation, titration, monitoring, reversal and team competence for IV midazolam in adult dental sedation.",

  clinicalIntent: SED_CLINICAL_INTENT,
  localSignOffNote: SED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Adult ASA I–II patients receiving IV midazolam in general dental practice",
    frequency: "Per sedation appointment",
    lead:      "Sedationist (dentist with appropriate training per IACSD)",
    evidence:  "Cannulation, drug dose and timing, monitoring observations, any reversal use",
  },

  standardLabel: "IV-midazolam standard",
  protocolStandard: "IV midazolam sedation must be delivered by a trained sedationist with a trained assistant, full monitoring, immediate access to flumazenil and a documented emergency plan. Titration is to clinical endpoint, never to a fixed dose.",

  workflow: [
    { n: 1, title: "Prepare equipment and team",         desc: "Confirm trained sedationist + trained assistant. Check monitoring (pulse oximetry, NIBP, ECG per IACSD), oxygen, suction, resuscitation drugs including flumazenil, and venous access." },
    { n: 2, title: "Cannulate aseptically",                desc: "Choose appropriate site (typically dorsum of hand or antecubital fossa). Use a flushable cannula. Confirm patency with normal saline." },
    { n: 3, title: "Titrate midazolam slowly",              desc: "Give 2 mg as initial bolus, then 1 mg every 60 seconds until clinical endpoint (slurred speech, slow response, ptosis but verbal contact maintained). Typical total 2.5–7.5 mg. Reduce by 50% in patients > 65." },
    { n: 4, title: "Monitor continuously",                  desc: "SpO2, pulse, BP, respiratory rate, level of consciousness. Verbal contact must be maintained throughout. Document at 5–10 minute intervals or after any dose change." },
    { n: 5, title: "Recover safely",                          desc: "Continue monitoring until discharge criteria met (per SED-06). Confirm escort. Do not discharge until fully recovered. Document recovery time and discharge state." },
  ],

  safetyBox: {
    title: "Be ready to act if",
    items: [
      "SpO2 drops below 95% — give supplemental oxygen, encourage breathing, reduce stimulation.",
      "Respiratory depression or apnoea — bag-valve-mask oxygen, consider flumazenil.",
      "Paradoxical reaction (agitation rather than sedation) — common in elderly; manage supportively, consider flumazenil.",
      "Over-sedation with loss of verbal contact — give 100% O2, consider flumazenil 200 mcg IV, repeated as needed.",
      "Cardiovascular event — follow practice medical emergency protocol.",
    ],
  },

  minimumRecordSet: SED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Team trained and certified per IACSD standards.",
    "Equipment checked pre-session.",
    "Drug doses, timings and total recorded.",
    "Observations documented at recommended intervals.",
    "Flumazenil use, if any, recorded with rationale.",
  ],

  clinicalSources: [
    SED_REF.iacsd,
    SED_REF.sdcepPrescribing,
    SED_REF.rcsFDS,
    SED_REF.mfrSedationKit,
    SED_REF.rescusUK,
  ],

  version: {
    ...SED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IACSD 2020 Standards for Conscious Sedation, SDCEP drug prescribing, RCS Faculty of Dental Surgery guidance and Resuscitation Council UK standards. Requires Clinical Director review and local approval before live adoption.",
  },
};
