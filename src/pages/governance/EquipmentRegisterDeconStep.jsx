/**
 * Decon Equipment Register — Step 5 v2.
 *
 * Replaces the flag-gated equipment list used by every other pack with a
 * 4-category card matrix (Decon Equipment / Water Systems / Waste / Engineering).
 * Each section is a grid of soft-elevated cards with a dashed "Add" placeholder.
 * Clicking a card or the placeholder opens a category-aware modal driven by
 * the ASSET_FIELD_SCHEMA in types.js (conditional fields, validation).
 *
 * Only used when packKey === decontamination_ipc. Other packs continue with
 * the existing <EquipmentRegisterStep>.
 */

import { useEffect, useMemo, useState } from "react";
import { I } from "../../components/Icon";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import {
  ASSET_CATEGORY_META, ASSET_FIELD_SCHEMA, labelFromOptions,
  DECON_EQUIPMENT_TYPE, WATER_SYSTEM_TYPE, PROVIDER_CATEGORY, WASTE_STREAM,
} from "../../services/governance/types";
import {
  listAssetsBySite, createAsset, updateAsset, removeAsset,
  migrateLegacyEquipmentToAssets,
} from "../../services/governance/equipmentAssets.service";
import { formatDate } from "./Shared";
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

export function EquipmentRegisterDeconStep({ user, sites, appliedProfiles, onChange }) {
  // One-shot migration of any legacy equipment_records rows into the new shape.
  useEffect(() => {
    migrateLegacyEquipmentToAssets(user.tenantId);
  }, [user.tenantId]);

  const [activeSiteId, setActiveSiteId] = useState(appliedProfiles[0]?.siteId ?? null);
  const [modal, setModal] = useState(null); // { category, asset? }

  useEffect(() => {
    if (!appliedProfiles.some((p) => p.siteId === activeSiteId)) {
      setActiveSiteId(appliedProfiles[0]?.siteId ?? null);
    }
  }, [appliedProfiles, activeSiteId]);

  if (appliedProfiles.length === 0) {
    return (
      <EmptyAppliedSitesNotice
        title="Equipment Register"
        lead="Go back to Sites in scope first — equipment is recorded per site."
      />
    );
  }

  const activeProfile = appliedProfiles.find((p) => p.siteId === activeSiteId);
  const activeSite = sites.find((s) => s.id === activeSiteId);
  const assetsBySite = activeProfile ? listAssetsBySite(user.tenantId, activeProfile.id) : { decon: [], water: [], waste: [], engineer: [] };

  const openAdd  = (category)        => setModal({ category });
  const openEdit = (asset)           => setModal({ category: asset.category, asset });
  const closeModal = ()              => setModal(null);

  const handleSave = (values) => {
    if (modal.asset) {
      updateAsset(user, modal.asset.id, { data: values, localIdentifier: values.localIdentifier });
    } else {
      createAsset(user, { siteId: activeSiteId, category: modal.category, data: values, localIdentifier: values.localIdentifier });
    }
    closeModal();
    onChange();
  };

  const handleDelete = (asset) => {
    if (!confirm(`Remove this ${ASSET_CATEGORY_META.find(c => c.key === asset.category).title.toLowerCase()} record?`)) return;
    removeAsset(user, asset.id);
    closeModal();
    onChange();
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.stepTitle}>Equipment Register</h3>
      <p className={styles.stepLead}>
        Record decontamination equipment, water systems, waste contracts and service providers per site.
        Add a record by clicking the dashed placeholder in each section.
      </p>

      <div className={styles.layout}>
        <aside className={styles.rail}>
          <div className={styles.railLabel}>Applied sites</div>
          <div className={styles.railList}>
            {appliedProfiles.map((p) => {
              const site = sites.find((s) => s.id === p.siteId);
              const counts = listAssetsBySite(user.tenantId, p.id);
              const total = counts.decon.length + counts.water.length + counts.waste.length + counts.engineer.length;
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
                <div>
                  <div className={styles.siteHeaderName}>{activeSite?.name}</div>
                  <div className={styles.siteHeaderLoc}>{activeSite?.location}</div>
                </div>
              </div>

              {ASSET_CATEGORY_META.map((cat) => (
                <CategorySection
                  key={cat.key}
                  meta={cat}
                  assets={assetsBySite[cat.key]}
                  onAdd={() => openAdd(cat.key)}
                  onEdit={openEdit}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {modal && (
        <AssetModal
          category={modal.category}
          asset={modal.asset}
          onSave={handleSave}
          onDelete={modal.asset ? () => handleDelete(modal.asset) : null}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

/* ── Section: category header + card grid + dashed Add placeholder ────── */

function CategorySection({ meta, assets, onAdd, onEdit }) {
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
        <span className={styles.sectionCount}>{assets.length} recorded</span>
      </header>

      <div className={styles.grid}>
        {assets.map((a) => (
          <AssetCard key={a.id} asset={a} accent={meta.accent} onEdit={() => onEdit(a)} />
        ))}
        <button type="button" onClick={onAdd}
          className={styles.addCard}
          style={{ "--addAccent": meta.accent }}
        >
          <I name="plus" size={16} color="var(--on-surface-variant)" />
          <span>Add {meta.title.split(" ")[0].toLowerCase()} record</span>
        </button>
      </div>
    </section>
  );
}

function AssetCard({ asset, accent, onEdit }) {
  const { title, subtitle, dueLine } = summariseAsset(asset);
  return (
    <button type="button" onClick={onEdit} className={styles.card} style={{ "--cardAccent": accent }}>
      <div className={styles.cardTop}>
        <div className={styles.cardMain}>
          {asset.localIdentifier && <div className={styles.cardIdentifier}>{asset.localIdentifier}</div>}
          <div className={styles.cardTitle}>{title}</div>
          {subtitle && <div className={styles.cardSubtitle}>{subtitle}</div>}
        </div>
        <span className={styles.cardStatusDot} style={{ background: accent }} title={asset.status} />
      </div>
      {dueLine && (
        <div className={styles.cardMeta}>
          <I name="calendar" size={11} color="var(--on-surface-variant)" />
          <span>{dueLine}</span>
        </div>
      )}
    </button>
  );
}

/* Distil the asset's data blob into 1-3 lines for the card. */
function summariseAsset(a) {
  const d = a.data ?? {};
  switch (a.category) {
    case "decon": {
      const type = labelFromOptions(DECON_EQUIPMENT_TYPE, d.equipmentType);
      const title = [d.manufacturer, d.modelNumber].filter(Boolean).join(" ") || type || "Unnamed";
      const subtitle = [type, d.serialNumber && `S/N ${d.serialNumber}`].filter(Boolean).join(" · ");
      const dueLine = d.nextValidationDueAt ? `Next validation ${formatDate(d.nextValidationDueAt)}` : null;
      return { title, subtitle, dueLine };
    }
    case "water": {
      const type = labelFromOptions(WATER_SYSTEM_TYPE, d.systemType);
      const title = d.manufacturerModel || type || "Unnamed";
      const subtitle = [type, d.installationLocation].filter(Boolean).join(" · ");
      const dueLine = d.lastServiceAt ? `Last service ${formatDate(d.lastServiceAt)}` : null;
      return { title, subtitle, dueLine };
    }
    case "waste": {
      const streams = (d.wasteStreams ?? []).map((s) => labelFromOptions(WASTE_STREAM, s)).join(", ");
      const title = d.carrierName || "Waste contract";
      const subtitle = streams || null;
      const dueLine = d.contractRenewalAt ? `Renews ${formatDate(d.contractRenewalAt)}` : null;
      return { title, subtitle, dueLine };
    }
    case "engineer": {
      const cat = labelFromOptions(PROVIDER_CATEGORY, d.providerCategory);
      const title = d.companyName || "Service provider";
      const subtitle = [cat, d.primaryContactName].filter(Boolean).join(" · ");
      const dueLine = d.emergencyTel ? `Emergency: ${d.emergencyTel}` : null;
      return { title, subtitle, dueLine };
    }
    default:
      return { title: "Unknown asset", subtitle: null, dueLine: null };
  }
}

/* ── Modal: schema-driven, with conditional field rendering ───────────── */

function AssetModal({ category, asset, onSave, onDelete, onCancel }) {
  const meta = ASSET_CATEGORY_META.find((c) => c.key === category);
  const fields = ASSET_FIELD_SCHEMA[category];
  const [values, setValues] = useState(() => ({
    ...(asset?.data ?? {}),
    localIdentifier: asset?.localIdentifier ?? "",
  }));
  const [errors, setErrors] = useState({});

  const set = (name, v) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => { const { [name]: _, ...rest } = prev; return rest; });
  };

  const visibleFields = useMemo(
    () => fields.filter((f) => !f.showIf || f.showIf(values)),
    [fields, values],
  );

  const validate = () => {
    const e = {};
    for (const f of visibleFields) {
      const v = values[f.name];
      if (f.required && (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0))) {
        e[f.name] = "Required";
        continue;
      }
      if (f.validate && v !== undefined && v !== null && v !== "") {
        const res = f.validate(v);
        if (res !== true) e[f.name] = res;
      }
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
            <h3 className={styles.modalTitle}>{asset ? "Edit record" : "New record"}</h3>
          </div>
          <button onClick={onCancel} className={styles.closeBtn}><I name="xcircle" size={18} color="var(--outline)" /></button>
        </header>

        <div className={styles.modalBody}>
          <div className={styles.modalGrid}>
            {visibleFields.map((f) => (
              <Field key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => set(f.name, v)} />
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

/* ── Field: renders one form input per `field.type` ───────────────────── */

function Field({ field, value, error, onChange }) {
  const id = `field-${field.name}`;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {field.label}
        {field.required && <span className={styles.req}>*</span>}
      </label>

      {field.type === "select" && (
        <select id={id} className={styles.input} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">— select —</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {field.type === "multi-checkbox" && (
        <div className={styles.checkGrid}>
          {field.options.map((opt) => {
            const arr = Array.isArray(value) ? value : [];
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
      )}

      {(field.type === "text" || field.type === "tel" || field.type === "email") && (
        <input
          id={id}
          type={field.type === "text" ? "text" : field.type}
          className={styles.input}
          value={value ?? ""}
          placeholder={field.placeholder ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "date" && (
        <input id={id} type="date" className={styles.input} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} />
      )}

      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}
