import { useEffect } from 'react';

/**
 * IO-gated continuous-rAF scroll progress (0..1) through `ref`, written
 * directly to a CSS custom property on `target` (defaults to ref). Bypasses
 * React state so scenes can drive dozens of properties at 60–144 Hz without
 * triggering a single render.
 *
 *   useScrollVar(sectionRef, '--p');             // 0..1 across the section
 *   useScrollVar(sectionRef, '--d', { start: 0.3, end: 0.7 });  // bucketed sub-range
 *
 * Pattern is identical to LaptopScroll: IntersectionObserver gates the rAF
 * loop so we burn zero CPU when offscreen.
 */
export function useScrollVar(ref, varName, { target, start = 0, end = 1 } = {}) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const targetEl = (target && target.current) || section;

    let raf = 0;
    let active = false;
    let lastWritten = NaN;

    const compute = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const raw = total <= 0 ? 0 : Math.max(0, Math.min(1, -r.top / total));
      const mapped = start + (end - start) * raw;
      if (Math.abs(mapped - lastWritten) < 0.0005) return;
      lastWritten = mapped;
      targetEl.style.setProperty(varName, mapped.toFixed(4));
    };

    const loop = () => {
      if (!active) { raf = 0; return; }
      compute();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active && !raf) raf = requestAnimationFrame(loop);
      },
      { rootMargin: '0px' }
    );
    io.observe(section);
    compute();

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      targetEl.style.removeProperty(varName);
    };
  }, [ref, target, varName, start, end]);
}
