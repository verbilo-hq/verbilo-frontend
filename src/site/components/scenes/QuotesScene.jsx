import { useRef } from 'react';
import { useScrollVar } from '../../hooks/useScrollVar.js';
import s from './QuotesScene.module.css';

/* Principle statements — the problem we're here to solve, in our own voice.
   Not testimonials. The site has zero paying customers; we don't fake quotes. */
const QUOTES = [
  {
    text: 'Compliance shouldn’t feel like a punishment for caring.',
    author: 'Our first principle',
    role: 'Why we’re building Verbilo',
  },
  {
    text: 'Every minute spent on paperwork is a minute not spent on a patient.',
    author: 'Our second principle',
    role: 'What we measure ourselves against',
  },
  {
    text: 'An inspection should reflect the work you actually do — not how good you are at finding it.',
    author: 'Our third principle',
    role: 'The bar we’ve set for ourselves',
  },
];

/**
 * Editorial-Clinical quote crossfade. The scene's --p (0..1) is divided into
 * N equal bands; the band matching each quote's --i keeps it visible, the
 * neighbours fade out via a smooth CSS-only window. No React state during
 * scroll — entire choreography lives in QuotesScene.module.css.
 */
export default function QuotesScene() {
  const sectionRef = useRef(null);
  useScrollVar(sectionRef, '--p');

  return (
    <section ref={sectionRef} id="principles" className={s.scene} aria-labelledby="quotes-h">
      <div className={s.pin}>
        <p className={s.eyebrow}>
          <span className="eyebrow-num">07</span>
          <span className="eyebrow-divider" />
          Principles
        </p>
        <h2 id="quotes-h" className={s.vh}>What we believe.</h2>

        <div className={s.stage}>
          {QUOTES.map((q, i) => (
            <figure
              key={i}
              className={s.quote}
              style={{ '--i': i, '--n': QUOTES.length }}
            >
              <blockquote className={s.text}>
                <span className={s.openMark} aria-hidden="true">“</span>
                {q.text}
                <span className={s.closeMark} aria-hidden="true">”</span>
              </blockquote>
              <figcaption className={s.byline}>
                <span className={s.author}>{q.author}</span>
                <span className={s.role}>{q.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className={s.progress} aria-hidden="true">
          {QUOTES.map((_, i) => (
            <span
              key={i}
              className={s.dot}
              style={{ '--i': i, '--n': QUOTES.length }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
