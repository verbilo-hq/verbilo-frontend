import s from './Brand.module.css';

/**
 * Brand lockup. Uses the official primary-logo PNG (icon + wordmark together)
 * so the rendered mark always matches the brand pack exactly — no SVG drift.
 * Variant 'mark' renders just the icon (used in tight spaces like the footer
 * mini-logo or social cards).
 */
export default function Brand({ href = '#', variant = 'full', className = '' }) {
  return (
    <a href={href} className={`${s.brand} ${s[variant]} ${className}`} aria-label="Verbilo home">
      {variant === 'mark' ? (
        <img
          src="/brand/icon-256.png"
          srcSet="/brand/icon-256.png 1x, /brand/icon-512.png 2x"
          alt=""
          className={s.icon}
          width={32}
          height={32}
        />
      ) : (
        <img
          src="/brand/primary-logo.png"
          alt="Verbilo"
          className={s.logo}
          width={160}
          height={40}
        />
      )}
    </a>
  );
}
