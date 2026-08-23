/**
 * Endodontic Clinical Protocol — ENDO-09
 * Endodontic Complications, Flare-Ups & Incident Management
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-09, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_09 = {
  id: "doc-endo-09",
  reference: "ENDO-09",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Endodontic Complications, Flare-Ups & Incident Management",
  subtitle: "File separation, perforation, hypochlorite incidents, ledging, flare-ups, persistent symptoms, documentation, and escalation.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Any procedural complication, adverse event or unexpected worsening",
    frequency: "Immediately when identified and at follow-up",
    lead:      "Treating dentist / clinical lead where significant",
    evidence:  "Incident details, patient communication, management and review recorded",
  },

  standardLabel: "Complication-management standard",
  protocolStandard: "Endodontic complications must be recognised promptly, managed within competence, disclosed honestly to the patient, documented clearly and escalated where required. The priority is patient safety, preservation of options and timely referral when complexity exceeds local capability.",

  workflow: [
    { n: 1, title: "Stop and assess",            desc: "Pause treatment, stabilise the patient, confirm the event and assess pain, swelling, bleeding, airway risk, tooth prognosis and need for urgent referral." },
    { n: 2, title: "Inform the patient",          desc: "Explain what has happened, the likely impact, immediate management, options and whether referral or review is needed. Avoid defensive or unclear wording." },
    { n: 3, title: "Manage within competence",    desc: "For flare-ups, perforations, separated instruments, ledging, irrigant incidents or persistent symptoms, follow local protocols and seek senior/specialist advice where needed." },
    { n: 4, title: "Preserve future options",     desc: "Avoid repeated blind attempts that worsen prognosis. Secure the tooth, control infection and arrange appropriate review or referral." },
    { n: 5, title: "Record and learn",            desc: "Complete clinical notes, incident reporting where required, radiographs/images, advice given and governance review for significant events." },
  ],

  safetyBox: {
    title: "Events requiring senior review or referral",
    items: [
      "Suspected sodium hypochlorite accident, significant swelling, severe pain or tissue injury.",
      "Perforation, separated instrument beyond retrieval competence, transportation or ledging with compromised outcome.",
      "Persistent symptoms or swelling despite guideline-quality treatment.",
      "Suspected vertical root fracture, resorption or complex anatomy.",
      "Any event where the patient's safety, trust or treatment options are materially affected.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Complication type, timing and location recorded.",
    "Patient explanation and options recorded.",
    "Immediate management and advice recorded.",
    "Referral/senior review decision recorded.",
    "Incident report and learning action completed where required.",
  ],

  clinicalSources: [
    ENDO_REF.besGoodPractice,
    ENDO_REF.localIncident,
    ENDO_REF.gdcOpenness,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to BES Guide to Good Endodontic Practice and GDC Standards on openness and patient communication.",
  },
};
