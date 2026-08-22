/**
 * Paediatric Dentistry Clinical Protocol — PAED-10
 * Safeguarding & Dental Neglect in Children
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_10 = {
  id: "doc-paed-10",
  reference: "PAED-10",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "Safeguarding & Dental Neglect in Children",
  subtitle: "Recognising safeguarding concerns, dental neglect, escalation pathway, documentation and team responsibilities.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All children attending the practice; all team members regardless of role",
    frequency: "At every visit and whenever a concern arises",
    lead:      "Named practice safeguarding lead (clinical); all staff have a duty",
    evidence:  "Concern record, action taken, referrals made and learning recorded",
  },

  standardLabel: "Safeguarding standard",
  protocolStandard: "The dental team has a statutory duty to safeguard and promote the welfare of children. Concerns must be recognised early, recorded objectively, discussed with the safeguarding lead and escalated to the local authority where indicated.",

  workflow: [
    { n: 1, title: "Recognise concerns",                  desc: "Be alert to inconsistent history, repeated injury, dental neglect (multiple untreated lesions with parental awareness), non-attendance for serial appointments, or any presentation that does not feel right." },
    { n: 2, title: "Record objectively",                   desc: "Document what was said by whom (in quotes), what was observed, who was present, time and date. Do not interpret or accuse. Take photographs only with appropriate consent and per the practice safeguarding policy." },
    { n: 3, title: "Discuss with the safeguarding lead",   desc: "Speak to the practice's named safeguarding lead at the earliest opportunity. Where the lead is unavailable, contact the local authority safeguarding board or the duty social worker per the local pathway." },
    { n: 4, title: "Escalate where indicated",              desc: "Where there is suspected significant harm, refer to children's social care without delay. Inform parents/guardian of the referral unless doing so would place the child at risk." },
    { n: 5, title: "Review and learn",                      desc: "Record the outcome of any referral. Reflect on each safeguarding case at clinical governance to support team learning and ongoing competence. Maintain mandatory training per the intercollegiate framework." },
  ],

  safetyBox: {
    title: "Escalate without delay if",
    items: [
      "A child discloses abuse — listen, do not promise confidentiality, document verbatim and escalate.",
      "Injuries are inconsistent with the explanation given.",
      "Dental neglect is causing the child significant pain, infection or developmental impact.",
      "The child appears at immediate risk of harm.",
      "Other professionals or the family are not engaging with prevention or treatment for serial untreated disease.",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Practice safeguarding lead named and known to all staff.",
    "Safeguarding training current per intercollegiate framework.",
    "Concerns logged, even where no referral made, with rationale.",
    "Referrals to children's social care followed up.",
    "Cases reviewed at clinical governance.",
  ],

  clinicalSources: [
    PAED_REF.gdcChildSafety,
    PAED_REF.workingTogether,
    PAED_REF.childrenAct,
    PAED_REF.bspdGuidelines,
    PAED_REF.localSafeguarding,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from GDC Standards on safeguarding, Working Together to Safeguard Children, Children Act 1989/2004 and BSPD UK national clinical guidelines. Requires Clinical Director review, named safeguarding lead and local approval before live adoption.",
  },
};
