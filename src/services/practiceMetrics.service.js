/**
 * Per-practice metrics — the SEAM between the UI and the (future) backend
 * aggregation.
 *
 * Both the Management Hub league table and the Practice Manager Hub headline
 * figures read through here, so the two surfaces can never disagree: they
 * render whatever this single source returns.
 *
 * Mirrors the planned endpoint shape:
 *     GET /practices/metrics?siteIds=a,b,c   ->   { [siteId]: Metrics }
 * where Metrics = { trainingPct, logAdherencePct, udaPct, openActions,
 *                   incidents, equipmentOverdue, operationalReady }.
 *
 * ── GOING LIVE ───────────────────────────────────────────────────────────
 * Swap the body of these functions for the commented fetchJson calls. Do NOT
 * port `practiceMetrics.js` (the deterministic demo generator) — in production
 * these numbers are aggregated SERVER-SIDE from the signals each practice
 * already produces (audits + corrective actions, the staff training matrix,
 * UDA submissions, operational-log adherence, incidents, equipment status).
 * The frontend keeps consuming this exact async interface unchanged.
 *
 * ── RBAC (server-enforced) ───────────────────────────────────────────────
 * The SERVER must scope the returned practices to the caller's assigned sites
 * (derived from their authenticated identity / role claims). The client-
 * supplied `siteIds` list is a convenience filter ONLY, never an authorisation
 * boundary — an Area Manager requesting another region's site ids must receive
 * 403 / empty, enforced server-side. The frontend role gating is UX, not
 * security.
 */
import { practiceMetrics as demoPracticeMetrics } from "./practiceMetrics";
import { simulateLatency } from "./delay";
import { resolveSiteId } from "./sites";
// import { fetchJson } from "./http";

/** Batch fetch — `{ [canonicalSiteId]: Metrics }`.
 *  Site ids are folded onto the canonical taxonomy (resolveSiteId) so legacy /
 *  governance-seed ids and canonical ids both key the same deterministic
 *  metrics — and the returned map is keyed by the canonical id the UI uses. */
export async function getPracticeMetrics(siteIds = []) {
  await simulateLatency();
  const out = {};
  for (const id of siteIds) {
    const canonical = resolveSiteId(id);
    out[canonical] = demoPracticeMetrics(canonical);
  }
  return out;
  // return fetchJson(`/practices/metrics?siteIds=${encodeURIComponent(siteIds.join(","))}`);
}

/** Single practice convenience wrapper. */
export async function getPracticeMetric(siteId) {
  if (!siteId) return null;
  const canonical = resolveSiteId(siteId);
  const map = await getPracticeMetrics([canonical]);
  return map[canonical] ?? null;
}
