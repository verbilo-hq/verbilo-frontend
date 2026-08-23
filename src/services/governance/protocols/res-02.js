/**
 * Restorative / Operative Clinical Protocol — RES-02
 * Caries Diagnosis & Minimal Intervention
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_02 = {
  id: "doc-res-02",
  reference: "RES-02",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Caries Diagnosis & Minimal Intervention",
  subtitle: "ICDAS / ICCMS-aligned diagnosis, lesion activity, monitoring, prevention and the threshold for operative intervention.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients with caries, suspected caries or caries-risk assessment",
    frequency: "At new patient, recall and at every restorative visit",
    lead:      "Dentist (with hygienist/therapist support for prevention)",
    evidence:  "Charted lesions, ICDAS scores, prevention plan and any operative justification",
  },

  standardLabel: "Caries-management standard",
  protocolStandard: "Caries is a behaviour-driven, multifactorial disease. The clinician must record lesion site, severity and activity, manage caries through prevention and minimal intervention wherever possible, and reserve operative treatment for lesions that cannot be arrested or that have cavitated into dentine.",

  workflow: [
    { n: 1, title: "Diagnose caries lesion by lesion",      desc: "Use visual–tactile examination on clean dry teeth, supported by justified bitewings. Record site, severity (e.g. ICDAS) and activity (active vs arrested) — not just 'caries +'." },
    { n: 2, title: "Assess and address caries risk",         desc: "Use a documented risk approach (low / standard / high). Address modifiable drivers — diet, fluoride exposure, plaque control, dry mouth and access to care." },
    { n: 3, title: "Plan prevention first",                  desc: "Apply Delivering Better Oral Health interventions: fluoride toothpaste advice, fluoride varnish, diet, fissure sealants, OHI and recall set to risk." },
    { n: 4, title: "Decide if operative intervention is justified", desc: "Operate only when the lesion is cavitated into dentine, progressing despite prevention, or causing symptoms. Use selective excavation; preserve sound and remineralisable tissue." },
    { n: 5, title: "Re-assess at recall",                     desc: "Re-record lesion status, prevention adherence, new lesions and ICDAS change. Adjust recall interval per NICE CG19." },
  ],

  decisionTable: {
    title: "Caries-Management Decision Guide",
    columns: ["Lesion finding", "Recommended action"],
    rows: [
      ["Non-cavitated, active enamel lesion",                  "Prevention-only: fluoride, diet, OHI, fissure sealant if appropriate. Monitor at recall."],
      ["Cavitated lesion confined to enamel",                  "Prevention plus close monitoring; sealant or resin infiltration may be considered."],
      ["Cavitated dentine lesion, asymptomatic",                "Operative restoration with selective excavation and direct composite."],
      ["Deep cavitated lesion, pulp at risk",                  "Stepwise/selective caries removal, pulp protection and review (see RES-07)."],
      ["Lesion with pulpal pain or signs of irreversible pulpitis","Endodontic assessment per ENDO pack; do not restore over an inflamed pulp."],
    ],
  },

  safetyBox: {
    title: "Reassess before operative intervention if",
    items: [
      "The lesion is active but non-cavitated and prevention has not been trialled.",
      "Imaging is inadequate to confirm dentine involvement.",
      "Pulpal symptoms or signs suggest endodontic assessment is needed first.",
      "Caries risk is uncontrolled and operative treatment alone will not change outcomes.",
      "The tooth restorability or strategic value is doubtful.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Lesions recorded by tooth, site, severity and activity.",
    "Caries-risk score documented and dated.",
    "Prevention interventions delivered and recorded.",
    "Operative threshold justified per lesion treated.",
    "Recall interval matched to risk per NICE CG19.",
  ],

  clinicalSources: [
    RES_REF.sdcepCaries,
    RES_REF.dbohQRG,
    RES_REF.fgdpOperative,
    RES_REF.niceRecall,
    RES_REF.localRadiography,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from SDCEP caries guidance, Delivering Better Oral Health, FGDP/CGDent operative dentistry guide and NICE CG19. Requires Clinical Director review and local approval before live adoption.",
  },
};
