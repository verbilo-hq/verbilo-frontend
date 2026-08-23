/**
 * ⚠️ DEMO DATA GENERATOR — NOT FOR PRODUCTION.
 *
 * Deterministic per-practice metrics derived from a hash of the site id, so
 * the demo is stable across reloads. This is the stand-in that sits BEHIND the
 * async seam in `practiceMetrics.service.js` — UI code must import the SERVICE,
 * never this module directly.
 *
 * Going live: delete this file. The metrics come from real server-side
 * aggregation (audits / training matrix / UDA / operational logs / incidents)
 * exposed via GET /practices/metrics; only practiceMetrics.service.js changes.
 *
 * The region helpers (REGIONS / buildRegionMap) are likewise demo-only — real
 * region/cluster assignment comes from org config, server-side.
 */

import { isOperationallyReady } from "./readiness.service";

function hashSeed(str = "") {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rand(seed, salt) {
  const x = Math.sin((seed % 100000) * 0.0001 + salt * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/* Demo region split — alternate by index so both regions are populated
 * regardless of how the seeded site ids hash. */
export const REGIONS = ["North", "South"];
export function buildRegionMap(sites) {
  const m = {};
  sites.forEach((s, i) => { m[s.id] = REGIONS[i % REGIONS.length]; });
  return m;
}

export function practiceMetrics(siteId) {
  const s = hashSeed(siteId || "default");
  const trainingPct      = 72 + Math.round(rand(s, 1) * 28);  // 72–100
  const logAdherencePct  = 78 + Math.round(rand(s, 2) * 22);  // 78–100
  const udaPct           = 80 + Math.round(rand(s, 3) * 20);  // 80–100 (capped at 100 to match the PM Hub UDA hero, which doesn't surface over-delivery)
  const openActions      = Math.round(rand(s, 4) * 6);        // 0–6
  const incidents        = Math.round(rand(s, 5) * 3);        // 0–3
  const equipmentOverdue = Math.round(rand(s, 6) * 2);        // 0–2
  const operationalReady = isOperationallyReady({ trainingPct, openActions, equipmentOverdue });
  return { trainingPct, logAdherencePct, udaPct, openActions, incidents, equipmentOverdue, operationalReady };
}
