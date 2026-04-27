import styles from "./Avatar.module.css";

/**
 * Circular avatar — image if `src`, otherwise initials from `name`.
 * Optional `bg` / `color` overrides the default gradient palette.
 */
export const Avatar = ({ name, size = 40, bg, color, src }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={styles.image}
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = name?.split(" ").map((w) => w[0]).join("").slice(0, 2) || "?";
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.38,
  };
  if (bg) style.background = bg;
  if (color) style.color = color;
  return (
    <div className={styles.avatar} style={style}>
      {initials}
    </div>
  );
};
