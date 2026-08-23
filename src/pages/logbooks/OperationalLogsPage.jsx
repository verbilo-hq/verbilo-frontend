/**
 * OperationalLogsPage — sidebar destination for recurring data-entry logs
 * (daily / weekly / monthly cadence). Replaces the older "Daily Logbooks"
 * page since the rebranded tab covers multiple frequencies.
 *
 * Composition:
 *   1. Header                — "Dental Group • [Active Site Name]"
 *   2. Status widgets (3)    — Today's Completed Logs, Active Equipment
 *                              Alerts, Streak Status
 *   3. Card grid (4)         — Autoclave 1, Vaccine Fridge, Decon Climate,
 *                              Waterline Dipslides. Each card has a status
 *                              pill (Not Started / Completed / Alert) and
 *                              a "Log Parameters" button that opens the
 *                              dynamic modal form.
 *   4. Dynamic modal         — Renders the picked template's questions
 *                              (text / numeric_threshold / pass_fail_na)
 *                              + an Operator Signature box in the footer.
 *                              Submit closes the modal, marks the card
 *                              Completed, prepends the entry to the
 *                              Recent Activity Ledger, and fires a toast.
 *   5. Recent Activity Ledger — Table at the bottom with the last few
 *                              completed logs (2 mock seed rows + any
 *                              the user signs off in this session).
 *
 * State persistence:
 *   This page deliberately uses component-local state for the MVP demo —
 *   completedToday + ledgerRows + activeAlerts reset on reload. When the
 *   backend lands, swap to POST /logbook-entries and read the ledger from
 *   GET /logbook-entries?siteId=&date=today.
 */

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { I } from "../../components/Icon";
import { listSites } from "../../services/governance/sites.service";
import { getLogbookTemplate } from "../../services/logbooks/logbookTemplates";
import { useAgenda, DISPLAY_TITLES } from "../../contexts/AgendaContext";
import { LogModal } from "./LogModal";
import styles from "./OperationalLogsPage.module.css";

/* ─── Card grid configuration ─────────────────────────────────────────
 * Only these 4 templates appear on this page (per the brief). Other
 * templates in logbookTemplates.js are preserved for future tabs. */
const CARDS = [
  { templateId: "autoclave_daily",           category: "STERILISATION",      accent: "#0277bd" },
  { templateId: "vaccine_fridge_daily",      category: "COLD CHAIN",         accent: "#2e7d32" },
  { templateId: "decon_climate_daily",       category: "ENVIRONMENT",        accent: "#6a1b9a" },
  { templateId: "waterline_dipslides_weekly",category: "WATER QUALITY",      accent: "#a34800" },
];

export function OperationalLogsPage() {
  const { user } = useAuth();
  const sites = useMemo(() => (user ? listSites(user.tenantId) : []), [user]);
  const [activeSiteId, setActiveSiteId] = useState(() => sites[0]?.id ?? null);
  useEffect(() => {
    if (!activeSiteId && sites[0]) setActiveSiteId(sites[0].id);
  }, [sites, activeSiteId]);
  const activeSite = sites.find((s) => s.id === activeSiteId) ?? null;

  /* Shared agenda state — completedToday / activeAlerts / ledger live
   * in AgendaContext so the Today's Compliance Agenda drawer and this
   * page stay perfectly in sync. The toast is also rendered once at
   * provider root, so a submit from either surface fires the same
   * confirmation. */
  const { completedToday, activeAlerts, ledger, markCompleted } = useAgenda();

  /* Modal-open state is page-local — clicking a card here renders the
   * modal inside this page's tree. The drawer keeps its own
   * openTemplateId state for the same reason. */
  const [openTemplateId, setOpenTemplateId] = useState(null);

  /* "View Entry" archive modal — holds the ledger row whose
   * historical record is currently open in read-only form. */
  const [viewLedgerRow, setViewLedgerRow] = useState(null);

  /* Smart Filter Bar state ─────────────────────────────────────────
   * • dateRange: "today" | "7d" | "month" | "custom"
   * • customFrom / customTo: ISO date strings (YYYY-MM-DD), used
   *   only when dateRange === "custom"
   * • siteFilter: "all" or one of the site names ("Brighton", etc.) */
  const [dateRange,  setDateRange]  = useState("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");
  const [siteFilter, setSiteFilter] = useState("all");

  /* ─── Widget metrics ────────────────────────────────────────────── */
  const todayCount   = Object.keys(completedToday).length;
  const todayTotal   = CARDS.length;
  const alertCount   = Object.values(activeAlerts).filter((a) => a?.breach).length;
  /* Streak resets when there's an active alert; otherwise grows with each
   * day the practice closes all its daily logs. Demo seed: 12 days. */
  const streakDays   = alertCount > 0
    ? 0
    : (todayCount === todayTotal ? 13 : 12);

  /* Resolve the date window for the Smart Filter Bar. Returns { from,
   * to } as epoch milliseconds. */
  const dateWindow = useMemo(() => {
    const now          = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    if (dateRange === "today")  return { from: startOfToday,                          to: Infinity };
    if (dateRange === "7d")     return { from: startOfToday - 6 * 86400000,           to: Infinity };
    if (dateRange === "month")  return { from: new Date(now.getFullYear(), now.getMonth(), 1).getTime(), to: Infinity };
    if (dateRange === "custom") {
      const f = customFrom ? new Date(customFrom).getTime()       : -Infinity;
      const t = customTo   ? new Date(`${customTo}T23:59:59`).getTime() : Infinity;
      return { from: f, to: t };
    }
    return { from: -Infinity, to: Infinity };
  }, [dateRange, customFrom, customTo]);

  /* Apply both filters to the ledger. Rows without an `at` timestamp
   * pass through (defensive — shouldn't happen for new rows). */
  const filteredLedger = useMemo(() => {
    return ledger.filter((row) => {
      if (siteFilter !== "all" && row.siteName !== siteFilter) return false;
      if (!row.at) return true;
      const t = Date.parse(row.at);
      if (Number.isNaN(t)) return true;
      return t >= dateWindow.from && t <= dateWindow.to;
    });
  }, [ledger, siteFilter, dateWindow]);

  /* Site Location dropdown options — union of the user's configured
   * practices + any sites that appear in the ledger. Filters out the
   * "—" placeholder used for ledger rows with no site stamp. */
  const filterSiteOptions = useMemo(() => {
    const fromSites  = sites.map((s) => s.name);
    const fromLedger = ledger.map((r) => r.siteName).filter(Boolean);
    return Array.from(new Set([...fromSites, ...fromLedger])).filter((n) => n && n !== "—");
  }, [sites, ledger]);

  /* ─── Submit handler — called by the modal's Submit Audit button ─── */
  /* Hand the submission to the shared context handler — it owns the
   * breach detection, ledger prepend, completedToday flip + toast
   * fire. We only close the page-local modal here. */
  const handleSubmit = (templateId, payload) => {
    const operator = (payload.signature || "").trim()
      || user?.displayName
      || "Unknown operator";
    /* Pass active site name so the new ledger row carries it for the
     * smart filter bar's Site Location dropdown. */
    markCompleted(
      templateId,
      { ...payload, signature: operator },
      activeSite?.name ?? null,
    );
    setOpenTemplateId(null);
  };

  /* ─── Render ────────────────────────────────────────────────────── */
  return (
    <div className={styles.page}>
      {/* ── Header ───────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.headerTitle}>Operational Logs</h1>
          <div className={styles.headerSub}>
            Recurring equipment + environment readings across the daily, weekly + monthly cadence.
          </div>
        </div>
        <div className={styles.siteSelector}>
          <I name="map" size={11} color="var(--on-surface-variant)" />
          <select
            className={styles.siteSelect}
            value={activeSiteId ?? ""}
            onChange={(e) => setActiveSiteId(e.target.value)}
            aria-label="Active site"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* ── Status widgets ──────────────────────────────────────── */}
      <section className={styles.widgetGrid} aria-label="Today at a glance">
        <Widget
          tone={todayCount === todayTotal ? "good" : "info"}
          icon="check"
          label="Today's Completed Logs"
          value={`${todayCount} / ${todayTotal}`}
          hint={todayCount === todayTotal
            ? "All daily logs signed off"
            : `${todayTotal - todayCount} remaining`}
        />
        <Widget
          tone={alertCount > 0 ? "danger" : "good"}
          icon="alert"
          label="Active Equipment Alerts"
          value={String(alertCount)}
          hint={alertCount > 0 ? "Out-of-bounds readings awaiting review" : "All equipment within range"}
        />
        <Widget
          tone={streakDays >= 10 ? "good" : streakDays > 0 ? "info" : "danger"}
          icon="award"
          label="Streak Status"
          value={streakDays > 0 ? `${streakDays}-day streak` : "Reset"}
          hint={streakDays > 0 ? "Consecutive days with zero breaches" : "Streak reset by an alert today"}
        />
      </section>

      {/* ── Card grid ────────────────────────────────────────────── */}
      <section className={styles.cardGrid} aria-label="Operational logs">
        {CARDS.map((c) => {
          const tpl = getLogbookTemplate(c.templateId);
          if (!tpl) return null;
          const done = !!completedToday[c.templateId];
          const alert = activeAlerts[c.templateId]?.breach;
          const display = DISPLAY_TITLES[c.templateId] ?? tpl.title;
          return (
            <LogCard
              key={c.templateId}
              accent={c.accent}
              category={c.category}
              title={display}
              focus={tpl.focus}
              frequency={tpl.frequency}
              regulator={tpl.regulatorPrimary}
              status={alert ? "alert" : done ? "completed" : "notStarted"}
              onOpen={() => setOpenTemplateId(c.templateId)}
            />
          );
        })}
      </section>

      {/* ── Recent Activity Ledger ──────────────────────────────── */}
      <section className={styles.ledgerSection} aria-labelledby="ledger-heading">
        <header className={styles.ledgerHead}>
          <h2 id="ledger-heading" className={styles.ledgerTitle}>Recent Activity Ledger</h2>
          <span className={styles.ledgerHint}>
            Showing {filteredLedger.length} of {ledger.length} entries
          </span>
        </header>

        {/* Smart Filter Bar — date range + site location, slate-bordered
         * to match the rest of the page's minimal aesthetic. */}
        <div className={styles.filterBar} role="search" aria-label="Filter activity ledger">
          <label className={styles.filterField}>
            <span className={styles.filterLabel}>Date range</span>
            <select
              className={styles.filterSelect}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="month">Current Month</option>
              <option value="custom">Custom…</option>
            </select>
          </label>

          {dateRange === "custom" && (
            <label className={styles.filterField}>
              <span className={styles.filterLabel}>From → To</span>
              <span className={styles.filterCustomRow}>
                <input
                  type="date"
                  className={styles.filterDateInput}
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  aria-label="Custom range start"
                />
                <span className={styles.filterDateSep}>→</span>
                <input
                  type="date"
                  className={styles.filterDateInput}
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  aria-label="Custom range end"
                />
              </span>
            </label>
          )}

          <label className={styles.filterField}>
            <span className={styles.filterLabel}>Site location</span>
            <select
              className={styles.filterSelect}
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
            >
              <option value="all">All Practices</option>
              {filterSiteOptions.map((name) => (
                <option key={name} value={name}>{name} Dental Practice</option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.ledgerTableWrap}>
          <table className={styles.ledgerTable}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Logbook Template</th>
                <th>Operator</th>
                <th>Site</th>
                <th>Status</th>
                <th className={styles.ledgerActionHead}></th>
              </tr>
            </thead>
            <tbody>
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.ledgerEmpty}>
                    No entries match the current filter.
                  </td>
                </tr>
              ) : filteredLedger.map((row) => (
                <tr key={row.id}>
                  <td className={styles.timeCell}>{row.time}</td>
                  <td>{row.template}</td>
                  <td>{row.operator}</td>
                  <td className={styles.ledgerSiteCell}>{row.siteName ?? "—"}</td>
                  <td>
                    <span className={`${styles.ledgerStatus} ${
                      row.status === "alert"     ? styles.ledgerStatusAlert :
                      row.status === "completed" ? styles.ledgerStatusDone  :
                                                   styles.ledgerStatusPending
                    }`}>
                      <span className={styles.ledgerStatusDot} />
                      {row.statusLabel}
                    </span>
                  </td>
                  <td className={styles.ledgerActionCell}>
                    {/* Every ledger row gets the same secondary
                     * "View Entry" link — pure read-only inspection
                     * affordance matching the Audit & Evidence
                     * Centre's pattern. */}
                    <button
                      type="button"
                      className={styles.ledgerViewBtn}
                      onClick={() => setViewLedgerRow(row)}
                      aria-label={`View ledger entry for ${row.template}`}
                    >
                      <I name="eye" size={13} />
                      View Entry
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Dynamic modal ───────────────────────────────────────── */}
      {openTemplateId && (
        <LogModal
          template={getLogbookTemplate(openTemplateId)}
          displayTitle={DISPLAY_TITLES[openTemplateId] ?? getLogbookTemplate(openTemplateId)?.title}
          site={activeSite}
          defaultOperatorName={user?.displayName ?? ""}
          onCancel={() => setOpenTemplateId(null)}
          onSubmit={(payload) => handleSubmit(openTemplateId, payload)}
        />
      )}

      {/* Read-only archive view — opens from a ledger row's
       * "👁️ View Entry" click. Reuses the same LogModal with
       * readOnly=true + the immutable-ledger banner. Pre-populates
       * with the row's actual stored values when available, or falls
       * back to safe-range mock values for legacy seed rows. */}
      {viewLedgerRow && (() => {
        const archTpl = getLogbookTemplate(viewLedgerRow.templateId);
        if (!archTpl) {
          // eslint-disable-next-line no-console
          console.warn("[ViewEntry] No template for", viewLedgerRow.templateId);
          setViewLedgerRow(null);
          return null;
        }
        const archValues = (viewLedgerRow.values && Object.keys(viewLedgerRow.values).length > 0)
          ? viewLedgerRow.values
          : mockSafeValues(archTpl);
        const dateLabel  = viewLedgerRow.at
          ? new Date(viewLedgerRow.at).toLocaleString("en-GB", {
              day: "2-digit", month: "2-digit", year: "numeric",
              hour: "2-digit", minute: "2-digit",
              timeZone: "Europe/London", hour12: false,
            }).replace(",", "")
          : viewLedgerRow.time;
        const headerSite = viewLedgerRow.siteName && viewLedgerRow.siteName !== "—"
          ? viewLedgerRow.siteName
          : (activeSite?.name ?? "—");
        const headerOp   = viewLedgerRow.operator ?? "—";
        return (
          <LogModal
            template={archTpl}
            displayTitle={`${viewLedgerRow.template} — ${headerSite} — Logged by ${headerOp}`}
            site={{ id: null, name: headerSite }}
            defaultOperatorName={viewLedgerRow.signature ?? viewLedgerRow.operator ?? ""}
            initialValues={archValues}
            readOnly
            submitLabel="✕ Close Archive View"
            topBanner={
              <>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }} aria-hidden="true">🔒</span>
                <span>
                  <strong>VERBILO IMMUTABLE LEDGER RECORD</strong>
                  {" // "}VERIFIED BY <strong>{(viewLedgerRow.operator ?? "—").toUpperCase()}</strong>
                  {" // "}{dateLabel.toUpperCase()}
                  {" // "}STATUS: <strong>{viewLedgerRow.status === "alert" ? "ALERT" : "COMPLIANT"}</strong>
                </span>
              </>
            }
            onCancel={() => setViewLedgerRow(null)}
            onSubmit={() => setViewLedgerRow(null)}
          />
        );
      })()}

      {/* Toast renders at provider root (AgendaProvider) so it's
       * visible regardless of which surface fired it — the
       * Operational Logs cards OR the Today's Agenda drawer. */}
    </div>
  );
}

/* Fallback value generator for legacy seed ledger rows that pre-date
 * the `values` field on the row schema. Every pass/fail question is
 * answered "pass", every numeric reading lands in the safe band's
 * midpoint, every text field uses the placeholder. Kept local to this
 * page (mirrors AuditEvidenceCentre.generateMockValues) so View Entry
 * works for any historical row. */
function mockSafeValues(template) {
  const out = {};
  for (const q of template?.questions ?? []) {
    if (q.input_type === "pass_fail_na") {
      out[q.id] = "pass";
    } else if (q.input_type === "numeric_threshold") {
      const min = Number(q.min);
      const max = Number(q.max);
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        const mid = (min + max) / 2;
        out[q.id] = Number.isInteger(mid) ? String(mid) : mid.toFixed(1);
      } else {
        out[q.id] = "0";
      }
    } else if (q.input_type === "text") {
      out[q.id] = (q.placeholder ?? "").replace(/^e\.g\.\s*/i, "").trim() || "Recorded";
    }
  }
  return out;
}

/* ═══ Widget ═══════════════════════════════════════════════════════════ */

function Widget({ tone, icon, label, value, hint }) {
  return (
    <div className={`${styles.widget} ${styles[`widget_${tone}`]}`}>
      <div className={styles.widgetIcon}>
        <I name={icon} size={14} color="currentColor" />
      </div>
      <div className={styles.widgetBody}>
        <div className={styles.widgetLabel}>{label}</div>
        <div className={styles.widgetValue}>{value}</div>
        <div className={styles.widgetHint}>{hint}</div>
      </div>
    </div>
  );
}

/* ═══ Card ═════════════════════════════════════════════════════════════ */

function LogCard({ accent, category, title, focus, frequency, regulator, status, onOpen }) {
  const isAlert = status === "alert";
  const isDone  = status === "completed";
  return (
    <article
      className={`${styles.card} ${
        isAlert ? styles.cardAlert : isDone ? styles.cardDone : ""
      }`}
      style={{ borderLeftColor: accent }}
    >
      <header className={styles.cardHead}>
        <span
          className={styles.cardCategory}
          style={{ color: accent }}
        >
          {category}
        </span>
        <span className={`${styles.frequencyBadge} ${
          frequency === "weekly" ? styles.freqWeekly :
          frequency === "monthly" ? styles.freqMonthly :
          styles.freqDaily
        }`}>
          {frequency.toUpperCase()}
        </span>
      </header>

      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardFocus}>{focus}</p>

      <div className={styles.cardFooter}>
        <span
          className={`${styles.statusPill} ${
            isAlert ? styles.statusPillAlert :
            isDone  ? styles.statusPillDone  :
                      styles.statusPillPending
          }`}
        >
          <span className={styles.statusDot} />
          {isAlert ? "Alert" : isDone ? "Completed" : "Not Started"}
        </span>
        <span className={styles.regulator}>{regulator}</span>
      </div>

      <button
        type="button"
        className={`${styles.logBtn} ${isAlert ? styles.logBtnAlert : ""}`}
        onClick={onOpen}
      >
        <I name="edit" size={13} />
        {isDone ? "Re-Log Parameters" : "Log Parameters"}
      </button>
    </article>
  );
}
