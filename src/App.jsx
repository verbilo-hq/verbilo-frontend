import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ClinicalPage } from "./pages/ClinicalPage";
import { TrainingPage } from "./pages/TrainingPage";
import { StaffPage } from "./pages/StaffPage";
import { MarketingPage } from "./pages/MarketingPage";
import { HrPage } from "./pages/HrPage";
import { AdminPage } from "./pages/AdminPage";
import styles from "./App.module.css";

const pageComponents = {
  dashboard: DashboardPage,
  clinical: ClinicalPage,
  training: TrainingPage,
  staff: StaffPage,
  marketing: MarketingPage,
  hr: HrPage,
  admin: AdminPage,
};

const standalonePages = {
  login: LoginPage,
  register: RegisterPage,
  onboarding: OnboardingPage,
};

export default function App() {
  const [page, setPage] = useState("login");

  const StandalonePage = standalonePages[page];
  if (StandalonePage) return <StandalonePage onNav={setPage} />;

  const ActivePage = pageComponents[page] || DashboardPage;

  return (
    <div className={styles.shell}>
      <Sidebar current={page} onNav={setPage} />
      <main className={styles.main}>
        <ActivePage />
      </main>
    </div>
  );
}
