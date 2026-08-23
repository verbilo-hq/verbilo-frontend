import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import s from './LaptopScroll.module.css';
import Button from './Button.jsx';

const FRAME_COUNT = 119;
const FRAME_PATH  = (i) => `/laptop-frames/frame_${String(i).padStart(6, '0')}.jpg`;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Critically-damped spring natural frequency (rad/s). Higher = snappier
// follow; lower = heavier / silkier. 18 ≈ Apple-weighted feel. Critical
// damping (zeta = 1) means no overshoot, just smooth deceleration into target.
const SPRING_W = 18;

/**
 * MacBook scroll-open: 119-frame canvas image sequence driven by native
 * window scroll + a continuous rAF loop with lerp smoothing.
 *
 *  Note on prefers-reduced-motion: this component intentionally ignores the
 *  OS-level reduced-motion preference. The user explicitly requested the
 *  scroll-driven lid-open animation, and on their machine the Windows
 *  "Animation effects" accessibility toggle was triggering the reduced-motion
 *  fallback against their wishes. The canvas paint loop runs regardless;
 *  CSS-level transitions in the rest of the page are still gated by the
 *  global @media block in reset.css.
 */
export default function LaptopScroll({ scale = 1.0, demoCta = {} }) {
  const sectionRef = useRef(null);
  const pinRef     = useRef(null);
  const canvasRef  = useRef(null);
  const heroRef    = useRef(null);
  const framesRef  = useRef(new Array(FRAME_COUNT));

  const [loaded, setLoaded] = useState(0);
  const [ready,  setReady]  = useState(false);

  useLayoutEffect(() => {
    const canControl = 'scrollRestoration' in window.history;
    const prev = canControl ? window.history.scrollRestoration : undefined;
    if (canControl) window.history.scrollRestoration = 'manual';
    if (!window.location.hash) window.scrollTo(0, 0);
    return () => { if (canControl) window.history.scrollRestoration = prev; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const finish = () => {
      if (cancelled) return;
      count++;
      setLoaded(count);
      if (count === FRAME_COUNT) setReady(true);
    };
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = FRAME_PATH(i);
      framesRef.current[i] = img;
      // Force decode to GPU so first paint is instant — no decode-on-draw stalls.
      if (typeof img.decode === 'function') {
        img.decode().then(finish, finish);
      } else {
        img.onload  = finish;
        img.onerror = finish;
      }
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    let raf = 0;
    let lastDrawnKey = '';
    let targetIdx  = 0;
    let currentIdx = 0;
    let velocity   = 0;
    let lastTs     = 0;
    let active     = false;

    // Compute destination rect for a frame given canvas dims; identical math
    // for both crossfaded frames since they're the same intrinsic size.
    const layout = (img) => {
      const W = canvas.width;
      const H = canvas.height;
      const imgAspect    = img.naturalWidth / img.naturalHeight;
      const canvasAspect = W / H;
      let dw, dh;
      if (canvasAspect > imgAspect) {
        dh = H * scale;
        dw = dh * imgAspect;
      } else {
        dw = W * scale;
        dh = dw / imgAspect;
      }
      return { W, H, dw, dh, dx: (W - dw) / 2, dy: (H - dh) / 2 };
    };

    const isReady = (img) => img && img.complete && img.naturalWidth > 0;

    // Sub-frame crossfade: draw floor(idx) at full alpha then ceil(idx) at
    // alpha = (idx - floor) on top. Smooths the transition between adjacent
    // discrete frames so the scrub looks continuous, not stepped.
    const drawFrame = (idx) => {
      const lo = clamp(Math.floor(idx), 0, FRAME_COUNT - 1);
      const hi = clamp(lo + 1,          0, FRAME_COUNT - 1);
      const t  = clamp(idx - lo, 0, 1);

      // Cache key: only repaint when the (lo, hi, t-bucket) changes meaningfully.
      // 1000 buckets ≈ 0.1% alpha resolution — finer than the eye can detect.
      const key = `${lo}:${hi}:${Math.round(t * 1000)}`;
      if (key === lastDrawnKey) return;

      const imgLo = framesRef.current[lo];
      const imgHi = framesRef.current[hi];
      if (!isReady(imgLo)) return;
      lastDrawnKey = key;

      const { W, H, dw, dh, dx, dy } = layout(imgLo);
      ctx.clearRect(0, 0, W, H);

      if (lo === hi || t < 0.001 || !isReady(imgHi)) {
        ctx.globalAlpha = 1;
        ctx.drawImage(imgLo, dx, dy, dw, dh);
      } else {
        ctx.globalAlpha = 1;
        ctx.drawImage(imgLo, dx, dy, dw, dh);
        ctx.globalAlpha = t;
        ctx.drawImage(imgHi, dx, dy, dw, dh);
        ctx.globalAlpha = 1;
      }

    };

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total <= 0 ? 0 : clamp(-rect.top / total, 0, 1);
      targetIdx = progress * (FRAME_COUNT - 1);
      return progress;
    };

    // Critically-damped spring step. dt-aware so feel is consistent at 60Hz,
    // 120Hz, or any refresh rate. Acceleration a = ω²·(target - x) - 2ω·v.
    const stepSpring = (ts) => {
      if (lastTs === 0) { lastTs = ts; return; }
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      const w = SPRING_W;
      const a = w * w * (targetIdx - currentIdx) - 2 * w * velocity;
      velocity   += a * dt;
      currentIdx += velocity * dt;
    };

    const updateHero = (progress) => {
      const hero = heroRef.current;
      const pin  = pinRef.current;
      if (pin) pin.style.setProperty('--p', progress.toFixed(4));
      if (!hero) return;
      const op = progress <= 0.10 ? 1
               : progress >= 0.26 ? 0
               : 1 - (progress - 0.10) / 0.16;
      hero.style.opacity   = String(op);
      hero.style.transform = `translateY(${-Math.min(50, progress * 220)}px)`;
      hero.style.pointerEvents = op < 0.05 ? 'none' : '';
    };

    // Continuous rAF loop. Runs only while the section is intersecting the
    // viewport (gated by IntersectionObserver) — no wasted CPU when offscreen,
    // no restart gap when the user resumes scrolling.
    const loop = (ts) => {
      if (!active) { raf = 0; lastTs = 0; return; }
      const progress = computeTarget();
      stepSpring(ts);
      drawFrame(currentIdx);
      updateHero(progress);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf) {
        lastTs = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr  = Math.min(2, window.devicePixelRatio || 1);
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width  = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      // Re-apply smoothing flags — changing canvas.width/height resets state.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      lastDrawnKey = '';
      const progress = computeTarget();
      currentIdx = targetIdx;
      velocity   = 0;
      drawFrame(currentIdx);
      updateHero(progress);
    };

    // Coalesce window-resize and ResizeObserver into a single rAF-batched call.
    let resizeRaf = 0;
    const scheduleResize = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        resize();
      });
    };

    resize();

    window.addEventListener('resize', scheduleResize);
    const ro = new ResizeObserver(scheduleResize);
    ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) start();
    }, { rootMargin: '0px' });
    io.observe(section);

    return () => {
      window.removeEventListener('resize', scheduleResize);
      ro.disconnect();
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
    };
  }, [ready, scale]);

  const pct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section ref={sectionRef} className={s.scene} aria-labelledby="laptop-h">
      <div ref={pinRef} className={s.pin}>
        <div className={s.aurora} aria-hidden="true" />
        <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />

        {/* Floating live-product telemetry. Each element animates on enter
            (ring fills, numbers tick up, lines draw) so the scene reads as
            an active system rather than a row of static cards. */}
        <div className={s.chips} aria-hidden="true">

          {/* Notification toast — top center, slides in from above first */}
          <div className={`${s.chip} ${s.toast}`}>
            <span className={s.avatar} data-bg="a">SW</span>
            <div className={s.toastBody}>
              <p className={s.toastMsg}>
                Staff record · <em>IPC training</em> completed
              </p>
              <p className={s.toastTime}>
                <span className={s.liveDot} />
                Auto-filed to compliance log · product preview
              </p>
            </div>
            <span className={s.toastTick}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m3 8 3.5 3.5L13 5" />
              </svg>
            </span>
          </div>

          {/* L1 — CQC rating widget with ECG-style heartbeat sparkline */}
          <div className={`${s.chip} ${s.chipL1}`}>
            <div className={s.chipHead}>
              <span className={s.chipIconPlate}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <div className={s.chipMeta}>
                <span className={s.chipKicker}>CQC Rating</span>
                <span className={s.chipValue}>
                  Safe<span className={s.chipPill} data-tone="ok">Live</span>
                </span>
              </div>
            </div>
            <svg className={s.ecg} viewBox="0 0 200 36" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="ecgFade" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%"  stopColor="var(--accent)" stopOpacity="0" />
                  <stop offset="25%" stopColor="var(--accent)" stopOpacity=".6" />
                  <stop offset="100%" stopColor="#16707f" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path className={s.ecgPath}
                    d="M0 18 L24 18 L30 18 L36 10 L42 26 L48 6 L54 30 L60 18 L84 18 L90 18 L96 12 L102 22 L108 18 L132 18 L138 18 L144 8 L150 28 L156 4 L162 30 L168 18 L200 18"
                    fill="none" stroke="url(#ecgFade)" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" />
              <circle className={s.ecgPulse} cx="200" cy="18" r="3" fill="var(--accent)" />
            </svg>
            <p className={s.chipFoot}><em>72 BPM</em> · all systems clear</p>
          </div>

          {/* L2 — KLOE progress: ring gauge with animated fill */}
          <div className={`${s.chip} ${s.chipL2}`}>
            <svg className={s.ringSm} viewBox="0 0 56 56" aria-hidden="true">
              <defs>
                <linearGradient id="kring" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%"  stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="#16707f" />
                </linearGradient>
              </defs>
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(7,72,86,.10)" strokeWidth="5" />
              <circle className={s.ringFill} cx="28" cy="28" r="22" fill="none" stroke="url(#kring)" strokeWidth="5"
                      strokeDasharray="138.2" strokeDashoffset="138.2"
                      strokeLinecap="round" transform="rotate(-90 28 28)"
                      style={{ '--final-offset': '0' }} />
              <text x="28" y="32" textAnchor="middle" className={s.ringTextSm}>12</text>
            </svg>
            <div className={s.chipMeta}>
              <span className={s.chipKicker}>KLOEs evidenced</span>
              <span className={s.chipValueRow}>
                <strong>12 of 12</strong>
                <span className={s.chipTick}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m3 8 3.5 3.5L13 5" />
                  </svg>
                </span>
              </span>
              <span className={s.chipFootInline}><em>Inspector-ready pack</em></span>
            </div>
          </div>

          {/* R1 — Team compliance: ring gauge + sparkline trend + avatars */}
          <div className={`${s.chip} ${s.chipR1}`}>
            <div className={s.chipHeadWide}>
              <svg className={s.ringLg} viewBox="0 0 72 72" aria-hidden="true">
                <defs>
                  <linearGradient id="tring" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%"  stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="#1c8997" />
                  </linearGradient>
                </defs>
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(7,72,86,.10)" strokeWidth="5" />
                <circle className={s.ringFill} cx="36" cy="36" r="30" fill="none" stroke="url(#tring)" strokeWidth="5"
                        strokeDasharray="188.5" strokeDashoffset="188.5"
                        strokeLinecap="round" transform="rotate(-90 36 36)"
                        style={{ '--final-offset': '24.5' }} />
                <text x="36" y="36" textAnchor="middle" className={s.ringTextLg}>87</text>
                <text x="36" y="47" textAnchor="middle" className={s.ringTextLgSub}>PERCENT</text>
              </svg>
              <div className={s.chipMeta}>
                <span className={s.chipKicker}>Team compliance</span>
                <span className={s.chipValueRow}>
                  <strong>Up to date</strong>
                  <span className={s.trendUp}>▲ 4%</span>
                </span>
                {/* 7-day sparkline */}
                <svg className={s.spark} viewBox="0 0 120 24" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity=".22" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className={s.sparkArea}
                        d="M0 18 L20 14 L40 16 L60 10 L80 8 L100 6 L120 4 L120 24 L0 24 Z"
                        fill="url(#sparkFill)" />
                  <path className={s.sparkLine}
                        d="M0 18 L20 14 L40 16 L60 10 L80 8 L100 6 L120 4"
                        fill="none" stroke="var(--accent)" strokeWidth="1.6"
                        strokeLinecap="round" strokeLinejoin="round" />
                  <circle className={s.sparkDot} cx="120" cy="4" r="2.4" fill="var(--accent)" />
                </svg>
                <div className={s.avatars}>
                  <span className={s.avatar} data-bg="a">SW</span>
                  <span className={s.avatar} data-bg="b">AM</span>
                  <span className={s.avatar} data-bg="c">JK</span>
                  <span className={s.avatar} data-bg="d">RD</span>
                  <span className={s.avatarMore}>+12</span>
                </div>
              </div>
            </div>
          </div>

          {/* R2 — Certifications + activity ticker */}
          <div className={`${s.chip} ${s.chipR2}`}>
            <div className={s.chipHead}>
              <span className={s.chipIconPlate}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <div className={s.chipMeta}>
                <span className={s.chipKicker}>Certifications</span>
                <span className={s.chipValue}>UK-hosted &amp; secure</span>
              </div>
            </div>
            <div className={s.badgeRow}>
              <span className={s.miniBadge}>GDPR</span>
              <span className={s.miniBadge}>ISO&nbsp;27001</span>
              <span className={s.miniBadge}>NHS&nbsp;DSPT</span>
            </div>
          </div>

        </div>

        {!ready && (
          <div className={s.loader} role="status" aria-live="polite">
            <div className={s.loaderInner}>
              <div className={s.loaderPct}>{pct}%</div>
              <div className={s.loaderLabel}>Loading</div>
              <div className={s.loaderBar}>
                <div className={s.loaderFill} style={{ transform: `scaleX(${loaded / FRAME_COUNT})` }} />
              </div>
            </div>
          </div>
        )}

        <div ref={heroRef} className={s.hero}>
          <a href="#features" className={s.kicker}>
            <span className={s.kickerTag}>Early access</span>
            Built for UK healthcare — joining now
            <span className={s.kickerArrow} aria-hidden="true">›</span>
          </a>
          <h1 id="laptop-h" className={s.title}>
            Compliance,<br />
            <em className={s.titleEm}>simplified.</em>
          </h1>
          <p className={s.sub}>
            The intranet, training, and audit hub built for healthcare teams who care about doing things properly — without the spreadsheet sprawl.
          </p>
          <div className={s.cta}>
            <Button {...demoCta} variant="primary" size="lg" arrow>View demo</Button>
            <Button href="#trial" variant="secondary" size="lg" icon="zap">Start 1-month trial</Button>
          </div>
          <p className={s.trialNote}>
            Free for 1 month · No card · No subscription required
          </p>
          <p className={s.trust}>
            <span className={s.trustDot} aria-hidden="true" />
            <span className={s.trustText}>Made in the UK · <strong>Built around CQC, GDC &amp; NHS DSPT</strong></span>
          </p>
        </div>

      </div>
    </section>
  );
}
