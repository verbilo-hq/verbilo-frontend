import { useState, lazy, Suspense, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import { useIndustry } from "./contexts/IndustryContext";
import { Sidebar } from "./components/layout/Sidebar";
import { AppHeader } from "./components/layout/AppHeader";
import { Card } from "./components/ui/Card";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SetPasswordPage } from "./pages/SetPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AgendaProvider, useAgenda } from "./contexts/AgendaContext";
import { TodaysAgendaDrawer } from "./components/agenda/TodaysAgendaDrawer";
import { canViewPage, hasCap, useDevRole } from "./services/devRole";
import styles from "./App.module.css";

// Code-split every post-login page except the default dashboard: each
// loads on first navigation, keeping the initial bundle lean. Landing /
// Login / SetPassword stay eager (they ARE the initial paint), and the
// dashboard stays eager so sign-in lands without a loading flash.
const TrainingPage        = lazy(() => import("./pages/TrainingPage").then((m) => ({ default: m.TrainingPage })));
const SupervisionHubPage  = lazy(() => import("./pages/SupervisionHubPage").then((m) => ({ default: m.SupervisionHubPage })));
const StaffPage           = lazy(() => import("./pages/StaffDirectory").then((m) => ({ default: m.StaffDirectoryPage })));
const CqcPage             = lazy(() => import("./pages/CqcPage").then((m) => ({ default: m.CqcPage })));
const CpdPage             = lazy(() => import("./pages/CpdPage").then((m) => ({ default: m.CpdPage })));
const ClinicalPage        = lazy(() => import("./pages/ClinicalPage").then((m) => ({ default: m.ClinicalPage })));
const MarketingPage       = lazy(() => import("./pages/MarketingPage").then((m) => ({ default: m.MarketingPage })));
const HrPage              = lazy(() => import("./pages/HrPage").then((m) => ({ default: m.HrPage })));
const AdminPage           = lazy(() => import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })));
const LabPage             = lazy(() => import("./pages/LabPage").then((m) => ({ default: m.LabPage })));
const ManagerPage         = lazy(() => import("./pages/ManagerPage").then((m) => ({ default: m.ManagerPage })));
const ManagementHubPage   = lazy(() => import("./pages/ManagementHubPage").then((m) => ({ default: m.ManagementHubPage })));
const GovernancePage      = lazy(() => import("./pages/GovernancePage").then((m) => ({ default: m.GovernancePage })));
const AuditEvidenceCentre = lazy(() => import("./pages/AuditEvidenceCentre").then((m) => ({ default: m.AuditEvidenceCentre })));
const OperationalLogsPage = lazy(() => import("./pages/logbooks/OperationalLogsPage").then((m) => ({ default: m.OperationalLogsPage })));

const PageFallback = () => (
  <Card hover={false} style={{ padding: 24, color: "var(--on-surface-variant)" }}>
    Loading…
  </Card>
);

const pageComponents = {
  dashboard:           DashboardPage,
  clinical:            ClinicalPage,
  training:            TrainingPage,
  supervision_hub:     SupervisionHubPage,
  staff:               StaffPage,
  marketing:           MarketingPage,
  hr:                  HrPage,
  admin:               AdminPage,
  cpd:                 CpdPage,
  cqc:                 CqcPage,
  lab:                 LabPage,
  manager:             ManagerPage,
  management:          ManagementHubPage,
  governance:          GovernancePage,
  // Sidebar shortcut — opens GovernancePage straight into the Clinical
  // Protocols library (skips the pack catalogue / landing).
  clinical_protocols:  GovernancePage,
  audit_evidence:      AuditEvidenceCentre,
  logbooks:            OperationalLogsPage,
};

/* ─── Hash routing ────────────────────────────────────────────────────────
 * The page id is mirrored into location.hash ("#/hr") so browser Back /
 * Forward, refresh and bookmarked deep-links all work without a router
 * dependency. Unknown hashes safely resolve to the dashboard. */
const pageFromHash = () => {
  const id = window.location.hash.replace(/^#\/?/, "");
  return pageComponents[id] ? id : "dashboard";
};

const canAccessPage = (page, user, industry, capabilityRole) => {
  if (page === "setpassword") return true;
  const item = industry.navItems.find((entry) => entry.id === page);
  if (!item) return false;
  if (!canViewPage(capabilityRole, page, user?.orgRole)) return false;
  if (item.roles && !item.roles.includes(user?.role)) return false;
  if (item.cap && !hasCap(capabilityRole, item.cap)) return false;
  return true;
};

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const { industry } = useIndustry();
  const [capabilityRole] = useDevRole();
  const [page, setPage] = useState(() => (user?.isTempPassword ? "setpassword" : pageFromHash()));
  const [showLogin, setShowLogin] = useState(false);
  // Bumped every time the sidebar is clicked — used as part of the page key
  // so re-clicking the active nav item remounts the page (resets internal
  // state, e.g. exits the Governance wizard back to the catalogue).
  const [navTick, setNavTick] = useState(0);
  /* Off-canvas nav (tablet / phone) — toggled by the header hamburger,
   * closed by scrim click, Escape, or completing a navigation. Desktop
   * ignores it entirely (the sidebar is always visible there). */
  const [navOpen, setNavOpen] = useState(false);
  /* Cross-page deep-link context — populated by callers like the CQC
   * Hub's "Manage Schedule" button that want to navigate AND pre-seed
   * the destination page's filter / view. Cleared on the next nav. */
  const [pageContext, setPageContext] = useState(null);
  const handleNav = (next, opts) => {
    if (!canAccessPage(next, user, industry, capabilityRole)) return;
    setNavTick((t) => t + 1);
    setPage(next);
    setPageContext(opts ?? null);
    setNavOpen(false);
  };

  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setNavOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  // Bounce to dashboard if the current page is unavailable to this industry or
  // authenticated role. Sidebar filtering remains UX; this is the route guard.
  useEffect(() => {
    if (!canAccessPage(page, user, industry, capabilityRole)) setPage("dashboard");
  }, [industry, page, user, capabilityRole]);

  // Mirror page → URL hash. The bare initial load ("" → "#/dashboard") uses
  // replaceState so it doesn't create a history entry (otherwise Back would
  // bounce between the hashless and hashed URL forever); real navigations
  // assign location.hash, which pushes an entry per page for Back/Forward.
  useEffect(() => {
    if (!isAuthenticated || page === "setpassword") return;
    const target = `#/${page}`;
    if (window.location.hash === target) return;
    if (!window.location.hash) window.history.replaceState(null, "", target);
    else window.location.hash = target;
  }, [isAuthenticated, page]);

  // Follow the hash on browser Back / Forward or a hand-edited URL.
  useEffect(() => {
    const onHash = () => setPage((current) => {
      const next = pageFromHash();
      if (!canAccessPage(next, user, industry, capabilityRole)) return "dashboard";
      return next === current ? current : next;
    });
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [user, industry, capabilityRole]);

  // Browser-tab title: the platform pre-login, the tenant brand once signed
  // in (the static index.html title leaked tenant branding to logged-out
  // visitors).
  useEffect(() => {
    document.title = isAuthenticated
      ? `${industry.brand} — Verbilo`
      : "Verbilo — The modern intranet platform";
  }, [isAuthenticated, industry.brand]);

  // Standalone pages (no sidebar)
  if (!isAuthenticated) {
    // Honour a bookmarked deep-link: after sign-in, land on the page the
    // hash points at rather than forcing the dashboard.
    if (showLogin) return <LoginPage onLoggedIn={() => { setShowLogin(false); setPage(pageFromHash()); }} />;
    return (
      <LandingPage
        onLoginClick={() => setShowLogin(true)}
        bookDemoHref={import.meta.env.VITE_BOOK_DEMO_URL?.trim() || null}
        contactHref={import.meta.env.VITE_CONTACT_URL?.trim() || null}
      />
    );
  }
  if (user?.isTempPassword || page === "setpassword") {
    return <SetPasswordPage onComplete={() => setPage("dashboard")} />;
  }

  // Enforce the gate synchronously as well as in the URL/state effects so an
  // unauthorised lazy page never mounts for a single render on a deep link.
  const activePageId = canAccessPage(page, user, industry, capabilityRole)
    ? page
    : "dashboard";
  const ActivePage = pageComponents[activePageId] || DashboardPage;
  const pageProps =
    activePageId === "dashboard"          ? { currentUser: user, onNav: handleNav } :
    activePageId === "staff"              ? { currentUser: user } :
    activePageId === "cpd"                ? { currentUser: user } :
    activePageId === "training"           ? { currentUser: user, onNav: handleNav } :
    /* Manager Hub needs onNav so the new Protocols Attention row +
     *  the clinician-mode alert banner can deep-link to the
     *  Clinical Protocols viewer. */
    activePageId === "manager"            ? { currentUser: user, onNav: handleNav, initialSiteName: pageContext?.siteName, initialSiteId: pageContext?.siteId } :
    activePageId === "management"         ? { currentUser: user, onNav: handleNav } :
    // CqcPage is read-only dashboard; onNav lets its "Go to Logs" /
    // "Manage Schedule" buttons route the user to the Operational
    // Logs or Audit & Evidence Centre workspace where the actual
    // schedule management happens. Uses handleNav (not raw setPage)
    // so the optional opts payload (e.g. { packFilter }) is captured
    // into pageContext for the destination page to read.
    activePageId === "cqc"                ? { onNav: handleNav } :
    // Deep-link context: when CqcPage's "Manage Schedule" button
    // navigates here with a packFilter, the Centre opens with its
    // Master Audit Schedule Feed pre-filtered to that pack.
    activePageId === "audit_evidence"     ? { initialPackFilter: pageContext?.packFilter } :
    activePageId === "clinical_protocols" ? { initialView: "clinical" } :
    activePageId === "manager"   ? { currentUser: user } :
    activePageId === "marketing" ? { currentUser: user } :
    {};

  /* AgendaProvider wraps everything that needs the Today's Compliance
   * Agenda state: trigger button in AppHeader, the right-side drawer
   * (rendered at root), the Operational Logs page, and the global
   * toast fired when a log is signed off from either surface. Login +
   * landing screens render outside this tree so unauthenticated views
   * skip the provider entirely. */
  return (
    <AgendaProvider>
      <div className={styles.shell}>
        <Sidebar current={activePageId} onNav={handleNav} open={navOpen} />
        {navOpen && <div className={styles.navScrim} onClick={() => setNavOpen(false)} />}
        <div className={styles.mainCol}>
          <AppHeader onMenuClick={() => setNavOpen((v) => !v)} />
          <main className={styles.main}>
            <Suspense fallback={<PageFallback />}>
              <ErrorBoundary key={`eb-${activePageId}-${navTick}`}>
                <ActivePage key={`${activePageId}-${navTick}`} {...pageProps} />
              </ErrorBoundary>
            </Suspense>
          </main>
        </div>

        {/* Right-side slide-out task dispatcher. Mounted once here so
         * it's available from every page. */}
        <TodaysAgendaDrawer />

        {/* Single global toast surface — fires when a log is completed
         * from either the Operational Logs cards or the agenda
         * drawer's Start Task modal. */}
        <GlobalToast />
      </div>
    </AgendaProvider>
  );
}

/* ─── Global toast ─────────────────────────────────────────────────────
 * Reads the shared toast string from AgendaContext and renders a single
 * fixed pill at the bottom-center of the viewport. Inline styles keep
 * this a zero-CSS-file helper; auto-dismiss is handled by the provider. */
function GlobalToast() {
  const { toast } = useAgenda();
  if (!toast) return null;
  return (
    <div role="status" aria-live="polite" style={toastStyle}>
      <span style={toastIconStyle}>✓</span>
      <span>{toast}</span>
    </div>
  );
}

const toastStyle = {
  position:      "fixed",
  bottom:        28,
  left:          "50%",
  transform:     "translateX(-50%)",
  display:       "inline-flex",
  alignItems:    "center",
  gap:           10,
  padding:       "12px 18px 12px 14px",
  background:    "#1b5e20",
  color:         "white",
  borderRadius:  12,
  fontSize:      13,
  fontWeight:    600,
  boxShadow:     "0 12px 36px rgba(15, 23, 42, 0.28)",
  zIndex:        100,
};
const toastIconStyle = {
  display:        "inline-flex",
  alignItems:     "center",
  justifyContent: "center",
  width:          22,
  height:         22,
  borderRadius:   "50%",
  background:     "rgba(255, 255, 255, 0.18)",
  fontWeight:     900,
  fontSize:       14,
  lineHeight:     1,
};
