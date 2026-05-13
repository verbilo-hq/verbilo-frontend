import { useState } from "react";
import { createPortal } from "react-dom";
import { deleteTenantUser } from "../../services/users.service";
import styles from "./AdminCreateTenantPage.module.css";

// VER-67: confirm-and-delete modal for a disabled user.
//
// Backend rejects delete unless the user is already disabled — but
// we only show this entry point when `user.deletedAt` is set, so the
// 409 path is essentially defensive.
//
// Portaled to document.body for the same reason as AddUserModal
// (VER-65 hotfix): the section can be mounted inside the admin
// portal's outer tenant <form>, and DOM-nested forms cause
// submit-event misrouting.
export const DeleteUserModal = ({ tenantId, user, onDeleted, onClose }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteTenantUser(tenantId, user.id);
      onDeleted?.();
      onClose?.();
    } catch (err) {
      setError(err);
      setDeleting(false);
    }
  };

  const handleBackdropClick = () => {
    if (deleting) return;
    onClose?.();
  };

  const modal = (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-title"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-user-title" className={styles.modalTitle}>
          Delete <strong>{user.username}</strong>?
        </h2>
        <div className={styles.modalBody}>
          <p>
            This permanently removes <code>{user.username}</code> from
            Verbilo and from the Cognito user pool. The audit log entry
            is kept for compliance.
          </p>
          <p>This action cannot be undone.</p>
        </div>

        {error && (
          <p className={styles.submitError} style={{ marginTop: 12 }}>
            {error.code === "CONFLICT"
              ? "Disable the user before deleting."
              : error.code === "FORBIDDEN"
              ? "You don't have permission to delete this user."
              : error.code === "NOT_FOUND"
              ? "User not found (already deleted?)."
              : `Couldn't delete the user (${error.status ?? error.code ?? "error"}).`}
          </p>
        )}

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnDanger}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete user"}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : modal;
};
