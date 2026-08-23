/**
 * TMD & Occlusion Clinical Protocol — TMD-01
 * TMD Assessment & Diagnostic Workup
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  TMD_CLINICAL_INTENT, TMD_LOCAL_SIGNOFF_NOTE, TMD_MINIMUM_RECORD_SET,
  TMD_VERSION_BASE, TMD_REF,
} from "./tmd-common";

export const TMD_01 = {
  id: "doc-tmd-01",
  reference: "TMD-01",
  packKey: "clinical_governance",
  category: "TMD & Occlusion",
  type: "sop",
  title: "TMD Assessment & Diagnostic Workup",
  subtitle: "Structured TMD history, examination, classification per DC/TMD and the differential from odontogenic and referred pain.",

  clinicalIntent: TMD_CLINICAL_INTENT,
  localSignOffNote: TMD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with suspected TMD, jaw pain, joint sounds or related symptoms",
    frequency: "At presentation and at review",
    lead:      "Dentist with TMD competence (specialist orofacial pain referral if needed)",
    evidence:  "Structured history, examination, classification, imaging justification, plan",
  },

  standardLabel: "TMD-diagnosis standard",
  protocolStandard: "TMD must be assessed with a structured history and examination, classified using a validated framework (e.g. DC/TMD) and differentiated from odontogenic, referred and systemic causes of orofacial pain. Imaging is justified only where it will change management.",

  workflow: [
    { n: 1, title: "Take a structured pain history",  desc: "Site, onset, duration, quality, severity, triggers, relievers, impact on function and life, sleep, stress, parafunction, prior treatment. Use a pain diagram where helpful." },
    { n: 2, title: "Examine TMJ and muscles",          desc: "Inspection, palpation of TMJ and muscles of mastication, range of movement (vertical, lateral, protrusive), joint sounds (clicking, crepitus), deviation/deflection, occlusion." },
    { n: 3, title: "Rule out other causes",             desc: "Examine teeth, periodontium and occlusion to exclude odontogenic causes. Consider referred pain from cervical spine, sinus, ear, vascular and neurological causes." },
    { n: 4, title: "Classify the TMD",                   desc: "Use DC/TMD axis I — myalgia, arthralgia, disc displacement (with/without reduction), degenerative joint disease. Consider axis II (psychosocial impact) where pain is chronic." },
    { n: 5, title: "Plan management or referral",        desc: "Most TMD responds to conservative management (TMD-02). Refer to specialist orofacial pain service for persistent or atypical cases. Avoid irreversible treatment." },
  ],

  decisionTable: {
    title: "TMD Classification (DC/TMD axis I)",
    columns: ["Diagnosis", "Typical features"],
    rows: [
      ["Myalgia (masticatory muscle pain)",          "Pain on palpation of masseter/temporalis, modified by jaw function."],
      ["Arthralgia (TMJ pain)",                       "Pain over preauricular area, on palpation or function."],
      ["Disc displacement with reduction",             "Reproducible click on opening, +/- closing."],
      ["Disc displacement without reduction",          "Limited mouth opening (typically < 35 mm), pain, no click."],
      ["Degenerative joint disease (osteoarthritis)",  "Crepitus, age-related, joint pain, function affected."],
    ],
  },

  safetyBox: {
    title: "Refer if",
    items: [
      "Pain is persistent (>3 months) despite conservative management.",
      "Severe limitation of mouth opening or function.",
      "Suspected sinister pathology (rapid swelling, neurological signs, weight loss).",
      "Diagnostic uncertainty after structured assessment.",
      "Complex psychosocial features dominate the presentation.",
    ],
  },

  minimumRecordSet: TMD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Structured pain history recorded.",
    "Examination findings documented systematically.",
    "Other causes considered and ruled out.",
    "DC/TMD axis I classification recorded.",
    "Referral or management plan documented.",
  ],

  clinicalSources: [
    TMD_REF.niceCKSTMD,
    TMD_REF.rdcTMD,
    TMD_REF.rcsFDS,
    TMD_REF.fgdpStandards,
  ],

  version: {
    ...TMD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from NICE CKS on TMD, DC/TMD diagnostic criteria, RCS Faculty of Dental Surgery guidance and FGDP/CGDent standards. Requires Clinical Director review and local approval before live adoption.",
  },
};
