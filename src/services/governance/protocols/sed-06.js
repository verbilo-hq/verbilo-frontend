/**
 * Sedation Clinical Protocol — SED-06
 * Recovery, Discharge & Sedation Complications
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance (IACSD 2020).
 */

import {
  SED_CLINICAL_INTENT, SED_LOCAL_SIGNOFF_NOTE, SED_MINIMUM_RECORD_SET,
  SED_VERSION_BASE, SED_REF,
} from "./sed-common";

export const SED_06 = {
  id: "doc-sed-06",
  reference: "SED-06",
  packKey: "clinical_governance",
  category: "Sedation",
  type: "sop",
  title: "Recovery, Discharge & Sedation Complications",
  subtitle: "Recovery monitoring, discharge criteria, post-operative advice, escort handover and the management of common sedation complications.",

  clinicalIntent: SED_CLINICAL_INTENT,
  localSignOffNote: SED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients recovering from conscious sedation",
    frequency: "After every sedation session and at the next review",
    lead:      "Sedationist with trained recovery support",
    evidence:  "Recovery observations, discharge criteria met, escort confirmed, written advice, any complication",
  },

  standardLabel: "Recovery-and-discharge standard",
  protocolStandard: "Patients must not be discharged from sedation until they meet documented discharge criteria. The escort must be briefed, written advice provided, and any complication recorded and managed before the patient leaves.",

  workflow: [
    { n: 1, title: "Recover in a dedicated area",         desc: "Continue clinical monitoring after the procedure. Allow time for sedation effects to wear off. For IV, typically 30–60 minutes monitoring; for inhalation, 5–10 minutes of 100% oxygen plus rest." },
    { n: 2, title: "Apply discharge criteria",              desc: "Patient must be fully responsive, oriented, mobile (or back to baseline), have stable observations, no nausea or vomiting, and a competent escort ready." },
    { n: 3, title: "Brief the escort",                       desc: "Confirm the escort understands their 24-hour responsibility — no driving, alcohol or important decisions for the patient; observation, food, drink and medications as instructed; emergency contact number." },
    { n: 4, title: "Provide written post-op advice",         desc: "Include expected drowsiness, partial amnesia, no driving / no alcohol / no decisions for 24h, pain control, what to do if symptoms develop, emergency contact." },
    { n: 5, title: "Manage complications",                   desc: "Document any over-sedation, paradoxical reaction, prolonged recovery, nausea, allergic reaction or other event. Review at clinical governance." },
  ],

  decisionTable: {
    title: "Sedation Complication Management",
    columns: ["Complication", "Action"],
    rows: [
      ["Over-sedation, respiratory depression",            "100% oxygen, support airway, flumazenil 200 mcg IV repeated as needed (for benzodiazepines)."],
      ["Paradoxical reaction (agitation)",                 "Supportive care, reduce stimulation, consider flumazenil if benzodiazepine."],
      ["Prolonged recovery / over-sedation",                "Continue monitoring, oxygen as needed, do not discharge until criteria met. Refer to A&E if not resolving."],
      ["Nausea or vomiting",                                "Position safely, antiemetic if needed (per practice formulary), continue observation."],
      ["Allergic reaction (rare)",                          "Follow practice medical emergency protocol; adrenaline if anaphylaxis."],
      ["Failed sedation (inadequate effect)",               "Abandon procedure safely, defer treatment, review technique choice for future."],
    ],
  },

  safetyBox: {
    title: "Do not discharge if",
    items: [
      "Patient is not fully responsive or oriented.",
      "Observations are not back to baseline (or acceptable post-op range).",
      "Escort is not present or has not been briefed.",
      "Patient cannot tolerate fluids without nausea.",
      "Any complication is unresolved.",
    ],
  },

  minimumRecordSet: SED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Recovery observations recorded.",
    "Discharge criteria met and documented.",
    "Escort briefed and signed acknowledgement where relevant.",
    "Written advice issued.",
    "Any complication reviewed at clinical governance.",
  ],

  clinicalSources: [
    SED_REF.iacsd,
    SED_REF.rcsFDS,
    SED_REF.rescusUK,
    SED_REF.practiceEmergency,
  ],

  version: {
    ...SED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IACSD 2020 Standards for Conscious Sedation, RCS Faculty of Dental Surgery guidance, Resuscitation Council UK standards and the practice's medical emergency protocol. Requires Clinical Director review and local approval before live adoption.",
  },
};
