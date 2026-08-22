/**
 * Restorative / Operative Clinical Protocol — RES-01
 * Restorative Assessment, Risk & Treatment Planning
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 * See res-common.js for the full provenance statement.
 */

import {
  RES_CLINICAL_INTENT, RES_LOCAL_SIGNOFF_NOTE, RES_MINIMUM_RECORD_SET,
  RES_VERSION_BASE, RES_REF,
} from "./res-common";

export const RES_01 = {
  id: "doc-res-01",
  reference: "RES-01",
  packKey: "clinical_governance",
  category: "Restorative",
  type: "sop",
  title: "Restorative Assessment, Risk & Treatment Planning",
  subtitle: "Examination, caries risk, restorability, periodontal status, occlusion, options, prognosis and recall.",

  clinicalIntent: RES_CLINICAL_INTENT,
  localSignOffNote: RES_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients receiving restorative care",
    frequency: "At new patient, recall and before any restorative treatment plan",
    lead:      "Dentist",
    evidence:  "Charting, caries risk score, options discussed and agreed plan",
  },

  standardLabel: "Planning standard",
  protocolStandard: "Restorative treatment must be planned from a structured assessment of caries risk, tooth restorability, periodontal status, occlusion and patient preference. The clinician must agree the long-term plan with the patient before delivering individual procedures, not assemble it ad-hoc over multiple visits.",

  workflow: [
    { n: 1, title: "Complete the dental and medical assessment", desc: "Update medical history, medicines and allergies. Record dental history, diet, oral hygiene, smoking, parafunction and patient concerns or aesthetic goals." },
    { n: 2, title: "Examine, chart and image where justified",   desc: "Hard- and soft-tissue exam, occlusal assessment, periodontal screening, full charting and justified radiographs. Document findings rather than 'NAD' summaries." },
    { n: 3, title: "Score caries risk and restorability",         desc: "Use a documented caries-risk approach (e.g. SDCEP/DBOH). Assess each tooth for restorability — remaining tissue, ferrule, cracks, periodontal support, occlusal load." },
    { n: 4, title: "Stabilise disease before elective work",      desc: "Address active caries, periodontal disease, pulpal symptoms and defective restorations before crowns, bridges, implants or aesthetic care." },
    { n: 5, title: "Agree the plan and recall",                    desc: "Discuss options including no-treatment, monitoring, restorative, prosthetic and referral. Record costs, sequencing, prognosis, consent and the recall interval per NICE CG19." },
  ],

  safetyBox: {
    title: "Do not start restorative treatment if",
    items: [
      "Active caries, untreated periodontal disease or pulpal pain has not been addressed.",
      "The tooth restorability is doubtful and extraction/replacement has not been discussed.",
      "Imaging or assessment is inadequate for the planned procedure.",
      "The patient does not understand alternatives, costs or maintenance commitments.",
      "Complexity exceeds the clinician's competence and referral has not been considered.",
    ],
  },

  minimumRecordSet: RES_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Medical, dental and risk history recorded and dated.",
    "Caries-risk score and prevention plan documented.",
    "Restorability and prognosis documented per tooth where treatment is planned.",
    "Options, costs and consent discussion recorded.",
    "Recall interval justified against NICE CG19.",
  ],

  clinicalSources: [
    RES_REF.sdcepCaries,
    RES_REF.fgdpOperative,
    RES_REF.niceRecall,
    RES_REF.dbohQRG,
    RES_REF.gdcConsentRecords,
  ],

  version: {
    ...RES_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from SDCEP caries prevention guidance, FGDP/CGDent operative dentistry guide, NICE CG19 recall, Delivering Better Oral Health, and GDC Standards on consent and records. Requires Clinical Director review and local approval before live adoption.",
  },
};
