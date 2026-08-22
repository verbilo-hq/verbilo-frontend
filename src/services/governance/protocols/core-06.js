/**
 * Core Clinical Protocol — CORE-06
 * Safeguarding — Recognition and Escalation
 *
 * Anchored to: Care Act 2014; Children Act 1989/2004; Working Together to
 * Safeguard Children; CQC Reg 13; GDC Standards (safeguarding training
 * Level 2 minimum for clinical staff, Level 3 for safeguarding leads).
 *
 * Scope: this protocol covers *clinical recognition* and the immediate
 * *escalation pathway* at the point of suspicion. The operational
 * Safeguarding Governance pack covers lead role descriptions, LASH/LADO
 * contacts, training matrix and annual safeguarding report.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_06 = {
  id: "doc-core-06",
  reference: "CORE-06",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Safeguarding — Recognition and Escalation",
  subtitle: "Recognising safeguarding indicators in adults and children at the chair, immediate escalation to the Safeguarding Lead, and statutory referral routes.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Every patient — adults and children — at every clinical encounter",
    frequency: "Continuous awareness; documented action on every suspicion",
    lead:      "Safeguarding Lead per site; deputy when Lead unavailable",
    evidence:  "Safeguarding concern record, escalation pathway log, training matrix",
  },

  standardLabel: "Safeguarding standard",
  protocolStandard: "Every clinical team member must recognise safeguarding indicators in adults and children, act on suspicion, escalate to the practice Safeguarding Lead the same working day, and follow the statutory referral pathway (local authority safeguarding hub / MASH for children; adult social care safeguarding team for adults; police for immediate risk). Safeguarding is everyone's responsibility — clinical staff cannot delegate the duty to refer.",

  workflow: [
    { n: 1, title: "Recognise potential indicators", desc: "Children: unexplained injuries, dental neglect (rampant caries, missed appointments — see CORE-12), disclosure, parent behaviour. Adults: physical injury inconsistent with explanation, neglect, financial / sexual / emotional abuse indicators, vulnerability (learning disability, mental health, age). FGM (girls under 18) — statutory mandatory reporting." },
    { n: 2, title: "Listen and reassure",           desc: "If disclosure occurs: listen without leading, reassure the patient they were right to tell you, do not promise confidentiality, document verbatim where possible." },
    { n: 3, title: "Same-day internal escalation",  desc: "Inform the practice Safeguarding Lead the same working day. If Lead unavailable, contact the Deputy. Document the conversation, time and decision." },
    { n: 4, title: "Statutory referral if indicated", desc: "Children: refer to local authority safeguarding hub / MASH per local pathway. Adults: refer to adult social care safeguarding team. Immediate risk: dial 999 / police. FGM in girls under 18: police 101 (mandatory)." },
    { n: 5, title: "Information sharing",            desc: "Share information proportionate to the safeguarding need. Confidentiality is not a bar to safeguarding referral. Document what was shared, with whom, when, and the reason." },
    { n: 6, title: "Record contemporaneously",       desc: "Factual record of what was observed / disclosed / done — separate from routine clinical notes if local policy requires. Patient record flagged appropriately." },
    { n: 7, title: "Follow up",                       desc: "Confirm referral was received. Re-screen at next visit. Reasonable adjustments and patient communication plan documented." },
  ],

  safetyBox: {
    title: "Statutory and immediate-action items",
    items: [
      "FGM in girls under 18 — mandatory police notification (Serious Crime Act 2015).",
      "Immediate risk of harm — 999 / police, do not delay for internal escalation.",
      "Domestic abuse disclosure — IRIS referral pathway where available; safe communication plan agreed.",
      "Children who fail to attend repeatedly — consider dental neglect (see CORE-12); escalate as safeguarding.",
      "Adults at risk who fail to attend repeatedly — consider safeguarding under Care Act 2014.",
      "Confidentiality does not override safeguarding duty.",
    ],
  },

  minimumRecordSet: [
    "Observation / disclosure recorded verbatim where possible.",
    "Date, time, location, persons present.",
    "Internal escalation — Lead consulted, time, decision.",
    "Statutory referral — who, when, reference number.",
    "Information shared and rationale.",
    "Follow-up actions and review.",
  ],

  auditPrompts: [
    "Is every clinical staff member trained to Safeguarding Level 2 (clinical) / Level 3 (Lead) and current?",
    "Are LASH / LADO / adult safeguarding contacts current per site?",
    "Are safeguarding concerns logged and reviewed?",
    "Are dental-neglect referrals (children with repeat FTAs) raised?",
    "Is the annual safeguarding report produced for the Clinical Director?",
    "Is the Safeguarding Lead role visibly assigned and supported at each site?",
  ],

  clinicalSources: [
    CORE_REF.careAct,
    CORE_REF.childrenAct,
    CORE_REF.workingTogether,
    CORE_REF.cqcReg13,
    CORE_REF.gdcSafety,
    CORE_REF.govSafeguarding,
    CORE_REF.bspdNeglect,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — safeguarding clinical recognition and escalation pathway, anchored to Care Act 2014, Children Act, CQC Reg 13 and the practice's Safeguarding Governance pack.",
  },
};
