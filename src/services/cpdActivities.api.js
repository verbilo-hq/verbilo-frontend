/**
 * CPD Activities API client.
 *
 *   GET   /cpd                          → listMyActivities({ status })
 *   GET   /cpd/verification-queue       → listVerifierQueue()
 *   POST  /cpd/:id/submit               → submitDraft(id, payload)
 *   POST  /cpd/:id/verify               → verifyDraft(id, { verificationNote })
 *
 * The backend already does tenant + ownership scoping via RLS — these
 * helpers don't need to pass tenantId or userId; the bearer token is
 * authoritative.
 */

import { fetchJson } from "./http";

export function listMyActivities({ status } = {}) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  return fetchJson(`/cpd${q}`);
}

export function listMyDrafts() {
  return listMyActivities({ status: "draft" });
}

export function listVerifierQueue() {
  return fetchJson("/cpd/verification-queue");
}

/** Submit a draft. Backend rejects with 400 if any required field is missing:
 *  reflectiveNotes, benefitToPatients, gdcOutcomes[]. */
export function submitDraft(activityId, payload) {
  return fetchJson(`/cpd/${activityId}/submit`, { method: "POST", body: payload });
}

/** Manager-side verification — flips status to 'verified' and locks the row. */
export function verifyDraft(activityId, { verificationNote } = {}) {
  return fetchJson(`/cpd/${activityId}/verify`, {
    method: "POST",
    body:   { verificationNote },
  });
}
