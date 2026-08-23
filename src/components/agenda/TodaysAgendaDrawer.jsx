/**
 * TodaysAgendaDrawer — global right-side slide-out task dispatcher.
 *
 * Mounted once at App root inside the AgendaProvider so it's available
 * from any page. The trigger (calendar icon in AppHeader) flips
 * `drawerOpen` via useAgenda(). When open, the drawer slides in from
 * the right and displays the day's compliance tasks grouped by status:
 *   🔴 Overdue   — items that should have been done by now
 *   🟡 Remaining — items still due today
 *   🟢 Completed — items the operator has signed off (live state)
 *
 * Click "Start Task" on any row → renders a LogModal scoped to that
 * template. Submit fires markCompleted() on the shared context, which:
 *   • flips completedToday[templateId] → row moves to the Completed
 *     bucket here and the Operational Logs page widgets update
 *   • prepends an entry to the Recent Activity Ledger
 *   • fires the global toast
 *
 * The drawer stays open underneath the modal scrim; closing the modal
 * reveals the updated drawer state without any extra navigation.
 */

import { useEffect, useMemo, useState } from "react";
import { I } from "../Icon";
import { useAuth } from "../../auth/AuthContext";
import { useAgenda } from "../../contexts/AgendaContext";
import { getLogbookTemplate } from "../../services/logbooks/logbookTemplates";
import { LogModal } from "../../pages/logbooks/LogModal";
import styles from "./TodaysAgendaDrawer.module.css";

/* Hardcoded agenda for the local-dev MVP. When the backend lands, this
 * becomes GET /agenda?date=today&siteId=… with the cadence engine
 * deciding which templates should appear on which day. */
const AGENDA_ITEMS = [
  {
    templateId:  "protein_residue_weekly",
    displayTitle:"Protein Residue Test",
    cadence:     "Weekly Cadence",
    /* defaultStatus is the *initial* state — once the user signs
     * the task off, completedToday in context overrides it. */
    defaultStatus: "overdue",
  },
  {
    templateId:   "soil_test_weekly",
    displayTitle: "Soil Test",
    cadence:      "Weekly Cadence",
    defaultStatus: "overdue",
  },
  {
    templateId:   "vaccine_fridge_daily",
    displayTitle: "Clinical Vaccine Fridge Temp",
    cadence:      "Daily Cadence",
    defaultStatus: "remaining",
  },
  {
    templateId:   "autoclave_daily",
    displayTitle: "Autoclave 1 Parameter Check",
    cadence:      "Daily Cadence",
    /* Pre-completed via AgendaProvider's PRE_COMPLETED seed — the
     * default here is "completed" so the row renders correctly
     * even if the seed is ever removed. */
    defaultStatus: "completed",
  },
];

export function TodaysAgendaDrawer() {
  const { drawerOpen, closeDrawer, completedToday, markCompleted } = useAgenda();
  const { user } = useAuth();

  /* Drawer-local modal state — opening "Start Task" mounts a LogModal
   * inside this component so closing it leaves the drawer untouched. */
  const [openTemplateId, setOpenTemplateId] = useState(null);

  /* ESC to close the drawer (modal has its own ESC handler so it takes
   * precedence when both are open — the outer listener runs after the
   * modal's already swallowed the event via its own cleanup path). */
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !openTemplateId) closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, openTemplateId, closeDrawer]);

  /* Today's date — formatted as "Sunday, 24 May 2026" per the brief.
   * Uses en-GB so weekday + month names match UK convention. */
  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day:     "numeric",
      month:   "long",
      year:    "numeric",
    });
  }, []);

  /* Compute the live status of each agenda row by merging the static
   * defaultStatus with completedToday from context. */
  const rowsByStatus = useMemo(() => {
    const overdue = [];
    const remaining = [];
    const completed = [];
    for (const item of AGENDA_ITEMS) {
      const isDone = !!completedToday[item.templateId];
      if (isDone) {
        completed.push(item);
      } else if (item.defaultStatus === "overdue") {
        overdue.push(item);
      } else {
        remaining.push(item);
      }
    }
    return { overdue, remaining, completed };
  }, [completedToday]);

  const openTpl = openTemplateId ? getLogbookTemplate(openTemplateId) : null;

  const handleStartTask  = (templateId) => setOpenTemplateId(templateId);
  const handleCancelTask = () => setOpenTemplateId(null);
  const handleSubmitTask = (payload) => {
    if (!openTemplateId) return;
    const operator = (payload.signature || "").trim()
      || user?.displayName
      || "Unknown operator";
    markCompleted(openTemplateId, { ...payload, signature: operator });
    setOpenTemplateId(null);
    // Drawer stays open so the user sees the row jump to Completed.
  };

  return (
    <>
      {/* Scrim — only renders when drawer is open. Click to close,
       * unless the modal is on top (then the modal scrim handles it). */}
      <div
        className={`${styles.scrim} ${drawerOpen ? styles.scrimOpen : ""}`}
        onClick={() => !openTemplateId && closeDrawer()}
        aria-hidden="true"
      />

      {/* When closed the panel stays mounted (CSS slide-out), so mark it
          inert to pull its Close / Start-Task buttons out of the tab order
          and the a11y tree — otherwise they stay focusable off-screen. */}
      <aside
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label="Today's Compliance Agenda"
        aria-hidden={!drawerOpen}
        {...(!drawerOpen ? { inert: "" } : {})}
      >
        <header className={styles.head}>
          <div className={styles.headMain}>
            <h2 className={styles.title}>Today&apos;s Compliance Agenda</h2>
            <div className={styles.date}>{todayLabel}</div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeDrawer}
            aria-label="Close agenda"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          {rowsByStatus.overdue.length > 0 && (
            <Section
              tone="overdue"
              icon="🔴"
              label="OVERDUE"
              count={rowsByStatus.overdue.length}
              items={rowsByStatus.overdue}
              onStart={handleStartTask}
            />
          )}
          {rowsByStatus.remaining.length > 0 && (
            <Section
              tone="remaining"
              icon="🟡"
              label="REMAINING TODAY"
              count={rowsByStatus.remaining.length}
              items={rowsByStatus.remaining}
              onStart={handleStartTask}
            />
          )}
          {rowsByStatus.completed.length > 0 && (
            <Section
              tone="completed"
              icon="🟢"
              label="COMPLETED"
              count={rowsByStatus.completed.length}
              items={rowsByStatus.completed}
              onStart={handleStartTask}
              done
            />
          )}
        </div>
      </aside>

      {/* In-place modal — renders on top of the drawer + page when a
       * row is being logged. Reuses the same LogModal the Operational
       * Logs page uses, so the form UX is identical regardless of
       * which surface the task was started from. */}
      {openTpl && (
        <LogModal
          template={openTpl}
          displayTitle={AGENDA_ITEMS.find((i) => i.templateId === openTemplateId)?.displayTitle ?? openTpl.title}
          site={null}
          defaultOperatorName={user?.displayName ?? ""}
          onCancel={handleCancelTask}
          onSubmit={handleSubmitTask}
        />
      )}
    </>
  );
}

/* ─── Section block ─────────────────────────────────────────────────── */

function Section({ tone, icon, label, count, items, onStart, done = false }) {
  return (
    <section className={styles.section} aria-label={label}>
      <header className={`${styles.sectionHead} ${styles[`sectionHead_${tone}`]}`}>
        <span className={styles.sectionEmoji} aria-hidden="true">{icon}</span>
        <span className={styles.sectionLabel}>{label}</span>
        <span className={styles.sectionCount}>{count}</span>
      </header>

      <div className={styles.sectionBody}>
        {items.map((item) => (
          <AgendaRow
            key={item.templateId}
            item={item}
            tone={tone}
            onStart={() => onStart(item.templateId)}
            done={done}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Individual row ────────────────────────────────────────────────── */

function AgendaRow({ item, tone, onStart, done }) {
  return (
    <article className={`${styles.row} ${styles[`row_${tone}`]}`}>
      {done ? (
        <>
          <span className={styles.rowCheck} aria-hidden="true">☑</span>
          <div className={styles.rowMain}>
            <div className={`${styles.rowTitle} ${styles.rowTitleDone}`}>
              {item.displayTitle}
            </div>
            <div className={styles.rowCadence}>{item.cadence}</div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.rowMain}>
            <div className={styles.rowTitle}>{item.displayTitle}</div>
            <div className={styles.rowCadence}>{item.cadence}</div>
          </div>
          <button
            type="button"
            className={`${styles.startBtn} ${styles[`startBtn_${tone}`]}`}
            onClick={onStart}
          >
            <I name="edit" size={13} />
            Start Task
          </button>
        </>
      )}
    </article>
  );
}
