import { useEffect, useState } from "react";
import { listTenants } from "../../services/tenants.service";
import styles from "./AdminTenantsPage.module.css";

export const AdminTenantsPage = ({ onCreate, onEdit }) => {
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
        <div>
          <h1 className={styles.title}>Tenants</h1>
          <p className={styles.subtitle}>
            Companies provisioned on Verbilo. Each tenant runs at its own
            subdomain.
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={onCreate}>
          + New tenant
        </button>
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
          <p>
            Create your first tenant to provision a dedicated subdomain on
            <code> verbilo.co.uk</code>.
          </p>
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
                  <a href={t.url} className={styles.subdomainLink} target="_blank" rel="noreferrer">
                    {t.slug}.verbilo.co.uk
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
                  <button className={styles.btnGhost} onClick={() => onEdit(t.id)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};
