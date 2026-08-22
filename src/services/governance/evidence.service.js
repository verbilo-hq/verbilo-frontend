/**
 * Evidence register — linked to any of {site, document, equipment, audit}.
 * Evidence files are stored in IndexedDB via clientFileStore; the database
 * row carries the file key.
 */

import { Store, TABLES, uuid } from "./store";
import { EvidenceStatus } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { putFile, downloadFile } from "../clientFileStore";

export function list(tenantId, filter = {}) {
  return Store.list(tenantId, TABLES.evidence).filter((r) => {
    if (filter.siteId && r.siteId !== filter.siteId) return false;
    if (filter.documentId && r.documentId !== filter.documentId) return false;
    if (filter.equipmentId && r.equipmentId !== filter.equipmentId) return false;
    if (filter.status && r.status !== filter.status) return false;
    if (filter.kind && r.kind !== filter.kind) return false;
    return true;
  });
}

/**
 * Generate the required-evidence skeleton from a document + applied site
 * profile flags. Each evidence record starts as `required` with no upload.
 */
export function generateRequiredForDocument(user, document, siteIds) {
  if (!document.acknowledgementRequired && document.type !== "log_template" && document.type !== "audit_tool") return [];
  const kindMap = {
    log_template: "log_entry",
    audit_tool:   "audit_result",
    policy:       "attestation",
    sop:          "attestation",
    appendix:     "attestation",
    evidence_template: "file",
  };
  const out = [];
  for (const siteId of siteIds) {
    const existing = Store.list(user.tenantId, TABLES.evidence).find(
      (e) => e.documentId === document.id && e.siteId === siteId,
    );
    if (existing) continue;
    const row = Store.insert(user.tenantId, TABLES.evidence, {
      id: uuid(),
      siteId,
      packInstanceId: document.packInstanceId,
      documentId: document.id,
      equipmentId: null,
      auditScheduleId: null,
      kind: kindMap[document.type] ?? "file",
      title: document.title,
      status: EvidenceStatus.required,
      dueDate: null,
      uploadedAt: null,
      uploadedByUserId: null,
      fileKey: null,
      notes: null,
      expiryDate: null,
      reviewedAt: null,
      reviewedByUserId: null,
      rejectionReason: null,
    });
    out.push(row);
  }
  return out;
}

export async function uploadEvidence(user, evidenceId, file, { notes } = {}) {
  assertCan(user, "evidence.upload");
  const ev = Store.get(user.tenantId, TABLES.evidence, evidenceId);
  if (!ev) return null;
  const { key } = await putFile("governance-evidence", file, { evidenceId });
  const next = Store.update(user.tenantId, TABLES.evidence, evidenceId, {
    status: EvidenceStatus.submitted,
    fileKey: key,
    uploadedAt: new Date().toISOString(),
    uploadedByUserId: user.id,
    notes: notes ?? ev.notes,
  });
  logAction(user, {
    objectType: "evidence",
    objectId: evidenceId,
    siteId: ev.siteId,
    action: "upload",
    newValue: { fileKey: key },
  });
  return next;
}

export async function downloadEvidence(tenantId, evidenceId) {
  const ev = Store.get(tenantId, TABLES.evidence, evidenceId);
  if (!ev?.fileKey) return false;
  await downloadFile(ev.fileKey, ev.title);
  return true;
}

export function reviewEvidence(user, evidenceId, decision, reason = "") {
  assertCan(user, "evidence.review");
  const ev = Store.get(user.tenantId, TABLES.evidence, evidenceId);
  if (!ev) return null;
  const next = Store.update(user.tenantId, TABLES.evidence, evidenceId, {
    status: decision === "accept" ? EvidenceStatus.accepted : EvidenceStatus.rejected,
    reviewedAt: new Date().toISOString(),
    reviewedByUserId: user.id,
    rejectionReason: decision === "reject" ? reason : null,
  });
  logAction(user, {
    objectType: "evidence",
    objectId: evidenceId,
    siteId: ev.siteId,
    action: decision === "accept" ? "evidence_accept" : "evidence_reject",
    newValue: { status: next.status, reason },
  });
  return next;
}

export function reconcileEvidenceStatus(tenantId) {
  const now = Date.now();
  const rows = Store.list(tenantId, TABLES.evidence);
  for (const e of rows) {
    if (e.status === EvidenceStatus.required && e.dueDate && Date.parse(e.dueDate) < now) {
      Store.update(tenantId, TABLES.evidence, e.id, { status: EvidenceStatus.overdue });
    }
    if (e.status === EvidenceStatus.accepted && e.expiryDate && Date.parse(e.expiryDate) < now) {
      Store.update(tenantId, TABLES.evidence, e.id, { status: EvidenceStatus.expired });
    }
  }
}

/* ─── Aggregations ─────────────────────────────────────────────────────────── */

export function evidenceStatsForTenant(tenantId) {
  const rows = Store.list(tenantId, TABLES.evidence);
  const total = rows.length;
  const accepted = rows.filter((r) => r.status === EvidenceStatus.accepted).length;
  const overdue = rows.filter((r) => r.status === EvidenceStatus.overdue || r.status === EvidenceStatus.expired).length;
  return { total, accepted, overdue, pct: total ? Math.round((accepted / total) * 100) : 0 };
}

export function evidenceStatsForSite(tenantId, siteId) {
  const rows = Store.list(tenantId, TABLES.evidence).filter((r) => r.siteId === siteId);
  const total = rows.length;
  const accepted = rows.filter((r) => r.status === EvidenceStatus.accepted).length;
  const overdue = rows.filter((r) => r.status === EvidenceStatus.overdue || r.status === EvidenceStatus.expired).length;
  return { total, accepted, overdue, pct: total ? Math.round((accepted / total) * 100) : 0 };
}
