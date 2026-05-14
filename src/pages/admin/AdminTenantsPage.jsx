import { useEffect, useState } from "react";
import { listTenants } from "../../services/tenants.service";
import { useTenant } from "../../auth/TenantContext";
import { useCapability } from "../../auth/AuthContext";
import { tenantUrl } from "../../lib/host";
import styles from "./AdminTenantsPage.module.css";

export const AdminTenantsPage = ({ onCreate, onEdit }) => {
  const { environment } = useTenant();
  // VER-61: gate the "New tenant" button on the capability the
  // backend uses. Verbilo Support can list but not create.
  const canCreateTenant = useCapability("tenant.create");
  // Build tenant URLs from the active surface's environment so admin.staging
  // shows e.g. `smileco.staging.verbilo.co.uk` and admin (prod) shows
  // `smileco.verbilo.co.uk`. The backend's `t.url` field is hardcoded prod
  // for legacy reasons — overriding client-side until the backend takes
  // TENANT_BASE_DOMAIN from env (follow-up).
  const isStaging = environment === "staging";
  const baseDomain = isStaging ? "staging.verbilo.co.uk" : "verbilo.co.uk";
  const [tenants, setTenants] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    listTenants()
      .then((data) => {
        if (cancelled) return;
        setTenants(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <header className={styles.toolbar}>
        <h1 className={styles.title}>Tenants</h1>
        {canCreateTenant && (
          <button className={styles.btnPrimary} onClick={onCreate}>
            + New tenant
          </button>
        )}
      </header>

      {status === "loading" && <p className={styles.muted}>Loading tenants…</p>}
      {status === "error" && (
        <p className={styles.error}>
          Couldn't load tenants ({error?.code ?? error?.message}).
        </p>
      )}
      {status === "ready" && tenants.length === 0 && (
        <div className={styles.emptyCard}>
          <h2>No tenants yet</h2>
        </div>
      )}
      {status === "ready" && tenants.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Subdomain</th>
              <th>Sector</th>
              <th>Modules</th>
              <th>Created</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id}>
                <td>
                  <div className={styles.tenantName}>{t.name}</div>
                  {t.archivedAt && <span className={styles.archivedPill}>archived</span>}
                </td>
                <td>
                  <a
                    href={tenantUrl(t.slug, isStaging ? "staging" : "production")}
                    className={styles.subdomainLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.slug}.{baseDomain}
                  </a>
                </td>
                <td>{t.sector}</td>
                <td>
                  {t.enabledModules?.length
                    ? t.enabledModules.join(", ")
                    : <span className={styles.muted}>—</span>}
                </td>
                <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}</td>
                <td>
                  {/* Flex on an inner div, not the <td> itself — applying
                      `display: flex` to the cell breaks table-cell layout
                      and the row's bottom border stops short of this
                      column. */}
                  <div className={styles.rowActions}>
                    {/* VER-62: opens the tenant subdomain in a new tab. On the
                        tenant surface, a banner reminds the operator they're
                        acting as a Verbilo Admin and all actions are audited. */}
                    <a
                      className={styles.btnGhost}
                      href={tenantUrl(t.slug, isStaging ? "staging" : "production")}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open as admin
                    </a>
                    <button className={styles.btnGhost} onClick={() => onEdit(t.id)}>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};
