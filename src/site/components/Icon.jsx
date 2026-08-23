/* Sprite consumer. <Icon name="arrow" size={16} /> → <svg><use href="#i-arrow"/></svg>. */
export default function Icon({ name, size, className, style, ...rest }) {
  const dims = size ? { width: size, height: size } : undefined;
  return (
    <svg
      className={className}
      style={{ ...dims, ...style }}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}
