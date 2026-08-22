/**
 * Radiography & IRMER Governance Pack — realistic demo dataset for
 * Dental Group (Southall, Reading, New Cross, London, Manchester,
 * Birmingham).
 *
 * Each site has a deliberately different radiography setup so the demo can
 * prove the system handles site variation:
 *   - Southall: intraoral + OPG + digital sensors (no CBCT)
 *   - Reading: intraoral + phosphor plates only
 *   - New Cross: intraoral + OPG + CBCT + digital sensors
 *   - London: intraoral + digital sensors; local-rules + image-quality OVERDUE
 *   - Manchester: applied but partially configured — no RPS, no equipment,
 *                no local rules → configuration gap
 *   - Birmingham: NOT applied to the pack (onboarding) — no overdue noise
 *
 * Documents are version-controlled: IRMER Employer Procedures has v1.0 archived
 * / v1.1 published / v1.2 draft — only the published version is visible to
 * staff; governance users see all three. Acknowledgements are tied to v1.1.
 *
 * Evidence is keyed to site × document, with `not_applicable` rows for the
 * doc/site combinations the radiography profile excludes. Audit schedules are
 * skipped where the relevant `requiredFlag` is off for that site.
 */

import { Store, TABLES } from "../store";
import {
  DocumentScope, DocumentStatus, PackStatus, SiteStatus,
  EvidenceKind, EvidenceStatus, AuditRagStatus, AckStatus,
  EquipmentType, EquipmentStatus, EntitlementType,
  AUDIT_TYPES, DocumentType,
} from "../types";
import { DEMO_USERS } from "./users";

export const RADIOGRAPHY_PACK_KEY = "radiography_irmer";

/* Real roster names sourced from the reseeded governance users, so document
 * bodies + audit-trail snapshots show the same canonical people as the user
 * records (no invented "Dr Sarah Johnson"/"Emma Williams"/… strings). */
const displayNameOf = (userId) =>
  DEMO_USERS.find((u) => u.id === userId)?.displayName ?? "—";
const CLINICAL_DIRECTOR_NAME = displayNameOf("user-cd");
const IRMER_LEAD_NAME = displayNameOf("user-ipc-group");

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

/* ─── Site radiography profiles ───────────────────────────────────────────── */

export const DEMO_RADIOGRAPHY_PROFILES = [
  {
    siteId: "site-brighton",
    applied: true,
    intraoralXray: true,  opgXray: true,  cbctXray: false,
    handheldXray: false,  digitalSensors: true, phosphorPlates: false,
    filmProcessing: false, controlledAreas: true, localRulesRequired: true,
    imageQualityAuditRequired: true, qaRecordsRequired: true,
    maintenanceRecordsRequired: true, staffAcknowledgementRequired: true,
    irmerLeadUserId:   "user-ipc-group",
    rpsUserId:         "user-pm-brighton",
    practiceManagerUserId: "user-pm-brighton",
    rpaProviderName:   "Physics Protection Ltd",
    rpaContact:        "rpa@physicsprotection.example.co.uk",
    rpaReviewDate:     at(120),
    mpeProviderName:   "Dental Physics Services Ltd",
    mpeContact:        "mpe@dentalphysics.example.co.uk",
    mpeReviewDate:     at(180),
    initialStatus: SiteStatus.live,
  },
  {
    siteId: "site-hove",
    applied: true,
    intraoralXray: true, opgXray: false, cbctXray: false,
    handheldXray: false, digitalSensors: false, phosphorPlates: true,
    filmProcessing: false, controlledAreas: true, localRulesRequired: true,
    imageQualityAuditRequired: true, qaRecordsRequired: true,
    maintenanceRecordsRequired: true, staffAcknowledgementRequired: true,
    irmerLeadUserId: "user-ipc-group",
    rpsUserId:       "user-pm-hove",
    practiceManagerUserId: "user-pm-hove",
    rpaProviderName: "Physics Protection Ltd",
    rpaContact:      "rpa@physicsprotection.example.co.uk",
    rpaReviewDate:   at(120),
    mpeProviderName: "Dental Physics Services Ltd",
    mpeContact:      "mpe@dentalphysics.example.co.uk",
    mpeReviewDate:   at(180),
    initialStatus: SiteStatus.live,
  },
  {
    siteId: "site-worthing",
    applied: true,
    intraoralXray: true, opgXray: true, cbctXray: true,
    handheldXray: false, digitalSensors: true, phosphorPlates: false,
    filmProcessing: false, controlledAreas: true, localRulesRequired: true,
    imageQualityAuditRequired: true, qaRecordsRequired: true,
    maintenanceRecordsRequired: true, staffAcknowledgementRequired: true,
    irmerLeadUserId: "user-ipc-group",
    rpsUserId:       "user-pm-worthing",
    practiceManagerUserId: "user-pm-worthing",
    rpaProviderName: "Physics Protection Ltd",
    rpaContact:      "rpa@physicsprotection.example.co.uk",
    rpaReviewDate:   at(120),
    mpeProviderName: "Dental Physics Services Ltd",
    mpeContact:      "mpe@dentalphysics.example.co.uk",
    mpeReviewDate:   at(60),
    initialStatus: SiteStatus.live,
  },
  {
    siteId: "site-crawley",
    applied: true,
    intraoralXray: true, opgXray: false, cbctXray: false,
    handheldXray: false, digitalSensors: true, phosphorPlates: false,
    filmProcessing: false, controlledAreas: true, localRulesRequired: true,
    imageQualityAuditRequired: true, qaRecordsRequired: true,
    maintenanceRecordsRequired: true, staffAcknowledgementRequired: true,
    irmerLeadUserId: "user-ipc-group",
    rpsUserId:       "user-pm-crawley",
    practiceManagerUserId: "user-pm-crawley",
    rpaProviderName: "Physics Protection Ltd",
    rpaContact:      "rpa@physicsprotection.example.co.uk",
    rpaReviewDate:   at(60),
    mpeProviderName: "Dental Physics Services Ltd",
    mpeContact:      "mpe@dentalphysics.example.co.uk",
    mpeReviewDate:   at(180),
    initialStatus: SiteStatus.evidence_overdue,
  },
  {
    siteId: "site-guildford",
    // Applied to the pack — but configuration gap demo
    applied: true,
    intraoralXray: true, opgXray: false, cbctXray: false,
    handheldXray: false, digitalSensors: false, phosphorPlates: false,
    filmProcessing: false, controlledAreas: false,
    localRulesRequired: false, imageQualityAuditRequired: false,
    qaRecordsRequired: false, maintenanceRecordsRequired: false,
    staffAcknowledgementRequired: false,
    irmerLeadUserId: "user-ipc-group",
    rpsUserId: null,
    practiceManagerUserId: "user-pm-guildford",
    rpaProviderName: "", rpaContact: "", rpaReviewDate: null,
    mpeProviderName: "", mpeContact: "", mpeReviewDate: null,
    initialStatus: SiteStatus.partially_configured,
  },
  {
    siteId: "site-portsmouth",
    // Onboarding — not applied to the radiography pack at all.
    applied: false,
    intraoralXray: false, opgXray: false, cbctXray: false,
    handheldXray: false, digitalSensors: false, phosphorPlates: false,
    filmProcessing: false, controlledAreas: false, localRulesRequired: false,
    imageQualityAuditRequired: false, qaRecordsRequired: false,
    maintenanceRecordsRequired: false, staffAcknowledgementRequired: false,
    irmerLeadUserId: null, rpsUserId: null, practiceManagerUserId: null,
    rpaProviderName: "", rpaContact: "", rpaReviewDate: null,
    mpeProviderName: "", mpeContact: "", mpeReviewDate: null,
    initialStatus: SiteStatus.not_configured,
  },
];

function classesForProfile(profile) {
  const out = [];
  if (profile.intraoralXray) out.push(EntitlementType.intraoral);
  if (profile.opgXray)       out.push(EntitlementType.opg);
  if (profile.cbctXray)      out.push(EntitlementType.cbct);
  if (profile.handheldXray)  out.push(EntitlementType.handheld);
  return out;
}

/* ─── Equipment register per site ─────────────────────────────────────────── */

export const DEMO_RADIOGRAPHY_EQUIPMENT = [
  // Southall
  { id: "equip-rad-br-xr-001",  siteId: "site-brighton", type: EquipmentType.intraoral_xray,
    makeModel: "Planmeca ProX",         serialNumber: "BR-XR-001",  roomLocation: "Surgery 1", serviceProvider: "Planmeca UK",
    lastServiceDate: at(-335), nextServiceDate: at(30),   status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-rad-br-xr-002",  siteId: "site-brighton", type: EquipmentType.intraoral_xray,
    makeModel: "Sirona Heliodent Plus", serialNumber: "BR-XR-002",  roomLocation: "Surgery 2", serviceProvider: "Dentsply Sirona",
    lastServiceDate: at(-160), nextServiceDate: at(205),  status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-rad-br-opg-001", siteId: "site-brighton", type: EquipmentType.opg_xray,
    makeModel: "Planmeca ProMax",       serialNumber: "BR-OPG-001", roomLocation: "Imaging Room", serviceProvider: "Planmeca UK",
    lastServiceDate: at(-320), nextServiceDate: at(45),   status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-rad-br-sen-001", siteId: "site-brighton", type: EquipmentType.digital_sensor,
    makeModel: "Carestream RVG 6200",   serialNumber: "BR-SEN-001", roomLocation: "Surgery 1", serviceProvider: "Carestream Dental",
    lastServiceDate: at(-180), nextServiceDate: at(185),  status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-rad-br-sw-001",  siteId: "site-brighton", type: EquipmentType.image_software,
    makeModel: "Carestream CS Imaging", serialNumber: "BR-SW-001",  roomLocation: "Group server", serviceProvider: "Carestream Dental",
    lastServiceDate: at(-95),  nextServiceDate: at(270),  status: EquipmentStatus.active, evidenceRequired: false },
  { id: "equip-rad-br-sig-001", siteId: "site-brighton", type: EquipmentType.rp_signage,
    makeModel: "Controlled-area signage", serialNumber: "BR-SIG-001", roomLocation: "Surgery 1 + Imaging Room", serviceProvider: "Internal",
    lastServiceDate: at(-90),  nextServiceDate: at(275),  status: EquipmentStatus.active, evidenceRequired: true },

  // Reading
  { id: "equip-rad-hv-xr-001",  siteId: "site-hove", type: EquipmentType.intraoral_xray,
    makeModel: "Acteon X-Mind DC",      serialNumber: "HV-XR-001",  roomLocation: "Surgery 1", serviceProvider: "Acteon UK",
    lastServiceDate: at(-200), nextServiceDate: at(165),  status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-rad-hv-psp-001", siteId: "site-hove", type: EquipmentType.phosphor_plate_scanner,
    makeModel: "Dürr VistaScan Mini View", serialNumber: "HV-PSP-001", roomLocation: "X-ray Bay", serviceProvider: "Dürr Dental",
    lastServiceDate: at(-410), nextServiceDate: at(-45),  status: EquipmentStatus.overdue_service, evidenceRequired: true },
  { id: "equip-rad-hv-sw-001",  siteId: "site-hove", type: EquipmentType.image_software,
    makeModel: "Dürr DBSWIN",           serialNumber: "HV-SW-001",  roomLocation: "Reception terminal", serviceProvider: "Dürr Dental",
    lastServiceDate: at(-180), nextServiceDate: at(185),  status: EquipmentStatus.active, evidenceRequired: false },
  { id: "equip-rad-hv-sig-001", siteId: "site-hove", type: EquipmentType.rp_signage,
    makeModel: "Controlled-area signage", serialNumber: "HV-SIG-001", roomLocation: "Surgery 1 + X-ray Bay", serviceProvider: "Internal",
    lastServiceDate: at(-120), nextServiceDate: at(245),  status: EquipmentStatus.active, evidenceRequired: true },

  // New Cross
  { id: "equip-rad-wo-xr-001",  siteId: "site-worthing", type: EquipmentType.intraoral_xray,
    makeModel: "Planmeca ProX",         serialNumber: "WO-XR-001",  roomLocation: "Surgery 1", serviceProvider: "Planmeca UK",
    lastServiceDate: at(-200), nextServiceDate: at(165),  status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-rad-wo-xr-002",  siteId: "site-worthing", type: EquipmentType.intraoral_xray,
    makeModel: "Planmeca ProX",         serialNumber: "WO-XR-002",  roomLocation: "Surgery 2", serviceProvider: "Planmeca UK",
    lastServiceDate: at(-185), nextServiceDate: at(180),  status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-rad-wo-opg-001", siteId: "site-worthing", type: EquipmentType.opg_xray,
    makeModel: "Kavo OP 3D",            serialNumber: "WO-OPG-001", roomLocation: "Imaging Room", serviceProvider: "KaVo",
    lastServiceDate: at(-355), nextServiceDate: at(10),   status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-rad-wo-cbct-001",siteId: "site-worthing", type: EquipmentType.cbct_xray,
    makeModel: "Kavo OP 3D Pro",        serialNumber: "WO-CBCT-001", roomLocation: "Imaging Room", serviceProvider: "KaVo",
    lastServiceDate: at(-92),  nextServiceDate: at(273),  status: EquipmentStatus.active, evidenceRequired: true },
  { id: "equip-rad-wo-sen-001", siteId: "site-worthing", type: EquipmentType.digital_sensor,
    makeModel: "Planmeca ProSensor HD", serialNumber: "WO-SEN-001", roomLocation: "Surgery 1", serviceProvider: "Planmeca UK",
    lastServiceDate: at(-100), nextServiceDate: at(265),  status: EquipmentStatus.active, evidenceRequired: false },
  { id: "equip-rad-wo-sw-001",  siteId: "site-worthing", type: EquipmentType.image_software,
    makeModel: "Planmeca Romexis",      serialNumber: "WO-SW-001",  roomLocation: "Group server", serviceProvider: "Planmeca UK",
    lastServiceDate: at(-95),  nextServiceDate: at(270),  status: EquipmentStatus.active, evidenceRequired: false },
  { id: "equip-rad-wo-sig-001", siteId: "site-worthing", type: EquipmentType.rp_signage,
    makeModel: "Controlled-area signage", serialNumber: "WO-SIG-001", roomLocation: "Imaging Room + Surgery 1/2", serviceProvider: "Internal",
    lastServiceDate: at(-110), nextServiceDate: at(255),  status: EquipmentStatus.active, evidenceRequired: true },

  // London (image quality + local rules OVERDUE; signage missing evidence)
  { id: "equip-rad-cr-xr-001",  siteId: "site-crawley", type: EquipmentType.intraoral_xray,
    makeModel: "Sirona Heliodent Plus", serialNumber: "CR-XR-001",  roomLocation: "Surgery 1", serviceProvider: "Dentsply Sirona",
    lastServiceDate: at(-420), nextServiceDate: at(-55),  status: EquipmentStatus.overdue_service, evidenceRequired: true },
  { id: "equip-rad-cr-sen-001", siteId: "site-crawley", type: EquipmentType.digital_sensor,
    makeModel: "Carestream RVG 5200",   serialNumber: "CR-SEN-001", roomLocation: "Surgery 1", serviceProvider: "Carestream Dental",
    lastServiceDate: at(-150), nextServiceDate: at(215),  status: EquipmentStatus.active, evidenceRequired: false },
  { id: "equip-rad-cr-sw-001",  siteId: "site-crawley", type: EquipmentType.image_software,
    makeModel: "Carestream CS Imaging", serialNumber: "CR-SW-001",  roomLocation: "Group server", serviceProvider: "Carestream Dental",
    lastServiceDate: at(-95),  nextServiceDate: at(270),  status: EquipmentStatus.active, evidenceRequired: false },
  // No signage equipment record at London — signage evidence will be marked Missing.

  // Manchester & Birmingham — no equipment (configuration gap / not live).
];

/* ─── Documents (5 policies + 17 procedures + 2 audit tools + 10 appendices) ── */

const DEFAULT_RAD_BODY = (title, ref) => `# ${title}

_Group-wide controlled document for the Radiography & IRMER Governance Pack._

## 1. Purpose
Defines the controlled procedure for **${title.toLowerCase()}** across Dental Group sites where the relevant imaging modality or process is operated.

## 2. Scope
Applies to all IRMER duty-holders (employer / referrer / practitioner / operator) at each applied site.

## 3. Roles & responsibilities
- **Document Owner:** Group IRMER Lead (${IRMER_LEAD_NAME})
- **Approver:** Clinical Director (${CLINICAL_DIRECTOR_NAME})
- **Local execution:** Radiation Protection Supervisor + site team

## 4. Procedure
On publish, the platform auto-populates local detail (RPA / MPE contacts,
equipment list, controlled-area diagrams) from each site's Radiography Profile
and Equipment Register.

## 5. References
- ${ref || "IRMER 2017"}
`;

const policy = (id, title, refs = ["IRMER 2017"]) => ({
  id, title, type: DocumentType.policy, category: "radiation_protection",
  scope: DocumentScope.group, references: refs,
  versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 150 }],
  body: DEFAULT_RAD_BODY(title, refs[0]),
});

const sop = (id, title, opts = {}) => ({
  id, title, type: DocumentType.sop, category: opts.category ?? "radiography",
  scope: DocumentScope.group, references: opts.references ?? ["IRMER 2017"],
  requiredFlag: opts.requiredFlag ?? null,
  linkedAuditType: opts.linkedAuditType ?? null,
  versions: opts.versions ?? [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 130 }],
  body: opts.body ?? DEFAULT_RAD_BODY(title, opts.references?.[0]),
});

const auditTool = (id, title, opts = {}) => ({
  id, title, type: DocumentType.audit_tool, category: "audit",
  scope: DocumentScope.group, references: opts.references ?? ["IRMER 2017"],
  linkedAuditType: opts.linkedAuditType ?? null,
  versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 130 }],
  body: DEFAULT_RAD_BODY(title, opts.references?.[0]),
});

const siteAppendix = (id, title, opts) => ({
  id, title, type: DocumentType.appendix, category: opts.category ?? "appendix",
  scope: DocumentScope.site,
  appliesToSiteId: opts.siteId, parentDocumentId: opts.parentDocumentId,
  references: opts.references ?? ["IRMER 2017"],
  versions: opts.versions ?? [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 90 }],
  body: opts.body ?? DEFAULT_RAD_BODY(title, opts.references?.[0]),
});

export const DEMO_RADIOGRAPHY_DOCUMENTS = [
  /* Policies (5) */
  policy("doc-rad-policy-radiation-protection", "Radiation Protection Policy", ["IRR17", "IRMER 2017", "CQC Reg 12"]),
  policy("doc-rad-policy-governance",           "Radiography Governance Policy", ["IRMER 2017", "GDC Standards"]),
  policy("doc-rad-policy-compliance",           "IRMER Compliance Policy", ["IRMER 2017 §6"]),
  policy("doc-rad-policy-justification",        "Justification & Referral Criteria Policy", ["IRMER 2017", "FGDP Selection Criteria"]),
  policy("doc-rad-policy-incident",             "Radiation Incident Reporting Policy", ["IRMER 2017 §8", "RIDDOR"]),

  /* Procedures / SOPs (17) */
  // IRMER Employer Procedures — VERSION CONTROL DEMO
  sop("doc-rad-sop-employer-procedures", "IRMER Employer Procedures", {
    references: ["IRMER 2017 §6"],
    versions: [
      { versionNumber: "1.0", status: DocumentStatus.archived,  publishedDaysAgo: 420, archivedDaysAgo: 95,  changeSummary: "Initial version — superseded by 1.1" },
      { versionNumber: "1.1", status: DocumentStatus.published, publishedDaysAgo: 95,                       changeSummary: "Updated to reflect Statutory Instrument 2018 amendments + practitioner duties." },
      { versionNumber: "1.2", status: DocumentStatus.draft,     submittedDaysAgo: null,                     changeSummary: "Draft — adds CBCT-specific duty-holder responsibilities (New Cross)." },
    ],
  }),

  sop("doc-rad-sop-local-rules",         "Local Rules",                          { requiredFlag: "localRulesRequired", linkedAuditType: "local_rules" }),
  sop("doc-rad-sop-risk-assessment",     "Radiation Risk Assessment",            { linkedAuditType: "risk_assessment" }),

  sop("doc-rad-sop-referrer",            "Referrer Responsibilities Procedure",  { linkedAuditType: "operator_entitlement" }),
  sop("doc-rad-sop-practitioner",        "Practitioner Responsibilities Procedure", { linkedAuditType: "operator_entitlement" }),
  sop("doc-rad-sop-operator",            "Operator Responsibilities Procedure",  { linkedAuditType: "operator_entitlement" }),
  sop("doc-rad-sop-operator-entitlement","Operator Entitlement Procedure",       { linkedAuditType: "operator_entitlement",
    versions: [
      // Brand-new SOP — drafted by IRMER Lead, currently with Clinical
      // Director for approval (demonstrates In Review doc-level state).
      { versionNumber: "1.0", status: DocumentStatus.in_review, submittedDaysAgo: 9,
        changeSummary: "Initial draft submitted — entitlement evidence template + RPS attestation step." },
    ] }),
  sop("doc-rad-sop-rps",                 "Radiation Protection Supervisor Responsibilities", {}),

  sop("doc-rad-sop-rpa-contact",         "RPA Contact and Escalation Procedure", {}),
  sop("doc-rad-sop-mpe-contact",         "MPE Contact and Escalation Procedure", {}),

  sop("doc-rad-sop-controlled-area",     "Controlled Area Signage Procedure",    { requiredFlag: "controlledAreas", linkedAuditType: "signage" }),
  sop("doc-rad-sop-pregnancy",           "Pregnancy and Radiography Governance Procedure", {}),

  sop("doc-rad-sop-cbct", "CBCT Governance Procedure", { requiredFlag: "cbctXray", linkedAuditType: "cbct",
    references: ["IRMER 2017", "SEDENTEXCT", "FGDP CBCT 2020"] }),

  sop("doc-rad-sop-incident-saue", "Radiography Incident and SAUE Procedure", { linkedAuditType: "incident",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.expired, publishedDaysAgo: 420, reviewDaysFromNow: -55,
                 changeSummary: "Expired pending RPA-led revision after near-miss review." }] }),

  sop("doc-rad-sop-qa-schedule",   "Equipment QA Schedule",                       { requiredFlag: "qaRecordsRequired",     linkedAuditType: "equipment_qa" }),
  sop("doc-rad-sop-maintenance",   "Equipment Maintenance Records Procedure",     { requiredFlag: "maintenanceRecordsRequired", linkedAuditType: "equipment_maintenance" }),
  sop("doc-rad-sop-image-quality", "Image Quality Audit Procedure",               { requiredFlag: "imageQualityAuditRequired", linkedAuditType: "image_quality",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.review_due, publishedDaysAgo: 360, reviewDaysFromNow: -5,
                 changeSummary: "Review due — annual cycle." }] }),

  /* Audit tools (2) */
  auditTool("doc-rad-audit-image-quality", "Image Quality Audit Tool", { linkedAuditType: "image_quality" }),
  auditTool("doc-rad-audit-template",      "Radiography Audit Template", { linkedAuditType: "image_quality" }),
];

/* ─── Site-specific appendices ────────────────────────────────────────────── */

export const DEMO_RADIOGRAPHY_APPENDICES = [
  // Southall
  siteAppendix("doc-rad-app-brighton-local-rules", "Southall Local Rules Appendix",
    { siteId: "site-brighton", parentDocumentId: "doc-rad-sop-local-rules" }),
  siteAppendix("doc-rad-app-brighton-controlled",  "Southall Controlled Area Plan",
    { siteId: "site-brighton", parentDocumentId: "doc-rad-sop-controlled-area" }),
  siteAppendix("doc-rad-app-brighton-equipment",   "Southall Radiography Equipment List",
    { siteId: "site-brighton", parentDocumentId: "doc-rad-sop-qa-schedule" }),

  // Reading
  siteAppendix("doc-rad-app-hove-local-rules", "Reading Local Rules Appendix",
    { siteId: "site-hove", parentDocumentId: "doc-rad-sop-local-rules" }),
  siteAppendix("doc-rad-app-hove-phosphor",    "Reading Phosphor Plate Workflow Appendix",
    { siteId: "site-hove", parentDocumentId: "doc-rad-sop-image-quality" }),

  // New Cross (CBCT site)
  siteAppendix("doc-rad-app-worthing-local-rules", "New Cross Local Rules Appendix",
    { siteId: "site-worthing", parentDocumentId: "doc-rad-sop-local-rules" }),
  siteAppendix("doc-rad-app-worthing-opg",         "New Cross OPG Workflow Appendix",
    { siteId: "site-worthing", parentDocumentId: "doc-rad-sop-qa-schedule" }),
  siteAppendix("doc-rad-app-worthing-cbct",        "New Cross CBCT Governance Appendix",
    { siteId: "site-worthing", parentDocumentId: "doc-rad-sop-cbct" }),
  siteAppendix("doc-rad-app-worthing-controlled",  "New Cross Controlled Area Plan",
    { siteId: "site-worthing", parentDocumentId: "doc-rad-sop-controlled-area" }),

  // London — Local Rules Appendix REVIEW DUE
  siteAppendix("doc-rad-app-crawley-local-rules", "London Local Rules Appendix",
    { siteId: "site-crawley", parentDocumentId: "doc-rad-sop-local-rules",
      versions: [{ versionNumber: "1.0", status: DocumentStatus.review_due, publishedDaysAgo: 360, reviewDaysFromNow: -3,
                   changeSummary: "Review overdue — RPA visit booked." }] }),
];

/* ─── Seed body ───────────────────────────────────────────────────────────── */

export function seedRadiography(user, { insertWithId }) {
  const tenantId = user.tenantId;
  const allDocs = [...DEMO_RADIOGRAPHY_DOCUMENTS, ...DEMO_RADIOGRAPHY_APPENDICES];

  /* 1. Pack instance */
  const pack = insertWithId(tenantId, TABLES.packs, {
    id: "pack-radiography-irmer",
    packKey: RADIOGRAPHY_PACK_KEY,
    status: PackStatus.live,
    groupName: "Dental Group",
    brandColor: "#f57c00",
    logoDataUrl: "",
    reviewCycleMonths: 12,
    clinicalDirectorUserId: "user-cd",
    groupIrmerLeadUserId:   "user-ipc-group",
    groupGovernanceLeadUserId: "user-gov",
    defaultApproverUserId: "user-cd",
    defaultReviewerUserId: "user-gov",
    rpaProviderName: "Physics Protection Ltd",
    rpaContact:      "rpa@physicsprotection.example.co.uk",
    mpeProviderName: "Dental Physics Services Ltd",
    mpeContact:      "mpe@dentalphysics.example.co.uk",
  });

  /* 2. Site radiography profiles */
  const profilesBySite = new Map();
  for (const cfg of DEMO_RADIOGRAPHY_PROFILES) {
    profilesBySite.set(cfg.siteId, cfg);
    insertWithId(tenantId, TABLES.site_profiles, {
      id: `profile-rad-${cfg.siteId}`,
      siteId: cfg.siteId,
      packInstanceId: pack.id,
      packKey: RADIOGRAPHY_PACK_KEY,
      applied: cfg.applied,
      intraoralXray: cfg.intraoralXray, opgXray: cfg.opgXray, cbctXray: cfg.cbctXray,
      handheldXray: cfg.handheldXray, digitalSensors: cfg.digitalSensors,
      phosphorPlates: cfg.phosphorPlates, filmProcessing: cfg.filmProcessing,
      controlledAreas: cfg.controlledAreas, localRulesRequired: cfg.localRulesRequired,
      imageQualityAuditRequired: cfg.imageQualityAuditRequired,
      qaRecordsRequired: cfg.qaRecordsRequired,
      maintenanceRecordsRequired: cfg.maintenanceRecordsRequired,
      staffAcknowledgementRequired: cfg.staffAcknowledgementRequired,
      irmerLeadUserId: cfg.irmerLeadUserId,
      rpsUserId: cfg.rpsUserId,
      practiceManagerUserId: cfg.practiceManagerUserId,
      rpaProviderName: cfg.rpaProviderName, rpaContact: cfg.rpaContact, rpaReviewDate: cfg.rpaReviewDate,
      mpeProviderName: cfg.mpeProviderName, mpeContact: cfg.mpeContact, mpeReviewDate: cfg.mpeReviewDate,
      status: cfg.initialStatus,
    });
  }

  /* 3. Equipment */
  for (const e of DEMO_RADIOGRAPHY_EQUIPMENT) {
    insertWithId(tenantId, TABLES.equipment, {
      ...e,
      packKey: RADIOGRAPHY_PACK_KEY,
      siteProfileId: `profile-rad-${e.siteId}`,
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
      packKey: RADIOGRAPHY_PACK_KEY,
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
        body: d.body ?? DEFAULT_RAD_BODY(d.title, d.references?.[0]),
        ownerUserId: "user-ipc-group",
        approverUserId: isLive ? "user-cd" : null,
        reviewerUserId: "user-gov",
        status: v.status,
        submittedAt:    v.submittedDaysAgo  ? at(-v.submittedDaysAgo) : (isLive ? at(-(v.publishedDaysAgo ?? 0) - 7) : null),
        approvedAt:     isLive              ? at(-(v.publishedDaysAgo ?? 0) - 2) : null,
        publishedAt:    isLive              ? at(-(v.publishedDaysAgo ?? 0))     : null,
        effectiveDate:  isLive              ? at(-(v.publishedDaysAgo ?? 0))     : null,
        nextReviewDate: isLive              ? at(reviewOffset)                     : null,
        archivedAt:     v.archivedDaysAgo   ? at(-v.archivedDaysAgo)               : null,
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

  /* 5. Operator entitlement matrix */
  const appliedRadSites = DEMO_RADIOGRAPHY_PROFILES.filter((p) => p.applied).map((p) => p.siteId);
  const operatorSites = new Set(appliedRadSites);

  const IMAGING_USER_IDS = [
    "user-bn-1", "user-bn-2", "user-hv-1", "user-hv-2", "user-wo-1", "user-cr-1", "user-gu-1",
    "user-bn-3", "user-bn-6", "user-hv-3", "user-wo-2", "user-cr-2", "user-gu-2",
    "user-prac-worthing-2", "user-op-worthing-2",
    "user-pm-brighton", "user-pm-hove", "user-pm-worthing", "user-pm-crawley",
  ];

  function siteOfUser(uid) {
    // Full-word site suffix: user-pm-brighton, user-prac-worthing-2, etc.
    let m = uid.match(/-(brighton|hove|worthing|crawley|guildford)(?:-\d+)?$/);
    if (m) return `site-${m[1]}`;
    // Short prefix codes used for the decon-pack dentists/nurses:
    // bn → brighton, hv → hove, wo → worthing, cr → crawley, gu → guildford.
    m = uid.match(/^user-(bn|hv|wo|cr|gu)-/);
    if (m) {
      return ({ bn: "site-brighton", hv: "site-hove", wo: "site-worthing", cr: "site-crawley", gu: "site-guildford" })[m[1]];
    }
    return null;
  }

  function entitlementTypesForUser(uid, profile) {
    const equipTypes = classesForProfile(profile);
    const processTypes = [EntitlementType.image_acquisition, EntitlementType.image_processing, EntitlementType.qa_checks];
    const roleTypes = [];
    const isDentist = /^user-(bn-[12]|hv-[12]|wo-1|cr-1|gu-1)$/.test(uid);
    const isNurseOperator = /^user-(bn-[36]|hv-3|wo-2|cr-2|gu-2)$/.test(uid) || /^user-op-/.test(uid);
    if (isDentist) roleTypes.push(EntitlementType.referrer, EntitlementType.practitioner);
    if (isNurseOperator) roleTypes.push(EntitlementType.operator);
    if (/^user-prac-/.test(uid)) roleTypes.push(EntitlementType.practitioner);
    return [...equipTypes, ...processTypes, ...roleTypes];
  }

  for (const uid of IMAGING_USER_IDS) {
    const siteId = siteOfUser(uid);
    if (!siteId || !operatorSites.has(siteId)) continue;
    const profile = profilesBySite.get(siteId);
    if (!profile?.applied) continue;
    const types = entitlementTypesForUser(uid, profile);

    for (const type of types) {
      const r = hashIdx(`${uid}::${siteId}::${type}`, 12);
      const isLondon = siteId === "site-crawley";
      const isManchester = siteId === "site-guildford";

      // Manchester: simulate "missing operator entitlement records" — skip many
      if (isManchester && r < 8) continue;

      let entitled = true;
      let entitlementDate = at(-360 - r * 5);
      let reviewDate = at(365 - r * 10);
      let expiryDate = at(730 - r * 10);
      let evidenceFileKey = `attestation:${uid}:${siteId}:${type}`;
      let notes = null;
      const approvedByUserId = profile.rpsUserId ?? "user-ipc-group";

      if (isLondon && r >= 7) { evidenceFileKey = null; notes = "London refresh batch — evidence pending"; }
      else if (r === 8)        { reviewDate = at(-7);  notes = "Annual entitlement review due"; }
      else if (r === 9)        { expiryDate = at(-15); reviewDate = at(-30); notes = "Entitlement lapsed — refresher required"; }
      else if (r === 10)       { evidenceFileKey = null; notes = "Training certificate not yet on file"; }
      else if (r === 11)       { entitled = false; evidenceFileKey = null; notes = "Entitlement withdrawn pending re-training"; }

      insertWithId(tenantId, TABLES.operator_entitlements, {
        id: `ent-${uid}-${siteId}-${type}`,
        userId: uid,
        siteId,
        equipmentClass: type,
        entitled,
        entitlementDate,
        reviewDate,
        expiryDate,
        evidenceFileKey,
        approvedByUserId,
        notes,
      });
    }
  }

  /* 6. Acknowledgements */
  function isSiteApplicable(doc, siteId) {
    if (doc.scope === DocumentScope.site) return doc.appliesToSiteId === siteId;
    if (!doc.requiredFlag) return true;
    const p = profilesBySite.get(siteId);
    return !!p?.[doc.requiredFlag];
  }
  const ackUserIds = ["user-cd", "user-ipc-group", "user-gov", ...IMAGING_USER_IDS];

  for (const d of allDocs) {
    if (!(d.type === DocumentType.policy || d.type === DocumentType.sop || d.type === DocumentType.appendix)) continue;
    const liveVersion = d.versions.find((v) => v.status === DocumentStatus.published || v.status === DocumentStatus.review_due || v.status === DocumentStatus.expired);
    if (!liveVersion) continue;
    const versionId = `version-${d.id}-v${liveVersion.versionNumber}`;

    for (const uid of ackUserIds) {
      const siteForUser = siteOfUser(uid);
      if (siteForUser) {
        if (!operatorSites.has(siteForUser)) continue;
        if (!isSiteApplicable(d, siteForUser)) continue;
      }
      const r = hashIdx(`${d.id}::${uid}::rad-ack`, 10);
      let status = AckStatus.acknowledged;
      let acknowledgedAt = at(-(liveVersion.publishedDaysAgo ?? 60) + r * 2);
      let dueDate = at((liveVersion.publishedDaysAgo ?? 60) > 60 ? -10 - r : 14);
      if (r >= 7 && r < 9) { status = AckStatus.assigned; acknowledgedAt = null; dueDate = at(14 - r); }
      else if (r >= 9)     { status = AckStatus.overdue;  acknowledgedAt = null; dueDate = at(-15 - r); }

      insertWithId(tenantId, TABLES.acknowledgements, {
        id: `ack-rad-${d.id}-${uid}`,
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
    return DEMO_RADIOGRAPHY_EQUIPMENT.find((e) => e.siteId === siteId && (
      (flag === "cbctXray"        && e.type === EquipmentType.cbct_xray) ||
      (flag === "opgXray"         && e.type === EquipmentType.opg_xray) ||
      (flag === "intraoralXray"   && e.type === EquipmentType.intraoral_xray) ||
      (flag === "handheldXray"    && e.type === EquipmentType.handheld_xray) ||
      (flag === "controlledAreas" && e.type === EquipmentType.rp_signage)
    ));
  };

  for (const d of allDocs) {
    for (const sid of appliedRadSites) {
      const applicable = isSiteApplicable(d, sid);
      if (!applicable) {
        insertWithId(tenantId, TABLES.evidence, {
          id: `ev-rad-${d.id}-${sid}-na`,
          siteId: sid,
          packInstanceId: pack.id,
          packKey: RADIOGRAPHY_PACK_KEY,
          documentId: d.id,
          equipmentId: null,
          auditScheduleId: null,
          kind: kindFor(d),
          title: `${d.title} (not applicable)`,
          status: EvidenceStatus.not_applicable,
          dueDate: null, uploadedAt: null, uploadedByUserId: null,
          fileKey: null,
          notes: "Not applicable at this site per Site Radiography Profile.",
        });
        continue;
      }

      const r = hashIdx(`${d.id}::${sid}::ev-rad`, 12);
      const isLondon = sid === "site-crawley";
      const isManchester = sid === "site-guildford";
      const isController = d.id === "doc-rad-sop-controlled-area";
      const isLocalRules = d.id === "doc-rad-sop-local-rules";
      const isImageQuality = d.id === "doc-rad-sop-image-quality";

      let status;
      if (isManchester) {
        status = r < 8 ? EvidenceStatus.required : EvidenceStatus.overdue;
      } else if (isLondon && (isLocalRules || isImageQuality)) {
        status = EvidenceStatus.overdue;
      } else if (isLondon && isController) {
        status = EvidenceStatus.required;
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
        id: `ev-rad-${d.id}-${sid}`,
        siteId: sid,
        packInstanceId: pack.id,
        packKey: RADIOGRAPHY_PACK_KEY,
        documentId: d.id,
        equipmentId: eqMatch?.id ?? null,
        auditScheduleId: null,
        kind: kindFor(d),
        title: d.title,
        status,
        dueDate: at(status === EvidenceStatus.required ? 14 : status === EvidenceStatus.overdue ? -15 : null),
        uploadedAt: (status === EvidenceStatus.accepted || status === EvidenceStatus.submitted) ? at(-r) : null,
        uploadedByUserId: (status === EvidenceStatus.accepted || status === EvidenceStatus.submitted)
          ? (profilesBySite.get(sid)?.rpsUserId ?? "user-ipc-group") : null,
        fileKey: null,
        notes: null,
        expiryDate: status === EvidenceStatus.expired ? at(-30) : null,
        reviewedAt: status === EvidenceStatus.accepted ? at(-r + 1) : null,
        reviewedByUserId: status === EvidenceStatus.accepted ? "user-gov" : null,
      });
    }
  }

  /* 8. Audit schedules */
  const radiographyAuditTypes = AUDIT_TYPES.filter((a) => a.pack === RADIOGRAPHY_PACK_KEY);
  for (const sid of appliedRadSites) {
    const profile = profilesBySite.get(sid);
    for (const at_ of radiographyAuditTypes) {
      if (at_.requiredFlag && !profile[at_.requiredFlag]) continue;

      const isLondonOverdue = sid === "site-crawley" && (at_.id === "image_quality" || at_.id === "local_rules");
      const isManchester = sid === "site-guildford";
      const r = hashIdx(`${sid}::${at_.id}::rad`, 10);
      const overdue = isLondonOverdue || isManchester || r >= 8;
      const completed = !overdue && r < 6;
      const score = completed ? 60 + (r * 6) : null;
      const rag = !completed ? AuditRagStatus.unknown :
                  score >= 90 ? AuditRagStatus.green :
                  score >= 75 ? AuditRagStatus.amber :
                                AuditRagStatus.red;

      insertWithId(tenantId, TABLES.audits, {
        id: `audit-rad-${sid}-${at_.id}`,
        siteId: sid,
        packInstanceId: pack.id,
        packKey: RADIOGRAPHY_PACK_KEY,
        auditType: at_.id,
        frequency: at_.defaultFreq,
        ownerUserId: profile.rpsUserId ?? "user-ipc-group",
        nextDueDate: at(overdue ? -10 - r : 14 + r),
        lastCompletedAt: completed ? at(-(15 + r * 3)) : null,
        lastScore: score,
        ragStatus: rag,
        overdue,
        actionsRaised: overdue ? Math.max(1, r % 4) : 0,
        recurringFindings: rag === AuditRagStatus.red ? ["Image quality scoring", "Operator entitlement gaps"] : [],
      });
    }
  }

  /* 9. Audit-trail seed */
  const trailEvents = [
    { objectType: "pack", action: "approve", at: at(-145), userId: "user-cd", userDisplay: displayNameOf("user-cd"),
      objectId: "pack-radiography-irmer", newValue: { status: "live", packKey: RADIOGRAPHY_PACK_KEY } },
    { objectType: "document", objectId: "doc-rad-sop-employer-procedures", action: "publish_minor",
      at: at(-95), userId: "user-cd", userDisplay: displayNameOf("user-cd"), newValue: { versionNumber: "1.1" } },
    { objectType: "document", objectId: "doc-rad-sop-employer-procedures", action: "create_draft",
      at: at(-12), userId: "user-ipc-group", userDisplay: displayNameOf("user-ipc-group"), newValue: { versionNumber: "1.2", status: "draft" } },
    { objectType: "operator_entitlement", action: "create", at: at(-180), userId: "user-pm-worthing", userDisplay: displayNameOf("user-pm-worthing"),
      siteId: "site-worthing", newValue: { equipmentClass: "cbct" } },
    { objectType: "site_profile", objectId: "profile-rad-site-guildford", action: "edit", at: at(-30),
      userId: "user-pm-guildford", userDisplay: displayNameOf("user-pm-guildford"), siteId: "site-guildford",
      newValue: { applied: true, intraoralXray: true } },
  ];
  for (const e of trailEvents) {
    insertWithId(tenantId, TABLES.audit_trail, {
      id: `trail-rad-${e.objectId ?? "pack"}-${Math.abs(hashIdx(JSON.stringify(e), 10000))}`,
      ...e,
      objectId: e.objectId ?? null,
      previousValue: null,
    });
  }
}
