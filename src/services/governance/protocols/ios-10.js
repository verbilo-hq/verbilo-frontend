/**
 * Implants & Oral Surgery Clinical Protocol — IOS-10
 * Implant Maintenance, Peri-Implant Disease & Referral
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-10, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_10 = {
  id: "doc-ios-10",
  reference: "IOS-10",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Implant Maintenance, Peri-Implant Disease & Referral",
  subtitle: "Baseline records, probing, radiographs, oral hygiene, peri-implant mucositis, peri-implantitis, recall intervals, and specialist referral.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients with dental implants, implant-supported crowns, bridges, overdentures or implant referrals",
    frequency: "At baseline, recall, maintenance visits and when peri-implant inflammation is suspected",
    lead:      "Dentist, hygienist/therapist within scope, implant clinician where required",
    evidence:  "Baseline measurements, maintenance advice, peri-implant status, radiographs and referral decisions recorded",
  },

  standardLabel: "Maintenance standard",
  protocolStandard: "Implants require lifelong maintenance and monitoring. The practice must record baseline information, assess peri-implant tissues gently, reinforce home care, identify peri-implant mucositis or peri-implantitis, and arrange risk-based recall or referral when disease persists or bone loss is progressive.",

  workflow: [
    { n: 1, title: "Establish baseline records",            desc: "Record implant site, restoration type, date placed if known, baseline radiograph where available, probing from fixed landmarks, bleeding/suppuration and plaque control." },
    { n: 2, title: "Assess risk at every maintenance visit", desc: "Review smoking, diabetes, history of periodontitis, plaque control, access for cleaning, prosthesis design, occlusion, parafunction and maintenance attendance." },
    { n: 3, title: "Provide implant-specific hygiene care",  desc: "Give tailored advice for interdental brushes, floss, superfloss, single-tuft brushes, water irrigators or prosthesis removal where appropriate." },
    { n: 4, title: "Identify disease pattern",                desc: "Peri-implant mucositis is inflammation without progressive bone loss; peri-implantitis includes inflammation with progressive bone loss. Record findings and compare with baseline." },
    { n: 5, title: "Escalate persistent or progressive disease", desc: "Treat mucositis early, review response, arrange radiographs where justified and refer for ongoing bone loss, suppuration, mobility, technical complications or complex prostheses." },
  ],

  safetyBox: {
    title: "Referral or implant-clinician review triggers",
    items: [
      "Progressive bone loss, increasing probing depths from baseline, suppuration or persistent bleeding despite local measures.",
      "Implant mobility, pain on function, prosthesis loosening, screw fracture or suspected implant failure.",
      "Poor cleaning access due to prosthetic design or patient limitation.",
      "History of periodontitis with unstable periodontal condition around natural teeth.",
      "The original implant system, component compatibility or restoration design is unknown and intervention may damage components.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Implant sites and restoration type recorded.",
    "Peri-implant probing/bleeding/suppuration from fixed landmarks recorded where appropriate.",
    "Radiograph findings and comparison with baseline recorded.",
    "Oral hygiene and maintenance advice recorded.",
    "Recall interval, treatment response and referral decision recorded.",
  ],

  clinicalSources: [
    IOS_REF.sdcepImplantMaint,
    IOS_REF.sdcepPeriImplant,
    IOS_REF.bspPerio,
    IOS_REF.localImplantRef,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to SDCEP dental implant maintenance guidance, SDCEP peri-implant disease guidance, BSP periodontal care guidance, and the practice's local implant referral pathway.",
  },
};
