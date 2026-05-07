import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { LoginPage } from "./pages/LoginPage";
import { SetPasswordPage } from "./pages/SetPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ClinicalPage } from "./pages/ClinicalPage";
import { TrainingPage } from "./pages/TrainingPage";
import { StaffPage } from "./pages/StaffPage";
import { MarketingPage } from "./pages/MarketingPage";
import { HrPage } from "./pages/HrPage";
import { AdminPage } from "./pages/AdminPage";
import { CpdPage } from "./pages/CpdPage";
import { CqcPage } from "./pages/CqcPage";
import { LabPage } from "./pages/LabPage";
import { ManagerPage } from "./pages/ManagerPage";
import styles from "./App.module.css";

// ── Seed accounts ─────────────────────────────────────────────────────────────
// admin account is pre-created (set up during deployment).
// Staff accounts are created by the Practice Manager via Add Staff Member.

const seedAccounts = [
  { username: "admin",     password: "Admin123!",  role: "manager",     staffId: 2, isTempPassword: false, displayName: "Mark Thompson" },
  { username: "s.jenkins", password: "Welcome1",   role: "dentist",     staffId: 1, isTempPassword: true,  displayName: "Dr. Sarah Jenkins" },
  { username: "e.rossi",   password: "Welcome1",   role: "hygienist",   staffId: 3, isTempPassword: true,  displayName: "Elena Rossi" },
  { username: "l.vance",   password: "Welcome1",   role: "dentist",     staffId: 4, isTempPassword: true,  displayName: "Leo Vance" },
  { username: "j.wu",      password: "Welcome1",   role: "dentist",     staffId: 5, isTempPassword: true,  displayName: "Jessica Wu" },
  { username: "a.clarke",  password: "Welcome1",   role: "nurse",       staffId: 6, isTempPassword: true,  displayName: "Amy Clarke" },
  { username: "j.hart",    password: "Welcome1",   role: "hygienist",   staffId: 7, isTempPassword: true,  displayName: "James Hart" },
  { username: "s.brown",   password: "Welcome1",   role: "receptionist",staffId: 8, isTempPassword: true,  displayName: "Sophie Brown" },
];

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
  const [page, setPage] = useState("login");
  const [accounts, setAccounts] = useState(seedAccounts);
  const [currentUser, setCurrentUser] = useState(null);

  // Called from LoginPage — returns the matched account or null
  const handleLogin = (username, password) => {
    const account = accounts.find(
      (a) => a.username === username && a.password === password
    );
    if (!account) return null;
    setCurrentUser(account);
    setPage(account.isTempPassword ? "setpassword" : "dashboard");
    return account;
  };

  // Called from SetPasswordPage after staff member sets their own password
  const handleSetPassword = (newPassword) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.username === currentUser.username
          ? { ...a, password: newPassword, isTempPassword: false }
          : a
      )
    );
    setCurrentUser((prev) => ({ ...prev, password: newPassword, isTempPassword: false }));
    setPage("dashboard");
  };

  // Called from StaffPage when PM creates a new staff member
  const addAccount = (account) => {
    setAccounts((prev) => [...prev, account]);
  };

  // Standalone pages (no sidebar)
  if (page === "login") return <LoginPage onLogin={handleLogin} />;
  if (page === "setpassword") return (
    <SetPasswordPage
      displayName={currentUser?.displayName}
      username={currentUser?.username}
      onSet={handleSetPassword}
    />
  );

  const ActivePage = pageComponents[page] || DashboardPage;
  const pageProps =
    page === "dashboard" ? { currentUser, onNav: setPage } :
    page === "staff"     ? { currentUser, onAddAccount: addAccount, accounts } :
    page === "cpd"       ? { currentUser, accounts } :
    page === "training"  ? { currentUser } :
    page === "manager"   ? { currentUser } :
    {};

  return (
    <div className={styles.shell}>
      <Sidebar current={page} onNav={setPage} currentUser={currentUser} />
      <main className={styles.main}>
        <ActivePage {...pageProps} />
      </main>
    </div>
  );
}
