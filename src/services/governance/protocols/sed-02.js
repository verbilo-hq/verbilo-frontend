/**
 * Sedation Clinical Protocol — SED-02
 * Sedation Consent & Pre-Operative Instructions
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (IACSD 2020).
 */

import {
  SED_CLINICAL_INTENT, SED_LOCAL_SIGNOFF_NOTE, SED_MINIMUM_RECORD_SET,
  SED_VERSION_BASE, SED_REF,
} from "./sed-common";

export const SED_02 = {
  id: "doc-sed-02",
  reference: "SED-02",
  packKey: "clinical_governance",
  category: "Sedation",
  type: "sop",
  title: "Sedation Consent & Pre-Operative Instructions",
  subtitle: "Specific consent for sedation, fasting, escort, pre-op instructions and written patient information.",

  clinicalIntent: SED_CLINICAL_INTENT,
  localSignOffNote: SED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients receiving conscious sedation",
    frequency: "Before sedation is prescribed and confirmed on the day",
    lead:      "Sedationist (dentist)",
    evidence:  "Specific consent for sedation, fasting confirmed, escort confirmed, written instructions issued",
  },

  standardLabel: "Sedation-consent standard",
  protocolStandard: "Consent for sedation is specific — separate from consent for the dental procedure. Pre-operative instructions must be issued in writing and confirmed verbally on the day, including fasting, escort, post-procedure responsibilities and what to do if the patient is unwell.",

  workflow: [
    { n: 1, title: "Take specific sedation consent",   desc: "Discuss benefits, risks (over-sedation, paradoxical reaction, partial recall, post-op nausea/drowsiness, slow recovery, anaesthetic emergency), alternatives. Record specific consent." },
    { n: 2, title: "Confirm fasting requirements",      desc: "Per IACSD 2020: clear fluids up to 2 hours before, no food for 6 hours before. Document fasting status on the day." },
    { n: 3, title: "Confirm escort",                    desc: "Responsible adult escort must collect the patient and stay with them for 24 hours. For children, parent/responsible adult throughout. Confirm transport arrangements." },
    { n: 4, title: "Issue written instructions",         desc: "Written patient information leaflet covering fasting, escort, medications, what to wear, how long to expect to be at the practice, and 24-hour post-op restrictions (no driving, no alcohol, no important decisions)." },
    { n: 5, title: "Reconfirm on the day",                desc: "Re-confirm consent, fasting, escort and any medical changes. Cancel if any item is not in order. Document the re-confirmation." },
  ],

  safetyBox: {
    title: "Cancel or defer sedation if",
    items: [
      "Fasting status is unclear or not met.",
      "Escort is not available or has not been briefed on responsibilities.",
      "Patient has not taken usual medications as advised.",
      "Patient has recent illness (respiratory infection, fever, vomiting).",
      "Patient has had alcohol or CNS depressants within 24 hours.",
    ],
  },

  minimumRecordSet: SED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Specific sedation consent recorded.",
    "Fasting status confirmed on the day.",
    "Escort details and 24-hour cover confirmed.",
    "Written instructions issued before the day.",
    "Pre-procedure check completed and recorded.",
  ],

  clinicalSources: [
    SED_REF.iacsd,
    SED_REF.gdcConsent,
    SED_REF.rcsFDS,
    SED_REF.niceConsciousSed,
  ],

  version: {
    ...SED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IACSD 2020 Standards for Conscious Sedation, GDC Standards on consent, RCS Faculty of Dental Surgery guidance and NICE CG112. Requires Clinical Director review and local approval before live adoption.",
  },
};
