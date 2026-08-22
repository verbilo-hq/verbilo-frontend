import { useEffect, useRef, useState } from 'react';
import { ScrollZoom } from './landing/ScrollZoom';
import styles from './LandingPage.module.css';

const CtaLink = ({ href, className, children }) => href
  ? <a href={href} className={className}>{children}</a>
  : <span className={`${className} ${styles.ctaDisabled}`} aria-disabled="true" title="Destination not configured">{children}</span>;

export function LandingPage({ onLoginClick, bookDemoHref = null, contactHref = null }) {
  return (
    <div className={styles.page}>
      <LandingNav onLoginClick={onLoginClick} />
      <ScrollZoom bookDemoHref={bookDemoHref} contactHref={contactHref} />
      <FeatureSections bookDemoHref={bookDemoHref} contactHref={contactHref} />
      <BenefitsSection />
      <CtaSection bookDemoHref={bookDemoHref} contactHref={contactHref} />
      <footer className={styles.footer}>
        <span className={styles.footerCopy}>© 2026 Verbilo</span>
        <nav className={styles.footerLinks}>
          <span className={styles.footerLink} aria-disabled="true">Privacy</span>
          <span className={styles.footerLink} aria-disabled="true">Terms</span>
          <CtaLink href={contactHref} className={styles.footerLink}>Contact</CtaLink>
        </nav>
      </footer>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function LandingNav({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <span className={styles.brand}>Verbilo</span>
      <div className={styles.navActions}>
        <button className={styles.navLoginBtn} onClick={onLoginClick}>
          Log In
        </button>
      </div>
    </nav>
  );
}

// ── Feature sections ──────────────────────────────────────────────────────────
const FEATURES = [
  {
    tag: 'Company News',
    headline: 'Keep everyone in the loop.',
    desc: 'Share company updates, team wins, and important announcements in one beautiful feed. Everyone stays informed, no matter where they work.',
    side: 'right',
    preview: <NewsPreview />,
  },
  {
    tag: 'Employee Directory',
    headline: 'Find anyone, instantly.',
    desc: "Search your entire organisation by name, role, or department. Every person's profile is just one click away.",
    side: 'left',
    preview: <DirectoryPreview />,
  },
  {
    tag: 'Knowledge Hub',
    headline: 'Every document, always findable.',
    desc: 'A single source of truth for policies, guides, and resources. Organised, searchable, and always up to date.',
    side: 'right',
    preview: <KnowledgePreview />,
  },
  {
    tag: 'Teams & Departments',
    headline: 'Organised by how you actually work.',
    desc: 'Dedicated spaces for every team and department. Each with their own news, members, documents, and culture.',
    side: 'left',
    preview: <TeamsPreview />,
  },
  {
    tag: 'Announcements',
    headline: 'Important updates that actually get seen.',
    desc: 'Pin critical messages so they rise above the noise. Priority alerts ensure the right people always see what matters.',
    side: 'right',
    preview: <AnnouncementsPreview />,
  },
  {
    tag: 'Events',
    headline: 'Internal life, beautifully organised.',
    desc: 'Company events, team socials, training days — all in one place. Book a spot, add to your calendar, never miss a moment.',
    side: 'left',
    preview: <EventsPreview />,
  },
];

function FeatureSections() {
  return (
    <>
      {FEATURES.map((f, i) => (
        <FeatureSection key={f.tag} feature={f} alt={i % 2 !== 0} />
      ))}
    </>
  );
}

function FeatureSection({ feature, alt }) {
  const textRef    = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const els = [textRef.current, previewRef.current].filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.visible);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const isReverse = feature.side === 'left';

  return (
    <div className={`${styles.featureSection} ${isReverse ? styles.reverse : ''} ${alt ? styles.sectionAlt : ''}`}>
      <div ref={textRef} className={`${styles.featureText} ${styles.fadeUp}`} style={{ transitionDelay: '0ms' }}>
        <span className={styles.featureTag}>{feature.tag}</span>
        <h2 className={styles.featureHeadline}>{feature.headline}</h2>
        <p className={styles.featureDesc}>{feature.desc}</p>
      </div>
      <div ref={previewRef} className={`${styles.featurePreview} ${styles.fadeUp}`} style={{ transitionDelay: '120ms' }}>
        <div className={styles.mockFrame}>
          {feature.preview}
        </div>
      </div>
    </div>
  );
}

// ── Benefits ──────────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 15l-5 3.2 1.9-5.8L4 8.8h6.1L12 3z"/>
      </svg>
    ),
    title: 'Designed for clarity',
    body: 'One place for everything. No noise, no clutter — just the information your team actually needs.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Built for connection',
    body: 'Keep every person, team, and location aligned — whether they\'re in the office or working remotely.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: 'Everything your team needs',
    body: 'News, documents, people, culture, events — all in one elegant intranet experience.',
  },
];

function BenefitsSection() {
  const refs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.visible);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    refs.forEach((r) => r.current && io.observe(r.current));
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.benefitsSection}>
      <div className={styles.sectionLabel}>Why Verbilo</div>
      <h2 className={styles.sectionHeadline}>
        The intranet your people will actually use.
      </h2>
      <div className={styles.benefitsGrid}>
        {BENEFITS.map((b, i) => (
          <div
            key={b.title}
            ref={refs[i]}
            className={`${styles.benefitCard} ${styles.fadeUp}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className={styles.benefitIcon}>{b.icon}</div>
            <div className={styles.benefitTitle}>{b.title}</div>
            <p className={styles.benefitBody}>{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function CtaSection({ bookDemoHref, contactHref }) {
  const innerRef = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          e.target.classList.add(styles.visible);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (innerRef.current) io.observe(innerRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.ctaSection}>
      <div ref={innerRef} className={`${styles.ctaInner} ${styles.fadeUp}`}>
        <h2 className={styles.ctaHeadline}>
          See Verbilo<br /><span>in action.</span>
        </h2>
        <p className={styles.ctaSub}>
          Join the companies using Verbilo to connect their people, share their knowledge, and build a culture that lasts.
        </p>
        <div className={styles.ctaButtons}>
          <CtaLink href={bookDemoHref} className={styles.ctaBtnPrimary}>Book a Demo</CtaLink>
          <CtaLink href={contactHref} className={styles.ctaBtnSecondary}>Contact Us</CtaLink>
        </div>
      </div>
    </section>
  );
}

// ── Mock UI Previews ──────────────────────────────────────────────────────────

function NewsPreview() {
  return (
    <div className={styles.newsFeed}>
      <div className={styles.newsItemFeatured}>
        <div className={styles.newsTag}>Company Update</div>
        <div className={styles.newsHeadline}>We've opened our seventh practice in Chichester</div>
        <div className={styles.newsMeta}>Posted by Sarah Hill · 2 hours ago</div>
      </div>
      <div className={styles.newsItemPlain}>
        <div className={styles.newsThumb} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />
        <div className={styles.newsItemText}>
          <div className={styles.newsItemTitle}>Q2 results: record growth across all regions</div>
          <div className={styles.newsItemDate}>Yesterday · Finance</div>
        </div>
      </div>
      <div className={styles.newsItemPlain}>
        <div className={styles.newsThumb} style={{ background: 'linear-gradient(135deg, #34d399, #059669)' }} />
        <div className={styles.newsItemText}>
          <div className={styles.newsItemTitle}>Welcome to the team — 6 new starters this month</div>
          <div className={styles.newsItemDate}>2 days ago · People</div>
        </div>
      </div>
    </div>
  );
}

function DirectoryPreview() {
  /* Healthcare-group flavoured mock roster — the buyers this page pitches
   * run practices, so the preview should look like their org, not a tech
   * company's. Names are marketing mock data, not the demo tenant's. */
  const people = [
    { initials: 'SH', name: 'Sarah Hill',    role: 'Group Director',    bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { initials: 'JK', name: 'James Kim',     role: 'Dentist',           bg: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
    { initials: 'AP', name: 'Aisha Patel',   role: 'Practice Manager',  bg: 'linear-gradient(135deg,#f472b6,#a855f7)' },
    { initials: 'TW', name: 'Tom Walsh',     role: 'Hygienist',         bg: 'linear-gradient(135deg,#f97316,#ef4444)' },
    { initials: 'LC', name: 'Lily Chen',     role: 'Lead Nurse',        bg: 'linear-gradient(135deg,#34d399,#0ea5e9)' },
    { initials: 'MB', name: 'Marcus Brown',  role: 'Reception',         bg: 'linear-gradient(135deg,#fbbf24,#f97316)' },
  ];
  return (
    <div className={styles.directoryWrap}>
      <div className={styles.directorySearch}>
        <div className={styles.directorySearchIcon} />
        <span className={styles.directorySearchText}>Search people, roles, departments…</span>
      </div>
      <div className={styles.personGrid}>
        {people.map((p) => (
          <div key={p.initials} className={styles.personCard}>
            <div className={styles.personAvatar} style={{ background: p.bg }}>{p.initials}</div>
            <div className={styles.personName}>{p.name}</div>
            <div className={styles.personRole}>{p.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgePreview() {
  const files = [
    { icon: '📄', name: 'Employee Handbook 2026',        meta: 'Updated 3 days ago · PDF', pill: 'PDF',  pillStyle: { background: 'rgba(166,27,27,0.1)', color: '#a61b1b' } },
    { icon: '📋', name: 'Infection Control Policy',      meta: 'Updated last week · Doc',  pill: 'DOC',  pillStyle: { background: 'rgba(86,88,212,0.1)', color: '#5658d4' } },
    { icon: '📊', name: 'CQC Inspection Evidence Pack',  meta: 'Updated 2 weeks ago',       pill: 'XLSX', pillStyle: { background: 'rgba(4,120,87,0.1)', color: '#047857' } },
    { icon: '🎓', name: 'New Starter Onboarding',        meta: 'Updated last month',        pill: 'DOC',  pillStyle: { background: 'rgba(86,88,212,0.1)', color: '#5658d4' } },
  ];
  return (
    <div className={styles.knowledgeWrap}>
      <div className={styles.knowledgeBreadcrumb}>
        All docs <span>›</span> <span>HR & People</span>
      </div>
      {files.map((f) => (
        <div key={f.name} className={styles.fileRow}>
          <div className={styles.fileIcon} style={{ background: 'rgba(99,102,241,0.08)', fontSize: 16 }}>{f.icon}</div>
          <div className={styles.fileInfo}>
            <div className={styles.fileName}>{f.name}</div>
            <div className={styles.fileMeta}>{f.meta}</div>
          </div>
          <div className={styles.filePill} style={f.pillStyle}>{f.pill}</div>
        </div>
      ))}
    </div>
  );
}

function TeamsPreview() {
  const teams = [
    { name: 'Clinical Team',     count: '24 members', color: '#6366f1' },
    { name: 'Nursing',           count: '18 members', color: '#f472b6' },
    { name: 'Reception & Admin', count: '12 members', color: '#f97316' },
    { name: 'Practice Managers', count: '8 members',  color: '#34d399' },
  ];
  return (
    <div className={styles.teamGrid}>
      {teams.map((t) => (
        <div key={t.name} className={styles.teamCard}>
          <div className={styles.teamColorBar} style={{ background: t.color }} />
          <div className={styles.teamName}>{t.name}</div>
          <div className={styles.teamCount}>{t.count}</div>
        </div>
      ))}
    </div>
  );
}

function AnnouncementsPreview() {
  return (
    <div className={styles.announcementStack}>
      <div className={styles.announcementPinned}>
        <div className={styles.annPriorityBadge}>⚠ Priority</div>
        <div className={styles.annTitle}>Office closure — Bank Holiday Monday 26 May</div>
        <div className={styles.annBody}>All offices will be closed. Remote workers should ensure out-of-office is set.</div>
      </div>
      <div className={styles.announcementPlain}>
        <div className={styles.annDot} style={{ background: '#6366f1' }} />
        <div>
          <div className={styles.annPlainTitle}>New expense policy effective 1 June</div>
          <div className={styles.annPlainDate}>Finance · 1 day ago</div>
        </div>
      </div>
      <div className={styles.announcementPlain}>
        <div className={styles.annDot} style={{ background: '#34d399' }} />
        <div>
          <div className={styles.annPlainTitle}>Updated parental leave policy now live</div>
          <div className={styles.annPlainDate}>HR · 3 days ago</div>
        </div>
      </div>
    </div>
  );
}

function EventsPreview() {
  const events = [
    { day: '14', month: 'MAY', title: 'All-Hands Meeting',        location: 'Main Conference Room + Zoom', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { day: '22', month: 'MAY', title: 'Summer Team Social',       location: 'Rooftop Bar, Central London',  bg: 'linear-gradient(135deg,#f97316,#ef4444)' },
    { day: '29', month: 'MAY', title: 'Leadership Training Day',  location: 'The Shard, Level 31',          bg: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
  ];
  return (
    <div className={styles.eventsList}>
      {events.map((e) => (
        <div key={e.title} className={styles.eventCard}>
          <div className={styles.eventDateBox} style={{ background: e.bg }}>
            <div className={styles.eventDay}>{e.day}</div>
            <div className={styles.eventMonth}>{e.month}</div>
          </div>
          <div className={styles.eventInfo}>
            <div className={styles.eventTitle}>{e.title}</div>
            <div className={styles.eventLocation}>{e.location}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
