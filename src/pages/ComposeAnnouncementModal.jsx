import { useState } from "react";
import { createPortal } from "react-dom";
import { createAnnouncement } from "../services/announcements.service";
import { useTenant } from "../auth/TenantContext";
import styles from "./admin/AdminCreateTenantPage.module.css";

// VER-93: compose an announcement. Used from the dashboard's Group
// section when the signed-in user has `announcements.create`. Backend
// enforces site-scope rules (a practice manager can only target their
// own site; backend 403s if scopeSiteIds escapes their assigned set).
//
// Mounted via createPortal at document.body level — same nested-form
// avoidance pattern as AddUserModal (VER-65).
export const ComposeAnnouncementModal = ({ onCreated, onClose }) => {
  const { site, sites } = useTenant();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scope, setScope] = useState("company");
  const [siteId, setSiteId] = useState(site?.id ?? sites?.[0]?.id ?? "");
  const [pinned, setPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();
  const titleOk = trimmedTitle.length >= 1 && trimmedTitle.length <= 200;
  const bodyOk = trimmedBody.length >= 1 && trimmedBody.length <= 5000;
  const scopeOk = scope === "company" || (scope === "site" && siteId);
  const canSubmit = titleOk && bodyOk && scopeOk && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await createAnnouncement({
        title: trimmedTitle,
        body: trimmedBody,
        visibilityScope: scope,
        scopeSiteIds: scope === "site" ? [siteId] : [],
        pinned,
      });
      onCreated?.();
      onClose?.();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = () => {
    if (submitting) return;
    onClose?.();
  };

  const modal = (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compose-announcement-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 id="compose-announcement-title" className={styles.modalTitle}>
          Compose announcement
        </h2>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="e.g. London Flagship closed Friday afternoon"
          />
          {title && !titleOk && (
            <p className={styles.helper}>Up to 200 characters.</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Body</label>
          <textarea
            className={styles.input}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={5000}
            rows={6}
            placeholder="What do staff need to know? Markdown isn't rendered — keep it plain text."
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
          <p className={styles.helperMuted ?? styles.sectionBody} style={{ fontSize: 12 }}>
            {trimmedBody.length}/5000
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Audience</label>
          <select
            className={styles.input}
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value="company">Everyone in the company</option>
            <option value="site">A specific site</option>
          </select>
        </div>

        {scope === "site" && (
          <div className={styles.field}>
            <label className={styles.label}>Site</label>
            <select
              className={styles.input}
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
            >
              {(sites ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
              {(!sites || sites.length === 0) && (
                <option value="" disabled>No sites available</option>
              )}
            </select>
          </div>
        )}

        <div className={styles.field}>
          <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
            />
            <span>Pin to top of dashboard</span>
          </label>
        </div>

        {error && (
          <p className={styles.submitError}>
            {error.code === "FORBIDDEN"
              ? "You don't have permission to post to that audience."
              : `Couldn't post announcement (${error.status ?? error.code ?? "error"}).`}
          </p>
        )}

        <div className={styles.actions} style={{ marginTop: 16 }}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {submitting ? "Posting…" : "Post announcement"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
