import { useState } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnSecondary } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import styles from "./StaffPage.module.css";

const featured = {
  name: "Dr. Sarah Jenkins",
  role: "Lead Orthodontist",
  qual: "MSc Orthodontics, GDC: 123456",
  bio: "Specializing in advanced Invisalign and digital dental transformations. Leading the clinical excellence program at our London flagship practice.",
};

const staff = [
  { name: "Mark Thompson", role: "Practice Manager" },
  { name: "Elena Rossi", role: "Senior Hygienist" },
  { name: "Leo Vance", role: "Dental Surgeon", online: true },
  { name: "Jessica Wu", role: "Pediatric Dentist" },
];

const locationStats = [
  { val: "18", label: "Clinicians" },
  { val: "06", label: "Support Staff" },
  { val: "02", label: "Open Roles", highlight: true },
];

export const StaffPage = () => {
  const [tab, setTab] = useState("All Staff");
  const [search, setSearch] = useState("");

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={styles.searchWrap}>
        <div className={styles.searchBar}>
          <I name="search" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name, role, or specialty..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Staff Directory</h1>
          <p className={styles.lead}>Connect with the Inspire Dental Group specialist team.</p>
        </div>
        <BtnSecondary>
          <I name="settings" size={14} /> Advanced
        </BtnSecondary>
      </div>

      <div className={styles.tabs}>
        {["All Staff", "By Practice", "By Role"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? `${styles.tab} ${styles.active}` : styles.tab}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        <div>
          <Card hover={false} style={{ padding: 32, marginBottom: 28, display: "flex", gap: 32 }}>
            <div className={styles.featuredPhotoWrap}>
              <div className={styles.featuredPhoto}>
                <Avatar name={featured.name} size={100} />
              </div>
              <div className={styles.featuredBadge}>
                <span className={styles.featuredBadgeText}>Lead Orthodontist</span>
              </div>
            </div>
            <div className={styles.featuredBody}>
              <h2 className={styles.featuredName}>{featured.name}</h2>
              <p className={styles.featuredQual}>{featured.qual}</p>
              <p className={styles.featuredBio}>{featured.bio}</p>
              <div className={styles.featuredActions}>
                <BtnSecondary><I name="mail" size={14} /> Message</BtnSecondary>
                <BtnSecondary><I name="person" size={14} /> View Profile</BtnSecondary>
              </div>
            </div>
          </Card>

          <div className={styles.staffGrid}>
            {filtered.map((s) => (
              <Card key={s.name} style={{ padding: 20, textAlign: "center" }}>
                <div className={styles.staffAvatarWrap}>
                  <Avatar name={s.name} size={64} />
                  {s.online && <div className={styles.onlineDot} />}
                </div>
                <h4 className={styles.staffName}>{s.name}</h4>
                <p className={styles.staffRole}>{s.role}</p>
                <div className={styles.staffActions}>
                  <BtnSecondary style={{ padding: "6px 14px", fontSize: 11 }}>Message</BtnSecondary>
                  <BtnSecondary style={{ padding: "6px 14px", fontSize: 11 }}>Profile</BtnSecondary>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.shiftCard}>
            <h3 className={styles.shiftTitle}>On Shift Today</h3>
            <div className={styles.shiftAvatars}>
              {["SJ", "MT", "ER"].map((init) => (
                <Avatar key={init} name={init} size={32} bg="rgba(255,255,255,0.2)" />
              ))}
              <div className={styles.shiftAvatarMore}>+12</div>
            </div>
            <div className={styles.shiftStat}>
              <div className={styles.shiftStatHeading}>
                <div className={styles.shiftStatDot} style={{ background: "var(--success)" }} />
                <span className={styles.shiftStatLabel}>Active Specialists</span>
              </div>
              <span className={styles.shiftStatValue}>24</span>
            </div>
            <div className={styles.shiftStat}>
              <div className={styles.shiftStatHeading}>
                <div className={styles.shiftStatDot} style={{ background: "var(--primary-container)" }} />
                <span className={styles.shiftStatLabel}>Available Rooms</span>
              </div>
              <span className={styles.shiftStatValue}>08</span>
            </div>
          </div>

          <Card hover={false} style={{ padding: 24, marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
            <div className={styles.locationIcon}>
              <I name="building" size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.locationName}>London Flagship</div>
              <div className={styles.locationAddress}>42 Harley Street, Marylebone</div>
            </div>
          </Card>

          <div className={styles.locationStats}>
            {locationStats.map((s) => (
              <div
                key={s.label}
                className={s.highlight ? `${styles.locationStat} ${styles.highlight}` : styles.locationStat}
              >
                <div className={styles.locationStatValue}>{s.val}</div>
                <div className={styles.locationStatLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
