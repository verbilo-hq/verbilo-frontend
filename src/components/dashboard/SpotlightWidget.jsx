/**
 * SpotlightWidget — weekly-rotating "always something fresh" slot.
 *
 * Pulls from spotlightLibrary keyed by personaId, rotates by ISO
 * week so each user gets ~6 weeks of unique content before repeats.
 * Includes manual prev / next chevrons so users can step through
 * past spotlights (and so demos can flip through them on cue).
 */

import { useState } from "react";
import { I } from "../Icon";
import {
  SPOTLIGHT_KIND_META,
  getSpotlightAt,
} from "../../services/dashboard/spotlightLibrary";
import styles from "./SpotlightWidget.module.css";

export function SpotlightWidget({ personaId, onNav }) {
  const [offset, setOffset] = useState(0);
  const { item, position, total } = getSpotlightAt(personaId, offset);
  const meta = SPOTLIGHT_KIND_META[item.kind] ?? { label: item.kind, emoji: "✨", accent: "#525b76" };

  const handleCta = () => {
    if (item.cta?.nav && onNav) onNav(item.cta.nav);
  };

  return (
    <section className={styles.spotlightCard}
      style={{ "--spotlight-accent": meta.accent }}
      aria-labelledby="spotlight-heading">
      <header className={styles.spotlightHead}>
        <span className={styles.spotlightChip}>
          <span aria-hidden="true">{meta.emoji}</span>
          {meta.label}
        </span>
        <div className={styles.spotlightPaginator}>
          <button type="button" className={styles.spotlightPagBtn}
            onClick={() => setOffset((o) => o - 1)}
            aria-label="Previous spotlight">
            <I name="back" size={11} color="currentColor" />
          </button>
          <span className={styles.spotlightCounter}>{position} / {total}</span>
          <button type="button" className={styles.spotlightPagBtn}
            onClick={() => setOffset((o) => o + 1)}
            aria-label="Next spotlight">
            <I name="arrow" size={11} color="currentColor" />
          </button>
        </div>
      </header>

      <h3 id="spotlight-heading" className={styles.spotlightTitle}>{item.title}</h3>
      <p className={styles.spotlightBody}>{item.body}</p>

      <footer className={styles.spotlightFoot}>
        {item.attribution && (
          <span className={styles.spotlightAttribution}>— {item.attribution}</span>
        )}
        {item.cta && (
          <button type="button" className={styles.spotlightCta} onClick={handleCta}>
            {item.cta.label}
            <I name="arrow" size={11} color="currentColor" />
          </button>
        )}
      </footer>
    </section>
  );
}
