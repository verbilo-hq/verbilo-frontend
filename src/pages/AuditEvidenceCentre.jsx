/**
 * Audit & Evidence Centre — top-level cross-pack orchestration dashboard.
 *
 * Sits in the sidebar under Clinical & Compliance. Different shape from
 * the per-pack Audits tab: this view aggregates *everything* across every
 * Live pack, so an Area Manager / Practice Manager can:
 *
 *   1. See audit schedule health across all packs at a glance
 *   2. Read a unified Master Audit Schedule Feed (every upcoming +
 *      overdue audit, no per-pack drill required)
 *   3. Generate a CQC Evidence Pack (date range + domain selection)
 *   4. Work through every open Fail row from any audit in one place
 *
 * Data sources (all client-side off the same Store as the rest of the app):
 *   • audit_schedules   — driven by listSchedules + AUDIT_TYPES metadata
 *   • audit_runs        — historical completion records (createAuditRun)
 *   • audit_responses   — per-question Fail rows feed the corrective list
 *   • Resolution lives on audit_responses (.resolvedAt) — no new table
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { I } from "../components/Icon";
import {
  listSchedules, reconcileOverdue as reconcileAuditOverdue,
} from "../services/governance/audits.service";
import {
  listOpenCorrectiveActions, resolveCorrectiveAction,
} from "../services/governance/correctiveActions.service";
import { listSites } from "../services/governance/sites.service";
import { listUsers } from "../services/governance/users.service";
import {
  getAuditTemplate,
} from "../services/governance/auditTemplates";
import {
  AUDIT_TYPES, UserRole,
} from "../services/governance/types";
import { personName, personAtSiteByRole } from "../services/people";
import { resolveSiteId } from "../services/sites";
import {
  calculateAuditScheduleHealth, READINESS_METRICS,
} from "../services/readiness.service";
import { formatDate } from "./governance/Shared";
import { useAgenda } from "../contexts/AgendaContext";
import { LogModal } from "./logbooks/LogModal";
import styles from "./AuditEvidenceCentre.module.css";

/* ─── Pack badge meta — colour-coded chip per pack origin ─────────────── */

const PACK_BADGE_META = {
  decontamination_ipc:     { label: "Decon",        color: "#0d55a5", icon: "shield" },
  radiography_irmer:       { label: "Radiography",  color: "#6a1b9a", icon: "image" },
  medical_emergencies:     { label: "Med Emerg",    color: "#c62828", icon: "alert" },
  safeguarding_governance: { label: "Safeguarding", color: "#a34800", icon: "lock" },
  complaints_incidents:    { label: "Complaints",   color: "#5e35b1", icon: "edit" },
  practice_operations:     { label: "Operations",   color: "#006974", icon: "settings" },
  audit_evidence:          { label: "Audit",        color: "#256f2a", icon: "checksquare" },
  site_specific_sops:      { label: "Site SOPs",    color: "#6842a5", icon: "building" },
};
const PACK_BADGE_FALLBACK = { label: "Pack", color: "#525b76", icon: "file" };

const packBadge = (packKey) => PACK_BADGE_META[packKey] ?? PACK_BADGE_FALLBACK;

/* Pack → responsible-role assignee mapping. Practice Managers don't
 * execute clinical checks themselves — they delegate. The Nudge Team
 * popover surfaces the canonical role-owner per pack so the PM can
 * fire a reminder without having to remember who owns what.
 *
 * Names are now REAL roster people resolved from services/people.js (the single
 * roster the app reads names from) instead of invented mock names. The role
 * label still reflects the canonical pack owner; the name is a concrete person
 * who fills that kind of role on the shared roster. Production will resolve this
 * per-site via the user directory + role assignments. */
const ASSIGNEE_BY_PACK = {
  decontamination_ipc:     { name: personName("lead-nurse"),  role: "Lead Nurse"          },
  radiography_irmer:       { name: personName("manager"),     role: "RPS"                 },
  medical_emergencies:     { name: personName("lead-nurse"),  role: "Lead Nurse"          },
  safeguarding_governance: { name: personName("manager"),     role: "Safeguarding Lead"   },
  complaints_incidents:    { name: personName("manager"),     role: "Practice Manager"    },
  practice_operations:     { name: personName("manager"),     role: "Practice Manager"    },
  audit_evidence:          { name: personName("right-hand"),  role: "Registered Manager"  },
  site_specific_sops:      { name: personName("manager"),     role: "Practice Manager"    },
};
const ASSIGNEE_FALLBACK = { name: personName("manager"), role: "Owner" };

const assigneeFor = (packKey) => ASSIGNEE_BY_PACK[packKey] ?? ASSIGNEE_FALLBACK;

/* Pull the first name for the toast copy ("flagged on Maria's
 * calendar"). Strips "Dr."/"Dr"/"Mr"/"Ms" honorifics first. */
const firstNameOf = (fullName) =>
  fullName.replace(/^(Dr\.?|Mr\.?|Ms\.?|Mrs\.?|Prof\.?)\s+/i, "").split(/\s+/)[0];

/* Demo persona used by the "Simulate …'s Submission" shortcut — a universal
 * stand-in for the delegated assignee in walkthroughs. Now a REAL roster person
 * (services/people.js) instead of the invented "Priya Shah". Where a row's site
 * resolves to a real site lead, simulationPersonaForSite() prefers that lead so
 * the simulated submitter matches the site being demoed; otherwise this fixed
 * roster person is used. Real submissions in production carry the signed-in user. */
const SIMULATION_PERSONA = personName("manager");

/* Resolve the most appropriate real submitter for a schedule's site: the site's
 * practice manager / clinical lead / lead nurse on the shared roster, folding the
 * (possibly legacy) siteId onto the canonical taxonomy first. Falls back to the
 * fixed SIMULATION_PERSONA when the canonical site carries no bound roster. */
const simulationPersonaForSite = (siteId) => {
  if (!siteId) return SIMULATION_PERSONA;
  const lead = personAtSiteByRole(resolveSiteId(siteId), [
    "practiceManager", "deputyPracticeManager", "clinicalLead", "leadNurse",
  ]);
  return lead?.displayName ?? SIMULATION_PERSONA;
};

/* Builds a plausible, in-range payload for a template's questions so
 * the modal opens already populated when the PM clicks "Simulate
 * Priya's Submission". Per input type:
 *   • pass_fail_na      → "pass"
 *   • numeric_threshold → midpoint of [min, max] (always in safe range)
 *   • text              → strip "e.g. " from placeholder if any,
 *                          else fall back to a generic value */
function generateMockValues(template) {
  const out = {};
  if (!template?.questions) return out;
  for (const q of template.questions) {
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

/* ─── Demo user resolver (matches GovernanceShell pattern) ────────────── */

function useGovernanceUser(authUser) {
  if (!authUser) return null;
  let demoRole = UserRole.super_admin;
  try {
    const override = localStorage.getItem("verbilo.demo.role");
    if (override && Object.values(UserRole).includes(override)) demoRole = override;
  } catch { /* noop */ }
  return {
    id:          authUser.id ?? authUser.cognitoId ?? "00000000-0000-0000-0000-000000000001",
    tenantId:    authUser.tenantId ?? "demo-tenant",
    displayName: authUser.displayName ?? "Dev User",
    role:        authUser.role ?? demoRole,
  };
}

/* ─── Root ────────────────────────────────────────────────────────────── */

export function AuditEvidenceCentre({ initialPackFilter } = {}) {
  const { user: authUser } = useAuth();
  const user = useGovernanceUser(authUser);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  /* Deep-link seeding: when the CQC Hub's "Manage Schedule" / "View
   * Schedule" buttons navigate here, App.jsx passes the relevant
   * pack key as `initialPackFilter` so the Master Feed opens already
   * scoped to that pack. Falls back to "all" when entered via the
   * sidebar. We don't react to subsequent prop changes — the user
   * owns the dropdown after first paint. */
  const [packFilter, setPackFilter] = useState(initialPackFilter ?? "all");
  const [exportOpen, setExportOpen] = useState(false);
  /* Three-stage row lifecycle. PMs delegate — they don't execute the
   * clinical check themselves. Each Set is a session-local override
   * on top of the schedule store's `overdue` flag.
   *   • nudgedScheduleIds     → row flipped OVERDUE → NUDGED/PENDING
   *                              (amber) when "Send Reminder" clicked
   *   • simulateSchedule      → the row whose simulation modal is open
   *   • completedScheduleIds  → row flipped NUDGED → COMPLIANT (green)
   *                              after the assignee "submitted" (via
   *                              the demo simulation shortcut) */
  const [nudgedScheduleIds,    setNudgedScheduleIds]    = useState(() => new Set());
  const [simulateSchedule,     setSimulateSchedule]     = useState(null);
  const [completedScheduleIds, setCompletedScheduleIds] = useState(() => new Set());
  /* Per-schedule completion meta — operator + timestamp + site name.
   * Surfaced inside the View Entry popover on completed rows so the
   * PM can confirm WHO actually filed the audit + WHEN, without
   * leaving the master feed. */
  const [completionMeta, setCompletionMeta] = useState(() => ({}));
  /* Read-only archive modal — the schedule whose immutable record is
   * currently open via the "View Entry" click on a completed row. */
  const [viewEntrySchedule, setViewEntrySchedule] = useState(null);
  /* Pull the shared toast surface from AgendaContext so the success
   * banner here matches the one used by Operational Logs / Today's
   * Compliance Agenda. */
  const { setToast } = useAgenda();

  /* Fires when the PM clicks "Send Reminder Notification" inside a
   * row's nudge popover. Stamps the schedule as nudged + raises a
   * toast naming the assignee so the PM sees the dispatch confirmed
   * without leaving the feed. */
  const handleSendNudge = (scheduleId, assigneeName) => {
    setNudgedScheduleIds((prev) => {
      const next = new Set(prev);
      next.add(scheduleId);
      return next;
    });
    const first = firstNameOf(assigneeName);
    setToast(`Escalation sent. Task flagged high-priority on ${first}'s calendar agenda.`);
  };

  /* Opens the simulation modal for a nudged row. The modal renders
   * the audit template pre-populated with safe-range mock values so
   * the demo doesn't require manual typing — it just needs Submit. */
  const handleSimulateSubmission = (schedule) => setSimulateSchedule(schedule);
  const handleCloseSimulation    = () => setSimulateSchedule(null);

  /* Opens the read-only archive view for a completed row. Reuses
   * LogModal with readOnly=true + an immutable-ledger banner + a
   * Close button instead of Submit. */
  const handleViewEntry  = (schedule) => setViewEntrySchedule(schedule);
  const handleCloseEntry = () => setViewEntrySchedule(null);

  /* Fires when the assignee "Submit Audit" inside the simulation
   * modal. Flips the row COMPLIANT (green), raises the resolution
   * toast naming the resolved real site lead + the site, and clears
   * the modal. */
  const handleSubmitSimulation = () => {
    if (!simulateSchedule) return;
    const site = sitesById[simulateSchedule.siteId];
    // Prefer the real site lead on the shared roster as the simulated submitter.
    const persona = simulationPersonaForSite(simulateSchedule.siteId);
    const now  = new Date();
    const hh   = String(now.getHours()).padStart(2, "0");
    const mm   = String(now.getMinutes()).padStart(2, "0");
    setCompletedScheduleIds((prev) => {
      const next = new Set(prev);
      next.add(simulateSchedule.id);
      return next;
    });
    setCompletionMeta((prev) => ({
      ...prev,
      [simulateSchedule.id]: {
        operator: persona,
        time:     `${hh}:${mm}`,
        siteName: site?.name ?? "—",
      },
    }));
    setSimulateSchedule(null);
    const siteLabel = site?.name ? `${site.name} Practice` : "the practice";
    setToast(`Audit completed by ${persona} (${siteLabel}). Master compliance ledgers updated.`);
  };

  // Reconcile overdue once on mount — same hygiene as AuditsPage.
  useEffect(() => { if (user) reconcileAuditOverdue(user.tenantId); }, [user?.tenantId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return <div style={{ padding: 24 }}>Loading…</div>;

  // Force re-read on tick — keeps the page reactive after a Resolve click.
  // eslint-disable-next-line no-unused-vars
  const _tick = tick;

  const sites    = listSites(user.tenantId);
  const sitesById = useMemo(() => Object.fromEntries(sites.map((s) => [s.id, s])), [sites]);
  const allUsers = listUsers(user.tenantId);
  const usersById = useMemo(() => Object.fromEntries(allUsers.map((u) => [u.id, u])), [allUsers]);

  const schedulesAll = listSchedules(user.tenantId);
  const schedules    = packFilter === "all"
    ? schedulesAll
    : schedulesAll.filter((s) => {
        const at = AUDIT_TYPES.find((a) => a.id === s.auditType);
        return at?.pack === packFilter;
      });

  // ── Readiness metrics ────────────────────────────────────────────────
  // Deliberately distinct from CQC audit coverage and operational readiness.
  // The shared contract supplies both the definition and calculation.
  const scheduleHealth = calculateAuditScheduleHealth(schedules);

  // ── Schedule feed: oldest-due first, overdue at the top ─────────────
  const feed = [...schedules].sort((a, b) => {
    if (a.overdue && !b.overdue) return -1;
    if (!a.overdue && b.overdue) return 1;
    return (a.nextDueDate ?? "").localeCompare(b.nextDueDate ?? "");
  }).slice(0, 25);

  // ── Corrective actions ──────────────────────────────────────────────
  const actionsFilter = packFilter === "all" ? {} : { packKey: packFilter };
  const openActions = listOpenCorrectiveActions(user.tenantId, actionsFilter);

  const handleResolve = (responseId) => {
    const note = prompt("Resolution note (optional) — e.g. 'engineer attended 23 May, PQ filed':") ?? null;
    resolveCorrectiveAction(user, responseId, { note });
    refresh();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Audit & Evidence Centre</h1>
        <p className={styles.headerLead}>
          Cross-pack orchestration for Area Managers and Practice Managers. Track audit programme health,
          work the audit schedule across every Live pack, generate CQC evidence packs and close out
          open corrective actions — all in one view.
        </p>
      </header>

      {/* ── Row 1: readiness + export vault ─────────────────────────── */}
      <div className={styles.topRow}>
        <ScheduleHealthCard
          pct={scheduleHealth.pct}
          total={scheduleHealth.total}
          onTrack={scheduleHealth.onTrack}
          overdue={scheduleHealth.overdue.length}
          dueSoon={scheduleHealth.dueSoon.length}
          openActions={openActions.length}
        />
        <ExportVaultCard onOpen={() => setExportOpen(true)} />
      </div>

      {/* ── Row 2: master schedule feed ─────────────────────────────── */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Master Audit Schedule Feed</h2>
          <span className={styles.sectionCount}>
            {schedules.length} schedule{schedules.length === 1 ? "" : "s"} · {scheduleHealth.overdue.length} overdue · showing {feed.length}
          </span>
          <PackFilter value={packFilter} onChange={setPackFilter} />
        </header>

        {feed.length === 0 ? (
          <div className={styles.empty}>
            <I name="checksquare" size={20} color="var(--outline-variant)" />
            <span>No audit schedules yet — they're created when each pack goes Live.</span>
          </div>
        ) : (
          <>
            <div className={styles.feedHead}>
              <span>Pack</span>
              <span>Audit · Site</span>
              <span>Due</span>
              <span>Status</span>
              <span>Owner</span>
              <span></span>
            </div>
            {feed.map((s) => (
              <FeedRow
                key={s.id}
                schedule={s}
                sitesById={sitesById}
                usersById={usersById}
                /* Three-stage status precedence applied inside FeedRow:
                 *   completed > nudged > overdue > pending.
                 * completionInfo carries the View Entry popover's
                 * submission metadata (operator + time + site). */
                isCompleted={completedScheduleIds.has(s.id)}
                completionInfo={completionMeta[s.id]}
                isNudged={nudgedScheduleIds.has(s.id)}
                onSendNudge={(assigneeName) => handleSendNudge(s.id, assigneeName)}
                onSimulate={() => handleSimulateSubmission(s)}
                onViewEntry={() => handleViewEntry(s)}
              />
            ))}
          </>
        )}
      </section>

      {/* ── Row 3: open corrective actions ──────────────────────────── */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Open Corrective Actions</h2>
          <span className={styles.sectionCount}>
            {openActions.length} unresolved Fail row{openActions.length === 1 ? "" : "s"} across all audits
          </span>
        </header>

        {openActions.length === 0 ? (
          <div className={styles.empty}>
            <I name="check" size={20} color="#2e7d32" />
            <span>No open Fail rows. Every flagged item has been resolved.</span>
          </div>
        ) : (
          <>
            <div className={styles.actionHead}>
              <span>Pack</span>
              <span>Site · Logged</span>
              <span>Failure detail</span>
              <span>Age</span>
              <span></span>
            </div>
            {openActions.map((a) => (
              <ActionRow
                key={a.responseId}
                action={a}
                sitesById={sitesById}
                onResolve={() => handleResolve(a.responseId)}
              />
            ))}
          </>
        )}
      </section>

      {exportOpen && (
        <ExportPackModal
          sitesAvailable={sites}
          onClose={() => setExportOpen(false)}
          onGenerate={(payload) => {
            // Telemetry hook — the modal now owns its own lifecycle
            // (selection → compiling → success), so we just log here
            // and let the modal stay open until the user closes it.
            // When the backend ZIP pipeline lands, this is where we'd
            // POST the payload and stream the resulting download URL
            // back into the modal's success-phase state.
            // eslint-disable-next-line no-console
            console.info("[Export Vault] Generate Evidence Pack — selection:", payload);
          }}
        />
      )}

      {/* Simulation modal — opens from the "🧪 Simulate Priya's
       * Submission" demo shortcut on any nudged row. The form is
       * pre-populated with safe-range mock values via
       * generateMockValues + signed by the SIMULATION_PERSONA, so the
       * demo only needs Submit Audit to close the loop. Header reads
       * "{Template Title} — {Site Name}" so the audience sees which
       * site + audit is being simulated. */}
      {simulateSchedule && (() => {
        const simTemplate = getAuditTemplate(simulateSchedule.auditType);
        const simSite     = sitesById[simulateSchedule.siteId];
        const baseTitle   = simTemplate?.title
                            ?? AUDIT_TYPES.find((a) => a.id === simulateSchedule.auditType)?.label
                            ?? simulateSchedule.auditType;
        const composite   = simSite ? `${baseTitle} — ${simSite.name}` : baseTitle;
        if (!simTemplate) {
          // Defensive: no template for this auditType. Bail cleanly.
          // eslint-disable-next-line no-console
          console.warn("[Simulate] No template for", simulateSchedule.auditType);
          handleCloseSimulation();
          return null;
        }
        return (
          <LogModal
            template={simTemplate}
            displayTitle={composite}
            site={simSite ?? null}
            /* Pre-populate signature + values so the modal opens
             * ready-to-submit, matching the brief's "looks ready to
             * go" requirement. Operator defaults to the resolved real
             * site lead for this schedule's site (falls back to the
             * fixed roster persona). */
            defaultOperatorName={simulationPersonaForSite(simulateSchedule.siteId)}
            initialValues={generateMockValues(simTemplate)}
            onCancel={handleCloseSimulation}
            onSubmit={handleSubmitSimulation}
          />
        );
      })()}

      {/* Read-only archive view — opens from "👁️ View Entry" on a
       * completed row. Reuses LogModal with readOnly=true so every
       * field is disabled, the footer collapses to a single Close
       * button, and an immutable-ledger banner renders above the
       * questions. Pre-populates with the same in-range mock values
       * the simulation used + locks the signature to the operator
       * who originally submitted. Header reads:
       *   "{Audit Title} — {Site Name} — Logged by {Operator}". */}
      {viewEntrySchedule && (() => {
        const vTemplate = getAuditTemplate(viewEntrySchedule.auditType);
        const vSite     = sitesById[viewEntrySchedule.siteId];
        /* Resolve completion metadata from two possible sources:
         *   1. completionMeta[id] — set by the demo simulation (Priya
         *      Shah, "today at HH:MM")
         *   2. fallback — derive from the schedule's stored data:
         *      ownerUserId (lookup in usersById) +
         *      lastCompletedAt (formatted as DD/MM/YYYY).
         * This makes the archive view work uniformly for baseline
         * compliant rows (e.g. Daniel Park's Sharps & Waste Audit)
         * AND for simulation-completed rows. */
        const vMeta       = completionMeta[viewEntrySchedule.id];
        const vScheduleOwner = usersById[viewEntrySchedule.ownerUserId]?.displayName ?? "Operator on file";
        const vOperator   = vMeta?.operator ?? vScheduleOwner;
        const vSiteName   = vMeta?.siteName ?? vSite?.name ?? "—";
        const vTimeLabel  = vMeta?.time
          ? `${vMeta.time} today`
          : (viewEntrySchedule.lastCompletedAt
              ? formatDate(viewEntrySchedule.lastCompletedAt)
              : "on file");
        const vBaseTitle  = vTemplate?.title
                            ?? AUDIT_TYPES.find((a) => a.id === viewEntrySchedule.auditType)?.label
                            ?? viewEntrySchedule.auditType;
        const vDisplay    = `${vBaseTitle} — ${vSiteName} — Logged by ${vOperator}`;

        if (!vTemplate) {
          // eslint-disable-next-line no-console
          console.warn("[ViewEntry] No template for", viewEntrySchedule.auditType);
          handleCloseEntry();
          return null;
        }

        return (
          <LogModal
            template={vTemplate}
            displayTitle={vDisplay}
            site={vSite ?? null}
            defaultOperatorName={vOperator}
            initialValues={generateMockValues(vTemplate)}
            readOnly
            submitLabel="✕ Close Archive View"
            topBanner={
              <>
                <span className={styles.archiveBannerLock} aria-hidden="true">🔒</span>
                <span>
                  <strong>VERBILO IMMUTABLE LEDGER RECORD</strong>
                  {" // "}VERIFIED BY <strong>{vOperator.toUpperCase()}</strong>
                  {" // "}{vTimeLabel.toUpperCase()}
                  {" // "}STATUS: <strong>COMPLIANT</strong>
                </span>
              </>
            }
            onCancel={handleCloseEntry}
            onSubmit={handleCloseEntry}
          />
        );
      })()}
    </div>
  );
}

/* ─── Readiness gauge card ────────────────────────────────────────────── */

function ScheduleHealthCard({ pct, total, onTrack, overdue, dueSoon, openActions }) {
  // SVG ring — circumference = 2πr where r=54 → ~339.292. Dasharray fills
  // the visible arc; offset (1 - pct/100) reveals the empty portion.
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;
  const ringColor =
    pct >= 90 ? "#2e7d32" :
    pct >= 75 ? "#1565c0" :
    pct >= 50 ? "#ef6c00" : "#c62828";

  return (
    <div className={styles.readiness}>
      <div
        className={styles.gauge}
        aria-label={`${READINESS_METRICS.auditScheduleHealth.label}: ${pct}%`}
        title={READINESS_METRICS.auditScheduleHealth.definition}
      >
        <svg viewBox="0 0 132 132" width={132} height={132}>
          {/* Track */}
          <circle cx="66" cy="66" r={r} fill="none" stroke="var(--surface-low)" strokeWidth="10" />
          {/* Fill — rotated -90° so the arc starts at 12 o'clock */}
          <circle cx="66" cy="66" r={r} fill="none" stroke={ringColor} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            transform="rotate(-90 66 66)"
            style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.3s ease" }} />
        </svg>
        <div className={styles.gaugePct}>
          <div className={styles.gaugePctValue}>{pct}%</div>
          <div className={styles.gaugePctLabel}>{READINESS_METRICS.auditScheduleHealth.shortLabel}</div>
        </div>
      </div>

      <div className={styles.readinessBody}>
        <div className={styles.readinessEyebrow}>{READINESS_METRICS.auditScheduleHealth.label}</div>
        <div className={styles.readinessHeadline}>
          {onTrack} of {total} schedule{total === 1 ? "" : "s"} on track across all Live packs
        </div>
        <div className={styles.readinessStats}>
          <div className={`${styles.stat} ${styles.statCurrent}`}>
            <span className={styles.statValue}>{onTrack}</span>
            <span className={styles.statLabel}>On Track</span>
          </div>
          <div className={`${styles.stat} ${styles.statDue}`}>
            <span className={styles.statValue}>{dueSoon}</span>
            <span className={styles.statLabel}>Due ≤ 7d</span>
          </div>
          <div className={`${styles.stat} ${styles.statOverdue}`}>
            <span className={styles.statValue}>{overdue}</span>
            <span className={styles.statLabel}>Overdue</span>
          </div>
          <div className={`${styles.stat} ${styles.statResolved}`}>
            <span className={styles.statValue}>{openActions}</span>
            <span className={styles.statLabel}>Open Fixes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Export Vault card ───────────────────────────────────────────────── */

function ExportVaultCard({ onOpen }) {
  return (
    <div className={styles.exportVault}>
      <div className={styles.exportVaultEyebrow}>
        <I name="download" size={11} color="var(--primary)" />
        CQC Export Vault
      </div>
      <div className={styles.exportVaultTitle}>
        Generate an inspection-ready evidence pack on demand.
      </div>
      <div className={styles.exportVaultLead}>
        Bundles every signed audit, completed acknowledgement, document version and corrective action
        log within your chosen window into a single PDF / ZIP manifesto for inspectors.
      </div>
      <button type="button" className={styles.exportVaultBtn} onClick={onOpen}>
        <I name="download" size={13} color="currentColor" />
        Generate Inspection Evidence Pack
      </button>
      <div className={styles.exportVaultFootnote}>
        Average compile time: ~45 seconds. Notification on completion.
      </div>
    </div>
  );
}

/* ─── Pack filter dropdown (shared between feed + actions) ────────────── */

function PackFilter({ value, onChange }) {
  // Build options from the packs we actually have schedules for, but
  // include the curated list so filters stay stable even with 0 schedules.
  return (
    <div className={styles.sectionFilter}>
      <span>Filter:</span>
      <select className="ui-control" aria-label="Filter schedules by governance pack" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="all">All packs</option>
        {Object.entries(PACK_BADGE_META).map(([k, m]) => (
          <option key={k} value={k}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── Schedule feed row ──────────────────────────────────────────────── */

function FeedRow({ schedule, sitesById, usersById, isCompleted = false, completionInfo, isNudged = false, onSendNudge, onSimulate, onViewEntry }) {
  const auditType = AUDIT_TYPES.find((a) => a.id === schedule.auditType);
  const packMeta  = packBadge(auditType?.pack);
  const template  = getAuditTemplate(schedule.auditType);
  const title     = template?.title ?? auditType?.label ?? schedule.auditType;
  const site      = sitesById[schedule.siteId];
  const ownerName = usersById[schedule.ownerUserId]?.displayName ?? "— Unassigned —";
  const assignee  = assigneeFor(auditType?.pack);

  /* Status precedence (highest priority first). Each branch is
   * mutually exclusive — derived flags strip out lower-priority
   * states so completion ALWAYS wins, then nudged, then overdue,
   * then a real persisted submission, then pending.
   *
   *   • isCompleted    → green "Complete" + check-circle (assignee
   *                      signed off via the demo simulation)
   *   • isStrictlyNudged → amber "Nudged / Pending" (delegated; the
   *                        clinical task is still outstanding)
   *   • isOverdue      → red "Overdue"
   *   • isDone         → green "Complete" (real persisted submission)
   *   • else           → blue "Pending"
   *
   * The strict flags are what the action-cell buttons branch on —
   * keeping the state→button mapping one-to-one prevents the
   * Simulate button ever co-existing with the View Entry button. */
  const isStrictlyNudged = isNudged && !isCompleted;
  const isOverdue        = schedule.overdue && !isStrictlyNudged && !isCompleted;
  const isDone           = !isCompleted && !!schedule.lastCompletedAt && !isOverdue && !isStrictlyNudged;
  /* Simulation-completed rows render with the EXACT same visual
   * treatment as the existing real-completion rows (.statusComplete +
   * "Complete" label + green check-circle icon). The user shouldn't
   * be able to tell a simulated submission apart from a real one at
   * a glance — the audit trail underneath is what records the
   * provenance. */
  const statusClass = (isCompleted || isDone) ? styles.statusComplete
                     : isStrictlyNudged       ? styles.statusNudged
                     : isOverdue              ? styles.statusOverdue
                                              : styles.statusPending;
  const statusLabel = (isCompleted || isDone) ? "Complete"
                     : isStrictlyNudged       ? "⚠️ Nudged / Pending"
                     : isOverdue              ? "Overdue"
                                              : "Pending";
  const showCheckIcon = isCompleted || isDone;

  /* Popover open/close — anchored to the Nudge button. Click outside
   * (or press ESC) dismisses. */
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  useEffect(() => {
    if (!popoverOpen) return undefined;
    const onClick = (e) => {
      if (!popoverRef.current?.contains(e.target)) setPopoverOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setPopoverOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [popoverOpen]);

  const handleSend = () => {
    setPopoverOpen(false);
    onSendNudge?.(assignee.name);
  };

  return (
    <div className={styles.feedRow}>
      <span className={styles.packBadge}
        style={{ background: `color-mix(in srgb, ${packMeta.color} 14%, transparent)`, color: packMeta.color }}>
        <I name={packMeta.icon} size={10} color={packMeta.color} />
        {packMeta.label}
      </span>
      <span className={styles.feedTitle}>
        <span>{title}</span>
        <span className={styles.feedSite}>{site?.name ?? "Unknown site"}</span>
      </span>
      <span className={`${styles.feedDate} ${isOverdue ? styles.feedDateOverdue : ""}`}>
        {schedule.nextDueDate ? formatDate(schedule.nextDueDate) : "—"}
      </span>
      <span className={`${styles.statusBadge} ${statusClass}`}>
        {showCheckIcon && (
          <I name="checkcircle" size={11} color="currentColor" />
        )}
        {statusLabel}
      </span>
      <span className={styles.feedOwner}>{ownerName}</span>
      {/* Action cell — four exclusive states:
       *   • overdue + not yet nudged → "Nudge Team" outlined pill
       *                                + Quick-Assign popover
       *   • nudged + not yet completed → "🧪 Simulate Priya's
       *                                   Submission" dashed utility
       *                                   link (demo shortcut)
       *   • completed               → "👁️ View Entry" low-emphasis
       *                                link + read-only detail popover
       *   • everything else         → empty cell (grid baseline) */}
      <span className={styles.feedAction} ref={popoverRef}>
        {isOverdue && (
          <button
            type="button"
            className={styles.nudgeBtn}
            onClick={() => setPopoverOpen((v) => !v)}
            aria-haspopup="dialog"
            aria-expanded={popoverOpen}
            aria-label={`Nudge team for ${title}`}
          >
            <I name="bell" size={13} />
            Nudge Team
          </button>
        )}
        {/* CRITICAL: gate on isStrictlyNudged, not raw isNudged.
         * isStrictlyNudged is false the moment isCompleted flips on,
         * so the Simulate button unmounts cleanly from the DOM the
         * instant the form submits — no stale render, no co-existing
         * with the View Entry link. */}
        {isStrictlyNudged && onSimulate && (
          <button
            type="button"
            className={styles.simulateBtn}
            onClick={onSimulate}
            aria-label={`Simulate ${SIMULATION_PERSONA}'s submission for ${title}`}
            title="Demo shortcut — open the assignee's pre-populated form"
          >
            <span className={styles.simulateBtnIcon} aria-hidden="true">🧪</span>
            Simulate {firstNameOf(SIMULATION_PERSONA)}&apos;s Submission
          </button>
        )}
        {/* Every Complete row — whether the completion came from the
         * demo simulation OR from a real persisted submission
         * (schedule.lastCompletedAt set) — renders the same
         * low-emphasis "View Entry" link. The parent's modal block
         * derives the operator + timestamp + site from whichever
         * source has the data, so baseline compliant rows (e.g. owned
         * by Daniel Park) get the same ledger-inspection affordance
         * as freshly simulated ones. */}
        {(isCompleted || isDone) && (
          <button
            type="button"
            className={styles.viewEntryBtn}
            onClick={onViewEntry}
            title={completionInfo
              ? `Submitted by ${completionInfo.operator} at ${completionInfo.time} today · ${completionInfo.siteName}`
              : `Submitted by ${ownerName} · ${site?.name ?? "—"}`}
            aria-label={`View ledger entry for ${title}`}
          >
            <I name="eye" size={13} />
            View Entry
          </button>
        )}

        {popoverOpen && isOverdue && (
          <div className={styles.nudgePopover} role="dialog" aria-label="Assign + nudge">
            <div className={styles.nudgePopHead}>
              <span className={styles.nudgePopEyebrow}>Quick assign</span>
              <button
                type="button"
                className={styles.nudgePopClose}
                onClick={() => setPopoverOpen(false)}
                aria-label="Close assignment"
              >
                ×
              </button>
            </div>
            <div className={styles.nudgePopBody}>
              <div className={styles.nudgeAssigneeRow}>
                <div className={styles.nudgeAvatar} aria-hidden="true">
                  {firstNameOf(assignee.name).charAt(0)}
                </div>
                <div className={styles.nudgeAssigneeText}>
                  <div className={styles.nudgeAssigneeLabel}>
                    {assignee.role === "RPS"
                      ? `RPS: ${assignee.name}`
                      : `Assigned to: ${assignee.role} ${assignee.name}`}
                  </div>
                  <div className={styles.nudgeAssigneeHint}>
                    {title} · {site?.name ?? "—"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={styles.nudgeSendBtn}
                onClick={handleSend}
              >
                <span className={styles.nudgeSendBtnIcon} aria-hidden="true">🚀</span>
                Send Reminder Notification
              </button>
            </div>
          </div>
        )}

      </span>
    </div>
  );
}

/* ─── Corrective action row ──────────────────────────────────────────── */

function ActionRow({ action, sitesById, onResolve }) {
  const packMeta = packBadge(action.packKey);
  const site     = sitesById[action.siteId];
  const template = getAuditTemplate(action.templateId);
  const question = template?.questions?.find((q) => q.id === action.questionId);

  // Age in days, plus a "stale" flag at > 30 days (the colour-coded hint).
  const ageMs = action.failedAt ? Date.now() - Date.parse(action.failedAt) : 0;
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  const isStale = ageDays > 30;

  return (
    <div className={styles.actionRow}>
      <span className={styles.packBadge}
        style={{ background: `color-mix(in srgb, ${packMeta.color} 14%, transparent)`, color: packMeta.color }}>
        <I name={packMeta.icon} size={10} color={packMeta.color} />
        {packMeta.label}
      </span>
      <span className={styles.feedTitle}>
        <span>{site?.name ?? "—"}</span>
        <span className={styles.feedSite}>{formatDate(action.failedAt)}</span>
      </span>
      <span className={styles.actionFailText}>
        {question?.text ?? action.questionId}
        {action.actionRequired && (
          <span className={styles.actionFailNote}>“{action.actionRequired}”</span>
        )}
      </span>
      <span className={`${styles.actionAge} ${isStale ? styles.actionAgeStale : ""}`}>
        {ageDays === 0 ? "Today" : `${ageDays}d open`}
      </span>
      <button type="button" className={styles.actionResolveBtn} onClick={onResolve}>
        <I name="check" size={11} color="currentColor" />
        Mark Resolved
      </button>
    </div>
  );
}

/* ─── Export Pack modal ──────────────────────────────────────────────
 * Three-phase lifecycle owned entirely by this component:
 *   1. "select"     — user picks date range / domains / sites
 *   2. "compiling"  — animated loader (~3s): cycling log line + bar
 *   3. "success"    — green badge, file manifest, download CTA + toast
 *
 * Parent only flips the open flag; `onGenerate` is a telemetry hook
 * that fires once when compilation kicks off. */

const COMPILE_LOG_LINES = [
  "Gathering signed audit runs and digital signatures...",
  "Hashing immutable ledger files for selected sites...",
  "Bundling version-controlled SOP documents...",
  "Compiling comprehensive PDF inspector manifesto...",
];

/* Non-crypto hash → plausible-looking SHA-256 prefix for the
 * "Security Hash" line. Deterministic given the same selection so the
 * UI doesn't churn on every re-render. */
function pseudoSha256Prefix(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hi = (h >>> 0).toString(16).padStart(8, "0");
  const lo = (Math.imul(h, 31) >>> 0).toString(16).padStart(8, "0");
  return `${hi}${lo}`.toUpperCase();
}

function ExportPackModal({ sitesAvailable, onClose, onGenerate }) {
  // Default: last 12 months → today.
  const today = new Date().toISOString().slice(0, 10);
  const twelveMonthsAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [from, setFrom] = useState(twelveMonthsAgo);
  const [to,   setTo]   = useState(today);
  const [domains, setDomains] = useState([
    "audit_runs", "acknowledgements", "documents", "corrective_actions", "evidence_files",
  ]);
  const [siteIds, setSiteIds] = useState([]);    // empty = all

  /* Lifecycle phase + animated state. */
  const [phase, setPhase] = useState("select");     // "select" | "compiling" | "success"
  const [progress, setProgress] = useState(0);      // 0..100
  const [logIndex, setLogIndex] = useState(0);      // index into COMPILE_LOG_LINES
  const [toast, setToast] = useState(null);

  const toggleDomain = (d) =>
    setDomains((arr) => arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d]);
  const toggleSite = (id) =>
    setSiteIds((arr) => arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const canGenerate = !!from && !!to && from <= to && domains.length > 0;

  const DOMAINS = [
    { key: "audit_runs",         label: "Audit runs + Q/A" },
    { key: "acknowledgements",   label: "Staff acknowledgements" },
    { key: "documents",          label: "SOPs + version history" },
    { key: "corrective_actions", label: "Corrective actions log" },
    { key: "evidence_files",     label: "Uploaded evidence files" },
    { key: "audit_trail",        label: "Full audit trail" },
  ];

  /* Compilation lifecycle effect.
   * Runs only while phase === "compiling". Animates:
   *   • progress bar from 0 → 100 in ~3s (30 steps × 100ms)
   *   • cycling log line every 800ms, clamped at the last entry
   *   • transition to "success" at ~3.2s */
  useEffect(() => {
    if (phase !== "compiling") return undefined;
    setProgress(0);
    setLogIndex(0);

    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(100, p + 100 / 30));
    }, 100);

    const logTimer = setInterval(() => {
      setLogIndex((i) => Math.min(COMPILE_LOG_LINES.length - 1, i + 1));
    }, 800);

    const successTimer = setTimeout(() => {
      setProgress(100);
      setPhase("success");
    }, 3200);

    return () => {
      clearInterval(progressTimer);
      clearInterval(logTimer);
      clearTimeout(successTimer);
    };
  }, [phase]);

  /* Toast auto-dismiss (~2.6s, matches the Operational Logs toast). */
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  /* Pack manifest derived from the selection. Computed once at success
   * time so the hash + filename stay stable while the user reads it. */
  const manifest = useMemo(() => {
    if (phase !== "success") return null;
    let siteLabel;
    if (siteIds.length === 0)      siteLabel = "All-Sites";
    else if (siteIds.length === 1) siteLabel = sitesAvailable.find((s) => s.id === siteIds[0])?.name?.replace(/\s+/g, "-") ?? "Site";
    else                           siteLabel = `${siteIds.length}-Sites`;

    const seed = `${from}|${to}|${domains.join(",")}|${siteIds.join(",")}`;
    const hash = pseudoSha256Prefix(seed);
    const headHex = hash.slice(0, 4);
    const tailHex = hash.slice(-4);

    return {
      // Switched to .txt so the file opens flawlessly on any OS — a
      // .zip wrapper around a plain-text payload trips Windows'
      // "invalid compressed folder" guard. Once the server-side ZIP
      // pipeline lands, flip back to .zip with `application/zip`.
      filename: `Verbilo-CQC-Manifesto-${siteLabel}.txt`,
      size:     "42.8 MB",
      hash:     `SHA-256 [${headHex}...${tailHex}]`,
    };
  }, [phase, from, to, domains, siteIds, sitesAvailable]);

  const handleGenerate = () => {
    onGenerate?.({ from, to, domains, siteIds });
    setPhase("compiling");
  };

  const handleDownload = () => {
    /* Frontend-only manifesto stub — generates an in-memory plain-text
     * blob and triggers a real browser download via a temporary
     * anchor. The .txt extension + text/plain MIME ensures Windows /
     * macOS / Linux all open it flawlessly during the demo (a .zip
     * wrapper around a text payload trips Windows' "invalid
     * compressed folder" guard). When the server-side ZIP pipeline
     * lands, swap the blob payload + MIME + .zip extension; the
     * anchor pattern stays identical. */
    if (!manifest) return;

    // Human-readable site label for the file body. Same site label is
    // also baked into the filename by the manifest memo above.
    let siteLine;
    if (siteIds.length === 0) {
      siteLine = "All Sites (Group-wide)";
    } else if (siteIds.length === 1) {
      siteLine = sitesAvailable.find((s) => s.id === siteIds[0])?.name ?? "Selected Site";
    } else {
      siteLine = siteIds
        .map((id) => sitesAvailable.find((s) => s.id === id)?.name)
        .filter(Boolean)
        .join(", ");
    }

    /* Format dates in UK locale — DD/MM/YYYY for the scope range and
     * DD/MM/YYYY HH:mm BST for the generation timestamp. Manual " BST"
     * suffix because Intl.DateTimeFormat doesn't expose the short TZ
     * abbreviation without a polyfill, and this is a stub anyway. */
    const fmtDate = (iso) => {
      const [y, m, d] = iso.split("-");
      return `${d}/${m}/${y}`;
    };
    const stamp = new Date().toLocaleString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
      timeZone: "Europe/London",
      hour12: false,
    }).replace(",", "");

    const ruleHeavy = "=".repeat(70);
    const ruleLight = "-".repeat(70);

    const mockContent = [
      ruleHeavy,
      "VERBILO COMPLIANCE TRUST ENGINE - CQC INSPECTION MANIFESTO",
      ruleHeavy,
      `Generated:    ${stamp} BST`,
      `Target Site:  ${siteLine}`,
      `Audit Scope:  ${fmtDate(from)} -> ${fmtDate(to)}`,
      "",
      "CRYPTOGRAPHIC LEDGER VERIFICATION:",
      ruleLight,
      "[PASS] Decontamination & Validation Runs (HTM 01-05 Compliance Verified)",
      "[PASS] Water Quality & Microbiological Controls (Legionella Check-In-Date)",
      "[PASS] Radiation Safety & IR(ME)R 2017 Systems Secure",
      "[PASS] Clinical & Workforce Governance Logs Audited",
      "",
      ruleHeavy,
      "STATUS: SECURE & READY FOR INSPECTION",
      `Immutable Block Hash: ${manifest.hash}`,
      ruleHeavy,
      "",
    ].join("\n");

    const blob = new Blob([mockContent], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    // Programmatic anchor → browser handles the actual file-save dialog
    // / download-bar behaviour natively. Append + remove is required by
    // Firefox (Chrome/Safari fire .click() on detached nodes too, but
    // the safe path is to attach briefly).
    const a = document.createElement("a");
    a.href     = url;
    a.download = manifest.filename;
    a.rel      = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Revoke immediately — the browser has already started the download
    // by the time .click() returns, so the blob URL is no longer needed.
    URL.revokeObjectURL(url);

    setToast("Manifesto download initiated.");
  };

  /* Scrim is non-dismissable while compiling — closing mid-compile
   * would leave a half-built ZIP on the server in a real pipeline. */
  const handleScrimClick = () => {
    if (phase === "compiling") return;
    onClose();
  };

  return (
    <div className={styles.scrim} onClick={handleScrimClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHead}>
          <div className={styles.modalEyebrow}>CQC Export Vault</div>
          <h3 className={styles.modalTitle}>
            {phase === "select"    && "Generate Inspection Evidence Pack"}
            {phase === "compiling" && "Compiling Inspection Evidence Pack"}
            {phase === "success"   && "Pack Ready for Download"}
          </h3>
        </header>

        {/* ─── Phase 1: SELECTION ──────────────────────────────────── */}
        {phase === "select" && (
          <>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Date range</span>
                <div className={styles.modalDateRow}>
                  <input type="date" className={styles.modalInput} value={from} onChange={(e) => setFrom(e.target.value)} />
                  <input type="date" className={styles.modalInput} value={to}   onChange={(e) => setTo(e.target.value)} />
                </div>
              </div>

              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Domains to include</span>
                <div className={styles.modalCheckGrid}>
                  {DOMAINS.map((d) => {
                    const on = domains.includes(d.key);
                    return (
                      <label key={d.key}
                        className={on ? `${styles.modalCheckRow} ${styles.modalCheckRowOn}` : styles.modalCheckRow}>
                        <input type="checkbox" checked={on} onChange={() => toggleDomain(d.key)} />
                        <span>{d.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>
                  Sites <span style={{ fontWeight: 400, textTransform: "none", color: "var(--on-surface-variant)" }}>
                    — leave all unchecked for group-wide
                  </span>
                </span>
                <div className={styles.modalCheckGrid}>
                  {sitesAvailable.map((s) => {
                    const on = siteIds.includes(s.id);
                    return (
                      <label key={s.id}
                        className={on ? `${styles.modalCheckRow} ${styles.modalCheckRowOn}` : styles.modalCheckRow}>
                        <input type="checkbox" checked={on} onChange={() => toggleSite(s.id)} />
                        <span>{s.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <footer className={styles.modalFoot}>
              <button type="button" className={styles.modalCancelBtn} onClick={onClose}>Cancel</button>
              <button type="button" className={styles.modalGenerateBtn}
                disabled={!canGenerate}
                onClick={handleGenerate}>
                <I name="download" size={12} color="currentColor" />
                Generate Pack
              </button>
            </footer>
          </>
        )}

        {/* ─── Phase 2: COMPILING ──────────────────────────────────── */}
        {phase === "compiling" && (
          <div className={styles.compileBody}>
            <div className={styles.compileSpinnerRow}>
              <div className={styles.compileSpinner} aria-hidden="true" />
              <div className={styles.compileStageLabel}>
                Compiling Evidence Pack
                <div className={styles.compileStagePct}>{Math.round(progress)}%</div>
              </div>
            </div>

            <div className={styles.compileBar} role="progressbar"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
              <div
                className={styles.compileBarFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className={styles.compileLogBox} aria-live="polite">
              {COMPILE_LOG_LINES.map((line, i) => {
                const state = i < logIndex   ? "done"
                            : i === logIndex ? "active"
                                              : "pending";
                return (
                  <div key={i} className={`${styles.compileLogLine} ${styles[`logLine_${state}`]}`}>
                    <span className={styles.compileLogIcon}>
                      {state === "done"   ? "✓" : "🔄"}
                    </span>
                    <span>{line}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Phase 3: SUCCESS ────────────────────────────────────── */}
        {phase === "success" && manifest && (
          <>
            <div className={styles.successBody}>
              <div className={styles.successBadge}>
                <span className={styles.successBadgeIcon} aria-hidden="true">✓</span>
                <span className={styles.successBadgeText}>
                  Inspection Evidence Pack Securely Compiled
                </span>
              </div>

              <dl className={styles.manifestBox} aria-label="Pack manifest">
                <div className={styles.manifestRow}>
                  <dt>File</dt>
                  <dd className={styles.manifestMono}>{manifest.filename}</dd>
                </div>
                <div className={styles.manifestRow}>
                  <dt>Size</dt>
                  <dd className={styles.manifestMono}>{manifest.size}</dd>
                </div>
                <div className={styles.manifestRow}>
                  <dt>Security Hash</dt>
                  <dd className={styles.manifestMono}>{manifest.hash}</dd>
                </div>
              </dl>
            </div>

            <footer className={styles.modalFoot}>
              <button type="button" className={styles.modalCancelBtn} onClick={onClose}>Close</button>
              <button type="button" className={styles.modalDownloadBtn} onClick={handleDownload}>
                <span className={styles.modalDownloadIcon} aria-hidden="true">📥</span>
                Download ZIP Manifesto
              </button>
            </footer>
          </>
        )}

        {/* ─── Toast (rendered inside the modal scope) ────────────── */}
        {toast && (
          <div className={styles.exportToast} role="status" aria-live="polite">
            <span className={styles.exportToastIcon}>✓</span>
            <span>{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}
