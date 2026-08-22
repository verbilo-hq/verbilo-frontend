/**
 * Implants & Oral Surgery Clinical Protocol — IOS-01
 * Oral Surgery & Implant Case Assessment
 *
 * Source: Implants & Oral Surgery Clinical Protocols pack, IOS-01, reviewed
 * May 2026, version 1.0. Text preserved verbatim from the source PDF.
 */

import {
  IOS_CLINICAL_INTENT, IOS_LOCAL_SIGNOFF_NOTE, IOS_MINIMUM_RECORD_SET,
  IOS_VERSION_BASE, IOS_REF,
} from "./ios-common";

export const IOS_01 = {
  id: "doc-ios-01",
  reference: "IOS-01",
  packKey: "clinical_governance",
  category: "Implants & Oral Surgery",
  type: "sop",
  title: "Oral Surgery & Implant Case Assessment",
  subtitle: "Medical history, surgical risk, dental diagnosis, restorability, radiographs, treatment options, complexity, and referral thresholds.",

  clinicalIntent: IOS_CLINICAL_INTENT,
  localSignOffNote: IOS_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "All patients being assessed for extraction, oral surgery, implant treatment or implant referral",
    frequency: "At initial assessment and whenever risk, symptoms or the treatment plan changes",
    lead:      "Dentist / implant clinician / oral surgery lead",
    evidence:  "Assessment record, diagnosis, imaging review, options discussed and complexity decision",
  },

  standardLabel: "Assessment standard",
  protocolStandard: "Oral surgery and implant treatment must be preceded by a structured assessment of the patient, the tooth or site, the procedure, the clinician competence required and the safer pathway. The practice must not treat complexity as a routine booking issue: suitability, risk, imaging, consent, aftercare and referral need to be decided before treatment starts.",

  workflow: [
    { n: 1, title: "Confirm the reason for treatment",       desc: "Record the patient concern, diagnosis, pain or infection history, previous treatment, aesthetic or functional aims, and whether the appointment is urgent, planned or part of a wider restorative plan." },
    { n: 2, title: "Update medical and medication history",   desc: "Review allergies, anticoagulants, antiplatelets, diabetes, immunosuppression, steroid therapy, pregnancy, radiotherapy history, antiresorptives, smoking and previous surgical complications." },
    { n: 3, title: "Assess the tooth, site and mouth",        desc: "Record restorability, periodontal status, mobility, caries, fractures, soft tissues, mouth opening, local infection, adjacent teeth, occlusion, bone contour and implant site limitations." },
    { n: 4, title: "Review appropriate imaging",               desc: "Use justified radiographs and CBCT only where indicated. Record proximity to sinus, inferior alveolar nerve, mental foramen, adjacent roots, retained roots, pathology and bone volume." },
    { n: 5, title: "Decide complexity and pathway",            desc: "Match the case to clinician competence, equipment, nurse support, emergency arrangements and patient factors. Arrange referral or shared care where risk exceeds local capability." },
  ],

  safetyBox: {
    title: "Do not book as routine if",
    items: [
      "The patient has uncontrolled medical risk, unclear anticoagulant status or previous serious bleeding complication.",
      "There is suspected malignancy, unexplained ulceration, paraesthesia, rapidly spreading infection or airway concern.",
      "The procedure involves high nerve, sinus, fracture, displacement, retained root or implant-graft complexity beyond the operator competence.",
      "Imaging is inadequate for the planned procedure or the diagnosis is uncertain.",
      "The patient has not understood alternatives, risks, costs, staged care or aftercare commitments.",
    ],
  },

  minimumRecordSet: IOS_MINIMUM_RECORD_SET,

  auditPrompts: [
    "Medical, medication and allergy history checked and dated.",
    "Diagnosis, site/tooth and surgical objective recorded.",
    "Imaging justification, findings and limitations recorded.",
    "Complexity decision and operator competence considered.",
    "Treatment options, referral option and agreed plan recorded.",
  ],

  clinicalSources: [
    IOS_REF.gdcConsentCompetence,
    IOS_REF.baosFds,
    IOS_REF.sdcepAnticoagPrescribing,
    IOS_REF.localRadioReferral,
  ],

  version: {
    ...IOS_VERSION_BASE,
    changeSummary: "Initial published version aligned to GDC Standards on consent and competence, BAOS/FDS oral surgery guidance, and SDCEP prescribing and anticoagulant guidance.",
  },
};
