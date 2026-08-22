/**
 * SaaS Master Template Library.
 *
 * These are platform-owned SOP / policy templates. Clients can't edit them
 * directly — when a client starts a governance pack, the system clones the
 * relevant templates into the client tenant as drafts (see Slice 1C).
 *
 * Storage: kept in a dedicated localStorage key (NOT tenant-scoped), so a
 * single shared library is visible across every tenant logged in on this
 * device. This mirrors how the production backend will eventually store
 * them under `tenantId = null` in Prisma.
 *
 * Row shape:
 *   {
 *     id, packKey, title, type, category,
 *     status:    'active' | 'draft' | 'retired',
 *     version,                    // e.g. "1.0"
 *     references: string[],       // ['HTM 01-05', 'CQC Reg 12']
 *     requiredFlag: string|null,  // gates per-site activation
 *     linkedAuditType: string|null,
 *     defaultReviewCycleMonths,
 *     acknowledgementRequired,
 *     body,                       // markdown
 *     ownerName,                  // freeform "owner" — SaaS team member or function
 *     createdAt, updatedAt,
 *   }
 */

import {
  DECON_MASTER_TEMPLATES,
  RADIOGRAPHY_MASTER_TEMPLATES,
  COMPLAINTS_MASTER_TEMPLATES,
  MEDICAL_EMERGENCIES_MASTER_TEMPLATES,
  PRACTICE_OPS_MASTER_TEMPLATES,
  SAFEGUARDING_MASTER_TEMPLATES,
  AUDIT_EVIDENCE_MASTER_TEMPLATES,
  SITE_SPECIFIC_MASTER_TEMPLATES,
} from "./masterTemplatesSeed";

const STORAGE_KEY = "verbilo.master_templates";

export const MASTER_TEMPLATE_STATUS = Object.freeze({
  active:  "active",
  draft:   "draft",
  retired: "retired",
});

const MASTER_PACK_CATEGORIES = [
  { key: "decontamination_ipc",      label: "Decontamination & IPC",       icon: "shield"     },
  { key: "radiography_irmer",        label: "Radiography & IRMER",         icon: "alert"      },
  { key: "medical_emergencies",      label: "Medical Emergencies",         icon: "heart"      },
  { key: "safeguarding_governance",  label: "Safeguarding Governance",     icon: "shield"     },
  { key: "complaints_incidents",     label: "Complaints, Incidents & DoC", icon: "alert"      },
  { key: "practice_operations",      label: "Practice Operations",         icon: "clipboard"  },
  // Client-specific packs — no SaaS-provided master templates by design.
  // Listed here so the admin can confirm "yes, this pack exists" but the
  // template count stays 0 (the client builds these per their workflow).
  { key: "audit_evidence",           label: "Audit & Evidence",            icon: "checksquare", clientSpecific: true },
  { key: "site_specific_sops",       label: "Site-Specific SOPs",          icon: "building",    clientSpecific: true },
];

export function listMasterPacks() {
  return MASTER_PACK_CATEGORIES;
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(rows) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch { /* noop */ }
}

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function listMasterTemplates(packKey) {
  const all = readAll();
  return packKey ? all.filter((t) => t.packKey === packKey) : all;
}

export function getMasterTemplate(id) {
  return readAll().find((t) => t.id === id) ?? null;
}

export function createMasterTemplate(data) {
  const all = readAll();
  const now = new Date().toISOString();
  const row = {
    id: uuid(),
    packKey: data.packKey,
    title: data.title ?? "Untitled template",
    type: data.type ?? "sop",
    category: data.category ?? "",
    status: data.status ?? MASTER_TEMPLATE_STATUS.draft,
    version: data.version ?? "1.0",
    references: data.references ?? [],
    requiredFlag: data.requiredFlag ?? null,
    linkedAuditType: data.linkedAuditType ?? null,
    defaultReviewCycleMonths: data.defaultReviewCycleMonths ?? 12,
    acknowledgementRequired: data.acknowledgementRequired ?? true,
    body: data.body ?? "",
    ownerName: data.ownerName ?? "Verbilo SaaS Team",
    createdAt: now,
    updatedAt: now,
  };
  all.push(row);
  writeAll(all);
  return row;
}

export function updateMasterTemplate(id, patch) {
  const all = readAll();
  const idx = all.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  const next = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  all[idx] = next;
  writeAll(all);
  return next;
}

export function deleteMasterTemplate(id) {
  const all = readAll();
  const next = all.filter((t) => t.id !== id);
  writeAll(next);
  return all.length !== next.length;
}

/** Seed list — written once. Idempotent: skips if any rows already exist. */
export function ensureMasterTemplatesSeed() {
  const existing = readAll();
  if (existing.length > 0) return;
  writeSeed();
}

/** Force-reset: wipe and re-seed. Used by the "Reset library to defaults"
 *  admin button. Wipes any user edits. */
export function resetMasterTemplates() {
  writeSeed();
}

function writeSeed() {
  const now = new Date().toISOString();
  // All six configurable packs now have real SOP content imported from
  // Pil Dental Practice's PDFs (HTM 01-05 / IRMER / Resus Council UK /
  // Care Act / CQC Reg 16+20 aligned). Each map() forces the packKey so
  // entries land in the right pack tab even if the source seed omits it.
  const seedRows = [
    ...DECON_MASTER_TEMPLATES.map((t) => ({ ...t, packKey: "decontamination_ipc" })),
    ...RADIOGRAPHY_MASTER_TEMPLATES.map((t) => ({ ...t, packKey: "radiography_irmer" })),
    ...COMPLAINTS_MASTER_TEMPLATES.map((t) => ({ ...t, packKey: "complaints_incidents" })),
    ...MEDICAL_EMERGENCIES_MASTER_TEMPLATES.map((t) => ({ ...t, packKey: "medical_emergencies" })),
    ...PRACTICE_OPS_MASTER_TEMPLATES.map((t) => ({ ...t, packKey: "practice_operations" })),
    ...SAFEGUARDING_MASTER_TEMPLATES.map((t) => ({ ...t, packKey: "safeguarding_governance" })),
    ...AUDIT_EVIDENCE_MASTER_TEMPLATES.map((t) => ({ ...t, packKey: "audit_evidence" })),
    ...SITE_SPECIFIC_MASTER_TEMPLATES.map((t) => ({ ...t, packKey: "site_specific_sops" })),
  ];
  const rows = seedRows.map((t) => ({
    id: uuid(),
    status: MASTER_TEMPLATE_STATUS.active,
    version: "1.0",
    references: t.references ?? [],
    linkedAuditType: t.linkedAuditType ?? null,
    requiredFlag: t.requiredFlag ?? null,
    defaultReviewCycleMonths: t.defaultReviewCycleMonths ?? 12,
    acknowledgementRequired: t.acknowledgementRequired ?? true,
    body: t.body ?? defaultPlaceholderBody(t),
    ownerName: t.ownerName ?? "Verbilo SaaS Team",
    createdAt: now,
    updatedAt: now,
    ...t,
  }));
  writeAll(rows);
}

function defaultPlaceholderBody(t) {
  return `# ${t.title}\n\n_Master template — body to be authored._\n\n## Purpose\nDefines the controlled procedure for ${(t.category ?? "").replace(/_/g, " ")} across applied sites.\n\n## References\n${(t.references ?? []).join(" · ")}\n`;
}

/* Decon master template list is sourced from `masterTemplatesSeed.js`. Other
 * packs seed empty until their own SOP libraries are imported. */
