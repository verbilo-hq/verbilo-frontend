/**
 * Trauma Management Clinical Protocol — TRAU-07
 * Paediatric Primary Tooth Trauma
 *
 * Provenance: drafted by Verbilo from IADT 2020 and BSPD guidance.
 * See PAED-07 for the paediatric-care overlay; this protocol details the
 * primary-dentition specifics.
 */

import {
  TRAU_CLINICAL_INTENT, TRAU_LOCAL_SIGNOFF_NOTE, TRAU_MINIMUM_RECORD_SET,
  TRAU_VERSION_BASE, TRAU_REF,
} from "./trau-common";

export const TRAU_07 = {
  id: "doc-trau-07",
  reference: "TRAU-07",
  packKey: "clinical_governance",
  category: "Trauma Management",
  type: "sop",
  title: "Paediatric Primary Tooth Trauma",
  subtitle: "Specific management of primary tooth injuries — protecting the developing permanent successor and supporting the child and family.",

  clinicalIntent: TRAU_CLINICAL_INTENT,
  localSignOffNote: TRAU_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Children with trauma to primary teeth",
    frequency: "Emergency presentation; follow-up tailored to injury",
    lead:      "Dentist with paediatric sensitivity (refer to specialist where indicated)",
    evidence:  "Injury type, treatment, follow-up, safeguarding consideration",
  },

  standardLabel: "Primary-trauma standard",
  protocolStandard: "Primary-tooth trauma must be managed with awareness of the underlying permanent successor. Avulsed primary teeth are NOT replanted. Repositioning of severely displaced primary teeth must consider risk to the developing germ. Safeguarding awareness applies at every paediatric trauma visit.",

  workflow: [
    { n: 1, title: "Assess child and family",            desc: "Use age-appropriate communication. Calm the family. Take a clear history and consider safeguarding triggers (inconsistent history, repeated injury, developmentally inappropriate mechanism)." },
    { n: 2, title: "Examine without distress",            desc: "Use a parent's lap or a knee-to-knee position for young children. Limit imaging to what's clinically necessary. Use lateral rather than periapical where possible." },
    { n: 3, title: "Apply primary-tooth principles",      desc: "Avulsion: DO NOT replant. Lateral luxation interfering with occlusion: gentle repositioning. Severe intrusion toward the permanent germ: extract. Crown fracture: smooth or restore as feasible." },
    { n: 4, title: "Parent advice",                       desc: "Explain expected appearance changes (discolouration, possible sinus, possible loss of vitality). Advise soft diet, no dummies on the affected side, gentle brushing. Tell the parent what to watch for." },
    { n: 5, title: "Follow up and safeguarding review",   desc: "Review at 1 week, 6–8 weeks, 1 year. Document safeguarding consideration. Refer per PAED-10 if concerns arise." },
  ],

  decisionTable: {
    title: "Primary Tooth Trauma Management",
    columns: ["Injury", "Action"],
    rows: [
      ["Avulsion",                                       "DO NOT replant. Reassure; review for permanent successor effects."],
      ["Crown fracture (uncomplicated)",                 "Smooth or restore with glass-ionomer/composite. Monitor."],
      ["Crown fracture (complicated, pulp exposed)",      "Pulpotomy if cooperative and restorable; extraction if not."],
      ["Lateral luxation (mild, no occlusal interference)", "Allow spontaneous repositioning. Soft diet."],
      ["Lateral luxation (severe, occlusal interference)", "Gentle repositioning or extraction depending on age and risk to permanent germ."],
      ["Intrusion (away from successor)",                  "Allow spontaneous re-eruption."],
      ["Intrusion (toward successor)",                      "Extraction — to protect the developing permanent tooth."],
    ],
  },

  safetyBox: {
    title: "Safeguarding considerations",
    items: [
      "Inconsistent history between caregivers or with developmental stage.",
      "Multiple injuries at different stages of healing.",
      "Delay in seeking treatment without reasonable explanation.",
      "Other signs of neglect or abuse — escalate per PAED-10.",
      "Document everything verbatim — these notes may be referred to later.",
    ],
  },

  minimumRecordSet: TRAU_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Age-appropriate communication recorded.",
    "Safeguarding consideration documented at every visit.",
    "Avulsion handled correctly (no replantation).",
    "Parent advice given on appearance changes and warning signs.",
    "Follow-up booked for permanent successor monitoring.",
  ],

  clinicalSources: [
    TRAU_REF.iadtTrauma,
    TRAU_REF.bspdTrauma,
    TRAU_REF.gdcChildSafety,
    TRAU_REF.dentalTraumaGuide,
  ],

  version: {
    ...TRAU_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IADT 2020 guidelines on primary dentition trauma, BSPD paediatric trauma guidance and GDC Standards on safeguarding children. Cross-references PAED-07 (paediatric overlay) and PAED-10 (safeguarding). Requires Clinical Director review and local approval before live adoption.",
  },
};
