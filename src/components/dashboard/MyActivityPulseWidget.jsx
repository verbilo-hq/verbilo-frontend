/**
 * MyActivityPulseWidget — "your week / quarter so far" metric grid.
 *
 * Renders 4-5 stat cards in a responsive 2-up grid. Each stat pulls
 * from `getActivityPulse(personaId)` — all Verbilo-native data, no
 * PMS metrics.
 *
 * Trend indicators (↑ / ↓ / →) give an instant glance at direction
 * without needing time-series charts. Tone (good / info / warning /
 * danger) colours the trend chevron + the metric value.
 */

import { I } from "../Icon";
import { getActivityPulse } from "../../services/dashboard/activityPulse";
import styles from "./MyActivityPulseWidget.module.css";

const TREND_META = {
  up:   { icon: "arrow",      label: "Up",   className: "trendUp"   },
  down: { icon: "arrow",      label: "Down", className: "trendDown" },
  flat: { icon: "dot",        label: "Flat", className: "trendFlat" },
};

export function MyActivityPulseWidget({ personaId }) {
  const stats = getActivityPulse(personaId);

  return (
    <section className={styles.pulseCard} aria-labelledby="my-pulse-heading">
      <header className={styles.pulseHead}>
        <h3 id="my-pulse-heading" className={styles.pulseTitle}>
          <I name="barchart" size={15} color="var(--primary)" />
          My Activity Pulse
        </h3>
        <span className={styles.pulseSub}>Your week so far · all Verbilo-tracked</span>
      </header>

      <div className={styles.pulseGrid}>
        {stats.map((s) => {
          const trend = TREND_META[s.trend] ?? TREND_META.flat;
          return (
            <article key={s.id} className={`${styles.pulseStat} ${styles[`pulseStat_${s.tone}`]}`}>
              <div className={styles.pulseStatLabel}>{s.label}</div>
              <div className={styles.pulseStatRow}>
                <span className={styles.pulseStatValue}>{s.value}</span>
                <span className={`${styles.pulseStatTrend} ${styles[trend.className]}`}
                  role="img"
                  aria-label={trend.label}>
                  <I name={trend.icon} size={11} color="currentColor" />
                </span>
              </div>
              <div className={styles.pulseStatSub}>{s.sub}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
