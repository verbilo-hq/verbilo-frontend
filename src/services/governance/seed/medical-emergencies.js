/**
 * Medical Emergencies Governance Pack — realistic demo dataset for
 * Dental Group (Southall, Reading, New Cross, London, Manchester,
 * Birmingham).
 *
 * Per-site emergency setup variation is deliberate:
 *   - Southall: full kit, BLS up to date, 6-monthly mock drill cadence.
 *   - Reading: full kit but AED pads expiring soon (evidence due).
 *   - New Cross: full kit + paediatric extras.
 *   - London: drug box check OVERDUE; BLS certificates gap.
 *   - Manchester: APPLIED to pack but partially configured (no equipment yet).
 *   - Birmingham: NOT applied to the pack (onboarding) — no overdue noise.
 *
 * Document set: 5 policies + 12 SOPs + 2 audit tools + 5 site appendices.
 * One SOP (Anaphylaxis Pathway) demonstrates version control:
 *   v1.0 archived → v1.1 published → v1.2 draft (New Cross-specific update).
 * One SOP (Mock Drill Procedure) is currently IN REVIEW.
 *
 * Anchored to: Resuscitation Council UK Quality Standards for CPR Practice
 * and Training (Dental Practice), GDC Standards, CQC Reg 12, BNF emergency
 * drug doses, SDCEP Drug Prescribing for Dentistry.
 */

import { Store, TABLES } from "../store";
import {
  DocumentScope, DocumentStatus, PackStatus, SiteStatus,
  EvidenceKind, EvidenceStatus, AuditRagStatus, AckStatus,
  EquipmentType, EquipmentStatus, EntitlementType,
  AUDIT_TYPES, DocumentType,
} from "../types";
import { DEMO_USERS } from "./users";

export const MEDICAL_EMERGENCIES_PACK_KEY = "medical_emergencies";

/* Real roster names sourced from the reseeded governance users, so document
 * bodies + audit-trail snapshots show the same canonical people as the user
 * records (no invented "Dr Sarah Johnson"/"Emma Williams"/… strings). */
const displayNameOf = (userId) =>
  DEMO_USERS.find((u) => u.id === userId)?.displayName ?? "—";
const CLINICAL_DIRECTOR_NAME = displayNameOf("user-cd");
const MED_EMERGENCY_LEAD_NAME = displayNameOf("user-ipc-group");

const today = new Date();
const at = (daysOffset) => {
  if (daysOffset === null || daysOffset === undefined) return null;
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
};

function hashIdx(seed, mod) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

/* ─── Site emergency profiles ─────────────────────────────────────────────── */

export const DEMO_MED_EMERG_PROFILES = [
  {
    siteId: "site-brighton",
    applied: true,
    drugBoxPresent: true,  aedPresent: true,  oxygenPresent: true,
    suctionPresent: true,  bagValveMaskPresent: true, bloodGlucosePresent: true,
    paediatricKitRequired: true,
    mockDrillRequired: true, mockDrillFrequency: "six_monthly",
    blsTrainingRequired: true, staffAcknowledgementRequired: true,
    medEmergencyLeadUserId: "user-ipc-group",
    resusLeadUserId:        "user-pm-brighton",
    practiceManagerUserId:  "user-pm-brighton",
    initialStatus: SiteStatus.live,
  },
  {
    siteId: "site-hove",
    applied: true,
    drugBoxPresent: true, aedPresent: true, oxygenPresent: true,
    suctionPresent: true, bagValveMaskPresent: true, bloodGlucosePresent: true,
    paediatricKitRequired: false,
    mockDrillRequired: true, mockDrillFrequency: "annual",
    blsTrainingRequired: true, staffAcknowledgementRequired: true,
    medEmergencyLeadUserId: "user-ipc-group",
    resusLeadUserId:        "user-pm-hove",
    practiceManagerUserId:  "user-pm-hove",
    initialStatus: SiteStatus.live,
  },
  {
    siteId: "site-worthing",
    applied: true,
    drugBoxPresent: true, aedPresent: true, oxygenPresent: true,
    suctionPresent: true, bagValveMaskPresent: true, bloodGlucosePresent: true,
    paediatricKitRequired: true,
    mockDrillRequired: true, mockDrillFrequency: "six_monthly",
    blsTrainingRequired: true, staffAcknowledgementRequired: true,
    medEmergencyLeadUserId: "user-ipc-group",
    resusLeadUserId:        "user-pm-worthing",
    practiceManagerUserId:  "user-pm-worthing",
    initialStatus: SiteStatus.live,
  },
  {
    siteId: "site-crawley",
    applied: true,
    drugBoxPresent: true, aedPresent: true, oxygenPresent: true,
    suctionPresent: true, bagValveMaskPresent: true, bloodGlucosePresent: true,
    paediatricKitRequired: false,
    mockDrillRequired: true, mockDrillFrequency: "annual",
    blsTrainingRequired: true, staffAcknowledgementRequired: true,
    medEmergencyLeadUserId: "user-ipc-group",
    resusLeadUserId:        "user-pm-crawley",
    practiceManagerUserId:  "user-pm-crawley",
    initialStatus: SiteStatus.evidence_overdue,
  },
  {
    siteId: "site-guildford",
    // Applied — but configuration gap demo: equipment register not yet built
    applied: true,
    drugBoxPresent: false, aedPresent: false, oxygenPresent: false,
    suctionPresent: false, bagValveMaskPresent: false, bloodGlucosePresent: false,
    paediatricKitRequired: false,
    mockDrillRequired: false, mockDrillFrequency: null,
    blsTrainingRequired: false, staffAcknowledgementRequired: false,
    medEmergencyLeadUserId: "user-ipc-group",
    resusLeadUserId: null,
    practiceManagerUserId: "user-pm-guildford",
    initialStatus: SiteStatus.partially_configured,
  },
  {
    siteId: "site-portsmouth",
    applied: false,
    drugBoxPresent: false, aedPresent: false, oxygenPresent: false,
    suctionPresent: false, bagValveMaskPresent: false, bloodGlucosePresent: false,
    paediatricKitRequired: false,
    mockDrillRequired: false, mockDrillFrequency: null,
    blsTrainingRequired: false, staffAcknowledgementRequired: false,
    medEmergencyLeadUserId: null, resusLeadUserId: null,
    practiceManagerUserId: null,
    initialStatus: SiteStatus.not_configured,
  },
];

/* ─── Equipment register per site ─────────────────────────────────────────── */

export const DEMO_MED_EMERG_EQUIPMENT = [
  // Southall — full kit, in date
  { id: "equip-emerg-br-drug-001",  siteId: "site-brighton", type: EquipmentType.emergency_drug_box,
    makeModel: "Stocked per RCUK 2022", serialNumber: "BR-DRUG-001", roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-25), nextServiceDate: at(5), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-br-aed-001",   siteId: "site-brighton", type: EquipmentType.aed_defibrillator,
    makeModel: "Zoll AED Plus",        serialNumber: "BR-AED-001",  roomLocation: "Reception wall", serviceProvider: "Zoll Medical UK",
    lastServiceDate: at(-180), nextServiceDate: at(185), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-br-o2-001",    siteId: "site-brighton", type: EquipmentType.oxygen_cylinder,
    makeModel: "BOC Size D, 460L",     serialNumber: "BR-O2-001",   roomLocation: "Reception cupboard", serviceProvider: "BOC Healthcare",
    lastServiceDate: at(-30),  nextServiceDate: at(335), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-br-suc-001",   siteId: "site-brighton", type: EquipmentType.portable_suction,
    makeModel: "Laerdal Compact Suction Unit 4", serialNumber: "BR-SUC-001", roomLocation: "Reception cupboard", serviceProvider: "Laerdal Medical",
    lastServiceDate: at(-95),  nextServiceDate: at(270), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-br-bvm-001",   siteId: "site-brighton", type: EquipmentType.bag_valve_mask,
    makeModel: "Ambu SPUR II (adult + paeds)", serialNumber: "BR-BVM-001", roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-25),  nextServiceDate: at(5),   status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-br-bg-001",    siteId: "site-brighton", type: EquipmentType.blood_glucose_meter,
    makeModel: "Accu-Chek Performa",   serialNumber: "BR-BG-001",   roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-25),  nextServiceDate: at(5),   status: EquipmentStatus.active, evidenceRequired: false },

  // Reading — full kit but AED pads expiring
  { id: "equip-emerg-hv-drug-001",  siteId: "site-hove", type: EquipmentType.emergency_drug_box,
    makeModel: "Stocked per RCUK 2022", serialNumber: "HV-DRUG-001", roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-22),  nextServiceDate: at(8),   status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-hv-aed-001",   siteId: "site-hove", type: EquipmentType.aed_defibrillator,
    makeModel: "Philips HeartStart FRx", serialNumber: "HV-AED-001", roomLocation: "Reception wall", serviceProvider: "Philips Healthcare",
    lastServiceDate: at(-345), nextServiceDate: at(20),  status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-hv-o2-001",    siteId: "site-hove", type: EquipmentType.oxygen_cylinder,
    makeModel: "BOC Size D, 460L",     serialNumber: "HV-O2-001",   roomLocation: "Reception cupboard", serviceProvider: "BOC Healthcare",
    lastServiceDate: at(-40),  nextServiceDate: at(325), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-hv-suc-001",   siteId: "site-hove", type: EquipmentType.portable_suction,
    makeModel: "Laerdal Compact Suction Unit 4", serialNumber: "HV-SUC-001", roomLocation: "Reception cupboard", serviceProvider: "Laerdal Medical",
    lastServiceDate: at(-92),  nextServiceDate: at(273), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-hv-bvm-001",   siteId: "site-hove", type: EquipmentType.bag_valve_mask,
    makeModel: "Ambu SPUR II (adult)", serialNumber: "HV-BVM-001", roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-22),  nextServiceDate: at(8),   status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-hv-bg-001",    siteId: "site-hove", type: EquipmentType.blood_glucose_meter,
    makeModel: "Accu-Chek Performa",   serialNumber: "HV-BG-001",   roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-22),  nextServiceDate: at(8),   status: EquipmentStatus.active, evidenceRequired: false },

  // New Cross — full kit + paeds
  { id: "equip-emerg-wo-drug-001",  siteId: "site-worthing", type: EquipmentType.emergency_drug_box,
    makeModel: "Stocked per RCUK 2022 (adult+paeds)", serialNumber: "WO-DRUG-001", roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-15),  nextServiceDate: at(15),  status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-wo-aed-001",   siteId: "site-worthing", type: EquipmentType.aed_defibrillator,
    makeModel: "Zoll AED Plus (adult+paeds pads)", serialNumber: "WO-AED-001", roomLocation: "Reception wall", serviceProvider: "Zoll Medical UK",
    lastServiceDate: at(-180), nextServiceDate: at(185), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-wo-o2-001",    siteId: "site-worthing", type: EquipmentType.oxygen_cylinder,
    makeModel: "BOC Size D, 460L (×2 — adult + paeds masks)", serialNumber: "WO-O2-001", roomLocation: "Reception cupboard", serviceProvider: "BOC Healthcare",
    lastServiceDate: at(-25),  nextServiceDate: at(340), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-wo-suc-001",   siteId: "site-worthing", type: EquipmentType.portable_suction,
    makeModel: "Laerdal Compact Suction Unit 4", serialNumber: "WO-SUC-001", roomLocation: "Reception cupboard", serviceProvider: "Laerdal Medical",
    lastServiceDate: at(-100), nextServiceDate: at(265), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-wo-bvm-001",   siteId: "site-worthing", type: EquipmentType.bag_valve_mask,
    makeModel: "Ambu SPUR II (adult + paeds + infant)", serialNumber: "WO-BVM-001", roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-15),  nextServiceDate: at(15),  status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-wo-bg-001",    siteId: "site-worthing", type: EquipmentType.blood_glucose_meter,
    makeModel: "Accu-Chek Performa",   serialNumber: "WO-BG-001",   roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-15),  nextServiceDate: at(15),  status: EquipmentStatus.active, evidenceRequired: false },

  // London — drug box check OVERDUE (last service > 30 days), BLS certificates gap
  { id: "equip-emerg-cr-drug-001",  siteId: "site-crawley", type: EquipmentType.emergency_drug_box,
    makeModel: "Stocked per RCUK 2022", serialNumber: "CR-DRUG-001", roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-55),  nextServiceDate: at(-25), status: EquipmentStatus.overdue_service, evidenceRequired: true },
  { id: "equip-emerg-cr-aed-001",   siteId: "site-crawley", type: EquipmentType.aed_defibrillator,
    makeModel: "Zoll AED Plus",        serialNumber: "CR-AED-001",  roomLocation: "Reception wall", serviceProvider: "Zoll Medical UK",
    lastServiceDate: at(-200), nextServiceDate: at(165), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-cr-o2-001",    siteId: "site-crawley", type: EquipmentType.oxygen_cylinder,
    makeModel: "BOC Size D, 460L",     serialNumber: "CR-O2-001",   roomLocation: "Reception cupboard", serviceProvider: "BOC Healthcare",
    lastServiceDate: at(-50),  nextServiceDate: at(315), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-cr-suc-001",   siteId: "site-crawley", type: EquipmentType.portable_suction,
    makeModel: "Laerdal Compact Suction Unit 4", serialNumber: "CR-SUC-001", roomLocation: "Reception cupboard", serviceProvider: "Laerdal Medical",
    lastServiceDate: at(-110), nextServiceDate: at(255), status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-emerg-cr-bvm-001",   siteId: "site-crawley", type: EquipmentType.bag_valve_mask,
    makeModel: "Ambu SPUR II (adult)", serialNumber: "CR-BVM-001", roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-55),  nextServiceDate: at(-25), status: EquipmentStatus.overdue_service, evidenceRequired: true },
  { id: "equip-emerg-cr-bg-001",    siteId: "site-crawley", type: EquipmentType.blood_glucose_meter,
    makeModel: "Accu-Chek Performa",   serialNumber: "CR-BG-001",   roomLocation: "Reception cupboard", serviceProvider: "Internal",
    lastServiceDate: at(-55),  nextServiceDate: at(-25), status: EquipmentStatus.overdue_service, evidenceRequired: false },

  // Manchester + Birmingham — no equipment (configuration gap / not applied).
];

/* ─── Documents ───────────────────────────────────────────────────────────── */

const DEFAULT_EMERG_BODY = (title, ref) => `# ${title}

_Group-wide controlled document for the Medical Emergencies Governance Pack._

## 1. Purpose
Defines the controlled procedure for **${title.toLowerCase()}** across Dental Group sites where the relevant emergency equipment, drugs or training is in scope.

## 2. Scope
Applies to every clinical staff member (dentist, hygienist, therapist, dental nurse) at each applied site, plus the practice manager and emergency lead.

## 3. Roles & responsibilities
- **Document Owner:** Medical Emergencies Lead (${MED_EMERGENCY_LEAD_NAME})
- **Approver:** Clinical Director (${CLINICAL_DIRECTOR_NAME})
- **Local execution:** Site Resuscitation Lead + clinical team

## 4. Procedure
On publish, the platform auto-populates local detail (drug box stock list,
AED location, oxygen cylinder size, BLS-trained staff list, mock drill
schedule) from each site's Medical Emergencies Profile and Equipment Register.

## 5. References
- ${ref || "Resuscitation Council UK Quality Standards for CPR Practice and Training"}
`;

const policy = (id, title, refs = ["Resuscitation Council UK"]) => ({
  id, title, type: DocumentType.policy, category: "medical_emergencies",
  scope: DocumentScope.group, references: refs,
  versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
  body: DEFAULT_EMERG_BODY(title, refs[0]),
});

const sop = (id, title, opts = {}) => ({
  id, title, type: DocumentType.sop, category: opts.category ?? "medical_emergencies",
  scope: DocumentScope.group, references: opts.references ?? ["Resuscitation Council UK"],
  requiredFlag: opts.requiredFlag ?? null,
  linkedAuditType: opts.linkedAuditType ?? null,
  versions: opts.versions ?? [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 125 }],
  body: opts.body ?? DEFAULT_EMERG_BODY(title, opts.references?.[0]),
});

const auditTool = (id, title, opts = {}) => ({
  id, title, type: DocumentType.audit_tool, category: "audit",
  scope: DocumentScope.group, references: opts.references ?? ["Resuscitation Council UK"],
  linkedAuditType: opts.linkedAuditType ?? null,
  versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 125 }],
  body: DEFAULT_EMERG_BODY(title, opts.references?.[0]),
});

const siteAppendix = (id, title, opts) => ({
  id, title, type: DocumentType.appendix, category: opts.category ?? "appendix",
  scope: DocumentScope.site,
  appliesToSiteId: opts.siteId, parentDocumentId: opts.parentDocumentId,
  references: opts.references ?? ["Resuscitation Council UK"],
  versions: opts.versions ?? [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 90 }],
  body: opts.body ?? DEFAULT_EMERG_BODY(title, opts.references?.[0]),
});

export const DEMO_MED_EMERG_DOCUMENTS = [
  /* Policies (5) */
  policy("doc-emerg-policy-medical-emergencies", "Medical Emergencies Policy",
    ["Resuscitation Council UK", "CQC Reg 12", "GDC Standards"]),
  policy("doc-emerg-policy-bls",                 "Basic Life Support Policy",
    ["Resuscitation Council UK Adult BLS Guidelines 2021"]),
  policy("doc-emerg-policy-drug-box",            "Emergency Drug Box Policy",
    ["BNF emergency doses", "RCUK Quality Standards for CPR (Dental)"]),
  policy("doc-emerg-policy-aed",                 "AED Maintenance and Use Policy",
    ["Resuscitation Council UK", "MHRA medical device guidance"]),
  policy("doc-emerg-policy-training",            "Mock Drill and Emergency Training Policy",
    ["RCUK Quality Standards for CPR (Dental)", "GDC CPD requirements"]),

  /* SOPs (12) */
  // Anaphylaxis Pathway — VERSION CONTROL DEMO
  sop("doc-emerg-sop-anaphylaxis", "Anaphylaxis Recognition and Treatment Pathway", {
    references: ["RCUK Emergency Treatment of Anaphylactic Reactions"],
    linkedAuditType: "emergency_readiness",
    versions: [
      { versionNumber: "1.0", status: DocumentStatus.archived,  publishedDaysAgo: 420, archivedDaysAgo: 95,  changeSummary: "Initial version — superseded by 1.1" },
      { versionNumber: "1.1", status: DocumentStatus.published, publishedDaysAgo: 95,                       changeSummary: "Updated to reflect RCUK 2021 algorithm + IM-only adrenaline route in dental practice." },
      { versionNumber: "1.2", status: DocumentStatus.draft,     submittedDaysAgo: null,                     changeSummary: "Draft — adds paediatric dose card (New Cross)." },
    ],
  }),

  sop("doc-emerg-sop-adult-bls",       "Adult BLS Procedure (DRSABCD)",            { linkedAuditType: "bls_training" }),
  sop("doc-emerg-sop-paediatric-bls",  "Paediatric BLS Procedure",                  { linkedAuditType: "bls_training", requiredFlag: "paediatricKitRequired" }),

  sop("doc-emerg-sop-hypoglycaemia",   "Hypoglycaemia Pathway (Conscious / Unconscious)",
    { references: ["RCUK", "BNF — Glucagon / oral glucose"], linkedAuditType: "emergency_readiness" }),
  sop("doc-emerg-sop-asthma",          "Acute Asthma Pathway",
    { references: ["BTS/SIGN British Guideline on the Management of Asthma"], linkedAuditType: "emergency_readiness" }),
  sop("doc-emerg-sop-choking",         "Choking / Airway Obstruction Pathway",     { linkedAuditType: "emergency_readiness" }),
  sop("doc-emerg-sop-epilepsy",        "Status Epilepticus Pathway (Buccal Midazolam)",
    { references: ["NICE NG217 — Epilepsies"], linkedAuditType: "emergency_readiness" }),
  sop("doc-emerg-sop-mi-angina",       "Acute MI / Angina Pathway",                 { linkedAuditType: "emergency_readiness" }),
  sop("doc-emerg-sop-syncope",         "Syncope / Vasovagal Pathway",               { linkedAuditType: "emergency_readiness" }),

  sop("doc-emerg-sop-aed-use",         "AED Operation Procedure",
    { references: ["RCUK", "MHRA"], requiredFlag: "aedPresent", linkedAuditType: "aed_check" }),

  // Mock Drill Procedure — IN REVIEW
  sop("doc-emerg-sop-mock-drill",      "Mock Emergency Drill Procedure", {
    references: ["RCUK Quality Standards for CPR (Dental)"],
    requiredFlag: "mockDrillRequired",
    linkedAuditType: "mock_drill",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.in_review, submittedDaysAgo: 11,
                 changeSummary: "Initial draft submitted — scenario library + after-action review template." }],
  }),

  sop("doc-emerg-sop-incident-review", "Emergency Incident Review Procedure",
    { linkedAuditType: "emergency_incident_review" }),

  /* Audit tools (2) */
  auditTool("doc-emerg-audit-readiness",   "Emergency Readiness Audit Tool",
    { linkedAuditType: "emergency_readiness" }),
  auditTool("doc-emerg-audit-mock-drill",  "Mock Drill After-Action Audit Tool",
    { linkedAuditType: "mock_drill" }),
];

/* ─── Site-specific appendices ────────────────────────────────────────────── */

export const DEMO_MED_EMERG_APPENDICES = [
  siteAppendix("doc-emerg-app-brighton-emergency-plan", "Southall Site Emergency Plan",
    { siteId: "site-brighton", parentDocumentId: "doc-emerg-policy-medical-emergencies" }),
  siteAppendix("doc-emerg-app-hove-emergency-plan",     "Reading Site Emergency Plan",
    { siteId: "site-hove",     parentDocumentId: "doc-emerg-policy-medical-emergencies" }),
  siteAppendix("doc-emerg-app-worthing-emergency-plan", "New Cross Site Emergency Plan (incl. paediatric kit list)",
    { siteId: "site-worthing", parentDocumentId: "doc-emerg-policy-medical-emergencies" }),

  // London appendix REVIEW DUE
  siteAppendix("doc-emerg-app-crawley-emergency-plan", "London Site Emergency Plan",
    { siteId: "site-crawley",  parentDocumentId: "doc-emerg-policy-medical-emergencies",
      versions: [{ versionNumber: "1.0", status: DocumentStatus.review_due, publishedDaysAgo: 360, reviewDaysFromNow: -5,
                   changeSummary: "Review overdue — annual update + BLS roster refresh." }] }),

  siteAppendix("doc-emerg-app-worthing-paeds-doses",   "New Cross Paediatric Emergency Dose Card",
    { siteId: "site-worthing", parentDocumentId: "doc-emerg-policy-drug-box",
      references: ["BNF for Children", "APLS"] }),
];

/* ─── Seed body ───────────────────────────────────────────────────────────── */

export function seedMedicalEmergencies(user, { insertWithId }) {
  const tenantId = user.tenantId;
  const allDocs = [...DEMO_MED_EMERG_DOCUMENTS, ...DEMO_MED_EMERG_APPENDICES];

  /* 1. Pack instance */
  const pack = insertWithId(tenantId, TABLES.packs, {
    id: "pack-medical-emergencies",
    packKey: MEDICAL_EMERGENCIES_PACK_KEY,
    status: PackStatus.live,
    groupName: "Dental Group",
    brandColor: "#1565c0",
    logoDataUrl: "",
    reviewCycleMonths: 12,
    clinicalDirectorUserId:           "user-cd",
    groupMedEmergencyLeadUserId:      "user-ipc-group",
    groupResusLeadUserId:             "user-pm-brighton",
    groupGovernanceLeadUserId:        "user-gov",
    defaultApproverUserId:            "user-cd",
    defaultReviewerUserId:            "user-gov",
  });

  /* 2. Site emergency profiles */
  const profilesBySite = new Map();
  for (const cfg of DEMO_MED_EMERG_PROFILES) {
    profilesBySite.set(cfg.siteId, cfg);
    insertWithId(tenantId, TABLES.site_profiles, {
      id: `profile-emerg-${cfg.siteId}`,
      siteId: cfg.siteId,
      packInstanceId: pack.id,
      packKey: MEDICAL_EMERGENCIES_PACK_KEY,
      applied: cfg.applied,
      drugBoxPresent: cfg.drugBoxPresent, aedPresent: cfg.aedPresent,
      oxygenPresent: cfg.oxygenPresent, suctionPresent: cfg.suctionPresent,
      bagValveMaskPresent: cfg.bagValveMaskPresent, bloodGlucosePresent: cfg.bloodGlucosePresent,
      paediatricKitRequired: cfg.paediatricKitRequired,
      mockDrillRequired: cfg.mockDrillRequired, mockDrillFrequency: cfg.mockDrillFrequency,
      blsTrainingRequired: cfg.blsTrainingRequired, staffAcknowledgementRequired: cfg.staffAcknowledgementRequired,
      medEmergencyLeadUserId: cfg.medEmergencyLeadUserId,
      resusLeadUserId: cfg.resusLeadUserId,
      practiceManagerUserId: cfg.practiceManagerUserId,
      status: cfg.initialStatus,
    });
  }

  /* 3. Equipment */
  for (const e of DEMO_MED_EMERG_EQUIPMENT) {
    insertWithId(tenantId, TABLES.equipment, {
      ...e,
      packKey: MEDICAL_EMERGENCIES_PACK_KEY,
      siteProfileId: `profile-emerg-${e.siteId}`,
    });
  }

  /* 4. Documents + versions */
  for (const d of allDocs) {
    const versions = d.versions;
    const published = versions.find((v) => v.status === DocumentStatus.published);
    const reviewDue = versions.find((v) => v.status === DocumentStatus.review_due);
    const expired   = versions.find((v) => v.status === DocumentStatus.expired);
    const inReview  = versions.find((v) => v.status === DocumentStatus.in_review);
    const draft     = versions.find((v) => v.status === DocumentStatus.draft);
    let docStatus =
      published ? DocumentStatus.published :
      reviewDue ? DocumentStatus.review_due :
      expired   ? DocumentStatus.expired   :
      inReview  ? DocumentStatus.in_review  :
      draft     ? DocumentStatus.draft     :
                  versions[versions.length - 1].status;

    insertWithId(tenantId, TABLES.documents, {
      id: d.id,
      tenantId,
      packKey: MEDICAL_EMERGENCIES_PACK_KEY,
      packInstanceId: pack.id,
      title: d.title,
      type: d.type,
      category: d.category,
      scope: d.scope ?? DocumentScope.group,
      appliesToSiteId: d.appliesToSiteId ?? null,
      appliesToRole: d.appliesToRole ?? null,
      parentDocumentId: d.parentDocumentId ?? null,
      requiredFlag: d.requiredFlag ?? null,
      currentVersionId: null,
      status: docStatus,
      references: d.references ?? [],
      acknowledgementRequired: (d.type === DocumentType.policy || d.type === DocumentType.sop || d.type === DocumentType.appendix),
      linkedAuditType: d.linkedAuditType ?? null,
    });

    let currentVersionId = null;
    for (const v of versions) {
      const versionId = `version-${d.id}-v${v.versionNumber}`;
      const isLive = v.status === DocumentStatus.published || v.status === DocumentStatus.review_due || v.status === DocumentStatus.expired;
      const reviewOffset = typeof v.reviewDaysFromNow === "number" ? v.reviewDaysFromNow : 365 - (v.publishedDaysAgo ?? 0);
      insertWithId(tenantId, TABLES.document_versions, {
        id: versionId,
        documentId: d.id,
        versionNumber: v.versionNumber,
        major: !v.versionNumber.includes(".") || v.versionNumber.endsWith(".0"),
        body: d.body ?? DEFAULT_EMERG_BODY(d.title, d.references?.[0]),
        ownerUserId: "user-ipc-group",
        approverUserId: isLive ? "user-cd" : null,
        reviewerUserId: "user-gov",
        status: v.status,
        submittedAt:    v.submittedDaysAgo  ? at(-v.submittedDaysAgo) : (isLive ? at(-(v.publishedDaysAgo ?? 0) - 7) : null),
        approvedAt:     isLive              ? at(-(v.publishedDaysAgo ?? 0) - 2) : null,
        publishedAt:    isLive              ? at(-(v.publishedDaysAgo ?? 0))     : null,
        effectiveDate:  isLive              ? at(-(v.publishedDaysAgo ?? 0))     : null,
        nextReviewDate: isLive              ? at(reviewOffset)                   : null,
        archivedAt:     v.archivedDaysAgo   ? at(-v.archivedDaysAgo)             : null,
        changeSummary:  v.changeSummary ?? (v.versionNumber === "1.0" ? "Initial published version" : "Revision"),
      });
      if (v.status === DocumentStatus.published || v.status === DocumentStatus.review_due || v.status === DocumentStatus.expired) {
        currentVersionId = versionId;
      } else if (!currentVersionId && (v.status === DocumentStatus.in_review || v.status === DocumentStatus.draft)) {
        currentVersionId = versionId;
      }
    }
    Store.update(tenantId, TABLES.documents, d.id, { currentVersionId });
  }

  /* 5. BLS competency entitlements (reused operator_entitlements table) */
  const appliedSites = DEMO_MED_EMERG_PROFILES.filter((p) => p.applied).map((p) => p.siteId);
  const appliedSet = new Set(appliedSites);
  const BLS_USER_IDS = [
    "user-bn-1", "user-bn-2", "user-bn-3", "user-bn-6",
    "user-hv-1", "user-hv-2", "user-hv-3",
    "user-wo-1", "user-wo-2",
    "user-cr-1", "user-cr-2",
    "user-gu-1", "user-gu-2",
    "user-pm-brighton", "user-pm-hove", "user-pm-worthing", "user-pm-crawley", "user-pm-guildford",
    "user-ipc-group", "user-cd",
  ];

  function siteOfUser(uid) {
    let m = uid.match(/-(brighton|hove|worthing|crawley|guildford|portsmouth)$/);
    if (m) return `site-${m[1]}`;
    m = uid.match(/^user-(bn|hv|wo|cr|gu|po)-/);
    if (m) return ({ bn: "site-brighton", hv: "site-hove", wo: "site-worthing", cr: "site-crawley", gu: "site-guildford", po: "site-portsmouth" })[m[1]];
    return null;
  }

  for (const uid of BLS_USER_IDS) {
    const siteId = siteOfUser(uid);
    if (siteId && !appliedSet.has(siteId)) continue;
    const isLondon = siteId === "site-crawley";
    const r = hashIdx(`${uid}::bls`, 12);

    // London demo: 30% of staff have lapsed BLS certificates
    if (isLondon && r < 4) continue; // simulate gap

    let entitled = true;
    let entitlementDate = at(-300 - r * 3);
    let reviewDate = at(60 - r * 5);
    let expiryDate = at(365 - r * 7);
    let evidenceFileKey = `bls:${uid}`;
    let notes = null;

    if (isLondon && r >= 9) { evidenceFileKey = null; notes = "London refresh batch — BLS certificate not yet on file"; }
    else if (r === 10)       { expiryDate = at(-12); reviewDate = at(-45); notes = "BLS certificate lapsed — refresher required"; }
    else if (r === 11)       { entitled = false; evidenceFileKey = null; notes = "Entitlement withdrawn pending re-training"; }

    insertWithId(tenantId, TABLES.operator_entitlements, {
      id: `ent-emerg-${uid}-bls`,
      userId: uid,
      siteId: siteId ?? null,
      equipmentClass: "bls_provider",
      entitled,
      entitlementDate,
      reviewDate,
      expiryDate,
      evidenceFileKey,
      approvedByUserId: profilesBySite.get(siteId ?? "")?.resusLeadUserId ?? "user-ipc-group",
      notes,
      packKey: MEDICAL_EMERGENCIES_PACK_KEY,
    });
  }

  /* 6. Acknowledgements */
  function isSiteApplicable(doc, siteId) {
    if (doc.scope === DocumentScope.site) return doc.appliesToSiteId === siteId;
    if (!doc.requiredFlag) return true;
    const p = profilesBySite.get(siteId);
    return !!p?.[doc.requiredFlag];
  }
  const ackUserIds = ["user-cd", "user-ipc-group", "user-gov", ...BLS_USER_IDS];

  for (const d of allDocs) {
    if (!(d.type === DocumentType.policy || d.type === DocumentType.sop || d.type === DocumentType.appendix)) continue;
    const liveVersion = d.versions.find((v) => v.status === DocumentStatus.published || v.status === DocumentStatus.review_due || v.status === DocumentStatus.expired);
    if (!liveVersion) continue;
    const versionId = `version-${d.id}-v${liveVersion.versionNumber}`;

    for (const uid of ackUserIds) {
      const siteForUser = siteOfUser(uid);
      if (siteForUser) {
        if (!appliedSet.has(siteForUser)) continue;
        if (!isSiteApplicable(d, siteForUser)) continue;
      }
      const r = hashIdx(`${d.id}::${uid}::emerg-ack`, 10);
      let status = AckStatus.acknowledged;
      let acknowledgedAt = at(-(liveVersion.publishedDaysAgo ?? 60) + r * 2);
      let dueDate = at((liveVersion.publishedDaysAgo ?? 60) > 60 ? -10 - r : 14);
      if (r >= 7 && r < 9) { status = AckStatus.assigned; acknowledgedAt = null; dueDate = at(14 - r); }
      else if (r >= 9)     { status = AckStatus.overdue;  acknowledgedAt = null; dueDate = at(-15 - r); }

      insertWithId(tenantId, TABLES.acknowledgements, {
        id: `ack-emerg-${d.id}-${uid}`,
        documentId: d.id,
        documentVersionId: versionId,
        userId: uid,
        siteId: siteForUser,
        assignedAt: at(-(liveVersion.publishedDaysAgo ?? 60)),
        dueDate,
        acknowledgedAt,
        reminderCount: status === AckStatus.overdue ? 2 : 0,
        status,
      });
    }
  }

  /* 7. Evidence */
  function kindFor(doc) {
    if (doc.type === DocumentType.audit_tool) return EvidenceKind.audit_result;
    if (doc.type === DocumentType.log_template) return EvidenceKind.log_entry;
    return EvidenceKind.attestation;
  }
  const equipBySiteAndFlag = (siteId, flag) => {
    return DEMO_MED_EMERG_EQUIPMENT.find((e) => e.siteId === siteId && (
      (flag === "drugBoxPresent"   && e.type === EquipmentType.emergency_drug_box) ||
      (flag === "aedPresent"       && e.type === EquipmentType.aed_defibrillator) ||
      (flag === "oxygenPresent"    && e.type === EquipmentType.oxygen_cylinder) ||
      (flag === "suctionPresent"   && e.type === EquipmentType.portable_suction)
    ));
  };

  for (const d of allDocs) {
    for (const sid of appliedSites) {
      const applicable = isSiteApplicable(d, sid);
      if (!applicable) {
        insertWithId(tenantId, TABLES.evidence, {
          id: `ev-emerg-${d.id}-${sid}-na`,
          siteId: sid,
          packInstanceId: pack.id,
          packKey: MEDICAL_EMERGENCIES_PACK_KEY,
          documentId: d.id,
          equipmentId: null,
          auditScheduleId: null,
          kind: kindFor(d),
          title: `${d.title} (not applicable)`,
          status: EvidenceStatus.not_applicable,
          dueDate: null, uploadedAt: null, uploadedByUserId: null,
          fileKey: null,
          notes: "Not applicable at this site per Medical Emergencies Profile.",
        });
        continue;
      }

      const r = hashIdx(`${d.id}::${sid}::ev-emerg`, 12);
      const isLondon = sid === "site-crawley";
      const isManchester = sid === "site-guildford";
      const isDrugBoxDoc = /drug-box|anaphylaxis|hypoglycaemia|asthma|epilepsy|mi-angina/.test(d.id);
      const isBlsDoc = /bls|mock-drill/.test(d.id);

      let status;
      if (isManchester) {
        status = r < 8 ? EvidenceStatus.required : EvidenceStatus.overdue;
      } else if (isLondon && isDrugBoxDoc) {
        status = EvidenceStatus.overdue;
      } else if (isLondon && isBlsDoc) {
        status = r < 5 ? EvidenceStatus.overdue : EvidenceStatus.required;
      } else {
        status =
          r < 7 ? EvidenceStatus.accepted :
          r < 8 ? EvidenceStatus.submitted :
          r < 9 ? EvidenceStatus.required :
          r < 11 ? EvidenceStatus.overdue :
                  EvidenceStatus.expired;
      }

      const eqMatch = d.requiredFlag ? equipBySiteAndFlag(sid, d.requiredFlag) : null;
      insertWithId(tenantId, TABLES.evidence, {
        id: `ev-emerg-${d.id}-${sid}`,
        siteId: sid,
        packInstanceId: pack.id,
        packKey: MEDICAL_EMERGENCIES_PACK_KEY,
        documentId: d.id,
        equipmentId: eqMatch?.id ?? null,
        auditScheduleId: null,
        kind: kindFor(d),
        title: d.title,
        status,
        dueDate: at(status === EvidenceStatus.required ? 14 : status === EvidenceStatus.overdue ? -15 : null),
        uploadedAt: (status === EvidenceStatus.accepted || status === EvidenceStatus.submitted) ? at(-r) : null,
        uploadedByUserId: (status === EvidenceStatus.accepted || status === EvidenceStatus.submitted)
          ? (profilesBySite.get(sid)?.resusLeadUserId ?? "user-ipc-group") : null,
        fileKey: null,
        notes: null,
        expiryDate: status === EvidenceStatus.expired ? at(-30) : null,
        reviewedAt: status === EvidenceStatus.accepted ? at(-r + 1) : null,
        reviewedByUserId: status === EvidenceStatus.accepted ? "user-gov" : null,
      });
    }
  }

  /* 8. Audit schedules */
  const emergencyAuditTypes = AUDIT_TYPES.filter((a) => a.pack === MEDICAL_EMERGENCIES_PACK_KEY);
  for (const sid of appliedSites) {
    const profile = profilesBySite.get(sid);
    for (const at_ of emergencyAuditTypes) {
      if (at_.requiredFlag && !profile[at_.requiredFlag]) continue;

      const isLondonOverdue = sid === "site-crawley" && (at_.id === "drug_box_check" || at_.id === "bls_training");
      const isManchester = sid === "site-guildford";
      const r = hashIdx(`${sid}::${at_.id}::emerg`, 10);
      const overdue = isLondonOverdue || isManchester || r >= 8;
      const completed = !overdue && r < 6;
      const score = completed ? 65 + (r * 5) : null;
      const rag = !completed ? AuditRagStatus.unknown :
                  score >= 90 ? AuditRagStatus.green :
                  score >= 75 ? AuditRagStatus.amber :
                                AuditRagStatus.red;

      insertWithId(tenantId, TABLES.audits, {
        id: `audit-emerg-${sid}-${at_.id}`,
        siteId: sid,
        packInstanceId: pack.id,
        packKey: MEDICAL_EMERGENCIES_PACK_KEY,
        auditType: at_.id,
        frequency: at_.defaultFreq,
        ownerUserId: profile.resusLeadUserId ?? "user-ipc-group",
        nextDueDate: at(overdue ? -10 - r : 14 + r),
        lastCompletedAt: completed ? at(-(15 + r * 3)) : null,
        lastScore: score,
        ragStatus: rag,
        overdue,
        actionsRaised: overdue ? Math.max(1, r % 4) : 0,
        recurringFindings: rag === AuditRagStatus.red ? ["Drug box stock gaps", "BLS certificate currency"] : [],
      });
    }
  }

  /* 9. Audit-trail seed */
  const trailEvents = [
    { objectType: "pack", action: "approve", at: at(-140), userId: "user-cd", userDisplay: displayNameOf("user-cd"),
      objectId: "pack-medical-emergencies", newValue: { status: "live", packKey: MEDICAL_EMERGENCIES_PACK_KEY } },
    { objectType: "document", objectId: "doc-emerg-sop-anaphylaxis", action: "publish_minor",
      at: at(-95), userId: "user-cd", userDisplay: displayNameOf("user-cd"), newValue: { versionNumber: "1.1" } },
    { objectType: "document", objectId: "doc-emerg-sop-anaphylaxis", action: "create_draft",
      at: at(-14), userId: "user-ipc-group", userDisplay: displayNameOf("user-ipc-group"), newValue: { versionNumber: "1.2", status: "draft" } },
    { objectType: "document", objectId: "doc-emerg-sop-mock-drill", action: "submit_for_review",
      at: at(-11), userId: "user-ipc-group", userDisplay: displayNameOf("user-ipc-group"), newValue: { status: "in_review" } },
    { objectType: "site_profile", objectId: "profile-emerg-site-guildford", action: "edit", at: at(-25),
      userId: "user-pm-guildford", userDisplay: displayNameOf("user-pm-guildford"), siteId: "site-guildford",
      newValue: { applied: true } },
  ];
  for (const e of trailEvents) {
    insertWithId(tenantId, TABLES.audit_trail, {
      id: `trail-emerg-${e.objectId ?? "pack"}-${Math.abs(hashIdx(JSON.stringify(e), 10000))}`,
      ...e,
      objectId: e.objectId ?? null,
      previousValue: null,
    });
  }
}
