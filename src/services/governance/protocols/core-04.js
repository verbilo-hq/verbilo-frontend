/**
 * Core Clinical Protocol — CORE-04
 * Clinical Record Keeping
 *
 * Anchored to: FGDP/CGDent Clinical Examination and Record-Keeping Good
 * Practice Guidelines; GDC Standards Principle 4; CQC Reg 17 (good
 * governance). Record-keeping is one of the most-inspected items at
 * dental CQC inspections.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_04 = {
  id: "doc-core-04",
  reference: "CORE-04",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Clinical Record Keeping",
  subtitle: "What must be recorded at every clinical encounter — history, examination, diagnosis, consent, treatment, advice, follow-up.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Every clinician at every clinical encounter — examination, treatment, telephone advice, urgent care",
    frequency: "Every patient contact",
    lead:      "Treating clinician; audited by Clinical Director / Governance Lead",
    evidence:  "Patient record + annual Record-Keeping Audit",
  },

  standardLabel: "Record-keeping standard",
  protocolStandard: "Every clinical encounter must be recorded contemporaneously, signed and dated, in a way that another clinician taking over could understand what was done and why. Records support continuity of care, governance, complaints / legal defence and audit. FGDP/CGDent Clinical Examination and Record-Keeping Good Practice Guidelines is the reference standard.",

  workflow: [
    { n: 1, title: "Medical history confirmed / updated", desc: "Verify medical history at every visit. Document any change, new medication, allergy or hospitalisation. Verbal updates require contemporaneous note." },
    { n: 2, title: "Examination findings",                desc: "Intra- and extra-oral examination findings recorded. Periodontal screening (BPE / 6-point chart at intervals per BSP). Soft-tissue exam." },
    { n: 3, title: "Diagnosis and treatment plan",         desc: "State the diagnosis clearly (pulpal / periapical / periodontal / restorative / other). Treatment options discussed including no treatment. Risks, benefits and costs of each option." },
    { n: 4, title: "Consent process documented",           desc: "Capacity, options discussed, risks explained, costs (NHS / private status), questions answered, patient decision. Written consent for surgical / sedation / cosmetic procedures." },
    { n: 5, title: "Treatment delivered",                   desc: "What was done, who did it, materials used, anaesthetic given (agent, dose, batch where applicable), radiographs justified and graded, complications and how managed." },
    { n: 6, title: "Safety-netting and follow-up",         desc: "Advice given verbally / in writing. Review or follow-up arrangement. Any referral made and tracked." },
  ],

  safetyBox: {
    title: "Common record-keeping failures",
    items: [
      "Retrospective additions without timestamp / clinician identifier — alterations must be visible, dated and reasoned.",
      "Missing medical history update at the recall visit.",
      "No diagnosis recorded — only treatment.",
      "Consent recorded as 'pt consents' with no detail of what was discussed.",
      "Radiographs taken without recorded justification or grade.",
      "Telephone advice given but not documented.",
    ],
  },

  minimumRecordSet: [
    "Medical history confirmed / updated each visit.",
    "Intra- and extra-oral examination findings.",
    "Diagnosis (not just treatment).",
    "Consent discussion — options, risks, costs, patient decision.",
    "Treatment delivered with materials, anaesthetic, radiographs.",
    "Safety-netting advice, follow-up, referrals.",
  ],

  auditPrompts: [
    "Is medical history confirmed and updated at each visit?",
    "Are intra- and extra-oral findings recorded?",
    "Is a clinical diagnosis stated for every treatment delivered?",
    "Is the consent process documented (options, risks, costs)?",
    "Are radiographs justified and graded (A/N)?",
    "Are records made contemporaneously, signed and dated?",
    "Are any alterations visible, dated and reasoned?",
  ],

  clinicalSources: [
    CORE_REF.fgdpRecordKeeping,
    CORE_REF.gdcRecords,
    CORE_REF.cqcReg17,
    CORE_REF.dentalProtection,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — clinical record-keeping standard aligned to FGDP/CGDent good-practice guidelines and GDC Principle 4.",
  },
};
