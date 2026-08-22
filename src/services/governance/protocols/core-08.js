/**
 * Core Clinical Protocol — CORE-08
 * Referral Pathways
 *
 * Anchored to: GDC Standards Principle 7.3 (working within competence,
 * referring when needed); NHS England Commissioning Standards for
 * Specialist Dental Services; NICE NG12 (2-week wait suspected cancer);
 * CQC Reg 12.
 */

import {
  CORE_CLINICAL_INTENT, CORE_LOCAL_SIGNOFF_NOTE,
  CORE_VERSION_BASE, CORE_REF,
} from "./core-common";

export const CORE_08 = {
  id: "doc-core-08",
  reference: "CORE-08",
  packKey: "clinical_governance",
  category: "Core",
  tier: "core",
  type: "sop",
  title: "Referral Pathways",
  subtitle: "Routine and urgent referral routes, 2-week wait suspected cancer, tracking and chase, safety-netting, results follow-up.",

  clinicalIntent: CORE_CLINICAL_INTENT,
  localSignOffNote: CORE_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All clinicians making referrals to specialist services, OMFS, oral medicine, oral surgery, perio, endo, ortho, hospital pathways and 2-week wait cancer",
    frequency: "Every referral",
    lead:      "Referring clinician; tracked by the Practice Referrals Coordinator",
    evidence:  "Referral letter, acknowledgement, patient communication record, outcome",
  },

  standardLabel: "Referral standard",
  protocolStandard: "Every referral must be made using the correct pathway (2WW for suspected oral cancer; routine for elective specialist care), supported by full clinical information and the records the receiving service needs to triage. The referring clinician retains care until the receiving service accepts. All referrals are tracked, the patient is informed, and results are followed up.",

  workflow: [
    { n: 1, title: "Identify the right pathway",   desc: "2-week wait suspected cancer (unexplained ulceration > 3 weeks, persistent neck lump, oral lump, red/red-white patch consistent with erythroplakia / erythroleukoplakia, unexplained tooth mobility, dysphagia / voice change / weight loss); urgent specialist; routine specialist; OMFS / hospital; private if NHS not available." },
    { n: 2, title: "Gather minimum information",   desc: "Patient details, current concern, history, medical history, medications, allergies, examination findings, recent investigations, clinical photos where relevant, radiographs where justified and recent." },
    { n: 3, title: "Write the referral",            desc: "Use the local ICB / NHS / hospital template for the destination pathway. State the question being asked. Include all attachments required by the receiving service to avoid bouncing." },
    { n: 4, title: "Inform the patient",            desc: "Tell the patient the referral is being made, the expected timeframe (2WW = within 2 weeks; routine variable), and what to do if they have not been contacted by the expected date. Document the conversation." },
    { n: 5, title: "Open the tracker",              desc: "Log the referral in the practice tracker: date sent, route, destination, expected outcome, chase date. Do not let referrals fall into a black hole." },
    { n: 6, title: "Chase and escalate",            desc: "If acknowledgement or contact is not received within the expected timeframe, chase the receiving service. Escalate to senior clinical / admin if delayed. For 2WW, chase aggressively — delay is not acceptable." },
    { n: 7, title: "Track to outcome",              desc: "Receive and file outcome / discharge letters. Update the patient record. If the patient declined or did not attend, document and assess safeguarding concern where relevant." },
  ],

  safetyBox: {
    title: "Common referral failures",
    items: [
      "Soft-tissue lesion routed as a routine biopsy when 2WW criteria are met — review every soft-tissue referral against NICE NG12.",
      "Referral made but patient not told what to expect or what to do if not contacted.",
      "Referral made but not tracked; outcome never followed up.",
      "Insufficient information attached, leading to bouncing and delay.",
      "Patient cannot afford / access the referral and is lost from care.",
      "Children with multiple specialist needs — consider co-ordinated paediatric pathway rather than fragmented separate referrals.",
    ],
  },

  minimumRecordSet: [
    "Reason for referral and clinical question.",
    "Pathway selected (2WW / urgent / routine / hospital / private).",
    "Information sent (clinical letter, radiographs, photos).",
    "Patient informed — date, expected timeframe, what to do if not contacted.",
    "Tracker entry — date sent, chase date, outcome.",
    "Outcome / discharge letter received and filed; patient record updated.",
  ],

  auditPrompts: [
    "Are 2WW referrals identified using NICE NG12 criteria?",
    "Is every 2WW referral acknowledged within the expected window?",
    "Are routine referrals tracked to outcome?",
    "Are patients informed of the expected timeframe and what to do if not contacted?",
    "Are bounced / rejected referrals reviewed and learning shared?",
    "Are outstanding referrals reviewed in the monthly clinical governance meeting?",
  ],

  clinicalSources: [
    CORE_REF.niceNg12,
    CORE_REF.gdcSafety,
    CORE_REF.cqcReg12,
    CORE_REF.gdcCommunication,
  ],

  version: {
    ...CORE_VERSION_BASE,
    changeSummary: "Initial published version — referral pathways protocol covering 2WW suspected cancer, routine specialist and hospital routes, with tracking and safety-netting.",
  },
};
