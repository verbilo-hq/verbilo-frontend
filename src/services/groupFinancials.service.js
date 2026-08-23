/**
 * Group financials — the SEAM for the Company Management executive view.
 *
 * Mirrors the planned endpoint:
 *     GET /group/financials?siteIds=a,b,c
 *   ->  { totalRevenue, totalDeltaPct, budgetPct, ebitdaMargin,
 *         trend: [{ label, value }], practices: [{ siteId, name, revenue,
 *         deltaPct, budgetPct }] }
 *
 * ── GOING LIVE ───────────────────────────────────────────────────────────
 * Swap the body for the fetchJson call. The figures come from the finance /
 * accounting feed (NHS UDA income reconciliation, private + plan revenue,
 * cost base) aggregated SERVER-SIDE. Delete the demo generator below.
 *
 * ── RBAC (server-enforced) ───────────────────────────────────────────────
 * Financials are Company Management / group_admin only. The server must reject
 * the call for any other role and scope to the caller's permitted practices —
 * the client gating is UX, not a security boundary.
 */
import { simulateLatency } from "./delay";
import { resolveSiteId, siteName } from "./sites";
// import { fetchJson } from "./http";

/* ── DEMO SHIM — deterministic per-practice figures from the site id, so the
 * exec view is stable and internally consistent across reloads. Delete when
 * the real finance feed lands. ─────────────────────────────────────────── */
function hashSeed(str = "") {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rand(seed, salt) {
  const x = Math.sin((seed % 100000) * 0.0001 + salt * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
function lastMonths(n) {
  const out = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(m.toLocaleDateString("en-GB", { month: "short" }));
  }
  return out;
}

export async function getGroupFinancials(sites = []) {
  await simulateLatency();

  /* Fold each site onto the canonical taxonomy: deterministic figures key off
   * the canonical id and the display name comes from the canonical roster, so
   * the exec view shows Southall/Reading/New Cross/London/Manchester/Birmingham
   * regardless of whether legacy/governance-seed sites were passed in. */
  const canonicalSites = sites.map((s) => {
    const id = resolveSiteId(s.id);
    return { id, name: siteName(id) };
  });

  const practices = canonicalSites.map((s) => {
    const seed = hashSeed(s.id);
    return {
      siteId:    s.id,
      name:      s.name,
      revenue:   42000 + Math.round(rand(seed, 1) * 48000),   // £/month  ~42k–90k
      deltaPct:  Math.round(rand(seed, 2) * 16 - 6),           // MoM  -6%..+10%
      budgetPct: 88 + Math.round(rand(seed, 3) * 18),          // vs budget 88–106%
    };
  });

  const totalRevenue  = practices.reduce((a, p) => a + p.revenue, 0);
  const n             = practices.length || 1;
  const totalDeltaPct = Math.round(practices.reduce((a, p) => a + p.deltaPct, 0) / n);
  const budgetPct     = Math.round(practices.reduce((a, p) => a + p.budgetPct, 0) / n);

  const groupSeed = hashSeed(canonicalSites.map((s) => s.id).join("|") || "group");
  const labels = lastMonths(6);
  const trend = labels.map((label, i) => {
    const factor = 0.82 + i * 0.036 + (rand(groupSeed, i + 1) - 0.5) * 0.05;
    return { label, value: Math.round(totalRevenue * factor) };
  });
  if (trend.length) trend[trend.length - 1].value = totalRevenue; // anchor latest to the headline

  const ebitdaMargin = 18 + Math.round(rand(groupSeed, 9) * 10);  // 18–28%

  return { totalRevenue, totalDeltaPct, budgetPct, ebitdaMargin, trend, practices };
  // return fetchJson(`/group/financials?siteIds=${encodeURIComponent(sites.map((s) => s.id).join(","))}`);
}
