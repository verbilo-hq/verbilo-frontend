/**
 * Corrective Actions — cross-pack aggregation of every Fail response
 * recorded across all completed audit runs.
 *
 * Stored on `audit_responses` (no new table): when a Fail row is "Resolved"
 * by an Area Manager / PM, we set `resolvedAt` + `resolvedByUserId` +
 * `resolutionNote`. The Open Corrective Actions feed is just every row
 * with status='fail' AND `resolvedAt` is null.
 *
 * Why on-row (not a separate table):
 *   • Keeps the audit response + its lifecycle on a single record — easier
 *     to query, easier to export ("here's the fail, here's who closed it
 *     and when"). A separate join table would split context across two
 *     places without buying us anything.
 *   • Future re-open / multi-cycle review can extend with an `actions[]`
 *     subarray on the response if needed.
 */

import { Store, TABLES } from "./store";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { AUDIT_STATUS } from "../../pages/governance/AuditFormRunner";

/**
 * Returns every unresolved Fail response across every run, hydrated with
 * the parent run + template + site context for the dashboard table.
 *
 *   filter (optional):
 *     packKey  — narrow to one pack (e.g. only Decon fails)
 *     siteId   — narrow to one site (per-site view)
 *
 *   Returns an array sorted oldest-first (longest-open Fail bubbles up).
 *   Each row shape:
 *     { responseId, runId, siteId, packKey, questionId, questionText,
 *       templateId, templateTitle, actionRequired, photoCount,
 *       failedAt (= run.completedAt), failedByUserId (= run.auditorId) }
 */
export function listOpenCorrectiveActions(tenantId, { packKey, siteId } = {}) {
  const fails = Store.list(tenantId, TABLES.audit_responses).filter(
    (r) => r.status === AUDIT_STATUS.fail && !r.resolvedAt,
  );
  if (fails.length === 0) return [];

  // Bulk-fetch runs once, then map by id for O(1) lookups in the join below.
  const runsById = new Map(
    Store.list(tenantId, TABLES.audit_runs).map((r) => [r.id, r]),
  );

  const out = [];
  for (const f of fails) {
    const run = runsById.get(f.runId);
    if (!run) continue;                              // orphaned response — skip
    if (packKey && run.packKey !== packKey) continue;
    if (siteId  && run.siteId  !== siteId)  continue;
    out.push({
      responseId:    f.id,
      runId:         f.runId,
      siteId:        run.siteId,
      packKey:       run.packKey,
      questionId:    f.questionId,
      actionRequired: f.actionRequired,
      photoCount:    f.photoCount ?? 0,
      templateId:    run.templateId,
      failedAt:      run.completedAt,
      failedByUserId: run.auditorId,
    });
  }
  // Oldest open Fail at the top — that's the one most likely to bite at inspection.
  out.sort((a, b) => (a.failedAt ?? "").localeCompare(b.failedAt ?? ""));
  return out;
}

/**
 * Mark one Fail response as resolved. Logs an audit-trail entry so the
 * corrective-action close is itself defensible at inspection.
 *
 *   note: optional free-text resolution note (e.g. "engineer attended
 *         06/05, PQ certificate filed in WD-2 asset folder").
 */
export function resolveCorrectiveAction(user, responseId, { note = null } = {}) {
  assertCan(user, "audit.complete");
  const resp = Store.get(user.tenantId, TABLES.audit_responses, responseId);
  if (!resp) return null;
  if (resp.resolvedAt) return resp;                  // already resolved — idempotent

  const next = Store.update(user.tenantId, TABLES.audit_responses, responseId, {
    resolvedAt:      new Date().toISOString(),
    resolvedByUserId: user.id,
    resolutionNote:  note,
  });
  logAction(user, {
    objectType: "audit_response",
    objectId:   responseId,
    action:     "resolve_corrective_action",
    newValue: {
      questionId: resp.questionId,
      runId:      resp.runId,
      note,
    },
  });
  return next;
}

/**
 * Re-open a previously resolved Fail — e.g. if a follow-up audit found
 * the same issue and the original "fix" didn't hold. Clears the
 * resolution fields and writes an audit-trail entry.
 */
export function reopenCorrectiveAction(user, responseId, { reason = null } = {}) {
  assertCan(user, "audit.complete");
  const resp = Store.get(user.tenantId, TABLES.audit_responses, responseId);
  if (!resp || !resp.resolvedAt) return resp;

  const next = Store.update(user.tenantId, TABLES.audit_responses, responseId, {
    resolvedAt:       null,
    resolvedByUserId: null,
    resolutionNote:   null,
  });
  logAction(user, {
    objectType: "audit_response",
    objectId:   responseId,
    action:     "reopen_corrective_action",
    newValue: {
      questionId: resp.questionId,
      runId:      resp.runId,
      reason,
    },
  });
  return next;
}
