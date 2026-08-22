import s from './FeaturesSection.module.css';
import Icon from '../Icon.jsx';

const FEATURES = [
  {
    icon: 'shield',
    title: 'CQC-ready, every day',
    desc: 'Live policy library mapped to KLOEs. Evidence trails update themselves — no last-minute scramble before an inspection.',
    span: 'wide',
    visual: 'shield',
  },
  {
    icon: 'graduation',
    title: 'Training that finishes itself',
    desc: 'CPD reminders, gap reports, certificates auto-filed to the right staff record.',
  },
  {
    icon: 'clipboard',
    title: 'Audits without spreadsheets',
    desc: 'Templated audit packs for IPC, safeguarding, medicines, safety. Schedule once — run forever.',
  },
  {
    icon: 'users',
    title: 'One source of truth',
    desc: 'Staff records, qualifications, DBS, right-to-work. All searchable. All current.',
  },
  {
    icon: 'bell',
    title: 'Smart alerts',
    desc: 'Policy due in 30 days, DBS expiring, training overdue — the right person hears about it first.',
  },
  {
    icon: 'lock',
    title: 'Built for healthcare',
    desc: 'GDPR-aligned, ISO 27001 controls, NHS DSPT mapped. Hosted in the UK.',
    span: 'wide',
    visual: 'security',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className={`section ${s.section}`} aria-labelledby="features-h">
      <div className="container">
        <header className={s.head}>
          <p className={s.eyebrow}>
            <span className="eyebrow-num">01</span>
            <span className="eyebrow-divider" />
            The product
          </p>
          <h2 id="features-h" className={s.title}>
            Everything you need to <em>run a clinical practice</em>, in one place.
          </h2>
          <p className={s.lead}>
            Verbilo replaces the patchwork of policy folders, training trackers, audit spreadsheets, and shared drives that every healthcare team somehow ends up running.
          </p>
        </header>

        <ul className={s.grid}>
          {FEATURES.map((f, i) => (
            <li
              key={f.title}
              className={`${s.tile} ${f.span === 'wide' ? s.wide : ''} reveal d-${(i % 3) + 1}`}
            >
              <div className={s.tileInner}>
                <span className={s.iconWrap}><Icon name={f.icon} /></span>
                <h3 className={s.tileTitle}>{f.title}</h3>
                <p className={s.tileDesc}>{f.desc}</p>
              </div>
              {f.visual === 'shield'   && <ShieldVisual />}
              {f.visual === 'security' && <SecurityVisual />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ShieldVisual() {
  return (
    <svg className={s.visual} viewBox="0 0 360 200" aria-hidden="true">
      <defs>
        <linearGradient id="gx-shield" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%"  stopColor="var(--accent)" stopOpacity=".22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Radial wash anchored to the corner so it never paints under copy */}
      <circle cx="320" cy="200" r="180" fill="url(#gx-shield)" />

      {/* Shield with check — the hero motif */}
      <g transform="translate(244 56)" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M44 4 8 16v22c0 24 36 40 36 40s36-16 36-40V16L44 4z" fill="rgba(255,255,255,.92)" />
        <path d="m28 40 12 12 22-24" strokeWidth="3.2" />
      </g>

      {/* Floating audit-row chips along the bottom — give the card "data" feel without crowding text */}
      <g transform="translate(20 144)" fontFamily="var(--font-display)" fontSize="10" fontWeight="500">
        <g>
          <rect width="190" height="40" rx="8" fill="rgba(255,255,255,.94)" stroke="rgba(0,0,0,.06)" />
          <circle cx="18" cy="20" r="5" fill="#10b981" />
          <text x="30" y="17" fill="var(--ink)" fontWeight="600">CQC — Safe</text>
          <text x="30" y="32" fill="var(--muted)">Last reviewed 2 days ago</text>
        </g>
        <g transform="translate(200 0)">
          <rect width="130" height="40" rx="8" fill="rgba(255,255,255,.94)" stroke="rgba(0,0,0,.06)" />
          <circle cx="18" cy="20" r="5" fill="var(--accent)" />
          <text x="30" y="17" fill="var(--ink)" fontWeight="600">12 KLOEs</text>
          <text x="30" y="32" fill="var(--muted)">All evidenced</text>
        </g>
      </g>
    </svg>
  );
}

function SecurityVisual() {
  return (
    <svg className={s.visual} viewBox="0 0 360 200" aria-hidden="true">
      <defs>
        <linearGradient id="gx-sec" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="var(--accent)" stopOpacity=".18" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Big radial wash sitting at the bottom corner so it never collides with copy */}
      <circle cx="320" cy="220" r="170" fill="url(#gx-sec)" />

      {/* Lock the visual hero */}
      <g transform="translate(228 78)" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="0" y="20" width="56" height="40" rx="6" fill="rgba(255,255,255,.96)" />
        <path d="M12 20v-8a16 16 0 0 1 32 0v8" />
        <circle cx="28" cy="40" r="3.5" fill="var(--accent)" />
        <path d="M28 43v6" />
      </g>

      {/* Compliance badges — anchored to the bottom of the viewBox so they never overlap card text */}
      <g transform="translate(20 158)" fontFamily="var(--font-display)" fontSize="10" fontWeight="600">
        <g>
          <rect width="78" height="28" rx="6" fill="rgba(255,255,255,.96)" stroke="rgba(0,93,104,.18)" />
          <text x="39" y="18" textAnchor="middle" fill="var(--accent)" letterSpacing="0.06em">GDPR</text>
        </g>
        <g transform="translate(86 0)">
          <rect width="90" height="28" rx="6" fill="rgba(255,255,255,.96)" stroke="rgba(0,93,104,.18)" />
          <text x="45" y="18" textAnchor="middle" fill="var(--accent)" letterSpacing="0.06em">ISO 27001</text>
        </g>
        <g transform="translate(184 0)">
          <rect width="90" height="28" rx="6" fill="rgba(255,255,255,.96)" stroke="rgba(0,93,104,.18)" />
          <text x="45" y="18" textAnchor="middle" fill="var(--accent)" letterSpacing="0.06em">NHS DSPT</text>
        </g>
      </g>
    </svg>
  );
}
