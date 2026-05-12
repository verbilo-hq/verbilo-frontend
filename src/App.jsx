import { useState, lazy, Suspense } from "react";
import { useAuth } from "./auth/AuthContext";
import { Sidebar } from "./components/layout/Sidebar";
import { CrossTenantBanner } from "./components/layout/CrossTenantBanner";
import { Card } from "./components/ui/Card";
import { LoginPage } from "./pages/LoginPage";
import { SetPasswordPage } from "./pages/SetPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ClinicalPage } from "./pages/ClinicalPage";
import { MarketingPage } from "./pages/MarketingPage";
import { HrPage } from "./pages/HrPage";
import { AdminPage } from "./pages/AdminPage";
import { LabPage } from "./pages/LabPage";
import { ManagerPage } from "./pages/ManagerPage";
import styles from "./App.module.css";

// Code-split the four largest pages for a faster initial load.
const TrainingPage = lazy(() => import("./pages/TrainingPage").then((m) => ({ default: m.TrainingPage })));
const StaffPage    = lazy(() => import("./pages/StaffPage").then((m) => ({ default: m.StaffPage })));
const CqcPage      = lazy(() => import("./pages/CqcPage").then((m) => ({ default: m.CqcPage })));
const CpdPage      = lazy(() => import("./pages/CpdPage").then((m) => ({ default: m.CpdPage })));

const PageFallback = () => (
  <Card hover={false} style={{ padding: 24, color: "var(--on-surface-variant)" }}>
    Loading…
  </Card>
);

const pageComponents = {
  dashboard: DashboardPage,
  clinical:  ClinicalPage,
  training:  TrainingPage,
  staff:     StaffPage,
  marketing: MarketingPage,
  hr:        HrPage,
  admin:     AdminPage,
  cpd:       CpdPage,
  cqc:       CqcPage,
  lab:       LabPage,
  manager:   ManagerPage,
};

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(user?.isTempPassword ? "setpassword" : "dashboard");

  // Standalone pages (no sidebar)
  if (!isAuthenticated) return <LoginPage onLoggedIn={() => setPage("dashboard")} />;
  if (user?.isTempPassword || page === "setpassword") {
    return <SetPasswordPage onComplete={() => setPage("dashboard")} />;
  }

  const ActivePage = pageComponents[page] || DashboardPage;
  const pageProps =
    page === "dashboard" ? { currentUser: user, onNav: setPage } :
    page === "staff"     ? { currentUser: user } :
    page === "cpd"       ? { currentUser: user } :
    page === "training"  ? { currentUser: user } :
    page === "manager"   ? { currentUser: user } :
    page === "marketing" ? { currentUser: user } :
    {};

  return (
    <div className={styles.shell}>
      <Sidebar current={page} onNav={setPage} />
      <main className={styles.main}>
        <CrossTenantBanner />
        <Suspense fallback={<PageFallback />}>
          <ActivePage {...pageProps} />
        </Suspense>
      </main>
    </div>
  );
}
