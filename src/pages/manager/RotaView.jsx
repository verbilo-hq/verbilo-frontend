/**
 * RotaView — Slice PM-3 Rota Medium.
 *
 * PM-2 shipped: read-only grid + print.
 * PM-3 adds:
 *   • Click any cell → AssignCellModal (pick / swap / unassign)
 *   • Role-filtered staff picker (Dentist for surg1, Hygienist for
 *     surg3, etc.) sourced from the Dental Group Brighton roster
 *   • Leave-blocking: staff on approved leave that day → marked
 *     🚫 (selectable but warns)
 *   • Conflict detection: staff already assigned elsewhere that
 *     day → marked ⚠ (selectable but warns); cells in conflict
 *     gain a red outline + warning chip
 *   • Publish workflow: Draft weeks get a "Publish to staff"
 *     button; published weeks show "Unpublish to edit"
 *   • Edit-mode indicator: chip beside the week label shows draft
 *     vs published with timestamps
 *
 * Data source: `rotaStore` module — Manager Hub's Action Queue can
 * also call into it (e.g. Approve & Auto-Update Rota → applyLeaveBlock).
 *
 * Out of scope (PM-4):
 *   • Drag-drop swap between cells
 *   • Push notifications to staff on publish
 *   • Per-user "My Shifts" derivative on dashboard
 */

import { useEffect, useMemo, useState } from "react";
import { I } from "../../components/Icon";
import {
  STAFF_ROSTER,
  PRIMARY_ROLES_FOR_KIND,
  SECONDARY_ROLES_FOR_KIND,
  useRotaStore,
  assignCell,
  publishWeek,
  unpublishWeek,
  staffOnLeavePerDay,
  detectConflicts,
  isStaffBusyOn,
  addSurgery,
  removeSurgery,
  moveSurgery,
  renameSurgery,
} from "../../services/rota/rotaStore";
import { siteName } from "../../services/sites";
import { personAtSiteByRole } from "../../services/people";
import { useModalA11y } from "../../hooks/useModalA11y";
import styles from "./RotaView.module.css";

/* The rota store seeds from Southall (practice-harley) — derive the
 * display name + practice-manager name from the shared layer rather
 * than hardcoding "Brighton" / "Jessica O'Connor". */
const ROTA_SITE_ID = "site-southall";
const ROTA_SITE_NAME = siteName(ROTA_SITE_ID);
const ROTA_PM_NAME = personAtSiteByRole(ROTA_SITE_ID, "practiceManager")?.displayName ?? "Practice Manager";

const STATUS_META = {
  staffed: { label: "Staffed", className: "cellStaffed" },
  partial: { label: "Partial", className: "cellPartial" },
  open:    { label: "Vacant",  className: "cellOpen"    },
  cover:   { label: "Cover",   className: "cellCover"   },
  leave:   { label: "Leave",   className: "cellLeave"   },
};

/* ─── Root component ────────────────────────────────────────────── */

export function RotaView() {
  const { weeks, surgeries } = useRotaStore();
  const [weekIdx, setWeekIdx] = useState(0);
  const week    = weeks[weekIdx] ?? weeks[0];
  const canPrev = weekIdx > 0;
  const canNext = weekIdx < weeks.length - 1;
  const isDraft = week.status === "draft";

  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [addSpaceOpen, setAddSpaceOpen] = useState(false);

  /* Inline-rename state. null = no row in edit mode; otherwise
   * { id, draft } tracks the row being edited + its draft text.
   * Commit on Enter or blur; cancel on Escape. */
  const [renaming, setRenaming] = useState(null);
  const commitRename = () => {
    if (!renaming) return;
    renameSurgery(renaming.id, renaming.draft);
    setRenaming(null);
  };
  const cancelRename = () => setRenaming(null);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const conflicts  = useMemo(() => detectConflicts(week),    [week]);
  const onLeaveMap = useMemo(() => staffOnLeavePerDay(week), [week]);

  const handlePrint = () => window.print();

  const handlePublish = () => {
    publishWeek(week.id, ROTA_PM_NAME);
    setToast(`${week.label.split("·")[0].trim()} published — staff notified.`);
  };
  const handleUnpublish = () => {
    if (!window.confirm("Unpublish this week? Edits will become draft until re-published.")) return;
    unpublishWeek(week.id);
    setToast("Week reverted to draft for editing.");
  };

  const handleSaveCell = (payload) => {
    assignCell(week.id, editing.surgeryId, editing.dayId, payload);
    setEditing(null);
    setToast("Assignment updated.");
  };

  const summary = (() => {
    let staffed = 0, open = 0, leave = 0, closed = 0, partial = 0, cover = 0;
    for (const surg of surgeries) {
      for (const day of week.days) {
        const cell = week.assignments[surg.id]?.[day.id];
        if (cell === null || cell === undefined) { closed += 1; continue; }
        if (cell.status === "open")    { open    += 1; continue; }
        if (cell.status === "leave")   { leave   += 1; continue; }
        if (cell.status === "partial") { partial += 1; continue; }
        if (cell.status === "cover")   { cover   += 1; continue; }
        staffed += 1;
      }
    }
    return { staffed, partial, open, leave, cover, closed };
  })();

  return (
    <div className={styles.rotaPage}>
      <header className={styles.rotaHead}>
        <div className={styles.rotaHeadMain}>
          <h2 className={styles.rotaTitle}>
            <I name="calendar" size={16} color="var(--primary)" />
            Weekly Rota — {ROTA_SITE_NAME} Practice
          </h2>
          <div className={styles.rotaWeekLabelRow}>
            <p className={styles.rotaWeekLabel}>{week.label}</p>
            {/* Publish/unpublish concept retired per PM feedback —
             * the workflow added friction without clarifying who
             * sees what. Rota is always live + editable. */}
          </div>
          <p className={styles.rotaPublishedLine}>
            {week.publishedBy
              ? <>Last edited {week.publishedAt} by <strong>{week.publishedBy}</strong></>
              : <>Click any cell to edit assignments — changes save immediately</>}
          </p>
        </div>

        <div className={styles.rotaControls}>
          <button type="button" className={styles.rotaNavBtn}
            disabled={!canPrev} onClick={() => setWeekIdx((i) => Math.max(0, i - 1))}
            aria-label="Previous week">
            <I name="back" size={11} color="currentColor" /> Previous
          </button>
          <button type="button" className={styles.rotaNavBtn}
            disabled={!canNext} onClick={() => setWeekIdx((i) => Math.min(weeks.length - 1, i + 1))}
            aria-label="Next week">
            Next <I name="arrow" size={11} color="currentColor" />
          </button>

          {/* Publish / Unpublish buttons retired — rota is always live
           * + editable. Simpler mental model, fewer clicks. */}

          <button type="button" className={styles.rotaAddSpaceBtn} onClick={() => setAddSpaceOpen(true)}>
            <I name="plus" size={12} color="currentColor" />
            Add Space
          </button>

          <button type="button" className={styles.rotaPrintBtn} onClick={handlePrint}>
            <I name="printer" size={12} color="currentColor" />
            Print
          </button>
        </div>
      </header>

      <div className={styles.rotaSummary} aria-label="Week status summary">
        <SummaryChip count={summary.staffed} label="Staffed"  tone="good"    />
        <SummaryChip count={summary.partial} label="Partial"  tone="info"    />
        <SummaryChip count={summary.cover}   label="Cover"    tone="info"    />
        <SummaryChip count={summary.open}    label="Vacant"   tone="warning" />
        <SummaryChip count={summary.leave}   label="Leave"    tone="leave"   />
        <SummaryChip count={summary.closed}  label="Closed"   tone="muted"   />
      </div>

      <div className={styles.rotaGridWrap}>
        <table className={styles.rotaGrid}>
          <thead>
            <tr>
              <th className={styles.rotaCornerCell} />
              {week.days.map((d) => (
                <th key={d.id} className={`${styles.rotaDayHead} ${d.partial ? styles.rotaDayHeadPartial : ""}`}>
                  <div className={styles.rotaDayLabel}>{d.label}</div>
                  <div className={styles.rotaDayDate}>{d.date}</div>
                  {d.partial && <div className={styles.rotaDayBadge}>Half day</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {surgeries.map((surg, surgIdx) => (
              <tr key={surg.id}>
                <th className={`${styles.rotaRoomCell} ${styles[`rotaRoomKind_${surg.kind}`]}`}>
                  {renaming?.id === surg.id ? (
                    <input
                      autoFocus
                      type="text"
                      className={styles.rotaRoomLabelInput}
                      value={renaming.draft}
                      onChange={(e) => setRenaming({ id: surg.id, draft: e.target.value })}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")  commitRename();
                        if (e.key === "Escape") cancelRename();
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <button
                      type="button"
                      className={styles.rotaRoomLabelBtn}
                      title="Click to rename"
                      onClick={() => setRenaming({ id: surg.id, draft: surg.label })}
                    >
                      {surg.label}
                    </button>
                  )}
                  <div className={styles.rotaRoomKind}>{surg.kind}</div>
                  {/* Hover-revealed row controls — reorder + remove. */}
                  <div className={styles.rotaRoomRowControls}>
                    <button
                      type="button"
                      className={styles.rotaRoomMoveBtn}
                      aria-label={`Move ${surg.label} up`}
                      title="Move up"
                      disabled={surgIdx === 0}
                      onClick={() => moveSurgery(surg.id, -1)}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={styles.rotaRoomMoveBtn}
                      aria-label={`Move ${surg.label} down`}
                      title="Move down"
                      disabled={surgIdx === surgeries.length - 1}
                      onClick={() => moveSurgery(surg.id, 1)}
                    >
                      ▼
                    </button>
                  </div>
                  {/* Tiny remove affordance — appears on row hover.
                    * Guards against losing populated rows by checking
                    * whether any cell in this row is staffed. */}
                  <button
                    type="button"
                    className={styles.rotaRoomRemoveBtn}
                    aria-label={`Remove ${surg.label}`}
                    title={`Remove ${surg.label}`}
                    onClick={() => {
                      const hasAssignments = weeks.some((w) =>
                        Object.values(w.assignments[surg.id] ?? {}).some((c) => c && c.primary),
                      );
                      const msg = hasAssignments
                        ? `Remove "${surg.label}"? This will clear its assignments across every week.`
                        : `Remove "${surg.label}" from the rota?`;
                      if (!window.confirm(msg)) return;
                      removeSurgery(surg.id);
                      setToast(`Removed space: ${surg.label}`);
                    }}
                  >
                    <I name="trash" size={11} color="currentColor" />
                  </button>
                </th>
                {week.days.map((d) => {
                  const cell = week.assignments[surg.id]?.[d.id];
                  const inConflict = cell?.primary && conflicts[d.id]?.has(cell.primary);
                  return (
                    <RotaCell key={d.id} cell={cell} inConflict={inConflict}
                      onClick={() => setEditing({ surgeryId: surg.id, dayId: d.id })}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.rotaFooter}>
        <div>
          <strong>Dental Group — {ROTA_SITE_NAME} Practice.</strong>
          {" "}Wall-pinned copy of the weekly staff rota.
        </div>
        <div className={styles.rotaSignature}>
          <span>Approved by Practice Manager:</span>
          <span className={styles.rotaSignatureLine} />
          <span>Date:</span>
          <span className={styles.rotaSignatureLineShort} />
        </div>
      </footer>

      {addSpaceOpen && (
        <AddSpaceModal
          onCancel={() => setAddSpaceOpen(false)}
          onSave={(label, kind) => {
            addSurgery(label, kind);
            setAddSpaceOpen(false);
            setToast(`Added new space: ${label}`);
          }}
        />
      )}

      {editing && (
        <AssignCellModal
          week={week}
          surgery={surgeries.find((s) => s.id === editing.surgeryId)}
          day={week.days.find((d) => d.id === editing.dayId)}
          cell={week.assignments[editing.surgeryId]?.[editing.dayId]}
          conflicts={conflicts[editing.dayId] ?? new Set()}
          onLeave={onLeaveMap[editing.dayId] ?? new Set()}
          isStaffBusy={(name) => isStaffBusyOn(week, editing.dayId, name, editing.surgeryId)}
          onCancel={() => setEditing(null)}
          onSave={handleSaveCell}
        />
      )}

      {toast && (
        <div className={styles.rotaToast} role="status">
          <I name="checkcircle" size={13} color="currentColor" />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ─── Cell renderer ─────────────────────────────────────────────── */

function RotaCell({ cell, inConflict, onClick }) {
  const baseClass = `${styles.rotaCell} ${styles.rotaCellEditable} ${inConflict ? styles.cellConflict : ""}`;
  const onKeyDown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } };

  if (cell === null || cell === undefined) {
    return (
      <td className={`${baseClass} ${styles.cellClosed}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={onKeyDown}>
        <span className={styles.cellClosedLabel}>Closed</span>
        <span className={styles.cellHoverHint}>Click to assign</span>
      </td>
    );
  }
  const meta = STATUS_META[cell.status] ?? STATUS_META.staffed;

  if (cell.status === "open") {
    return (
      <td className={`${baseClass} ${styles.cellOpen}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={onKeyDown}>
        <span className={styles.cellOpenLabel}>
          <I name="alert" size={10} color="currentColor" /> Vacant
        </span>
        {cell.note && <span className={styles.cellNote}>{cell.note}</span>}
        <span className={styles.cellHoverHint}>Click to assign</span>
      </td>
    );
  }
  if (cell.status === "leave") {
    return (
      <td className={`${baseClass} ${styles.cellLeave}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={onKeyDown}>
        <span className={styles.cellLeaveLabel}>On leave</span>
        {cell.note && <span className={styles.cellNote}>{cell.note}</span>}
        <span className={styles.cellHoverHint}>Click to assign cover</span>
      </td>
    );
  }
  if (cell.status === "cover") {
    return (
      <td className={`${baseClass} ${styles.cellCover}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={onKeyDown}>
        <span className={styles.cellCoverLabel}>{cell.primary}</span>
        <span className={styles.cellRolePill}>{cell.primaryRole}</span>
      </td>
    );
  }

  return (
    <td className={`${baseClass} ${styles[meta.className]}`} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={onKeyDown}
      title={inConflict ? `${cell.primary} is double-booked this day` : ""}>
      {inConflict && (
        <span className={styles.cellConflictBadge}>
          <I name="alert" size={9} color="currentColor" /> CONFLICT
        </span>
      )}
      <div className={styles.cellPrimary}>{cell.primary}</div>
      <div className={styles.cellPrimaryRole}>{cell.primaryRole}</div>
      {cell.secondary && (
        <div className={styles.cellSecondary}>
          + {cell.secondary} <span className={styles.cellSecondaryRole}>({cell.secondaryRole})</span>
        </div>
      )}
      {cell.note && <div className={styles.cellNote}>{cell.note}</div>}
    </td>
  );
}

/* ─── Add Space modal ───────────────────────────────────────────── */

function AddSpaceModal({ onCancel, onSave }) {
  const dialogRef = useModalA11y(onCancel);
  const [label, setLabel] = useState("");
  const [kind, setKind]   = useState("dentist");

  const canSave = label.trim().length > 0;

  return (
    <div className={styles.modalScrim} onClick={onCancel}>
      <div ref={dialogRef} className={styles.addSpaceModal} onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-labelledby="add-space-title">
        <header className={styles.modalHead}>
          <div>
            <div className={styles.modalEyebrow}>Rota · Spaces</div>
            <h3 id="add-space-title" className={styles.modalTitle}>Add a new space</h3>
          </div>
          <button type="button" className={styles.modalClose} onClick={onCancel} aria-label="Close">×</button>
        </header>

        <div className={styles.addSpaceBody}>
          <label className={styles.addSpaceField}>
            <span className={styles.addSpaceLabel}>Name</span>
            <input
              type="text"
              className={styles.addSpaceInput}
              value={label}
              placeholder="e.g. Surgery 4, Reception 2, Implant Suite"
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
            />
          </label>

          <label className={styles.addSpaceField}>
            <span className={styles.addSpaceLabel}>Type</span>
            <select className={styles.addSpaceInput} value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="dentist">Dentist surgery</option>
              <option value="hygiene">Hygiene surgery</option>
              <option value="reception">Reception desk</option>
              <option value="decon">Decon room</option>
            </select>
          </label>

          <p className={styles.addSpaceHint}>
            New space starts empty across every week. Click any cell to assign staff.
          </p>
        </div>

        <footer className={styles.modalFooter}>
          <button type="button" className={styles.modalCancelBtn} onClick={onCancel}>Cancel</button>
          <button type="button" className={styles.modalSaveBtn} disabled={!canSave}
            onClick={() => onSave(label.trim(), kind)}>
            <I name="plus" size={11} color="currentColor" />
            Add Space
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ─── Summary chip ──────────────────────────────────────────────── */

function SummaryChip({ count, label, tone }) {
  return (
    <span className={`${styles.summaryChip} ${styles[`summaryChip_${tone}`]}`}>
      <strong>{count}</strong>
      <span>{label}</span>
    </span>
  );
}

/* ─── AssignCellModal ───────────────────────────────────────────── */

function AssignCellModal({ week, surgery, day, cell, conflicts, onLeave, isStaffBusy, onCancel, onSave }) {
  const dialogRef = useModalA11y(onCancel);
  const [primary,    setPrimary]    = useState(cell?.primary   ?? "");
  const [secondary,  setSecondary]  = useState(cell?.secondary ?? "");
  const [note,       setNote]       = useState(cell?.note      ?? "");
  const [markClosed, setMarkClosed] = useState(cell === null);

  const primaryRoles   = PRIMARY_ROLES_FOR_KIND[surgery.kind]   ?? [];
  const secondaryRoles = SECONDARY_ROLES_FOR_KIND[surgery.kind] ?? [];

  const primaryOptions   = STAFF_ROSTER.filter((s) => primaryRoles.includes(s.role));
  const secondaryOptions = STAFF_ROSTER.filter((s) => secondaryRoles.includes(s.role));

  const annotateOption = (name) => {
    const flags = [];
    if (onLeave.has(name))                                  flags.push("🚫 leave");
    if (isStaffBusy(name) && name !== (cell?.primary ?? "")) flags.push("⚠ busy");
    return flags.length ? `${name}  (${flags.join(" · ")})` : name;
  };

  const handleSave = () => {
    if (markClosed) { onSave(null); return; }
    if (!primary) {
      onSave({ primary: null, primaryRole: null, status: "open", note: note.trim() || "Awaiting cover" });
      return;
    }
    const primaryRoleEntry   = STAFF_ROSTER.find((s) => s.name === primary)?.role;
    const secondaryRoleEntry = secondary ? STAFF_ROSTER.find((s) => s.name === secondary)?.role : null;
    onSave({
      primary,
      primaryRole:   primaryRoleEntry,
      secondary:     secondary || undefined,
      secondaryRole: secondaryRoleEntry || undefined,
      status:        "staffed",
      note:          note.trim() || undefined,
    });
  };

  const warning = primary && (onLeave.has(primary) || (isStaffBusy(primary) && primary !== (cell?.primary ?? "")));

  return (
    <div className={styles.modalScrim} onClick={onCancel}>
      <div ref={dialogRef} className={styles.modalDialog} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Assign rota cell">
        <header className={styles.modalHead}>
          <div>
            <div className={styles.modalEyebrow}>
              {surgery.label} · {day.weekday} {day.date}
            </div>
            <h3 className={styles.modalTitle}>Assign cell</h3>
          </div>
          <button type="button" className={styles.modalClose} onClick={onCancel} aria-label="Close">×</button>
        </header>

        <div className={styles.modalBody}>
          <label className={styles.modalField}>
            <span className={styles.modalFieldLabel}>Primary ({primaryRoles.join(" / ")})</span>
            <select
              className={styles.modalInput}
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              disabled={markClosed}
            >
              <option value="">— Vacant —</option>
              {primaryOptions.map((s) => (
                <option key={s.name} value={s.name}>{annotateOption(s.name)}</option>
              ))}
            </select>
          </label>

          {secondaryRoles.length > 0 && (
            <label className={styles.modalField}>
              <span className={styles.modalFieldLabel}>Secondary ({secondaryRoles.join(" / ")})</span>
              <select
                className={styles.modalInput}
                value={secondary}
                onChange={(e) => setSecondary(e.target.value)}
                disabled={markClosed}
              >
                <option value="">— None —</option>
                {secondaryOptions.map((s) => (
                  <option key={s.name} value={s.name}>{annotateOption(s.name)}</option>
                ))}
              </select>
            </label>
          )}

          <label className={styles.modalField}>
            <span className={styles.modalFieldLabel}>Note (optional)</span>
            <input
              type="text"
              className={styles.modalInput}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Supervisor: Dr Patel · Half day · 9:00 – 13:00"
              disabled={markClosed}
            />
          </label>

          <label className={styles.modalCheckboxRow}>
            <input
              type="checkbox"
              checked={markClosed}
              onChange={(e) => setMarkClosed(e.target.checked)}
            />
            <span>Close this room for the day</span>
          </label>

          {warning && (
            <div className={styles.modalWarning}>
              <I name="alert" size={12} color="currentColor" />
              <span>
                {onLeave.has(primary)
                  ? <>{primary} is on approved leave this day.</>
                  : <>{primary} is already assigned to another room this day.</>}
                {" "}You can still save, but consider an alternative.
              </span>
            </div>
          )}
        </div>

        <footer className={styles.modalFoot}>
          <button type="button" className={styles.modalCancelBtn} onClick={onCancel}>Cancel</button>
          <button type="button" className={styles.modalSaveBtn} onClick={handleSave}>
            <I name="check" size={11} color="currentColor" />
            Save assignment
          </button>
        </footer>
      </div>
    </div>
  );
}
