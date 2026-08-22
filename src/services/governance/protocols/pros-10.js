/**
 * Prosthodontics Clinical Protocol — PROS-10
 * Prosthetic Failure, Repair & Maintenance
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_10 = {
  id: "doc-pros-10",
  reference: "PROS-10",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Prosthetic Failure, Repair & Maintenance",
  subtitle: "Recementation, repair, replacement, technical complications and the maintenance pathway for crowns, bridges, dentures and implant prostheses.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients presenting with a failed, fractured, loose or worn prosthesis",
    frequency: "At urgent contact, review and at recall",
    lead:      "Dentist (laboratory liaison for repair work)",
    evidence:  "Failure mode, repair/replace decision, lab traceability and updated maintenance plan",
  },

  standardLabel: "Prosthetic-failure standard",
  protocolStandard: "Prosthetic failures must be assessed for failure mode and underlying cause, not just managed as a symptom. Repair is preferred where the prosthesis is otherwise sound; replacement must be justified, consented and supported by an updated maintenance plan to prevent recurrence.",

  workflow: [
    { n: 1, title: "Diagnose the failure mode",         desc: "Identify the failure (cementation, fracture, marginal failure, occlusal overload, peri-implant disease, denture trauma) and the underlying cause (caries, parafunction, periodontal change, prosthetic design flaw)." },
    { n: 2, title: "Stabilise the patient",              desc: "Remove sharp edges, re-cement where appropriate as a temporary measure, control symptoms, protect soft tissues and airway. Avoid 'patch jobs' that complicate later definitive work." },
    { n: 3, title: "Decide repair, replace or refer",    desc: "Repair where the bulk of the prosthesis is sound. Replace where structural or biological failure makes repair impractical. Refer for complex implant or aesthetic cases beyond local competence." },
    { n: 4, title: "Document with lab traceability",     desc: "If a lab-made repair or remake is needed, send appropriate records (impressions, components, photographs) and document component traceability per MHRA medical devices regulations." },
    { n: 5, title: "Update maintenance and risk plan",   desc: "Address the underlying cause — caries control, occlusal review, splint therapy, peri-implant hygiene, denture care — to reduce recurrence. Confirm review interval." },
  ],

  decisionTable: {
    title: "Failure-Mode Decision Guide",
    columns: ["Failure mode", "Recommended action"],
    rows: [
      ["De-cementation of an otherwise sound crown",        "Investigate cause (caries, marginal failure), clean and re-cement with appropriate luting agent."],
      ["Marginal failure with secondary caries",            "Caries removal, restorability review, repair or replacement depending on extent."],
      ["Fractured porcelain on an otherwise intact crown",   "Intraoral repair where small and accessible; replacement where load or aesthetics require it."],
      ["Loose abutment screw on implant prosthesis",         "Retighten to manufacturer torque after checking occlusion and screw condition; replace screw if fatigued."],
      ["Implant-prosthesis with progressive peri-implant disease","Refer to peri-implant disease management (IOS-10) and reassess prosthetic design."],
      ["Denture fracture",                                    "Laboratory repair; assess fit and occlusion; consider new denture if fit is otherwise unsatisfactory."],
      ["Recurrent fracture / repeated failure",              "Reassess design, materials, occlusal load and patient parafunction before further repair."],
    ],
  },

  safetyBox: {
    title: "Refer or replace — do not keep repairing — if",
    items: [
      "Failure is recurrent and the underlying cause has not been addressed.",
      "The prosthesis is no longer restorable to a safe standard.",
      "Peri-implant or periodontal disease is progressive and prosthetic-driven.",
      "Lab traceability has been lost and component compatibility cannot be confirmed.",
      "Patient expectations cannot be safely met by further repair attempts.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Failure mode and underlying cause recorded.",
    "Repair-versus-replace rationale documented.",
    "Lab traceability and components recorded where applicable.",
    "Maintenance plan updated to address the cause.",
    "Recurrent failures triaged at clinical governance meetings.",
  ],

  clinicalSources: [
    PROS_REF.fgdpStandards,
    PROS_REF.bsspdDentures,
    PROS_REF.sdcepImplantMaint,
    PROS_REF.mhraDevices,
    PROS_REF.gdcOpenness,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent standards, BSSPD denture guidance, SDCEP implant maintenance guidance, MHRA medical devices regulations and GDC Standards on openness. Requires Clinical Director review and local approval before live adoption.",
  },
};
