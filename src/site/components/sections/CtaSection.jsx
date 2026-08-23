import s from './CtaSection.module.css';
import Button from '../Button.jsx';

export default function CtaSection({ demoCta = {}, contactHref }) {
  return (
    <section className={s.section} aria-labelledby="cta-h">
      <div className="container">
        <div className={s.card}>
          <div className={s.aura} aria-hidden="true" />
          <div className={`dot-grid ${s.dots}`} aria-hidden="true" />
          <div className={s.glyphs} aria-hidden="true">
            <span className={s.glyph}>✓ IPC training filed</span>
            <span className={s.glyph}>↑ 4% week-on-week</span>
            <span className={s.glyph}>✓ Audit pack exported</span>
            <span className={s.glyph}>● 87% team compliant</span>
          </div>
          <div className={s.content}>
            <p className={s.eyebrow}>Two ways to start</p>
            <h2 id="cta-h" className={s.title}>
              See Verbilo in action or try it <em>free for a month.</em>
            </h2>
            <p className={s.lead}>
              The demo is the live product, open to explore right now. The trial is the full product, on your own data, for a month. No card. No subscription. Walk away if it doesn't fit.
            </p>
            <div className={s.actions}>
              <Button {...demoCta} variant="invert-primary" size="lg" arrow>View demo</Button>
              <Button href={contactHref || '#trial'} variant="invert-secondary" size="lg">Start 1-month trial</Button>
            </div>
            <p className={s.trust}>
              <span className={s.trustItem}>Made in the UK</span>
              <span className={s.trustSep}>·</span>
              <span className={s.trustItem}>UK-hosted infrastructure</span>
              <span className={s.trustSep}>·</span>
              <span className={s.trustItem}>GDPR-aligned · DSPT mapped</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
