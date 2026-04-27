import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnOutline } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { ProgressBar } from "../components/ui/ProgressBar";
import { SearchBar } from "../components/ui/SearchBar";
import styles from "./HrPage.module.css";

const policies = [
  { name: "Maternity & Paternity", updated: "Updated Aug 2023" },
  { name: "Health & Safety", updated: "Updated Jan 2024" },
  { name: "Clinical Standards", updated: "Updated May 2023" },
  { name: "Disciplinary Code", updated: "Updated Dec 2023" },
  { name: "Expenses Policy", updated: "Updated Feb 2024" },
];

const perks = [
  { label: "Private Medical", bg: "var(--tertiary-container)", color: "var(--on-tertiary-container)" },
  { label: "Gym Membership", bg: "var(--secondary-container)", color: "var(--secondary)" },
  { label: "Cycle to Work", bg: "var(--primary-container)", color: "var(--primary)" },
  { label: "+4 More", bg: "var(--surface-highest)", color: "var(--outline)" },
];

const quickLinks = [
  { icon: "file", title: "Request a Referral", desc: "Fast-track clinical referrals for specialized cases through our internal hub.", tint: "var(--primary)" },
  { icon: "heart", title: "Mental Wellbeing", desc: "Confidential support and resources to help you maintain a healthy work-life balance.", tint: "var(--secondary)" },
  { icon: "creditcard", title: "Payslip Portal", desc: "Securely view and download your monthly salary statements and tax documents.", tint: "var(--on-tertiary-container)" },
];

export const HrPage = () => (
  <div>
    <SearchBar placeholder="Search HR policies, documents, or staff..." />

    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>HR Hub</h1>
        <p className={styles.lead}>
          Your central sanctuary for career management, employment records, and practice wellness.
        </p>
      </div>
      <BtnPrimary style={{ flexShrink: 0 }}>
        <I name="plus" size={16} color="var(--on-primary)" /> Request Time Off
      </BtnPrimary>
    </div>

    <div className={styles.bentoTop}>
      <Card hover={false} style={{ padding: 28 }}>
        <div className={styles.smallEyebrow}>
          <I name="briefcase" size={16} color="var(--primary)" />
          <span className={styles.eyebrowText}>Employment Summary</span>
        </div>
        <h3 className={styles.cardTitle}>Senior Clinical Associate</h3>
        <div className={styles.factRow}>
          <I name="calendar" size={16} color="var(--outline)" />
          <div>
            <div className={styles.factLabel}>Join Date</div>
            <div className={styles.factValue}>October 14th, 2021</div>
          </div>
        </div>
        <div className={styles.factGrid}>
          <div className={styles.factTile}>
            <div className={styles.factLabel}>Contract</div>
            <div className={styles.factTileValue}>Full-Time (Permanent)</div>
          </div>
          <div className={styles.factTile}>
            <div className={styles.factLabel}>Location</div>
            <div className={styles.factTileValue}>Harley St. Clinic</div>
          </div>
        </div>
      </Card>

      <Card hover={false} className={styles.leaveCard} style={{ padding: 28 }}>
        <div className={styles.leaveBg}>
          <I name="umbrella" size={160} color="white" />
        </div>
        <div className={styles.leaveCount}>12</div>
        <div className={styles.leaveTag}>Days Left</div>
        <div className={styles.leaveSub}>Annual Leave Balance</div>
      </Card>

      <Card hover={false} className={styles.policyCard}>
        <div className={styles.policyHeader}>
          <div className={styles.policyHeading}>
            <I name="shield" size={16} color="var(--primary)" />
            <span className={styles.eyebrowText}>HR Policy Library</span>
          </div>
          <a className={styles.policySeeAll}>See All</a>
        </div>
        <div className={styles.policyList}>
          {policies.map((p) => (
            <div key={p.name} className={styles.policyRow}>
              <div>
                <div className={styles.policyName}>{p.name}</div>
                <div className={styles.policyUpdated}>{p.updated}</div>
              </div>
              <I name="download" size={16} color="var(--outline)" />
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div className={styles.bentoMid}>
      <Card hover={false} style={{ padding: 28 }}>
        <div className={styles.smallEyebrow}>
          <I name="chart" size={16} color="var(--primary)" />
          <span className={styles.eyebrowText}>Career Growth</span>
        </div>
        <h3 className={styles.growthTitle}>Path to Specialist</h3>
        <p className={styles.growthDesc}>
          You've completed 85% of your mandatory certifications for the year. Keep it up!
        </p>
        <ProgressBar pct={85} h={8} />
        <div className={styles.growthMeta}>
          <span className={styles.growthMetaLabel}>Status</span>
          <span className={styles.growthMetaValue}>85% Complete</span>
        </div>
        <BtnOutline onClick={() => {}} style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
          View PDP Plan
        </BtnOutline>
      </Card>

      <Card hover={false} style={{ overflow: "hidden" }}>
        <div className={styles.perksMedia}>
          <div className={styles.perksMediaIcon}>
            <I name="gift" size={80} color="white" />
          </div>
          <h3 className={styles.perksMediaTitle}>Your Staff Perks</h3>
        </div>
        <div className={styles.perksBody}>
          <div className={styles.perksTagList}>
            {perks.map((p) => (
              <Pill key={p.label} bg={p.bg} color={p.color} small>{p.label}</Pill>
            ))}
          </div>
          <div className={styles.perksFooter}>
            <div style={{ display: "flex" }}>
              {["AB", "CD", "EF"].map((init) => (
                <Avatar key={init} name={init} size={28} />
              ))}
            </div>
            <span className={styles.perksFooterText}>12 others used perks this week</span>
          </div>
        </div>
      </Card>
    </div>

    <div className={styles.quickLinksGrid}>
      {quickLinks.map((q) => (
        <Card key={q.title} style={{ padding: 28, cursor: "pointer" }}>
          <div className={styles.quickIconWrap} style={{ background: `color-mix(in srgb, ${q.tint} 10%, transparent)` }}>
            <I name={q.icon} size={22} color={q.tint} />
          </div>
          <h4 className={styles.quickTitle}>{q.title}</h4>
          <p className={styles.quickDesc}>{q.desc}</p>
        </Card>
      ))}
    </div>

    <div className={styles.footer}>
      <span className={styles.footerCopy}>© 2024 Inspire Dental Group Ltd.</span>
      <div className={styles.footerLinks}>
        {["Privacy Policy", "Terms of Employment", "Support Hub"].map((l) => (
          <a key={l} className={styles.footerLink}>{l}</a>
        ))}
      </div>
    </div>
  </div>
);
