/**
 * Audit schedules — recurring audits per site.
 * Each schedule has a frequency, next-due date, RAG status.
 */

import { Store, TABLES, uuid } from "./store";
import { AuditRagStatus, AUDIT_TYPES } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { getPackInstance } from "./packs.service";

export function addByFrequency(date, frequency) {
  const d = new Date(date);
  switch (frequency) {
    case "weekly":     d.setDate(d.getDate() + 7); break;
    case "monthly":    d.setMonth(d.getMonth() + 1); break;
    case "quarterly":  d.setMonth(d.getMonth() + 3); break;
    case "annually":   d.setFullYear(d.getFullYear() + 1); break;
    default:           d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString();
}

export function listSchedules(tenantId, filter = {}) {
  return Store.list(tenantId, TABLES.audits).filter((r) => {
    if (filter.siteId && r.siteId !== filter.siteId) return false;
    if (filter.auditType && r.auditType !== filter.auditType) return false;
    return true;
  });
}

export function listForSite(tenantId, siteId) {
  return listSchedules(tenantId, { siteId });
}

export function createSchedule(user, { siteId, auditType, frequency, ownerUserId, firstDueDate }) {
  assertCan(user, "audit.schedule", { siteId });
  const pack = getPackInstance(user.tenantId);
  const row = Store.insert(user.tenantId, TABLES.audits, {
    id: uuid(),
    siteId,
    packInstanceId: pack?.id ?? null,
    auditType,
    frequency,
    ownerUserId: ownerUserId ?? null,
    nextDueDate: firstDueDate ?? addByFrequency(new Date().toISOString(), frequency),
    lastCompletedAt: null,
    lastScore: null,
    ragStatus: AuditRagStatus.unknown,
    overdue: false,
  });
  logAction(user, {
    objectType: "audit_schedule",
    objectId: row.id,
    siteId,
    action: "schedule",
    newValue: { auditType, frequency },
  });
  return row;
}

export function completeAudit(user, scheduleId, { score, rag = AuditRagStatus.green, actionsRaised = 0 } = {}) {
  assertCan(user, "audit.complete");
  const sched = Store.get(user.tenantId, TABLES.audits, scheduleId);
  if (!sched) return null;
  const now = new Date().toISOString();
  const next = Store.update(user.tenantId, TABLES.audits, scheduleId, {
    lastCompletedAt: now,
    lastScore: score ?? null,
    ragStatus: rag,
    overdue: false,
    nextDueDate: addByFrequency(now, sched.frequency),
  });
  logAction(user, {
    objectType: "audit_schedule",
    objectId: scheduleId,
    siteId: sched.siteId,
    action: "complete",
    newValue: { score, rag, actionsRaised },
  });
  return next;
}

export function reconcileOverdue(tenantId) {
  const now = Date.now();
  const rows = Store.list(tenantId, TABLES.audits);
  for (const a of rows) {
    const due = Date.parse(a.nextDueDate);
    if (Number.isFinite(due) && due < now) {
      Store.update(tenantId, TABLES.audits, a.id, { overdue: true });
    }
  }
}

/* ─── Generate the default audit schedule when the pack goes live ──────────── */

/**
 * For each applied site, create one schedule per applicable audit type.
 * Filters audit types by `requiredFlag` (the site must have it enabled).
 * Reads frequency / owner overrides from `packInstance.auditFrequencyOverrides`
 * and `packInstance.auditOwnerOverrides` (set in the Audit & Evidence Setup
 * wizard step). Falls back to the type's default when no override is set.
 */
export function generateScheduleForLivePack(user, appliedProfiles, packInstance) {
  const freqOverrides = packInstance?.auditFrequencyOverrides ?? {};
  const ownerOverrides = packInstance?.auditOwnerOverrides ?? {};
  const created = [];
  for (const profile of appliedProfiles) {
    for (const type of AUDIT_TYPES) {
      // Skip audits that need a flag the site doesn't have enabled.
      if (type.requiredFlag && !profile[type.requiredFlag]) continue;
      // Legacy guard kept for safety (waterline pre-dated requiredFlag on AUDIT_TYPES).
      if (type.id === "waterline" && !profile.waterlineManagement) continue;
      const existing = listSchedules(user.tenantId, { siteId: profile.siteId, auditType: type.id });
      if (existing.length > 0) continue;
      created.push(createSchedule(user, {
        siteId: profile.siteId,
        auditType: type.id,
        frequency: freqOverrides[type.id] ?? type.defaultFreq,
        ownerUserId: ownerOverrides[type.id] ?? null,
      }));
    }
  }
  return created;
}

/* ─── Aggregations ─────────────────────────────────────────────────────────── */

export function auditStatsForTenant(tenantId) {
  const rows = Store.list(tenantId, TABLES.audits);
  const overdue = rows.filter((r) => r.overdue).length;
  const completedThisMonth = rows.filter((r) => {
    if (!r.lastCompletedAt) return false;
    const d = new Date(r.lastCompletedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  return { total: rows.length, overdue, completedThisMonth };
}
