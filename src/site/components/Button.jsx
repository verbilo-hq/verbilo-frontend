import s from './Button.module.css';
import Icon from './Icon.jsx';

/**
 * Brand button — single source of truth for CTA shape, radius, motion, focus ring.
 * Variants are intentionally minimal: primary (filled teal), secondary (paper+border),
 * ghost (text+chevron). Anything richer should compose these, never re-roll the shape.
 */
export default function Button({
  as: As = 'a',
  variant = 'primary',
  size = 'md',
  arrow = false,
  icon,
  className = '',
  children,
  ...rest
}) {
  const cls = [
    s.btn,
    s[`v-${variant}`],
    s[`s-${size}`],
    arrow ? s.hasArrow : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <As className={cls} {...rest}>
      {icon && <Icon name={icon} className={s.icon} />}
      <span className={s.label}>{children}</span>
      {arrow && <Icon name="arrow" className={s.arrowIcon} />}
    </As>
  );
}
