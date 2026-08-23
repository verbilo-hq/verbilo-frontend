/**
 * Endodontic Clinical Protocol — ENDO-05
 * Rubber Dam, Isolation & Aseptic Technique
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-05, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_05 = {
  id: "doc-endo-05",
  reference: "ENDO-05",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Rubber Dam, Isolation & Aseptic Technique",
  subtitle: "Rubber dam placement, clamp selection, field disinfection, contamination prevention, patient safety, and documentation.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All root canal treatment and retreatment procedures",
    frequency: "Every endodontic visit",
    lead:      "Dentist with dental nurse support",
    evidence:  "Rubber dam use, isolation checks and contamination actions recorded",
  },

  standardLabel: "Asepsis standard",
  protocolStandard: "Rubber dam is mandatory for root canal treatment. It protects the airway, improves moisture control and supports aseptic technique. If rubber dam cannot be placed, the clinician must reconsider restorability, pre-endodontic build-up, referral or alternative treatment.",

  workflow: [
    { n: 1, title: "Prepare before access",       desc: "Confirm medical history, latex sensitivity, tooth to be treated, radiographs, instruments, suction and clamp options before starting." },
    { n: 2, title: "Place secure isolation",       desc: "Use an appropriate dam, frame, clamp or alternative stabilisation method. Confirm that the operative field is stable and the patient can tolerate the dam." },
    { n: 3, title: "Protect the patient",          desc: "Use floss ligatures where appropriate, high-volume aspiration, eye protection and careful instrument transfer. Keep small instruments secure." },
    { n: 4, title: "Disinfect the field",          desc: "Clean and disinfect the isolated tooth and surrounding dam according to the practice protocol before canal access or re-entry." },
    { n: 5, title: "Manage contamination immediately", desc: "If saliva contamination occurs, pause treatment, re-isolate, re-disinfect and repeat irrigation or dressing steps as clinically appropriate." },
  ],

  safetyBox: {
    title: "When isolation is not adequate",
    items: [
      "Do not proceed with canal instrumentation if the tooth cannot be isolated.",
      "Consider pre-endodontic restoration, orthodontic banding, crown removal, referral or extraction discussion where isolation fails.",
      "If the clamp is unstable, do not rely on patient biting or manual retraction as a substitute for safe isolation.",
      "If a patient cannot tolerate rubber dam, stop and reassess options rather than compromising asepsis or airway safety.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Rubber dam use recorded for every RCT visit.",
    "Any isolation difficulty and action taken recorded.",
    "Contamination events and corrective steps recorded.",
    "Reason recorded if endodontic treatment is deferred.",
    "Patient tolerance and safety concerns recorded.",
  ],

  clinicalSources: [
    ENDO_REF.besGoodPractice,
    ENDO_REF.localIpc,
    ENDO_REF.gdcSafety,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to BES Guide to Good Endodontic Practice and GDC Standards on patient safety.",
  },
};
