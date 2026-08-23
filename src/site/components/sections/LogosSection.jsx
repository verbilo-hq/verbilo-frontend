import s from './LogosSection.module.css';

/* These are the regulatory frameworks Verbilo's policy library, audit packs and
   evidence trails are mapped against — not endorsements, not customers, just
   the standards the product is designed around. */
const FRAMEWORKS = [
  { name: 'CQC',         style: { fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.16em' } },
  { name: 'GDC',         style: { fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.16em' } },
  { name: 'NHS DSPT',    style: { fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.08em' } },
  { name: 'GDPR',        style: { fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.16em' } },
  { name: 'ISO 27001',   style: { fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '.06em' } },
  { name: 'NICE',        style: { fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.16em' } },
  { name: 'RCGP',        style: { fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.16em' } },
  { name: 'GMC',         style: { fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.16em' } },
];

const STATS = [
  { value: '5 / 5',    label: 'CQC KLOEs mapped' },
  { value: '140+',     label: 'CPD modules included' },
  { value: 'UK-hosted', label: 'on ISO 27001 infrastructure' },
  { value: '1 month',  label: 'free · no card · no subscription' },
];

export default function LogosSection() {
  // Duplicate the framework set so the marquee loops seamlessly without a gap.
  const train = [...FRAMEWORKS, ...FRAMEWORKS];

  return (
    <section className={s.section} aria-label="Standards and positioning">
      <div className={s.container}>
        <p className={s.eyebrow}>
          <span className={s.dot} />
          Mapped to the standards you're inspected against
        </p>

        <div className={s.marqueeWrap} aria-hidden="true">
          <div className={s.marqueeFadeL} />
          <div className={s.marqueeFadeR} />
          <ul className={s.marquee}>
            {train.map((logo, i) => (
              <li key={`${logo.name}-${i}`} className={s.logo}>
                <span style={logo.style}>{logo.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className={s.stats}>
          {STATS.map((stat, i) => (
            <li key={stat.value} className={s.stat} style={{ '--d': i * 0.05 }}>
              <span className={s.statValue}>{stat.value}</span>
              <span className={s.statLabel}>{stat.label}</span>
            </li>
          ))}
        </ul>

        <p className={s.fineprint}>
          Verbilo is independent. Names above refer to the frameworks our policy library, audit packs and evidence trails are designed around — not endorsements.
        </p>
      </div>
    </section>
  );
}
