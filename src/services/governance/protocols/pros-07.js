/**
 * Prosthodontics Clinical Protocol — PROS-07
 * Implant Restoration & Prosthetic Workflow
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 * Restorative side of implant treatment only — surgical placement and
 * peri-implant disease management sit in the Implants & Oral Surgery
 * pack (IOS-08, IOS-09, IOS-10).
 */

import {
  PROS_CLINICAL_INTENT, PROS_LOCAL_SIGNOFF_NOTE, PROS_MINIMUM_RECORD_SET,
  PROS_VERSION_BASE, PROS_REF,
} from "./pros-common";

export const PROS_07 = {
  id: "doc-pros-07",
  reference: "PROS-07",
  packKey: "clinical_governance",
  category: "Prosthodontics",
  type: "sop",
  title: "Implant Restoration & Prosthetic Workflow",
  subtitle: "Restorative-driven planning, impression/scan, abutment selection, occlusion, cement-versus-screw retention and review.",

  clinicalIntent: PROS_CLINICAL_INTENT,
  localSignOffNote: PROS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients receiving implant-supported crowns, bridges or overdentures",
    frequency: "From restorative planning through fit and review",
    lead:      "Implant clinician (restorative)",
    evidence:  "Restorative plan, impression/scan, abutment/material details, torque and occlusion records",
  },

  standardLabel: "Implant-prosthetic standard",
  protocolStandard: "Implant restoration is prosthetically driven. The clinician must plan from the final restoration backwards through abutment to implant position, document component compatibility and traceability, and verify occlusion and prosthetic seating before discharge.",

  workflow: [
    { n: 1, title: "Confirm restorative-driven plan", desc: "Verify implant position and angulation are restoratively favourable. Coordinate with surgical clinician if placement is shared." },
    { n: 2, title: "Choose abutment and retention",    desc: "Select stock or custom abutment based on emergence, angulation and aesthetics. Decide cement versus screw retention by access, aesthetics and serviceability. Prefer screw retention where feasible." },
    { n: 3, title: "Capture impression / scan",         desc: "Use closed- or open-tray transfer, or intraoral scan with implant scan-bodies. Record implant system, platform and component reference numbers." },
    { n: 4, title: "Fit, torque and verify occlusion", desc: "Try in the abutment and restoration. Confirm marginal fit on radiograph for cemented restorations. Torque to the manufacturer's recommended value. Verify occlusion lighter than natural teeth in MIP and excursions." },
    { n: 5, title: "Issue maintenance plan",            desc: "Provide implant-specific hygiene advice and confirm baseline records for peri-implant monitoring (see IOS-10). Schedule first review at agreed interval." },
  ],

  safetyBox: {
    title: "Reassess before delivering the prosthesis if",
    items: [
      "Implant position is restoratively unfavourable and would require non-ideal compensation.",
      "Component compatibility (implant system, abutment, screw) is uncertain or undocumented.",
      "Cement could be inaccessible for removal in a cemented design — prefer screw retention.",
      "Occlusion cannot be planned lighter than natural teeth — risk of overload.",
      "The patient has not understood lifelong maintenance and possible component renewal.",
    ],
  },

  minimumRecordSet: PROS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Restorative plan recorded before/with surgical placement.",
    "Implant system, abutment and component lot numbers recorded.",
    "Cement-versus-screw retention rationale documented.",
    "Torque values and any radiographic seating check recorded.",
    "Maintenance schedule and baseline peri-implant records issued.",
  ],

  clinicalSources: [
    PROS_REF.sdcepImplantCare,
    PROS_REF.sdcepImplantMaint,
    PROS_REF.fgdpStandards,
    PROS_REF.mfrInstructions,
    PROS_REF.localImplantRef,
  ],

  version: {
    ...PROS_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from SDCEP implant care and maintenance guidance, FGDP/CGDent standards, manufacturer implant system instructions and local implant referral pathway. Requires Clinical Director review and local approval before live adoption.",
  },
};
