/**
 * Trauma Management Clinical Protocol — TRAU-06
 * Soft-Tissue Injuries
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  TRAU_CLINICAL_INTENT, TRAU_LOCAL_SIGNOFF_NOTE, TRAU_MINIMUM_RECORD_SET,
  TRAU_VERSION_BASE, TRAU_REF,
} from "./trau-common";

export const TRAU_06 = {
  id: "doc-trau-06",
  reference: "TRAU-06",
  packKey: "clinical_governance",
  category: "Trauma Management",
  type: "sop",
  title: "Soft-Tissue Injuries",
  subtitle: "Lacerations, abrasions, contusions, retained foreign bodies, tetanus risk and suturing for oral and peri-oral wounds.",

  clinicalIntent: TRAU_CLINICAL_INTENT,
  localSignOffNote: TRAU_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Patients with intra-oral and peri-oral soft-tissue injuries",
    frequency: "Emergency presentation; follow-up as required",
    lead:      "Treating dentist; A&E or OMFS for complex",
    evidence:  "Wound assessment, foreign-body search, tetanus status, suturing, follow-up",
  },

  standardLabel: "Soft-tissue standard",
  protocolStandard: "Soft-tissue injuries must be cleaned, assessed for foreign bodies and tetanus risk, and sutured where appropriate. Complex facial wounds and wounds at risk of aesthetic compromise should be referred to OMFS.",

  workflow: [
    { n: 1, title: "Clean and assess the wound",      desc: "Irrigate with saline. Inspect for tooth fragments, debris, glass or other foreign material. Probe gently — palpate for occult fragments." },
    { n: 2, title: "Check tetanus status",              desc: "If tetanus immunisation is not current or unknown, refer to GP for booster. Document the conversation." },
    { n: 3, title: "Suture as appropriate",              desc: "Use appropriate resorbable suture (e.g. 4/0 or 5/0 Vicryl) for intra-oral wounds; non-resorbable for vermilion/lip border requiring precise apposition (refer to OMFS if aesthetic concern)." },
    { n: 4, title: "Prescribe antibiotics if indicated", desc: "For contaminated wounds (animal bites, soil contamination, immunocompromised) per SDCEP. Most clean intra-oral wounds heal well without antibiotics." },
    { n: 5, title: "Provide advice and review",          desc: "Soft diet, chlorhexidine rinses (>12 years), pain control. Review at 1 week for suture check / removal (if non-resorbable). Refer if signs of infection, dehiscence or scar concern." },
  ],

  safetyBox: {
    title: "Refer to A&E / OMFS if",
    items: [
      "Through-and-through lip lacerations crossing the vermilion border.",
      "Suspected tongue laceration with persistent bleeding.",
      "Animal or human bite — high infection risk; usually requires antibiotic and tetanus review.",
      "Foreign body cannot be located but is suspected (e.g. retained tooth fragment, glass).",
      "Significant facial laceration with aesthetic implications.",
    ],
  },

  minimumRecordSet: TRAU_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Wound site, size and mechanism recorded.",
    "Foreign-body search documented.",
    "Tetanus status checked.",
    "Suture material and pattern recorded.",
    "Review for healing and infection booked.",
  ],

  clinicalSources: [
    TRAU_REF.iadtTrauma,
    TRAU_REF.sdcepPrescribing,
    TRAU_REF.localOMFS,
    TRAU_REF.gdcSafety,
  ],

  version: {
    ...TRAU_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from IADT 2020 guidelines on associated soft-tissue injuries, SDCEP drug prescribing, local OMFS referral pathway and GDC Standards on patient safety. Requires Clinical Director review and local approval before live adoption.",
  },
};
