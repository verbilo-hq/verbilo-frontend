/**
 * Admin Centre → SaaS Master Template Library.
 *
 * Platform-owned SOP / policy templates. Browse + edit per pack. Clients
 * never see this UI — when they start a governance pack, the system clones
 * the relevant templates into their tenant as drafts (wired in Slice 1C).
 */

import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { Pill } from "../../components/ui/Pill";
import { I } from "../../components/Icon";
import {
  listMasterPacks, listMasterTemplates, getMasterTemplate,
  createMasterTemplate, updateMasterTemplate, deleteMasterTemplate,
  ensureMasterTemplatesSeed, resetMasterTemplates, MASTER_TEMPLATE_STATUS,
} from "../../services/governance/masterTemplates.service";
import { SopPreview } from "../../components/SopPreview";
import styles from "./MasterTemplateLibrary.module.css";

const STATUS_META = {
  active:  { label: "Active",  color: "#2e7d32" },
  draft:   { label: "Draft",   color: "#1565c0" },
  retired: { label: "Retired", color: "#757575" },
};
const TYPE_LABEL = {
  policy: "Policy", sop: "SOP", log_template: "Log template",
  audit_tool: "Audit tool", evidence_template: "Evidence template", appendix: "Appendix",
};

const Field = ({ label, children, hint }) => (
  <div className={styles.field}>
    <label className={styles.label}>{label}{hint && <span className={styles.hint}> · {hint}</span>}</label>
    {children}
  </div>
);

export function MasterTemplateLibrary() {
  const packs = listMasterPacks();
  const [activePackKey, setActivePackKey] = useState(packs[0]?.key ?? "decontamination_ipc");
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null); // null | "new" | <id>
  const [tick, setTick] = useState(0);

  useEffect(() => {
    ensureMasterTemplatesSeed();
    setRows(listMasterTemplates(activePackKey));
  }, [activePackKey, tick]);

  const refresh = () => setTick((t) => t + 1);

  const onNew = () => setSelected("new");
  const onOpen = (id) => setSelected(id);
  const onCloseEditor = () => setSelected(null);
  const onSave = (draft) => {
    if (selected === "new") {
      createMasterTemplate({ ...draft, packKey: activePackKey });
    } else {
      updateMasterTemplate(selected, draft);
    }
    onCloseEditor();
    refresh();
  };
  const onDelete = (id) => {
    if (!confirm("Delete this master template? Clients who haven't activated it yet won't be able to.")) return;
    deleteMasterTemplate(id);
    if (selected === id) onCloseEditor();
    refresh();
  };

  const editingRow = selected && selected !== "new" ? getMasterTemplate(selected) : null;

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>SaaS Master Template Library</h1>
          <p className={styles.lead}>
            Platform-owned SOP &amp; policy templates. When a client starts a governance pack, the
            relevant templates clone into their tenant as drafts.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <BtnSecondary onClick={() => {
            if (!confirm("Reset the library to platform defaults?\n\nThis wipes any local edits and re-imports the seed SOPs (currently 19 Decontamination & IPC templates).")) return;
            resetMasterTemplates();
            refresh();
          }}>
            <I name="refresh" size={13} color="var(--outline)" /> Reset to defaults
          </BtnSecondary>
          <BtnPrimary onClick={onNew}>
            <I name="plus" size={13} color="var(--on-primary)" /> New template
          </BtnPrimary>
        </div>
      </header>

      <div className={styles.packStrip}>
        {packs.map((p) => {
          const active = activePackKey === p.key;
          const count = listMasterTemplates(p.key).length;
          return (
            <button
              key={p.key}
              onClick={() => { setActivePackKey(p.key); onCloseEditor(); }}
              className={[
                styles.packChip,
                active ? styles.packChipActive : "",
                p.clientSpecific ? styles.packChipClient : "",
              ].filter(Boolean).join(" ")}
              title={p.clientSpecific ? "Starter templates provided — significant local customisation expected per practice." : undefined}
            >
              <I name={p.icon} size={13} color={active ? "var(--primary)" : "var(--on-surface-variant)"} />
              <span>{p.label}</span>
              {p.clientSpecific && <span className={styles.packChipClientLabel}>Client</span>}
              <span className={styles.packCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <Card hover={false} className={styles.empty}>
          <I name="file" size={28} color="var(--outline-variant)" />
          <p>No master templates for this pack yet. Click <strong>New template</strong> to add one.</p>
        </Card>
      ) : (
        <Card hover={false} style={{ overflow: "hidden" }}>
          <div className={styles.tableHead}>
            <span>Title</span>
            <span>Type</span>
            <span>Category</span>
            <span>Version</span>
            <span>Status</span>
            <span>Updated</span>
            <span></span>
          </div>
          {rows.map((r) => {
            const sc = STATUS_META[r.status] ?? STATUS_META.active;
            return (
              <div key={r.id} className={styles.tableRow} onClick={() => onOpen(r.id)}>
                <span className={styles.titleCell}>
                  <I name="file" size={14} color="var(--outline)" />
                  <span>{r.title}</span>
                </span>
                <span>{TYPE_LABEL[r.type] ?? r.type}</span>
                <span className={styles.dim}>{r.category}</span>
                <span className={styles.dim}>v{r.version}</span>
                <span>
                  <Pill bg={`color-mix(in srgb, ${sc.color} 14%, transparent)`} color={sc.color} small>{sc.label}</Pill>
                </span>
                <span className={styles.dim}>{r.updatedAt?.split("T")[0] ?? "—"}</span>
                <span className={styles.rowActions}>
                  <button onClick={(e) => { e.stopPropagation(); onOpen(r.id); }} className={styles.iconBtn} title="Edit">
                    <I name="edit" size={13} color="var(--outline)" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(r.id); }} className={styles.iconBtn} title="Delete">
                    <I name="trash" size={13} color="var(--error)" />
                  </button>
                </span>
              </div>
            );
          })}
        </Card>
      )}

      {(selected === "new" || editingRow) && (
        <TemplateEditor
          template={editingRow}
          isNew={selected === "new"}
          onSave={onSave}
          onCancel={onCloseEditor}
        />
      )}
    </div>
  );
}

function TemplateEditor({ template, isNew, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => template ?? {
    title: "", type: "sop", category: "", status: MASTER_TEMPLATE_STATUS.draft,
    version: "1.0", references: [], requiredFlag: "", linkedAuditType: "",
    defaultReviewCycleMonths: 12, acknowledgementRequired: true, body: "",
  });
  const patch = (p) => setDraft((d) => ({ ...d, ...p }));
  const refsAsText = Array.isArray(draft.references) ? draft.references.join(", ") : (draft.references ?? "");

  return (
    <div className={styles.editorScrim} onClick={onCancel}>
      <div className={styles.editorCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.editorHead}>
          <h3 className={styles.editorTitle}>{isNew ? "New master template" : "Edit master template"}</h3>
          <button onClick={onCancel} className={styles.iconBtn}><I name="xcircle" size={18} color="var(--outline)" /></button>
        </div>
        <div className={styles.editorBody}>
          <div className={styles.editorGrid}>
            <Field label="Title">
              <input className={styles.input} value={draft.title ?? ""}
                onChange={(e) => patch({ title: e.target.value })} placeholder="e.g. Autoclave Operation SOP" />
            </Field>
            <Field label="Category">
              <input className={styles.input} value={draft.category ?? ""}
                onChange={(e) => patch({ category: e.target.value })} placeholder="e.g. decontamination" />
            </Field>
            <Field label="Type">
              <select className={styles.input} value={draft.type ?? "sop"} onChange={(e) => patch({ type: e.target.value })}>
                <option value="sop">SOP</option>
                <option value="policy">Policy</option>
                <option value="log_template">Log template</option>
                <option value="audit_tool">Audit tool</option>
                <option value="evidence_template">Evidence template</option>
                <option value="appendix">Appendix</option>
              </select>
            </Field>
            <Field label="Status">
              <select className={styles.input} value={draft.status ?? "active"} onChange={(e) => patch({ status: e.target.value })}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="retired">Retired</option>
              </select>
            </Field>
            <Field label="Version">
              <input className={styles.input} value={draft.version ?? ""}
                onChange={(e) => patch({ version: e.target.value })} placeholder="1.0" />
            </Field>
            <Field label="Default review cycle (months)">
              <input className={styles.input} type="number" value={draft.defaultReviewCycleMonths ?? 12}
                onChange={(e) => patch({ defaultReviewCycleMonths: Number(e.target.value) })} />
            </Field>
            <Field label="Required site flag" hint="optional — gates per-site activation">
              <input className={styles.input} value={draft.requiredFlag ?? ""}
                onChange={(e) => patch({ requiredFlag: e.target.value || null })} placeholder="e.g. autoclave" />
            </Field>
            <Field label="Linked audit type" hint="optional">
              <input className={styles.input} value={draft.linkedAuditType ?? ""}
                onChange={(e) => patch({ linkedAuditType: e.target.value || null })} placeholder="e.g. decontamination" />
            </Field>
            <Field label="References" hint="comma-separated">
              <input className={styles.input} value={refsAsText}
                onChange={(e) => patch({ references: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                placeholder="HTM 01-05, CQC Reg 12" />
            </Field>
            <Field label="Acknowledgement required">
              <label className={styles.checkRow}>
                <input type="checkbox" checked={!!draft.acknowledgementRequired}
                  onChange={(e) => patch({ acknowledgementRequired: e.target.checked })} />
                <span>Staff must acknowledge on publish</span>
              </label>
            </Field>
          </div>
          <Field label="Body (markdown)" hint="Edit on the left, live preview on the right">
            <div className={styles.bodySplit}>
              <textarea className={styles.body} value={draft.body ?? ""}
                onChange={(e) => patch({ body: e.target.value })}
                rows={20}
                placeholder="# Template title&#10;&#10;Markdown body — the canonical text clients clone into their drafts." />
              <SopPreview body={draft.body ?? ""} template={draft} />
            </div>
          </Field>
        </div>
        <div className={styles.editorFooter}>
          <BtnSecondary onClick={onCancel}>Cancel</BtnSecondary>
          <BtnPrimary onClick={() => onSave(draft)} disabled={!draft.title?.trim()}>
            <I name="check" size={13} color="var(--on-primary)" /> Save template
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
}

