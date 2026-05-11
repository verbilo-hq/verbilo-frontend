import { useCallback, useEffect, useState } from "react";
import {
  disableTenantUser,
  enableTenantUser,
  listTenantUsers,
  updateTenantUserRole,
} from "../../services/users.service";
import styles from "./AdminCreateTenantPage.module.css";

// Customer-side roles only — platform roles (verbilo_super_admin /
// verbilo_support) are intentionally absent from this list. Customer users
// belong to a tenant; platform admins are tenantId=null (VER-51) and never
// appear here.
//
// Keep in sync with `USER_ROLES` in verbilo-backend/src/common/user-roles.ts.
const CUSTOMER_ROLE_OPTIONS = [
  { id: "employee",          label: "Employee" },
  { id: "practice_manager",  label: "Practice manager" },
  { id: "area_manager",      label: "Area manager" },
  { id: "company_admin",     label: "Company admin" },
  { id: "company_owner",     label: "Company owner" },
];

const FALLBACK_LABEL = (role) => role ?? "—";

function roleLabel(role) {
  return CUSTOMER_ROLE_OPTIONS.find((o) => o.id === role)?.label ?? FALLBACK_LABEL(role);
}

// VER-53: surfaces the customer users of a tenant inside the admin portal
// so platform operators don't need DB access to see who's in an org.
// Rendered as a section on AdminTenantSettingsPage. Read controls are
// always available; the role <select> + Disable/Enable buttons disable
// themselves when the signed-in operator is `verbilo_support` (backend
// enforces this anyway via 403).
export const AdminTenantUsersSection = ({ tenantId, canEdit }) => {
  const [users, setUsers] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  // Per-row in-flight flags so two simultaneous toggles don't conflict.
  const [busyRow, setBusyRow] = useState(null);

  const refresh = useCallback(() => {
    setStatus("loading");
    setError(null);
    return listTenantUsers(tenantId)
      .then((rows) => {
        setUsers(rows);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [tenantId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleRoleChange = async (user, newRole) => {
    if (!canEdit || newRole === user.role) return;
    setBusyRow(user.id);
    // Optimistic update; we'll re-fetch on success to pick up backend
    // canonicalisation (and revert if it 403s).
    setUsers((current) =>
      current?.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
    );
    try {
      await updateTenantUserRole(tenantId, user.id, newRole);
      // The backend response is the updated row; quick refresh keeps the
      // table consistent without us trusting our optimistic state too far.
      await refresh();
    } catch (err) {
      // Revert + show the error inline at the top of the section.
      setUsers((current) =>
        current?.map((u) => (u.id === user.id ? { ...u, role: user.role } : u)),
      );
      setError(err);
    } finally {
      setBusyRow(null);
    }
  };

  const handleToggleDisable = async (user) => {
    if (!canEdit) return;
    setBusyRow(user.id);
    try {
      if (user.deletedAt) {
        await enableTenantUser(tenantId, user.id);
      } else {
        await disableTenantUser(tenantId, user.id);
      }
      await refresh();
    } catch (err) {
      setError(err);
    } finally {
      setBusyRow(null);
    }
  };

  if (status === "loading") {
    return (
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Users</p>
        <p className={styles.sectionBody}>Loading users…</p>
      </section>
    );
  }

  if (status === "error" && !users) {
    return (
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Users</p>
        <p className={styles.submitError}>
          Couldn't load users ({error?.status ?? error?.code ?? "error"}).
        </p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <p className={styles.sectionTitle}>Users</p>
      <p className={styles.sectionBody}>
        Customer users of this tenant. Disabled users keep their data but
        can't sign in.
      </p>

      {error && (
        <p className={styles.submitError} style={{ marginBottom: 12 }}>
          {error.code === "FORBIDDEN"
            ? "You don't have permission to change this."
            : `Action failed (${error.status ?? error.code ?? "error"}).`}
        </p>
      )}

      {users && users.length === 0 ? (
        <p className={styles.sectionBody}>No users yet.</p>
      ) : (
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Site</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              const isBusy = busyRow === user.id;
              const disabled = Boolean(user.deletedAt);
              return (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>
                    {canEdit ? (
                      <select
                        className={styles.userRoleSelect}
                        value={user.role}
                        disabled={isBusy || disabled}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                      >
                        {/* If the user's current role isn't in the canonical
                            list (legacy / hand-edited), show it disabled at
                            top so the operator can see what's stored. */}
                        {!CUSTOMER_ROLE_OPTIONS.some((o) => o.id === user.role) && (
                          <option value={user.role} disabled>
                            {roleLabel(user.role)} (unknown)
                          </option>
                        )}
                        {CUSTOMER_ROLE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      roleLabel(user.role)
                    )}
                  </td>
                  <td>{user.siteName ?? "—"}</td>
                  <td>
                    {disabled ? (
                      <span className={styles.statusDisabled}>Disabled</span>
                    ) : (
                      <span className={styles.statusActive}>Active</span>
                    )}
                  </td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                  <td className={styles.actions}>
                    {canEdit && (
                      <button
                        type="button"
                        className={`${styles.btnRow} ${disabled ? "" : styles.btnRowDanger}`}
                        onClick={() => handleToggleDisable(user)}
                        disabled={isBusy}
                      >
                        {isBusy ? "…" : disabled ? "Enable" : "Disable"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
};
