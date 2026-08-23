import { useEffect, useState } from 'react';
import s from './Nav.module.css';
import Brand from './Brand.jsx';
import Button from './Button.jsx';
import Icon from './Icon.jsx';

const LINKS = [
  { href: '#features',    label: 'Product' },
  { href: '#compliance',  label: 'Compliance' },
  { href: '#training',    label: 'Training' },
  { href: '#principles',  label: 'Principles' },
  { href: '#pricing',     label: 'Pricing' },
  { href: '#faq',         label: 'Support' },
];

export default function Nav({ onSignIn, signInHref, bookDemoHref }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lift the bar at first scroll — keeps the hero feeling open while
  // making the nav a more decisive anchor once the user has committed.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while menu is open. Restore old overflow on close/unmount
  // rather than blindly clearing it — protects any other scroll-lock owner.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`${s.nav} ${scrolled ? s.scrolled : ''}`}>
      <div className={s.inner}>
        <Brand />

        <nav aria-label="Primary" className={s.desktop}>
          <ul className={s.links}>
            {LINKS.map((l) => (
              <li key={l.href}><a className={s.link} href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>

        <div className={s.right}>
          <a href="#search" className={s.search} aria-label="Search"><Icon name="search" /></a>
          <a
            href={signInHref || "#signin"}
            className={s.signin}
            onClick={(e) => { if (onSignIn) { e.preventDefault(); onSignIn(); } }}
          >
            Sign in
          </a>
          <Button href={bookDemoHref || '#demo'} variant="primary" size="sm" className={s.ctaBtn}>Book demo</Button>
          <button
            type="button"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`${s.sheet} ${open ? s.sheetOpen : ''}`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className={s.sheetNav}>
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={close}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.sheetCta}>
          <Button href="#trial" variant="secondary" size="md" onClick={close}>Start 1-month trial</Button>
          <Button href={bookDemoHref || '#demo'} variant="primary" size="md" arrow onClick={close}>Book a demo</Button>
        </div>
        <p className={s.sheetFootnote}>Free for 1 month · No card · No subscription</p>
      </div>
      {open && <button type="button" className={s.scrim} aria-label="Close menu" onClick={close} />}
    </header>
  );
}
