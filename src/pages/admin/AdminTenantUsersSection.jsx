import { useCallback, useEffect, useState } from "react";
import {
  disableTenantUser,
  enableTenantUser,
  listTenantUsers,
  updateTenantUserRole,
} from "../../services/users.service";
import { useAuth, useCapability } from "../../auth/AuthContext";
import { userRoleLabel } from "../../lib/sector";
import { AddUserModal } from "./AddUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import styles from "./AdminCreateTenantPage.module.css";

// Customer-side roles only — platform roles (verbilo_super_admin /
// verbilo_support) are intentionally absent from this list. Customer users
// belong to a tenant; platform admins are tenantId=null (VER-51) and never
// appear here.
//
// Keep in sync with `USER_ROLES` in verbilo-backend/src/common/user-roles.ts.
// VER-60: labels are sector-aware via `userRoleLabel`, so the same `id`
// renders as "Practice Manager" on a dental tenant and "Branch Manager" on
// an optometry tenant. The `id` strings still match the backend enum.
const CUSTOMER_ROLE_IDS = [
  "employee",
  "practice_manager",
  "area_manager",
  "company_admin",
  "company_owner",
];

// VER-53: surfaces the customer users of a tenant inside the admin portal
// so platform operators don't need DB access to see who's in an org.
// Rendered as a section on AdminTenantSettingsPage. Read controls are
// always available; the role <select> + Disable/Enable buttons disable
// themselves when the signed-in operator is `verbilo_support` (backend
// enforces this anyway via 403).
//
// VER-60: `sector` prop (passed from the parent's loaded tenant) drives
// the role display labels — "Practice Manager" vs "Branch Manager" vs
// "Site Manager" depending on the tenant's sector vocabulary.
export const AdminTenantUsersSection = ({ tenantId, canEdit, sector }) => {
  const [users, setUsers] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  // Per-row in-flight flags so two simultaneous toggles don't conflict.
  const [busyRow, setBusyRow] = useState(null);

  // VER-65: "Add user" modal. Capability-gated separately from
  // `canEdit` because USERS_CREATE and USERS_UPDATE_ROLE are distinct
  // capabilities in the backend matrix.
  const { permissions } = useAuth();
  const canCreate = useCapability("users.create");
  const [addOpen, setAddOpen] = useState(false);

  // VER-67: Delete user (post-disable only). USERS_DELETE is its own
  // capability — operators with USERS_DISABLE don't necessarily have
  // USERS_DELETE. `deleteTarget` is the row being confirmed.
  const canDelete = useCapability("users.delete");
  const [deleteTarget, setDeleteTarget] = useState(null);

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
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionTitle}>Users</p>
          <p className={styles.sectionBody}>
            Customer users of this tenant. Disabled users keep their data but
            can't sign in.
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => setAddOpen(true)}
          >
            + Add user
          </button>
        )}
      </div>

      {addOpen && (
        <AddUserModal
          tenantId={tenantId}
          sector={sector}
          actorRole={permissions?.role}
          onCreated={refresh}
          onClose={() => setAddOpen(false)}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          tenantId={tenantId}
          user={deleteTarget}
          onDeleted={refresh}
          onClose={() => setDeleteTarget(null)}
        />
      )}

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
                        {!CUSTOMER_ROLE_IDS.includes(user.role) && (
                          <option value={user.role} disabled>
                            {userRoleLabel(user.role, sector)} (unknown)
                          </option>
                        )}
                        {CUSTOMER_ROLE_IDS.map((id) => (
                          <option key={id} value={id}>{userRoleLabel(id, sector)}</option>
                        ))}
                      </select>
                    ) : (
                      userRoleLabel(user.role, sector)
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
                    {canDelete && disabled && (
                      <button
                        type="button"
                        className={`${styles.btnRow} ${styles.btnRowDanger}`}
                        onClick={() => setDeleteTarget(user)}
                        disabled={isBusy}
                        title="Permanently delete this user from Verbilo and Cognito"
                      >
                        Delete
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
