import { useEffect } from "react";
import { isDemoMode } from "../../lib/mode";
import styles from "./DemoBanner.module.css";

// VER-39: persistent banner on `demo.verbilo.co.uk` reminding visitors
// that this is a tour — actions don't persist, no real customer data —
// and offering a path back to lead capture. Hidden on every other
// surface; the gate is isDemoMode() (hostname OR env var).
//
// Layout: fixed-overlay across the whole viewport (including the sidebar
// gutter) per Owen's 2026-05-17 request. The banner sets
// `--top-banner-height` on :root on mount so Sidebar's fixed `top`
// and `.main`'s padding-top can offset and not slip underneath.
export const DemoBanner = () => {
  const active = isDemoMode();

  useEffect(() => {
    if (!active) return;
    document.documentElement.style.setProperty("--top-banner-height", "44px");
    return () => document.documentElement.style.removeProperty("--top-banner-height");
  }, [active]);

  if (!active) return null;
  return (
    <div className={styles.banner} role="status">
      <span>
        <strong>Verbilo demo.</strong> Synthetic data — nothing you click here is saved.
      </span>
      <a href="https://verbilo.co.uk" className={styles.cta}>
        Book a real walkthrough →
      </a>
    </div>
  );
};
