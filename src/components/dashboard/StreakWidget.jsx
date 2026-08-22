/**
 * StreakWidget — single big number of personal cadence.
 *
 * The Duolingo / GitHub / Strava lever: one prominent streak count
 * + a clear next-milestone, so the user feels the "don't break the
 * chain" pull every time they land on the dashboard.
 *
 * Tone is colour-graded by streak length:
 *   ≥ 12 → green (well-established habit)
 *   ≥ 4  → blue  (consistent cadence)
 *   < 4  → amber (warming up — gently encourage)
 */

import { I } from "../Icon";
import { getStreak } from "../../services/dashboard/streakData";
import styles from "./StreakWidget.module.css";

function toneForCount(count) {
  if (count >= 12) return "good";
  if (count >= 4)  return "info";
  return "warming";
}

export function StreakWidget({ personaId }) {
  const streak = getStreak(personaId);
  const tone   = toneForCount(streak.count);

  return (
    <section className={`${styles.streakCard} ${styles[`streakCard_${tone}`]}`}
      aria-labelledby="streak-heading">
      <header className={styles.streakHead}>
        <span className={styles.streakBadge}>
          <span aria-hidden="true">🔥</span> ON A STREAK
        </span>
      </header>

      <div className={styles.streakBigRow}>
        <span className={styles.streakNumber}>{streak.count}</span>
        <span className={styles.streakUnit}>{streak.unit}</span>
      </div>

      <h3 id="streak-heading" className={styles.streakLabel}>{streak.label}</h3>
      <p className={styles.streakDescription}>{streak.description}</p>

      <div className={styles.streakMilestoneRow}>
        <I name="target" size={11} color="currentColor" />
        <span>{streak.milestoneDistance}</span>
      </div>
    </section>
  );
}
