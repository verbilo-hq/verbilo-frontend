/**
 * Paediatric Dentistry Clinical Protocol — PAED-07
 * Paediatric Trauma Management
 *
 * Provenance: drafted by Verbilo from UK and international public clinical
 * guidance (IADT, BSPD).
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_07 = {
  id: "doc-paed-07",
  reference: "PAED-07",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "Paediatric Trauma Management",
  subtitle: "Primary and permanent dentition trauma in children — IADT-aligned acute care, follow-up and safeguarding considerations.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Children presenting with acute dental trauma (primary or permanent dentition)",
    frequency: "At every paediatric trauma presentation and follow-up",
    lead:      "Treating clinician (dentist), with onward referral as required",
    evidence:  "Mechanism, examination, treatment, IADT-aligned follow-up plan and safeguarding consideration",
  },

  standardLabel: "Paediatric-trauma standard",
  protocolStandard: "Paediatric dental trauma must be managed per IADT and BSPD guidance, with consideration of head-injury screening, safeguarding, and the difference between primary and permanent tooth injuries. The Trauma Management pack (TRAU) provides full per-injury detail; this protocol governs the paediatric-specific overlay.",

  workflow: [
    { n: 1, title: "Triage and assess for systemic injury", desc: "Screen for head injury (LOC, vomiting, drowsiness — per NICE NG232), neck injury, soft-tissue wounds and tetanus status. Refer to A&E urgently for systemic concern." },
    { n: 2, title: "Take a structured trauma history",       desc: "When, where, how (mechanism), what treatment so far, witnesses. Document carefully — these notes may be referenced years later." },
    { n: 3, title: "Identify dentition and injury type",     desc: "Differentiate primary vs permanent dentition. Apply IADT guidelines for the relevant injury (avulsion, luxation, fracture). For primary teeth, avulsion is NOT replanted." },
    { n: 4, title: "Treat per IADT and document",             desc: "Follow the relevant TRAU protocol (avulsion / luxation / fracture / soft tissue). Splint where indicated; provide written advice and pain management. Record materials and timings." },
    { n: 5, title: "Plan follow-up and safeguarding review", desc: "IADT recommends specific follow-up intervals. Consider safeguarding for inconsistent history, repeated injuries or developmentally inconsistent mechanism (see PAED-10)." },
  ],

  decisionTable: {
    title: "Primary vs Permanent Tooth Trauma — Key Differences",
    columns: ["Injury", "Primary tooth", "Permanent tooth"],
    rows: [
      ["Avulsion",            "DO NOT replant. Reassure parent and review at PAED-07 follow-up.",                       "Replant urgently or use HBSS/milk transport medium. Follow TRAU-02."],
      ["Lateral luxation",    "If minor and not interfering with occlusion, allow to reposition spontaneously. Extract if severe interference.", "Reposition and splint per TRAU-03 (typically 4 weeks)."],
      ["Intrusion",            "Allow spontaneous re-eruption if mild and follicle not impinged; extract if severely intruded toward permanent germ.", "Per TRAU-03 — orthodontic, surgical or spontaneous repositioning by stage of root development."],
      ["Crown fracture",       "Smooth or restore as feasible. Monitor pulp.",                                            "Per TRAU-04 — pulp-protective management and restoration."],
      ["Root fracture",        "Monitor; extraction may be needed if mobility or symptoms persist.",                       "Per TRAU-05 — splint per IADT, follow-up schedule."],
    ],
  },

  safetyBox: {
    title: "Refer urgently if",
    items: [
      "Signs of head injury (LOC, vomiting, drowsiness, abnormal neuro).",
      "Severe facial fracture, bleeding that cannot be controlled or airway concern.",
      "Suspected non-accidental injury or unexplained injury pattern.",
      "Avulsed permanent tooth presenting after extra-oral dry time > 60 minutes — specialist input.",
      "Anxiety or behaviour prevents treatment and the injury is time-critical.",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Mechanism, time and witnesses recorded.",
    "Head-injury screening documented.",
    "Treatment provided cross-referenced to TRAU protocols.",
    "Follow-up dates set per IADT.",
    "Safeguarding consideration documented at every paed trauma visit.",
  ],

  clinicalSources: [
    PAED_REF.iadtTrauma,
    PAED_REF.bspdTrauma,
    PAED_REF.bspdGuidelines,
    PAED_REF.workingTogether,
    PAED_REF.gdcChildSafety,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IADT dental trauma guidelines, BSPD paediatric trauma guidance, Working Together to Safeguard Children and GDC Standards on safeguarding. Cross-references the Trauma Management (TRAU) pack for per-injury detail. Requires Clinical Director review and local approval before live adoption.",
  },
};
