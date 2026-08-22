/**
 * CQC Compliance Hub persistence service.
 *
 * Dev-only localStorage mirror. The shape and function signatures mirror what
 * the eventual backend (audit-trail-safe, multi-tenant) will expose, so the
 * UI can swap implementations without restructuring.
 *
 * Storage shape:
 *   verbilo.cqc.{tenantId}.audits     = AuditSubmission[]
 *   verbilo.cqc.{tenantId}.incidents  = IncidentReport[]
 *
 * AuditSubmission:
 *   { id, auditKey, siteId, submittedAt, submittedBy: {id, name, role},
 *     formData: {...}, checks: {key: bool}, photoKeys: [string],
 *     signatureDataUrl: string }
 *
 * IncidentReport:
 *   { id, siteId, reportedAt, ...form fields, status, escalations: {
 *     reg18: { required, notified, notifiedAt }, dutyOfCandour: {...},
 *     riddor: {...} }, sea: { required, completed, ... } }
 *
 * Frequency-based overdue is computed by lastSubmissionFor(auditKey, siteId)
 * against the audit definition's freq string.
 */

import { calculateCurrentCoverage } from "./readiness.service";

const KEY_AUDITS    = (tenantId) => `verbilo.cqc.${tenantId}.audits`;
const KEY_INCIDENTS = (tenantId) => `verbilo.cqc.${tenantId}.incidents`;

const FREQ_DAYS = {
  Daily: 1,
  Weekly: 7,
  Monthly: 31,
  Annual: 365,
};

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
};

const uid = () =>
  (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

/* ── Audit submissions ───────────────────────────────────────────────────── */

export function listAuditSubmissions(tenantId, { siteId } = {}) {
  const all = readJson(KEY_AUDITS(tenantId), []);
  return siteId ? all.filter((s) => s.siteId === siteId) : all;
  // return fetchJson(`/cqc/${tenantId}/audits${siteId ? `?siteId=${siteId}` : ""}`);
}

export function recordAuditSubmission(tenantId, submission) {
  const all = readJson(KEY_AUDITS(tenantId), []);
  const row = {
    id: uid(),
    submittedAt: new Date().toISOString(),
    ...submission,
  };
  writeJson(KEY_AUDITS(tenantId), [row, ...all]);
  return row;
  // return fetchJson(`/cqc/${tenantId}/audits`, { method: "POST", body: JSON.stringify(submission) });
}

export function lastSubmissionFor(submissions, auditKey, siteId = null) {
  return submissions
    .filter((s) => s.auditKey === auditKey && (siteId == null || s.siteId === siteId))
    .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1))[0] ?? null;
}

export function isOverdue(auditDef, lastSubmission, now = new Date()) {
  if (!lastSubmission) return true;
  const days = FREQ_DAYS[auditDef.freq] ?? 31;
  const submittedMs = new Date(lastSubmission.submittedAt).getTime();
  // An unparseable / missing date must never read as compliant — fail safe to overdue.
  if (Number.isNaN(submittedMs)) return true;
  const ageMs = now - submittedMs;
  return ageMs > days * 24 * 60 * 60 * 1000;
}

export function daysSince(lastSubmission, now = new Date()) {
  if (!lastSubmission) return null;
  const submittedMs = new Date(lastSubmission.submittedAt).getTime();
  if (Number.isNaN(submittedMs)) return null;
  return Math.floor((now - submittedMs) / (24 * 60 * 60 * 1000));
}

export function isCurrent(auditDef, lastSubmission, now = new Date()) {
  return lastSubmission != null && !isOverdue(auditDef, lastSubmission, now);
}

/* ── Compliance gauge calculations ───────────────────────────────────────── */

export function gaugeStats(auditDefs, submissions, siteId = null) {
  return calculateCurrentCoverage(auditDefs, (def) => {
    const last = lastSubmissionFor(submissions, def.key, siteId);
    return isCurrent(def, last);
  });
}

/* ── Incident reports ────────────────────────────────────────────────────── */

export const STATUTORY_TRIGGERS = {
  reg18: {
    // CQC Reg 18 — Notification of Other Incidents.
    // Triggers: serious injury to service user, abuse/allegation, police involvement,
    // events that prevent or threaten to prevent the practice from carrying on regulated activity.
    types: [
      "Patient Fall or Injury",
      "Medication / Prescribing Error",
      "Infection Control Breach",
      "Data / Information Breach",
    ],
    minSeverity: "High",
  },
  dutyOfCandour: {
    // Reg 20 — Duty of Candour. Notifiable safety incident causing moderate harm, severe harm or death.
    minSeverity: "High",
    types: ["Patient Fall or Injury", "Medication / Prescribing Error", "Infection Control Breach"],
  },
  riddor: {
    // RIDDOR 2013 — reportable to HSE.
    // Includes specified injuries, over-7-day worker absence, dangerous occurrences (sharps with BBV exposure).
    types: ["Needlestick / Sharps Injury", "Staff Injury (Non-Sharps)", "Equipment Failure or Defect"],
    minSeverity: "Medium",
  },
};

function computeRequiredEscalations(incident) {
  const required = {};
  for (const [k, rule] of Object.entries(STATUTORY_TRIGGERS)) {
    const sevOk =
      rule.minSeverity === "Low" ||
      (rule.minSeverity === "Medium" && (incident.severity === "Medium" || incident.severity === "High")) ||
      (rule.minSeverity === "High" && incident.severity === "High");
    const typeOk = rule.types.includes(incident.type);
    required[k] = sevOk && typeOk;
  }
  return required;
}

export function listIncidents(tenantId, { siteId } = {}) {
  const all = readJson(KEY_INCIDENTS(tenantId), []);
  return siteId ? all.filter((i) => i.siteId === siteId) : all;
  // return fetchJson(`/cqc/${tenantId}/incidents${siteId ? `?siteId=${siteId}` : ""}`);
}

export function recordIncident(tenantId, incident) {
  const all = readJson(KEY_INCIDENTS(tenantId), []);
  const required = computeRequiredEscalations(incident);
  const row = {
    id: uid(),
    reportedAt: new Date().toISOString(),
    status: incident.status ?? "Open",
    ...incident,
    escalations: {
      reg18:           { required: required.reg18,           notified: false, notifiedAt: null, reference: null },
      dutyOfCandour:   { required: required.dutyOfCandour,   notified: false, notifiedAt: null, notes: null },
      riddor:          { required: required.riddor,          notified: false, notifiedAt: null, reference: null },
    },
    sea: {
      required: incident.severity === "High",
      completed: false,
      rootCause: null,
      learning: null,
      completedAt: null,
    },
  };
  writeJson(KEY_INCIDENTS(tenantId), [row, ...all]);
  return row;
  // return fetchJson(`/cqc/${tenantId}/incidents`, { method: "POST", body: JSON.stringify(incident) });
}

export function updateIncident(tenantId, incidentId, patch) {
  const all = readJson(KEY_INCIDENTS(tenantId), []);
  const next = all.map((i) => (i.id === incidentId ? { ...i, ...patch } : i));
  writeJson(KEY_INCIDENTS(tenantId), next);
  return next.find((i) => i.id === incidentId);
}

/* ── Seed demo data (dev only) ──────────────────────────────────────────── */

/* Bump this key when the seed shape changes so existing tenants pick up the
 * new demo data on next load. Old key (_seeded) is left alone — harmless. */
const SEEDED_KEY = (tenantId) => `verbilo.cqc.${tenantId}.seeded_v3`;

/**
 * Multi-site demo seed. Gives each Dental Group site its own audit-completion
 * profile so switching the Site selector in the header surfaces different
 * data per practice — not just blank screens for non-Brighton sites.
 *
 * Profile per site (rough — actual counts depend on auditDefs cardinality):
 *   sites[0] Brighton    — mature, most audits in-date
 *   sites[1] Hove        — well-run, some recent gaps
 *   sites[2] Worthing    — middle, some overdue
 *   sites[3] Crawley     — newly active, ~30%
 *   sites[4] Guildford   — onboarding, 1–2 audits done
 *   sites[5] Portsmouth  — bare (still in setup)
 */
export function ensureCqcSeed(tenantId, sites) {
  if (!tenantId) return;
  if (localStorage.getItem(SEEDED_KEY(tenantId))) return;
  if (!sites || sites.length === 0) return;

  const today = new Date();
  const at = (daysAgo) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  /* Audit keys come from CqcPage.jsx's `auditDefs` list. We don't import
   * to avoid a circular dep; keep this list in sync. Each key here will be
   * recorded as a submission at the relevant site, on a date appropriate
   * to the audit's frequency so it shows as in-date / nearly-due / overdue. */
  const AUDIT_KEYS = [
    "foil_test", "protein_residue", "soil_test", "steriliser_validation",
    "distiller_maintenance", "decon_room_audit",
    "infection_control", "hand_hygiene", "ppe_audit", "sharps_waste_audit",
    "fire_safety", "legionella_check", "cosshh_review",
    "radiography_audit", "irmer_compliance", "operator_entitlement",
    "patient_records_audit", "consent_audit", "complaints_review",
  ];

  // Per-site coverage profile — which audits each site has completed, and
  // how recently. Days-ago values are chosen so the dashboard shows a mix
  // of in-date / due / overdue per site.
  const SITE_PROFILES = [
    // Brighton — mature
    { sliceFrom: 0,  sliceTo: 19, daysAgo: [3, 8, 12, 4, 26, 18, 22, 15, 30, 11, 45, 60, 28, 40, 33, 50, 21, 17, 9] },
    // Hove
    { sliceFrom: 0,  sliceTo: 16, daysAgo: [5, 12, 25, 19, 38, 22, 30, 14, 41, 28, 70, 55, 33, 48, 26, 60] },
    // Worthing
    { sliceFrom: 0,  sliceTo: 12, daysAgo: [11, 22, 40, 18, 55, 33, 28, 47, 60, 25, 80, 38] },
    // Crawley — newly active
    { sliceFrom: 0,  sliceTo: 6,  daysAgo: [4, 15, 30, 12, 22, 8] },
    // Guildford — onboarding
    { sliceFrom: 0,  sliceTo: 2,  daysAgo: [6, 14] },
    // Portsmouth — bare
    { sliceFrom: 0,  sliceTo: 0,  daysAgo: [] },
  ];

  sites.forEach((site, idx) => {
    const profile = SITE_PROFILES[idx];
    if (!profile) return;
    const keys = AUDIT_KEYS.slice(profile.sliceFrom, profile.sliceTo);
    keys.forEach((key, i) => {
      recordAuditSubmission(tenantId, {
        auditKey: key,
        siteId: site.id,
        submittedAt: at(profile.daysAgo[i] ?? (i + 1) * 7),
        submittedBy: "Dental Group team",
        result: "pass",
      });
    });
  });

  // Incidents distributed across the more active sites for demo variety.
  const incidentSpread = [
    {
      siteIdx: 0,
      type: "Needlestick / Sharps Injury", severity: "High", date: "2026-04-28",
      reportedBy: "Dr. Callum Lead",
      description: "Needlestick to left index finger whilst recapping a used local anaesthetic needle. Wound irrigated immediately.",
      actionTaken: "Wound irrigated. Occupational health notified. Patient blood-borne virus status reviewed.",
      status: "Under Review",
    },
    {
      siteIdx: 0,
      type: "Equipment Failure or Defect", severity: "Medium", date: "2026-04-22",
      reportedBy: "Dr. Amir Dentist",
      description: "Autoclave displayed cycle failure error mid-run. Load quarantined and not released for use.",
      actionTaken: "Load quarantined. Engineer scheduled. Backup autoclave brought into use.",
      status: "Open",
    },
    {
      siteIdx: 1,
      type: "Patient Complaint", severity: "Medium", date: "2026-04-18",
      reportedBy: "Practice Manager",
      description: "Patient reported feeling rushed during consultation. Asked for written response.",
      actionTaken: "Acknowledged in writing within 3 working days. Investigation scheduled with treating clinician.",
      status: "Under Review",
    },
    {
      siteIdx: 2,
      type: "Near Miss", severity: "Low", date: "2026-04-15",
      reportedBy: "Dr. Hannah Reed",
      description: "Patient prescribed incorrect dose of amoxicillin — error identified by reception before dispensing to patient.",
      actionTaken: "Prescription corrected. Clinician briefed on double-check prescribing policy.",
      status: "Closed",
    },
    {
      siteIdx: 3,
      type: "Equipment Failure or Defect", severity: "Low", date: "2026-04-10",
      reportedBy: "Site Lead",
      description: "Suction unit pressure dropped intermittently during procedure.",
      actionTaken: "Engineer inspection booked. Backup suction unit deployed.",
      status: "Closed",
    },
  ];
  for (const inc of incidentSpread) {
    const site = sites[inc.siteIdx];
    if (!site) continue;
    const { siteIdx, ...rest } = inc;
    recordIncident(tenantId, { ...rest, siteId: site.id });
  }

  localStorage.setItem(SEEDED_KEY(tenantId), "1");
}
