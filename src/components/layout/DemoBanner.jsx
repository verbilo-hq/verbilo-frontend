import { isDemoMode } from "../../lib/mode";
import styles from "./DemoBanner.module.css";

// VER-39: persistent banner on `demo.verbilo.co.uk` reminding visitors
// that this is a tour — actions don't persist, no real customer data —
// and offering a path back to lead capture. Hidden on every other
// surface; the gate is isDemoMode() (hostname OR env var).
export const DemoBanner = () => {
  if (!isDemoMode()) return null;
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
