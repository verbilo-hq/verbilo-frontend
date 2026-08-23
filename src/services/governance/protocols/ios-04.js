/**
 * Implants & Oral Surgery Clinical Protocol — IOS-04
 * Routine & Surgical Extraction Protocol
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-04, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_04 = {
  id: "doc-ios-04",
  reference: "IOS-04",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Routine & Surgical Extraction Protocol",
  subtitle: "Case selection, local anaesthesia, flap design, sectioning, bone removal, socket debridement, retained roots, haemostasis, and referral triggers.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Routine extractions and surgical extractions carried out in general dental practice",
    frequency: "At every extraction appointment",
    lead:      "Treating dentist with trained dental nurse support",
    evidence:  "Pre-operative assessment, procedure notes, haemostasis and aftercare recorded",
  },

  standardLabel: "Extraction standard",
  protocolStandard: "Extractions should be planned and performed using controlled, atraumatic technique within the clinician competence and local safety arrangements. The clinician must confirm tooth identity, risk factors, imaging, consent, anaesthesia, haemostasis and aftercare before the patient leaves.",

  workflow: [
    { n: 1, title: "Confirm patient, tooth and consent",       desc: "Use a surgical pause to confirm patient identity, tooth/site, diagnosis, imaging, medical history, consent, allergies and treatment plan." },
    { n: 2, title: "Achieve and verify anaesthesia",            desc: "Use appropriate local anaesthetic technique and confirm profound anaesthesia before instrumentation. Record anaesthetic type, dose and vasoconstrictor." },
    { n: 3, title: "Choose routine or surgical approach",       desc: "Attempt controlled luxation and forceps delivery where appropriate. Use flap, bone removal or sectioning only where indicated, consented and within competence." },
    { n: 4, title: "Manage the socket",                          desc: "Inspect the socket, remove obvious granulation tissue only where indicated, irrigate appropriately, smooth sharp bone if required and assess for retained roots or sinus communication." },
    { n: 5, title: "Secure haemostasis and aftercare",           desc: "Use pressure, haemostatic dressing or sutures where indicated. Provide written advice, analgesia advice, emergency contact and review or suture removal arrangements." },
  ],

  safetyBox: {
    title: "Stop and reassess if",
    items: [
      "The tooth or site is uncertain, imaging is inadequate or the patient changes their mind.",
      "The procedure becomes more complex than consented or beyond operator competence.",
      "A root is displaced, fracture risk is high, sinus or nerve risk increases, or haemostasis is not achievable.",
      "The patient becomes medically unstable or there is uncontrolled anxiety, syncope or emergency concern.",
      "There is suspicion of pathology requiring histology or specialist management.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Tooth/site, indication and consent recorded.",
    "Local anaesthetic details recorded.",
    "Extraction technique and complications recorded.",
    "Socket inspection, retained root decision and haemostasis recorded.",
    "Post-operative instructions and review plan recorded.",
  ],

  clinicalSources: [
    IOS_REF.baosFdsResources,
    IOS_REF.gdcPatientSafetyRecords,
    IOS_REF.sdcepPrescribingShort,
    IOS_REF.localMedEmergency,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to BAOS/FDS oral surgery practice resources, GDC Standards on patient safety and records, and SDCEP prescribing guidance.",
  },
};
