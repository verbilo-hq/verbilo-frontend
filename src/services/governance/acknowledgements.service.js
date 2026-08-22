/**
 * Staff acknowledgements — tied to a specific document VERSION (not the
 * abstract document). Publishing a new major version invalidates all
 * existing acks for that document and assigns fresh ones.
 */

import { Store, TABLES, uuid } from "./store";
import { AckStatus, DocumentStatus, UserRole } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { getDocument, listVersions, getCurrentVersion } from "./documents.service";
import { listProfiles } from "./siteProfiles.service";

const DUE_DAYS_DEFAULT = 28;

function defaultDue() {
  const d = new Date();
  d.setDate(d.getDate() + DUE_DAYS_DEFAULT);
  return d.toISOString();
}

/* ─── Reads ────────────────────────────────────────────────────────────────── */

export function listAll(tenantId, filter = {}) {
  return Store.list(tenantId, TABLES.acknowledgements).filter((r) => {
    if (filter.userId && r.userId !== filter.userId) return false;
    if (filter.documentId && r.documentId !== filter.documentId) return false;
    if (filter.versionId && r.documentVersionId !== filter.versionId) return false;
    if (filter.siteId && r.siteId !== filter.siteId) return false;
    if (filter.status && r.status !== filter.status) return false;
    return true;
  });
}

export function listForUser(tenantId, userId) {
  return listAll(tenantId, { userId });
}

/* ─── Assignment + completion ──────────────────────────────────────────────── */

/**
 * Assign a fresh acknowledgement to one user for one version. Idempotent
 * per (versionId, userId).
 */
function assignOne(user, { documentId, documentVersionId, userId, siteId, dueDate }) {
  const existing = listAll(user.tenantId, { versionId: documentVersionId, userId }).find((r) => r.userId === userId);
  if (existing) return existing;
  const row = Store.insert(user.tenantId, TABLES.acknowledgements, {
    id: uuid(),
    documentId,
    documentVersionId,
    userId,
    siteId: siteId ?? null,
    assignedAt: new Date().toISOString(),
    dueDate: dueDate ?? defaultDue(),
    acknowledgedAt: null,
    reminderCount: 0,
    status: AckStatus.assigned,
  });
  logAction(user, {
    objectType: "acknowledgement",
    objectId: row.id,
    siteId,
    action: "assign",
    newValue: { userId, documentId, documentVersionId },
  });
  return row;
}

/**
 * Assign acks for a newly published version. Targets all staff in the tenant
 * whose role/site applies to this document. If the publish was a `major`
 * bump, existing acks for prior versions of this doc are waived first.
 */
export function assignOnPublish(user, documentId, versionId, { major = false, allUsers, sites } = {}) {
  assertCan(user, "acknowledgement.assign");
  const doc = getDocument(user.tenantId, documentId);
  if (!doc || !doc.acknowledgementRequired) return [];

  // If major bump, invalidate older acks for this doc.
  if (major) {
    const existing = Store.list(user.tenantId, TABLES.acknowledgements).filter((a) => a.documentId === documentId);
    for (const a of existing) {
      if (a.documentVersionId === versionId) continue;
      Store.update(user.tenantId, TABLES.acknowledgements, a.id, { status: AckStatus.waived });
    }
  }

  // Determine target users
  const targets = (allUsers ?? []).filter((u) => {
    if (u.role === UserRole.staff || u.role === UserRole.site_lead) return true;
    if (u.role === UserRole.practice_manager) return true;
    if (u.role === UserRole.clinical_director) return true;
    if (u.role === UserRole.ipc_lead) return true;
    if (u.role === UserRole.decontamination_lead) return true;
    return false;
  });

  const created = [];
  // If the doc is scoped to a single site, only assign to staff at that site.
  // If group-scoped, assign to all staff at applied sites.
  const appliedSiteIds = new Set(
    doc.scope === "site"
      ? [doc.appliesToSiteId].filter(Boolean)
      : (sites ?? []).filter((s) => s.appliedToPack).map((s) => s.id),
  );
  for (const u of targets) {
    if (appliedSiteIds.size > 0 && u.siteId && !appliedSiteIds.has(u.siteId)) continue;
    created.push(assignOne(user, { documentId, documentVersionId: versionId, userId: u.id, siteId: u.siteId }));
  }
  return created;
}

export function markAcknowledged(user, ackId) {
  const ack = Store.get(user.tenantId, TABLES.acknowledgements, ackId);
  if (!ack) return null;
  assertCan(user, "acknowledgement.complete", { userId: ack.userId });
  const next = Store.update(user.tenantId, TABLES.acknowledgements, ackId, {
    status: AckStatus.acknowledged,
    acknowledgedAt: new Date().toISOString(),
  });
  logAction(user, {
    objectType: "acknowledgement",
    objectId: ackId,
    siteId: ack.siteId,
    action: "acknowledged",
  });
  return next;
}

/** Mark all overdue (due date passed) acks as `overdue`. */
export function reconcileOverdue(tenantId) {
  const now = Date.now();
  const rows = Store.list(tenantId, TABLES.acknowledgements);
  for (const a of rows) {
    if (a.status !== AckStatus.assigned) continue;
    if (a.dueDate && Date.parse(a.dueDate) < now) {
      Store.update(tenantId, TABLES.acknowledgements, a.id, { status: AckStatus.overdue });
    }
  }
}

/* ─── Aggregations for dashboards ──────────────────────────────────────────── */

export function ackStatsForDocument(tenantId, documentId, versionId) {
  const rows = listAll(tenantId, { documentId, versionId });
  const total = rows.length;
  const acknowledged = rows.filter((r) => r.status === AckStatus.acknowledged).length;
  const overdue = rows.filter((r) => r.status === AckStatus.overdue).length;
  return { total, acknowledged, overdue, pct: total ? Math.round((acknowledged / total) * 100) : 0 };
}

export function ackStatsForTenant(tenantId) {
  const rows = Store.list(tenantId, TABLES.acknowledgements);
  const total = rows.length;
  const acknowledged = rows.filter((r) => r.status === AckStatus.acknowledged).length;
  const overdue = rows.filter((r) => r.status === AckStatus.overdue).length;
  return { total, acknowledged, overdue, pct: total ? Math.round((acknowledged / total) * 100) : 0 };
}

export function ackStatsForSite(tenantId, siteId) {
  const rows = Store.list(tenantId, TABLES.acknowledgements).filter((r) => r.siteId === siteId);
  const total = rows.length;
  const acknowledged = rows.filter((r) => r.status === AckStatus.acknowledged).length;
  const overdue = rows.filter((r) => r.status === AckStatus.overdue).length;
  return { total, acknowledged, overdue, pct: total ? Math.round((acknowledged / total) * 100) : 0 };
}
