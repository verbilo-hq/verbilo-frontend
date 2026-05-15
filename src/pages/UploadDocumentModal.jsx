import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { uploadDocument } from "../services/documents.service";
import { useTenant } from "../auth/TenantContext";
import styles from "./admin/AdminCreateTenantPage.module.css";

// VER-92: pick a file + metadata + scope + upload via the backend
// (multipart). Backend enforces MIME allowlist + 50 MB cap + scope
// rules; this modal mirrors them client-side for fast feedback.
//
// Capability-gated by the parent (DocumentsPage shows the launcher
// only when the caller has `documents.upload`).
const ACCEPT_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];
const ACCEPT_ATTR = ACCEPT_MIME.join(",");
const MAX_BYTES = 50 * 1024 * 1024;

const CATEGORY_SUGGESTIONS = [
  "HR policy",
  "Clinical protocol",
  "Compliance",
  "Operations",
  "Handbook",
  "Training",
];

export const UploadDocumentModal = ({ onUploaded, onClose }) => {
  const { site, sites } = useTenant();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORY_SUGGESTIONS[0]);
  const [scope, setScope] = useState("company");
  const [siteId, setSiteId] = useState(site?.id ?? sites?.[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fileOk = file && file.size <= MAX_BYTES && ACCEPT_MIME.includes(file.type);
  const titleOk = title.trim().length >= 1 && title.trim().length <= 200;
  const scopeOk = scope === "company" || (scope === "site" && siteId);
  const canSubmit = fileOk && titleOk && scopeOk && !submitting;

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setError(null);
    if (picked.size > MAX_BYTES) {
      setError({ message: `File is too large. Max 50 MB (this one is ${(picked.size / 1024 / 1024).toFixed(1)} MB).` });
      setFile(null);
      return;
    }
    if (picked.type && !ACCEPT_MIME.includes(picked.type)) {
      setError({ message: `Unsupported file type (${picked.type}). Allowed: PDF, Word, Excel, PNG/JPG/WebP/SVG.` });
      setFile(null);
      return;
    }
    setFile(picked);
    if (!title.trim()) {
      // Pre-fill title from filename minus extension for convenience
      const dot = picked.name.lastIndexOf(".");
      setTitle(dot > 0 ? picked.name.slice(0, dot) : picked.name);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await uploadDocument({
        file,
        title: title.trim(),
        category,
        visibilityScope: scope,
        scopeSiteIds: scope === "site" ? [siteId] : [],
      });
      onUploaded?.();
      onClose?.();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const modal = (
    <div
      className={styles.modalBackdrop}
      onClick={() => !submitting && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-doc-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 id="upload-doc-title" className={styles.modalTitle}>Upload document</h2>

        <div className={styles.field}>
          <label className={styles.label}>File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_ATTR}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {file ? (
            <div style={{
              display: "flex", gap: 12, alignItems: "center",
              padding: 10, border: "1px solid var(--outline, rgba(0,0,0,0.16))",
              borderRadius: 8, background: "var(--surface, white)",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {file.name}
                </div>
                <div className={styles.helperMuted} style={{ fontSize: 12 }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "unknown type"}
                </div>
              </div>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                disabled={submitting}
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => fileInputRef.current?.click()}
              style={{ alignSelf: "flex-start" }}
            >
              Pick a file
            </button>
          )}
          <p className={styles.helperMuted} style={{ fontSize: 12, marginTop: 6 }}>
            PDF, Word, Excel, or image. 50 MB max.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="e.g. Infection control SOP"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Category</label>
          <input
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="category-suggestions"
            placeholder="Pick or type a category"
          />
          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
          </datalist>
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

        {error && (
          <p className={styles.submitError}>
            {error.message ?? `Upload failed (${error.status ?? error.code ?? "error"}).`}
          </p>
        )}

        <div className={styles.actions} style={{ marginTop: 16 }}>
          <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="button" className={styles.btnPrimary} onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
