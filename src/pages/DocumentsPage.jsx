import { useCallback, useEffect, useState } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { Pill } from "../components/ui/Pill";
import { useCapability } from "../auth/AuthContext";
import {
  listDocuments, getDownloadUrl, softDeleteDocument,
  formatFileSize, fileTypeLabel,
} from "../services/documents.service";
import { UploadDocumentModal } from "./UploadDocumentModal";
import styles from "./DocumentsPage.module.css";

// VER-92: Documents hub. Lists docs visible to the caller (backend
// applies the scope filter — site-scoped users see their site +
// company-wide; tenant-wide roles see everything). Per-row Download
// and (capability-gated) Delete.
//
// Phase 1: simple flat list grouped by category. Upload via modal.
// Categories / area-scope / preview-inline / multi-version are
// deferred to a separate ticket.
export const DocumentsPage = () => {
  const canUpload = useCapability("documents.upload");
  const canDelete = useCapability("documents.delete");

  const [items, setItems] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [busyRow, setBusyRow] = useState(null);

  const refresh = useCallback(() => {
    setStatus("loading");
    setError(null);
    return listDocuments()
      .then((r) => {
        setItems(r.items ?? []);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleDownload = async (id) => {
    setBusyRow(id);
    try {
      const { url } = await getDownloadUrl(id);
      if (url) window.location.href = url;
    } catch (err) {
      setError(err);
    } finally {
      setBusyRow(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document? Staff will lose access immediately.")) return;
    setBusyRow(id);
    try {
      await softDeleteDocument(id);
      await refresh();
    } catch (err) {
      setError(err);
    } finally {
      setBusyRow(null);
    }
  };

  return (
    <section>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Documents</h1>
          <p className={styles.subtitle}>
            Policies, protocols, handbooks and compliance forms — scoped to your site or shared with the whole company.
          </p>
        </div>
        {canUpload && (
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setUploadOpen(true)}
          >
            <I name="upload" size={14} /> Upload document
          </button>
        )}
      </header>

      {status === "loading" && <p className={styles.muted}>Loading documents…</p>}

      {status === "error" && (
        <Card hover={false} className={styles.errorCard}>
          <p className={styles.error}>
            Couldn't load documents ({error?.status ?? error?.code ?? "error"}).
          </p>
        </Card>
      )}

      {status === "ready" && items?.length === 0 && (
        <Card hover={false} className={styles.emptyCard}>
          <I name="folder" size={28} color="var(--on-surface-variant)" />
          <h2>No documents yet</h2>
          <p className={styles.muted}>
            {canUpload
              ? "Upload your first policy or handbook to get started."
              : "Your practice manager will share documents here as they're added."}
          </p>
          {canUpload && (
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setUploadOpen(true)}
              style={{ marginTop: 12 }}
            >
              <I name="upload" size={14} /> Upload document
            </button>
          )}
        </Card>
      )}

      {status === "ready" && items && items.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Scope</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((d) => {
              const isBusy = busyRow === d.id;
              return (
                <tr key={d.id}>
                  <td>
                    <div className={styles.titleCell}>{d.title}</div>
                    <div className={styles.fileNameCell}>{d.fileName}</div>
                  </td>
                  <td>{d.category}</td>
                  <td>
                    <Pill bg="rgba(0,0,0,0.06)" color="var(--on-surface-variant)" small>
                      {d.visibilityScope === "company" ? "Company-wide" : "Site"}
                    </Pill>
                  </td>
                  <td className={styles.muted}>{fileTypeLabel(d.mimeType)}</td>
                  <td className={styles.muted}>{formatFileSize(d.byteSize)}</td>
                  <td className={styles.muted}>
                    {d.createdAt
                      ? new Date(d.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                    {d.uploader?.displayName && (
                      <div style={{ fontSize: 11 }}>by {d.uploader.displayName}</div>
                    )}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={() => handleDownload(d.id)}
                        disabled={isBusy}
                      >
                        Download
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          className={`${styles.btnGhost} ${styles.btnDanger}`}
                          onClick={() => handleDelete(d.id)}
                          disabled={isBusy}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {uploadOpen && (
        <UploadDocumentModal
          onUploaded={refresh}
          onClose={() => setUploadOpen(false)}
        />
      )}
    </section>
  );
};
