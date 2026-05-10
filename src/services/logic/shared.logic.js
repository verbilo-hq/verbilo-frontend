export const toRgba = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const clampPct = (n) => Math.max(0, Math.min(100, n));

export const pct = (numerator, denominator) =>
  denominator > 0 ? clampPct(Math.round((numerator / denominator) * 100)) : 0;
