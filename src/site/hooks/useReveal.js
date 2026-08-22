import { useEffect } from 'react';

/**
 * IntersectionObserver-based reveal on scroll. Looks for `.reveal` elements
 * and toggles `.is-in` once they enter the viewport. Single observer for the
 * whole page — cheap, idempotent, no per-element listener.
 *
 * Honors `prefers-reduced-motion: reduce` via base.css (which forces the
 * end-state). Here we still run the IO so screen-reader users see consistent
 * DOM state, but the transition is a no-op.
 */
export default function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    // Pre-fill on mount — anything already in view shows immediately.
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
