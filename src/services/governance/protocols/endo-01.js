/**
 * Endodontic Clinical Protocol — ENDO-01
 * Endodontic Assessment, Diagnosis & Record Keeping
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-01, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF so the displayed
 * content matches what the Clinical Director adopts on behalf of the group.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_01 = {
  id: "doc-endo-01",
  reference: "ENDO-01",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Endodontic Assessment, Diagnosis & Record Keeping",
  subtitle: "Pain history, sensibility testing, percussion, palpation, periodontal assessment, radiographs, diagnosis, and record entries.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with dental pain, suspected pulpal disease or periapical pathology",
    frequency: "At presentation and before any endodontic procedure",
    lead:      "Dentist",
    evidence:  "History, special tests, radiographs, diagnosis and plan",
  },

  standardLabel: "Diagnostic standard",
  protocolStandard: "Endodontic treatment must not be started on symptoms alone. The clinician must combine the patient history, clinical findings, special tests, periodontal assessment and justified radiographs to reach and record a pulpal and periapical diagnosis. Sensibility tests support the diagnosis but are not definitive in isolation.",

  workflow: [
    { n: 1, title: "Confirm the presenting concern",         desc: "Record onset, duration, character, triggers, relieving factors, swelling, trauma, previous dental treatment and analgesic use. Update medical history and allergies before treatment." },
    { n: 2, title: "Localise the tooth and reproduce symptoms", desc: "Examine restorations, caries, cracks, occlusion, sinus tracts, soft tissues and periodontal support. Use percussion, palpation, mobility and periodontal probing as indicated." },
    { n: 3, title: "Use sensibility tests properly",         desc: "Use cold, heat or electric pulp testing with control teeth where possible. Record the test used and the patient response rather than simply writing positive or negative." },
    { n: 4, title: "Justify imaging",                         desc: "Take periapical radiographs only where clinically indicated. Record the reason, findings and clinical evaluation in the notes." },
    { n: 5, title: "Record a working diagnosis and plan",    desc: "Document pulpal status, apical status, restorability, immediate care, definitive options, consent discussion and review arrangements." },
  ],

  safetyBox: {
    title: "Red flags and diagnostic caution",
    items: [
      "Facial swelling with systemic symptoms, trismus, dysphagia, rapidly spreading infection or airway concern requires urgent escalation.",
      "Consider non-odontogenic pain, sinus disease, neuropathic pain, temporomandibular disorder or referred pain where tests do not correlate.",
      "Do not repeatedly adjust or access multiple teeth without a clear diagnosis.",
      "Where the diagnosis is uncertain, stabilise symptoms, seek a second opinion or refer rather than starting irreversible treatment.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Pain history and relevant medical history update recorded.",
    "Special tests and control tooth responses recorded.",
    "Radiograph justification, clinical evaluation and findings recorded.",
    "Pulpal/periapical diagnosis, prognosis and treatment options recorded.",
    "Patient questions, agreed plan and review arrangements recorded.",
  ],

  clinicalSources: [
    ENDO_REF.besGoodPractice,
    ENDO_REF.gdcConsentRecords,
    ENDO_REF.localRadiography,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to BES Guide to Good Endodontic Practice and GDC Standards on consent and records.",
  },
};
