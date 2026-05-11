import { useEffect, useState } from "react";
import { getTenant, updateTenant } from "../../services/tenants.service";
import { SECTOR_OPTIONS } from "../../lib/sector";
import { useTenant } from "../../auth/TenantContext";
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
  const { environment } = useTenant();
  const baseDomain = environment === "staging" ? "staging.verbilo.co.uk" : "verbilo.co.uk";
  const [tenant, setTenant] = useState(null);
  const [name, setName] = useState("");
  // Initial state — overwritten in the tenant-load effect below. Empty
  // string means "not yet loaded"; once the tenant is fetched the real
  // sector replaces this.
  const [sector, setSector] = useState("");
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
          {tenant?.slug}.{baseDomain} · created {tenant?.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : "—"}
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
        <select
          className={styles.input}
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          {/* Defensive: if the tenant row in the DB stores a sector that
              isn't in the canonical SECTOR_OPTIONS list (e.g. legacy data
              from before VER-47 normalised the enum, or a hand-edited row),
              show that value as a disabled "Unknown" option at the top so
              the operator can see what's currently stored before picking a
              valid replacement. Picking a real option overrides it on
              save. */}
          {sector && !SECTOR_OPTIONS.some((s) => s.id === sector) && (
            <option value={sector} disabled>
              Unknown sector: {sector}
            </option>
          )}
          {SECTOR_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
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
