/**
 * Trauma Management Clinical Protocol — TRAU-02
 * Avulsion (Tooth Knocked Out) Management
 *
 * Provenance: drafted by Verbilo from IADT 2020 guidelines.
 */

import {
  TRAU_CLINICAL_INTENT, TRAU_LOCAL_SIGNOFF_NOTE, TRAU_MINIMUM_RECORD_SET,
  TRAU_VERSION_BASE, TRAU_REF,
} from "./trau-common";

export const TRAU_02 = {
  id: "doc-trau-02",
  reference: "TRAU-02",
  packKey: "clinical_governance",
  category: "Trauma Management",
  type: "sop",
  title: "Avulsion (Tooth Knocked Out) Management",
  subtitle: "Primary vs permanent tooth, immediate replantation, storage medium, splinting and follow-up per IADT 2020.",

  clinicalIntent: TRAU_CLINICAL_INTENT,
  localSignOffNote: TRAU_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with an avulsed permanent tooth (or primary tooth presentation — see PAED-07)",
    frequency: "Emergency presentation; follow-up per IADT schedule",
    lead:      "Treating dentist with urgent specialist input where required",
    evidence:  "Time out of mouth, storage medium, replantation, splint, antibiotic, follow-up dates",
  },

  standardLabel: "Avulsion standard",
  protocolStandard: "Avulsed permanent teeth must be replanted as soon as possible — ideally at the site of injury. If not replanted, the tooth must be stored in an appropriate medium (HBSS, milk or saliva) and the patient brought urgently for replantation. Primary teeth are NOT replanted.",

  workflow: [
    { n: 1, title: "Triage urgently",              desc: "Confirm permanent vs primary dentition. Confirm time out of mouth. Triage immediately — every minute matters for the periodontal ligament." },
    { n: 2, title: "Replant immediately if possible", desc: "For permanent teeth, rinse with saline or milk (do not scrub). Replant gently. Confirm position with the patient/parent. If unable, place in HBSS, milk or saliva." },
    { n: 3, title: "Splint the replanted tooth",     desc: "Use a flexible splint (acid-etch composite with monofilament line or commercial splint) for 2 weeks for an avulsed tooth with closed apex; 4 weeks if delayed replantation or alveolar fracture." },
    { n: 4, title: "Prescribe antibiotics if indicated", desc: "Per IADT, tetracycline or amoxicillin for replanted avulsed teeth. Adjust for age (avoid tetracycline in young children). Check tetanus status; refer to GP if uncertain." },
    { n: 5, title: "Schedule follow-up per IADT",    desc: "Splint removal at 2 weeks (or 4 weeks if delayed). Clinical and radiographic follow-up at 4 weeks, 3 months, 6 months, 12 months and yearly for at least 5 years." },
  ],

  decisionTable: {
    title: "Avulsion Decision Guide (Permanent Tooth)",
    columns: ["Time out of mouth & storage", "Recommended action"],
    rows: [
      ["Replanted at site of injury",                                    "Splint 2 weeks; antibiotics; follow-up per IADT."],
      ["< 60 min in physiological medium (HBSS / milk / saliva)",         "Rinse, replant, splint 2 weeks, antibiotics, follow-up."],
      ["> 60 min dry OR delayed in non-physiological medium",            "Periodontal cells will not survive. Replant for alveolar form; splint 4 weeks; warn that ankylosis and replacement resorption are likely. Refer for specialist follow-up."],
      ["Primary tooth avulsed",                                           "DO NOT REPLANT — risk of damage to permanent successor. Reassure; refer for paediatric review per PAED-07."],
      ["Open apex, < 60 min, replant",                                   "Replant per IADT — revascularisation is possible; specialist follow-up for pulp status."],
    ],
  },

  safetyBox: {
    title: "Refer immediately if",
    items: [
      "Alveolar fracture is suspected.",
      "Multiple avulsions or complex injuries beyond local competence.",
      "Open apex requiring specialist input.",
      "Patient is medically compromised (immunosuppression, anticoagulants).",
      "The patient is unable to attend the IADT-mandated follow-up schedule locally.",
    ],
  },

  minimumRecordSet: TRAU_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Time out of mouth and storage medium recorded.",
    "Replantation technique and splint details recorded.",
    "Antibiotic and tetanus considerations documented.",
    "IADT-aligned follow-up schedule booked.",
    "Patient/parent advice and emergency contact recorded.",
  ],

  clinicalSources: [
    TRAU_REF.iadtAvulsion,
    TRAU_REF.iadtTrauma,
    TRAU_REF.sdcepPrescribing,
    TRAU_REF.dentalTraumaGuide,
  ],

  version: {
    ...TRAU_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IADT 2020 guidelines on management of avulsion injuries, SDCEP drug prescribing and Dental Trauma Guide chairside decision support. Requires Clinical Director review and local approval before live adoption.",
  },
};
