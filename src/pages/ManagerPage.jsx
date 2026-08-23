import { useState, useEffect, useMemo } from "react";
import { I } from "../components/Icon";
import { UdaContractModal } from "../components/manager/UdaContractModal";
import { udaTotals } from "../services/fixtures/manager.fixture";
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { TopBar } from "../components/layout/TopBar";
import {
  listSnapshotActions, listLeaveRequests, updateLeaveStatus,
  listGdcRecords, listTrainingRecords, listManagerIncidents,
  getCqcSummary, getUdaTotal, listUdaDentists,
} from "../services/manager.service";
import { udaPaceTarget, udaOnTrack, udaCompletePct } from "../services/logic/manager.logic";
import { toRgba } from "../services/logic/shared.logic";
import { useDevRole } from "../services/devRole";
import { getPracticeMetric } from "../services/practiceMetrics.service";
import { READINESS_METRICS } from "../services/readiness.service";
import { RotaView } from "./manager/RotaView";
import { applyLeaveBlock as applyRotaLeaveBlock, ROTA_LEAVE_DEMO_STAFF } from "../services/rota/rotaStore";
import { siteName } from "../services/sites";
import { clinicalStaffAtSite, personAtSiteByRole } from "../services/people";
import { defaultSiteFor, hasMultiSiteScope } from "../services/scope";
import { ScopeSwitcher } from "../components/layout/ScopeSwitcher";
import styles from "./ManagerPage.module.css";

/* ── Mock compliance state ────────────────────────────────────────────────
 *
 * The Practice Snapshot's new Protocols row + the CQC Audit Progress
 * accordion's Adopted Group Protocols block both read off the same
 * lightweight fixture so the demo stays internally consistent.
 *
 * Production swaps this for `listAdoptedProtocolCompliance(siteId)`
 * which would join AdoptedProtocols × StaffAcknowledgements per
 * version and return the same shape per row. */
/* Builds the adopted-protocol compliance rows from the REAL site
 * roster. The whole staff list (people.js, scoped to the site) is
 * split into signed vs still-outstanding so the roster modal shows
 * real, site-scoped people — no invented cast, no "Brighton".
 *
 * `signed` / `total` stay as the original demo counters (a fast
 * progress-bar source) and the per-protocol `outstandingCount`
 * controls how many of the tail roster are shown as not-yet-signed,
 * matching the original 3-/1-outstanding split.
 *
 * Production swaps this for `listAdoptedProtocolCompliance(siteId)`
 * joining AdoptedProtocols × StaffAcknowledgements per version. */
function buildAdoptedProtocolCompliance(siteId) {
  /* Real, site-scoped people in a stable roster order. */
  const roster = [
    ...clinicalStaffAtSite(siteId, "Dentist"),
    ...clinicalStaffAtSite(siteId, "FD"),
    ...clinicalStaffAtSite(siteId, "Nurse"),
    ...clinicalStaffAtSite(siteId, "Hygienist"),
    ...clinicalStaffAtSite(siteId, "Reception"),
  ];
  const pm = personAtSiteByRole(siteId, ["practiceManager", "deputyPracticeManager"]);
  const people = [...(pm ? [pm] : []), ...roster];

  /* Human-readable role label from the org role. */
  const roleLabel = (p) =>
    p.role === "practiceManager"      ? "Practice Manager"
    : p.role === "deputyPracticeManager" ? "Deputy Practice Manager"
    : p.role === "clinicalLead"       ? "Clinical Lead"
    : p.role === "leadNurse"          ? "Lead Nurse"
    : p.role === "dentalNurse"        ? "Nurse"
    : p.role === "associateDentist"   ? "Dentist"
    : p.role === "foundationDentist"  ? "Foundation Dentist"
    : p.role === "hygienist"          ? "Hygienist"
    : p.role === "frontOfHouseLead"   ? "Front of House Lead"
    : p.role === "receptionist"       ? "Receptionist"
    : "Team";

  /* Slice the roster into (total - outstandingCount) signed + the
   * tail outstanding, all from real people. Dates step backwards. */
  const rowFor = (outstandingCount, baseDate) => {
    const cut = Math.max(0, people.length - outstandingCount);
    const signedStaff = people.slice(0, cut).map((p, i) => ({
      name: p.displayName,
      role: roleLabel(p),
      date: `2026-05-${String(baseDate - i).padStart(2, "0")}`,
    }));
    const outstandingStaff = people.slice(cut).map((p) => ({
      name: p.displayName,
      role: roleLabel(p),
    }));
    return { signedStaff, outstandingStaff };
  };

  return [
    {
      reference: "CORE-01",
      title:     "Medical Emergencies",
      signed:    12,
      total:     15,
      ...rowFor(3, 22),
    },
    {
      reference: "CORE-03",
      title:     "Antimicrobial Prescribing",
      signed:    14,
      total:     15,
      ...rowFor(1, 23),
    },
  ];
}

/* Module-level default (Southall) — kept for any consumer importing
 * the static shape. Site-reactive callers rebuild per active site. */
const ADOPTED_PROTOCOL_COMPLIANCE = buildAdoptedProtocolCompliance("site-southall");

/* Demo state: how many protocols the current staff user still owes a
 * personal acknowledgement for. Drives the clinician-mode banner.
 * (Production: derive from `listAcknowledgements` per adopted
 *  protocol where userId !== current user.) */
const CLINICIAN_PENDING_SIGNATURES = 2;

const TRAINING_COLS = [
  { key: "bls",          label: "BLS/CPR"      },
  { key: "fire",         label: "Fire Safety"  },
  { key: "ipc",          label: "IPC"          },
  { key: "safeguarding", label: "Safeguarding" },
  { key: "gdpr",         label: "GDPR"         },
];

const UDA_TOTAL_DEFAULT = { contracted: 0, delivered: 0, period: "", monthsElapsed: 0, totalMonths: 1 };
const CQC_SUMMARY_DEFAULT = { complete: 0, total: 0, lastAudit: "—" };

/* ─── Active Action Queue (PM-1) ──────────────────────────────────
 * Tier-classified action items demanding PM attention. Tier is
 * derived from `category` via `tierForCategory()` (rule-based, no
 * manual triage). For Slice PM-1 the items are hand-curated; later
 * slices wire to live data sources (incidents register, leave
 * requests, GDC expiries, training records). */
function buildActionQueueSeed(siteId) {
  /* Real, site-scoped people drive the queue copy. The leave request
   * targets the hygienist who actually staffs the hygiene room in the
   * rota seed, so "Approve & Auto-Update Rota" flips a real person's
   * real shifts (see ROTA_LEAVE_DEMO_STAFF). */
  const nurse    = personAtSiteByRole(siteId, ["leadNurse", "dentalNurse"]);
  const dentist  = clinicalStaffAtSite(siteId, "Dentist")[0];
  const nurseName   = nurse?.displayName   ?? "the duty nurse";
  const dentistName = dentist?.displayName ?? "the lead clinician";
  const hygienistName = ROTA_LEAVE_DEMO_STAFF;
  return [
    {
      id:       "aq-1",
      category: "incident",
      title:    "Needle-stick Injury Logged — Surgery 3",
      body:     `Logged by Nurse ${nurseName} today at 11:15 BST. Sharp container tracking code: #SC-09B.`,
      when:     "12m ago",
      actions:  [
        { label: "Open Incident Ledger", kind: "primary", nav: "cqc" },
        { label: "Dismiss to Archive",   kind: "secondary" },
      ],
    },
    {
      id:       "aq-2",
      category: "leave_pending",
      title:    `Pending Annual Leave Request: ${hygienistName}`,
      body:     "Hygienist requesting 2 Jun – 6 Jun (Mon-Fri). Internal cover availability confirmed by system check.",
      when:     "2h ago",
      actions:  [
        { label: "Approve & Auto-Update Rota", kind: "primary" },
        { label: "View Scheduling Conflicts",  kind: "secondary" },
      ],
    },
    {
      id:       "aq-3",
      category: "doc_renewal",
      title:    "Professional Medical Indemnity Document Renewal",
      body:     `${dentistName}'s certificate expires in 12 days. System will block scheduling if not updated.`,
      when:     "Yesterday",
      actions:  [
        { label: "Dispatch Push Reminder", kind: "primary" },
      ],
    },
  ];
}

/* Tier classification rules — keeps PM out of the triage business.
 *   TIER 1 → Urgent          (incidents, breaches, safety overdue)
 *   TIER 2 → Action Today    (leave pending, today's deadlines)
 *   TIER 3 → This Week       (renewals, expiries 7-14d out) */
function tierForCategory(category) {
  if (["incident", "breach", "safety_overdue"].includes(category)) return 1;
  if (["leave_pending", "today_deadline"].includes(category))      return 2;
  return 3;
}

/* Bold solid fills (modern-feel refresh) — was soft tints + tinted
 * text. Field names kept (`accent` = text colour, `tint` = bg) to
 * avoid touching the JSX. */
const TIER_META = {
  1: { label: "URGENT",       accent: "white", tint: "#c62828" },
  2: { label: "ACTION TODAY", accent: "white", tint: "#a34800" },
  3: { label: "THIS WEEK",    accent: "white", tint: "#1565c0" },
};

/* ─── Compliance Rhythms (PM-1) ───────────────────────────────────
 * Recurring operational checks the PM sees at a glance — each row
 * has an assigned owner and a current-status pill. The action verb
 * adapts to the status. */
function buildComplianceRhythmsSeed(siteId) {
  /* Owners are real, site-scoped staff. "Rota Cover" stays a generic
   * pool label (it's a placeholder, not a fabricated person). */
  const leadNurse = personAtSiteByRole(siteId, "leadNurse");
  const nurses    = clinicalStaffAtSite(siteId, "Nurse");
  const otherNurse = nurses.find((n) => n.id !== leadNurse?.id) ?? nurses[0];
  const dentist   = clinicalStaffAtSite(siteId, "Dentist")[0];
  const leadNurseLabel = leadNurse ? `${leadNurse.displayName} (Lead Nurse)` : "Lead Nurse";
  return [
    { id: "cr-1", area: "Sentinel Tap Temps",   assigned: leadNurseLabel,                     status: "completed", nav: "logbooks" },
    { id: "cr-2", area: "Autoclave Pressure",    assigned: otherNurse?.displayName ?? "—",     status: "overdue",   nav: "logbooks" },
    { id: "cr-3", area: "Controlled Drugs",      assigned: dentist?.displayName ?? "—",        status: "pending",   nav: "logbooks" },
    { id: "cr-4", area: "DUWL Purging",          assigned: "Rota Cover",                        status: "active",    nav: "logbooks" },
  ];
}

/* Soft-tinted fills with deep saturated text — matches the lighter
 * pill aesthetic from the mockup. Reverted from bold solid fills
 * (those felt too heavy in the rhythm table context).
 * Field names kept: tint = bg, color = text. */
const RHYTHM_STATUS_META = {
  completed: { label: "Completed", tint: "rgba(46,125,50,0.12)",  color: "#1b5e20", action: "View"  },
  overdue:   { label: "Overdue",   tint: "rgba(198,40,40,0.12)",  color: "#9c1c1c", action: "Log"   },
  pending:   { label: "Pending",   tint: "rgba(239,108,0,0.14)",  color: "#7d4300", action: "Open"  },
  active:    { label: "Active",    tint: "rgba(21,101,192,0.12)", color: "#0a3d6b", action: "Check" },
};

/* ── Status configs ────────────────────────────────────────────────────────── */

const GDC_CFG = {
  ok:      { label: "Active",   bg: "rgba(46,125,50,0.1)",   color: "#2e7d32" },
  warning: { label: "Due Soon", bg: "rgba(245,124,0,0.1)",   color: "#b36000" },
  expired: { label: "Expired",  bg: "rgba(229,57,53,0.1)",   color: "#e53935" },
  na:      { label: "N/A",      bg: "rgba(150,150,150,0.1)", color: "#888"    },
};

const TRAINING_CFG = {
  ok:      { bg: "rgba(46,125,50,0.12)",  color: "#2e7d32", label: "✓" },
  warning: { bg: "rgba(245,124,0,0.12)",  color: "#b36000", label: "!" },
  overdue: { bg: "rgba(229,57,53,0.12)",  color: "#e53935", label: "✕" },
};

const SEVERITY_CFG = {
  High:   { bg: "rgba(229,57,53,0.1)",  color: "#e53935" },
  Medium: { bg: "rgba(245,124,0,0.1)",  color: "#b36000" },
  Low:    { bg: "rgba(46,125,50,0.1)",  color: "#2e7d32" },
};

const STATUS_CFG = {
  "Under Review": { bg: "rgba(245,124,0,0.1)",  color: "#b36000" },
  "Open":         { bg: "rgba(229,57,53,0.1)",  color: "#e53935" },
  "Closed":       { bg: "rgba(46,125,50,0.1)",  color: "#2e7d32" },
};

const LEAVE_CFG = {
  pending:  { bg: "rgba(245,124,0,0.1)",  color: "#b36000", label: "Pending"  },
  approved: { bg: "rgba(46,125,50,0.1)",  color: "#2e7d32", label: "Approved" },
  declined: { bg: "rgba(229,57,53,0.1)",  color: "#e53935", label: "Declined" },
};

/* ── Accordion helpers ─────────────────────────────────────────────────────── */


/* ── Page ──────────────────────────────────────────────────────────────────── */

/* Drill-in scorecard RAG thresholds — kept identical to the Management Hub
 * league table (pctRag / udaRag / countRag) so figures AND colours match. */
const SCORE_RAG = { ok: "#2e7d32", warn: "#b36000", bad: "#c62828" };
const scorePctRag   = (v) => (v >= 90 ? "ok" : v >= 80 ? "warn" : "bad");
const scoreUdaRag   = (v) => (v >= 98 ? "ok" : v >= 92 ? "warn" : "bad");
const scoreCountRag = (v) => (v === 0 ? "ok" : v <= 2 ? "warn" : "bad");

export const ManagerPage = ({ currentUser, onNav, initialSiteName, initialSiteId }) => {
  /* When opened by drilling in from the Management Hub league table, the
   * clicked practice's site arrives via `initialSiteId` and a "back" link
   * appears. Opened directly (a Practice Manager's own hub) it defaults to
   * the site the logged-in user is scoped to. Area/Company users (multi-site
   * scope) get a ScopeSwitcher to move between their sites; the rows below
   * re-derive whenever the active site changes. */
  const arrivedFromManagement = Boolean(initialSiteName);
  /* Active site = drill-in target, else the user's default scoped site. */
  const [activeSite, setActiveSite] = useState(
    () => initialSiteId ?? defaultSiteFor(currentUser),
  );
  /* If a drill-in target arrives (or changes), follow it. */
  useEffect(() => {
    if (initialSiteId) setActiveSite(initialSiteId);
  }, [initialSiteId]);
  const showScopeSwitcher = !arrivedFromManagement && hasMultiSiteScope(currentUser);
  /* Header name: an explicit drill-in label wins; otherwise the canonical
   * site name for the active site (never a hardcoded practice name). */
  const practiceName = initialSiteName || siteName(activeSite);
  /* Role-conditional view swap: when the dev role is `staff` the
   * page renders the clinician-mode alert banner instead of the
   * macro UDA charts (which are manager / director surface only).
   * Future: replace the dev-role hook with the real Cognito role
   * claim once the auth context carries it. */
  const [devRole] = useDevRole();
  const isClinician = devRole === "staff";

  const [snapshotActions, setSnapshotActions] = useState([]);
  const [leave,            setLeave]           = useState([]);
  const [gdcRecords,       setGdcRecords]      = useState([]);
  const [trainingRecords,  setTrainingRecords] = useState([]);
  const [incidents,        setIncidents]       = useState([]);
  const [cqcSummary,       setCqcSummary]      = useState(CQC_SUMMARY_DEFAULT);
  const [udaTotal,         setUdaTotal]        = useState(UDA_TOTAL_DEFAULT);
  const [udaDentists,      setUdaDentists]     = useState([]);
  const [inspectionDate,   setInspectionDate]  = useState("2026-05-08");

  /* ─── Slice PM-1 state ─────────────────────────────────────────
   * Action queue items live in component state so dismissals
   * persist across re-renders. Mini-stat manual override lets the
   * PM correct Staff on Site when the leave register diverges
   * from reality (e.g. someone called in sick last minute). */
  const [actionQueue,    setActionQueue]    = useState(() => buildActionQueueSeed(activeSite));
  /* Recurring rhythms are read-only — derive straight from the active
   * site's real staff. */
  const rhythms = useMemo(() => buildComplianceRhythmsSeed(activeSite), [activeSite]);
  /* Re-seed the (mutable) action queue when the active site changes so
   * its copy reflects the right site's staff. */
  useEffect(() => { setActionQueue(buildActionQueueSeed(activeSite)); }, [activeSite]);
  const [staffOverride,  setStaffOverride]  = useState(null);
  const [toast,          setToast]          = useState(null);
  /* Sub-tab nav (PM-2) — 'overview' vs 'rota'. */
  const [activeTab,      setActiveTab]      = useState("overview");

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    listSnapshotActions().then(setSnapshotActions);
    listLeaveRequests().then(setLeave);
    listGdcRecords().then(setGdcRecords);
    listTrainingRecords().then(setTrainingRecords);
    listManagerIncidents(activeSite).then(setIncidents);
    getCqcSummary().then(setCqcSummary);
    getUdaTotal().then(setUdaTotal);
    listUdaDentists(activeSite).then(setUdaDentists);
  }, [activeSite]);


  const critical     = snapshotActions.filter(a => a.priority === "critical");
  const warning      = snapshotActions.filter(a => a.priority === "warning");
  const allClear     = snapshotActions.length === 0;
  const pendingLeave = leave.filter(r => r.status === "pending").length;

  /* Live-derive contracted + delivered from the dentists array so
   * every keystroke in the PM-2 UDA Contract Modal recomputes the
   * headline + per-clinician bars without needing a save round-trip. */
  const udaTotalLive = useMemo(() => {
    const contracted = udaDentists.reduce((n, d) => n + (Number(d.contracted) || 0), 0);
    const delivered  = udaDentists.reduce((n, d) => n + (Number(d.delivered)  || 0), 0);
    return { ...udaTotal, contracted, delivered };
  }, [udaDentists, udaTotal]);

  const udaExpected = udaPaceTarget(udaTotalLive.contracted, udaTotalLive.monthsElapsed, udaTotalLive.totalMonths);
  const udaPct      = udaCompletePct(udaTotalLive.delivered, udaTotalLive.contracted);
  const udaTrk      = udaOnTrack(udaTotalLive.delivered, udaExpected);
  const udaBarPct   = Math.min(udaPct, 100);
  const udaExpPct   = udaCompletePct(udaExpected, udaTotalLive.contracted);
  const udaRemaining = Math.max(udaTotalLive.contracted - udaTotalLive.delivered, 0);

  /* Derived Staff on Site — total headcount minus approved leave
   * today. Manual override (PM clicks the pencil) supersedes when
   * the auto-derivation is wrong (sickness, late-finish, etc.). */
  const totalStaff      = 16;
  const onLeaveToday    = leave.filter((r) => r.status === "approved").length;
  const staffOnSiteAuto = Math.max(0, totalStaff - onLeaveToday);
  const staffOnSite     = staffOverride ?? staffOnSiteAuto;

  /* Training compliance headline. Drilled in from the Management Hub
   * (initialSiteId present) → read the shared per-practice metric so the
   * figure matches the league table's Training column. A PM viewing their
   * OWN hub (no siteId) derives the real % from the mandatory-training
   * matrix (count of "ok" cells across every staff × topic). */
  /* Drilled-in practice metrics (Area/Company manager) flow through the same
   * async seam the Management Hub uses, so the headline matches the league
   * table. A PM viewing their OWN hub passes no siteId and this stays null. */
  const [siteMetrics, setSiteMetrics] = useState(null);
  useEffect(() => {
    if (!initialSiteId) { setSiteMetrics(null); return; }
    let cancelled = false;
    getPracticeMetric(initialSiteId).then((m) => { if (!cancelled) setSiteMetrics(m); });
    return () => { cancelled = true; };
  }, [initialSiteId]);

  const trainingPct = useMemo(() => {
    if (initialSiteId) return siteMetrics?.trainingPct ?? null;
    const topics = ["bls", "fire", "ipc", "safeguarding", "gdpr"];
    let ok = 0, tot = 0;
    trainingRecords.forEach((r) => topics.forEach((t) => { tot += 1; if (r[t] === "ok") ok += 1; }));
    return tot ? Math.round((ok / tot) * 100) : null;
  }, [initialSiteId, siteMetrics, trainingRecords]);

  /* Action queue handlers */
  const dismissAction = (id) =>
    setActionQueue((prev) => prev.filter((a) => a.id !== id));
  const handleActionClick = (item, action) => {
    if (action.nav && onNav)                          onNav(action.nav);
    else if (action.label === "Dismiss to Archive")   dismissAction(item.id);
    else if (action.label.startsWith("Approve & Auto-Update Rota")) {
      /* PM-3: actually mutate the rota — flip the hygienist's 5 days on
       * Week 23 to On-Leave via the shared rota store. The target is
       * ROTA_LEAVE_DEMO_STAFF (the real person the rota store seeds into
       * the hygiene room), so the names line up with the live grid. Then
       * jump to the Rota tab so they see the change land; the action item
       * itself is dismissed since it's resolved. */
      const onLeaveName = ROTA_LEAVE_DEMO_STAFF;
      const firstName = String(onLeaveName).split(" ")[0];
      applyRotaLeaveBlock(
        "w23-2026",
        onLeaveName,
        ["mon", "tue", "wed", "thu", "fri"],
        `${onLeaveName} — annual leave 2-6 Jun`,
      );
      dismissAction(item.id);
      setActiveTab("rota");
      setToast(`Leave approved — Rota Week 23 updated automatically. ${firstName}'s 5 days flagged On Leave.`);
    }
    else                                              setToast(`${action.label} → ${item.title.slice(0, 38)}… (stub)`);
  };
  const handleRhythmClick = (row) => {
    if (row.nav && onNav) onNav(row.nav);
    else                  setToast(`Opened ${row.area} (stub)`);
  };
  const handleStaffOverride = () => {
    const next = window.prompt(
      `Staff on Site — manual override.\n\nAuto-derived from leave: ${staffOnSiteAuto} / ${totalStaff}.\n\nEnter the correct number, or leave blank to reset to auto:`,
      String(staffOnSite),
    );
    if (next === null) return;
    if (next.trim() === "") { setStaffOverride(null); setToast("Reset to auto-derived count."); return; }
    const n = Number(next);
    if (!Number.isFinite(n) || n < 0 || n > totalStaff) { setToast("Invalid number — kept current."); return; }
    setStaffOverride(n);
    setToast(`Staff on Site set to ${n}.`);
  };
  /* PM-2 UDA Contract modal. Opens with the live dentists array; the
   * modal mutates `udaDentists` directly so the bars below recompute
   * (via `udaTotalLive` useMemo) as the PM types. Cancel-revert is
   * handled inside the modal via a snapshot. */
  const [udaModalOpen, setUdaModalOpen] = useState(false);
  const handleUdaEdit = () => setUdaModalOpen(true);
  const handleFabClick = () => {
    setToast("Quick-create menu — wires in PM-2.");
  };

  const handleLeave = async (id, action) => {
    const updated = await updateLeaveStatus(id, action);
    setLeave(prev => prev.map(r => r.id === id ? updated : r));
  };

  return (
    <div>
      {arrivedFromManagement && (
        <button
          type="button"
          onClick={() => onNav?.("management")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer", padding: "2px 0",
            marginBottom: 8, fontSize: 13, fontWeight: 700, color: "var(--primary)",
            fontFamily: "inherit",
          }}
        >
          <I name="back" size={15} /> Back to Management Hub
        </button>
      )}
      <TopBar
        title="Practice Manager Hub"
        subtitle={`${practiceName} · ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
      />

      {/* ══ Scope switcher (Area+ users) ══
        * Practice Managers see a single site (switcher hides itself);
        * Area / Company / Group users can move between their in-scope
        * sites, which re-derives the header + every staff-driven row. */}
      {showScopeSwitcher && (
        <div style={{ margin: "0 0 16px" }}>
          <ScopeSwitcher
            user={currentUser}
            value={activeSite}
            onChange={setActiveSite}
            label="Site"
          />
        </div>
      )}

      {/* ══ Drill-in practice scorecard ══
        * Shown only when an Area/Company manager drilled in from the
        * Management Hub. Mirrors that practice's league-table row exactly
        * (same async seam, same RAG thresholds) so the numbers agree, then
        * the operational detail follows below. */}
      {arrivedFromManagement && siteMetrics && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", margin: "0 0 20px" }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginRight: 4 }}>
            Practice scorecard
          </span>
          {[
            { label: READINESS_METRICS.operationalReadiness.shortLabel, tone: siteMetrics.operationalReady ? "ok" : "bad", val: siteMetrics.operationalReady ? "Ready" : "At risk" },
            { label: "Training",  tone: scorePctRag(siteMetrics.trainingPct),     val: `${siteMetrics.trainingPct}%` },
            { label: "Logs",      tone: scorePctRag(siteMetrics.logAdherencePct), val: `${siteMetrics.logAdherencePct}%` },
            { label: "UDA",       tone: scoreUdaRag(siteMetrics.udaPct),          val: `${siteMetrics.udaPct}%` },
            { label: "Actions",   tone: scoreCountRag(siteMetrics.openActions),   val: siteMetrics.openActions },
            { label: "Incidents", tone: scoreCountRag(siteMetrics.incidents),     val: siteMetrics.incidents },
          ].map((c) => (
            <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, background: `color-mix(in srgb, ${SCORE_RAG[c.tone]} 12%, transparent)`, color: SCORE_RAG[c.tone], fontSize: 12, fontWeight: 700 }}>
              <span style={{ opacity: 0.7, fontWeight: 600 }}>{c.label}</span> {c.val}
            </span>
          ))}
        </div>
      )}

      {/* ══ Clinician-mode banner (RBAC-conditional) ══
       *
       * For Dentist / Nurse / general staff users the macro UDA
       * performance hero is irrelevant — they care about the
       * protocols they personally owe a signature on. Swap the hero
       * for a primary alert banner that drives them straight into
       * the Clinical Protocols viewer. */}
      {isClinician && CLINICIAN_PENDING_SIGNATURES > 0 && (
        <div className={styles.clinicianAlert} role="alert">
          <div className={styles.clinicianAlertIcon} aria-hidden="true">⚠️</div>
          <div className={styles.clinicianAlertBody}>
            <div className={styles.clinicianAlertTitle}>
              You have <strong>{CLINICIAN_PENDING_SIGNATURES} Clinical Protocols</strong> awaiting your mandatory digital signature.
            </div>
            <div className={styles.clinicianAlertSub}>
              Signing acknowledges you&apos;ve read each protocol and agree to follow it. Required for CQC inspection evidence.
            </div>
          </div>
          <button
            type="button"
            className={styles.clinicianAlertBtn}
            onClick={() => onNav?.("clinical_protocols")}
          >
            Open Protocols <I name="arrow" size={11} color="currentColor" />
          </button>
        </div>
      )}

      {/* ══ Slice PM-2 — Sub-tab nav (Overview · Rota) ══
        * Sits between the clinician banner and the body. Hidden in
        * clinician mode (which renders its own simpler view). */}
      {!isClinician && (
        <nav className={styles.pmTabs} role="tablist" aria-label="Practice Manager workspace tabs">
          <button type="button" role="tab"
            aria-selected={activeTab === "overview"}
            className={`${styles.pmTab} ${activeTab === "overview" ? styles.pmTabActive : ""}`}
            onClick={() => setActiveTab("overview")}>Overview</button>
          <button type="button" role="tab"
            aria-selected={activeTab === "rota"}
            className={`${styles.pmTab} ${activeTab === "rota" ? styles.pmTabActive : ""}`}
            onClick={() => setActiveTab("rota")}>Rota</button>
        </nav>
      )}

      {/* ══ Slice PM-2 — Rota Light tab body ══ */}
      {!isClinician && activeTab === "rota" && <RotaView />}

      {/* ══ Overview tab body (default) ══ */}
      {(isClinician || activeTab === "overview") && (<>
      {/* ══ UDA Performance Hero ══ (hidden in clinician mode) */}
      {!isClinician && (
      <Card hover={false} className={styles.udaHero}>

        {/* Header row */}
        <div className={styles.udaHeroHeader}>
          <div>
            <h3 className={styles.udaHeroTitle}>
              <I name="barchart" size={16} color="var(--primary)" /> UDA Performance
              <button type="button" className={styles.udaEditBtn}
                onClick={handleUdaEdit} title="Edit UDA contract numbers (PM manual entry)">
                <I name="edit" size={11} color="currentColor" />
                <span>Edit</span>
              </button>
            </h3>
            <p className={styles.udaHeroPeriod}>
              {udaTotalLive.period} · Month {udaTotalLive.monthsElapsed} of {udaTotalLive.totalMonths}
              {" · "}
              <span className={styles.udaManualLabel}>
                <I name="edit" size={9} color="currentColor" /> PM manual entry
              </span>
            </p>
          </div>
          <div className={styles.udaStatus} style={{
            background: udaTrk ? "rgba(46,125,50,0.08)" : "rgba(229,57,53,0.08)",
            color: udaTrk ? "#2e7d32" : "#e53935",
          }}>
            <I name={udaTrk ? "checkcircle" : "alert"} size={13} />
            {udaTrk
              ? `On track — ${(udaTotalLive.delivered - udaExpected).toLocaleString()} ahead of expected pace · ${udaRemaining.toLocaleString()} remaining to annual target`
              : `Behind — ${(udaExpected - udaTotalLive.delivered).toLocaleString()} UDAs below pace`}
          </div>
        </div>

        {/* Group totals */}
        <div className={styles.udaStats}>
          <div className={styles.udaStat}>
            <span className={styles.udaStatVal}>{udaTotalLive.delivered.toLocaleString()}</span>
            <span className={styles.udaStatLabel}>Delivered</span>
          </div>
          <div className={styles.udaStatDivider} />
          <div className={styles.udaStat}>
            <span className={styles.udaStatVal}>{udaExpected.toLocaleString()}</span>
            <span className={styles.udaStatLabel}>Expected by now</span>
          </div>
          <div className={styles.udaStatDivider} />
          <div className={styles.udaStat}>
            <span className={styles.udaStatVal}>{udaTotalLive.contracted.toLocaleString()}</span>
            <span className={styles.udaStatLabel}>Annual target</span>
          </div>
          <div className={styles.udaStatDivider} />
          <div className={styles.udaStat}>
            <span className={styles.udaStatVal} style={{ color: udaTrk ? "#2e7d32" : "#e53935" }}>{udaPct}%</span>
            <span className={styles.udaStatLabel}>Annual target delivered</span>
          </div>
        </div>

        {/* Group progress bar */}
        <div className={styles.udaBarWrap}>
          <div className={styles.udaBarTrack}>
            <div className={styles.udaBarFill} style={{ width: `${udaBarPct}%`, background: udaTrk ? "#2e7d32" : "#e53935" }} />
            <div className={styles.udaBarMarker} style={{ left: `${Math.min(udaExpPct, 100)}%` }} title="Expected by now" />
          </div>
          <div className={styles.udaBarLabels}>
            <span>0</span>
            <span>Expected pace</span>
            <span>{udaTotalLive.contracted.toLocaleString()} UDAs</span>
          </div>
        </div>

        {/* Per-dentist breakdown */}
        <div className={styles.udaDivider} />
        <div className={styles.udaDentistHead}>
          <span style={{ flex: 2 }}>Clinician</span>
          <span style={{ flex: 3 }}>Progress</span>
          <span style={{ flex: 1, textAlign: "right" }}>Delivered</span>
          <span style={{ flex: 1, textAlign: "right" }}>Target</span>
          <span style={{ flex: 1, textAlign: "right" }}>%</span>
        </div>
        {/* Scrollable rows — caps at ~5 rows visible; large groups
         * (10+ dentists) scroll within this container without
         * pushing the page. Header stays put above. */}
        <div className={styles.udaDentistScroll} role="region" aria-label="Clinician UDA performance" tabIndex={0}>
          {udaDentists.map((d, i) => {
            const pct   = d.contracted > 0 ? Math.round((d.delivered / d.contracted) * 100) : 0;
            const exp   = Math.round((d.contracted / udaTotalLive.totalMonths) * udaTotalLive.monthsElapsed);
            const onTrk = d.delivered >= exp * 0.95;
            return (
              /* Real roster is small, so cycled UDA names can repeat across
               * rows — index keeps the React key unique. */
              <div key={`${d.name}-${i}`} className={styles.udaDentistRow}>
                <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <Avatar name={d.name} size={26} />
                  <span className={styles.udaDentistName}>{d.name}</span>
                </div>
                <div style={{ flex: 3, paddingRight: 20 }}>
                  <div className={styles.udaMiniBarTrack}>
                    <div className={styles.udaMiniBarFill} style={{ width: `${Math.min(pct, 100)}%`, background: onTrk ? "#2e7d32" : "#e53935" }} />
                  </div>
                </div>
                <span style={{ flex: 1, textAlign: "right" }} className={styles.udaDentistStat}>{d.delivered.toLocaleString()}</span>
                <span style={{ flex: 1, textAlign: "right" }} className={styles.udaDentistStat}>{d.contracted.toLocaleString()}</span>
                <span className={styles.udaDentistPct} style={{ flex: 1, color: onTrk ? "#2e7d32" : "#e53935" }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </Card>
      )}

      {/* ══ Slice PM-1 — Active Action Queue + Compliance Rhythms ══
        * Two-column command-center layout. Left: tier-classified
        * action items (incidents, leave, renewals). Right: recurring
        * operational rhythms + mini stats with manual override. */}
      {!isClinician && (
      <div className={styles.pmGrid}>
        {/* ─── Left: Active Action Queue ─────────────────────── */}
        <Card hover={false} className={styles.queueCard}>
          <header className={styles.queueHead}>
            <h3 className={styles.queueTitle}>
              <I name="bell" size={15} color="#c62828" />
              Active Action Queue
            </h3>
            <span className={styles.queueCount}>{actionQueue.length} item{actionQueue.length === 1 ? "" : "s"}</span>
          </header>

          {actionQueue.length === 0 ? (
            <div className={styles.queueEmpty}>
              <I name="checkcircle" size={16} color="#2e7d32" />
              <span>All clear — nothing in your queue right now.</span>
            </div>
          ) : (
            <div className={styles.queueList}>
              {actionQueue.map((item) => {
                const tier = tierForCategory(item.category);
                const meta = TIER_META[tier];
                return (
                  <article key={item.id} className={styles.queueItem}
                    style={{ borderLeftColor: meta.tint }}>
                    <header className={styles.queueItemHead}>
                      <span className={styles.queueTierBadge}
                        style={{ color: meta.accent, background: meta.tint }}>
                        TIER {tier}
                      </span>
                      <h4 className={styles.queueItemTitle}>{item.title}</h4>
                      <span className={styles.queueItemWhen}>{item.when}</span>
                    </header>
                    <p className={styles.queueItemBody}>{item.body}</p>
                    <div className={styles.queueItemActions}>
                      {item.actions.map((a, i) => (
                        <button
                          key={i}
                          type="button"
                          className={a.kind === "primary" ? styles.queuePrimaryBtn : styles.queueSecondaryBtn}
                          onClick={() => handleActionClick(item, a)}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Card>

        {/* ─── Right: Compliance Rhythms + Mini Stats ────────── */}
        <div className={styles.rhythmsCol}>
          <Card hover={false} className={styles.rhythmsCard}>
            <header className={styles.rhythmsHead}>
              <h3 className={styles.rhythmsTitle}>
                <I name="calendar" size={15} color="var(--primary)" />
                Compliance Rhythms
              </h3>
            </header>
            <div className={styles.rhythmsTable} role="table">
              <div className={styles.rhythmsTableHead} role="row">
                <span role="columnheader">Rhythm area</span>
                <span role="columnheader">Assigned</span>
                <span role="columnheader">Status</span>
                <span role="columnheader" className={styles.rhythmsActionCol}></span>
              </div>
              {rhythms.map((row) => {
                const meta = RHYTHM_STATUS_META[row.status] ?? RHYTHM_STATUS_META.pending;
                return (
                  <div key={row.id} role="row" className={styles.rhythmsRow}>
                    <span role="cell" className={styles.rhythmArea}>{row.area}</span>
                    <span role="cell" className={styles.rhythmAssigned}>{row.assigned}</span>
                    <span role="cell" className={styles.rhythmsStatusCol}>
                      <span className={styles.rhythmPill}
                        style={{ background: meta.tint, color: meta.color }}>
                        {meta.label}
                      </span>
                    </span>
                    <span role="cell" className={styles.rhythmsActionCol}>
                      <button type="button" className={styles.rhythmActionBtn}
                        onClick={() => handleRhythmClick(row)}>
                        {meta.action}
                        <I name="arrow" size={10} color="currentColor" />
                      </button>
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Mini stats — Staff on Site (with manual override) + Daily Labs */}
          <div className={styles.miniStatRow}>
            <div className={styles.miniStat}>
              <div className={styles.miniStatLabelRow}>
                <span className={styles.miniStatLabel}>Staff on Site</span>
                <button type="button" className={styles.miniStatEdit}
                  onClick={handleStaffOverride}
                  title="Manually override (use when leave register is stale)">
                  <I name="edit" size={10} color="currentColor" />
                </button>
              </div>
              <div className={styles.miniStatValue}>{staffOnSite} / {totalStaff}</div>
              <div className={styles.miniStatHint}>
                {staffOverride !== null
                  ? <><span style={{ color: "#ef6c00" }}>● Manual override</span> · auto would show {staffOnSiteAuto}</>
                  : <>Auto-derived from leave register</>}
              </div>
            </div>
            <div className={styles.miniStat}>
              <div className={styles.miniStatLabelRow}>
                <span className={styles.miniStatLabel}>Daily Labs</span>
              </div>
              <div className={styles.miniStatValue}>8 <span style={{ fontSize: 14, fontWeight: 600, color: "var(--on-surface-variant)" }}>Sent</span></div>
              <div className={styles.miniStatHint}>From Lab Work Hub</div>
            </div>
            <div className={styles.miniStat}>
              <div className={styles.miniStatLabelRow}>
                <span className={styles.miniStatLabel}>Training</span>
              </div>
              <div className={styles.miniStatValue}>{trainingPct ?? "—"}<span style={{ fontSize: 14, fontWeight: 600, color: "var(--on-surface-variant)" }}>%</span></div>
              <div className={styles.miniStatHint}>Mandatory compliance</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ══ Slice PM-cleanup — drill-in chips ══
        * Replaces the previous 6 accordion sections (Practice
        * Snapshot, Leave Requests, GDC Registration, Mandatory
        * Training, CQC Audit Progress, Incident Register). Each
        * concern now has its own canonical home in the sidebar.
        * Critical signals from those areas bubble up to the
        * Action Queue + Compliance Rhythms above; the PM clicks
        * a chip below when they want to drill into the full
        * record set. */}
      <nav className={styles.pmDrillIn} aria-label="Drill into detail records">
        <span className={styles.pmDrillInLabel}>Drill into detail:</span>
        <button type="button" className={styles.pmDrillChip}
          onClick={() => onNav?.("staff")}>
          <I name="staff" size={11} color="currentColor" />
          Staff Records
        </button>
        <button type="button" className={styles.pmDrillChip}
          onClick={() => onNav?.("hr")}>
          <I name="calendar" size={11} color="currentColor" />
          Leave + HR
        </button>
        <button type="button" className={styles.pmDrillChip}
          onClick={() => onNav?.("training")}>
          <I name="training" size={11} color="currentColor" />
          Training Records
        </button>
        <button type="button" className={styles.pmDrillChip}
          onClick={() => onNav?.("cqc")}>
          <I name="checksquare" size={11} color="currentColor" />
          CQC Inspection Prep
        </button>
        <button type="button" className={styles.pmDrillChip}
          onClick={() => onNav?.("cqc")}>
          <I name="alert" size={11} color="currentColor" />
          Incident Register
        </button>
      </nav>
      </>)}



      {/* Slice PM-1 — floating quick-create action button (stub).
        * Future: opens a small menu (Log incident / Add leave /
        * Log a note). Manager-only — hidden in clinician mode. */}
      {!isClinician && (
        <button type="button" className={styles.pmFab} onClick={handleFabClick}
          aria-label="Quick create" title="Quick create (incident · note · leave)">
          <I name="plus" size={16} color="currentColor" />
        </button>
      )}

      {/* Slice PM-2 — UDA Contract entry modal */}
      {udaModalOpen && (
        <UdaContractModal
          dentists={udaDentists}
          /* Wrap the raw setter so EVERY modal mutation re-derives
           * the per-clinician `contracted` + `delivered` fields.
           * Without this, freshly-added clinicians render with
           * undefined totals → crash on `.toLocaleString()`. Existing
           * clinicians keep stale totals → bars don't sync to edits. */
          setDentists={(updater) => setUdaDentists((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            return next.map((d) => ({ ...d, ...udaTotals(d) }));
          })}
          period={udaTotalLive.period}
          onClose={() => setUdaModalOpen(false)}
        />
      )}

      {/* Slice PM-1 — toast */}
      {toast && (
        <div className={styles.pmToast} role="status">
          <I name="checkcircle" size={13} color="currentColor" />
          {toast}
        </div>
      )}

    </div>
  );
};

/* ── Protocol Sign-off Roster modal ─────────────────────────────────────
 *
 * Surfaces who has signed (with the date they signed) and who is
 * still outstanding. The Nudge button next to each outstanding name
 * fires a tiny "✓ Sent" micro-state — the actual push notification
 * is a backend job; for now the local Set just records the click. */

