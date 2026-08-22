/**
 * Safeguarding Governance Credentials Register — Step 5 v2.
 *
 * Replaces the physical-asset register with three staff-compliance trackers
 * required for CQC + Working Together To Safeguard Children evidence:
 *
 *   • DSL Level 3 credentials       — one row per designated lead
 *   • Team L1/L2 training summary   — site-wide rollup (one row per site)
 *   • DBS records                   — one row per staff member
 *
 * Page heading is "Training & Credentials Register" (not "Equipment Register").
 * Each section reuses the Decon CSS module for visual consistency — site rail
 * + soft-elevated card grid + dashed Add placeholder pattern.
 */

import { useEffect, useMemo, useState } from "react";
import { I } from "../../components/Icon";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import {
  SAFEGUARDING_CRED_META, SAFEGUARDING_FIELD_SCHEMA,
} from "../../services/governance/safeguardingCredentials";
import {
  listForSite, createEquipment, updateEquipment, removeEquipment,
} from "../../services/governance/equipment.service";
import { formatDate } from "./Shared";
import styles from "./EquipmentRegisterDecon.module.css";

const SAFEGUARDING_PACK_KEY = "safeguarding_governance";

const EmptyAppliedSitesNotice = ({ title, lead }) => (
  <div className={styles.wrap}>
    <h3 className={styles.stepTitle}>{title}</h3>
    <div className={styles.hint}>
      <I name="info" size={13} color="var(--primary)" />
      <span>{lead}</span>
    </div>
  </div>
);

export function CredentialsRegisterSafeguardingStep({ user, sites, allUsers, appliedProfiles, onChange }) {
  const [activeSiteId, setActiveSiteId] = useState(appliedProfiles[0]?.siteId ?? null);
  const [modal, setModal] = useState(null); // { categoryKey, asset? }

  useEffect(() => {
    if (!appliedProfiles.some((p) => p.siteId === activeSiteId)) {
      setActiveSiteId(appliedProfiles[0]?.siteId ?? null);
    }
  }, [appliedProfiles, activeSiteId]);

  if (appliedProfiles.length === 0) {
    return (
      <EmptyAppliedSitesNotice
        title="Training & Credentials Register"
        lead="Go back to Sites in scope first — credentials are recorded per site."
      />
    );
  }

  const activeProfile = appliedProfiles.find((p) => p.siteId === activeSiteId);
  const activeSite = sites.find((s) => s.id === activeSiteId);
  const allRecords = activeProfile
    ? listForSite(user.tenantId, activeSite.id, SAFEGUARDING_PACK_KEY)
    : [];

  // Bucket by category via the type discriminator.
  const byCategory = useMemo(() => {
    const buckets = {};
    for (const m of SAFEGUARDING_CRED_META) buckets[m.key] = [];
    for (const a of allRecords) {
      const m = SAFEGUARDING_CRED_META.find((x) => x.equipmentType === a.type);
      if (m) buckets[m.key].push(a);
    }
    return buckets;
  }, [allRecords]);

  const openAdd  = (categoryKey)        => setModal({ categoryKey });
  const openEdit = (asset, categoryKey) => setModal({ categoryKey, asset });
  const closeModal = ()                 => setModal(null);

  const handleSave = (data) => {
    const meta = SAFEGUARDING_CRED_META.find((m) => m.key === modal.categoryKey);
    const payload = {
      type:         meta.equipmentType,
      // Best-effort title for the indexable column — useful in the audit log.
      makeModel:    titleForRecord(meta.key, data, allUsers),
      serialNumber: data.certificateNumber ?? data.dbsCertificateNumber ?? null,
      roomLocation: null,
      data,
    };
    if (modal.asset) {
      updateEquipment(user, modal.asset.id, payload);
    } else {
      createEquipment(user, activeSiteId, payload, SAFEGUARDING_PACK_KEY);
    }
    closeModal();
    onChange();
  };

  const handleDelete = (asset) => {
    const meta = SAFEGUARDING_CRED_META.find((m) => m.equipmentType === asset.type);
    if (!confirm(`Remove this ${meta?.titleShort?.toLowerCase() ?? "record"}?`)) return;
    removeEquipment(user, asset.id);
    closeModal();
    onChange();
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.stepTitle}>Training &amp; Credentials Register</h3>
      <p className={styles.stepLead}>
        Safeguarding doesn't track machinery — it tracks people. Capture the DSL's Level 3
        certification, the wider team's L1/L2 coverage, and per-staff DBS evidence per site.
      </p>

      <div className={styles.layout}>
        <aside className={styles.rail}>
          <div className={styles.railLabel}>Applied sites</div>
          <div className={styles.railList}>
            {appliedProfiles.map((p) => {
              const site = sites.find((s) => s.id === p.siteId);
              const total = listForSite(user.tenantId, p.siteId, SAFEGUARDING_PACK_KEY)
                .filter((a) => SAFEGUARDING_CRED_META.some((m) => m.equipmentType === a.type))
                .length;
              const isActive = activeSiteId === p.siteId;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={isActive ? `${styles.railRow} ${styles.railRowActive}` : styles.railRow}
                  onClick={() => setActiveSiteId(p.siteId)}
                >
                  <span className={styles.railName}>{site?.name ?? "Unknown"}</span>
                  <span className={styles.railCount}>{total}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className={styles.pane}>
          {activeProfile && (
            <>
              <div className={styles.siteHeader}>
                <div className={styles.siteHeaderName}>{activeSite?.name}</div>
                <div className={styles.siteHeaderLoc}>{activeSite?.location}</div>
              </div>

              {SAFEGUARDING_CRED_META.map((meta) => (
                <CategorySection
                  key={meta.key}
                  meta={meta}
                  records={byCategory[meta.key]}
                  allUsers={allUsers}
                  onAdd={() => openAdd(meta.key)}
                  onEdit={(a) => openEdit(a, meta.key)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {modal && (
        <RecordModal
          categoryKey={modal.categoryKey}
          asset={modal.asset}
          site={activeSite}
          allUsers={allUsers}
          onSave={handleSave}
          onDelete={modal.asset ? () => handleDelete(modal.asset) : null}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

/* ── Section: per-category header + card grid + dashed Add placeholder ── */

function CategorySection({ meta, records, allUsers, onAdd, onEdit }) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHead}>
        <span className={styles.sectionIcon} style={{ background: `color-mix(in srgb, ${meta.accent} 12%, transparent)` }}>
          <I name={meta.icon} size={14} color={meta.accent} />
        </span>
        <div className={styles.sectionTitleWrap}>
          <div className={styles.sectionTitle}>{meta.title}</div>
          <div className={styles.sectionSubtitle}>{meta.subtitle}</div>
        </div>
        <span className={styles.sectionCount}>{records.length} recorded</span>
      </header>

      <div className={styles.grid}>
        {records.map((a) => (
          <RecordCard key={a.id} asset={a} meta={meta} allUsers={allUsers} onEdit={() => onEdit(a)} />
        ))}
        <button type="button" onClick={onAdd}
          className={styles.addCard}
          style={{ "--addAccent": meta.accent }}
        >
          <I name="plus" size={16} color="var(--on-surface-variant)" />
          <span>{meta.addButtonLabel}</span>
        </button>
      </div>
    </section>
  );
}

function RecordCard({ asset, meta, allUsers, onEdit }) {
  const summary = summariseRecord(asset, meta, allUsers);
  return (
    <button type="button" onClick={onEdit} className={styles.card} style={{ "--cardAccent": meta.accent }}>
      <div className={styles.cardTop}>
        <div className={styles.cardMain}>
          {summary.identifier && <div className={styles.cardIdentifier}>{summary.identifier}</div>}
          <div className={styles.cardTitle}>{summary.title}</div>
          {summary.subtitle && <div className={styles.cardSubtitle}>{summary.subtitle}</div>}
        </div>
        <span className={styles.cardStatusDot} style={{ background: meta.accent }} title={asset.status} />
      </div>
      {summary.dueLine && (
        <div className={styles.cardMeta}>
          <I name="calendar" size={11} color="var(--on-surface-variant)" />
          <span>{summary.dueLine}</span>
        </div>
      )}
    </button>
  );
}

function summariseRecord(asset, meta, allUsers) {
  const d = asset.data ?? {};
  switch (meta.key) {
    case "dsl_level3": {
      const lead = allUsers.find((u) => u.id === d.leadUserId);
      return {
        identifier: d.certificateNumber ? `Cert ${d.certificateNumber}` : null,
        title:      lead?.displayName ?? "Unassigned lead",
        subtitle:   d.trainingBody ?? null,
        dueLine:    d.expiryDate ? `Renews ${formatDate(d.expiryDate)}` : "Renewal date not set",
      };
    }
    case "team_matrix": {
      const total = d.totalActiveStaff ?? 0;
      const valid = d.staffWithValidL1L2 ?? 0;
      const pct   = total > 0 ? Math.round((valid / total) * 100) : 0;
      const flags = [
        d.nonClinicalAtL1 && "Non-clinical L1 ✓",
        d.clinicalAtL2    && "Clinical L2 ✓",
      ].filter(Boolean).join(" · ");
      return {
        identifier: null,
        title:      `${valid} / ${total} staff trained (${pct}%)`,
        subtitle:   flags || "No 100% attestations recorded",
        dueLine:    null,
      };
    }
    case "dbs": {
      const staff = allUsers.find((u) => u.id === d.staffUserId);
      return {
        identifier: d.dbsCertificateNumber ? `DBS ${d.dbsCertificateNumber}` : null,
        title:      staff?.displayName ?? "Unassigned staff",
        subtitle:   d.updateServiceRegistered ? "Update Service ✓" : "Not on Update Service",
        dueLine:    d.dbsIssueDate ? `Issued ${formatDate(d.dbsIssueDate)}` : null,
      };
    }
    default:
      return { identifier: null, title: "Record", subtitle: null, dueLine: null };
  }
}

function titleForRecord(categoryKey, data, allUsers) {
  switch (categoryKey) {
    case "dsl_level3": return allUsers.find((u) => u.id === data.leadUserId)?.displayName ?? "DSL Lead";
    case "dbs":        return allUsers.find((u) => u.id === data.staffUserId)?.displayName ?? "DBS staff";
    case "team_matrix":return `Team training summary (${data.staffWithValidL1L2 ?? 0}/${data.totalActiveStaff ?? 0})`;
    default:           return "Safeguarding record";
  }
}

/* ── Modal: schema-driven, per-category ───────────────────────────────── */

function RecordModal({ categoryKey, asset, site, allUsers, onSave, onDelete, onCancel }) {
  const meta   = SAFEGUARDING_CRED_META.find((m) => m.key === categoryKey);
  const fields = SAFEGUARDING_FIELD_SCHEMA[categoryKey];

  // Seed initial state — apply derived-default rules at modal mount so the
  // user sees the proposed value (e.g. expiry = issue + 36 months).
  const [values, setValues] = useState(() => {
    const init = {};
    for (const f of fields) init[f.name] = f.defaultValue ?? "";
    if (asset?.data) for (const [k, v] of Object.entries(asset.data)) init[k] = v;
    return init;
  });
  const [errors, setErrors] = useState({});

  const set = (name, v) => {
    setValues((prev) => {
      const next = { ...prev, [name]: v };
      // Apply any derivedFrom rule whose source just changed and whose
      // target is still empty — first-touch auto-fill, doesn't clobber.
      for (const f of fields) {
        if (f.derivedFrom?.field === name && !next[f.name] && v) {
          next[f.name] = plusMonths(v, f.derivedFrom.monthsOffset);
        }
      }
      return next;
    });
    if (errors[name]) setErrors((prev) => { const { [name]: _, ...rest } = prev; return rest; });
  };

  const validate = () => {
    const e = {};
    for (const f of fields) {
      if (!f.required) continue;
      const v = values[f.name];
      if (v === undefined || v === null || v === "") e[f.name] = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    onSave(values);
  };

  return (
    <div className={styles.scrim} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHead}>
          <div>
            <div className={styles.modalEyebrow} style={{ color: meta.accent }}>{meta.title}</div>
            <h3 className={styles.modalTitle}>
              {asset ? "Edit record" : `New ${meta.titleShort.toLowerCase()}`}
              {site && <> · {site.name}</>}
            </h3>
          </div>
          <button onClick={onCancel} className={styles.closeBtn}><I name="xcircle" size={18} color="var(--outline)" /></button>
        </header>

        <div className={styles.modalBody}>
          <div className={styles.modalGrid}>
            {fields.map((f) => (
              <Field
                key={f.name}
                field={f}
                value={values[f.name]}
                error={errors[f.name]}
                allUsers={allUsers}
                onChange={(v) => set(f.name, v)}
              />
            ))}
          </div>
        </div>

        <footer className={styles.modalFoot}>
          {onDelete && (
            <button type="button" className={styles.deleteLink} onClick={onDelete}>
              <I name="trash" size={11} color="#c62828" /> Delete record
            </button>
          )}
          <div style={{ flex: 1 }} />
          <BtnSecondary onClick={onCancel}>Cancel</BtnSecondary>
          <BtnPrimary onClick={onSubmit}>
            <I name="check" size={12} color="var(--on-primary)" /> Save record
          </BtnPrimary>
        </footer>
      </div>
    </div>
  );
}

/* ── Field renderer ───────────────────────────────────────────────────── */

function Field({ field, value, error, allUsers, onChange }) {
  const id = `field-${field.name}`;

  // Toggles span full width.
  if (field.type === "toggle") {
    return (
      <div className={styles.field} style={{ gridColumn: "span 2" }}>
        <label className={styles.checkRow + (value ? " " + styles.checkRowOn : "")}>
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span>{field.label}</span>
        </label>
        {field.help && <span className={styles.fieldHelp}>{field.help}</span>}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {field.label}
        {field.required && <span className={styles.req}>*</span>}
      </label>

      {field.type === "user-select" && (
        <select id={id} className={styles.input} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">— select staff member —</option>
          {filterUsers(allUsers, field.filterRoles).map((u) => (
            <option key={u.id} value={u.id}>
              {u.displayName} {u.role ? `(${u.role})` : ""}
            </option>
          ))}
        </select>
      )}

      {field.type === "text" && (
        <input id={id} type="text" className={styles.input}
          value={value ?? ""}
          placeholder={field.placeholder ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "number" && (
        <input id={id} type="number" inputMode="numeric"
          min={field.min ?? 0}
          className={styles.input}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        />
      )}

      {field.type === "date" && (
        <input id={id} type="date" className={styles.input}
          value={value?.split?.("T")[0] ?? value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
        />
      )}

      {error && <span className={styles.fieldError}>{error}</span>}
      {!error && field.help && <span className={styles.fieldHelp}>{field.help}</span>}
    </div>
  );
}

/* ── Utilities ─────────────────────────────────────────────────────────── */

function filterUsers(allUsers, roles) {
  if (!roles || roles.length === 0) return allUsers;
  return allUsers.filter((u) => roles.includes(u.role));
}

function plusMonths(isoDate, months) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "";
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}
