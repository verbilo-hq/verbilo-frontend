import { useCallback, useEffect, useMemo, useState } from "react";
import { listAuditLogs, KNOWN_AUDIT_ACTIONS } from "../../services/auditLogs.service";
import { useCapability } from "../../auth/AuthContext";
import styles from "./AdminCreateTenantPage.module.css";

// VER-94: read-side view of the audit log. Mounts capability-gated on
// `audit.read`. Same component on both:
//   - tenant-side Settings (TenantSettingsPage) — caller's tenant only
//   - admin portal (AdminTenantSettingsPage) — platform admin can pass
//     a `tenantId` prop to filter cross-tenant
//
// Action vocabulary lives next to the service so it stays in sync with
// what the backend interceptor writes.
export const AdminTenantAuditLogSection = ({ tenantId }) => {
  const canRead = useCapability("audit.read");
  const [items, setItems] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Filters: only the two that earn their pixel cost in a first pass —
  // action dropdown + date-from. Actor / date-to / entity filters can
  // ship as a follow-up when there's a real customer using this.
  const [actionFilter, setActionFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");

  const params = useMemo(() => {
    const p = {};
    if (tenantId) p.tenantId = tenantId;
    if (actionFilter) p.action = actionFilter;
    if (fromFilter) p.from = new Date(fromFilter).toISOString();
    return p;
  }, [tenantId, actionFilter, fromFilter]);

  const refresh = useCallback(() => {
    setStatus("loading");
    setError(null);
    return listAuditLogs(params)
      .then((data) => {
        setItems(data.items);
        setNextCursor(data.nextCursor);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [params]);

  useEffect(() => {
    if (!canRead) return;
    refresh();
  }, [canRead, refresh]);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await listAuditLogs({ ...params, cursor: nextCursor });
      setItems((current) => [...(current ?? []), ...data.items]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!canRead) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionTitle}>Audit log</p>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
        <div className={styles.field} style={{ minWidth: 220 }}>
          <label className={styles.label}>Action</label>
          <select
            className={styles.input}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All actions</option>
            {KNOWN_AUDIT_ACTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>From</label>
          <input
            type="date"
            className={styles.input}
            value={fromFilter}
            onChange={(e) => setFromFilter(e.target.value)}
          />
        </div>
        {(actionFilter || fromFilter) && (
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => { setActionFilter(""); setFromFilter(""); }}
          >
            Clear filters
          </button>
        )}
      </div>

      {status === "loading" && (
        <p className={styles.sectionBody}>Loading audit log…</p>
      )}
      {status === "error" && (
        <p className={styles.submitError}>
          {error?.code === "FORBIDDEN"
            ? "You don't have permission to view the audit log."
            : `Couldn't load audit log (${error?.status ?? error?.code ?? "error"}).`}
        </p>
      )}

      {status === "ready" && items?.length === 0 && (
        <p className={styles.sectionBody}>No audit events match these filters.</p>
      )}

      {status === "ready" && items && items.length > 0 && (
        <>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th aria-label="details" />
              </tr>
            </thead>
            <tbody>
              {items.map((entry) => {
                const expanded = expandedId === entry.id;
                return (
                  <tr key={entry.id}>
                    <td title={entry.createdAt}>{formatRelative(entry.createdAt)}</td>
                    <td>
                      {entry.actor?.displayName ?? entry.actor?.username ?? (
                        <span className={styles.helperMuted}>system</span>
                      )}
                    </td>
                    <td><code style={{ fontSize: 12 }}>{entry.action}</code></td>
                    <td>
                      {entry.entityType}
                      {entry.entityId ? (
                        <span className={styles.helperMuted} style={{ fontSize: 11, marginLeft: 6 }}>
                          {entry.entityId.slice(0, 8)}
                        </span>
                      ) : null}
                      {expanded && (
                        <pre style={{
                          marginTop: 8,
                          padding: 10,
                          background: "var(--surface-low)",
                          borderRadius: 6,
                          fontSize: 11,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}>
                          {JSON.stringify(entry.payload, null, 2)}
                        </pre>
                      )}
                    </td>
                    <td className={styles.actions}>
                      <button
                        type="button"
                        className={styles.btnRow}
                        onClick={() => setExpandedId(expanded ? null : entry.id)}
                      >
                        {expanded ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {nextCursor && (
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

// Time formatting — relative for recent, absolute date for >1 week ago.
// Audit panels are usually scanned for "what happened today / yesterday",
// so a relative format is faster to read in the common case.
function formatRelative(iso) {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
