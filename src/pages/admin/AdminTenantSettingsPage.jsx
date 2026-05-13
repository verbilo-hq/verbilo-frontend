import { useEffect, useState } from "react";
import {
  deleteTenant,
  getTenant,
  updateTenant,
} from "../../services/tenants.service";
import { SECTOR_OPTIONS } from "../../lib/sector";
import { useTenant } from "../../auth/TenantContext";
import { useAuth, useCapability } from "../../auth/AuthContext";
import { AdminTenantUsersSection } from "./AdminTenantUsersSection";
import { AdminTenantBrandingSection } from "./AdminTenantBrandingSection";
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
  // VER-53/61: write controls in the Users section gate on the
  // `users.update_role` capability (verbilo_support is read-only). Was
  // a role-string check; now capability-driven so future role changes
  // don't need to touch this comparison.
  const canEditUsers = useCapability("users.update_role");
  // VER-61: branding section + Danger zone delete also gate on
  // capabilities. Backend always enforces; these just hide the UI
  // for operators who can't use it.
  const canEditBranding = useCapability("tenant.update_branding");
  const canDeleteTenant = useCapability("tenant.delete");
  const canUpdateTenant = useCapability("tenant.update");
  // VER-70: sector drives enabledModules + UI copy. Only verbilo_super_admin
  // can change it after creation (verbilo_support sees the dropdown read-only
  // even though they otherwise have tenant.update). Backend 403s if anyone
  // else PATCHes with a different sector value.
  const canEditSector = useCapability("tenant.update_sector");
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

  // VER-50 — delete-tenant confirmation flow.
  //   `deleteOpen` toggles the modal (first click).
  //   `slugConfirm` is what the operator has typed; the destructive button is
  //   disabled until it exactly matches the tenant's real slug.
  //   `deleting` is the in-flight flag; `deleteError` shows API errors inline.
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [slugConfirm, setSlugConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const openDeleteModal = () => {
    setSlugConfirm("");
    setDeleteError(null);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return; // don't let the user dismiss mid-request
    setDeleteOpen(false);
  };

  const handleDelete = async () => {
    if (slugConfirm !== tenant?.slug) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTenant(tenantId);
      // Same callback the save flow uses — caller navigates back to the
      // tenant list and refreshes.
      onSaved?.();
    } catch (err) {
      setDeleteError(err);
      setDeleting(false);
    }
  };

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
      // VER-70: only include `sector` in the payload when the operator
      // can actually change it. Backend's no-op echo rule means sending
      // the unchanged value would still pass, but skipping it keeps the
      // wire payload honest (and avoids a stray 403 if the page state
      // ever drifts from the DB).
      const payload = {
        name: name.trim(),
        enabledModules: modules,
      };
      if (canEditSector) {
        payload.sector = sector;
      }
      await updateTenant(tenantId, payload);
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
  <>
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
          disabled={!canEditSector}
          aria-describedby={!canEditSector ? "sector-locked-hint" : undefined}
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
        {/* VER-70: hint shown when the dropdown is locked. Sector drives
            enabledModules + customer-facing copy, so we keep it editable
            only by Verbilo platform admins. */}
        {!canEditSector && (
          <p id="sector-locked-hint" className={styles.hint}>
            Sector can only be changed by Verbilo platform admins.
          </p>
        )}
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
        {canUpdateTenant && (
          <button type="submit" className={styles.btnPrimary} disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </button>
        )}
      </div>

      {/* VER-59 / VER-61: branding panel only shown to operators with
          the tenant.update_branding capability. Backend 403s either way. */}
      {tenant && canEditBranding && (
        <AdminTenantBrandingSection
          tenant={tenant}
          onSaved={() => {
            getTenant(tenantId).then((next) => setTenant(next)).catch(() => {});
          }}
        />
      )}

      {/* VER-53: customer users of this tenant — drill-down view for
          platform admins. Lives between Save and the Danger zone so
          destructive actions still sit at the bottom of the page. */}
      <AdminTenantUsersSection
        tenantId={tenantId}
        canEdit={canEditUsers}
        sector={tenant?.sector}
      />

      {/* VER-50 / VER-61: Danger Zone — separated from the regular
          form so a destructive action can't happen on a stray click.
          Only rendered for operators with tenant.delete capability;
          backend 403s direct API calls regardless. */}
      {canDeleteTenant && (
        <section className={styles.dangerZone}>
          <p className={styles.dangerZoneTitle}>Danger zone</p>
          <p className={styles.dangerZoneBody}>
            Deleting this tenant permanently removes all of its sites, users,
            patients, appointments, and staff records. The Vercel domain (on
            production) is removed too. This action cannot be undone.
          </p>
          <button
            type="button"
            className={styles.btnDanger}
            onClick={openDeleteModal}
          >
            Delete tenant…
          </button>
        </section>
      )}
    </form>

    {/* VER-50 confirmation modal — rendered outside the form so submitting
        the form (Save changes) can't accidentally trigger it. */}
    {deleteOpen && tenant && (
      <div
        className={styles.modalBackdrop}
        onClick={closeDeleteModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-tenant-title"
      >
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id="delete-tenant-title" className={styles.modalTitle}>
            Delete <strong>{tenant.name}</strong>?
          </h2>
          <div className={styles.modalBody}>
            <p>
              This will permanently delete the tenant and everything tied to
              it:
            </p>
            <ul>
              <li>Sites</li>
              <li>Users (their Cognito accounts remain, but they lose access)</li>
              <li>Patients, appointments, staff records</li>
              <li>The <code>{tenant.slug}.{baseDomain}</code> Vercel domain (production only)</li>
            </ul>
            <p>
              Audit-log entries are preserved for compliance. To confirm, type
              the tenant slug <code>{tenant.slug}</code> below:
            </p>
          </div>
          <input
            className={styles.input}
            value={slugConfirm}
            onChange={(e) => setSlugConfirm(e.target.value)}
            placeholder={tenant.slug}
            autoFocus
            disabled={deleting}
          />
          {deleteError && (
            <p className={styles.submitError} style={{ marginTop: 12 }}>
              {deleteError.code === "FORBIDDEN"
                ? "You don't have permission to delete tenants."
                : deleteError.code === "NOT_FOUND"
                ? "Tenant not found (already deleted?)."
                : `Couldn't delete tenant (${deleteError.status ?? deleteError.code ?? "error"}).`}
            </p>
          )}
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={closeDeleteModal}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.btnDanger}
              onClick={handleDelete}
              disabled={deleting || slugConfirm !== tenant.slug}
            >
              {deleting ? "Deleting…" : "Delete tenant"}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};
