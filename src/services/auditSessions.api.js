/**
 * AuditSessions API client — thin wrapper over the backend REST endpoints.
 *
 * Endpoints (mirror /audit-sessions/* in the NestJS backend):
 *   POST   /audit-sessions                                 startSession
 *   GET    /audit-sessions/:id                             getSession
 *   PATCH  /audit-sessions/:id/answers/:questionId         setAnswer
 *   POST   /audit-sessions/:id/complete                    completeSession
 *   PATCH  /audit-sessions/answers/:answerId/resolve       resolveAction
 *
 * All requests carry the dev Cognito bearer token automatically via the
 * shared fetchJson helper. The backend's TenantContextInterceptor pins
 * the Postgres RLS context based on the token's user — the frontend never
 * sends tenantId explicitly.
 */

import { fetchJson } from "./http";

const inFlightStarts = new Map();

/** Return the tenant/site/schedule UUIDs the current user is allowed to use. */
export function getStartContext() {
  return fetchJson("/audit-sessions/start-context");
}

/** Start a new audit session. Returns the full session payload with all
 *  questions pre-listed (answers are null until the user picks). */
export function startSession({
  templateId,
  auditTypeId,
  packKey,
  siteId,
  scheduleId,
} = {}) {
  const body = { templateId, auditTypeId, packKey, siteId, scheduleId };
  const key = JSON.stringify(body);
  const existing = inFlightStarts.get(key);
  if (existing) return existing;
  const request = fetchJson("/audit-sessions", {
    method: "POST",
    body,
  });
  inFlightStarts.set(key, request);
  const release = () => {
    // Keep the settled promise briefly so React development StrictMode's
    // effect replay cannot create a duplicate in-progress audit session.
    window.setTimeout(() => inFlightStarts.delete(key), 1_000);
  };
  void request.then(release, release);
  return request;
}

/** Load one session by ID — drives AuditFormRunner's initial render. */
export function getSession(sessionId) {
  return fetchJson(`/audit-sessions/${sessionId}`);
}

/** Upsert one answer. The backend enforces:
 *    • status='fail' → actionRequired non-empty
 *    • session not locked
 *  Returns the persisted AuditAnswer row. */
export function setAnswer(sessionId, questionId, { status, actionRequired } = {}) {
  return fetchJson(`/audit-sessions/${sessionId}/answers/${questionId}`, {
    method: "PATCH",
    body:   { status, actionRequired },
  });
}

/** Sign + complete the session. The Postgres trigger fires inside the
 *  same transaction and:
 *    • Locks the session (lockedAt set → row becomes read-only)
 *    • Recomputes the pass/fail/na tally
 *    • Auto-creates a draft CpdActivity for the auditor (if template is cpdEligible)
 *  Returns the updated session row. */
export function completeSession(sessionId, { signatureHash } = {}) {
  return fetchJson(`/audit-sessions/${sessionId}/complete`, {
    method: "POST",
    body:   { signatureHash },
  });
}

/** Mark a Fail row as resolved. Powers the "Mark as Resolved" button on
 *  the AuditEvidenceCentre's Open Corrective Actions table. */
export function resolveAction(answerId, { resolutionNote } = {}) {
  return fetchJson(`/audit-sessions/answers/${answerId}/resolve`, {
    method: "PATCH",
    body:   { resolutionNote },
  });
}
