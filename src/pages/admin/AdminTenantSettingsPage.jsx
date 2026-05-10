import { useEffect, useState } from "react";
import { getTenant, updateTenant } from "../../services/tenants.service";
import styles from "./AdminCreateTenantPage.module.css";

const ALL_MODULES = [
  { id: "dashboard", label: "Dashboard", required: true },
  { id: "manager", label: "Manager Hub" },
  { id: "clinical", label: "Clinical Resources" },
  { id: "staff", label: "Staff Directory" },
  { id: "marketing", label: "Brand Hub" },
  { id: "hr", label: "HR Hub" },
  { id: "training", label: "Training Hub" },
  { id: "cpd", label: "CPD Hub" },
  { id: "cqc", label: "CQC Compliance Hub" },
  { id: "lab", label: "Lab Work Hub" },
  { id: "admin", label: "Admin (in-tenant)" },
];

export const AdminTenantSettingsPage = ({ tenantId, onSaved, onCancel }) => {
  const [tenant, setTenant] = useState(null);
  const [name, setName] = useState("");
  const [sector, setSector] = useState("dental");
  const [modules, setModules] = useState([]);
  const [status, setStatus] = useState("loading");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getTenant(tenantId)
      .then((data) => {
        if (cancelled) return;
        setTenant(data);
        setName(data.name);
        setSector(data.sector);
        setModules(data.enabledModules ?? []);
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
  }, [tenantId]);

  const toggleModule = (id, required) => {
    if (required) return;
    setModules((current) =>
      current.includes(id) ? current.filter((m) => m !== id) : [...current, id],
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updateTenant(tenantId, {
        name: name.trim(),
        sector,
        enabledModules: modules,
      });
      onSaved?.();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") return <p>Loading tenant…</p>;
  if (status === "error") return <p className={styles.error}>Couldn't load tenant ({error?.code}).</p>;

  return (
    <form className={styles.form} onSubmit={handleSave}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tenant settings</h1>
        <p className={styles.subtitle}>
          {tenant?.slug}.verbilo.co.uk · created {tenant?.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : "—"}
        </p>
      </header>

      <div className={styles.field}>
        <label className={styles.label}>Company name</label>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Sector</label>
        <input
          className={styles.input}
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Enabled modules</label>
        <div className={styles.moduleGrid}>
          {ALL_MODULES.map((m) => {
            const checked = modules.includes(m.id);
            return (
              <label key={m.id} className={`${styles.moduleChip} ${checked ? styles.moduleChipOn : ""}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={m.required}
                  onChange={() => toggleModule(m.id, m.required)}
                />
                <span>{m.label}</span>
                {m.required && <span className={styles.requiredTag}>required</span>}
              </label>
            );
          })}
        </div>
      </div>

      {error && (
        <p className={styles.submitError}>
          {error.code === "FORBIDDEN"
            ? "You don't have permission to update tenants."
            : `Couldn't save changes (${error.status ?? error.code ?? "error"}).`}
        </p>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.btnSecondary} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.btnPrimary} disabled={submitting}>
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
};
