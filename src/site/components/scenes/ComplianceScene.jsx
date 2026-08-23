import { useEffect, useRef } from 'react';
import ConicGauge from '../ConicGauge.jsx';
import s from './ComplianceScene.module.css';

/**
 * Editorial-Clinical compliance scene. Sticky pin holds the pinned frame
 * while scroll drives:
 *   --p     0..1 across the whole section (used for stat-tile thresholds)
 *   --fill  0..1 mapped from --p ∈ [0.10, 0.65] (drives gauge fill)
 *
 * The integer percent inside the gauge is written directly to a DOM text
 * node — no React state, no re-renders during scroll.
 */
export default function ComplianceScene() {
  const sectionRef = useRef(null);
  const pinRef     = useRef(null);
  const ringRef    = useRef(null);
  const valueRef   = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin     = pinRef.current;
    const ring    = ringRef.current;
    const value   = valueRef.current;
    if (!section || !pin || !ring || !value) return;

    let raf = 0;
    let active = false;
    let lastFill = -1;

    const compute = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total <= 0 ? 0 : Math.max(0, Math.min(1, -r.top / total));

      // Map p ∈ [0.10, 0.65] → fill ∈ [0, 1]. Gauge starts filling once the
      // eyebrow + headline are settled, finishes before the stats reveal.
      const fill = Math.max(0, Math.min(1, (p - 0.10) / 0.55));

      pin.style.setProperty('--p', p.toFixed(4));
      if (Math.abs(fill - lastFill) > 0.0005) {
        lastFill = fill;
        ring.style.setProperty('--p', fill.toFixed(4));
        value.textContent = String(Math.round(fill * 98));
      }
    };

    const loop = () => {
      if (!active) { raf = 0; return; }
      compute();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && !raf) raf = requestAnimationFrame(loop);
    }, { rootMargin: '0px' });
    io.observe(section);
    compute();

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="compliance" className={s.scene} aria-labelledby="compliance-h" data-section-num="02">
      <div ref={pinRef} className={s.pin}>
        <div className={s.container}>
          <div className={s.copy}>
            <p className={s.eyebrow}>Compliance</p>
            <h2 id="compliance-h" className={s.title}>
              Audit-ready,
              <em> every day.</em>
            </h2>
            <p className={s.lead}>
              From CQC to GDC, Verbilo keeps your evidence current and your team
              aligned — no spreadsheets, no last-minute scramble.
            </p>
          </div>

          <div className={s.gaugeWrap}>
            <ConicGauge ringRef={ringRef} valueRef={valueRef} label="Compliance rate" />
          </div>

          <ul className={s.stats}>
            <li className={s.stat} style={{ '--d': 0.42 }}>
              <span className={s.statNum}>5<span className={s.statSym}>/5</span></span>
              <span className={s.statCap}>CQC KLOEs mapped to evidence</span>
            </li>
            <li className={s.stat} style={{ '--d': 0.54 }}>
              <span className={s.statNum}>140<span className={s.statSym}>+</span></span>
              <span className={s.statCap}>CPD modules in the library</span>
            </li>
            <li className={s.stat} style={{ '--d': 0.66 }}>
              <span className={s.statNum}>4<span className={s.statSym}>+</span></span>
              <span className={s.statCap}>frameworks: CQC · GDC · DSPT · ISO</span>
            </li>
            <li className={s.stat} style={{ '--d': 0.78 }}>
              <span className={s.statNum}>0</span>
              <span className={s.statCap}>spreadsheets needed</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
