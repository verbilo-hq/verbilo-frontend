/**
 * GenericRegisterStep — data-driven Step 5 renderer.
 *
 * Consumes a per-pack schema from PACK_REGISTER_SCHEMAS and renders the
 * familiar site-rail + soft-card sections + dashed Add placeholder pattern
 * without requiring a bespoke React component per pack. Powers the long-tail
 * packs (Complaints / Practice Ops / Audit / Site-Specific). The four
 * specialised registers (Decon, Radiography, Med-Emerg, Safeguarding) keep
 * their dedicated components.
 *
 * Field renderer supports: text, number, date, select, multi-select, toggle,
 * user-select — with conditional `showIf` + `requiredIf` per field.
 */

import { useEffect, useMemo, useState } from "react";
import { I } from "../../components/Icon";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { getRegisterSchema } from "../../services/governance/packStepOverrides";
import {
  listForSite, createEquipment, updateEquipment, removeEquipment,
} from "../../services/governance/equipment.service";
import styles from "./EquipmentRegisterDecon.module.css";

const EmptyAppliedSitesNotice = ({ title, lead }) => (
  <div className={styles.wrap}>
    <h3 className={styles.stepTitle}>{title}</h3>
    <div className={styles.hint}>
      <I name="info" size={13} color="var(--primary)" />
      <span>{lead}</span>
    </div>
  </div>
);

export function GenericRegisterStep({ user, sites, allUsers, appliedProfiles, packKey, onChange }) {
  const schema = getRegisterSchema(packKey);
  const [activeSiteId, setActiveSiteId] = useState(appliedProfiles[0]?.siteId ?? null);
  const [modal, setModal] = useState(null); // { categoryKey, asset? }

  useEffect(() => {
    if (!appliedProfiles.some((p) => p.siteId === activeSiteId)) {
      setActiveSiteId(appliedProfiles[0]?.siteId ?? null);
    }
  }, [appliedProfiles, activeSiteId]);

  if (!schema) {
    return <EmptyAppliedSitesNotice title="Register" lead="No register schema configured for this pack." />;
  }
  if (appliedProfiles.length === 0) {
    return (
      <EmptyAppliedSitesNotice
        title={schema.title}
        lead="Go back to Sites in scope first — records are kept per site."
      />
    );
  }

  const activeProfile = appliedProfiles.find((p) => p.siteId === activeSiteId);
  const activeSite = sites.find((s) => s.id === activeSiteId);
  const allRecords = activeProfile
    ? listForSite(user.tenantId, activeSite.id, packKey)
    : [];

  // Bucket records by category via the type discriminator.
  const byCategory = useMemo(() => {
    const buckets = {};
    for (const c of schema.categories) buckets[c.key] = [];
    for (const a of allRecords) {
      const c = schema.categories.find((x) => x.equipmentType === a.type);
      if (c) buckets[c.key].push(a);
    }
    return buckets;
  }, [allRecords, schema]);

  const openAdd  = (categoryKey)        => setModal({ categoryKey });
  const openEdit = (asset, categoryKey) => setModal({ categoryKey, asset });
  const closeModal = ()                 => setModal(null);

  const handleSave = (values, categoryKey) => {
    const category = schema.categories.find((c) => c.key === categoryKey);
    const payload = {
      type:         category.equipmentType,
      // Best-effort indexable fields. Most generic-register packs don't
      // have a make/model in the conventional sense, so we derive a label
      // from the schema's summariser for audit-log readability.
      makeModel:    category.summarise({ data: values })?.title ?? category.title,
      serialNumber: values.caseRef ?? values.accountRef ?? values.providerName ?? null,
      roomLocation: values.facilityName ?? null,
      data:         values,
    };
    if (modal.asset) {
      updateEquipment(user, modal.asset.id, payload);
    } else {
      createEquipment(user, activeSiteId, payload, packKey);
    }
    closeModal();
    onChange();
  };

  const handleDelete = (asset, categoryKey) => {
    const category = schema.categories.find((c) => c.key === categoryKey);
    if (!confirm(`Remove this ${category?.title?.toLowerCase() ?? "record"}?`)) return;
    removeEquipment(user, asset.id);
    closeModal();
    onChange();
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.stepTitle}>{schema.title}</h3>
      <p className={styles.stepLead}>{schema.lead}</p>

      <div className={styles.layout}>
        <aside className={styles.rail}>
          <div className={styles.railLabel}>Applied sites</div>
          <div className={styles.railList}>
            {appliedProfiles.map((p) => {
              const site = sites.find((s) => s.id === p.siteId);
              const total = listForSite(user.tenantId, p.siteId, packKey)
                .filter((a) => schema.categories.some((c) => c.equipmentType === a.type))
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

              {schema.categories.map((category) => (
                <CategorySection
                  key={category.key}
                  category={category}
                  records={byCategory[category.key]}
                  onAdd={() => openAdd(category.key)}
                  onEdit={(a) => openEdit(a, category.key)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {modal && (
        <RecordModal
          schema={schema}
          categoryKey={modal.categoryKey}
          asset={modal.asset}
          site={activeSite}
          allUsers={allUsers}
          onSave={(values) => handleSave(values, modal.categoryKey)}
          onDelete={modal.asset ? () => handleDelete(modal.asset, modal.categoryKey) : null}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

/* ── Section: per-category header + card grid + dashed Add placeholder ── */

function CategorySection({ category, records, onAdd, onEdit }) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHead}>
        <span className={styles.sectionIcon} style={{ background: `color-mix(in srgb, ${category.accent} 12%, transparent)` }}>
          <I name={category.icon} size={14} color={category.accent} />
        </span>
        <div className={styles.sectionTitleWrap}>
          <div className={styles.sectionTitle}>{category.title}</div>
          {category.subtitle && <div className={styles.sectionSubtitle}>{category.subtitle}</div>}
        </div>
        <span className={styles.sectionCount}>{records.length} recorded</span>
      </header>

      <div className={styles.grid}>
        {records.map((row) => (
          <RecordCard key={row.id} row={row} category={category} onEdit={() => onEdit(row)} />
        ))}
        <button type="button" onClick={onAdd}
          className={styles.addCard}
          style={{ "--addAccent": category.accent }}
        >
          <I name="plus" size={16} color="var(--on-surface-variant)" />
          <span>{category.addButtonLabel}</span>
        </button>
      </div>
    </section>
  );
}

function RecordCard({ row, category, onEdit }) {
  const s = category.summarise(row);
  return (
    <button type="button" onClick={onEdit} className={styles.card} style={{ "--cardAccent": category.accent }}>
      <div className={styles.cardTop}>
        <div className={styles.cardMain}>
          {s.identifier && <div className={styles.cardIdentifier}>{s.identifier}</div>}
          <div className={styles.cardTitle}>{s.title}</div>
          {s.subtitle && <div className={styles.cardSubtitle}>{s.subtitle}</div>}
        </div>
        <span className={styles.cardStatusDot} style={{ background: category.accent }} title={row.status} />
      </div>
      {s.dueLine && (
        <div className={styles.cardMeta}>
          <I name="calendar" size={11} color="var(--on-surface-variant)" />
          <span>{s.dueLine}</span>
        </div>
      )}
    </button>
  );
}

/* ── Modal: schema-driven, with conditional showIf / requiredIf ───────── */

function RecordModal({ schema, categoryKey, asset, site, allUsers, onSave, onDelete, onCancel }) {
  const category = schema.categories.find((c) => c.key === categoryKey);
  const fields = category.fields;

  // Seed initial state from schema defaults + the asset's data blob.
  const [values, setValues] = useState(() => {
    const init = {};
    for (const f of fields) {
      init[f.name] = f.defaultValue ?? (f.type === "multi-select" ? [] : f.type === "toggle" ? false : "");
    }
    if (asset?.data) for (const [k, v] of Object.entries(asset.data)) init[k] = v;
    return init;
  });
  const [errors, setErrors] = useState({});

  const set = (name, v) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => { const { [name]: _, ...rest } = prev; return rest; });
  };

  // showIf-filtered visible fields. Hidden fields are skipped during
  // validation AND stripped from the saved payload.
  const visibleFields = useMemo(
    () => fields.filter((f) => !f.showIf || f.showIf(values)),
    [fields, values],
  );

  const validate = () => {
    const e = {};
    for (const f of visibleFields) {
      const required = f.required || (f.requiredIf && f.requiredIf(values));
      if (!required) continue;
      const v = values[f.name];
      const isEmpty =
        v === undefined || v === null || v === "" ||
        (Array.isArray(v) && v.length === 0);
      if (isEmpty) e[f.name] = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    // Strip hidden fields so they never persist.
    const out = {};
    for (const f of visibleFields) out[f.name] = values[f.name];
    onSave(out);
  };

  return (
    <div className={styles.scrim} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHead}>
          <div>
            <div className={styles.modalEyebrow} style={{ color: category.accent }}>{category.title}</div>
            <h3 className={styles.modalTitle}>
              {asset ? "Edit record" : category.addButtonLabel.replace(/^\+\s*/, "")}
              {site && <> · {site.name}</>}
            </h3>
          </div>
          <button onClick={onCancel} className={styles.closeBtn}><I name="xcircle" size={18} color="var(--outline)" /></button>
        </header>

        <div className={styles.modalBody}>
          <div className={styles.modalGrid}>
            {visibleFields.map((f) => (
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

/* ── Field renderer — one widget per `field.type` ─────────────────────── */

function Field({ field, value, error, allUsers, onChange }) {
  const id = `field-${field.name}`;

  // Toggles render full-width as the styled checkRow pill.
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

  // Multi-select renders as a multi-checkbox grid (cleaner than a multiple <select>).
  if (field.type === "multi-select") {
    const arr = Array.isArray(value) ? value : [];
    return (
      <div className={styles.field} style={{ gridColumn: "span 2" }}>
        <label className={styles.fieldLabel}>
          {field.label}{field.required && <span className={styles.req}>*</span>}
        </label>
        <div className={styles.checkGrid}>
          {field.options.map((opt) => {
            const on = arr.includes(opt.value);
            return (
              <label key={opt.value} className={on ? `${styles.checkRow} ${styles.checkRowOn}` : styles.checkRow}>
                <input type="checkbox" checked={on} onChange={(e) => {
                  const next = e.target.checked ? [...arr, opt.value] : arr.filter((v) => v !== opt.value);
                  onChange(next);
                }} />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
        {error && <span className={styles.fieldError}>{error}</span>}
        {!error && field.help && <span className={styles.fieldHelp}>{field.help}</span>}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {field.label}
        {(field.required || field.requiredIf) && <span className={styles.req}>*</span>}
      </label>

      {field.type === "select" && (
        <select id={id} className={styles.input} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">— select —</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {field.type === "user-select" && (
        <select id={id} className={styles.input} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">— select staff member —</option>
          {(field.filterRoles
            ? (allUsers ?? []).filter((u) => field.filterRoles.includes(u.role))
            : (allUsers ?? [])
          ).map((u) => (
            <option key={u.id} value={u.id}>{u.displayName}</option>
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
          min={field.min}
          className={styles.input}
          value={value ?? ""}
          placeholder={field.placeholder ?? ""}
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
