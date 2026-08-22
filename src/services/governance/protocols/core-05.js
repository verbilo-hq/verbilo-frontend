/**
 * Core Clinical Protocol — CORE-05
 * Consent and Capacity
 *
 * Anchored to: GDC Standards Principle 3 (Obtain valid consent); Mental
 * Capacity Act 2005 + Code of Practice; CQC Reg 11 (Need for consent);
 * Gillick competence / Fraser guidelines for under-16s.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_05 = {
  id: "doc-core-05",
  reference: "CORE-05",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Consent and Capacity",
  subtitle: "Valid consent (informed, voluntary, capacious), capacity assessment, best-interests decisions, Gillick competence and parental responsibility.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Every patient at every treatment decision",
    frequency: "Every clinical encounter where a treatment decision is made",
    lead:      "Treating clinician",
    evidence:  "Consent record in patient notes; written consent forms for surgical / sedation / cosmetic procedures",
  },

  standardLabel: "Consent standard",
  protocolStandard: "Consent must be valid (informed, voluntary, given by a person with capacity), proportionate to the treatment proposed, and documented. Capacity is decision-specific and time-specific (Mental Capacity Act 2005). For under-16s, Gillick competence applies; otherwise parental responsibility consents. For adults lacking capacity, best-interests decisions follow the MCA Code of Practice.",

  workflow: [
    { n: 1, title: "Assess capacity (decision-specific)",  desc: "Adults are presumed to have capacity unless evidenced otherwise. For each material decision, check: can the patient understand, retain, weigh and communicate? Lack of capacity for one decision does not mean lack of capacity for another." },
    { n: 2, title: "Provide the material information",     desc: "All material risks (any risk a reasonable person in the patient's position would attach significance to — Montgomery v Lanarkshire). Alternative options including no treatment. Costs (NHS / private). Time to consider where appropriate." },
    { n: 3, title: "Confirm understanding",                desc: "Ask the patient to explain back the key risks and what they have agreed to. Allow questions. Document understanding." },
    { n: 4, title: "Confirm voluntariness",                desc: "Decision is the patient's, free from undue pressure (clinical / family / financial). Where pressure suspected, pause." },
    { n: 5, title: "Document and obtain written consent where required", desc: "All consent discussions documented. Written consent for surgical procedures, sedation, cosmetic treatment, and any procedure with material risk profile." },
    { n: 6, title: "Re-consent for change of plan",        desc: "If the treatment plan, risks, costs or clinician change before / during treatment, consent must be re-confirmed." },
  ],

  safetyBox: {
    title: "Capacity and special situations",
    items: [
      "Children under 16: Gillick competence assessed for each decision. Where not competent, parental responsibility holder consents.",
      "16–17 year-olds: presumed competent (Family Law Reform Act 1969) but refusal may be overridden by court if life-threatening.",
      "Adults lacking capacity: best-interests decision following MCA Code of Practice. Document the assessment, persons consulted, and reasoning.",
      "Advance decisions to refuse treatment (ADRT): legally binding if valid and applicable.",
      "Lasting Power of Attorney (Health & Welfare): consult where one exists.",
      "Cosmetic / aesthetic treatments: heightened consent threshold — written, cooling-off period appropriate.",
      "Patients with limited English: trained interpreter (not family member) where decision is material.",
    ],
  },

  minimumRecordSet: [
    "Capacity considered (presumed unless otherwise indicated).",
    "Options discussed including no treatment.",
    "Material risks explained with examples specific to this patient.",
    "Alternatives considered.",
    "Costs and NHS / private status explained.",
    "Patient's questions and decision documented.",
    "Written consent where required (surgical / sedation / cosmetic).",
    "For under-16s or adults lacking capacity: full MCA / Gillick documentation.",
  ],

  auditPrompts: [
    "Is consent recorded for every clinical decision (not just signature on a form)?",
    "Are material risks documented specific to the patient and procedure?",
    "Are costs and NHS / private status discussed?",
    "For surgical / sedation / cosmetic — is written consent on file?",
    "For under-16s — is Gillick competence assessment documented where relevant?",
    "For adults lacking capacity — is the best-interests assessment documented?",
  ],

  clinicalSources: [
    CORE_REF.gdcConsent,
    CORE_REF.mentalCapacityAct,
    CORE_REF.cqcReg11,
    CORE_REF.gdcCommunication,
    CORE_REF.dentalProtection,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — consent and capacity standard aligned to GDC Principle 3, Mental Capacity Act 2005 and Montgomery test for material risk.",
  },
};
