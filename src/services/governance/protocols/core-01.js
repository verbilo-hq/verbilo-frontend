/**
 * Core Clinical Protocol — CORE-01
 * Medical Emergencies — Clinical Response
 *
 * Anchored to: Resuscitation Council UK Quality Standards for CPR Practice
 * and Training (Dental); GDC Standard 7.1; CQC Reg 12.
 *
 * Scope note: this protocol covers the *clinical* decision-making layer
 * for medical emergencies at the chair — recognition, immediate ABCDE,
 * adrenaline IM in anaphylaxis, BLS, when to call 999, handover.
 * The *operational* requirements (drug box stock, AED maintenance,
 * mock-drill schedule) live in the Medical Emergencies Governance pack.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE, CORE_MINIMUM_RECORD_SET,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_01 = {
  id: "doc-core-01",
  reference: "CORE-01",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Medical Emergencies — Clinical Response",
  subtitle: "Recognition, ABCDE assessment, adrenaline IM in anaphylaxis, BLS, 999 escalation and paramedic handover.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients presenting with collapse, anaphylaxis, hypoglycaemia, seizure, asthma, MI, choking or any sudden deterioration",
    frequency: "Whenever a medical emergency arises; rehearsed in mock drills",
    lead:      "Resuscitation Lead per site",
    evidence:  "Incident record, ambulance handover, debrief, mock drill log",
  },

  standardLabel: "Clinical response standard",
  protocolStandard: "Every clinical team member must be able to recognise common medical emergencies, initiate ABCDE assessment, deliver the correct first-line intervention (in particular adrenaline 1:1000 IM 500 µg in adult anaphylaxis), commence BLS where indicated, summon emergency services and hand over clearly. RCUK competency must be current for every clinical staff member.",

  workflow: [
    { n: 1, title: "Recognise and call for help",  desc: "Identify deterioration early. Use the ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure. Call a team member to bring the emergency kit + AED, and to dial 999 if any A/B/C compromise." },
    { n: 2, title: "Treat the primary problem",    desc: "Anaphylaxis: adrenaline 1:1000 IM 500 µg (adult) into the anterolateral thigh, repeat at 5 min if no response. Cardiac arrest: 30:2 CPR + AED. Hypoglycaemia (conscious): oral glucose 15–20 g; unconscious: glucagon 1 mg IM. Asthma: salbutamol via spacer 4–10 puffs. See chairside quick-reference for the full set." },
    { n: 3, title: "Position, oxygen, monitor",    desc: "Position appropriate to condition (flat with legs raised for anaphylaxis; recovery position if unconscious + breathing). High-flow oxygen 15 L/min via non-rebreather. Monitor pulse, SpO₂, respiration, level of response every 1–2 min." },
    { n: 4, title: "Hand over to paramedic",       desc: "SBAR or AT-MIST handover: time of onset, trigger, observations, treatment given (drug, dose, route, time, response), and known medical history / allergies." },
    { n: 5, title: "Document and debrief",         desc: "Contemporaneous record of the event. Open an incident report in the CQC Compliance Hub. Hold a team debrief within 48 hours; record learning and any equipment / drug shortfalls. Consider Reg 20 Duty of Candour if patient experienced moderate harm or above." },
  ],

  safetyBox: {
    title: "Do not delay",
    items: [
      "Adrenaline IM is the single most important intervention in anaphylaxis. Do not give IV in the dental setting.",
      "Call 999 early. Continuing treatment while waiting is correct; delaying the call is not.",
      "If equipment / drugs are out of date or missing, escalate as a Sig Event Analysis. RCUK minimum kit must be in date and available at all times.",
      "Practice BLS competency must be current for every clinical staff member — annual minimum.",
    ],
  },

  minimumRecordSet: [
    "Date, time and location of event.",
    "Recognition triggers, ABCDE findings and observations.",
    "Drugs given — agent, dose, route, time, response. Repeat doses if given.",
    "Other interventions (oxygen, positioning, BLS, AED shocks).",
    "Paramedic handover details, transfer destination, ongoing care plan.",
    "Debrief outcomes, learning, equipment / training actions, Duty of Candour conversation log.",
  ],

  auditPrompts: [
    "Was the emergency recognised and 999 called promptly?",
    "Was adrenaline IM (or other primary drug) given at the correct dose, route and timing?",
    "Were observations recorded every 1–2 min?",
    "Was the patient handed over cleanly to paramedics with full documentation?",
    "Was the incident logged in the CQC Compliance Hub with all required escalations (Reg 18 / Reg 20)?",
    "Was a team debrief held and learning recorded?",
  ],

  clinicalSources: [
    CORE_REF.rcukDental,
    CORE_REF.gdcSafety,
    CORE_REF.cqcReg12,
    CORE_REF.cqcReg20,
    CORE_REF.bnf,
    CORE_REF.chairsideMedEmerg,
    CORE_REF.govMedEmerg,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — clinical decision-making layer for medical emergencies, anchored to RCUK Quality Standards (Dental) and BNF emergency drug doses.",
  },
};
