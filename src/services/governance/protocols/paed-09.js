/**
 * Paediatric Dentistry Clinical Protocol — PAED-09
 * Behaviour Management, Anxiety & Inhalation Sedation Referral
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_09 = {
  id: "doc-paed-09",
  reference: "PAED-09",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "Behaviour Management, Anxiety & Inhalation Sedation Referral",
  subtitle: "Non-pharmacological behaviour support, recognising dental anxiety and referral thresholds for inhalation sedation / GA.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All children, with particular focus on anxious or pre-cooperative patients",
    frequency: "At every paediatric visit",
    lead:      "Dentist + dental nurse + supportive team",
    evidence:  "Behaviour-management approach, anxiety assessment, sedation/GA referral where indicated",
  },

  standardLabel: "Behaviour-management standard",
  protocolStandard: "Non-pharmacological behaviour management is the first-line approach for paediatric dentistry. Sedation and general anaesthesia are reserved for cases where evidence-based behaviour management has failed or where treatment urgency requires it.",

  workflow: [
    { n: 1, title: "Assess anxiety",                       desc: "Use age-appropriate observation or simple scales (e.g. MCDAS-f for older children). Discuss with parent. Record level of anxiety and any prior dental experience." },
    { n: 2, title: "Use non-pharmacological strategies",    desc: "Tell-show-do, modelling, positive reinforcement, distraction, voice control (where consented), systematic desensitisation. Adjust pace to the child." },
    { n: 3, title: "Plan in achievable steps",               desc: "Phase prevention-first appointments. Introduce instruments gradually. Match treatment intensity to current cooperation. Document progress between visits." },
    { n: 4, title: "Recognise when to escalate",             desc: "Persistent inability to cope, treatment urgency, multiple procedures or complex behavioural needs may indicate inhalation sedation, IV sedation (older children) or GA referral." },
    { n: 5, title: "Refer per local pathway",                 desc: "Use the local community / paediatric / sedation referral pathway. Document reasons, what has been tried, urgency and parental consent." },
  ],

  safetyBox: {
    title: "Refer rather than continue if",
    items: [
      "Behaviour management has failed across multiple visits and treatment is needed urgently.",
      "Severe anxiety / phobia is present and short-term reassurance is not changing the trajectory.",
      "Treatment plan is extensive and would benefit from a single GA visit rather than multiple distressing attempts.",
      "Special care needs make routine in-chair treatment unsafe (see SCD pack).",
      "Active restraint would be required to complete treatment — this is not appropriate practice; refer.",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Anxiety assessment recorded at first visit.",
    "Non-pharmacological strategies attempted before referral.",
    "Sedation/GA referral rationale documented.",
    "Parent/guardian engagement and consent documented.",
    "Progress tracked across visits.",
  ],

  clinicalSources: [
    PAED_REF.bspdGuidelines,
    PAED_REF.sdcepCaries,
    PAED_REF.localReferral,
    PAED_REF.gdcConsent,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSPD UK national clinical guidelines on behaviour management, SDCEP guidance and local sedation/community referral pathway. Requires Clinical Director review and local approval before live adoption.",
  },
};
