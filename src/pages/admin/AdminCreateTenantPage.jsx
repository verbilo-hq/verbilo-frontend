import { useEffect, useMemo, useState } from "react";
import { isValidSlug, isReservedSubdomain } from "../../lib/host";
import { SECTOR_OPTIONS } from "../../lib/sector";
import { checkTenantSlug, createTenant } from "../../services/tenants.service";
import { useTenant } from "../../auth/TenantContext";
import styles from "./AdminCreateTenantPage.module.css";

// VER-47: sector ids must match the backend enum
// (`CreateTenantDto.sector` @IsIn list in verbilo-backend). Canonical list
// is `SECTOR_OPTIONS` in `src/lib/sector.js` — imported here and reused by
// AdminTenantSettingsPage so the same dropdown shows on both flows
// (VER-49). Previous ids "optician" / "veterinary" / "physiotherapy" were
// rejected by the API; keep this comment as the historical note.

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

const SECTOR_DEFAULT_MODULES = {
  dental:     ["dashboard", "clinical", "staff", "hr", "training", "cpd", "cqc", "lab"],
  optometry:  ["dashboard", "clinical", "staff", "hr", "training"],
  vets:       ["dashboard", "clinical", "staff", "hr", "training"],
  physio:     ["dashboard", "clinical", "staff", "hr", "training", "cpd"],
  gp:         ["dashboard", "clinical", "staff", "hr", "training", "cqc"],
  other:      ["dashboard", "staff", "hr"],
  healthcare: ["dashboard", "staff", "hr"],
};

function autoSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

export const AdminCreateTenantPage = ({ onCreated, onCancel }) => {
  const { environment } = useTenant();
  const baseDomain = environment === "staging" ? "staging.verbilo.co.uk" : "verbilo.co.uk";
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  // No sector default — force the operator to pick a sector explicitly so we
  // don't bias a vet group into the dental module set.
  const [sector, setSector] = useState("");
  const [modules, setModules] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [slugStatus, setSlugStatus] = useState({ state: "idle" });

  // Keep slug auto-derived from name until the user explicitly edits it.
  useEffect(() => {
    if (!slugTouched) setSlug(autoSlug(name));
  }, [name, slugTouched]);

  // When sector changes, reset modules to the sector default.
  useEffect(() => {
    setModules(SECTOR_DEFAULT_MODULES[sector] ?? ["dashboard"]);
  }, [sector]);

  // Debounced slug availability check.
  useEffect(() => {
    if (!slug) {
      setSlugStatus({ state: "idle" });
      return undefined;
    }
    if (!isValidSlug(slug)) {
      setSlugStatus({ state: "invalid" });
      return undefined;
    }
    if (isReservedSubdomain(slug)) {
      setSlugStatus({ state: "reserved" });
      return undefined;
    }
    setSlugStatus({ state: "checking" });
    const handle = setTimeout(() => {
      checkTenantSlug(slug)
        .then((result) => {
          if (result?.available) setSlugStatus({ state: "available" });
          else setSlugStatus({ state: result?.reason ?? "unavailable" });
        })
        .catch(() => setSlugStatus({ state: "error" }));
    }, 350);
    return () => clearTimeout(handle);
  }, [slug]);

  const slugMessage = useMemo(() => {
    switch (slugStatus.state) {
      case "checking": return { tone: "muted", text: "Checking availability…" };
      case "available": return { tone: "success", text: "Available" };
      case "invalid":   return { tone: "error", text: "Slug must be 3–32 chars, lowercase letters/numbers/hyphens." };
      case "reserved":  return { tone: "error", text: "That subdomain is reserved." };
      case "taken":     return { tone: "error", text: "That subdomain is already taken." };
      case "unavailable": return { tone: "error", text: "Not available." };
      case "error":     return { tone: "error", text: "Couldn't check availability." };
      default:          return null;
    }
  }, [slugStatus]);

  const canSubmit =
    !submitting &&
    name.trim().length > 0 &&
    isValidSlug(slug) &&
    !isReservedSubdomain(slug) &&
    slugStatus.state === "available" &&
    sector !== "" &&
    modules.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createTenant({
        name: name.trim(),
        slug,
        sector,
        enabledModules: modules,
      });
      onCreated?.();
    } catch (err) {
      setSubmitError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleModule = (id, required) => {
    if (required) return;
    setModules((current) =>
      current.includes(id) ? current.filter((m) => m !== id) : [...current, id],
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <header className={styles.header}>
        <h1 className={styles.title}>New tenant</h1>
        <p className={styles.subtitle}>
          Provision a new company on Verbilo. The slug becomes their subdomain
          and cannot be changed later.
        </p>
      </header>

      <div className={styles.field}>
        <label className={styles.label}>Company name</label>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. SmileCo Dental Group, Riverside Vets, BrightSight Opticians"
          autoFocus
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Subdomain</label>
        <div className={styles.slugRow}>
          <input
            className={styles.slugInput}
            value={slug}
            onChange={(e) => {
              setSlug(autoSlug(e.target.value));
              setSlugTouched(true);
            }}
            placeholder="companyx"
          />
          <span className={styles.slugSuffix}>.{baseDomain}</span>
        </div>
        {slugMessage && (
          <p className={`${styles.helper} ${styles[slugMessage.tone]}`}>
            {slugMessage.text}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Sector</label>
        <select
          className={styles.input}
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          {/* Explicit placeholder so the select doesn't visually show
              the first option (Dental) when state is still empty. Without
              this the UI lied about what was selected — the operator
              thought they were picking Dental defaults, but the empty
              sector state meant no defaults got applied to `modules`.
              Form is now blocked from submitting until a sector is picked. */}
          <option value="">Select a sector…</option>
          {SECTOR_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <p className={styles.helperMuted}>
          Sector picks a default set of modules. You can fine-tune below.
        </p>
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

      {submitError && (
        <p className={styles.submitError}>
          {submitError.code === "CONFLICT"
            ? "That subdomain is already taken."
            : submitError.code === "FORBIDDEN"
            ? "You don't have permission to create tenants."
            : `Couldn't create tenant (${submitError.status ?? submitError.code ?? "error"}).`}
        </p>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.btnSecondary} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.btnPrimary} disabled={!canSubmit}>
          {submitting ? "Creating…" : "Create tenant"}
        </button>
      </div>
    </form>
  );
};
