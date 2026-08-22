/**
 * Restorative / Operative Clinical Protocol — RES-04
 * Isolation, Moisture Control & Aseptic Field
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_04 = {
  id: "doc-res-04",
  reference: "RES-04",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Isolation, Moisture Control & Aseptic Field",
  subtitle: "Rubber dam, alternatives, contamination control, airway protection and documentation across operative care.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All bonded restorations, endodontic-adjacent operative work and any procedure with airway risk",
    frequency: "Every restorative visit where isolation is required",
    lead:      "Dentist with trained dental nurse support",
    evidence:  "Isolation method, any contamination events and corrective action recorded",
  },

  standardLabel: "Isolation standard",
  protocolStandard: "Effective moisture control and airway protection are essential for predictable bonded restorations and for patient safety. Rubber dam is the preferred isolation method for bonded operative care; alternatives must be justified and documented.",

  workflow: [
    { n: 1, title: "Plan isolation before access",       desc: "Confirm tooth, restoration plan and isolation needs. Check medical history for latex sensitivity. Prepare dam, clamps, frames, suction and alternatives." },
    { n: 2, title: "Place rubber dam where indicated",    desc: "Use appropriate clamp, dam material and floss ligatures. Test seal, check airway and gag tolerance. Floss interproximal contacts before clamping." },
    { n: 3, title: "Protect the patient throughout",       desc: "Use eye protection, high-volume aspiration and secure small instruments. Avoid uncontrolled instrument passes over the airway." },
    { n: 4, title: "Manage contamination immediately",     desc: "If saliva or blood contaminates the bonded surface, pause, re-isolate, re-disinfect and repeat the bonding sequence as material instructions require." },
    { n: 5, title: "Document and review",                  desc: "Record the isolation method used, any difficulties and any deviation from the plan. Reassess restorability if isolation cannot be achieved." },
  ],

  safetyBox: {
    title: "Do not proceed without adequate isolation if",
    items: [
      "Bonded restorations cannot be predictably placed without contamination.",
      "There is significant airway risk and no acceptable mitigation.",
      "Rubber dam cannot be placed and no documented alternative provides equivalent control.",
      "The patient cannot tolerate isolation and the procedure cannot be modified safely.",
      "The case complexity exceeds local capability — referral may be safer than improvisation.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Isolation method recorded for bonded restorations.",
    "Latex sensitivity checked before rubber dam placement.",
    "Contamination events and corrective steps documented.",
    "Reason recorded if rubber dam is not used for bonded work.",
    "Airway-risk procedures used appropriate protection.",
  ],

  clinicalSources: [
    RES_REF.fgdpOperative,
    RES_REF.fgdpStandards,
    RES_REF.gdcCompetence,
    RES_REF.mfrInstructions,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from FGDP/CGDent operative dentistry guide and standards, manufacturer instructions and GDC competence principle. Requires Clinical Director review and local approval before live adoption.",
  },
};
