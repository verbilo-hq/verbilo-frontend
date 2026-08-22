/**
 * Per-pack step header overrides + generic Step 5 register schemas.
 *
 * Two responsibilities:
 *
 *   1. `getStepHeader(stepId, packKey)` — returns the override page title
 *      for a given wizard step, or null to fall back to the WIZARD_STEPS
 *      default. Drives both the canvas <h3> and (optionally) the stepper
 *      chip label so the two stay in sync.
 *
 *   2. `PACK_REGISTER_SCHEMAS` — the data-driven schema consumed by
 *      <GenericRegisterStep />. Each pack that uses the generic register
 *      declares: section title, button label, equipment-type discriminator,
 *      modal field list (with conditional + derived defaults), and the
 *      summariser that pulls a card title / subtitle / due-line from the
 *      saved row.
 *
 * Packs with bespoke registers (Decon, Radiography, Med-Emergencies,
 * Safeguarding) do NOT appear in PACK_REGISTER_SCHEMAS — they ship as
 * dedicated step components. The generic renderer handles the long tail.
 */

import { EquipmentType } from "./types";

/* ── Utilities (declared before PACK_REGISTER_SCHEMAS — that object is
 *    evaluated eagerly at module load and references these helpers; if
 *    they live below the schema we hit a temporal-dead-zone ReferenceError
 *    the moment the file is imported.) ─────────────────────────────── */

const ASSET_TYPE_LABELS = {
  clinical_fridge: "Clinical Vaccine Fridge",
  cd_safe:         "Controlled Drugs Safe",
  fire_exit:       "Fire Exit Route",
};

const MONTH_OPTIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
].map((m) => ({ value: m, label: m }));

function shortDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Step header overrides ─────────────────────────────────────────────
 * Tier 1 = wizard chip + canvas <h3>. Step IDs match WIZARD_STEPS in
 * PackSetup.jsx — `profiles` (4), `equipment` (5), `group` (6). */
export const PACK_STEP_HEADERS = {
  complaints_incidents: {
    profiles:  "Scope & Policy Tier",
    equipment: "Historical Log Register",
    group:     "Governance Leads & Escalation Paths",
  },
  practice_operations: {
    profiles:  "Operational Profile",
    equipment: "Operational Facility Logs",
    group:     "Operational Roles & Reminders",
  },
  audit_evidence: {
    profiles:  "Audit Requirements",
    equipment: "Active Audit Master-List",
    group:     "Audit Ownership & Windows",
  },
  site_specific_sops: {
    profiles:  "Local Variation Profiles",
    equipment: "Local Service Contractor Registry",
    group:     "Local Sign-Off Authority",
  },
};

/** Lookup: returns override title, or null when the pack uses the default
 *  WIZARD_STEPS label for that step. */
export function getStepHeader(stepId, packKey) {
  return PACK_STEP_HEADERS[packKey]?.[stepId] ?? null;
}

/* ─── Step 5 generic register schemas ───────────────────────────────────
 * One entry per pack that consumes <GenericRegisterStep />. Each entry:
 *
 *   • title / lead — page heading + sub-line
 *   • categories[] — one or more section descriptors. Most generic-register
 *     packs use a single category (a flat list), but the shape supports
 *     multi-section grids identical to Decon's 4-card matrix.
 *
 * Each `category` has:
 *   • key             stable id used as the modal discriminator
 *   • equipmentType   maps to EquipmentType enum (the `type` column)
 *   • title           section header copy
 *   • addButtonLabel  dashed-placeholder copy ("+ Add ...")
 *   • icon / accent   visual theming
 *   • fields[]        modal field schema — see field-shape comment below
 *   • summarise(row)  pure function → { identifier, title, subtitle, dueLine }
 *
 * Field shape:
 *   { name, label, type, required?, placeholder?, help?, options?, min?,
 *     defaultValue?, showIf?(values), requiredIf?(values), derivedFrom?,
 *     multiSelect? }
 *
 * Field types: text · number · date · select · multi-select · toggle ·
 *              user-select
 */
export const PACK_REGISTER_SCHEMAS = {

  /* ─── COMPLAINTS, INCIDENTS & DUTY OF CANDOUR ─────────────────────── */
  complaints_incidents: {
    title: "Historical Log Register",
    lead:  "Migrate open + historical complaints and significant events into the platform — each row drives the dashboard age / SLA tile.",
    categories: [{
      key:            "complaints_case",
      equipmentType:  EquipmentType.complaints_case,
      title:          "Cases & Significant Events",
      subtitle:       "Formal complaints + Significant Adverse Incidents recorded here drive Duty of Candour timers.",
      addButtonLabel: "Add Historical / Open Case",
      icon:           "clipboard",
      accent:         "#c62828",
      fields: [
        { name: "caseRef",          label: "Case Reference ID / Name Initials", type: "text",   required: true,
          placeholder: "e.g. CMP-2026-014 or J.D." },
        { name: "recordType",       label: "Type of Record",                    type: "select", required: true,
          options: [
            { value: "formal_complaint", label: "Formal Complaint" },
            { value: "sae",              label: "Serious Adverse Incident (Significant Event)" },
          ] },
        { name: "dateLogged",       label: "Date Received / Logged",            type: "date",   required: true },
        { name: "status",           label: "Current Status",                    type: "select", required: true,
          options: [
            { value: "open",     label: "Open / Investigating" },
            { value: "resolved", label: "Resolved & Closed" },
          ] },
        { name: "dutyOfCandourActivated", label: "Duty of Candour Activated",  type: "toggle" },
        { name: "apologySentDate",  label: "Date Written Apology Sent",         type: "date",
          showIf:     (v) => !!v.dutyOfCandourActivated,
          requiredIf: (v) => !!v.dutyOfCandourActivated,
          help: "Statutory Duty of Candour requires a written apology — capture the date here." },
      ],
      summarise: (row) => {
        const d = row.data ?? {};
        const typeLabel = d.recordType === "sae" ? "SAE" : "Complaint";
        const statusLabel = d.status === "resolved" ? "Resolved" : "Open";
        return {
          identifier: d.caseRef ? `Ref ${d.caseRef}` : null,
          title:      typeLabel,
          subtitle:   `${statusLabel}${d.dutyOfCandourActivated ? " · DoC ✓" : ""}`,
          dueLine:    d.dateLogged ? `Logged ${shortDate(d.dateLogged)}` : null,
        };
      },
    }],
  },

  /* ─── PRACTICE OPERATIONS ──────────────────────────────────────────── */
  practice_operations: {
    title: "Operational Facility Logs",
    lead:  "Track operational rooms / kit that need recurring sign-off — fridge temps, CD safe checks, fire-exit inspections.",
    categories: [{
      key:            "operational_facility",
      equipmentType:  EquipmentType.operational_facility,
      title:          "Facility Items",
      subtitle:       "Per-room or per-asset operational logs with conditional target parameters.",
      addButtonLabel: "Add Facility Item",
      icon:           "wrench",
      accent:         "#1565c0",
      fields: [
        { name: "facilityName",   label: "Facility Item / Room Area", type: "text",   required: true,
          placeholder: "e.g. Surgery 1 Decon Fridge" },
        { name: "assetType",      label: "Asset Type Category",        type: "select", required: true,
          options: [
            { value: "clinical_fridge", label: "Clinical Vaccine Fridge" },
            { value: "cd_safe",         label: "Controlled Drugs Safe" },
            { value: "fire_exit",       label: "Fire Exit Route" },
          ] },
        /* Conditional bounds — fridge needs a temperature window, CD safe
         * needs a lock-combination reference. Fire exit needs neither. */
        { name: "minTempC",       label: "Min Temperature (°C)",       type: "number", min: -10,
          defaultValue: 2,
          showIf:     (v) => v.assetType === "clinical_fridge",
          requiredIf: (v) => v.assetType === "clinical_fridge" },
        { name: "maxTempC",       label: "Max Temperature (°C)",       type: "number", min: -10,
          defaultValue: 8,
          showIf:     (v) => v.assetType === "clinical_fridge",
          requiredIf: (v) => v.assetType === "clinical_fridge" },
        { name: "lockComboRef",   label: "Secure Lock Combination Reference", type: "text",
          showIf:     (v) => v.assetType === "cd_safe",
          requiredIf: (v) => v.assetType === "cd_safe",
          placeholder: "e.g. Combo held in Practice Manager safe envelope #4",
          help: "Reference only — never store the actual combination in the platform." },
      ],
      summarise: (row) => {
        const d = row.data ?? {};
        let dueLine = null;
        if (d.assetType === "clinical_fridge" && (d.minTempC ?? d.maxTempC) !== undefined) {
          dueLine = `Target ${d.minTempC ?? "—"}°C to ${d.maxTempC ?? "—"}°C`;
        } else if (d.assetType === "cd_safe" && d.lockComboRef) {
          dueLine = `Lock ref: ${d.lockComboRef}`;
        }
        const typeLabel = ASSET_TYPE_LABELS[d.assetType] ?? null;
        return {
          identifier: null,
          title:      d.facilityName || "Facility item",
          subtitle:   typeLabel,
          dueLine,
        };
      },
    }],
  },

  /* ─── AUDIT & EVIDENCE ─────────────────────────────────────────────── */
  audit_evidence: {
    title: "Active Audit Master-List",
    lead:  "Activate the audit templates the group needs running across all applied sites — windows enforce the bi-annual / annual cadence.",
    categories: [{
      key:            "active_audit_template",
      equipmentType:  EquipmentType.active_audit_template,
      title:          "Active Audit Templates",
      subtitle:       "Each row activates one template + window across every applied site at this group.",
      addButtonLabel: "Activate Template",
      icon:           "checksquare",
      accent:         "#2e7d32",
      fields: [
        { name: "auditTemplate",  label: "Audit Template Selection",   type: "select", required: true,
          options: [
            { value: "ipc",                  label: "Infection Control (IPC) Audit" },
            { value: "record_keeping",       label: "Clinical Record Keeping Audit" },
            { value: "disability_access",    label: "Disability Access (Equality Act) Audit" },
          ] },
        { name: "targetSampleSize", label: "Target Sample Size",        type: "number", required: true, min: 1,
          placeholder: "e.g. 30 patient records" },
        { name: "windowMonths",   label: "Universal Group Window Months", type: "multi-select", required: true,
          options: MONTH_OPTIONS,
          help: "Pick the months when this audit must complete — e.g. April + October enforces bi-annual." },
      ],
      summarise: (row) => {
        const d = row.data ?? {};
        const templateLabel = {
          ipc:               "IPC Audit",
          record_keeping:    "Record Keeping Audit",
          disability_access: "Disability Access Audit",
        }[d.auditTemplate] ?? "Audit";
        const months = Array.isArray(d.windowMonths) ? d.windowMonths.join(" · ") : "";
        return {
          identifier: d.targetSampleSize ? `n=${d.targetSampleSize}` : null,
          title:      templateLabel,
          subtitle:   months || null,
          dueLine:    null,
        };
      },
    }],
  },

  /* ─── SITE-SPECIFIC SOPS ───────────────────────────────────────────── */
  site_specific_sops: {
    title: "Local Service Contractor Registry",
    lead:  "Per-site third-party contractors — driven by the leased/landlord and multi-floor flags from Step 4.",
    categories: [{
      key:            "site_contractor",
      equipmentType:  EquipmentType.site_contractor,
      title:          "Third-Party Contractors",
      subtitle:       "One row per active service contract — drives the contractor sign-off audit cycle.",
      addButtonLabel: "Add Third-Party Contractor",
      icon:           "handshake",
      accent:         "#6a1b9a",
      fields: [
        { name: "serviceDomain",  label: "Service Domain",             type: "select", required: true,
          options: [
            { value: "clinical_waste",   label: "Clinical Waste Disposal" },
            { value: "legionella",       label: "Legionella Risk Assessor" },
            { value: "fire_extinguisher", label: "Fire Extinguisher Service Engineer" },
          ] },
        { name: "providerName",   label: "Contractor / Provider Corporate Name", type: "text", required: true,
          placeholder: "e.g. Initial Medical" },
        { name: "accountRef",     label: "Account / Agreement Reference Number", type: "text", required: true },
        { name: "lastInspectionDate", label: "Last Physical On-Site Inspection Date", type: "date", required: true },
      ],
      summarise: (row) => {
        const d = row.data ?? {};
        const domainLabel = {
          clinical_waste:    "Clinical Waste",
          legionella:        "Legionella",
          fire_extinguisher: "Fire Extinguisher",
        }[d.serviceDomain] ?? "Contractor";
        return {
          identifier: d.accountRef ? `Ref ${d.accountRef}` : null,
          title:      d.providerName || "Contractor",
          subtitle:   domainLabel,
          dueLine:    d.lastInspectionDate ? `Last inspection ${shortDate(d.lastInspectionDate)}` : null,
        };
      },
    }],
  },
};

/** Lookup: returns the schema for a pack, or null when the pack ships its
 *  own dedicated register component instead of using the generic. */
export function getRegisterSchema(packKey) {
  return PACK_REGISTER_SCHEMAS[packKey] ?? null;
}
