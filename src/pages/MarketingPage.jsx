import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { SearchBar } from "../components/ui/SearchBar";
import { TopBar } from "../components/layout/TopBar";
import styles from "./MarketingPage.module.css";

const socials = [
  {
    tag: "National Smile Month",
    title: "Radiant Smiles Campaign",
    desc: "Educational content focusing on preventive care and routine check-ups f...",
    color: "var(--success)",
  },
  {
    tag: "Limited Offer",
    title: "Summer Whitening Special",
    desc: "Promotional graphic for the 20% off laser whitening seasonal package.",
    color: "var(--primary)",
  },
  {
    tag: "Engagement",
    title: "New Patient Welcome",
    desc: "Welcoming our community with a tour of our clinical sanctuary and friendly staff.",
    color: "var(--error)",
  },
];

const assets = [
  { label: "Primary Logo", primary: false, big: false },
  { label: "Icon Mark", primary: false, big: true },
  { label: "White Variant", primary: true, big: false },
];

const standards = [
  { icon: "palette", label: "Primary Teal", desc: "#006974 — Use for main headlines and primary CTAs" },
  { icon: "target", label: "Clear Space", desc: "Maintain a minimum margin of 'I' height around the logo" },
  { icon: "shield", label: "Don'ts", desc: "Never stretch, rotate, or recolor the brand marks." },
];

export const MarketingPage = () => (
  <div>
    <SearchBar placeholder="Search brand assets, campaigns, or photography..." />
    <TopBar title="Marketing Hub" subtitle="Elevating the Inspire Dental Group brand, together." />

    <div className={styles.assetsRow}>
      <Card hover={false} style={{ padding: 28, gridColumn: "span 2" }}>
        <div className={styles.assetsHeader}>
          <div>
            <h3 className={styles.heading}>Brand Assets</h3>
            <p className={styles.helpText}>Access official Inspire Dental Group logos and identifiers.</p>
          </div>
          <BtnPrimary style={{ padding: "12px 20px", fontSize: 12 }}>
            <I name="download" size={14} /> Download All (.ZIP)
          </BtnPrimary>
        </div>
        <div className={styles.assetGrid}>
          {assets.map((a) => (
            <div
              key={a.label}
              className={a.primary ? `${styles.assetTile} ${styles.assetTilePrimary}` : styles.assetTile}
            >
              <span className={a.big ? `${styles.assetWordmark} ${styles.assetWordmarkLg}` : styles.assetWordmark}>
                {a.big ? "I" : "INSPIRE\nDENTAL"}
              </span>
              <span className={styles.assetCaption}>{a.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card hover={false} style={{ padding: 24 }}>
        <h3 className={styles.standardsTitle}>Visual Standards</h3>
        {standards.map((v) => (
          <div key={v.label} className={styles.standardItem}>
            <div className={styles.standardIcon}>
              <I name={v.icon} size={16} />
            </div>
            <div>
              <div className={styles.standardLabel}>{v.label}</div>
              <div className={styles.standardDesc}>{v.desc}</div>
            </div>
          </div>
        ))}
        <BtnSecondary style={{ width: "100%", justifyContent: "center" }}>View Full Brand Book</BtnSecondary>
      </Card>
    </div>

    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h3 className={styles.heading}>Ready-to-Post Socials</h3>
          <p className={styles.sectionLead}>Fresh content for Instagram, Facebook, and LinkedIn.</p>
        </div>
        <div className={styles.headerActions}>
          <BtnSecondary style={{ padding: "8px 16px", fontSize: 12 }}>New Content</BtnSecondary>
          <BtnSecondary style={{ padding: "8px 16px", fontSize: 12 }}>Campaigns</BtnSecondary>
        </div>
      </div>
      <div className={styles.socialsGrid}>
        {socials.map((s) => (
          <Card key={s.title} className={styles.socialCard} style={{ overflow: "hidden" }}>
            <div className={styles.socialMedia}>
              <Pill bg={s.color} color="white" small>{s.tag}</Pill>
              <I name="tooth" size={60} color="rgba(255,255,255,0.12)" />
            </div>
            <div className={styles.socialBody}>
              <h4 className={styles.socialTitle}>{s.title}</h4>
              <p className={styles.socialDesc}>{s.desc}</p>
              <div className={styles.socialActions}>
                <BtnPrimary style={{ padding: "8px 16px", fontSize: 12 }}>
                  <I name="download" size={12} /> Download
                </BtnPrimary>
                <BtnSecondary style={{ padding: "8px 16px", fontSize: 12 }}>
                  <I name="edit" size={12} /> Caption
                </BtnSecondary>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>

    <div>
      <div className={styles.galleryHeader}>
        <h3 className={styles.galleryTitle}>Team & Clinic Photography</h3>
        <a className={styles.galleryRequest}>Request Custom Shoot →</a>
      </div>
      <div className={styles.galleryGrid}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={i === 0 ? `${styles.galleryTile} ${styles.galleryTileWide}` : styles.galleryTile}
            style={{ background: `hsl(${180 + i * 15}, 30%, ${75 - i * 5}%)` }}
          >
            <I name="camera" size={24} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
