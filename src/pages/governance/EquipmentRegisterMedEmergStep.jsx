/**
 * Medical Emergencies & Resuscitation Equipment Register — Step 5 v2.
 *
 * Three core asset categories — AED, Oxygen Cylinder, Emergency Drug Kit.
 * The drug-kit card is a parent container that absorbs the old separate
 * suction + BVM cards as embedded toggles inside its own modal.
 *
 * Data shape: persists via the existing equipment.service legacy table so
 * audit cascade + downstream activation continue to work unchanged. Asset-
 * specific fields (pad expiries, cylinder size, suction/BVM toggles) live
 * in the equipment row's `data` blob; only the indexable fields (makeModel,
 * serialNumber, roomLocation) stay as top-level columns.
 *
 * Conditional render: AED's "Paediatric Pads Expiry" only appears when the
 * site profile has `paediatricKitRequired = true` (Step 4 toggle).
 */

import { useEffect, useMemo, useState } from "react";
import { I } from "../../components/Icon";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import {
  MEDEMERG_ASSET_META, MEDEMERG_FIELD_SCHEMA, OXYGEN_CYLINDER_SIZES,
} from "../../services/governance/medicalEmergencyAssets";
import {
  listForSite, createEquipment, updateEquipment, removeEquipment,
} from "../../services/governance/equipment.service";
import { formatDate } from "./Shared";
import styles from "./EquipmentRegisterDecon.module.css";

const MEDEMERG_PACK_KEY = "medical_emergencies";

const EmptyAppliedSitesNotice = ({ title, lead }) => (
  <div className={styles.wrap}>
    <h3 className={styles.stepTitle}>{title}</h3>
    <div className={styles.hint}>
      <I name="info" size={13} color="var(--primary)" />
      <span>{lead}</span>
    </div>
  </div>
);

export function EquipmentRegisterMedEmergStep({ user, sites, appliedProfiles, onChange }) {
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
        title="Equipment Register"
        lead="Go back to Sites in scope first — emergency kit is recorded per site."
      />
    );
  }

  const activeProfile = appliedProfiles.find((p) => p.siteId === activeSiteId);
  const activeSite = sites.find((s) => s.id === activeSiteId);
  const allAssets = activeProfile
    ? listForSite(user.tenantId, activeSite.id, MEDEMERG_PACK_KEY)
    : [];

  // Bucket assets by category (driven off the `type` column).
  const byCategory = useMemo(() => {
    const buckets = {};
    for (const m of MEDEMERG_ASSET_META) buckets[m.key] = [];
    for (const a of allAssets) {
      const m = MEDEMERG_ASSET_META.find((x) => x.equipmentType === a.type);
      if (m) buckets[m.key].push(a);
    }
    return buckets;
  }, [allAssets]);

  const openAdd  = (categoryKey)         => setModal({ categoryKey });
  const openEdit = (asset, categoryKey)  => setModal({ categoryKey, asset });
  const closeModal = ()                  => setModal(null);

  const handleSave = (data) => {
    const meta = MEDEMERG_ASSET_META.find((m) => m.key === modal.categoryKey);
    // Top-level columns vs nested data blob. We always promote makeModel,
    // serialNumber, roomLocation so they're queryable; everything else lives
    // in `data` for forward compatibility.
    const { makeModel, serialNumber, roomLocation, ...rest } = data;
    const payload = {
      type:         meta.equipmentType,
      makeModel:    makeModel ?? meta.titleShort,   // drug kit has no make/model — fall back to category name
      serialNumber: serialNumber ?? null,
      roomLocation: roomLocation ?? null,
      data:         rest,
    };
    if (modal.asset) {
      updateEquipment(user, modal.asset.id, payload);
    } else {
      createEquipment(user, activeSiteId, payload, MEDEMERG_PACK_KEY);
    }
    closeModal();
    onChange();
  };

  const handleDelete = (asset) => {
    const meta = MEDEMERG_ASSET_META.find((m) => m.equipmentType === asset.type);
    if (!confirm(`Remove this ${meta?.titleShort?.toLowerCase() ?? "asset"} record?`)) return;
    removeEquipment(user, asset.id);
    closeModal();
    onChange();
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.stepTitle}>Equipment Register</h3>
      <p className={styles.stepLead}>
        Three core asset containers for medical emergency readiness — AED, oxygen and the parent
        drug-kit. Portable suction and BVM track as toggles inside the drug-kit container, not as
        their own records.
      </p>

      <div className={styles.layout}>
        <aside className={styles.rail}>
          <div className={styles.railLabel}>Applied sites</div>
          <div className={styles.railList}>
            {appliedProfiles.map((p) => {
              const site = sites.find((s) => s.id === p.siteId);
              const total = listForSite(user.tenantId, p.siteId, MEDEMERG_PACK_KEY)
                .filter((a) => MEDEMERG_ASSET_META.some((m) => m.equipmentType === a.type))
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

              {MEDEMERG_ASSET_META.map((meta) => (
                <CategorySection
                  key={meta.key}
                  meta={meta}
                  assets={byCategory[meta.key]}
                  onAdd={() => openAdd(meta.key)}
                  onEdit={(a) => openEdit(a, meta.key)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {modal && (
        <AssetModal
          categoryKey={modal.categoryKey}
          asset={modal.asset}
          site={activeSite}
          profile={activeProfile}
          onSave={handleSave}
          onDelete={modal.asset ? () => handleDelete(modal.asset) : null}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

/* ── Section: per-category header + card grid + dashed Add placeholder ── */

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
          <AssetCard key={a.id} asset={a} meta={meta} onEdit={() => onEdit(a)} />
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

function AssetCard({ asset, meta, onEdit }) {
  const d = asset.data ?? {};
  const summary = summariseAsset(asset, meta);
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

/* Per-category card summary — pulls the right fields out of the data blob
 * so each card surfaces what's most useful to the practice manager at a
 * glance (earliest expiry typically). */
function summariseAsset(asset, meta) {
  const d = asset.data ?? {};
  switch (meta.key) {
    case "aed": {
      const earliest = earliestDate([d.adultPadsExpiry, d.paediatricPadsExpiry, d.batteryExpiry]);
      return {
        identifier: asset.serialNumber ? `S/N ${asset.serialNumber}` : null,
        title:      asset.makeModel || "AED",
        subtitle:   asset.roomLocation || null,
        dueLine:    earliest ? `Earliest expiry ${formatDate(earliest)}` : "Expiry dates not set",
      };
    }
    case "oxygen": {
      const sizeLabel = OXYGEN_CYLINDER_SIZES.find((s) => s.value === d.cylinderSize)?.label;
      return {
        identifier: asset.serialNumber ? `S/N ${asset.serialNumber}` : null,
        title:      sizeLabel || "Oxygen Cylinder",
        subtitle:   null,
        dueLine:    d.cylinderSwapDate ? `Swap due ${formatDate(d.cylinderSwapDate)}` : "Swap date not set",
      };
    }
    case "drug_kit": {
      const extras = [
        d.suctionPresent && "Suction ✓",
        d.bvmPresent     && "BVM ✓",
      ].filter(Boolean).join(" · ");
      return {
        identifier: null,
        title:      asset.roomLocation || "Emergency Kit Container",
        subtitle:   extras || "No companion kit recorded",
        dueLine:    d.masterDrugBoxExpiry ? `Drug box expires ${formatDate(d.masterDrugBoxExpiry)}` : "Expiry not set",
      };
    }
    default:
      return { identifier: null, title: "Asset", subtitle: null, dueLine: null };
  }
}

function earliestDate(dates) {
  const valid = dates.filter(Boolean).map((d) => new Date(d).getTime()).filter((n) => !Number.isNaN(n));
  if (valid.length === 0) return null;
  return new Date(Math.min(...valid)).toISOString();
}

/* ── Modal: schema-driven, per-category ───────────────────────────────── */

function AssetModal({ categoryKey, asset, site, profile, onSave, onDelete, onCancel }) {
  const meta   = MEDEMERG_ASSET_META.find((m) => m.key === categoryKey);
  const fields = MEDEMERG_FIELD_SCHEMA[categoryKey];

  // Room dropdown — same set used by radiography, minus the imaging-only rooms.
  const roomOptions = useMemo(() => [
    ...Array.from({ length: 6 }, (_, i) => ({ value: `Surgery ${i + 1}`, label: `Surgery ${i + 1}` })),
    { value: "Reception Desk Wall", label: "Reception Desk Wall" },
    { value: "Staff Room",          label: "Staff Room" },
    { value: "Decon Room",          label: "Decon Room" },
    { value: "__other__",           label: "Other (type below)" },
  ], []);

  // Seed initial values from the asset's data blob + top-level columns.
  const [values, setValues] = useState(() => {
    const init = {};
    for (const f of fields) init[f.name] = f.defaultValue ?? "";
    if (asset) {
      // Top-level columns
      init.roomLocation = asset.roomLocation ?? init.roomLocation ?? "";
      init.makeModel    = asset.makeModel    ?? init.makeModel    ?? "";
      init.serialNumber = asset.serialNumber ?? init.serialNumber ?? "";
      // Asset-specific data blob
      for (const [k, v] of Object.entries(asset.data ?? {})) init[k] = v;
    }
    return init;
  });
  const [errors, setErrors] = useState({});

  const set = (name, v) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => { const { [name]: _, ...rest } = prev; return rest; });
  };

  // Filter the schema by conditional showIf — fields hidden here are
  // also skipped during validation.
  const visibleFields = useMemo(
    () => fields.filter((f) => !f.showIf || f.showIf(profile)),
    [fields, profile],
  );

  const validate = () => {
    const e = {};
    for (const f of visibleFields) {
      if (!f.required) continue;
      const v = values[f.name];
      if (v === undefined || v === null || v === "" || (typeof v === "boolean" ? false : false)) {
        e[f.name] = "Required";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    // Only emit visible fields — hidden conditional fields (e.g. paediatric
    // pads expiry when site doesn't treat children) should never persist.
    const out = {};
    for (const f of visibleFields) out[f.name] = values[f.name];
    onSave(out);
  };

  return (
    <div className={styles.scrim} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHead}>
          <div>
            <div className={styles.modalEyebrow} style={{ color: meta.accent }}>{meta.title}</div>
            <h3 className={styles.modalTitle}>
              {asset ? "Edit unit" : `New ${meta.titleShort.toLowerCase()}`}
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
                roomOptions={roomOptions}
                onChange={(v) => set(f.name, v)}
              />
            ))}
          </div>
        </div>

        <footer className={styles.modalFoot}>
          {onDelete && (
            <button type="button" className={styles.deleteLink} onClick={onDelete}>
              <I name="trash" size={11} color="#c62828" />
              {" "}{categoryKey === "drug_kit" ? "Delete Kit Container" : "Delete unit"}
            </button>
          )}
          <div style={{ flex: 1 }} />
          <BtnSecondary onClick={onCancel}>Cancel</BtnSecondary>
          <BtnPrimary onClick={onSubmit}>
            <I name="check" size={12} color="var(--on-primary)" />
            {/* Drug-kit is a container, not an individual machine — copy
                reflects what the user just configured (drugs + suction +
                BVM bundled together). AED + Oxygen stay on "Save unit". */}
            {" "}{categoryKey === "drug_kit" ? "Save Kit Container" : "Save unit"}
          </BtnPrimary>
        </footer>
      </div>
    </div>
  );
}

/* ── Field renderer — one widget per schema `type` ───────────────────── */

function Field({ field, value, error, roomOptions, onChange }) {
  const id = `field-${field.name}`;

  // Toggles render full-width — they're statements, not paired form inputs.
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

      {field.type === "select-room" && (
        <RoomSelect id={id} value={value} onChange={onChange} roomOptions={roomOptions} />
      )}

      {field.type === "select" && (
        <select id={id} className={styles.input} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">— select —</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
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

/* Room dropdown with an "Other" escape hatch revealing a freeform input.
 * Mirrors the radiography step's pattern so users get consistent UX. */
function RoomSelect({ id, value, onChange, roomOptions }) {
  const knownValues = roomOptions.map((o) => o.value);
  const isKnown = knownValues.includes(value) && value !== "__other__";
  const looksCustom = value && !isKnown && value !== "__other__";
  const [otherMode, setOtherMode] = useState(looksCustom);
  const [customText, setCustomText] = useState(looksCustom ? value : "");

  const selectVal = otherMode ? "__other__" : (isKnown ? value : "");

  return (
    <>
      <select id={id} className={styles.input}
        value={selectVal}
        onChange={(e) => {
          if (e.target.value === "__other__") {
            setOtherMode(true);
            onChange(customText || "");
          } else {
            setOtherMode(false);
            setCustomText("");
            onChange(e.target.value || null);
          }
        }}
      >
        <option value="">— select room —</option>
        {roomOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {otherMode && (
        <input type="text" className={styles.input} style={{ marginTop: 6 }}
          placeholder="e.g. Implant suite, Mezzanine room"
          value={customText}
          onChange={(e) => { setCustomText(e.target.value); onChange(e.target.value); }}
        />
      )}
    </>
  );
}
