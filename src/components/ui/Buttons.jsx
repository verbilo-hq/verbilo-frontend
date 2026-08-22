import styles from "./Buttons.module.css";

export const BtnPrimary = ({ children, onClick, style, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`${styles.btn} ${styles.primary}`}
    style={style}
  >
    {children}
  </button>
);

export const BtnSecondary = ({ children, onClick, style, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`${styles.btn} ${styles.secondary}`}
    style={style}
  >
    {children}
  </button>
);

export const BtnOutline = ({ children, onClick, style, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`${styles.btn} ${styles.outline}`}
    style={style}
  >
    {children}
  </button>
);
