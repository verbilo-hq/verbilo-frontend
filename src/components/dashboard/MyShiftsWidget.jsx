/**
 * MyShiftsWidget — Slice PM-4.
 *
 * Persona-aware "next 3 shifts" readout on the dashboard. Reads
 * directly from the shared rotaStore so changes the PM makes in
 * the Rota tab cascade here automatically:
 *   • PM approves Hannah's leave → her My Shifts widget loses
 *     those 5 days + reflects the leave block
 *   • PM swaps Sophia from Surgery 1 to Surgery 2 → Sophia's
 *     widget updates which room is next
 *   • PM publishes Week 23 → published chip appears on the row
 *
 * Empty-state cases (graceful):
 *   • Persona maps to a name that's not in the Brighton roster
 *     (e.g. Maria Lopez — Hove; Chloe Brooks — Hove) → polite
 *     "you're not on this site's rota" note
 *   • Persona is in the roster but has no upcoming shifts (e.g.
 *     full week of leave) → "no shifts in the visible window"
 *
 * Manager personas (PM / AM / CD) hide this widget entirely — the
 * conditional gate lives in DashboardPage. They own the rota, they
 * don't consume it as a personal queue.
 */

import { useMemo } from "react";
import { I } from "../Icon";
import { useRotaStore, getMyShifts, STAFF_ROSTER } from "../../services/rota/rotaStore";
import styles from "./MyShiftsWidget.module.css";

const ROOM_KIND_META = {
  dentist:   { color: "var(--primary)", label: "Surgery"   },
  hygiene:   { color: "#ef6c00",        label: "Hygiene"   },
  reception: { color: "#6a1b9a",        label: "Reception" },
  decon:     { color: "#00838f",        label: "Decon"     },
};

export function MyShiftsWidget({ personaDisplayName }) {
  /* Subscribe to the rota store so this re-renders whenever an
   * assignment / leave / publish mutation fires. The hook's value
   * itself isn't used — we read via getMyShifts() for compactness. */
  useRotaStore();

  const shifts = useMemo(
    () => getMyShifts(personaDisplayName, { limit: 3 }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [personaDisplayName, useRotaStore],
  );

  const inRoster = STAFF_ROSTER.some((s) => s.name === personaDisplayName);

  return (
    <section className={styles.myShiftsCard} aria-labelledby="my-shifts-heading">
      <header className={styles.myShiftsHead}>
        <h3 id="my-shifts-heading" className={styles.myShiftsTitle}>
          <I name="calendar" size={15} color="var(--primary)" />
          My Next Shifts
        </h3>
        <span className={styles.myShiftsSub}>Southall Practice rota</span>
      </header>

      {!inRoster ? (
        <EmptyState
          icon="map"
          title="You're not on this site's rota"
          body={`The Southall rota doesn't include ${personaDisplayName}. Multi-site rotas land in a future release.`}
        />
      ) : shifts.length === 0 ? (
        <EmptyState
          icon="checkcircle"
          title="No upcoming shifts"
          body="You're not scheduled in the visible 2-week window. Speak to your Practice Manager if this looks wrong."
        />
      ) : (
        <ul className={styles.shiftList}>
          {shifts.map((shift, i) => {
            const meta = ROOM_KIND_META[shift.surgeryKind] ?? { color: "var(--on-surface-variant)" };
            return (
              <li key={i} className={styles.shiftRow}
                style={{ "--shift-accent": meta.color }}>
                <div className={styles.shiftDateCol}>
                  <div className={styles.shiftDayLabel}>{shift.weekday.slice(0, 3)}</div>
                  <div className={styles.shiftDate}>{shift.date}</div>
                  {shift.partial && <div className={styles.shiftPartialBadge}>½ day</div>}
                </div>
                <div className={styles.shiftMain}>
                  <div className={styles.shiftSurgeryRow}>
                    <span className={styles.shiftSurgery}>{shift.surgery}</span>
                    {!shift.isPrimary && <span className={styles.shiftRolePill}>Chairside</span>}
                    {shift.isPrimary  && <span className={styles.shiftRolePill}>{shift.role}</span>}
                  </div>
                  {shift.pairedWith && (
                    <div className={styles.shiftPairedRow}>
                      with <strong>{shift.pairedWith}</strong>
                    </div>
                  )}
                  {shift.note && (
                    <div className={styles.shiftNote}>{shift.note}</div>
                  )}
                </div>
                <div className={styles.shiftStatusCol}>
                  {shift.published
                    ? <span className={styles.shiftPubChip} title="Rota week is published">✓</span>
                    : <span className={styles.shiftDraftChip} title="Draft — may still change">●</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function EmptyState({ icon, title, body }) {
  return (
    <div className={styles.emptyState}>
      <I name={icon} size={20} color="var(--on-surface-variant)" />
      <div className={styles.emptyTitle}>{title}</div>
      <p className={styles.emptyBody}>{body}</p>
    </div>
  );
}
