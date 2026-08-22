/**
 * Lab Work Hub fixture data.
 *
 * Cases use the richer MVP shape: stage state-machine, owner, compliance
 * checklist, send method / scanner platform, lab reference, fit appointment,
 * timeline events. Older callers that only know `status` should derive it
 * from `stage` via the mapping in LabPage.jsx.
 *
 * PEOPLE + SITES come from the shared roster (services/people.js) and the
 * canonical site model (services/sites.js) — NOT hardcoded. Each case is
 * authored against a canonical, *staffed* site (Southall or London — the two
 * sites the roster gives full clinical teams). `clinician` resolves to a real
 * dentist at that site, `owner` to a real nurse / TCO / manager, and the
 * timeline `by` fields to those same real people (lab-company entries such as
 * "Dental Arts Laboratory" are external and stay as-is). `site` is the
 * canonical site name. Patient names are external patients and stay verbatim.
 */

import { clinicalStaffAtSite, personAtSiteByRole } from "../people";
import { siteName } from "../sites";

export const labContactsFixture = [
  {
    name: "Dental Arts Laboratory",
    services: ["Crowns", "Bridges", "Veneers", "Inlays / Onlays"],
    phone: "020 7946 1234",
    email: "cases@dentalartslab.co.uk",
    turnaround: "5–7 working days",
    scanners: ["iTero", "3Shape", "Medit"],
    collectionDays: "Mon · Wed · Fri",
    notes: "Preferred for anterior aesthetic work. Same-day acknowledgement on portal submissions.",
  },
  {
    name: "OrthoLab London",
    services: ["Hawley retainers", "Essix retainers", "Bleaching trays", "Sports guards"],
    phone: "020 7946 5678",
    email: "lab@ortholab.london",
    turnaround: "7–10 working days",
    scanners: ["iTero", "3Shape"],
    collectionDays: "Tue · Thu",
    notes: "Specialist removable appliances. Rush 48-hr service available at premium.",
  },
  {
    name: "Align Technology (Invisalign)",
    services: ["Clear aligners", "Aligner refinements", "Retention"],
    phone: "0800 012 0200",
    email: "support@aligntech.com",
    turnaround: "3–4 weeks",
    scanners: ["iTero (required)"],
    collectionDays: "Digital — no collection",
    notes: "iTero scans only. Submit through Invisalign Doctor Site portal.",
  },
  {
    name: "3M Oral Care Lab Services",
    services: ["Implant crowns", "Custom abutments", "CEREC blocks", "Surgical guides"],
    phone: "0800 626 578",
    email: "lab.uk@3m.com",
    turnaround: "3–5 working days",
    scanners: ["3Shape", "CEREC"],
    collectionDays: "Daily — courier pickup",
    notes: "Implant work — send fixture, abutment selection and antagonist scan together.",
  },
];

export const digitalGuidesFixture = [
  { name: "Lab Prescription & Docket Completion Guide",      reviewed: "Mar 2025" },
  { name: "Intraoral Scanner — Daily Setup & Calibration",   reviewed: "Feb 2025" },
  { name: "Digital Case Submission to Laboratory",           reviewed: "Jan 2025" },
  { name: "Shade Selection & Clinical Photography Protocol", reviewed: "Jan 2025" },
  { name: "Invisalign Case Submission Checklist",            reviewed: "Dec 2024" },
];

const emptyChecklist = {
  prescriptionCompleted: false,
  attachmentsProvided:   false,
  statementExpected:     true,
  statementReceived:     false,
  deviceChecked:         false,
};

/* ── Resolve real, site-scoped staff from the shared roster ─────────────────
 * Southall (practice-harley) and London (practice-camden) are the two sites
 * the roster staffs with full clinical teams, so every name below is a real
 * person bound to the case's displayed site. */
const pickName = (person, fallback) => person?.displayName ?? fallback;

const southallDentists = clinicalStaffAtSite("site-southall", "Dentist");
const londonDentists   = clinicalStaffAtSite("site-london", "Dentist");

/* Owners = real roster support staff (TCO / nurse / manager) at the site. */
const southallOwner = personAtSiteByRole("site-southall",
  ["treatmentCoordinator", "leadNurse", "dentalNurse", "practiceManager"]);
const londonOwner   = personAtSiteByRole("site-london",
  ["treatmentCoordinator", "leadNurse", "dentalNurse", "practiceManager"]);

/* Per-case people bundles — pick distinct dentists so the tracker looks
 * natural, but every value is a real roster person at the named site. */
const SOUTHALL = {
  site:        siteName("site-southall"),
  clinicianA:  pickName(southallDentists[0], "—"),
  clinicianB:  pickName(southallDentists[1] ?? southallDentists[0], "—"),
  owner:       pickName(southallOwner, "—"),
};
const LONDON = {
  site:        siteName("site-london"),
  clinicianA:  pickName(londonDentists[0], "—"),
  clinicianB:  pickName(londonDentists[1] ?? londonDentists[0], "—"),
  owner:       pickName(londonOwner, "—"),
};

export const labCasesFixture = [
  {
    id: 1,
    patient: "Mr. James Powell",       patientId: "P-104872",
    clinician: SOUTHALL.clinicianA,     owner: SOUTHALL.owner,
    site: SOUTHALL.site,
    workType: "Crown (PFM)",            toothSite: "UR4",
    material: "PFM with metal collar",  shade: "A2",
    occlusionNotes: "Standard ICP, no parafunction noted",
    lab: "Dental Arts Laboratory",
    sendMethod: "Physical impression",  scannerPlatform: null,
    sentDate: "2026-04-28", dueDate: "2026-05-07", fitAppointmentDate: "2026-05-09",
    labReference: "DAL-25-104872",
    stage: "in_production",
    nextAction: "Chase lab — overdue",
    priority: "high",
    notes: "Shade A2, standard occlusion. Patient travelling Tue–Thu next week.",
    complianceChecklist: { ...emptyChecklist, prescriptionCompleted: true, attachmentsProvided: true, statementExpected: true },
    timeline: [
      { at: "2026-04-28T09:15", event: "Case created",            by: SOUTHALL.owner },
      { at: "2026-04-28T09:25", event: "Prescription completed",  by: SOUTHALL.clinicianA },
      { at: "2026-04-28T14:30", event: "Sent to lab",             note: "Collected by Dental Arts courier", by: SOUTHALL.owner },
      { at: "2026-04-29T10:05", event: "Lab acknowledged receipt", by: "Dental Arts Laboratory" },
    ],
  },
  {
    id: 2,
    patient: "Mrs. Clara Hughes",      patientId: "P-104201",
    clinician: SOUTHALL.clinicianA,     owner: SOUTHALL.owner,
    site: SOUTHALL.site,
    workType: "3-Unit Bridge",         toothSite: "LL4 – LL6",
    material: "Zirconia, layered",     shade: "A3",
    occlusionNotes: "Light contacts in lateral excursion preferred",
    lab: "Dental Arts Laboratory",
    sendMethod: "Scanner portal",      scannerPlatform: "iTero",
    sentDate: "2026-04-22", dueDate: "2026-04-29", fitAppointmentDate: "2026-05-04",
    labReference: "DAL-25-104201",
    stage: "returned",
    nextAction: "Book / confirm fit appointment",
    priority: "medium",
    notes: "Check contacts carefully on fit — patient sensitive to high spots.",
    complianceChecklist: { ...emptyChecklist, prescriptionCompleted: true, attachmentsProvided: true, statementExpected: true, statementReceived: true },
    timeline: [
      { at: "2026-04-22T11:00", event: "Case created", by: SOUTHALL.owner },
      { at: "2026-04-22T11:15", event: "Prescription completed", by: SOUTHALL.clinicianA },
      { at: "2026-04-22T13:00", event: "Sent to lab", note: "Submitted via iTero portal",  by: SOUTHALL.owner },
      { at: "2026-04-22T16:40", event: "Lab acknowledged receipt", by: "Dental Arts Laboratory" },
      { at: "2026-04-30T09:30", event: "Returned to practice", note: "Statement attached", by: "Dental Arts Laboratory" },
    ],
  },
  {
    id: 3,
    patient: "Mr. Tom Bradley",        patientId: "P-104550",
    clinician: LONDON.clinicianA,      owner: LONDON.owner,
    site: LONDON.site,
    workType: "Implant Crown",         toothSite: "LR6",
    material: "Screw-retained zirconia abutment + crown",
    shade: "B2",
    occlusionNotes: "Light occlusion in MIP, no contact in excursions",
    lab: "3M Oral Care Lab Services",
    sendMethod: "Scanner portal",      scannerPlatform: "3Shape",
    sentDate: "2026-04-25", dueDate: "2026-04-30", fitAppointmentDate: "2026-05-02",
    labReference: "3M-2026-50544",
    stage: "returned",
    nextAction: "Upload manufacturer's statement",
    priority: "high",
    notes: "Abutment sent separately. Statement missing on return.",
    complianceChecklist: { ...emptyChecklist, prescriptionCompleted: true, attachmentsProvided: true, statementExpected: true, statementReceived: false },
    timeline: [
      { at: "2026-04-25T08:50", event: "Case created", by: LONDON.owner },
      { at: "2026-04-25T09:10", event: "Prescription completed", by: LONDON.clinicianA },
      { at: "2026-04-25T12:00", event: "Sent to lab", by: LONDON.owner },
      { at: "2026-04-30T15:20", event: "Returned to practice", note: "Statement not included — chasing", by: "3M Oral Care Lab Services" },
    ],
  },
  {
    id: 4,
    patient: "Miss Priya Shah",        patientId: "P-104990",
    clinician: SOUTHALL.clinicianB,     owner: SOUTHALL.owner,
    site: SOUTHALL.site,
    workType: "Upper Hawley Retainer",  toothSite: "Upper arch",
    material: "Acrylic, wire labial bow", shade: null,
    occlusionNotes: null,
    lab: "OrthoLab London",
    sendMethod: "Scanner portal",      scannerPlatform: "iTero",
    sentDate: "2026-05-01", dueDate: "2026-05-12", fitAppointmentDate: "2026-05-14",
    labReference: "OL-2026-7711",
    stage: "in_production",
    nextAction: "Confirm return — due in 2 days",
    priority: "medium",
    notes: "Patient post-orthodontic retention — first retainer.",
    complianceChecklist: { ...emptyChecklist, prescriptionCompleted: true, attachmentsProvided: true, statementExpected: true },
    timeline: [
      { at: "2026-05-01T10:00", event: "Case created", by: SOUTHALL.owner },
      { at: "2026-05-01T10:30", event: "Prescription completed", by: SOUTHALL.clinicianB },
      { at: "2026-05-01T13:45", event: "Sent to lab", note: "iTero portal submission", by: SOUTHALL.owner },
      { at: "2026-05-02T09:00", event: "Lab acknowledged receipt", by: "OrthoLab London" },
    ],
  },
  {
    id: 5,
    patient: "Mr. David Moore",        patientId: "P-103998",
    clinician: LONDON.clinicianA,      owner: LONDON.owner,
    site: LONDON.site,
    workType: "Porcelain Veneers",     toothSite: "UL1 – UL2",
    material: "Feldspathic, bonded",   shade: "BL3",
    occlusionNotes: "Pre-op MIP captured; minimal incisal contacts in protrusion",
    lab: "Dental Arts Laboratory",
    sendMethod: "Scanner portal",      scannerPlatform: "iTero",
    sentDate: "2026-04-20", dueDate: "2026-04-27", fitAppointmentDate: "2026-04-29",
    labReference: "DAL-25-103998",
    stage: "fitted",
    nextAction: null,
    priority: "low",
    notes: "Fitted 29 Apr — patient happy. Recall scheduled at 12 months.",
    complianceChecklist: { ...emptyChecklist, prescriptionCompleted: true, attachmentsProvided: true, statementExpected: true, statementReceived: true, deviceChecked: true },
    timeline: [
      { at: "2026-04-20T11:15", event: "Case created", by: LONDON.owner },
      { at: "2026-04-20T11:40", event: "Prescription completed", by: LONDON.clinicianA },
      { at: "2026-04-20T14:00", event: "Sent to lab", by: LONDON.owner },
      { at: "2026-04-21T08:20", event: "Lab acknowledged receipt", by: "Dental Arts Laboratory" },
      { at: "2026-04-27T11:00", event: "Returned to practice", by: "Dental Arts Laboratory" },
      { at: "2026-04-28T16:00", event: "Checked / ready to fit", by: LONDON.owner },
      { at: "2026-04-29T10:30", event: "Fitted / complete", note: "Patient happy with shade match", by: LONDON.clinicianA },
    ],
  },
  {
    id: 6,
    patient: "Ms. Helen Reid",         patientId: "P-105110",
    clinician: SOUTHALL.clinicianA,     owner: SOUTHALL.owner,
    site: SOUTHALL.site,
    workType: "Crown (Zirconia)",      toothSite: "UL6",
    material: "Monolithic zirconia",   shade: "A3.5",
    occlusionNotes: "Heavy occlusion — bruxer, splint provided",
    lab: "Dental Arts Laboratory",
    sendMethod: "Scanner portal",      scannerPlatform: "iTero",
    sentDate: "2026-04-26", dueDate: "2026-05-05", fitAppointmentDate: "2026-05-08",
    labReference: "DAL-25-105110",
    stage: "lab_query",
    nextAction: "Respond to lab query — shade verification",
    priority: "high",
    notes: "Lab queried whether to extend the shade gradient further cervically.",
    complianceChecklist: { ...emptyChecklist, prescriptionCompleted: true, attachmentsProvided: true, statementExpected: true },
    timeline: [
      { at: "2026-04-26T10:00", event: "Case created", by: SOUTHALL.owner },
      { at: "2026-04-26T10:20", event: "Prescription completed", by: SOUTHALL.clinicianA },
      { at: "2026-04-26T15:10", event: "Sent to lab", by: SOUTHALL.owner },
      { at: "2026-04-27T08:45", event: "Lab acknowledged receipt", by: "Dental Arts Laboratory" },
      { at: "2026-05-02T11:30", event: "Lab query raised", note: "Shade gradient — extend further cervically?", by: "Dental Arts Laboratory" },
    ],
  },
  {
    id: 7,
    patient: "Mrs. Anita Carr",        patientId: "P-103740",
    clinician: LONDON.clinicianB,      owner: LONDON.owner,
    site: LONDON.site,
    workType: "Full Upper Denture",    toothSite: "Upper arch",
    material: "High-impact acrylic, characterised teeth",
    shade: "A3",
    occlusionNotes: "Class I, even balance bilaterally",
    lab: "OrthoLab London",
    sendMethod: "Physical impression", scannerPlatform: null,
    sentDate: "2026-04-08", dueDate: "2026-04-29", fitAppointmentDate: "2026-05-06",
    labReference: "OL-2026-7625",
    stage: "remake",
    nextAction: "Submit remake — try-in fit rejected",
    priority: "high",
    notes: "Patient unhappy with anterior tooth position at try-in. Remake at altered VDO.",
    complianceChecklist: { ...emptyChecklist, prescriptionCompleted: true, attachmentsProvided: true, statementExpected: true, statementReceived: true },
    timeline: [
      { at: "2026-04-08T09:00", event: "Case created", by: LONDON.owner },
      { at: "2026-04-08T09:30", event: "Prescription completed", by: LONDON.clinicianB },
      { at: "2026-04-08T13:00", event: "Sent to lab", by: LONDON.owner },
      { at: "2026-04-09T10:00", event: "Lab acknowledged receipt", by: "OrthoLab London" },
      { at: "2026-04-25T11:00", event: "Try-in returned", by: "OrthoLab London" },
      { at: "2026-04-28T15:30", event: "Try-in rejected", note: "Anterior tooth position — patient prefers more incisal display", by: LONDON.clinicianB },
      { at: "2026-04-29T09:00", event: "Remake initiated", note: "Altered VDO + revised tooth positions discussed with lab", by: LONDON.owner },
    ],
  },
];
