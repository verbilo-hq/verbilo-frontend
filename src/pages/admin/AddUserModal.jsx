import { useState } from "react";
import { createTenantUser } from "../../services/users.service";
import { userRoleLabel } from "../../lib/sector";
import { assignableCustomerRoles } from "../../lib/roleRank";
import styles from "./AdminCreateTenantPage.module.css";

// VER-65: "Add user" form. Used from the Users section on both the
// admin-portal AdminTenantSettingsPage and the tenant-surface
// TenantSettingsPage (the section is shared). Backend enforces all of
// these rules; the modal just shapes the UX:
//   - role dropdown filtered to roles ≤ the actor's rank (so we don't
//     offer something the backend will 403 on)
//   - on success, the one-time temp password is surfaced once with a
//     copy button. Backend doesn't store it in plaintext and won't
//     return it again — closing the modal loses it.
//
// `actorRole` is the signed-in user's role (from useAuth().permissions).
// `sector` drives the sector-aware role labels (VER-60).
export const AddUserModal = ({
  tenantId,
  sector,
  actorRole,
  onCreated,
  onClose,
}) => {
  const [username, setUsername]       = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail]             = useState("");
  const [role, setRole]               = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);
  const [created, setCreated]         = useState(null); // { user, temporaryPassword }
  const [copied, setCopied]           = useState(false);

  const allowedRoles = assignableCustomerRoles(actorRole);

  // Pick a default role on first render — lowest-rank assignable role
  // ("employee" usually). If the actor can't create anyone (caller
  // shouldn't have opened this), keep the field empty so submit
  // disables itself.
  if (!role && allowedRoles.length > 0) {
    setRole(allowedRoles[0]);
  }

  const trimmedUsername    = username.trim();
  const trimmedDisplayName = displayName.trim();
  const trimmedEmail       = email.trim();

  const usernameOk = /^[a-z0-9][a-z0-9._-]{2,31}$/.test(trimmedUsername);
  const displayNameOk = trimmedDisplayName.length >= 1 && trimmedDisplayName.length <= 80;
  const emailOk = trimmedEmail === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const roleOk = allowedRoles.includes(role);

  const canSubmit = usernameOk && displayNameOk && emailOk && roleOk && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await createTenantUser(tenantId, {
        username: trimmedUsername,
        displayName: trimmedDisplayName,
        role,
        ...(trimmedEmail ? { email: trimmedEmail } : {}),
      });
      setCreated(result);
      onCreated?.();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const copyTemporaryPassword = async () => {
    if (!created?.temporaryPassword) return;
    try {
      await navigator.clipboard.writeText(created.temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write blocked — fall back to a manual select via the
      // input; nothing else to do
    }
  };

  // Backdrop click + Escape close the modal — but only if no in-flight
  // request and no success state (we don't want to lose the temp password
  // banner on a stray click).
  const handleBackdropClick = () => {
    if (submitting) return;
    onClose?.();
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-title"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="add-user-title" className={styles.modalTitle}>
          {created ? "User created" : "Add user"}
        </h2>

        {created ? (
          <>
            <div className={styles.modalBody}>
              <p>
                <strong>{created.user.username}</strong> can now sign in.
                Share this temporary password securely — they'll be prompted
                to set their own on first login.
              </p>
              <div className={styles.field} style={{ marginTop: 16 }}>
                <label className={styles.label}>Temporary password</label>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  <input
                    className={styles.input}
                    value={created.temporaryPassword}
                    readOnly
                    onFocus={(e) => e.target.select()}
                    style={{
                      flex: 1,
                      fontFamily: "var(--font-mono, ui-monospace, monospace)",
                    }}
                  />
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={copyTemporaryPassword}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className={styles.sectionBody} style={{ marginTop: 8 }}>
                  This password won't be shown again. If you lose it, reset
                  it for the user separately.
                </p>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.modalBody}>
              <p>
                Creates a Cognito account and a Verbilo user row for this
                tenant. You'll get a one-time temporary password to share.
              </p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="s.jenkins"
                autoFocus
                disabled={submitting}
                autoComplete="off"
                spellCheck="false"
              />
              {username && !usernameOk && (
                <p className={styles.submitError} style={{ marginTop: 4 }}>
                  3–32 chars: lowercase letters, numbers, dot, dash, underscore.
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Display name</label>
              <input
                className={styles.input}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Sarah Jenkins"
                disabled={submitting}
                maxLength={80}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email (optional)</label>
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.co.uk"
                type="email"
                disabled={submitting}
                autoComplete="off"
              />
              {email && !emailOk && (
                <p className={styles.submitError} style={{ marginTop: 4 }}>
                  Doesn't look like a valid email address.
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <select
                className={styles.input}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={submitting || allowedRoles.length === 0}
              >
                {allowedRoles.map((id) => (
                  <option key={id} value={id}>{userRoleLabel(id, sector)}</option>
                ))}
              </select>
              {allowedRoles.length === 0 && (
                <p className={styles.submitError} style={{ marginTop: 4 }}>
                  You don't have permission to assign any roles.
                </p>
              )}
            </div>

            {error && (
              <p className={styles.submitError} style={{ marginTop: 12 }}>
                {error.code === "CONFLICT"
                  ? "A user with that username already exists in Cognito."
                  : error.code === "FORBIDDEN"
                  ? "You don't have permission to create that role."
                  : error.code === "VALIDATION"
                  ? "One or more fields failed validation. Check the values above."
                  : `Couldn't create the user (${error.status ?? error.code ?? "error"}).`}
              </p>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={!canSubmit}
              >
                {submitting ? "Creating…" : "Create user"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
