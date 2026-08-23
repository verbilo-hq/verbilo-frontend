/**
 * Radiography & IRMER Equipment Register — Step 5 v2.
 *
 * Models physical, radiation-emitting hardware ONLY. Service contracts,
 * compliance software and signage assets are tracked elsewhere (the SOP
 * library / Operator entitlement page), not here.
 *
 * Four modality sections:
 *   • Intraoral X-ray units     — baseline, always rendered
 *   • Panoramic / OPG units     — rendered iff site profile.opgXray
 *   • CBCT scanners             — rendered iff site profile.cbctXray
 *   • Handheld / portable units — rendered iff site profile.handheldXray
 *
 * Each section is a soft-card grid with a dashed "Add" placeholder that
 * launches the AssetModal. The modal captures the 5 statutory IRR17 fields:
 *   1. Location / surgery assigned
 *   2. Make & model
 *   3. Tube-head serial number       (drives HSE notification traceability)
 *   4. Year of manufacture
 *   5. Date of last Critical Examination (3-year IRR17 cycle)
 *
 * Data is persisted via the existing equipment.service (legacy
 * equipment_records table) so the downstream radiography slot-generation
 * engine + appendix wiring continues to work unchanged.
 */

import { useEffect, useMemo, useState } from "react";
import { I } from "../../components/Icon";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import {
  RADIOGRAPHY_MODALITY_META, RADIOGRAPHY_ASSET_FIELDS,
} from "../../services/governance/radiographyAssets";
import {
  listForSite, createEquipment, updateEquipment, removeEquipment,
} from "../../services/governance/equipment.service";
import { formatDate } from "./Shared";
import styles from "./EquipmentRegisterDecon.module.css";

const RADIOGRAPHY_PACK_KEY = "radiography_irmer";

const EmptyAppliedSitesNotice = ({ title, lead }) => (
  <div className={styles.wrap}>
    <h3 className={styles.stepTitle}>{title}</h3>
    <div className={styles.hint}>
      <I name="info" size={13} color="var(--primary)" />
      <span>{lead}</span>
    </div>
  </div>
);

export function EquipmentRegisterRadiographyStep({ user, sites, appliedProfiles, onChange }) {
  const [activeSiteId, setActiveSiteId] = useState(appliedProfiles[0]?.siteId ?? null);
  const [modal, setModal] = useState(null); // { modalityKey, asset? }

  useEffect(() => {
    if (!appliedProfiles.some((p) => p.siteId === activeSiteId)) {
      setActiveSiteId(appliedProfiles[0]?.siteId ?? null);
    }
  }, [appliedProfiles, activeSiteId]);

  if (appliedProfiles.length === 0) {
    return (
      <EmptyAppliedSitesNotice
        title="Equipment Register"
        lead="Go back to Sites in scope first — radiation equipment is recorded per site."
      />
    );
  }

  const activeProfile = appliedProfiles.find((p) => p.siteId === activeSiteId);
  const activeSite = sites.find((s) => s.id === activeSiteId);
  const allAssets = activeProfile
    ? listForSite(user.tenantId, activeSite.id, RADIOGRAPHY_PACK_KEY)
    : [];

  // Bucket assets by modality discriminator (`type`).
  const byModality = useMemo(() => {
    const buckets = {};
    for (const m of RADIOGRAPHY_MODALITY_META) buckets[m.key] = [];
    for (const a of allAssets) {
      const m = RADIOGRAPHY_MODALITY_META.find((x) => x.equipmentType === a.type);
      if (m) buckets[m.key].push(a);
    }
    return buckets;
  }, [allAssets]);

  // Step 4 → Step 5 conditional gate. Intraoral is the baseline (always
  // rendered); the other three appear only when the matching profile flag
  // is on. Mandatory IRR17 flags don't gate sections — only modality flags.
  const visibleModalities = RADIOGRAPHY_MODALITY_META.filter((m) => {
    if (m.alwaysVisible) return true;
    return !!activeProfile?.[m.profileFlag];
  });

  const openAdd  = (modalityKey)     => setModal({ modalityKey });
  const openEdit = (asset, modalityKey) => setModal({ modalityKey, asset });
  const closeModal = ()              => setModal(null);

  const handleSave = (values) => {
    const meta = RADIOGRAPHY_MODALITY_META.find((m) => m.key === modal.modalityKey);
    // Auto-derive `nextServiceDate` as lastServiceDate + 3 years (the IRR17
    // Critical Exam cycle) when the user hasn't picked one explicitly.
    const next = values.lastServiceDate && !values.nextServiceDate
      ? plusYears(values.lastServiceDate, 3)
      : values.nextServiceDate ?? null;
    const payload = {
      type:              meta.equipmentType,
      makeModel:         values.makeModel,
      serialNumber:      values.serialNumber ?? null,
      roomLocation:      values.roomLocation ?? null,
      yearOfManufacture: values.yearOfManufacture ?? null,
      lastServiceDate:   values.lastServiceDate ?? null,
      nextServiceDate:   next,
    };
    if (modal.asset) {
      updateEquipment(user, modal.asset.id, payload);
    } else {
      createEquipment(user, activeSiteId, payload, RADIOGRAPHY_PACK_KEY);
    }
    closeModal();
    onChange();
  };

  const handleDelete = (asset) => {
    const meta = RADIOGRAPHY_MODALITY_META.find((m) => m.equipmentType === asset.type);
    if (!confirm(`Remove this ${meta?.titleShort.toLowerCase() ?? "unit"} record?`)) return;
    removeEquipment(user, asset.id);
    closeModal();
    onChange();
  };

  return (
    <div className={styles.wrap}>
      <h3 className={styles.stepTitle}>Equipment Register</h3>
      <p className={styles.stepLead}>
        Record every radiation-emitting unit at this site — one card per tube head. Service
        contracts, QA test kits and RPA / MPE provider details live in their own SOPs and aren't
        captured here.
      </p>

      <div className={styles.layout}>
        <aside className={styles.rail}>
          <div className={styles.railLabel}>Applied sites</div>
          <div className={styles.railList}>
            {appliedProfiles.map((p) => {
              const site = sites.find((s) => s.id === p.siteId);
              const total = listForSite(user.tenantId, p.siteId, RADIOGRAPHY_PACK_KEY)
                .filter((a) => RADIOGRAPHY_MODALITY_META.some((m) => m.equipmentType === a.type))
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

              {visibleModalities.map((meta) => (
                <ModalitySection
                  key={meta.key}
                  meta={meta}
                  assets={byModality[meta.key]}
                  onAdd={() => openAdd(meta.key)}
                  onEdit={(a) => openEdit(a, meta.key)}
                />
              ))}

              {/* Soft hint when the user hasn't toggled any optional modality
                  on — only intraoral renders. Helps them realise they need
                  to revisit Step 4 if they actually run OPG / CBCT / handheld. */}
              {visibleModalities.length === 1 && (
                <div className={styles.hint} style={{ marginTop: 4 }}>
                  <I name="info" size={13} color="var(--primary)" />
                  <span>
                    Only intraoral units are visible. Toggle OPG, CBCT or Handheld on in <strong>Site profiles</strong>
                    {" "}to track additional modalities at {activeSite?.name}.
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modal && (
        <AssetModal
          modalityKey={modal.modalityKey}
          asset={modal.asset}
          site={activeSite}
          onSave={handleSave}
          onDelete={modal.asset ? () => handleDelete(modal.asset) : null}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

/* ── Section: per-modality header + card grid + dashed Add placeholder ── */

function ModalitySection({ meta, assets, onAdd, onEdit }) {
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
          <span>{meta.addButtonLabel}</span>
        </button>
      </div>
    </section>
  );
}

function AssetCard({ asset, accent, onEdit }) {
  const title = asset.makeModel || "Unnamed unit";
  const subtitleParts = [
    asset.roomLocation,
    asset.serialNumber ? `S/N ${asset.serialNumber}` : null,
  ].filter(Boolean);
  const ceLine = asset.lastServiceDate
    ? `Last Routine Radiation Test ${formatDate(asset.lastServiceDate)}`
    : "Routine Radiation Test date not recorded";
  return (
    <button type="button" onClick={onEdit} className={styles.card} style={{ "--cardAccent": accent }}>
      <div className={styles.cardTop}>
        <div className={styles.cardMain}>
          {asset.yearOfManufacture && (
            <div className={styles.cardIdentifier}>{asset.yearOfManufacture}</div>
          )}
          <div className={styles.cardTitle}>{title}</div>
          {subtitleParts.length > 0 && (
            <div className={styles.cardSubtitle}>{subtitleParts.join(" · ")}</div>
          )}
        </div>
        <span className={styles.cardStatusDot} style={{ background: accent }} title={asset.status} />
      </div>
      <div className={styles.cardMeta}>
        <I name="calendar" size={11} color="var(--on-surface-variant)" />
        <span>{ceLine}</span>
      </div>
    </button>
  );
}

/* ── Modal: schema-driven, 5 IRR17-compliance fields ──────────────────── */

function AssetModal({ modalityKey, asset, site, onSave, onDelete, onCancel }) {
  const meta = RADIOGRAPHY_MODALITY_META.find((m) => m.key === modalityKey);
  const fields = RADIOGRAPHY_ASSET_FIELDS;

  // Build the surgery / location dropdown options on the fly. Sites don't
  // currently model surgeries as first-class rows, so we generate "Surgery
  // 1..N" + a couple of fallback rooms. The user can still pick "Other" and
  // type a freeform value, captured into roomLocationCustom.
  const locationOptions = useMemo(() => {
    const surgeries = Array.from({ length: 6 }, (_, i) => ({
      value: `Surgery ${i + 1}`, label: `Surgery ${i + 1}`,
    }));
    return [
      ...surgeries,
      { value: "OPG Room",         label: "OPG Room" },
      { value: "CBCT Suite",       label: "CBCT Suite" },
      { value: "Mobile / Portable",label: "Mobile / Portable" },
      { value: "__other__",        label: "Other (type below)" },
    ];
  }, []);

  // Handheld units carry one extra mandatory field (secure storage location)
  // — driven off the modality key so the validation + UI both branch in one
  // place instead of being scattered.
  const isHandheld = modalityKey === "handheld";

  const [values, setValues] = useState(() => {
    const loc = asset?.roomLocation ?? "";
    const knownValues = locationOptions.map((o) => o.value);
    return {
      roomLocation:          knownValues.includes(loc) ? loc : (loc ? "__other__" : ""),
      roomLocationCustom:    knownValues.includes(loc) ? "" : (loc ?? ""),
      makeModel:             asset?.makeModel ?? "",
      serialNumber:          asset?.serialNumber ?? "",
      yearOfManufacture:     asset?.yearOfManufacture ?? "",
      lastServiceDate:       asset?.lastServiceDate?.split("T")[0] ?? "",
      secureStorageLocation: asset?.secureStorageLocation ?? "",
    };
  });
  const [errors, setErrors] = useState({});

  const set = (name, v) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => { const { [name]: _, ...rest } = prev; return rest; });
  };

  const validate = () => {
    const e = {};
    for (const f of fields) {
      if (!f.required) continue;
      const v = values[f.name];
      if (v === undefined || v === null || v === "") e[f.name] = "Required";
    }
    if (values.roomLocation === "__other__" && !values.roomLocationCustom?.trim()) {
      e.roomLocationCustom = "Required when location is set to Other";
    }
    /* Year of Manufacture is fully optional — no range validation. Some legacy
     * tube heads in service date back decades and DOMs are often unrecorded
     * on hand-me-down units. Letting users leave it blank is the right
     * default; capturing a misremembered year would be worse than null. */
    if (isHandheld && !values.secureStorageLocation?.trim()) {
      e.secureStorageLocation = "Required for handheld units (IRR17 secure storage)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    const roomLocation = values.roomLocation === "__other__"
      ? values.roomLocationCustom.trim()
      : values.roomLocation || null;
    onSave({
      makeModel:             values.makeModel.trim(),
      serialNumber:          values.serialNumber.trim() || null,
      roomLocation,
      yearOfManufacture:     values.yearOfManufacture ? Number(values.yearOfManufacture) : null,
      lastServiceDate:       values.lastServiceDate || null,
      // Only ever persisted for handheld units; null for every other modality.
      secureStorageLocation: isHandheld ? values.secureStorageLocation.trim() : null,
    });
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
            {/* Location / Surgery — dropdown of common rooms, with an
                "Other" escape hatch that reveals a freeform text input. */}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Location / Surgery assigned<span className={styles.req}>*</span>
              </label>
              <select
                className={styles.input}
                value={values.roomLocation}
                onChange={(e) => set("roomLocation", e.target.value)}
              >
                <option value="">— select room —</option>
                {locationOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.roomLocation && <span className={styles.fieldError}>{errors.roomLocation}</span>}
            </div>

            {values.roomLocation === "__other__" && (
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Custom location</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Implant suite, Mezzanine room"
                  value={values.roomLocationCustom}
                  onChange={(e) => set("roomLocationCustom", e.target.value)}
                />
                {errors.roomLocationCustom && <span className={styles.fieldError}>{errors.roomLocationCustom}</span>}
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Make &amp; Model<span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Belmont Phot-X II"
                value={values.makeModel}
                onChange={(e) => set("makeModel", e.target.value)}
              />
              {errors.makeModel && <span className={styles.fieldError}>{errors.makeModel}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Tube Head Serial Number<span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="Found on the tube head label"
                value={values.serialNumber}
                onChange={(e) => set("serialNumber", e.target.value)}
              />
              {errors.serialNumber && <span className={styles.fieldError}>{errors.serialNumber}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Year of Manufacture</label>
              <input
                type="number"
                inputMode="numeric"
                className={styles.input}
                placeholder="e.g. 2019"
                value={values.yearOfManufacture}
                onChange={(e) => set("yearOfManufacture", e.target.value)}
              />
              {/* Explicit optional hint — legacy units often have unrecorded
                  DOMs and a blank field is preferable to a guessed value. */}
              <span className={styles.fieldHelp}>(Optional — leave blank if unknown)</span>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                Last Routine Radiation Test (3-year IRR17 cycle)<span className={styles.req}>*</span>
              </label>
              <input
                type="date"
                className={styles.input}
                value={values.lastServiceDate}
                onChange={(e) => set("lastServiceDate", e.target.value)}
              />
              {errors.lastServiceDate && <span className={styles.fieldError}>{errors.lastServiceDate}</span>}
              {values.lastServiceDate && (
                <span className={styles.fieldHelp}>
                  Next due {formatDate(plusYears(values.lastServiceDate, 3))}
                </span>
              )}
            </div>

            {/* Handheld-only: IRR17 mandates a designated locked storage
                point for portable X-ray units when not in clinical use, to
                mitigate theft and unauthorised access. Spans both modal
                columns so the freeform location reads in one line. */}
            {isHandheld && (
              <div className={styles.field} style={{ gridColumn: "span 2" }}>
                <label className={styles.fieldLabel}>
                  Designated Secure Storage Location<span className={styles.req}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Locked wall-cabinet in Surgery 1 / Practice Safe"
                  value={values.secureStorageLocation}
                  onChange={(e) => set("secureStorageLocation", e.target.value)}
                />
                {errors.secureStorageLocation
                  ? <span className={styles.fieldError}>{errors.secureStorageLocation}</span>
                  : <span className={styles.fieldHelp}>IRR17 requires portable units to be locked away when not in clinical use.</span>}
              </div>
            )}
          </div>
        </div>

        <footer className={styles.modalFoot}>
          {onDelete && (
            <button type="button" className={styles.deleteLink} onClick={onDelete}>
              <I name="trash" size={11} color="#c62828" /> Delete unit
            </button>
          )}
          <div style={{ flex: 1 }} />
          <BtnSecondary onClick={onCancel}>Cancel</BtnSecondary>
          <BtnPrimary onClick={onSubmit}>
            <I name="check" size={12} color="var(--on-primary)" /> Save unit
          </BtnPrimary>
        </footer>
      </div>
    </div>
  );
}

/* ── Utilities ─────────────────────────────────────────────────────────── */

function plusYears(isoDate, years) {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString();
}
