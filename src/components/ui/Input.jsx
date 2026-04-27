import styles from "./Input.module.css";

export const Input = ({ label, type = "text", placeholder, icon }) => (
  <div className={styles.field}>
    {label && <label className={styles.label}>{label}</label>}
    <div className={styles.wrapper}>
      <input
        type={type}
        placeholder={placeholder}
        className={styles.input}
        data-has-icon={icon ? "true" : undefined}
      />
      {icon && <span className={styles.icon}>{icon}</span>}
    </div>
  </div>
);
