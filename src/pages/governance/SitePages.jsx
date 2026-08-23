import { useEffect, useRef, useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { Pill } from "../../components/ui/Pill";
import { BackButton, SiteStatusPill, DocStatusPill, formatDate } from "./Shared";
import {
  ensureProfile, getProfile, updateProfile, profileCompletion,
} from "../../services/governance/siteProfiles.service";
import { listDocuments } from "../../services/governance/documents.service";
import { getPackInstance, DECON_PACK_KEY } from "../../services/governance/packs.service";
import {
  SITE_MAP_SLOTS, getSiteMap, saveSiteMap, removeSiteMap,
} from "../../services/governance/siteConfig.service";
import {
  listForSite as listEquipmentForSite, createEquipment, updateEquipment, removeEquipment,
  serviceStatusBucket,
} from "../../services/governance/equipment.service";
import {
  EquipmentType, EQUIPMENT_TYPE_LABEL, EQUIPMENT_TYPES_BY_PACK,
  SITE_PROFILE_FLAGS_BY_PACK, UserRole, ROLE_LABEL,
} from "../../services/governance/types";
import styles from "./Governance.module.css";

const RADIOGRAPHY_PACK_KEY = "radiography_irmer";

/** Per-pack lead field definitions for the site profile page. */
const LEAD_FIELDS_BY_PACK = {
  decontamination_ipc: [
    { id: "localDeconLeadUserId", label: "Local Decontamination Lead", role: UserRole.decontamination_lead },
    { id: "localIpcLeadUserId",   label: "Local IPC Lead",              role: UserRole.ipc_lead },
    { id: "practiceManagerUserId", label: "Practice Manager",            role: UserRole.practice_manager },
    { id: "localReviewerUserId",  label: "Local Reviewer",              role: UserRole.governance_lead },
  ],
  radiography_irmer: [
    { id: "irmerLeadUserId", label: "Local IRMER Lead",                       role: UserRole.irmer_lead },
    { id: "rpsUserId",       label: "Radiation Protection Supervisor (RPS)",   role: UserRole.radiation_protection_supervisor },
    { id: "practiceManagerUserId", label: "Practice Manager",                  role: UserRole.practice_manager },
  ],
};

const PROVIDER_FIELDS_BY_PACK = {
  decontamination_ipc: [],
  radiography_irmer: [
    { id: "rpaProviderName",  label: "RPA Provider name",          placeholder: "e.g. Dental Radiation Services Ltd" },
    { id: "rpaContact",       label: "RPA contact email/phone",    placeholder: "rpa@example.co.uk" },
    { id: "mpeProviderName",  label: "MPE Provider name",          placeholder: "e.g. Medical Physics Partnership" },
    { id: "mpeContact",       label: "MPE contact email/phone",    placeholder: "mpe@example.co.uk" },
  ],
};

function flagsFor(packKey)    { return SITE_PROFILE_FLAGS_BY_PACK[packKey] ?? SITE_PROFILE_FLAGS_BY_PACK.decontamination_ipc; }
function leadsFor(packKey)    { return LEAD_FIELDS_BY_PACK[packKey] ?? LEAD_FIELDS_BY_PACK.decontamination_ipc; }
function providersFor(packKey) { return PROVIDER_FIELDS_BY_PACK[packKey] ?? []; }

/* ─── Site list ────────────────────────────────────────────────────────────── */

export const SiteList = ({ user, sites, onOpen, packKey = DECON_PACK_KEY }) => {
  const pack = getPackInstance(user.tenantId, packKey);
  const profileLabel = packKey === RADIOGRAPHY_PACK_KEY ? "radiography profile" : "decontamination profile";
  return (
    <div>
      <h2 className={styles.areaTitle}>Sites</h2>
      <p className={styles.areaLead}>
        Each applied site has its own {profileLabel} and equipment register. The pack cannot go
        live until each applied site has at least the required information set.
      </p>
      <div className={styles.siteListGrid}>
        {sites.map((site) => {
          const profile = pack ? getProfile(user.tenantId, site.id, pack.id) : null;
          const applied = profile?.applied ?? false;
          const { pct } = profileCompletion(profile, packKey);
          return (
            <Card key={site.id} hover={false} className={styles.siteRowCard} onClick={() => onOpen(site.id)}>
              <div>
                <div className={styles.siteRowName}>{site.name}</div>
                <div className={styles.siteRowMeta}>
                  {site.location ?? "—"} · {applied ? `${pct}% configured` : "Not applied to pack"}
                </div>
              </div>
              <SiteStatusPill status={site.status} />
              <I name="arrow" size={14} color="var(--outline)" />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Site profile ─────────────────────────────────────────────────────────── */

export const SiteProfile = ({ user, site, allUsers, onBack, onOpenDocument, packKey = DECON_PACK_KEY }) => {
  const tenantId = user.tenantId;
  const [tick, setTick] = useState(0);
  const [editing, setEditing] = useState(null); // null | 'new' | <equipment row> — for inline equipment register
  const pack = getPackInstance(tenantId, packKey);
  const profile = pack ? getProfile(tenantId, site.id, pack.id) : null;

  useEffect(() => { ensureProfile(user, site.id, packKey); setTick((t) => t + 1); }, [packKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!profile) return <div style={{ padding: 20 }}>Loading…</div>;

  const patch = (p) => { updateProfile(user, site.id, p, packKey); setTick((t) => t + 1); };
  const completion = profileCompletion(profile, packKey);

  const isRadiography = packKey === RADIOGRAPHY_PACK_KEY;
  const processTitle = isRadiography ? "Radiography processes at this site" : "Decontamination process at this site";
  const processLead = isRadiography
    ? "Enable each modality this practice operates. Activated SOPs, evidence and audits will mirror what's enabled."
    : "The activated SOPs and required evidence will reflect what's enabled here. Disable a process if it does not apply to this site.";
  const equipmentBlurb = isRadiography
    ? "Intraoral / OPG / CBCT units, sensors, scanners and software for this site."
    : "Autoclaves, washer-disinfectors, ultrasonic baths and waterline products for this site.";

  // ── Equipment register (inline) ────────────────────────────────────────
  const allowedTypes = new Set(EQUIPMENT_TYPES_BY_PACK[packKey] ?? []);
  const equipmentAll = listEquipmentForSite(tenantId, site.id);
  const equipment = allowedTypes.size > 0 ? equipmentAll.filter((r) => allowedTypes.has(r.type)) : equipmentAll;
  const handleEquipSave = (data) => {
    if (editing === "new") createEquipment(user, site.id, { ...data, packKey });
    else updateEquipment(user, editing.id, data);
    setEditing(null);
    setTick((t) => t + 1);
  };

  const userOpt = (role) => allUsers.filter((u) => u.role === role || u.role === UserRole.practice_manager);

  return (
    <div>
      <BackButton onClick={onBack} label="Back to sites" />
      <div className={styles.siteHeader}>
        <div>
          <h2 className={styles.areaTitle}>{site.name}</h2>
          <p className={styles.siteHeaderSub}>{site.location ?? "—"} · {completion.pct}% configured</p>
        </div>
        <SiteStatusPill status={site.status} />
      </div>

      <Card hover={false} style={{ padding: 24, marginBottom: 18 }}>
        <h3 className={styles.cardTitle}>{processTitle}</h3>
        <p className={styles.cardLead}>{processLead}</p>
        <div className={styles.flagGrid}>
          {flagsFor(packKey).map((f) => {
            const on = !!profile[f.id];
            return (
              <button
                key={f.id}
                type="button"
                className={on ? `${styles.flagRow} ${styles.flagRowOn}` : styles.flagRow}
                onClick={() => patch({ [f.id]: !on })}
              >
                <div className={on ? `${styles.flagCheck} ${styles.flagCheckOn}` : styles.flagCheck}>
                  {on && <I name="check" size={11} color="white" />}
                </div>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card hover={false} style={{ padding: 24, marginBottom: 18 }}>
        <h3 className={styles.cardTitle}>Local leads & responsibilities</h3>
        <div className={styles.wizFormGrid}>
          {leadsFor(packKey).map((field) => (
            <div key={field.id} className={styles.wizField}>
              <label className={styles.wizLabel}>{field.label}</label>
              <select
                className={styles.wizSelect}
                value={profile[field.id] ?? ""}
                onChange={(e) => patch({ [field.id]: e.target.value || null })}
              >
                <option value="">— select user —</option>
                {userOpt(field.role).map((u) => (
                  <option key={u.id} value={u.id}>{u.displayName ?? u.username} ({ROLE_LABEL[u.role]})</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Card>

      {providersFor(packKey).length > 0 && (
        <Card hover={false} style={{ padding: 24, marginBottom: 18 }}>
          <h3 className={styles.cardTitle}>External providers</h3>
          <p className={styles.cardLead}>
            RPA and MPE contracts are required under IRMER 2017 and IRR17. These details print onto the
            local rules and evidence pack export.
          </p>
          <div className={styles.wizFormGrid}>
            {providersFor(packKey).map((field) => (
              <div key={field.id} className={styles.wizField}>
                <label className={styles.wizLabel}>{field.label}</label>
                <input
                  className={styles.wizInput}
                  value={profile[field.id] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => patch({ [field.id]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card hover={false} style={{ padding: 24, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 10 }}>
          <div>
            <h3 className={styles.cardTitle}>Equipment & Systems</h3>
            <p className={styles.cardLead}>{equipmentBlurb}</p>
          </div>
          <BtnPrimary onClick={() => setEditing("new")} style={{ padding: "6px 12px", fontSize: 12 }}>
            <I name="plus" size={12} color="var(--on-primary)" /> Add equipment
          </BtnPrimary>
        </div>
        {equipment.length === 0 ? (
          <p className={styles.cardLead} style={{ marginTop: 6 }}>
            No equipment recorded yet. Click <em>Add equipment</em> to register the first item and activate its SOPs + evidence.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", border: "1px solid var(--outline-variant)", borderRadius: "var(--radius-md)", overflow: "hidden", marginTop: 10 }}>
            {equipment.map((eq) => {
              const bucket = serviceStatusBucket(eq);
              return (
                <div key={eq.id} className={styles.equipmentRow}>
                  <div>
                    <div className={styles.cardTitle} style={{ fontSize: 13 }}>{EQUIPMENT_TYPE_LABEL[eq.type]}</div>
                    <div className={styles.cardLead}>
                      {eq.makeModel}{eq.serialNumber ? ` · S/N ${eq.serialNumber}` : ""}{eq.roomLocation ? ` · ${eq.roomLocation}` : ""}
                    </div>
                  </div>
                  <div className={styles.equipmentService}>
                    <div>Next service: {formatDate(eq.nextServiceDate)}</div>
                    {bucket === "overdue"  && <Pill bg="rgba(229,57,53,0.10)" color="#e53935" small>Overdue</Pill>}
                    {bucket === "due_soon" && <Pill bg="rgba(245,124,0,0.10)" color="#b36000" small>Due soon</Pill>}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className={styles.iconBtn} title="Edit" onClick={() => setEditing(eq)}>
                      <I name="edit" size={13} color="var(--outline)" />
                    </button>
                    <button className={styles.iconBtn} title="Remove"
                      onClick={() => { if (confirm("Remove this equipment record?")) { removeEquipment(user, eq.id); setTick((t) => t + 1); } }}>
                      <I name="trash" size={13} color="var(--error)" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Site-specific appendices — all type='appendix' docs scoped to this
       * site for this pack. Each row clicks through to DocumentDetail. */}
      {(() => {
        const allPackDocs = listDocuments(tenantId, { packKey });
        const siteAppendices = allPackDocs
          .filter((d) => d.type === "appendix" && d.appliesToSiteId === site.id && d.status !== "archived");
        return (
          <Card hover={false} style={{ padding: 24, marginBottom: 18 }}>
            <div style={{ marginBottom: 14, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div className={styles.siteHeaderSub}>Site-specific appendices</div>
                <div className={styles.cardLead}>
                  Local addenda to group SOPs — site name, equipment, room, contacts, local procedure variations.
                </div>
              </div>
              <span style={{ fontSize: 11, color: "var(--on-surface-variant)" }}>
                {siteAppendices.length} appendix{siteAppendices.length === 1 ? "" : "es"}
              </span>
            </div>
            {siteAppendices.length === 0 ? (
              <div style={{
                padding: "14px 16px", background: "var(--surface-low)", borderRadius: 8,
                fontSize: 12, color: "var(--on-surface-variant)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <I name="info" size={13} color="var(--on-surface-variant)" />
                <span>No site-specific appendices yet — enable equipment-bound flags on this site's profile, then return to the pack setup wizard's Step 8 to auto-create skeletons.</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {siteAppendices.map((a) => {
                  const parent = a.parentDocumentId ? allPackDocs.find((d) => d.id === a.parentDocumentId) : null;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => onOpenDocument?.(a.id)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 12, padding: "12px 14px", background: "transparent",
                        border: "none", borderTop: "1px solid var(--outline-variant)",
                        font: "inherit", textAlign: "left", cursor: "pointer",
                      }}
                    >
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--on-surface)" }}>{a.title}</div>
                        {parent && (
                          <div style={{ fontSize: 11, color: "var(--on-surface-variant)", marginTop: 2 }}>
                            Local addendum to <em>{parent.title}</em>
                          </div>
                        )}
                      </span>
                      <DocStatusPill status={a.status} />
                      <I name="arrow" size={11} color="var(--outline)" />
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })()}

      <SpatialFilesCard user={user} site={site} packKey={packKey} />

      {editing && (
        <EquipmentForm
          existing={editing === "new" ? null : editing}
          onSave={handleEquipSave}
          onCancel={() => setEditing(null)}
          packKey={packKey}
        />
      )}
    </div>
  );
};

/* ─── Equipment register ───────────────────────────────────────────────────── */

const EquipmentForm = ({ existing, onSave, onCancel, packKey }) => {
  const allowedTypes = EQUIPMENT_TYPES_BY_PACK[packKey] ?? Object.keys(EQUIPMENT_TYPE_LABEL);
  const [data, setData] = useState({
    type: existing?.type ?? allowedTypes[0] ?? EquipmentType.autoclave,
    makeModel: existing?.makeModel ?? "",
    serialNumber: existing?.serialNumber ?? "",
    roomLocation: existing?.roomLocation ?? "",
    serviceProvider: existing?.serviceProvider ?? "",
    lastServiceDate: existing?.lastServiceDate?.split("T")[0] ?? "",
    nextServiceDate: existing?.nextServiceDate?.split("T")[0] ?? "",
    notes: existing?.notes ?? "",
  });
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  return (
    <div className={styles.scrim} onClick={onCancel}>
      <Card hover={false} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <h3 className={styles.modalTitle}>{existing ? "Edit Equipment" : "Add Equipment"}</h3>
          <button className={styles.modalClose} onClick={onCancel}><I name="xcircle" size={18} color="var(--outline)" /></button>
        </div>
        <div className={styles.wizFormGrid}>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Type</label>
            <select className={styles.wizSelect} value={data.type} onChange={(e) => set("type", e.target.value)}>
              {allowedTypes.map((k) => <option key={k} value={k}>{EQUIPMENT_TYPE_LABEL[k]}</option>)}
            </select>
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Make & Model</label>
            <input className={styles.wizInput} value={data.makeModel} onChange={(e) => set("makeModel", e.target.value)} placeholder="e.g. Melag Vacuklav 40 B+" />
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Serial Number</label>
            <input className={styles.wizInput} value={data.serialNumber} onChange={(e) => set("serialNumber", e.target.value)} />
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Room / Location</label>
            <input className={styles.wizInput} value={data.roomLocation} onChange={(e) => set("roomLocation", e.target.value)} />
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Service Provider</label>
            <input className={styles.wizInput} value={data.serviceProvider} onChange={(e) => set("serviceProvider", e.target.value)} />
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Last service date</label>
            <input type="date" className={styles.wizInput} value={data.lastServiceDate} onChange={(e) => set("lastServiceDate", e.target.value)} />
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Next service date</label>
            <input type="date" className={styles.wizInput} value={data.nextServiceDate} onChange={(e) => set("nextServiceDate", e.target.value)} />
          </div>
          <div className={styles.wizField} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.wizLabel}>Notes</label>
            <textarea rows={2} className={styles.wizInput} value={data.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <BtnPrimary onClick={() => onSave({
            ...data,
            lastServiceDate: data.lastServiceDate ? new Date(data.lastServiceDate).toISOString() : null,
            nextServiceDate: data.nextServiceDate ? new Date(data.nextServiceDate).toISOString() : null,
          })}>
            <I name="check" size={13} color="var(--on-primary)" /> Save
          </BtnPrimary>
          <BtnSecondary onClick={onCancel}>Cancel</BtnSecondary>
        </div>
      </Card>
    </div>
  );
};

/* The standalone EquipmentRegister page was removed — equipment is now an
 * inline section inside SiteProfile so users don't have to drill down twice. */

/* ─── Spatial Files card ──────────────────────────────────────────────
 * Per-site dropzones for inspection-required spatial schematics (decon
 * room layout, radiation shielding). SITE_MAP_SLOTS declares each slot's
 * `requiredFor` pack so a Decon-only site doesn't see the radiation card,
 * and vice versa. One file per (siteId × slotKey); metadata persists to
 * `site_maps`, binary blobs land in IndexedDB via the evidence file-store
 * on a subsequent slice (TODO marker in the upload callback). */
const SpatialFilesCard = ({ user, site, packKey }) => {
  const slots = SITE_MAP_SLOTS.filter((s) => s.requiredFor === packKey);
  if (slots.length === 0) return null;

  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  // eslint-disable-next-line no-unused-vars
  const _tick = tick;

  return (
    <Card hover={false} style={{ padding: 0, marginTop: 18, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px 6px", borderBottom: "1px solid var(--outline-variant)" }}>
        <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--on-surface)" }}>
          Spatial schematics
        </h3>
        <p style={{ margin: "4px 0 10px", fontSize: 12, color: "var(--on-surface-variant)", lineHeight: 1.5 }}>
          Required physical schematics for inspections — one per type. Drag & drop a PDF or image.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, padding: 14 }}>
        {slots.map((slot) => (
          <SpatialFileSlot
            key={slot.key}
            slot={slot}
            existing={getSiteMap(user.tenantId, site.id, slot.key)}
            onPick={(file) => {
              saveSiteMap(user, site.id, slot.key, {
                fileName: file.name, fileSize: file.size, mimeType: file.type,
                /* TODO: hand the File to evidence.service.uploadEvidence()
                 * and pass the returned blobId here. */
              });
              refresh();
            }}
            onRemove={() => { removeSiteMap(user, site.id, slot.key); refresh(); }}
          />
        ))}
      </div>
    </Card>
  );
};

const SpatialFileSlot = ({ slot, existing, onPick, onRemove }) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const fmt = (n) => !Number.isFinite(n) ? "—"
    : n < 1024            ? `${n} B`
    : n < 1024 * 1024     ? `${Math.round(n / 102.4) / 10} KB`
    :                       `${Math.round(n / (1024 * 102.4)) / 10} MB`;

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const f = e.dataTransfer.files?.[0]; if (f) onPick(f);
  };
  const onPickInput = (e) => {
    const f = e.target.files?.[0]; if (f) onPick(f);
    e.target.value = "";
  };

  const filled = !!existing;
  const borderColor = filled
    ? "color-mix(in srgb, #2e7d32 35%, var(--outline-variant))"
    : dragActive
      ? "var(--primary)"
      : "color-mix(in srgb, #c62828 30%, var(--outline-variant))";

  return (
    <div style={{
      border: `1px solid ${borderColor}`, borderRadius: 10, padding: 12,
      background: filled ? "color-mix(in srgb, #2e7d32 4%, var(--surface))" : "var(--surface)",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--on-surface)", lineHeight: 1.35 }}>
          {slot.label}
        </div>
        {slot.regulatorRef && (
          <span style={{
            display: "inline-block", marginTop: 4, fontSize: 10, fontWeight: 600,
            padding: "2px 7px", borderRadius: 999,
            background: "color-mix(in srgb, var(--primary) 8%, transparent)",
            color: "var(--primary)",
          }}>{slot.regulatorRef}</span>
        )}
      </div>

      {filled ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <I name="file" size={13} color="#1b5e20" />
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: "var(--on-surface)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
              {existing.fileName}
            </span>
          </div>
          <div style={{ fontSize: 10.5, color: "var(--on-surface-variant)" }}>
            {fmt(existing.fileSize)} · uploaded {formatDate(existing.uploadedAt)}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
            <button type="button" onClick={() => inputRef.current?.click()}
              style={{ background: "transparent", border: "1px solid var(--outline-variant)",
                padding: "4px 9px", borderRadius: 6, font: "inherit", fontSize: 11, fontWeight: 600,
                color: "var(--on-surface)", cursor: "pointer" }}
            >Replace</button>
            <button type="button" onClick={onRemove}
              style={{ background: "transparent", border: "1px solid var(--outline-variant)",
                padding: "4px 9px", borderRadius: 6, font: "inherit", fontSize: 11, fontWeight: 600,
                color: "#c62828", cursor: "pointer" }}
            >Remove</button>
          </div>
        </>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 6, padding: "16px 10px", border: `2px dashed ${borderColor}`,
            borderRadius: 8, background: dragActive ? "color-mix(in srgb, var(--primary) 5%, transparent)" : "var(--surface-low)",
            color: dragActive ? "var(--primary)" : "var(--on-surface-variant)",
            fontSize: 11.5, textAlign: "center", cursor: "pointer", transition: "background 0.15s",
          }}
        >
          <I name="upload" size={16} color="currentColor" />
          <div><strong>Drag & drop</strong> or click to upload</div>
          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{slot.helpText}</div>
        </div>
      )}
      <input ref={inputRef} type="file" accept={slot.accept} hidden onChange={onPickInput} />
    </div>
  );
};
