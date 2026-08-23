/**
 * Audit Runs — persistence for completed audit executions.
 *
 * One `audit_runs` row per submission from the AuditFormRunner, plus N
 * `audit_responses` rows (one per question). Denormalised on purpose so
 * any future dashboard can query directly (e.g. "all Fail rows last
 * quarter across all sites" doesn't need to deserialise JSON blobs).
 *
 * A run row always carries:
 *   • template id + version  — what was answered against
 *   • site + auditor         — provenance for the evidence pack
 *   • startedAt / completedAt — SLA + duration
 *   • summary {pass,fail,na,total} — quick-glance score
 *   • scheduleId (nullable)  — links back to the recurring schedule the
 *                              run satisfied; nullable for ad-hoc runs
 *
 * Side effects:
 *   On `createAuditRun`, when scheduleId is set, the corresponding
 *   audit_schedules row is marked complete + the nextDueDate is advanced
 *   by frequency — same behaviour as the legacy quick-score `completeAudit`
 *   but driven from a real question-by-question payload.
 */

import { Store, TABLES, uuid } from "./store";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { AuditRagStatus } from "./types";
import { addByFrequency } from "./audits.service";

/* ─── Read helpers ─────────────────────────────────────────────────────── */

export function listRuns(tenantId, { scheduleId, siteId, templateId } = {}) {
  let rows = Store.list(tenantId, TABLES.audit_runs);
  if (scheduleId) rows = rows.filter((r) => r.scheduleId === scheduleId);
  if (siteId)     rows = rows.filter((r) => r.siteId === siteId);
  if (templateId) rows = rows.filter((r) => r.templateId === templateId);
  // Newest first — matches the dashboard's "last completed" cell.
  return rows.sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
}

/** Last completed run for a recurring schedule — drives the "Last: …" tile. */
export function lastRunForSchedule(tenantId, scheduleId) {
  return listRuns(tenantId, { scheduleId })[0] ?? null;
}

export function getRunWithResponses(tenantId, runId) {
  const run = Store.get(tenantId, TABLES.audit_runs, runId);
  if (!run) return null;
  const responses = Store.list(tenantId, TABLES.audit_responses)
    .filter((r) => r.runId === runId);
  return { run, responses };
}

/* ─── Write — single entry point ──────────────────────────────────────── */

/**
 * Persist a completed audit. Atomic from the caller's perspective —
 * inserts the run + every response row, advances the linked schedule, and
 * logs an audit_trail entry. Returns the new run row.
 *
 *   payload (from AuditFormRunner.onSubmit):
 *     templateId, templateVersion, siteId, auditorId,
 *     startedAt, completedAt,
 *     responses: { [qId]: { status, actionRequired, photoCount } },
 *     summary:   { pass, fail, na, total }
 *
 *   options:
 *     scheduleId  — when present, the run satisfies a recurring
 *                   schedule and its nextDueDate gets advanced.
 *     packKey     — passed through for filtering downstream.
 */
export function createAuditRun(user, payload, { scheduleId = null, packKey = null } = {}) {
  assertCan(user, "audit.complete");

  const runId = uuid();
  // RAG band from the summary score — fail-heavy runs go straight to red
  // so the dashboard tile flips colour the moment the auditor signs off.
  const passRate = payload.summary.total > 0
    ? payload.summary.pass / (payload.summary.total - payload.summary.na)
    : 1;
  const rag = payload.summary.fail === 0
    ? AuditRagStatus.green
    : passRate >= 0.8 ? AuditRagStatus.amber : AuditRagStatus.red;

  const run = Store.insert(user.tenantId, TABLES.audit_runs, {
    id:              runId,
    tenantId:        user.tenantId,
    packKey,
    templateId:      payload.templateId,
    templateVersion: payload.templateVersion,
    scheduleId,
    siteId:          payload.siteId,
    auditorId:       payload.auditorId,
    startedAt:       payload.startedAt,
    completedAt:     payload.completedAt,
    summary:         payload.summary,
    ragStatus:       rag,
    /* Score (0–100) = pass / (pass + fail) so N/A doesn't punish.
     * Aligns with the legacy quick-score so existing tiles work. */
    score:           passRate === 1 ? 100 : Math.round(passRate * 100),
  });

  // Insert one response row per question — easier to query than a JSON blob.
  for (const [questionId, resp] of Object.entries(payload.responses)) {
    Store.insert(user.tenantId, TABLES.audit_responses, {
      id:              uuid(),
      runId,
      questionId,
      status:          resp.status,
      actionRequired:  resp.actionRequired ?? null,
      photoCount:      resp.photoCount ?? 0,
    });
  }

  // If this run satisfies a recurring schedule, advance the schedule.
  if (scheduleId) {
    const sched = Store.get(user.tenantId, TABLES.audits, scheduleId);
    if (sched) {
      Store.update(user.tenantId, TABLES.audits, scheduleId, {
        lastCompletedAt: payload.completedAt,
        lastScore:       run.score,
        ragStatus:       rag,
        overdue:         false,
        nextDueDate:     addByFrequency(payload.completedAt, sched.frequency),
        lastRunId:       runId,
      });
    }
  }

  logAction(user, {
    objectType: "audit_run",
    objectId:   runId,
    siteId:     payload.siteId,
    action:     "complete",
    newValue: {
      templateId:  payload.templateId,
      summary:     payload.summary,
      score:       run.score,
      rag,
      scheduleId,
    },
  });

  return run;
}
