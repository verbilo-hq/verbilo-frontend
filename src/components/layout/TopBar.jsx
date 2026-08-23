import styles from "./TopBar.module.css";

/**
 * Per-page TopBar — just title + subtitle now.
 * The bell + user identity moved to <AppHeader />, which is rendered once
 * in the app shell and visible on every page (App.jsx).
 */
export const TopBar = ({ title, subtitle }) => (
  <div className={styles.bar}>
    <div>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  </div>
);
