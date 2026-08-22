/**
 * Safeguarding Governance — credentials register metadata.
 *
 * Replaces the physical-asset register with three staff-compliance trackers
 * required for CQC + Working Together To Safeguard Children evidence:
 *
 *   • DSL Level 3 credentials       — one row per designated lead
 *   • Team L1/L2 training summary   — site-wide rollup (one row per site)
 *   • DBS records                   — one row per staff member
 *
 * Persists via the existing equipment.service legacy table; the discriminator
 * is the `type` column (safeguarding_lead_credential | team_safeguarding_summary
 * | dbs_record) and category-specific fields live in the `data` blob.
 */

import { EquipmentType } from "./types";

export const SAFEGUARDING_CRED_META = [
  {
    key:             "dsl_level3",
    equipmentType:   EquipmentType.safeguarding_lead_credential,
    title:           "Safeguarding Lead Level 3 Credentials",
    titleShort:      "Lead credentials",
    subtitle:        "Statutory Level 3 certification for the DSL + deputy at each site.",
    addButtonLabel:  "Add Lead Credentials",
    icon:            "award",
    accent:          "#c62828",
  },
  {
    key:             "team_matrix",
    equipmentType:   EquipmentType.team_safeguarding_summary,
    title:           "Team Safeguarding Matrices (Level 1 & 2)",
    titleShort:      "Team training summary",
    subtitle:        "Site-wide rollup — non-clinical at Level 1, clinical at Level 2.",
    addButtonLabel:  "Log Team Training Summary",
    icon:            "usercheck",
    accent:          "#1565c0",
  },
  {
    key:             "dbs",
    equipmentType:   EquipmentType.dbs_record,
    title:           "DBS (Disclosure & Barring Service) System Logs",
    titleShort:      "DBS record",
    subtitle:        "Per-staff DBS certificate + Update Service enrolment status.",
    addButtonLabel:  "Add Staff DBS Record",
    icon:            "lock",
    accent:          "#6a1b9a",
  },
];

/**
 * Field schemas — modal renders these directly. Fields populate the
 * equipment row's `data` blob; nothing here uses top-level columns except
 * the `userId` pointer (stored on `serialNumber` for now — reuses the
 * indexable column without a schema migration).
 */
export const SAFEGUARDING_FIELD_SCHEMA = {
  dsl_level3: [
    { name: "leadUserId",          label: "Lead Name",                                 type: "user-select", required: true,
      filterRoles: ["clinical_director", "governance_lead", "practice_manager"] },
    { name: "certificateNumber",   label: "Level 3 Safeguarding Certificate Number",   type: "text",        required: true },
    { name: "trainingBody",        label: "Course Provider / Training Body",           type: "text",        required: true,
      placeholder: "e.g. British Dental Association / Local Authority" },
    { name: "issueDate",           label: "Date of Training Issue",                    type: "date",        required: true },
    { name: "expiryDate",          label: "Expiry / Renewal Date",                     type: "date",        required: true,
      help: "Defaults to 36 months from issue date — adjust if your training body uses a different cycle.",
      derivedFrom: { field: "issueDate", monthsOffset: 36 } },
  ],
  team_matrix: [
    { name: "totalActiveStaff",    label: "Total Active Staff on Site",                type: "number",      required: true, min: 0 },
    { name: "staffWithValidL1L2",  label: "Number of Staff with Valid Level 1 / 2 Training", type: "number", required: true, min: 0 },
    { name: "nonClinicalAtL1",     label: "100% of non-clinical staff verified at Level 1", type: "toggle" },
    { name: "clinicalAtL2",        label: "100% of clinical staff verified at Level 2",     type: "toggle" },
  ],
  dbs: [
    { name: "staffUserId",         label: "Staff Member Name",                         type: "user-select", required: true },
    { name: "dbsCertificateNumber", label: "DBS Certificate Number",                   type: "text",        required: true },
    { name: "dbsIssueDate",        label: "DBS Issue Date",                            type: "date",        required: true },
    { name: "updateServiceRegistered", label: "DBS Update Service Registered",          type: "toggle" },
  ],
};

/**
 * @typedef {Object} DslLevel3CredentialInput
 * @property {string} leadUserId             FK → users.id
 * @property {string} certificateNumber
 * @property {string} trainingBody
 * @property {string} issueDate              ISO date
 * @property {string} expiryDate             ISO date (default = issueDate + 36 months)
 *
 * @typedef {Object} TeamSafeguardingSummaryInput
 * @property {number}  totalActiveStaff
 * @property {number}  staffWithValidL1L2
 * @property {boolean} nonClinicalAtL1
 * @property {boolean} clinicalAtL2
 *
 * @typedef {Object} DbsRecordInput
 * @property {string}  staffUserId           FK → users.id
 * @property {string}  dbsCertificateNumber
 * @property {string}  dbsIssueDate          ISO date
 * @property {boolean} updateServiceRegistered
 */
