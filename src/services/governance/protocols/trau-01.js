/**
 * Trauma Management Clinical Protocol — TRAU-01
 * Acute Dental Trauma — Initial Assessment & Triage
 *
 * Provenance: drafted by Verbilo from UK and international public clinical
 * guidance (IADT 2020, BSPD, NICE).
 */

import {
  TRAU_CLINICAL_INTENT, TRAU_LOCAL_SIGNOFF_NOTE, TRAU_MINIMUM_RECORD_SET,
  TRAU_VERSION_BASE, TRAU_REF,
} from "./trau-common";

export const TRAU_01 = {
  id: "doc-trau-01",
  reference: "TRAU-01",
  packKey: "clinical_governance",
  category: "Trauma Management",
  type: "sop",
  title: "Acute Dental Trauma — Initial Assessment & Triage",
  subtitle: "Same-day triage of dental trauma — head-injury screening, history, examination, imaging and prioritisation of injuries.",

  clinicalIntent: TRAU_CLINICAL_INTENT,
  localSignOffNote: TRAU_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Any patient presenting with acute dental injury",
    frequency: "On urgent attendance",
    lead:      "Treating dentist; refer urgently as required",
    evidence:  "Triage, head-injury screen, examination, imaging and immediate plan",
  },

  standardLabel: "Trauma-triage standard",
  protocolStandard: "Dental trauma must be assessed promptly with attention to the patient as a whole — not just the teeth. Head injury, soft-tissue injury, airway and tetanus status must be screened, and immediate care prioritised over elective treatment.",

  workflow: [
    { n: 1, title: "Screen for head and systemic injury", desc: "Per NICE NG232 head-injury criteria — LOC, vomiting, drowsiness, amnesia, neck pain. Refer to A&E urgently if any positive. Check tetanus status for soft-tissue injury." },
    { n: 2, title: "Take a structured trauma history",     desc: "When, where, how (mechanism). Witnesses. Treatment so far. Note the time precisely — particularly important for avulsion injuries." },
    { n: 3, title: "Examine systematically",                desc: "Extra-oral: face, lips, lymph nodes, soft tissues, cervical spine. Intra-oral: lips, mucosa, tongue, alveolus, occlusion, teeth — mobility, displacement, fracture, response to sensibility tests." },
    { n: 4, title: "Image where indicated",                  desc: "Periapical and occlusal views per IADT for the specific injury. Consider CBCT for complex injuries. Document image justification per IR(ME)R." },
    { n: 5, title: "Prioritise and plan",                    desc: "Treat avulsion and luxation with apex-side urgency first, then fractures, then soft tissue. Provide pain relief and antibiotic per SDCEP only where indicated. Refer urgently if exceeds local competence." },
  ],

  safetyBox: {
    title: "Same-day urgent referral to A&E / OMFS if",
    items: [
      "Any signs of head injury per NICE NG232.",
      "Suspected facial fracture, mandibular fracture, or significant displacement.",
      "Uncontrolled bleeding or airway concern.",
      "Multiple injuries beyond practice scope.",
      "Suspected non-accidental injury — escalate per safeguarding pathway.",
    ],
  },

  minimumRecordSet: TRAU_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Head-injury screen recorded for every trauma case.",
    "Time of injury and time of presentation recorded.",
    "Mechanism and witnesses recorded.",
    "Imaging justification documented.",
    "Immediate plan and any referral recorded.",
  ],

  clinicalSources: [
    TRAU_REF.iadtTrauma,
    TRAU_REF.niceHeadInjury,
    TRAU_REF.dentalTraumaGuide,
    TRAU_REF.practiceEmergency,
    TRAU_REF.gdcSafety,
  ],

  version: {
    ...TRAU_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IADT 2020 dental trauma guidelines, NICE NG232 head injury, the practice's medical emergency protocol and GDC Standards on patient safety. Requires Clinical Director review and local approval before live adoption.",
  },
};
