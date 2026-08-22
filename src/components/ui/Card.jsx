import styles from "./Card.module.css";

/**
 * Surface container with default shadow.
 * Lift-on-hover is opt-out via `hover={false}`.
 * Becomes clickable when `onClick` is provided.
 */
export const Card = ({ children, style, onClick, hover = true, className, ariaLabel }) => {
  const classes = [styles.card];
  if (hover) classes.push(styles.hoverable);
  if (onClick) classes.push(styles.clickable);
  if (className) classes.push(className);
  const interactive = typeof onClick === "function";
  return (
    <div
      onClick={onClick}
      onKeyDown={interactive ? (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); }
      } : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? ariaLabel : undefined}
      className={classes.join(" ")}
      style={style}
    >
      {children}
    </div>
  );
};
