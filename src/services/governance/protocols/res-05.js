/**
 * Restorative / Operative Clinical Protocol — RES-05
 * Direct Anterior Composite Restorations
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_05 = {
  id: "doc-res-05",
  reference: "RES-05",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Direct Anterior Composite Restorations",
  subtitle: "Shade selection, bonding sequence, layering, polishing, occlusion and patient communication for anterior composite work.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Direct composite restorations on anterior teeth",
    frequency: "Per anterior composite appointment",
    lead:      "Dentist",
    evidence:  "Shade, isolation, materials, layering technique and post-op occlusal check",
  },

  standardLabel: "Anterior-composite standard",
  protocolStandard: "Anterior composite restorations require predictable isolation, a correctly executed bonding sequence per manufacturer instructions, careful shade work and final occlusal verification. Aesthetic expectations must be discussed and consented before treatment, including likely longevity and the need for future replacement.",

  workflow: [
    { n: 1, title: "Discuss aesthetic expectations and consent", desc: "Review patient goals, photographs, shade options, alternatives (whitening, veneers, orthodontics) and limitations. Record consent including longevity and possible future replacement." },
    { n: 2, title: "Plan and prepare",                            desc: "Take pre-op shade and photographs before isolation. Plan cavity design or additive technique. Use a silicone palatal index for Class IV/diastema closure where appropriate." },
    { n: 3, title: "Isolate and bond per manufacturer instructions", desc: "Achieve effective isolation (RES-04). Etch, prime and bond exactly to manufacturer steps. Avoid contamination. Confirm the bond protocol matches the chosen adhesive system." },
    { n: 4, title: "Layer composite incrementally",                desc: "Place in increments respecting C-factor and material limits. Use appropriate dentine, body and enamel shades for blend. Avoid voids and overcontoured margins." },
    { n: 5, title: "Finish, polish and check occlusion",           desc: "Refine anatomy, finish margins, polish to a final lustre. Check occlusion in MIP and protrusive/lateral excursions. Issue post-op advice and arrange review where appropriate." },
  ],

  safetyBox: {
    title: "Stop and reassess if",
    items: [
      "Isolation cannot be maintained for the entire bonding sequence.",
      "The patient's expectations exceed what direct composite can predictably deliver.",
      "Pulpal symptoms appear during preparation or shortly after placement.",
      "Occlusion cannot be confirmed because anaesthesia, dam or patient factors prevent it — review at a separate visit.",
      "Aesthetic outcome at try-in is unacceptable — agree the next step before discharging.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Pre-op shade and photographs recorded where appropriate.",
    "Isolation method recorded.",
    "Adhesive system, etchant timing and composite material recorded.",
    "Occlusal check in MIP and excursions documented.",
    "Post-operative advice and review plan recorded.",
  ],

  clinicalSources: [
    RES_REF.fgdpOperative,
    RES_REF.fgdpStandards,
    RES_REF.mfrInstructions,
    RES_REF.gdcConsent,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent operative dentistry guidance, manufacturer adhesive instructions and GDC consent principle. Requires Clinical Director review and local approval before live adoption.",
  },
};
