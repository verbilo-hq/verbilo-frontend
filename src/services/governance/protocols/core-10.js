/**
 * Core Clinical Protocol — CORE-10
 * Infection Risk — Clinical IPC Quick Guidance
 *
 * Anchored to: HTM 01-05; CQC Reg 12; CGDent IPC guidance; PHE BBV
 * exposure management; HSE Sharps Regulations 2013.
 *
 * Scope: this protocol covers the *clinical* IPC decisions made at the
 * chair — patient discloses BBV / TB, suspected airborne respiratory
 * infection, exposure incident, contamination breach, single-use vs
 * reusable item judgement. The operational HTM 01-05 SOPs (decon
 * room workflow, sterilizer testing, water-line management) live in
 * the Decontamination & IPC Governance pack.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_10 = {
  id: "doc-core-10",
  reference: "CORE-10",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Infection Risk — Clinical IPC Quick Guidance",
  subtitle: "Clinical decisions at the chair — BBV-disclosure, suspected respiratory infection, exposure incident, contamination breach, single-use judgement.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Every clinician at every chairside encounter where infection risk is identified or arises",
    frequency: "Every relevant clinical event",
    lead:      "Treating clinician; IPC Lead consulted for any exposure / contamination breach",
    evidence:  "Incident record where exposure / breach; clinical record where decision affects care",
  },

  standardLabel: "Clinical IPC standard",
  protocolStandard: "Standard infection prevention precautions are applied to every patient. Additional precautions follow risk assessment — but no patient is refused or stigmatised on the basis of BBV / infectious status alone. Sharps and contamination incidents are managed using the practice's exposure pathway and reported per RIDDOR where required.",

  workflow: [
    { n: 1, title: "Standard precautions every patient",   desc: "Hand hygiene per WHO 5 Moments. Procedure-appropriate PPE (gloves, mask Type IIR, eye protection; FFP2/3 + visor for AGPs). Decontamination per HTM 01-05. Surfaces wiped between patients. Sharps disposed at point of use." },
    { n: 2, title: "Patient discloses BBV / infectious status", desc: "Continue to provide routine dental care — do not refuse, do not schedule end-of-day. Universal precautions are sufficient for routine treatment. Document the disclosure factually. Confidentiality is paramount." },
    { n: 3, title: "Suspected respiratory infection",       desc: "Screen at booking and arrival (cough, fever, recent contacts). Defer elective treatment for active respiratory illness. Urgent care: provide with appropriate respiratory PPE; minimise AGPs; consider deferral or alternative venue if feasible." },
    { n: 4, title: "Exposure incident (sharps / splash)",  desc: "Immediate first aid (bleed under cold water; do not suck / scrub; eye / mucous-membrane splash — irrigate). Risk-assess the exposure. Escalate to Occupational Health / A&E within 1 hour for HIV PEP consideration. Document on the practice sharps register. RIDDOR notification if applicable." },
    { n: 5, title: "Contamination / sterility breach",     desc: "Quarantine the affected load / area. Re-process or replace the equipment. Investigate cause (cycle failure, breach of seal, dropped tray, etc.). Open an incident in the CQC Compliance Hub. Notify patients if there is risk of cross-contamination — Duty of Candour applies." },
    { n: 6, title: "Single-use vs reusable judgement",     desc: "Single-use items are never re-processed (manufacturer label + HTM 01-05). Reusable items follow the validated decontamination cycle. Where uncertainty exists — single-use." },
  ],

  safetyBox: {
    title: "Do not",
    items: [
      "Refuse treatment to a patient solely on the basis of BBV / infectious status disclosure — this is unlawful discrimination.",
      "Re-process single-use items.",
      "Recap needles using two hands. Single-handed scoop or safety device only.",
      "Continue using equipment where a cycle has failed — quarantine until investigated.",
      "Delay PEP for HIV exposure — the window is ≤ 72 h, ideally < 1 h.",
      "Hide a contamination breach — full disclosure to the affected patient (Duty of Candour) and to the team for learning.",
    ],
  },

  minimumRecordSet: [
    "Patient disclosure of BBV / infectious status (factual, in the medical history, not flagged stigmatising).",
    "Risk assessment for any treatment modification.",
    "Sharps / exposure incident — first aid, escalation, follow-up.",
    "Contamination breach — affected items, quarantine, patient notification, Duty of Candour.",
    "RIDDOR notification reference if applicable.",
  ],

  auditPrompts: [
    "Is BBV disclosure documented without affecting access to routine care?",
    "Are sharps incidents reported and managed within the 1-hour PEP window?",
    "Is RIDDOR notification considered for relevant exposures?",
    "Are contamination breaches investigated and Duty of Candour considered?",
    "Is the team aware that refusing care on BBV grounds alone is unlawful?",
    "Is hand hygiene audit (WHO 5 Moments) compliant ≥ 95%?",
  ],

  clinicalSources: [
    CORE_REF.htm0105,
    CORE_REF.pheBbvExposure,
    CORE_REF.ridor2013,
    CORE_REF.cqcReg12,
    CORE_REF.govDecon,
    CORE_REF.chairsideDecon,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — clinical IPC decision-making at the chair, including BBV disclosure, exposure incidents and contamination breaches, with cross-references to the Decontamination & IPC pack.",
  },
};
