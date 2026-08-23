/**
 * Special Care Dentistry Clinical Protocol — SCD-03
 * Access, Mobility & Treatment Adaptations
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  SCD_CLINICAL_INTENT, SCD_LOCAL_SIGNOFF_NOTE, SCD_MINIMUM_RECORD_SET,
  SCD_VERSION_BASE, SCD_REF,
} from "./scd-common";

export const SCD_03 = {
  id: "doc-scd-03",
  reference: "SCD-03",
  packKey: "clinical_governance",
  category: "Special Care",
  type: "sop",
  title: "Access, Mobility & Treatment Adaptations",
  subtitle: "Wheelchair access, transfers, sensory adaptations, treatment positioning and reasonable adjustments under the Equality Act.",

  clinicalIntent: SCD_CLINICAL_INTENT,
  localSignOffNote: SCD_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with mobility, sensory or environmental access needs",
    frequency: "At pre-visit planning and at every appointment",
    lead:      "Practice team (dentist + nurse + reception)",
    evidence:  "Pre-visit communication, adjustments made, treatment positioning, patient feedback",
  },

  standardLabel: "Access standard",
  protocolStandard: "The practice must make reasonable adjustments per the Equality Act 2010 to ensure patients with mobility, sensory or environmental needs can access and benefit from dental care. Adjustments must be planned in advance where possible and adapted on the day.",

  workflow: [
    { n: 1, title: "Identify needs in advance",     desc: "Use the practice accessibility register or pre-visit questionnaire. Confirm wheelchair access, transfer needs, sensory adjustments, support person, communication preferences." },
    { n: 2, title: "Prepare the environment",        desc: "Allow extra appointment time. Use a quiet time of day if helpful. Prepare ramps, hoists, or accessible chair as appropriate. Brief the team on the patient's needs." },
    { n: 3, title: "Plan transfers safely",          desc: "Discuss patient preference (treat in own wheelchair, transfer to dental chair, treat in seated position). Use safe-transfer technique with carers. Document any safe-moving-and-handling considerations." },
    { n: 4, title: "Adapt treatment",                 desc: "Use modifications such as bite blocks, finger guards, mouth props (with caution), shorter appointments split across visits, breaks, sensory tools (weighted blanket, ear defenders, sunglasses) as appropriate." },
    { n: 5, title: "Review and document",             desc: "Note what worked, what didn't, and adjust the plan for next visit. Update the accessibility register. Provide written feedback to carers/supporters if helpful." },
  ],

  safetyBox: {
    title: "Defer or refer to specialist SCD service if",
    items: [
      "Practice access cannot accommodate the patient's needs safely.",
      "Treatment cannot be delivered safely with the available adjustments.",
      "Domiciliary visit is needed and not available locally.",
      "Hoist or specialist equipment is required and not in place.",
      "Safe transfer cannot be achieved with available staff and family.",
    ],
  },

  minimumRecordSet: SCD_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Accessibility register maintained and used.",
    "Reasonable adjustments documented per visit.",
    "Safe-moving-and-handling assessment recorded.",
    "Treatment adaptations recorded and reviewed.",
    "Patient/carer feedback recorded.",
  ],

  clinicalSources: [
    SCD_REF.equalityAct,
    SCD_REF.bsdhStandards,
    SCD_REF.nhseSpecialCare,
    SCD_REF.practiceAccess,
  ],

  version: {
    ...SCD_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from the Equality Act 2010, BSDH Standards in Special Care Dentistry, NHS England commissioning standards and the practice's accessibility statement. Requires Clinical Director review and local approval before live adoption.",
  },
};
