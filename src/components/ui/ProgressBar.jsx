import styles from "./ProgressBar.module.css";

export const ProgressBar = ({ pct, color, bg, h = 6 }) => {
  const trackStyle = { height: h };
  if (bg) trackStyle.background = bg;
  const fillStyle = { width: `${pct}%` };
  if (color) fillStyle.background = color;
  return (
    <div className={styles.track} style={trackStyle}>
      <div className={styles.fill} style={fillStyle} />
    </div>
  );
};
