/**
 * Trauma Management Clinical Protocol — TRAU-08
 * Trauma Follow-Up & Long-Term Monitoring
 *
 * Provenance: drafted by Verbilo from IADT 2020 guidelines.
 */

import {
  TRAU_CLINICAL_INTENT, TRAU_LOCAL_SIGNOFF_NOTE, TRAU_MINIMUM_RECORD_SET,
  TRAU_VERSION_BASE, TRAU_REF,
} from "./trau-common";

export const TRAU_08 = {
  id: "doc-trau-08",
  reference: "TRAU-08",
  packKey: "clinical_governance",
  category: "Trauma Management",
  type: "sop",
  title: "Trauma Follow-Up & Long-Term Monitoring",
  subtitle: "IADT-aligned follow-up schedule, monitoring of pulp status, root resorption, ankylosis and the long-term sequelae of dental trauma.",

  clinicalIntent: TRAU_CLINICAL_INTENT,
  localSignOffNote: TRAU_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients with previously treated dental trauma",
    frequency: "Per IADT schedule — typically 4 weeks, 6–8 weeks, 6 months, 1 year, then yearly for 5 years",
    lead:      "Treating dentist (specialist for complex)",
    evidence:  "Follow-up appointments attended, clinical and radiographic findings, any sequela management",
  },

  standardLabel: "Trauma follow-up standard",
  protocolStandard: "Trauma cases must be followed up per IADT schedules. Pulp status, root resorption, ankylosis and aesthetic outcome must be monitored, and sequelae managed promptly when they develop.",

  workflow: [
    { n: 1, title: "Maintain a trauma register",       desc: "Keep a register of patients with prior trauma and their next follow-up dates. Ensure they are not lost to follow-up." },
    { n: 2, title: "At each review, assess",            desc: "Symptoms, mobility, sensitivity, colour change, radiographic findings (root development, periapical status, resorption, ankylosis), and aesthetic concern." },
    { n: 3, title: "Recognise late sequelae",            desc: "Pulp necrosis (often months to years later), external inflammatory resorption, replacement resorption (ankylosis), discolouration, infraocclusion (ankylosed teeth), pulp canal obliteration." },
    { n: 4, title: "Manage sequelae promptly",            desc: "Endodontic treatment for pulp necrosis. Specialist referral for resorption or ankylosis. Bleaching or restoration for discolouration. Orthodontic input for infraocclusion in growing patients." },
    { n: 5, title: "Discharge appropriately",             desc: "After 5 years of stable follow-up, integrate into routine recall. Document the long-term plan including patient awareness of late sequelae." },
  ],

  decisionTable: {
    title: "Common Trauma Sequelae & Action",
    columns: ["Sequela", "Action"],
    rows: [
      ["Pulp necrosis",                       "Endodontic treatment (or apexification/regenerative endo for open apex)."],
      ["External inflammatory resorption",     "Specialist referral; endodontic intervention often needed urgently."],
      ["Replacement resorption / ankylosis",   "Monitor; discuss decoronation or planned extraction in growing patient; restorative replacement in adults."],
      ["Discolouration",                        "Bleaching (internal/external) or restorative camouflage; rule out resorption first."],
      ["Pulp canal obliteration",               "Monitor; intervention only if symptomatic or apical pathology develops."],
      ["Infraocclusion (ankylosed primary or permanent)", "Orthodontic/specialist input; decoronation if needed to preserve alveolar bone."],
    ],
  },

  safetyBox: {
    title: "Refer urgently if",
    items: [
      "Acute symptoms develop between scheduled reviews.",
      "Radiographic external inflammatory resorption is detected — time-critical.",
      "Pulp necrosis in an open-apex tooth — regenerative or apexification approach needed.",
      "Patient is lost to follow-up — proactively recall.",
      "Restoration of long-term outcome exceeds local restorative capability.",
    ],
  },

  minimumRecordSet: TRAU_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Trauma register maintained with follow-up dates.",
    "IADT-aligned schedule followed.",
    "Pulp and radiographic status recorded at each review.",
    "Sequelae managed promptly when identified.",
    "Patient informed of long-term monitoring needs.",
  ],

  clinicalSources: [
    TRAU_REF.iadtTrauma,
    TRAU_REF.dentalTraumaGuide,
    TRAU_REF.bspdTrauma,
    TRAU_REF.localOMFS,
  ],

  version: {
    ...TRAU_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IADT 2020 guidelines on follow-up of dental trauma, Dental Trauma Guide chairside support and BSPD paediatric trauma guidance. Requires Clinical Director review and local approval before live adoption.",
  },
};
