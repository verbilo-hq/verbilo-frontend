import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { LoginPage } from "../LoginPage";
import { SetPasswordPage } from "../SetPasswordPage";
import { AdminTenantsPage } from "./AdminTenantsPage";
import { AdminCreateTenantPage } from "./AdminCreateTenantPage";
import { AdminTenantSettingsPage } from "./AdminTenantSettingsPage";
import styles from "./AdminPortalApp.module.css";

const ALLOWED_ROLES = new Set(["verbilo_super_admin", "verbilo_support"]);

export default function AdminPortalApp() {
  const { user, isAuthenticated, logout } = useAuth();
  const [view, setView] = useState({ name: "list" });

  if (!isAuthenticated) return <LoginPage onLoggedIn={() => setView({ name: "list" })} />;
  if (user?.isTempPassword) return <SetPasswordPage onComplete={() => setView({ name: "list" })} />;

  if (user && !ALLOWED_ROLES.has(user.role)) {
    return (
      <div className={styles.shell}>
        <div className={styles.deniedCard}>
          <h1>Not authorised</h1>
          <p>
            This portal is for Verbilo internal staff only. You're signed in as{" "}
            <strong>{user.username}</strong> with role <code>{user.role ?? "unknown"}</code>.
          </p>
          <button className={styles.btnSecondary} onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.brand}>Verbilo</div>
          <span className={styles.brandPill}>Admin portal</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userLabel}>
            {user?.username} · {user?.role}
          </span>
          <button className={styles.btnGhost} onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {view.name === "list" && (
          <AdminTenantsPage
            onCreate={() => setView({ name: "create" })}
            onEdit={(id) => setView({ name: "edit", id })}
          />
        )}
        {view.name === "create" && (
          <AdminCreateTenantPage
            onCreated={() => setView({ name: "list" })}
            onCancel={() => setView({ name: "list" })}
          />
        )}
        {view.name === "edit" && (
          <AdminTenantSettingsPage
            tenantId={view.id}
            onSaved={() => setView({ name: "list" })}
            onCancel={() => setView({ name: "list" })}
          />
        )}
      </main>
    </div>
  );
}
