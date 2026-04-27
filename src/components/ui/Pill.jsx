import styles from "./Pill.module.css";

/**
 * Compact uppercase tag/label.
 * Pass `bg` and/or `color` to override the default tertiary palette.
 */
export const Pill = ({ children, bg, color, small }) => {
  const overrides = bg || color ? { background: bg, color } : undefined;
  const className = small ? `${styles.pill} ${styles.small}` : styles.pill;
  return (
    <span className={className} style={overrides}>
      {children}
    </span>
  );
};
