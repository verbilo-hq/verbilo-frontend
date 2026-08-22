/**
 * Restorative / Operative Clinical Protocol — RES-03
 * Local Anaesthesia & Pain Control
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_03 = {
  id: "doc-res-03",
  reference: "RES-03",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Local Anaesthesia & Pain Control",
  subtitle: "Medical screening, agent selection, dose limits, technique, complication management and post-operative analgesia.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Any patient receiving local anaesthesia for restorative or surgical care",
    frequency: "Every visit where LA is delivered",
    lead:      "Dentist; competent DCPs within scope and prescription",
    evidence:  "Agent, dose, technique, complications and post-op advice recorded",
  },

  standardLabel: "Local-anaesthesia standard",
  protocolStandard: "Local anaesthesia must be selected and delivered with knowledge of the patient's medical history, the maximum safe dose for body weight, the indications and limits of the technique, and the practice's emergency procedure if complications occur.",

  workflow: [
    { n: 1, title: "Screen medical and medication history",  desc: "Check cardiovascular history, pregnancy, allergies, anticoagulants, recent thromboembolic events, methaemoglobinaemia risk and prior LA reactions. Update history at every visit." },
    { n: 2, title: "Select agent and technique",              desc: "Choose lidocaine, articaine, prilocaine or mepivacaine based on indication, duration, vasoconstrictor risk and patient factors. Use the most appropriate technique (infiltration, block, intraligamentary) within competence." },
    { n: 3, title: "Calculate and respect maximum safe dose", desc: "Calculate by body weight using the agent's data sheet. Do not exceed manufacturer limits; record total cartridges and agent in milligrams." },
    { n: 4, title: "Deliver with aspiration and patient monitoring", desc: "Use aspirating syringes, slow injection, topical anaesthesia where appropriate, and monitor for syncope, palpitations, paraesthesia or systemic reactions throughout." },
    { n: 5, title: "Advise on post-LA care",                   desc: "Warn about soft-tissue trauma during numbness, expected duration, and when to contact the practice for persistent numbness, swelling or systemic symptoms." },
  ],

  safetyBox: {
    title: "Stop and reassess if",
    items: [
      "The patient experiences chest pain, severe palpitations, breathlessness or significant systemic symptoms.",
      "Sudden swelling, urticaria or any sign of anaphylaxis appears — follow the practice medical emergency protocol.",
      "Persistent paraesthesia is reported after a block — refer per local pathway and document.",
      "The maximum safe dose has been reached without adequate anaesthesia — pause, reassess and avoid further dosing.",
      "Anticoagulation status, recent thromboembolic event or unstable medical history is unclear.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Medical and medication history reviewed before LA.",
    "Agent, concentration, vasoconstrictor and total dose recorded.",
    "Technique used and any aspiration response recorded.",
    "Any complications, advice and follow-up recorded.",
    "Post-operative analgesia advice provided where appropriate.",
  ],

  clinicalSources: [
    RES_REF.fgdpOperative,
    RES_REF.sdcepPrescribing,
    RES_REF.sdcepAnticoag,
    RES_REF.mfrInstructions,
    RES_REF.gdcCompetence,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent operative guide, SDCEP drug prescribing and anticoagulant guidance, manufacturer LA datasheets and GDC Standards on competence. Requires Clinical Director review and local approval before live adoption.",
  },
};
