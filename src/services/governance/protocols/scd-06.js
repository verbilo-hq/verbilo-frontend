/**
 * Special Care Dentistry Clinical Protocol — SCD-06
 * Sedation / GA Referral Pathway for Special Care
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  SCD_CLINICAL_INTENT, SCD_LOCAL_SIGNOFF_NOTE, SCD_MINIMUM_RECORD_SET,
  SCD_VERSION_BASE, SCD_REF,
} from "./scd-common";

export const SCD_06 = {
  id: "doc-scd-06",
  reference: "SCD-06",
  packKey: "clinical_governance",
  category: "Special Care",
  type: "sop",
  title: "Sedation / GA Referral Pathway for Special Care",
  subtitle: "Threshold for sedation or GA referral, joint care planning with the SCD service and post-referral support.",

  clinicalIntent: SCD_CLINICAL_INTENT,
  localSignOffNote: SCD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with additional needs whose treatment cannot be safely delivered in conventional general practice",
    frequency: "At decision point and at follow-up post-treatment",
    lead:      "Treating dentist (referrer) with specialist SCD service as receiver",
    evidence:  "Referral letter, treatment plan, capacity record, post-treatment review",
  },

  standardLabel: "SCD-referral standard",
  protocolStandard: "Sedation or GA referral must be considered when the patient cannot tolerate care in conventional practice, when treatment complexity exceeds local capability or when delaying treatment would compromise welfare. The referral must include capacity considerations and the agreed best-interest plan where applicable.",

  workflow: [
    { n: 1, title: "Identify the referral trigger", desc: "Anxiety/behaviour beyond local management, capacity needs, medical complexity, treatment complexity, the need for multiple procedures in a single session, or domiciliary/specialist setting requirements." },
    { n: 2, title: "Discuss with the patient and supporter", desc: "Explain why specialist care is being recommended, what to expect, the alternatives and the patient's role. Use accessible communication." },
    { n: 3, title: "Prepare a clear referral",        desc: "Use the local SCD pathway. Include medical history, capacity record (per SCD-02), best-interest decision if applicable, dental findings, planned treatment, patient/carer preferences and consent for referral." },
    { n: 4, title: "Maintain continuity",              desc: "Keep the patient on the practice books for prevention, recall and routine care where possible. Coordinate with the SCD service rather than discharging." },
    { n: 5, title: "Post-treatment review",            desc: "On receipt of the SCD service report, review the patient. Reinforce prevention. Plan follow-up dental care in primary care where appropriate; re-refer for next major intervention." },
  ],

  safetyBox: {
    title: "Same-day urgent referral if",
    items: [
      "Acute pain or infection cannot be managed in general practice and the patient cannot wait for routine referral.",
      "Safeguarding concern requires same-day escalation alongside dental care.",
      "Medical condition is decompensating and dental treatment is contributing.",
      "MRONJ or similar complication is suspected post-extraction.",
      "The patient is at imminent risk if treatment is not delivered.",
    ],
  },

  minimumRecordSet: SCD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Referral triggers documented per case.",
    "Capacity assessment included in referral if applicable.",
    "Patient/carer discussion documented.",
    "Continuity of care maintained — patient not discharged.",
    "Post-referral review recorded.",
  ],

  clinicalSources: [
    SCD_REF.bsdhStandards,
    SCD_REF.nhseSpecialCare,
    SCD_REF.mcaCodeOfPractice,
    SCD_REF.localSCD,
    SCD_REF.gdcDiscrimination,
  ],

  version: {
    ...SCD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSDH Standards in Special Care Dentistry, NHS England commissioning standards for special care dental services, MCA Code of Practice and the practice's local SCD referral pathway. Requires Clinical Director review and local approval before live adoption.",
  },
};
