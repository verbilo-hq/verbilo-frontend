import styles from "./Card.module.css";

/**
 * Surface container with default shadow.
 * Lift-on-hover is opt-out via `hover={false}`.
 * Becomes clickable when `onClick` is provided.
 */
export const Card = ({ children, style, onClick, hover = true, className }) => {
  const classes = [styles.card];
  if (hover) classes.push(styles.hoverable);
  if (onClick) classes.push(styles.clickable);
  if (className) classes.push(className);
  return (
    <div onClick={onClick} className={classes.join(" ")} style={style}>
      {children}
    </div>
  );
};
