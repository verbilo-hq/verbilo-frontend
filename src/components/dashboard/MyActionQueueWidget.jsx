/**
 * MyActionQueueWidget — "what needs YOU today" for the active persona.
 *
 * Replaces the previous hardcoded 4-tile grid that lied about being
 * "role-based". Pulls items from `getActionQueue(personaId)` — every
 * item is Verbilo-native, no PMS data.
 *
 * Each row has a left severity rail (urgent/warning/info), action
 * label + due-by chip, and a CTA button that deep-links into the
 * source workspace via `onNav`.
 *
 * Empty state: gentle congratulations + suggestion to revisit later.
 */

import { I } from "../Icon";
import { getActionQueue } from "../../services/dashboard/actionQueue";
import styles from "./MyActionQueueWidget.module.css";

const SEVERITY_META = {
  urgent:  { dot: "#c62828", label: "Urgent"  },
  warning: { dot: "#ef6c00", label: "Warning" },
  info:    { dot: "#1565c0", label: "Info"    },
};

export function MyActionQueueWidget({ personaId, onNav }) {
  const items = getActionQueue(personaId);

  return (
    <section className={styles.queueCard} aria-labelledby="my-queue-heading">
      <header className={styles.queueHead}>
        <h3 id="my-queue-heading" className={styles.queueTitle}>
          <I name="checksquare" size={15} color="var(--primary)" />
          My Action Queue
        </h3>
        <span className={styles.queueCount}>
          {items.length} item{items.length === 1 ? "" : "s"} for you
        </span>
      </header>

      {items.length === 0 ? (
        <div className={styles.queueEmpty}>
          <I name="checkcircle" size={22} color="#2e7d32" />
          <strong>You&apos;re all clear.</strong>
          <span>No outstanding actions on your plate today.</span>
        </div>
      ) : (
        <ul className={styles.queueList}>
          {items.map((it) => {
            const meta = SEVERITY_META[it.severity] ?? SEVERITY_META.info;
            return (
              <li key={it.id} className={styles.queueRow}>
                <span
                  className={styles.queueSeverityRail}
                  style={{ background: meta.dot }}
                  role="img"
                  aria-label={meta.label}
                />
                <div className={styles.queueBody}>
                  <div className={styles.queueLabel}>{it.label}</div>
                  <div className={styles.queueDue}>
                    <I name="clock" size={10} color="currentColor" />
                    Due {it.due}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.queueCta}
                  onClick={() => onNav?.(it.ctaNav)}
                >
                  {it.ctaLabel}
                  <I name="arrow" size={11} color="currentColor" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
