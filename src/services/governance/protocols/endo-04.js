/**
 * Endodontic Clinical Protocol — ENDO-04
 * Emergency Endodontic Care & Antimicrobial Stewardship
 *
 * Source: Endodontics Clinical Protocols pack, ENDO-04, reviewed May 2026,
 * version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  ENDO_CLINICAL_INTENT, ENDO_LOCAL_SIGNOFF_NOTE, ENDO_MINIMUM_RECORD_SET,
  ENDO_VERSION_BASE, ENDO_REF,
} from "./endo-common";

export const ENDO_04 = {
  id: "doc-endo-04",
  reference: "ENDO-04",
  packKey: "clinical_governance",
  category: "Endodontics",
  type: "sop",
  title: "Emergency Endodontic Care & Antimicrobial Stewardship",
  subtitle: "Irreversible pulpitis, acute apical periodontitis, abscess, drainage, analgesia, antibiotics, red flags, and urgent referral.",

  clinicalIntent: ENDO_CLINICAL_INTENT,
  localSignOffNote: ENDO_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Urgent dental pain, swelling and suspected endodontic infection",
    frequency: "At urgent presentation and follow-up",
    lead:      "Dentist",
    evidence:  "Diagnosis, local measures, prescribing rationale and safety-netting",
  },

  standardLabel: "Urgent-care standard",
  protocolStandard: "Emergency endodontic care should prioritise diagnosis, local dental treatment, pain control and safety-netting. Antibiotics are not a substitute for operative treatment and should only be used where there is evidence of spreading infection, systemic involvement or specific clinical indication.",

  workflow: [
    { n: 1, title: "Triage severity",                     desc: "Check swelling, fever, malaise, trismus, dysphagia, airway symptoms, immunosuppression and medical risk. Escalate urgently if red flags are present." },
    { n: 2, title: "Diagnose the source",                  desc: "Use history, examination, special tests and justified radiographs to distinguish pulpitis, acute apical periodontitis, abscess, periodontal disease, cracked tooth or non-odontogenic pain." },
    { n: 3, title: "Provide local measures where possible", desc: "Consider pulpotomy, pulpectomy, drainage, occlusal adjustment only where clinically justified, extraction or referral depending on diagnosis and restorability." },
    { n: 4, title: "Prescribe responsibly",                 desc: "Use analgesics and antibiotics only in line with current dental prescribing guidance, medical history and allergy status. Record the indication clearly." },
    { n: 5, title: "Safety-net and review",                 desc: "Provide written advice on expected symptoms, urgent return criteria, completion of definitive treatment and follow-up arrangements." },
  ],

  safetyBox: {
    title: "Red flags and escalation",
    items: [
      "Rapidly progressive swelling, floor-of-mouth swelling, difficulty breathing or swallowing, trismus, fever, malaise or dehydration requires urgent escalation.",
      "Do not prescribe antibiotics for irreversible pulpitis or localised apical disease without spreading/systemic features.",
      "If drainage cannot be achieved and infection is worsening, arrange urgent review or referral.",
      "Record the advice given if the patient declines definitive treatment.",
    ],
  },

  minimumRecordSet: ENDO_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Urgent diagnosis and severity assessment recorded.",
    "Local treatment provided or reason it was not possible recorded.",
    "Analgesic/antibiotic advice and indication recorded.",
    "Red-flag safety-netting recorded.",
    "Definitive treatment or referral plan recorded.",
  ],

  clinicalSources: [
    ENDO_REF.sdcepPrescribing,
    ENDO_REF.amrToolkit,
    ENDO_REF.besGoodPractice,
  ],

  version: {
    ...ENDO_VERSION_BASE,
    changeSummary: "Initial published version aligned to SDCEP Drug Prescribing, the UK dental antimicrobial stewardship toolkit and BES Guide to Good Endodontic Practice.",
  },
};
