/**
 * Trauma Management Clinical Protocol — TRAU-05
 * Root Fracture Management
 *
 * Provenance: drafted by Verbilo from IADT 2020 guidelines.
 */

import {
  TRAU_CLINICAL_INTENT, TRAU_LOCAL_SIGNOFF_NOTE, TRAU_MINIMUM_RECORD_SET,
  TRAU_VERSION_BASE, TRAU_REF,
} from "./trau-common";

export const TRAU_05 = {
  id: "doc-trau-05",
  reference: "TRAU-05",
  packKey: "clinical_governance",
  category: "Trauma Management",
  type: "sop",
  title: "Root Fracture Management",
  subtitle: "Diagnosis, classification by location, repositioning, splinting and IADT-aligned follow-up for root fractures.",

  clinicalIntent: TRAU_CLINICAL_INTENT,
  localSignOffNote: TRAU_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Permanent teeth with root fracture",
    frequency: "Emergency presentation; follow-up per IADT",
    lead:      "Treating dentist (specialist for cervical-third)",
    evidence:  "Fracture level, repositioning, splint duration, follow-up",
  },

  standardLabel: "Root-fracture standard",
  protocolStandard: "Root fractures must be assessed for location (apical, middle, cervical third), repositioned when displaced, splinted per IADT and followed up for healing pattern and pulp status. Cervical-third fractures often have a poor prognosis.",

  workflow: [
    { n: 1, title: "Diagnose with imaging",            desc: "Use periapical at multiple angles (parallax) or occlusal view. CBCT where indicated. Classify location: apical, middle or cervical third." },
    { n: 2, title: "Reposition any displacement",       desc: "Digitally reposition the coronal fragment if displaced. Confirm position radiographically." },
    { n: 3, title: "Splint per IADT",                    desc: "Flexible splint for 4 weeks for middle-third or apical-third fractures. Cervical-third fractures may need 4 months of splinting; outcome is often poor." },
    { n: 4, title: "Monitor pulp",                       desc: "Most root-fractured teeth retain pulp vitality. Do NOT initiate endodontic treatment routinely; only treat the coronal fragment if pulp necrosis develops." },
    { n: 5, title: "Follow IADT schedule",                desc: "Clinical and radiographic review at 4 weeks (splint removal for middle/apical), 6–8 weeks, 4 months (cervical splint removal), 6 months, 12 months and yearly for 5 years." },
  ],

  decisionTable: {
    title: "Root-Fracture Location & Prognosis",
    columns: ["Location", "Splint", "Prognosis"],
    rows: [
      ["Apical third",      "4 weeks flexible",   "Generally favourable; pulp often survives."],
      ["Middle third",      "4 weeks flexible",   "Generally good prognosis with appropriate management."],
      ["Cervical third",    "4 months flexible",  "Often poor; high risk of fracture line communicating with sulcus and bacterial contamination."],
    ],
  },

  safetyBox: {
    title: "Refer to specialist if",
    items: [
      "Cervical-third fracture with poor prognosis options.",
      "Pulp necrosis develops in the coronal fragment — needs endodontic intervention only of that fragment.",
      "Multiple fractures or combination injuries.",
      "Open-apex tooth with root fracture.",
      "Patient cannot attend the extended IADT follow-up schedule locally.",
    ],
  },

  minimumRecordSet: TRAU_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Fracture location confirmed radiographically.",
    "Repositioning and splint duration recorded per IADT.",
    "Pulp monitoring booked at IADT intervals.",
    "Endodontic intervention triggered only on confirmed necrosis.",
    "Patient warned of long-term monitoring needs.",
  ],

  clinicalSources: [
    TRAU_REF.iadtTrauma,
    TRAU_REF.dentalTraumaGuide,
    TRAU_REF.localOMFS,
  ],

  version: {
    ...TRAU_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IADT 2020 dental trauma guidelines on root fractures and Dental Trauma Guide chairside support. Requires Clinical Director review and local approval before live adoption.",
  },
};
