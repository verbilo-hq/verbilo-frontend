/**
 * Implants & Oral Surgery Clinical Protocol — IOS-09
 * Implant Placement, Grafting & Sinus-Lift Protocol
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-09, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_09 = {
  id: "doc-ios-09",
  reference: "IOS-09",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Implant Placement, Grafting & Sinus-Lift Protocol",
  subtitle: "Aseptic surgical setup, implant placement workflow, torque/stability records, graft materials, sinus precautions, suturing, and review.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Implant placement, bone grafting, socket preservation and sinus-lift procedures provided or assisted by the practice",
    frequency: "At implant surgery and follow-up visits",
    lead:      "Implant clinician with trained surgical team",
    evidence:  "Surgical plan, implant/graft details, stability, complications and review recorded",
  },

  standardLabel: "Implant-surgery standard",
  protocolStandard: "Implant and graft surgery should be delivered only by appropriately trained clinicians with suitable facilities, aseptic setup, equipment, nursing support and complication management pathways. If grafting or sinus work is not within local competence, the protocol should operate as a referral and shared-care pathway.",

  workflow: [
    { n: 1, title: "Prepare the surgical setup",            desc: "Confirm patient, site, consent, medical history, imaging, surgical guide, implant system, graft materials, sterile field, suction, irrigation, torque driver and emergency plan." },
    { n: 2, title: "Perform a surgical pause",               desc: "Confirm implant site, component sizes, planned depth/angulation, anatomical risks, antibiotic/analgesic plan where indicated and post-operative review." },
    { n: 3, title: "Place implant or graft as planned",      desc: "Use the planned flap or flapless approach, osteotomy sequence, irrigation, depth/angulation checks and graft or membrane technique within training and manufacturer guidance." },
    { n: 4, title: "Record primary stability and materials", desc: "Document implant brand, dimensions, lot numbers, insertion torque or stability measure, graft/membrane details, healing components and any deviations." },
    { n: 5, title: "Close, advise and review",                desc: "Secure haemostasis, sutures, post-operative instructions, medication advice, review interval, suture removal and loading/restoration timetable." },
  ],

  safetyBox: {
    title: "Intra-operative escalation triggers",
    items: [
      "Insufficient primary stability or unexpected bone defect requiring change in plan.",
      "Sinus membrane tear, suspected nerve proximity, uncontrolled bleeding or patient instability.",
      "Contamination of sterile components or breakdown of aseptic field.",
      "Implant positioned outside the prosthetic plan or close to anatomical structures.",
      "Graft/sinus procedure becomes more complex than consented or within competence.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Surgical pause and site confirmation recorded.",
    "Implant/graft component details and lot numbers recorded.",
    "Insertion torque/stability and any complications recorded.",
    "Sutures, medication and aftercare recorded.",
    "Review, loading and restorative plan recorded.",
  ],

  clinicalSources: [
    IOS_REF.mfrImplantSystem,
    IOS_REF.gdcCompetenceSafety,
    IOS_REF.practiceIPCDecon,
    IOS_REF.localImplantGov,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to manufacturer implant system instructions, GDC Standards on competence and patient safety, and the practice's IPC and implant governance policies.",
  },
};
