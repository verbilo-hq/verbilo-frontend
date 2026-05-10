import styles from "./PublicLandingPage.module.css";

const sectors = [
  { name: "Dental groups", primary: true },
  { name: "Optician chains" },
  { name: "Veterinary groups" },
  { name: "Physiotherapy" },
  { name: "GP surgery groups" },
];

const features = [
  {
    title: "Role-aware by design",
    body: "Owners, area managers, practice managers and employees see only what's scoped to them — no manual permission spreadsheets.",
  },
  {
    title: "Compliance-ready audit log",
    body: "Every user change, document download and setting tweak is recorded with actor, time and context. CQC inspectors love it.",
  },
  {
    title: "Username login — no email required",
    body: "Designed for dental teams where nurses and receptionists don't have work email. Managers reset passwords. MFA when you want it.",
  },
  {
    title: "Multi-site from day one",
    body: "Bristol can't see Manchester's policies unless you say so. Group-wide announcements still reach everyone in one click.",
  },
  {
    title: "Your own subdomain",
    body: "Each tenant gets a dedicated branded URL. No shared sign-in pages, no cross-tenant data leakage, no surprises.",
  },
  {
    title: "Documents that stay private",
    body: "Files live in encrypted storage. Downloads are permission-gated and signed per-request. No public links, ever.",
  },
];

const tiers = [
  { name: "Starter",  sites: "Up to 5 sites", price: "£199", per: "/month" },
  { name: "Growth",   sites: "6–20 sites",     price: "£399", per: "/month", featured: true },
  { name: "Scale",    sites: "21–50 sites",    price: "£699", per: "/month" },
  { name: "Enterprise", sites: "50+ sites",   price: "Custom", per: "" },
];

const ToothMark = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 3.5c2.6 0 4 .9 5.4.9 1.9 0 3.1 1.3 3.1 3.6 0 2.5-1 4.6-1.8 7.6-.7 2.7-1.3 5.4-3 5.4-1.6 0-2.1-3.5-3.7-3.5S9 21 7.4 21c-1.7 0-2.3-2.7-3-5.4C3.6 12.6 2.5 10.5 2.5 8c0-2.3 1.2-3.6 3.1-3.6 1.4 0 2.8-.9 5.4-.9z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BrowserMock = () => (
  <div className={styles.browser} aria-hidden="true">
    <div className={styles.browserBar}>
      <span className={`${styles.dot} ${styles.dotR}`} />
      <span className={`${styles.dot} ${styles.dotY}`} />
      <span className={`${styles.dot} ${styles.dotG}`} />
      <div className={styles.browserUrl}>
        <span className={styles.lock}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 11V8a6 6 0 1 1 12 0v3" stroke="currentColor" strokeWidth="2" />
            <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <span className={styles.urlScheme}>https://</span>
        <span className={styles.urlSlug}>smileco</span>
        <span className={styles.urlRest}>.verbilo.co.uk</span>
      </div>
    </div>
    <div className={styles.browserBody}>
      <aside className={styles.mockSidebar}>
        <div className={styles.mockBrand}>
          <span className={styles.mockBrandMark} />
          SmileCo
        </div>
        <div className={`${styles.mockNavItem} ${styles.mockNavActive}`}>Dashboard</div>
        <div className={styles.mockNavItem}>Clinical</div>
        <div className={styles.mockNavItem}>Staff</div>
        <div className={styles.mockNavItem}>Documents</div>
        <div className={styles.mockNavItem}>CQC</div>
        <div className={styles.mockNavItem}>HR</div>
      </aside>
      <div className={styles.mockMain}>
        <div className={styles.mockGreet}>
          <div className={styles.mockGreetLine} style={{ width: "55%" }} />
          <div className={styles.mockGreetLine} style={{ width: "32%", opacity: 0.5 }} />
        </div>
        <div className={styles.mockGrid}>
          <div className={styles.mockTile}>
            <div className={styles.mockTileLabel}>Active staff</div>
            <div className={styles.mockTileValue}>247</div>
          </div>
          <div className={styles.mockTile}>
            <div className={styles.mockTileLabel}>Sites</div>
            <div className={styles.mockTileValue}>23</div>
          </div>
          <div className={styles.mockTile}>
            <div className={styles.mockTileLabel}>Docs reviewed</div>
            <div className={styles.mockTileValue}>1,084</div>
          </div>
        </div>
        <div className={styles.mockRows}>
          <div className={styles.mockRow} />
          <div className={styles.mockRow} style={{ width: "82%" }} />
          <div className={styles.mockRow} style={{ width: "68%" }} />
        </div>
      </div>
    </div>
  </div>
);

export const PublicLandingPage = () => {
  const year = new Date().getFullYear();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brandRow} href="/" aria-label="Verbilo home">
          <span className={styles.brandMark}>
            <ToothMark size={22} />
          </span>
          <span className={styles.brandWord}>Verbilo</span>
        </a>
        <nav className={styles.nav}>
          <a href="#product">Product</a>
          <a href="#sectors">Sectors</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className={styles.headerCta}>
          <a href="mailto:hello@verbilo.co.uk" className={styles.btnPrimary}>
            Book a demo <Arrow />
          </a>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <span className={styles.pulse} />
              Built for multi-site healthcare operators
            </span>
            <h1 className={styles.heroTitle}>
              The intranet your <em>dental group</em> was meant to have.
            </h1>
            <p className={styles.heroLead}>
              Verbilo replaces WhatsApp groups, shared Drives and paper trails with one
              secure platform — purpose-built for dental, optician and veterinary groups
              running 5 to 100+ sites.
            </p>
            <div className={styles.heroCtas}>
              <a href="mailto:hello@verbilo.co.uk" className={styles.btnPrimary}>
                Book a 20-min demo <Arrow />
              </a>
              <a href="#product" className={styles.btnGhost}>
                See how it works
              </a>
            </div>
            <div className={styles.trustRow}>
              <span className={styles.trustItem}>UK-hosted</span>
              <span className={styles.trustDot} />
              <span className={styles.trustItem}>GDPR compliant</span>
              <span className={styles.trustDot} />
              <span className={styles.trustItem}>CQC-aware audit log</span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <BrowserMock />
          </div>
        </section>

        <section className={styles.stripWrap} aria-label="Trusted by">
          <div className={styles.strip}>
            <span className={styles.stripLabel}>Designed for</span>
            <ul className={styles.stripList}>
              {sectors.map((s) => (
                <li key={s.name} className={s.primary ? styles.stripItemPrimary : styles.stripItem}>
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="product" className={styles.section}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.sectionTitle}>
              Everything a dental group needs.<br />
              <span className={styles.sectionTitleMuted}>Nothing it doesn't.</span>
            </h2>
            <p className={styles.sectionLead}>
              We didn't bolt a dental layer onto a generic intranet. Verbilo was built
              from scratch for healthcare hierarchy, compliance and the day-to-day chaos
              of running multiple sites.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((f) => (
              <article key={f.title} className={styles.featureCard}>
                <div className={styles.featureMark} />
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.howWrap}>
          <div className={styles.how}>
            <div className={styles.howHead}>
              <h2 className={styles.sectionTitle}>From signup to live in a week.</h2>
              <p className={styles.sectionLead}>
                We onboard you. You don't configure permission matrices in a spreadsheet
                — we sit with you for an hour and your dental group is live.
              </p>
            </div>
            <ol className={styles.steps}>
              <li className={styles.step}>
                <span className={styles.stepNum}>01</span>
                <div>
                  <h4 className={styles.stepTitle}>Provisioned subdomain</h4>
                  <p className={styles.stepBody}>
                    We spin up <code>yourgroup.verbilo.co.uk</code> with your branding and
                    your sector's navigation set.
                  </p>
                </div>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNum}>02</span>
                <div>
                  <h4 className={styles.stepTitle}>Sites and roles</h4>
                  <p className={styles.stepBody}>
                    Import your locations and staff. Roles inherit scope so a Bristol
                    manager only ever sees Bristol.
                  </p>
                </div>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNum}>03</span>
                <div>
                  <h4 className={styles.stepTitle}>Documents and audit</h4>
                  <p className={styles.stepBody}>
                    Upload your policies. From day one every download, edit and login is
                    in the audit log — ready for inspection.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section id="pricing" className={styles.section}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.sectionTitle}>Honest pricing per group.</h2>
            <p className={styles.sectionLead}>
              Unlimited users on every tier. We charge by sites, because that's what
              actually scales for our customers.
            </p>
          </div>
          <div className={styles.pricingGrid}>
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`${styles.priceCard} ${t.featured ? styles.priceCardFeatured : ""}`}
              >
                {t.featured && <span className={styles.featuredTag}>Most groups</span>}
                <div className={styles.priceName}>{t.name}</div>
                <div className={styles.priceSites}>{t.sites}</div>
                <div className={styles.priceValue}>
                  <span className={styles.priceAmount}>{t.price}</span>
                  {t.per && <span className={styles.pricePer}>{t.per}</span>}
                </div>
                <a href="mailto:hello@verbilo.co.uk" className={styles.priceCta}>
                  Talk to sales
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className={styles.ctaWrap}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaCopy}>
              <h2 className={styles.ctaTitle}>Ready to retire the WhatsApp group?</h2>
              <p className={styles.ctaLead}>
                Book a 20-minute call. We'll show you a real tenant configured for a
                23-site dental group and answer anything CQC, GDPR or technical.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <a href="mailto:hello@verbilo.co.uk" className={styles.btnPrimary}>
                Book a demo <Arrow />
              </a>
              <a href="mailto:hello@verbilo.co.uk" className={styles.btnGhostOnDark}>
                hello@verbilo.co.uk
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.brandMark}>
              <ToothMark size={18} />
            </span>
            <span className={styles.brandWord}>Verbilo</span>
          </div>
          <div className={styles.footerNote}>
            © {year} Verbilo Ltd. UK-hosted, GDPR-compliant.
          </div>
          <div className={styles.footerLinks}>
            <a href="mailto:hello@verbilo.co.uk">hello@verbilo.co.uk</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
