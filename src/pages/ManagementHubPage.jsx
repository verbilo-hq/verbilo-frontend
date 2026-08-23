/**
 * ManagementHubPage — scope-aware oversight dashboard for Area Managers and
 * Company Management (and group_admin, who sees everything).
 *
 * SCOPE (RBAC-driven):
 *   • area_manager            → locked to their assigned region/cluster.
 *   • company_management /     → all practices, with a region filter.
 *     group_admin
 *
 * The single-practice operational detail still lives in the Practice Manager
 * Hub — managers DRILL IN from the league table (a row click → that practice's
 * PM Hub) rather than seeing it as a separate sidebar item.
 *
 * DATA SEAM: per-practice metrics are fetched through `practiceMetrics.service`
 * (async, mirrors the future GET /practices/metrics endpoint). Today that
 * service resolves deterministic demo data; going live swaps its body for the
 * real cross-practice aggregation (audits + corrective actions, training
 * matrix, UDA delivery, operational-log adherence, incidents, equipment) with
 * server-side RBAC scoping. This page consumes the async interface unchanged.
 */

import { useEffect, useMemo, useState } from "react";
import { I } from "../components/Icon";
import { ThemedSelect } from "../components/ui/ThemedSelect";
import { TopBar } from "../components/layout/TopBar";
import { listSites } from "../services/governance/sites.service";
import { ensureSeed } from "../services/governance/seed";
import { useDevRole } from "../services/devRole";
import { getPracticeMetrics } from "../services/practiceMetrics.service";
import { getGroupFinancials } from "../services/groupFinancials.service";
import { READINESS_METRICS } from "../services/readiness.service";
import { AREAS, siteName, getSite, areaName } from "../services/sites";
import { visibleSites } from "../services/scope";
import styles from "./ManagementHubPage.module.css";

/* Region == canonical area. Company/group can filter by area; an area manager
 * is locked to their own area's sites (driven by visibleSites). */
const REGIONS = AREAS.map((a) => a.name);

/* RAG helpers — green (ok) / amber (warn) / red (bad). */
const RAG = { ok: "#256f2a", warn: "#934b00", bad: "#a61b1b" };
const pctRag   = (v) => (v >= 90 ? "ok" : v >= 80 ? "warn" : "bad");
const udaRag   = (v) => (v >= 98 ? "ok" : v >= 92 ? "warn" : "bad");
const countRag = (v) => (v === 0 ? "ok" : v <= 2 ? "warn" : "bad");

/* Exec view formatting. */
const fmtMoney  = (v) => `£${Math.round(v).toLocaleString()}`;
const fmtK      = (v) => `£${Math.round(v / 1000)}k`;
const signedPct = (d) => `${d >= 0 ? "+" : ""}${d}%`;
const deltaTone = (d) => (d >= 0 ? "#256f2a" : "#a61b1b");

function RagCell({ tone, children }) {
  return (
    <span className={styles.ragCell} style={{ color: RAG[tone], background: `color-mix(in srgb, ${RAG[tone]} 12%, transparent)` }}>
      {children}
    </span>
  );
}

function KpiTile({ icon, accent, num, suffix, label, title }) {
  return (
    <div className={styles.kpiTile} title={title}>
      <span className={styles.kpiIcon} style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent }}>
        <I name={icon} size={16} />
      </span>
      <div className={styles.kpiBody}>
        <div className={styles.kpiNum}>{num}<span className={styles.kpiSuffix}>{suffix}</span></div>
        <div className={styles.kpiLabel}>{label}</div>
      </div>
    </div>
  );
}

export function ManagementHubPage({ currentUser, onNav }) {
  const [role] = useDevRole();
  const isCompany = role === "company_management" || role === "group_admin";

  /* Mirror the CQC/PIL pattern: fall back to demo-tenant when the auth user
   * hasn't been enriched, so the page works in dev / demo flows. */
  const scopeUser = currentUser ? {
    id:       currentUser.id ?? currentUser.cognitoId ?? "00000000-0000-0000-0000-000000000001",
    tenantId: currentUser.tenantId ?? "demo-tenant",
    siteId:   currentUser.siteId ?? null,
    username: currentUser.username ?? "dev",
    role:     currentUser.role ?? "super_admin",
  } : null;
  const tenantId = scopeUser?.tenantId ?? "demo-tenant";

  /* People/scope-layer user → drives which canonical sites are visible.
   * Company Management / group_admin (capability role) get org-wide oversight;
   * everyone else is scoped to their own area/site via the shared rule. The
   * dev-role switcher is the capability source, so honour it for the all-sites
   * gate while still carrying the auth user's area/site for narrower scopes. */
  const peopleScopeUser = isCompany
    ? { scopeType: "global" }
    : {
        scopeType: currentUser?.scopeType ?? "area",
        areaId:    currentUser?.areaId ?? AREAS[0].id,
        siteId:    currentUser?.siteId ?? null,
        practiceId: currentUser?.practiceId ?? null,
      };

  /* Canonical sites the user may see (Southall/Reading/New Cross + London/
   * Manchester/Birmingham). The governance seed still drives ensureSeed/listSites
   * (the data seam), but each seed site id/name is folded onto the canonical
   * taxonomy via resolveSiteId/siteName so the league shows canonical practices. */
  const allSites = useMemo(() => {
    if (!scopeUser) return [];
    ensureSeed(scopeUser);              // seed the governance store if a fresh session landed here first
    listSites(tenantId);               // keep the governance seam live (RBAC/audit/self-heal)
    const visible = visibleSites(peopleScopeUser);
    return visible.map((s) => ({ id: s.id, name: siteName(s.id), areaId: s.areaId }));
  }, [scopeUser?.id, tenantId, isCompany, peopleScopeUser.scopeType, peopleScopeUser.areaId, peopleScopeUser.siteId]);

  const regionOf = (s) => areaName(getSite(s.id)?.areaId ?? s.areaId);
  const [regionFilter, setRegionFilter] = useState("all");

  const scopedSites = useMemo(() => {
    if (isCompany && regionFilter !== "all") return allSites.filter((s) => regionOf(s) === regionFilter);
    return allSites;
  }, [allSites, isCompany, regionFilter]);

  /* Per-practice metrics via the async seam (mirrors GET /practices/metrics). */
  const [metricsBySite, setMetricsBySite] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setMetricsBySite(null);
    getPracticeMetrics(scopedSites.map((s) => s.id)).then((m) => {
      if (!cancelled) setMetricsBySite(m);
    });
    return () => { cancelled = true; };
  }, [scopedSites]);
  const loading = metricsBySite === null;

  /* Group financials via the async seam (mirrors GET /group/financials).
   * Company Management / group_admin only. */
  const [fin, setFin] = useState(null);
  useEffect(() => {
    if (!isCompany) { setFin(null); return; }
    let cancelled = false;
    setFin(null);
    getGroupFinancials(scopedSites).then((f) => { if (!cancelled) setFin(f); });
    return () => { cancelled = true; };
  }, [isCompany, scopedSites]);

  const rows = useMemo(
    () => (metricsBySite
      ? scopedSites.map((s) => ({ site: s, region: regionOf(s), ...(metricsBySite[s.id] ?? {}) }))
      : []),
    [scopedSites, metricsBySite],
  );

  const roll = useMemo(() => {
    const n = rows.length || 1;
    const avg = (k) => Math.round(rows.reduce((a, r) => a + r[k], 0) / n);
    const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
    return {
      practices:       rows.length,
      operationalReadyPct: Math.round((rows.filter((r) => r.operationalReady).length / n) * 100),
      trainingPct:     avg("trainingPct"),
      logAdherencePct: avg("logAdherencePct"),
      udaPct:          avg("udaPct"),
      openActions:     sum("openActions"),
      incidents:       sum("incidents"),
    };
  }, [rows]);

  const exceptions = useMemo(() => {
    const items = [];
    rows.forEach((r) => {
      if (!r.operationalReady)  items.push({ tone: "bad",  site: r.site.name, text: "Operational readiness gates not met" });
      if (r.trainingPct < 85)   items.push({ tone: r.trainingPct < 80 ? "bad" : "warn", site: r.site.name, text: `Mandatory training at ${r.trainingPct}%` });
      if (r.openActions > 2)    items.push({ tone: "warn", site: r.site.name, text: `${r.openActions} open corrective actions` });
      if (r.udaPct < 92)        items.push({ tone: "warn", site: r.site.name, text: `UDA delivery ${r.udaPct}% — clawback risk` });
      if (r.equipmentOverdue)   items.push({ tone: "warn", site: r.site.name, text: `${r.equipmentOverdue} equipment item(s) overdue` });
    });
    const rank = { bad: 0, warn: 1 };
    return items.sort((a, b) => rank[a.tone] - rank[b.tone]).slice(0, 8);
  }, [rows]);

  /* Area manager's own area label (canonical). */
  const ownAreaLabel = areaName(peopleScopeUser.areaId);
  const scopeLabel = isCompany
    ? (regionFilter === "all" ? "Group-wide" : `${regionFilter} region`)
    : `${ownAreaLabel} region`;

  const drillIn = (site) => onNav?.("manager", { siteId: site.id, siteName: site.name });

  return (
    <div className={styles.page}>
      <TopBar
        title="Management Hub"
        subtitle={`${scopeLabel} · ${scopedSites.length} practice${scopedSites.length !== 1 ? "s" : ""}`}
      />

      {/* Scope selector — Company/Group can filter region; Area Manager is
          locked to their cluster (shown as a static chip). */}
      <div className={styles.scopeRow}>
        <span className={styles.scopeLabel}>Scope</span>
        {isCompany ? (
          /* Same ThemedSelect species as the PM Hub's ScopeSwitcher — the
           * two sibling hubs previously shipped different dropdown kinds. */
          <div style={{ minWidth: 250 }}>
            <ThemedSelect
              value={regionFilter}
              onChange={setRegionFilter}
              options={[
                { value: "all", label: "All practices (group-wide)" },
                ...REGIONS.map((r) => ({ value: r, label: `${r} region` })),
              ]}
              ariaLabel="Scope"
              variant="pill"
            />
          </div>
        ) : (
          <span className={styles.scopeChip}>
            <I name="map" size={12} /> {ownAreaLabel} region · {scopedSites.length} practices
          </span>
        )}
      </div>

      {loading ? (
        <div className={styles.panel}>
          <p className={styles.empty}>Loading practice metrics…</p>
        </div>
      ) : (
      <>
      {/* KPI roll-up tiles */}
      <div className={styles.kpiRow}>
        <KpiTile icon="building"     accent="#006974" num={roll.practices}      suffix=""  label="Practices in scope" />
        <KpiTile icon="checksquare"  accent={RAG[pctRag(roll.operationalReadyPct)]} num={roll.operationalReadyPct} suffix="%" label={READINESS_METRICS.operationalReadiness.label} title={READINESS_METRICS.operationalReadiness.definition} />
        <KpiTile icon="award"        accent={RAG[pctRag(roll.trainingPct)]}     num={roll.trainingPct}     suffix="%" label="Mandatory training" />
        <KpiTile icon="clipboard"    accent={RAG[pctRag(roll.logAdherencePct)]} num={roll.logAdherencePct} suffix="%" label="Operational log adherence" />
        <KpiTile icon="chart"        accent={RAG[udaRag(roll.udaPct)]}          num={roll.udaPct}          suffix="%" label="UDA delivery vs contract" />
        <KpiTile icon="alert"        accent={RAG[countRag(roll.openActions)]}   num={roll.openActions}     suffix=""  label="Open corrective actions" />
      </div>

      <div className={styles.grid}>
        {/* Practice league / heat-map table */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h3 className={styles.panelTitle}>Practice league table</h3>
            <span className={styles.panelHint}>Click a practice to open its hub</span>
          </div>
          <div className={styles.tableWrap} role="region" aria-label="Practice performance table" tabIndex={0}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Practice</th>
                  <th>Region</th>
                  <th title={READINESS_METRICS.operationalReadiness.definition}>Operations</th>
                  <th>Training</th>
                  <th>Logs</th>
                  <th>UDA</th>
                  <th>Actions</th>
                  <th>Incidents</th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.site.id} className={styles.row} onClick={() => drillIn(r.site)}>
                    <td className={styles.practiceCell}>{r.site.name}</td>
                    <td className={styles.regionCell}>{r.region}</td>
                    <td><RagCell tone={r.operationalReady ? "ok" : "bad"}>{r.operationalReady ? "Ready" : "At risk"}</RagCell></td>
                    <td><RagCell tone={pctRag(r.trainingPct)}>{r.trainingPct}%</RagCell></td>
                    <td><RagCell tone={pctRag(r.logAdherencePct)}>{r.logAdherencePct}%</RagCell></td>
                    <td><RagCell tone={udaRag(r.udaPct)}>{r.udaPct}%</RagCell></td>
                    <td><RagCell tone={countRag(r.openActions)}>{r.openActions}</RagCell></td>
                    <td><RagCell tone={countRag(r.incidents)}>{r.incidents}</RagCell></td>
                    <td className={styles.arrowCell}><I name="arrow" size={13} color="var(--outline)" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cross-practice exceptions + (company) exec note */}
        <div className={styles.side}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h3 className={styles.panelTitle}>Exceptions</h3>
              <span className={styles.panelHint}>{exceptions.length}</span>
            </div>
            {exceptions.length === 0 ? (
              <p className={styles.empty}>No flagged issues across these practices.</p>
            ) : (
              <div className={styles.excList}>
                {exceptions.map((e, i) => (
                  <div key={i} className={styles.excRow}>
                    <span className={styles.excDot} style={{ background: RAG[e.tone] }} />
                    <div className={styles.excBody}>
                      <div className={styles.excSite}>{e.site}</div>
                      <div className={styles.excText}>{e.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Executive view — Company Management / group_admin only. Full-width
        * financial roll-up: headline metrics, 6-month revenue trend, and
        * per-practice contribution. Reads the group-financials async seam. */}
      {isCompany && (
        <div className={styles.panel} style={{ marginTop: 20 }}>
          <div className={styles.panelHead}>
            <h3 className={styles.panelTitle}>Executive view — group financials</h3>
            <button
              type="button"
              onClick={() => window.print()}
              className={styles.execExportBtn}
              title="Print / save as PDF — full board-pack export wires to the reporting service later"
            >
              <I name="download" size={13} /> Board-ready export
            </button>
          </div>

          {!fin ? (
            <p className={styles.empty}>Loading financials…</p>
          ) : (
            <div className={styles.execGrid}>
              {/* Headline metrics + revenue trend */}
              <div>
                <div className={styles.execMetrics}>
                  {[
                    { label: "Group revenue (this month)", val: fmtMoney(fin.totalRevenue), sub: `${signedPct(fin.totalDeltaPct)} MoM`, subTone: deltaTone(fin.totalDeltaPct) },
                    { label: "vs Budget",     val: `${fin.budgetPct}%`, sub: fin.budgetPct >= 100 ? "on / above target" : "below target", subTone: fin.budgetPct >= 100 ? "#256f2a" : "#934b00" },
                    { label: "MoM growth",    val: signedPct(fin.totalDeltaPct), valTone: deltaTone(fin.totalDeltaPct) },
                    { label: "EBITDA margin", val: `${fin.ebitdaMargin}%` },
                  ].map((m) => (
                    <div key={m.label} className={styles.execMetric}>
                      <div className={styles.execMetricVal} style={m.valTone ? { color: m.valTone } : undefined}>{m.val}</div>
                      <div className={styles.execMetricLabel}>{m.label}</div>
                      {m.sub && <div className={styles.execMetricSub} style={{ color: m.subTone }}>{m.sub}</div>}
                    </div>
                  ))}
                </div>

                <div className={styles.execTrendHead}>Group revenue — last 6 months</div>
                <div className={styles.execTrend}>
                  {fin.trend.map((t, i) => {
                    const max = Math.max(...fin.trend.map((x) => x.value)) || 1;
                    const h = Math.max(4, Math.round((t.value / max) * 100));
                    const last = i === fin.trend.length - 1;
                    return (
                      <div key={t.label} className={styles.execBarCol} title={fmtMoney(t.value)}>
                        <div className={styles.execBar} style={{ height: `${h}%`, background: last ? "#006974" : "color-mix(in srgb, #006974 32%, transparent)" }} />
                        <span className={styles.execBarLabel}>{t.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Per-practice contribution */}
              <div>
                <div className={styles.execTrendHead}>Revenue by practice (this month)</div>
                <div className={styles.execContribList}>
                  {[...fin.practices].sort((a, b) => b.revenue - a.revenue).map((p) => {
                    const max = Math.max(...fin.practices.map((x) => x.revenue)) || 1;
                    return (
                      <div key={p.siteId} className={styles.execContribRow}>
                        <span className={styles.execContribName}>{p.name}</span>
                        <span className={styles.execContribBarWrap}>
                          <span className={styles.execContribBar} style={{ width: `${Math.round((p.revenue / max) * 100)}%` }} />
                        </span>
                        <span className={styles.execContribVal}>{fmtK(p.revenue)}</span>
                        <span className={styles.execContribDelta} style={{ color: deltaTone(p.deltaPct) }}>{signedPct(p.deltaPct)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
}
