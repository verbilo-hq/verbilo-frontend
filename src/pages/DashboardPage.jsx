import { useState, useEffect } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { LiveScroller } from "../components/dashboard/LiveScroller";
import { PersonaSwitcher } from "../components/dashboard/PersonaSwitcher";
import { MyActionQueueWidget } from "../components/dashboard/MyActionQueueWidget";
import { MyActivityPulseWidget } from "../components/dashboard/MyActivityPulseWidget";
import { StreakWidget } from "../components/dashboard/StreakWidget";
import { SpotlightWidget } from "../components/dashboard/SpotlightWidget";
import { MyShiftsWidget } from "../components/dashboard/MyShiftsWidget";
import { useDashboardPersona } from "../services/dashboard/persona";

/* Personas that see the personal "My Shifts" widget. Manager
 * personas (PM / AM / CD) own the rota and don't consume it as a
 * personal queue, so the widget is hidden for them. */
const SHIFTS_VISIBLE_PERSONAS = new Set([
  "dentist", "foundation_dentist", "hygienist", "nurse",
  "trainee_nurse", "receptionist",
]);
import { getTipForToday, getTipCount, getTipIndex } from "../services/dashboard/tipsLibrary";

/* Personas that should see the Live Group Compliance Feed. Clinicians,
 * trainees, hygienists, nurses, receptionists don't need cross-site
 * noise — it's signal for management roles only. */
const FEED_VISIBLE_PERSONAS = new Set(["practice_manager", "area_manager", "clinical_director"]);
import { useClickOutside } from "../hooks/useClickOutside";
import { useIndustry } from "../contexts/IndustryContext";
import { useAgenda } from "../contexts/AgendaContext";
import { hasCap, useDevRole } from "../services/devRole";
import { resolveSiteId, siteName } from "../services/sites";
import { personName, personAtSiteByRole } from "../services/people";
import { visibleSites, defaultSiteFor } from "../services/scope";
import {
  listGroupUpdates, listTips, listLinkIcons, listQuickLinks,
  fetchNews, listInternalNews, saveInternalNews,
  listSuggestions, saveSuggestion, dismissSuggestion,
} from "../services/dashboard.service";
import styles from "./DashboardPage.module.css";

/* ─── Mock compliance state ─────────────────────────────────────────────
 * Mirrors the ManagerPage fixture so the dashboard + Manager Hub stay
 * internally consistent. Production: derive from
 * listAcknowledgements() against the staff directory. */
const CLINICIAN_PENDING_SIGNATURES = 2;

/* Personal compliance streak — drives the (now-retired) circular
 * progress ring widget. Kept inline as fixture data so the widget
 * is one rebuild away if the brief swings back. */
const COMPLIANCE_STREAK = {
  weekPct:   92,    // logs completed / logs expected this rolling 7-day window
  dayStreak: 6,     // consecutive days with zero outstanding tasks
};

/* ─── Verbilo Pulse — internal group newsletter card ─────────────────
 * Author + the colleague being welcomed resolve to REAL roster people
 * (services/people.js) and a canonical site (services/sites.js) — no
 * invented personas, no "Crawley". The group newsletter is authored by
 * the company owner; the new joiner is a real London associate. */
const PULSE_NEW_JOINER = personName("london-dentist-1");          // real associate at London
const PULSE_JOINER_FIRST = String(PULSE_NEW_JOINER).replace(/^Dr\.?\s+/i, "").split(/\s+/)[0];
const VERBILO_PULSE = {
  eyebrow: "VERBILO PULSE",
  date:    "24 May 2026",
  title:   `Welcome to our new clinical associate at the ${siteName("site-london")} site!`,
  body:    `We're thrilled to welcome ${PULSE_NEW_JOINER} to the Dental Group family. ${PULSE_JOINER_FIRST} joins the ${siteName("site-london")} practice this week, bringing five years of restorative experience and a passion for nervous-patient care. Stop by Surgery 2 to say hello if you're on rota.`,
  author:  personName("company-owner"),
  role:    "Company Owner",
  accent:  "#0d7280",
};

/* ─── Role-Based Action Tiles ──────────────────────────────────────── */
/* Future: swap these per `devRole` so each persona sees their own
 * top-4 tasks. Today the clinical-team default set works for the
 * full demo cast. `nav` keys must match App.jsx pageComponents. */
const ROLE_ACTIONS = [
  {
    icon: "award", label: "My Personal CPD Tracker",
    sub:  "Log this week's reflection",
    nav:  "cpd",
    accent: "#1565c0",
    /* `status` drives the live indicator pill rendered at the foot
     * of the tile. `tone` maps to a colour class (good/warn/info);
     * omit the field entirely on tiles that have no live metric. */
    status: { tone: "info", icon: "⏱️", text: "12.5 / 15 Hours Completed" },
  },
  {
    icon: "settings", label: "Autoclave & Sterilisation Logs",
    sub:  "3 daily readings due",
    nav:  "logbooks",
    accent: "#00838f",
    status: { tone: "good", icon: "🟢", text: "3 / 3 Completed Today" },
  },
  {
    icon: "image", label: "Radiography & IR(ME)R Compliance",
    sub:  "Image quality audit · Jun",
    nav:  "governance",
    accent: "#6a1b9a",
    status: { tone: "warn", icon: "⚠️", text: "Audit Due in 4 Days" },
  },
  {
    icon: "file", label: "Patient Consent Forms",
    sub:  "Library + chairside print",
    nav:  "clinical",
    accent: "#2e7d32",
  },
];

/* ─── Educational Supervisor Workspace fixtures ─────────────────────
 * Mock data for the FD / trainee oversight panel. Mirrors the COPDEND
 * / deanery portfolio shape so the layout reads correctly to a real
 * Educational Supervisor during the demo.
 *
 * In production, all three datasets come from the backend:
 *   ES_TRAINEE       → GET /api/educational-supervisor/me
 *   ES_SAFETY_GATES  → GET /api/trainees/{id}/protocol-acknowledgements
 *   ES_DEANERY       → GET /api/trainees/{id}/portfolio/{term} */

/* ─── Today's Site Health checklist fixture ────────────────────────
 * Replaces the previous CQC Inspection Window countdown — practices
 * don't have constant inspections, so a permanent countdown becomes
 * dead data. This widget surfaces today's outstanding daily logs
 * with interactive checkbox state.
 *
 * The macro count ("3 / 5 Completed") deliberately includes ONE
 * already-completed item that lives outside the visible 4-row
 * shortlist, so the maths stays internally consistent as the user
 * toggles the visible checkboxes:
 *   • initial: 2 visible done + 1 hidden = 3 / 5
 *   • all done: 4 visible done + 1 hidden = 5 / 5 */
const SITE_CHECKLIST = {
  totalLogs:       5,
  hiddenCompleted: 1,
  items: [
    { id: "auto",   label: "Surgery 1 & 2 Autoclave Steam Logs",      done: true  },
    { id: "duwl",   label: "Decontamination Room Water Line Purge",    done: true  },
    { id: "fridge", label: "Vaccine/Materials Fridge Temperature Log", done: false },
    { id: "waste",  label: "End-of-Day Clinical Waste Consolidation",  done: false },
  ],
};

/* ─── Audit Countdown Tracker fixture (RETIRED — kept as dead
 * data so a future revert is one block away). ───────────────────── */
// eslint-disable-next-line no-unused-vars
const AUDIT_COUNTDOWN = {
  /* Days until the next mock CQC inspection window opens. Could
   * derive from a real date in future:
   *   days = Math.ceil((target.getTime() - Date.now()) / 86400000) */
  days:          45,
  status:        "CQC INSPECTION WINDOW",
  /* Per-Phase-2 refinement, the bottom of the widget surfaces the
   * site's overall readiness score (0-100) as a horizontal mini
   * progress bar instead of duplicating the outstanding-action list
   * that already lives in the Practice Manager / CQC hubs. */
  readinessPct:  84,
};

/* ─── Live Group Compliance Feed fixture ─────────────────────────────
 * Every `siteId` is a CANONICAL site id (services/sites.js) and every
 * name in a message is a REAL roster person (services/people.js) — the
 * legacy BRIGHTON/CRAWLEY/HOVE/… labels and invented people are gone.
 * The renderer derives the displayed (uppercased) site label via
 * siteName(resolveSiteId(...)) and the feed is filtered to the logged-in
 * user's visible sites before rendering.
 *
 * `when` is parseable by relativeTime(); the renderer prints
 * "{site} • {relativeTime}" inline. */
const COMPLIANCE_FEED = [
  { siteId: resolveSiteId("site-southall"),   message: "CORE-01 Medical Emergencies protocol reached 100% team sign-off.",                                 when: new Date(Date.now() - 32 * 60 * 1000).toISOString() },
  { siteId: resolveSiteId("site-london"),     message: `Weekly Cross-Infection Log successfully submitted by ${personName("london-nurse-1")}.`,            when: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { siteId: resolveSiteId("site-reading"),    message: "Autoclave 2 daily parameter check signed off — all within spec.",                                  when: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
  { siteId: resolveSiteId("site-new-cross"),  message: `${personName("south-dentist-2")} acknowledged CORE-03 Antimicrobial Prescribing.`,                 when: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
  { siteId: resolveSiteId("site-manchester"), message: "Reg 19 Fit & Proper Persons audit closed — no actions raised.",                                    when: new Date(Date.now() - 9 * 3600 * 1000).toISOString() },
  { siteId: resolveSiteId("site-birmingham"), message: `Vaccine fridge temperature log submitted by ${personName("london-lead-nurse")}.`,                  when: new Date(Date.now() - 22 * 3600 * 1000).toISOString() },
];

/* ─── Relative timestamp formatter ──────────────────────────────────────
 * Maps an ISO date or human string → "2 hours ago" / "Yesterday" /
 * "3 days ago" style. Gracefully falls through to the original string
 * when the input can't be parsed (older fixtures already shipped
 * pre-formatted dates). */
function relativeTime(input) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;        // pass-through fallback
  const diffMs = Date.now() - d.getTime();
  if (diffMs < 0) return "Just now";
  const minutes = Math.round(diffMs / 60000);
  const hours   = Math.round(diffMs / 3600000);
  const days    = Math.round(diffMs / 86400000);
  if (minutes < 1)   return "Just now";
  if (minutes < 60)  return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours   < 24)  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days   === 1)  return "Yesterday";
  if (days    < 7)   return `${days} days ago`;
  if (days    < 30) {
    const w = Math.round(days / 7);
    return `${w} week${w === 1 ? "" : "s"} ago`;
  }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/* ─── Tip-of-the-day colour config (UI only, not data) ─── */
const TIP_CFG = {
  "Clinical":     { color: "#f57c00", bg: "rgba(245,124,0,0.08)"  },
  "Compliance":   { color: "#c62828", bg: "rgba(198,40,40,0.08)"  },
  "Patient Care": { color: "#2e7d32", bg: "rgba(46,125,50,0.08)"  },
  "CPD":          { color: "#1565c0", bg: "rgba(21,101,192,0.08)" },
  "Team":         { color: "#6a1b9a", bg: "rgba(106,27,154,0.08)" },
};

/* ─── Healthcare industry selector (demo only) ───────────────────────────────
   Cosmetic switcher above the welcome banner. Picking an industry updates
   the sidebar branding + nav items and the welcome subheading. State lives
   in IndustryContext so other components (Sidebar) can read it. */
const IndustryBar = ({ value, industries, onChange }) => (
  <div className={styles.industryBar}>
    {industries.map((ind) => {
      const active = value.id === ind.id;
      return (
        <button
          key={ind.id}
          type="button"
          className={active ? `${styles.industryChip} ${styles.industryChipActive}` : styles.industryChip}
          onClick={() => onChange(ind)}
        >
          <I name={ind.icon} size={14} />
          <span>{ind.label}</span>
        </button>
      );
    })}
  </div>
);

/* ─── Icon picker dropdown ─── */
const IconSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className={styles.iconSelectWrap} ref={ref}>
      <button
        type="button"
        className={styles.iconSelectTrigger}
        onClick={() => setOpen(o => !o)}
      >
        <I name={value} size={16} color="var(--primary)" />
        <span className={styles.iconSelectLabel}>{value}</span>
        <span style={{ marginLeft: "auto" }}>
          <I name="chevrondown" size={13} color="var(--on-surface-variant)" />
        </span>
      </button>
      {open && (
        <div className={styles.iconDropPanel}>
          {options.map(icon => (
            <div
              key={icon}
              className={value === icon ? `${styles.iconDropOption} ${styles.iconDropOptionSelected}` : styles.iconDropOption}
              onClick={() => { onChange(icon); setOpen(false); }}
            >
              <I name={icon} size={15} color={value === icon ? "var(--primary)" : "var(--on-surface-variant)"} />
              <span>{icon}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export const DashboardPage = ({ currentUser, onNav }) => {
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [suggestion,   setSuggestion]   = useState("");
  const [submitted,    setSubmitted]    = useState(false);
  const [liveNews,     setLiveNews]     = useState([]);
  const [newsLoading,  setNewsLoading]  = useState(true);
  const [internalNews, setInternalNews] = useState(() => listInternalNews());
  const [activeItem,   setActiveItem]   = useState(null);
  const [links,         setLinks]         = useState([]);
  const [showManage,    setShowManage]    = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [showAddForm,   setShowAddForm]   = useState(false);
  const [newLabel,      setNewLabel]      = useState("");
  const [newIcon,       setNewIcon]       = useState("external");
  const [newHref,       setNewHref]       = useState("");
  const [groupUpdates,  setGroupUpdates]  = useState([]);
  const [tips,          setTips]          = useState([]);
  const [linkIcons,     setLinkIcons]     = useState([]);
  const { industry, setIndustry, industries } = useIndustry();
  const [devRole] = useDevRole();
  /* Global toast + the operational-log completion ledger — completing a
   * task (agenda drawer or Operational Logs) ripples into the Live feed. */
  const { ledger, setToast } = useAgenda();

  /* Verbilo Pulse — the newest AUTHORED post wins; the static fixture is
   * only the empty-state seed. Management roles compose posts via the
   * "New post" button on the card. */
  const pulse = internalNews[0] ?? VERBILO_PULSE;
  const canManageComms =
    hasCap(devRole, "view_practice_manager_hub") ||
    hasCap(devRole, "view_management_hub");
  const [showPulseComposer, setShowPulseComposer] = useState(false);
  const [pulseTitle, setPulseTitle] = useState("");
  const [pulseBody,  setPulseBody]  = useState("");
  const [suggestionInbox, setSuggestionInbox] = useState(() => listSuggestions());

  const handlePostPulse = () => {
    if (!pulseTitle.trim() || !pulseBody.trim()) return;
    const post = {
      id:      `pulse-${Date.now()}`,
      eyebrow: "VERBILO PULSE",
      date:    new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      title:   pulseTitle.trim(),
      body:    pulseBody.trim(),
      author:  currentUser?.displayName ?? "—",
      role:    currentUser?.hrProfile?.jobTitle ?? currentUser?.orgRoleLabel ?? "",
      accent:  "#0d7280",
      at:      new Date().toISOString(),
    };
    const next = [post, ...internalNews].slice(0, 20);
    saveInternalNews(next);
    setInternalNews(next);
    setPulseTitle("");
    setPulseBody("");
    setShowPulseComposer(false);
    setToast("Pulse update posted to the whole group.");
  };

  const isAdmin     = currentUser?.role === "manager";
  /* Role-conditional Mandatory Action banner — clinicians see it,
   * managers / directors don't. Mirrors the ManagerPage convention. */
  const isClinician = devRole === "staff";

  /* User can dismiss the banner per session — stays hidden until
   * page reload (mirrors how toast / nudge banners behave). */
  const [bannerDismissed, setBannerDismissed] = useState(false);

  /* Today's Site Health widget — interactive checklist state.
   * Initialised from the fixture's `done` flags; toggle ripples
   * into the macro "X / 5 Completed" counter via derived counts. */
  const [siteChecklist, setSiteChecklist] = useState(
    () => Object.fromEntries(SITE_CHECKLIST.items.map((it) => [it.id, it.done])),
  );
  const toggleChecklistItem = (id) =>
    setSiteChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  const checklistVisibleDone = SITE_CHECKLIST.items.filter((it) => siteChecklist[it.id]).length;
  const checklistTotalDone   = checklistVisibleDone + SITE_CHECKLIST.hiddenCompleted;

  /* Tip carousel state — offset is layered on top of the auto-
   * rotating dayIndex. Negative steps back through history, positive
   * forward. Bookmark state is a local Set keyed by tip index so the
   * star icon flips per-tip. */
  const [tipOffset,       setTipOffset]       = useState(0);
  const [bookmarkedTips,  setBookmarkedTips]  = useState(() => new Set());

  const update    = groupUpdates[activeIdx];
  const dayIndex  = Math.floor(Date.now() / 86400000);
  /* Persona-aware Tip of the Day — pulls from the 225-tip library
   * (9 personas × 25 tips). Falls back to the legacy `tips` service
   * pool only when the library has no entry for the persona (defensive,
   * shouldn't trigger). Carousel pagination still uses `tipOffset`. */
  /* `personaMeta.persona` carries the Dental Group-grounded
   * displayName / firstName / titleSuffix / site fields used by the
   * personalised welcome bar. */
  const [personaId, , personaMeta] = useDashboardPersona();
  const persona = personaMeta.persona;
  const personaTipCount = getTipCount(personaId);
  const tipIndex  = getTipIndex(personaId, tipOffset);
  const todayTip  = getTipForToday(personaId, tipOffset);
  /* tipCfg drives the icon colour + pill background. The legacy TIP_CFG
   * lookup keys off category strings — fall back to a generic "info"
   * config when no match (every new persona's tips have new categories). */
  const tipCfg    = TIP_CFG[todayTip?.category] ?? {
    color: "var(--primary)",
    bg:    "color-mix(in srgb, var(--primary) 12%, transparent)",
  };
  const tipIsBookmarked = bookmarkedTips.has(tipIndex);
  const toggleBookmark  = () => setBookmarkedTips((prev) => {
    const next = new Set(prev);
    if (next.has(tipIndex)) next.delete(tipIndex); else next.add(tipIndex);
    return next;
  });

  useEffect(() => {
    listGroupUpdates().then(setGroupUpdates);
    listTips().then(setTips);
    listQuickLinks().then(setLinks);
    listLinkIcons().then(setLinkIcons);
  }, []);

  useEffect(() => {
    if (!activeItem) return;
    const onKey = (e) => { if (e.key === "Escape") setActiveItem(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeItem]);

  /* Fetch all feeds via service (cached daily) */
  useEffect(() => {
    let cancelled = false;
    fetchNews().then((items) => {
      if (cancelled) return;
      setLiveNews(items);
      setNewsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleSuggest = () => {
    if (!suggestion.trim()) return;
    // Persist so the management Suggestion Inbox can actually review it —
    // anonymous by design (no user identity attached).
    saveSuggestion(suggestion.trim());
    setSuggestionInbox(listSuggestions());
    setSubmitted(true);
    setSuggestion("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleQuickLink = (link, e) => {
    if (link.nav && onNav) { e.preventDefault(); onNav(link.nav); }
  };

  const closeManage = () => {
    setShowManage(false);
    setPendingDelete(null);
    setShowAddForm(false);
    setNewLabel(""); setNewIcon("external"); setNewHref("");
  };

  const handleAddLink = () => {
    if (!newLabel.trim()) return;
    const dest = newHref.trim();
    const isExternal = dest.startsWith("http");
    setLinks(prev => [...prev, {
      label: newLabel.trim(),
      icon: newIcon,
      ...(isExternal ? { href: dest } : { nav: dest }),
    }]);
    setNewLabel(""); setNewIcon("external"); setNewHref("");
    setShowAddForm(false);
  };

  const handleDeleteLink = (idx) => {
    setLinks(prev => prev.filter((_, i) => i !== idx));
    setPendingDelete(null);
  };

  const displayNews = newsLoading ? [] : liveNews;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateDay  = now.toLocaleDateString("en-GB", { weekday: "long" });
  const dateFull = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  /* Greeting is the LOGGED-IN user's own identity (not the previewed
   * persona): their first name + the canonical site they default to,
   * both via the shared people/scope layer. */
  const currentUserFirstName =
    String(currentUser?.displayName ?? "")
      .replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Miss)\s+/i, "")
      .trim()
      .split(/\s+/)[0] || "there";
  const currentUserSite = siteName(defaultSiteFor(currentUser));

  /* Live Group Compliance Feed is scoped to the sites the logged-in
   * user is allowed to see (a Practice Manager sees only their site; an
   * Area Manager their area; group roles everything). Each row's display
   * label is the canonical, uppercased site name. */
  const visibleSiteIds = new Set(visibleSites(currentUser).map((s) => s.id));
  /* Real operational-log completions (AgendaContext ledger) lead the feed,
   * followed by the seeded history — completing a task in the agenda
   * drawer or on Operational Logs now ripples straight into this ticker. */
  const visibleSiteNames = new Set(
    visibleSites(currentUser).map((s) => s.name.toUpperCase()),
  );
  const ledgerFeedItems = ledger
    .map((l) => ({
      site: String(l.siteName ?? currentUserSite).toUpperCase(),
      message: l.status === "alert"
        ? `${l.template} submitted by ${l.operator} — reading out of range, alert raised.`
        : `${l.template} completed by ${l.operator}.`,
      when: l.at ?? l.time,
    }))
    .filter((l) => visibleSiteNames.size === 0 || visibleSiteNames.has(l.site));
  const scopedComplianceFeed = [
    ...ledgerFeedItems,
    ...COMPLIANCE_FEED
      .filter((f) => visibleSiteIds.size === 0 || visibleSiteIds.has(f.siteId))
      .map((f) => ({ ...f, site: siteName(f.siteId).toUpperCase() })),
  ];

  return (
    <div>
      {/* ══ Industry switcher — hidden while only one sector is enabled.
        * `industries` comes from IndustryContext and already contains only
        * this deployment's enabled sectors (ENABLED_INDUSTRY_IDS); once a
        * second sector is enabled the bar reappears with no code change. ══ */}
      {industries.length > 1 && (
        <IndustryBar value={industry} industries={industries} onChange={setIndustry} />
      )}

      {/* ══ 0. Welcome Banner — greets the LOGGED-IN user ══
        * Both lines describe the AUTHENTICATED user (their name, their real
        * job title, their site). The persona preview only drives the widgets
        * below and announces itself on the "Previewing as" chip — mixing it
        * into the identity line made one screen show three different roles. */}
      <div className={styles.welcome}>
        <div className={styles.welcomeText}>
          <h1 className={styles.welcomeTitle}>
            {greeting}, {currentUserFirstName}.
          </h1>
          <p className={styles.welcomeSub}>
            {currentUser?.hrProfile?.jobTitle ?? currentUser?.orgRoleLabel ?? "Team member"} · {currentUserSite} · {industry.brand}
          </p>
        </div>
        <div className={styles.welcomeRight}>
          {/* PersonaSwitcher — dev/demo chip lets the user preview the
            * dashboard as any of the 9 personas. Production swap: persona
            * is resolved from a JWT claim and the chip disappears. */}
          <PersonaSwitcher />
          <div className={styles.welcomeDate}>
            <span className={styles.welcomeDateDay}>{dateDay}</span>
            <span className={styles.welcomeDateFull}>{dateFull}</span>
          </div>
        </div>
      </div>

      {personaMeta.isOverridden && (
        <div className={styles.previewBanner} role="status">
          <I name="eye" size={16} color="currentColor" />
          <div className={styles.previewBannerText}>
            <strong>Dashboard preview: {persona.label}</strong>
            <span>{persona.displayName} · {persona.site}. Preview changes dashboard presentation only; your permissions and data scope are unchanged.</span>
          </div>
          <button type="button" className={styles.previewBannerExit} onClick={personaMeta.clearOverride}>
            Exit preview
          </button>
        </div>
      )}

      {/* ══ 0a. Mandatory Action banner (RBAC) ══
       *
       * Renders directly under the welcome banner for clinician
       * roles when there are outstanding mandatory protocol
       * signatures. Dismissible per-session. The Read & Sign Now
       * link deep-links to the Clinical Protocols workspace. */}
      {isClinician && !bannerDismissed && CLINICIAN_PENDING_SIGNATURES > 0 && (
        <div className={styles.actionBanner} role="alert">
          <span className={styles.actionBannerIcon} aria-hidden="true">⚠️</span>
          <div className={styles.actionBannerBody}>
            <strong>Mandatory Action Required</strong>:{" "}
            You have {CLINICIAN_PENDING_SIGNATURES} updated Core Clinical Protocol{CLINICIAN_PENDING_SIGNATURES === 1 ? "" : "s"} awaiting your digital signature.
          </div>
          <button
            type="button"
            className={styles.actionBannerCta}
            onClick={() => onNav?.("clinical_protocols")}
          >
            Read &amp; Sign Now <I name="arrow" size={11} color="currentColor" />
          </button>
          <button
            type="button"
            className={styles.actionBannerDismiss}
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss action required banner"
          >
            ×
          </button>
        </div>
      )}

      {/* ══ NEW LAYOUT — 65/35 two-column grid below the welcome
       *   strip. Left column carries the Verbilo Pulse newsletter +
       *   role-based action tiles; right column stacks the Tip
       *   carousel, Suggestion Box and Audit Countdown.
       *
       *   The previous Group Update Hero, Quick Links bar +
       *   Streak Widget, and standalone News & Updates card were
       *   removed per the executive-demo restructure. Their state +
       *   modals (Manage Quick Links, Article/Video) remain in the
       *   file as dead code so a future revert is one block away. */}
      <div className={styles.dashGrid}>
        <div className={styles.dashLeftCol}>
          {/* Verbilo Pulse — internal group newsletter. Renders the newest
            * AUTHORED post (localStorage via dashboard.service); the static
            * fixture only seeds the empty state. Management roles get the
            * "New post" composer — the card is genuinely postable. */}
          <article className={styles.pulseCard} aria-labelledby="pulse-heading">
            <div className={styles.pulseImage} style={{ background: `linear-gradient(145deg, ${pulse.accent}, ${pulse.accent}aa)` }}>
              <div className={styles.pulseImageBlob} />
              <div className={styles.pulseImageIcon} aria-hidden="true">
                <I name="hearthandshake" size={40} color="rgba(255,255,255,0.92)" />
              </div>
            </div>
            <div className={styles.pulseBody}>
              <div className={styles.pulseEyebrow}>
                <span className={styles.pulseDot} style={{ background: pulse.accent }} />
                {pulse.eyebrow}
                <span className={styles.pulseDate}>· {pulse.date}</span>
                {canManageComms && (
                  <button
                    type="button"
                    onClick={() => setShowPulseComposer(true)}
                    title="Post a new Pulse update to the whole group"
                    style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: "var(--radius-pill)", border: "1px solid var(--outline-variant)", background: "var(--surface-low)", fontSize: 11.5, fontWeight: 700, cursor: "pointer", color: "var(--on-surface)" }}
                  >
                    <I name="plus" size={12} /> New post
                  </button>
                )}
              </div>
              <h2 id="pulse-heading" className={styles.pulseTitle}>{pulse.title}</h2>
              <p className={styles.pulseText}>{pulse.body}</p>
              <div className={styles.pulseAuthor}>
                <Avatar name={pulse.author} size={28} />
                <div className={styles.pulseAuthorText}>
                  <div className={styles.pulseAuthorName}>{pulse.author}</div>
                  <div className={styles.pulseAuthorRole}>{pulse.role}</div>
                </div>
              </div>
            </div>
          </article>

          {/* Pulse composer — management-gated; posts persist and render
            * immediately as the card above. */}
          {showPulseComposer && (
            <div
              onClick={() => setShowPulseComposer(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Post a Pulse update"
                onClick={(e) => e.stopPropagation()}
                style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "26px 28px", width: "min(560px, 100%)", boxShadow: "0 24px 64px rgba(15,23,42,0.35)" }}
              >
                <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 17 }}>Post a Pulse update</h3>
                <p style={{ margin: "6px 0 16px", fontSize: 12.5, color: "var(--on-surface-variant)" }}>
                  Publishes to every team member&apos;s dashboard as the latest Verbilo Pulse, attributed to you.
                </p>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginBottom: 6 }}>Headline</label>
                <input
                  value={pulseTitle}
                  onChange={(e) => setPulseTitle(e.target.value)}
                  placeholder="e.g. Welcome our new hygienist at Reading"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--outline-variant)", background: "var(--surface)", fontSize: 13, marginBottom: 14 }}
                />
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginBottom: 6 }}>Message</label>
                <textarea
                  rows={5}
                  value={pulseBody}
                  onChange={(e) => setPulseBody(e.target.value)}
                  placeholder="Write the update the whole group should see…"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--outline-variant)", background: "var(--surface)", fontSize: 13, resize: "vertical" }}
                />
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                  <BtnSecondary onClick={() => setShowPulseComposer(false)}>Cancel</BtnSecondary>
                  <BtnPrimary
                    onClick={handlePostPulse}
                    disabled={!pulseTitle.trim() || !pulseBody.trim()}
                    title={pulseTitle.trim() && pulseBody.trim() ? undefined : "Add a headline and message first"}
                  >
                    <I name="send" size={14} /> Post update
                  </BtnPrimary>
                </div>
              </div>
            </div>
          )}

          {/* MyActionQueue — persona-aware list of "what needs YOU today".
            * Replaced the previous static 4-tile ROLE_ACTIONS grid which
            * was hardcoded for all users. Pulls from
            * services/dashboard/actionQueue.js per personaId. The old
            * grid JSX is preserved below behind an `{false &&}` guard so
            * the rollback is one flag flip away. */}
          <MyActionQueueWidget personaId={personaId} onNav={onNav} />

          {/* MyShifts — Slice PM-4. Personal "next 3 shifts" derived
            * from the shared rota store. Reactive to any PM edit in
            * the Rota tab. Hidden for manager personas (PM/AM/CD)
            * since they OWN the rota rather than consume it. */}
          {SHIFTS_VISIBLE_PERSONAS.has(personaId) && persona && (
            <MyShiftsWidget personaDisplayName={persona.displayName} />
          )}

          {/* MyActivityPulse — per-persona "your week so far" metrics.
            * 2-up grid of stat cards. All Verbilo-native data. */}
          <MyActivityPulseWidget personaId={personaId} />

          {false && (
          <div className={styles.actionTilesGrid} aria-label="Quick actions for your role">
            {ROLE_ACTIONS.map((a) => (
              <button
                key={a.label}
                type="button"
                className={styles.actionTile}
                onClick={() => onNav?.(a.nav)}
                style={{ "--tile-accent": a.accent }}
              >
                <span className={styles.actionTileIcon} style={{ background: `color-mix(in srgb, ${a.accent} 14%, transparent)`, color: a.accent }}>
                  <I name={a.icon} size={18} color="currentColor" />
                </span>
                <div className={styles.actionTileText}>
                  <span className={styles.actionTileLabel}>{a.label}</span>
                  <span className={styles.actionTileSub}>{a.sub}</span>
                  {a.status && (
                    /* Live status pill — colour comes from the tone
                     * class (good/warn/info). Sits below the sub
                     * line so the tile reads label → context →
                     * live signal in a single vertical scan. */
                    <span className={`${styles.actionTileStatus} ${styles[`actionTileStatus_${a.status.tone}`]}`}>
                      <span aria-hidden="true">{a.status.icon}</span>
                      {a.status.text}
                    </span>
                  )}
                </div>
                <I name="arrow" size={11} color="var(--on-surface-variant)" />
              </button>
            ))}
          </div>
          )}

          {/* Live Group Compliance Feed — manager-only (PM / AM / CD).
            * Clinicians + reception don't need cross-site noise; their
            * value comes from MyActionQueue + MyActivityPulse above. */}
          {FEED_VISIBLE_PERSONAS.has(personaId) && (
          <Card hover={false} className={styles.feedCard}>
            <div className={styles.feedHead}>
              <h3 className={styles.feedHeading}>
                <I name="activity" size={15} color="var(--primary)" />
                Live Group Compliance Feed
              </h3>
              <span className={styles.feedLive}>
                <span className={styles.feedLiveDot} /> LIVE
              </span>
            </div>
            {/* LiveScroller — rotates the feed every 4s so it reads
              * like a real-time activity ticker. Pauses on hover so
              * the user can finish reading without items moving under
              * the cursor. Respects prefers-reduced-motion. */}
            <LiveScroller
              items={scopedComplianceFeed}
              visibleCount={4}
              intervalMs={4000}
              itemKey={(f) => `${f.site}-${f.message}`}
              className={styles.feedList}
              renderItem={(f) => (
                <div className={styles.feedRow}>
                  <span className={styles.feedSitePill}>
                    <span aria-hidden="true">🟢</span> {f.site}
                  </span>
                  <span className={styles.feedMessage}>{f.message}</span>
                  <span className={styles.feedWhen}>{relativeTime(f.when)}</span>
                </div>
              )}
            />
          </Card>
          )}
        </div>

        {/* ─── Right column — sticky daily-engagement stack ─── */}
        <aside className={styles.dashRightCol} aria-label="Daily engagement">
          {/* Tip of the Day — moved from previous position */}
          {todayTip && tipCfg && (
            <div className={styles.tipCard} style={{ borderLeftColor: tipCfg.color }}>
              <div className={styles.tipIconWrap} style={{ background: tipCfg.bg }}>
                <I name="lightbulb" size={22} color={tipCfg.color} />
              </div>
              <div className={styles.tipContent}>
                <div className={styles.tipTop}>
                  <span className={styles.tipLabel}>Tip of the Day</span>
                  <span className={styles.tipPill} style={{ background: tipCfg.bg, color: tipCfg.color }}>
                    {todayTip.category}
                  </span>
                </div>
                <p className={styles.tipText}>{todayTip.tip}</p>
              </div>
              <div className={styles.tipControls}>
                <button
                  type="button"
                  className={`${styles.tipBookmarkBtn} ${tipIsBookmarked ? styles.tipBookmarkBtnOn : ""}`}
                  onClick={toggleBookmark}
                  aria-pressed={tipIsBookmarked}
                  aria-label={tipIsBookmarked ? "Remove bookmark" : "Bookmark this tip"}
                  title={tipIsBookmarked ? "Bookmarked — click to remove" : "Bookmark this tip"}
                >
                  <I name="bookmark" size={13} color="currentColor" />
                </button>
                <div className={styles.tipPaginator}>
                  <button type="button" className={styles.tipPagBtn} onClick={() => setTipOffset((o) => o - 1)} aria-label="Previous tip">
                    <I name="back" size={12} color="currentColor" />
                  </button>
                  <span className={styles.tipCounter}>{tipIndex + 1} / {personaTipCount}</span>
                  <button type="button" className={styles.tipPagBtn} onClick={() => setTipOffset((o) => o + 1)} aria-label="Next tip">
                    <I name="arrow" size={12} color="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Suggestion Box — moved from previous position */}
          <Card hover={false} className={styles.suggestionCard}>
            <div className={styles.suggestionTop}>
              <div className={styles.suggestionIconWrap}>
                <I name="lightbulb" size={20} color="var(--primary)" />
              </div>
              <h3 className={styles.suggestionTitle}>Suggestion Box</h3>
            </div>
            <p className={styles.suggestionDesc}>
              Got an idea to improve the practice? All submissions are anonymous and reviewed weekly by the management team.
            </p>
            {submitted ? (
              <div className={styles.suggestionThanks}>
                <I name="checkcircle" size={18} color="var(--success)" />
                <span>Thank you — your suggestion has been submitted.</span>
              </div>
            ) : (
              <>
                <textarea
                  rows={4}
                  placeholder="Share your idea or suggestion..."
                  className={styles.suggestionTextarea}
                  value={suggestion}
                  onChange={e => setSuggestion(e.target.value)}
                />
                <BtnPrimary
                  onClick={handleSuggest}
                  disabled={!suggestion.trim()}
                  title={suggestion.trim() ? undefined : "Write a suggestion first"}
                  style={{ width: "100%", justifyContent: "center", marginTop: 10, fontSize: 13 }}
                >
                  <I name="send" size={14} /> Submit Anonymously
                </BtnPrimary>
              </>
            )}
          </Card>

          {/* Suggestion Inbox — the management side of the anonymous box
            * above. Submissions persist via dashboard.service and are
            * reviewed + cleared here, making the "reviewed weekly by the
            * management team" promise actually true. */}
          {canManageComms && (
            <Card hover={false} className={styles.suggestionCard}>
              <div className={styles.suggestionTop}>
                <div className={styles.suggestionIconWrap}>
                  <I name="mail" size={15} color="var(--primary)" />
                </div>
                <h3 className={styles.suggestionTitle}>Suggestion Inbox</h3>
              </div>
              <p className={styles.suggestionDesc}>
                {suggestionInbox.length === 0
                  ? "No suggestions waiting — anonymous submissions from the team appear here."
                  : `${suggestionInbox.length} anonymous suggestion${suggestionInbox.length === 1 ? "" : "s"} awaiting review.`}
              </p>
              {suggestionInbox.slice(0, 6).map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderTop: "1px solid var(--outline-variant)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, lineHeight: 1.45, color: "var(--on-surface)" }}>{s.text}</div>
                    <div style={{ fontSize: 10.5, color: "var(--on-surface-variant)", marginTop: 3 }}>{relativeTime(s.at)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuggestionInbox(dismissSuggestion(s.id))}
                    title="Mark reviewed and clear"
                    style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", border: "1px solid var(--outline-variant)", background: "var(--surface-low)", cursor: "pointer" }}
                  >
                    <I name="check" size={13} color="#2e7d32" />
                  </button>
                </div>
              ))}
            </Card>
          )}

          {/* Spotlight — weekly-rotating "always something fresh" slot.
            * 6 content pieces per persona, ISO-week-driven rotation,
            * manual prev/next chevrons for demo flick-through. */}
          <SpotlightWidget personaId={personaId} onNav={onNav} />

          {/* Streak widget — persona-aware single big-number cadence
            * metric. Replaces the previous Today's Site Health checklist
            * (which was wallpaper for non-managers, duplicated Operational
            * Logs for managers). Streaks are the strongest known
            * retention lever in daily SaaS. */}
          <StreakWidget personaId={personaId} />
        </aside>
      </div>

      {/* ── Legacy components retained as dead code (Group Update
       *    Hero + Quick Links + News Card) — JSX preserved below
       *    inside an `{false && (…)}` guard so it never renders but
       *    is one flip away if the brief changes direction again.
       *    Tip of the Day + Suggestion Box now live inside the
       *    Right column above, so they are not reproduced here. */}

      {/* ══ Manage Quick Links Modal ══ */}
      {showManage && (
        <div className={styles.videoModalBackdrop} onClick={closeManage}>
          <div className={styles.manageLinksModal} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className={styles.addLinkModalHeader}>
              <span className={styles.addLinkModalTitle}>Manage Quick Links</span>
              <button className={styles.videoModalClose} onClick={closeManage}>
                <I name="xcircle" size={20} color="var(--on-surface-variant)" />
              </button>
            </div>

            {/* Existing links list */}
            <div className={styles.manageLinksList}>
              {links.map((link, idx) => (
                pendingDelete === idx ? (
                  <div key={idx} className={styles.manageConfirmRow}>
                    <span className={styles.manageConfirmText}>Remove <strong>"{link.label}"</strong>?</span>
                    <div className={styles.manageConfirmActions}>
                      <button className={styles.manageConfirmNo} onClick={() => setPendingDelete(null)}>Cancel</button>
                      <button className={styles.manageConfirmYes} onClick={() => handleDeleteLink(idx)}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <div key={idx} className={styles.manageLinkRow}>
                    <div className={styles.manageLinkIconWrap}>
                      <I name={link.icon} size={16} color="var(--primary)" />
                    </div>
                    <div className={styles.manageLinkInfo}>
                      <span className={styles.manageLinkName}>{link.label}</span>
                      <span className={styles.manageLinkDest}>{link.href || link.nav || "—"}</span>
                    </div>
                    <button
                      className={styles.manageLinkDeleteBtn}
                      onClick={() => { setPendingDelete(idx); setShowAddForm(false); }}
                      title="Delete link"
                    >
                      <I name="trash" size={14} color="var(--error)" />
                    </button>
                  </div>
                )
              ))}
            </div>

            {/* Add new link section */}
            <div className={styles.manageAddSection}>
              {showAddForm ? (
                <div className={styles.addLinkModalBody}>
                  <div className={styles.addLinkField}>
                    <label className={styles.addLinkFieldLabel}>Name</label>
                    <input
                      className={styles.addLinkInput}
                      placeholder="e.g. NHS BSA Portal"
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddLink()}
                      autoFocus
                    />
                  </div>
                  <div className={styles.addLinkField}>
                    <label className={styles.addLinkFieldLabel}>Icon</label>
                    <IconSelect value={newIcon} onChange={setNewIcon} options={linkIcons} />
                  </div>
                  <div className={styles.addLinkField}>
                    <label className={styles.addLinkFieldLabel}>Link</label>
                    <input
                      className={styles.addLinkInput}
                      placeholder="https://... or page name (training, staff, cpd, hr…)"
                      value={newHref}
                      onChange={e => setNewHref(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddLink()}
                    />
                  </div>
                  <div className={styles.addLinkModalFooter}>
                    <button className={styles.addLinkCancelBtn} onClick={() => { setShowAddForm(false); setNewLabel(""); setNewIcon("external"); setNewHref(""); }}>
                      Cancel
                    </button>
                    <button
                      className={styles.addLinkSaveBtn}
                      onClick={handleAddLink}
                      disabled={!newLabel.trim()}
                    >
                      <I name="plus" size={14} /> Add Link
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={styles.showAddFormBtn}
                  onClick={() => { setShowAddForm(true); setPendingDelete(null); }}
                >
                  <I name="plus" size={14} /> Add New Link
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ══ Media / Article Modal ══ */}
      {activeItem && (
        <div className={styles.videoModalBackdrop} onClick={() => setActiveItem(null)}>
          <div
            className={activeItem.videoSrc ? styles.videoModalInner : styles.articleModalInner}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.videoModalHeader}>
              <div>
                <div className={styles.videoModalTag}>{activeItem.tag}</div>
                <div className={styles.videoModalTitle}>{activeItem.title}</div>
              </div>
              <button className={styles.videoModalClose} onClick={() => setActiveItem(null)}>
                <I name="xcircle" size={22} color="var(--on-surface-variant)" />
              </button>
            </div>

            {activeItem.videoSrc ? (
              <video
                className={styles.videoModalPlayer}
                src={activeItem.videoSrc}
                controls
                autoPlay
              />
            ) : (
              <div className={styles.articleBody}>
                <div className={styles.articleMeta}>
                  <Avatar name={activeItem.host} size={36} />
                  <div>
                    <div className={styles.articleAuthor}>{activeItem.host}</div>
                    {activeItem.role && <div className={styles.articleRole}>{activeItem.role}</div>}
                    <div className={styles.articleDate}>{activeItem.date}</div>
                  </div>
                </div>
                <div className={styles.articleDivider} />
                {activeItem.body.split("\n\n").map((para, i) => (
                  <p key={i} className={styles.articlePara}>{para}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

