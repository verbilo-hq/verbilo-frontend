import { useRef, useEffect } from 'react';
import styles from './ScrollZoom.module.css';

const PHASE1_END  = 0.62;   // 0 → 62%: iMac scales up
const PHASE2_END  = 1.00;   // 62% → 100%: chrome fades

function easeCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function remap(t, lo, hi) { return clamp((t - lo) / (hi - lo), 0, 1); }

const CtaLink = ({ href, className, children }) => href
  ? <a href={href} className={className}>{children}</a>
  : <span className={`${className} ${styles.btnDisabled}`} aria-disabled="true" title="Destination not configured">{children}</span>;

export function ScrollZoom({ bookDemoHref = null, contactHref = null }) {
  const tunnelRef  = useRef(null);
  const imacRef    = useRef(null);
  const bezelRef   = useRef(null);
  const screenRef  = useRef(null);
  const chinRef    = useRef(null);
  const neckRef    = useRef(null);
  const baseRef    = useRef(null);
  const copyRef    = useRef(null);
  const dimsRef    = useRef(null);
  const rafRef     = useRef(null);

  // ── Measure + apply iMac dimensions ──────────────────────────────────────
  function measure() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const iW   = Math.min(vw * 0.56, 860);
    const bPad = iW * 0.024;
    const sW   = iW - bPad * 2;
    const sH   = sW * 0.605;
    const cH   = iW * 0.068;
    const nH   = iW * 0.088;
    const nW   = iW * 0.108;
    const bsW  = iW * 0.33;
    const bsH  = iW * 0.033;

    // Screen glass center within the imacOuter element
    const sCX = iW / 2;
    const sCY = bPad + sH / 2;

    // Scale needed so screen exactly fills viewport (with slight overshoot for clean clip)
    const endScale = (vw / sW) * 1.04;

    dimsRef.current = { vw, vh, iW, bPad, sW, sH, cH, nH, nW, bsW, bsH, sCX, sCY, endScale };

    const im = imacRef.current;
    if (!im) return;

    // Position iMac so its screen glass center = viewport center
    im.style.left            = `${vw / 2 - sCX}px`;
    im.style.top             = `${vh / 2 - sCY}px`;
    im.style.transformOrigin = `${sCX}px ${sCY}px`;

    bezelRef.current.style.width        = `${iW}px`;
    bezelRef.current.style.padding      = `${bPad}px ${bPad}px 0`;
    bezelRef.current.style.borderRadius = `${iW * 0.02}px ${iW * 0.02}px ${iW * 0.005}px ${iW * 0.005}px`;

    screenRef.current.style.width        = `${sW}px`;
    screenRef.current.style.height       = `${sH}px`;
    screenRef.current.style.borderRadius = `${iW * 0.003}px`;

    chinRef.current.style.width        = `${iW}px`;
    chinRef.current.style.height       = `${cH}px`;
    chinRef.current.style.borderRadius = `0 0 ${iW * 0.005}px ${iW * 0.005}px`;

    neckRef.current.style.width  = `${nW}px`;
    neckRef.current.style.height = `${nH}px`;

    baseRef.current.style.width        = `${bsW}px`;
    baseRef.current.style.height       = `${bsH}px`;
    baseRef.current.style.borderRadius = '999px';
  }

  // ── Apply scroll animation ────────────────────────────────────────────────
  function applyAnimation(progress) {
    const d = dimsRef.current;
    if (!d) return;

    // Phase 1: zoom in
    const p1 = remap(progress, 0, PHASE1_END);
    const scale = lerp(1, d.endScale, easeCubic(p1));
    imacRef.current.style.transform = `scale(${scale})`;

    // Phase 2: chrome dissolves
    const p2 = remap(progress, PHASE1_END, PHASE2_END);
    const chromeAlpha = 1 - easeCubic(p2);
    const bezelPadNow = d.bPad * (1 - easeCubic(p2));

    bezelRef.current.style.background = `rgba(28, 28, 30, ${chromeAlpha})`;
    bezelRef.current.style.padding    = `${bezelPadNow}px ${bezelPadNow}px 0`;
    chinRef.current.style.opacity     = String(chromeAlpha);
    neckRef.current.style.opacity     = String(chromeAlpha);
    baseRef.current.style.opacity     = String(chromeAlpha);

    // Hero copy fades in phase 1 first 40%
    const textAlpha = 1 - clamp(progress / 0.38, 0, 1);
    copyRef.current.style.opacity   = String(textAlpha);
    copyRef.current.style.transform = `translateY(${-progress * 28}px)`;
  }

  // ── Scroll listener ───────────────────────────────────────────────────────
  useEffect(() => {
    const tunnel = tunnelRef.current;

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const { top, height } = tunnel.getBoundingClientRect();
        const progress = clamp(-top / (height - window.innerHeight), 0, 1);
        applyAnimation(progress);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Fire once on mount to set initial state
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Measure on mount + resize ─────────────────────────────────────────────
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={tunnelRef} className={styles.tunnel}>
      <div className={styles.sticky}>
        {/* Radial glow */}
        <div className={styles.glow} />

        {/* Hero copy — fades out as iMac zooms */}
        <div ref={copyRef} className={styles.heroCopy}>
          <span className={styles.badge}>✦ The modern intranet platform</span>
          <h1 className={styles.headline}>
            Your company,<br />
            <span className={styles.gradientText}>beautifully connected.</span>
          </h1>
          <p className={styles.subheadline}>
            Verbilo brings your people, knowledge, news, documents, and
            culture together in one elegant intranet experience.
          </p>
          <div className={styles.ctaRow}>
            <CtaLink href={bookDemoHref} className={styles.btnPrimary}>
              Book a Demo
            </CtaLink>
            <CtaLink href={contactHref} className={styles.btnSecondary}>
              Contact Us
            </CtaLink>
          </div>
        </div>

        {/* iMac — JS controls position, transform-origin, scale */}
        <div ref={imacRef} className={styles.imacOuter}>
          <div className={styles.macBody}>
            <div ref={bezelRef} className={styles.macBezel}>
              <div ref={screenRef} className={styles.macScreenClip}>
                <DashboardPreview />
              </div>
            </div>
            <div ref={chinRef} className={styles.macChin}>
              <div className={styles.macChinLogo} />
            </div>
          </div>
          <div ref={neckRef} className={styles.macNeck} />
          <div ref={baseRef} className={styles.macBase} />
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint}>
          <div className={styles.scrollHintLine} />
          <div className={styles.scrollHintArrow} />
        </div>
      </div>
    </div>
  );
}

// ── Dashboard preview rendered inside the iMac screen ────────────────────────
function DashboardPreview() {
  return (
    <div className={styles.dashWrap}>
      {/* Window chrome */}
      <div className={styles.dashTopbar}>
        <div className={styles.topDot} />
        <div className={styles.topDot} />
        <div className={styles.topDot} />
      </div>

      <div className={styles.dashBody}>
        {/* Sidebar */}
        <div className={styles.dashSidebar}>
          <div className={styles.sidebarItem} />
          <div className={styles.sidebarItem} />
          <div className={styles.sidebarItem} />
          <div className={styles.sidebarItem} />
          <div className={styles.sidebarItem} />
        </div>

        {/* Main content */}
        <div className={styles.dashMain}>
          {/* Welcome banner */}
          <div className={styles.welcomeBanner}>
            <div className={styles.welcomeGreet}>Good morning</div>
            <div className={styles.welcomeName}>Sarah — Welcome to Verbilo</div>
          </div>

          {/* Stats row */}
          <div className={styles.cardRow}>
            <div className={styles.dashCard}>
              <div className={`${styles.bar} ${styles.barIndigo}`} style={{ width: '58%' }} />
              <div className={styles.bar} style={{ width: '82%' }} />
              <div className={styles.bar} style={{ width: '46%' }} />
            </div>
            <div className={styles.dashCard}>
              <div className={`${styles.bar} ${styles.barGreen}`} style={{ width: '44%' }} />
              <div className={styles.bar} style={{ width: '70%' }} />
              <div className={styles.bar} style={{ width: '55%' }} />
            </div>
            <div className={styles.dashCard}>
              <div className={`${styles.bar} ${styles.barOrange}`} style={{ width: '52%' }} />
              <div className={styles.bar} style={{ width: '65%' }} />
            </div>
          </div>

          {/* Wide card */}
          <div className={styles.dashCardWide}>
            <div className={`${styles.bar} ${styles.barIndigo}`} style={{ width: '68%' }} />
            <div className={styles.bar} style={{ width: '88%' }} />
            <div className={styles.bar} style={{ width: '55%' }} />
          </div>

          {/* Bottom row */}
          <div className={styles.cardRow}>
            <div className={styles.dashCard}>
              <div className={`${styles.bar} ${styles.barPink}`} style={{ width: '48%' }} />
              <div className={styles.bar} style={{ width: '74%' }} />
            </div>
            <div className={styles.dashCard}>
              <div className={styles.bar} style={{ width: '80%' }} />
              <div className={`${styles.bar} ${styles.barIndigo}`} style={{ width: '40%' }} />
            </div>
            <div className={styles.dashCard}>
              <div className={`${styles.bar} ${styles.barGreen}`} style={{ width: '36%' }} />
              <div className={styles.bar} style={{ width: '72%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
