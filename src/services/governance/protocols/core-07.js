/**
 * Core Clinical Protocol — CORE-07
 * Radiography — Selection and Justification
 *
 * Anchored to: IR(ME)R 2017 + 2024 Amendment Regulations; CGDent/FGDP
 * Selection Criteria for Dental Radiography (3rd ed.); CQC Reg 12.
 *
 * Scope: this protocol covers the *clinical justification* decision-making
 * — when to take what view, when not to expose. The operational
 * Radiography & IR(ME)R Governance pack covers Employer's Procedures,
 * Local Rules, equipment QA, operator entitlement and image-quality audit.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_07 = {
  id: "doc-core-07",
  reference: "CORE-07",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Radiography — Selection and Justification",
  subtitle: "When to take what view, when not to expose, ALARP, justification per IR(ME)R, and the five-question justification flow.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All radiographic exposures (intraoral, OPG, CBCT) for every patient",
    frequency: "Every exposure",
    lead:      "IR(ME)R Practitioner; operator under written authorisation",
    evidence:  "Justification recorded in patient notes; annual image-quality audit",
  },

  standardLabel: "Justification standard",
  protocolStandard: "Every radiographic exposure must be justified by an IR(ME)R Practitioner as showing net benefit, taking into account the diagnostic question, alternative methods, the patient's risk factors and the smallest field / lowest dose consistent with diagnostic quality. Selection of view must follow CGDent/FGDP Selection Criteria for Dental Radiography 3rd ed.",

  workflow: [
    { n: 1, title: "Is the clinical question clear?",       desc: "What specific diagnostic question am I trying to answer? Could a clinical test (vitality, palpation, percussion, probing) answer it without radiation? Has a recent radiograph already answered it?" },
    { n: 2, title: "Will the result change management?",    desc: "If the result is positive, what will I do differently? If negative, what will I do differently? If neither answer changes the plan — the exposure is not justified." },
    { n: 3, title: "Is this the right view?",                desc: "Smallest dose, smallest field, lowest resolution that answers the question. BW vs PA vs OPT vs CBCT — choose the lowest reasonable option. CBCT only where 2D is inconclusive and the result will alter management." },
    { n: 4, title: "Patient-specific factors checked",      desc: "Pregnancy (ask all women of childbearing potential, document), paediatric considerations, cumulative recent imaging history, special-care considerations, capacity if relevant." },
    { n: 5, title: "Authorise, optimise, record",           desc: "Practitioner authorises. Operator carries out with ALARP — smallest field, lowest mA/kVp consistent with quality. Record: clinical question, justification, view, settings, grade (A/N), and report findings in the notes." },
  ],

  safetyBox: {
    title: "When not to expose",
    items: [
      "Routine 6-monthly BW for low-risk adults — not justified by caries-risk evidence.",
      "Routine screening of asymptomatic teeth without a question.",
      "OPT as a substitute for BW or PA for caries / apical assessment — resolution insufficient.",
      "Pre-orthodontic lateral cephalogram in straightforward camouflage cases (BOS guidance).",
      "CBCT as first-line — must be after 2D where appropriate and where the result will change management.",
      "Repeat imaging recently performed elsewhere — request copies first.",
    ],
  },

  minimumRecordSet: [
    "Clinical question driving the exposure.",
    "Justification recorded by the IR(ME)R Practitioner.",
    "View(s) taken, exposure settings, operator.",
    "Pregnancy / paediatric / special-care considerations.",
    "Grade of resulting image (A / N).",
    "Report — findings and impact on the treatment plan.",
    "Repeat exposure if any — clinical rationale documented.",
  ],

  auditPrompts: [
    "Is every exposure recorded with a clinical question and justification?",
    "Is the smallest reasonable view selected?",
    "Is the image grade A in ≥ 95% of exposures (annual audit)?",
    "Is the repeat-exposure rate tracked per operator?",
    "For CBCT — is SEDENTEXCT-trained practitioner involved and the whole-volume reported?",
    "Are pregnant patients asked and documented?",
  ],

  clinicalSources: [
    CORE_REF.irmer2017,
    CORE_REF.fgdpRadiography,
    CORE_REF.cqcReg12,
    CORE_REF.govRadiography,
    CORE_REF.chairsideRadiograph,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — radiography selection and justification protocol per IR(ME)R 2017+2024 and CGDent/FGDP Selection Criteria 3rd ed.",
  },
};
