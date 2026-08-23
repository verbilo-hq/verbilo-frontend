/**
 * Trauma Management Clinical Protocol — TRAU-03
 * Luxation Injuries (Concussion, Subluxation, Extrusion, Lateral, Intrusion)
 *
 * Provenance: drafted by Verbilo from IADT 2020 guidelines.
 */

import {
  TRAU_CLINICAL_INTENT, TRAU_LOCAL_SIGNOFF_NOTE, TRAU_MINIMUM_RECORD_SET,
  TRAU_VERSION_BASE, TRAU_REF,
} from "./trau-common";

export const TRAU_03 = {
  id: "doc-trau-03",
  reference: "TRAU-03",
  packKey: "clinical_governance",
  category: "Trauma Management",
  type: "sop",
  title: "Luxation Injuries — Concussion, Subluxation, Extrusion, Lateral, Intrusion",
  subtitle: "Classification, repositioning, splinting and IADT-aligned follow-up for luxation injuries to permanent teeth.",

  clinicalIntent: TRAU_CLINICAL_INTENT,
  localSignOffNote: TRAU_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with luxation injuries to permanent teeth (see PAED-07 for primary)",
    frequency: "Emergency presentation; follow-up per IADT schedule",
    lead:      "Treating dentist (specialist input for intrusion or complex)",
    evidence:  "Classification, repositioning, splint type, follow-up",
  },

  standardLabel: "Luxation standard",
  protocolStandard: "Luxation injuries must be classified accurately because management and prognosis differ. The clinician must reposition where appropriate, splint per IADT and arrange the IADT-mandated follow-up schedule.",

  workflow: [
    { n: 1, title: "Classify the injury",                desc: "Concussion (sensitive, no displacement, no mobility), subluxation (sensitive + mobile, no displacement), extrusion (partial displacement out), lateral luxation (palatal/labial displacement), intrusion (driven into alveolus)." },
    { n: 2, title: "Reposition where required",          desc: "Extrusion: digital repositioning. Lateral luxation: digital repositioning, splint. Intrusion: depending on root development — may allow spontaneous re-eruption, orthodontic or surgical repositioning." },
    { n: 3, title: "Splint per IADT",                     desc: "Flexible splint typically 2 weeks for extrusion/concussion/subluxation; 4 weeks for lateral luxation with alveolar fracture. Avoid rigid splinting." },
    { n: 4, title: "Manage occlusion and symptoms",       desc: "Adjust occlusion if interfering. Soft diet for 1–2 weeks. Analgesia. Chlorhexidine 0.12% rinse. Avoid contact sports until healing." },
    { n: 5, title: "Schedule IADT follow-up",              desc: "Clinical and radiographic review at 2 weeks (splint removal where appropriate), 4 weeks, 8 weeks, 6 months, 1 year, then yearly for 5 years." },
  ],

  decisionTable: {
    title: "Luxation Classification & Management",
    columns: ["Type", "Splint", "Notes"],
    rows: [
      ["Concussion (no displacement, sensitive)",          "None usually",   "Occlusal adjustment if needed; monitor pulp."],
      ["Subluxation (mobile, no displacement)",             "Flexible 2 weeks if needed for comfort", "Soft diet; chlorhexidine; monitor pulp."],
      ["Extrusion",                                          "Flexible 2 weeks", "Reposition with digital pressure; monitor pulp."],
      ["Lateral luxation",                                   "Flexible 4 weeks (alveolar fracture often present)", "Reposition; monitor pulp; high risk of pulp necrosis in mature root."],
      ["Intrusion (mature root)",                            "Often requires orthodontic or surgical repositioning",  "Pulp necrosis very likely; endodontic treatment usually needed within 2–3 weeks."],
      ["Intrusion (immature root)",                          "Allow spontaneous re-eruption",                          "Monitor closely; specialist input."],
    ],
  },

  safetyBox: {
    title: "Refer for specialist management if",
    items: [
      "Intrusion of a mature tooth (often requires endo and complex repositioning).",
      "Severe lateral luxation with alveolar fracture.",
      "Multiple luxations or combination injuries.",
      "Open-apex tooth where revascularisation requires specialist follow-up.",
      "Patient cannot attend the IADT follow-up schedule locally.",
    ],
  },

  minimumRecordSet: TRAU_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Luxation type classified and recorded.",
    "Splint type and duration recorded per IADT.",
    "Pulp monitoring booked at IADT intervals.",
    "Occlusion adjusted where required.",
    "Patient advice and emergency contact provided.",
  ],

  clinicalSources: [
    TRAU_REF.iadtTrauma,
    TRAU_REF.dentalTraumaGuide,
    TRAU_REF.sdcepPrescribing,
    TRAU_REF.localOMFS,
  ],

  version: {
    ...TRAU_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IADT 2020 dental trauma guidelines on luxation injuries, Dental Trauma Guide chairside support, SDCEP drug prescribing and local OMFS referral pathway. Requires Clinical Director review and local approval before live adoption.",
  },
};
