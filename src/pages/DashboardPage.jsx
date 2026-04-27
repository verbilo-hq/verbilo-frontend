import { useState } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { SearchBar } from "../components/ui/SearchBar";
import { TopBar } from "../components/layout/TopBar";
import styles from "./DashboardPage.module.css";

const stats = [
  { label: "Patient Satisfaction", value: "98", unit: "%", sub: "↗ +2.4% from last month" },
  { label: "Daily Focus", value: "Medical history updates", icon: "target" },
  { label: "Compliance Health", value: "100%", sub: "Status: Optimal" },
];

const huddle = [
  { tag: "Clinic Ops", text: "Compressor at Bristol service booked for 2 PM. Avoid surgery 3 during this window.", color: "var(--primary)" },
  { tag: "Staffing", text: "Nurse Sarah on emergency leave. Nurse James covering Surgery 2 today.", color: "var(--warning)" },
  { tag: "Equipment", text: "X-ray sensors calibrated. Ready for high volume day.", color: "var(--on-tertiary-container)" },
];

const newsFeed = [
  { tag: "Group Update", title: "Expansion: New Specialist Wing opening in Bristol next month.", desc: "Learn about the new referral pathways and clinical opportunities available at the South West hub." },
  { tag: "Industry", title: "CQC launches new Single Assessment Framework for dental practices", desc: "34 Quality Statements replace the old KLOEs. All practices should review the updated guidance." },
  { tag: "Clinical", title: "FGDP updates antimicrobial prescribing guidelines", desc: "New recommendations on antibiotic use in dental infections — training module updated in the Training Hub." },
];

const milestones = [
  { name: "Mark Thompson", event: "5 Year Work Anniversary", when: "This week", emoji: "🎉" },
  { name: "Jessica Wu", event: "Birthday", when: "Friday", emoji: "🎂" },
  { name: "Dr. Maya Patel", event: "100th Implant Case", when: "Today", emoji: "🏆" },
  { name: "James Thompson", event: "1 Year Anniversary", when: "Next Mon", emoji: "⭐" },
  { name: "Nurse Clara", event: "Birthday", when: "Nov 2", emoji: "🎂" },
];

const achievements = [
  { name: "Dr. Alexander Chen", achievement: "Completed Advanced Implant Certification" },
  { name: "Elena Rossi", achievement: "200 consecutive 5-star patient reviews" },
];

export const DashboardPage = () => {
  const [shoutText, setShoutText] = useState("");
  const [shoutouts, setShoutouts] = useState([
    { from: "Dr. Maya Patel", to: "Nurse Clara", msg: "Incredible support during that complex root canal today. We couldn't have done it without your speed and precision!", time: "2h ago", fives: 12 },
    { from: "James Thompson", to: "Front Desk Team", msg: "Handling the compressor outage so smoothly while keeping the patients calm was masterclass service!", time: "Yesterday", fives: 8 },
  ]);

  const postShout = () => {
    if (!shoutText.trim()) return;
    setShoutouts([
      { from: "Dr. Alexander Chen", to: "Team", msg: shoutText, time: "Just now", fives: 0 },
      ...shoutouts,
    ]);
    setShoutText("");
  };

  const fivePlus = (idx) => {
    const updated = [...shoutouts];
    updated[idx] = { ...updated[idx], fives: updated[idx].fives + 1 };
    setShoutouts(updated);
  };

  return (
    <div>
      <SearchBar placeholder="Search announcements, protocols, or staff..." />
      <TopBar title="Good morning, Dr. Chen" subtitle="London Central Clinic • Tuesday, 24 Oct" />

      <div className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroBg}>
          <I name="tooth" size={200} color="white" />
        </div>
        <Pill bg="rgba(255,255,255,0.2)" color="white" small>{newsFeed[0].tag}</Pill>
        <h2 className={styles.heroTitle}>{newsFeed[0].title}</h2>
        <p className={styles.heroDesc}>{newsFeed[0].desc}</p>
        <BtnSecondary
          onClick={() => {}}
          style={{ marginTop: 18, background: "rgba(255,255,255,0.95)", color: "var(--primary)", padding: "10px 20px", fontSize: 13 }}
        >
          Read Full Story
        </BtnSecondary>
      </div>

      <div className={styles.layout}>
        <div>
          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <Card key={s.label} style={{ padding: 22, textAlign: i === 1 ? "center" : "left" }}>
                <p className={styles.statLabel}>{s.label}</p>
                {s.icon ? (
                  <p className={styles.statValueIcon}>{s.value}</p>
                ) : (
                  <p className={styles.statValueLg}>
                    {s.value}<span className={styles.statUnit}>{s.unit}</span>
                  </p>
                )}
                {s.sub && <p className={styles.statSub}>{s.sub}</p>}
              </Card>
            ))}
          </div>

          <Card hover={false} style={{ padding: 22, marginBottom: 22 }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardHeading}>
                <I name="zap" size={16} color="var(--primary)" /> News & Updates
              </h3>
              <a className={styles.viewAll}>View All</a>
            </div>
            <div className={styles.newsList}>
              {newsFeed.slice(1).map((n) => (
                <div key={n.title} className={styles.newsRow}>
                  <div className={styles.newsIcon}>
                    <I name={n.tag === "Industry" ? "external" : "clinical"} size={16} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.newsTagRow}>
                      <Pill
                        bg={n.tag === "Industry" ? "rgba(255,152,0,0.07)" : "rgba(0,105,116,0.07)"}
                        color={n.tag === "Industry" ? "var(--warning)" : "var(--primary)"}
                        small
                      >
                        {n.tag}
                      </Pill>
                    </div>
                    <h4 className={styles.newsTitle}>{n.title}</h4>
                    <p className={styles.newsDesc}>{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card hover={false} style={{ padding: 22, marginBottom: 22 }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardHeading}>
                <I name="award" size={16} color="var(--primary)" /> Kudos Wall
              </h3>
              <a className={styles.viewAll}>View All Shoutouts</a>
            </div>
            <div className={styles.shoutInputRow}>
              <Avatar name="Alexander Chen" size={30} />
              <input
                value={shoutText}
                onChange={(e) => setShoutText(e.target.value)}
                placeholder="Give someone a shout-out..."
                className={styles.shoutInput}
              />
              <BtnPrimary onClick={postShout} style={{ padding: "6px 12px", fontSize: 10 }}>
                <I name="send" size={11} /> Post
              </BtnPrimary>
            </div>
            <div className={styles.shoutGrid}>
              {shoutouts.map((k, i) => (
                <div key={i} className={styles.shoutCard}>
                  <div className={styles.shoutHead}>
                    <Avatar name={k.from} size={32} />
                    <div>
                      <div className={styles.shoutFrom}>{k.from}</div>
                      <div className={styles.shoutTo}>To: {k.to}</div>
                    </div>
                  </div>
                  <p className={styles.shoutMsg}>"{k.msg}"</p>
                  <div className={styles.shoutFooter}>
                    <span onClick={() => fivePlus(i)} className={styles.shoutFive}>
                      <Pill bg="rgba(0,105,116,0.06)" color="var(--primary)">
                        <I name="heart" size={10} /> High Five ({k.fives})
                      </Pill>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card hover={false} className={styles.suggestion}>
            <div className={styles.suggestionRow}>
              <div className={styles.suggestionIcon}>
                <I name="lightbulb" size={20} color="var(--on-primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 className={styles.suggestionTitle}>Suggestion Box</h3>
                <p className={styles.suggestionDesc}>
                  Got an idea to improve the practice? All submissions are anonymous and reviewed weekly by the management team.
                </p>
                <div className={styles.suggestionInputRow}>
                  <textarea rows={2} placeholder="Share your suggestion..." className={styles.suggestionTextarea} />
                  <BtnSecondary
                    style={{ background: "rgba(255,255,255,0.92)", color: "var(--primary)", padding: "10px 18px", fontSize: 12, alignSelf: "flex-end" }}
                  >
                    Submit
                  </BtnSecondary>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card hover={false} className={styles.huddle}>
            <h3 className={styles.sectionHeading}>
              <I name="clipboard" size={15} /> Daily Huddle
            </h3>
            <div className={styles.huddleList}>
              {huddle.map((h) => (
                <div
                  key={h.tag}
                  className={styles.huddleItem}
                  style={{ borderLeft: `3px solid ${h.color}` }}
                >
                  <span className={styles.huddleTag} style={{ color: h.color }}>{h.tag}</span>
                  <p className={styles.huddleText}>{h.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card hover={false} className={styles.celebrations}>
            <h3 className={styles.sectionHeading}>
              <I name="star" size={15} color="var(--primary)" /> Celebrations
            </h3>
            <div className={styles.eotm}>
              <p className={styles.eotmEyebrow}>Employee of the Month</p>
              <Avatar name="Elena Rossi" size={52} />
              <p className={styles.eotmName}>Elena Rossi</p>
              <p className={styles.eotmRole}>Senior Hygienist</p>
              <p className={styles.eotmQuote}>
                "Outstanding patient care and consistently positive feedback from every appointment."
              </p>
            </div>

            <p className={styles.subSectionLabel}>Upcoming Milestones</p>
            {milestones.map((m) => (
              <div key={`${m.name}-${m.event}`} className={styles.milestoneRow}>
                <Avatar name={m.name} size={28} />
                <div style={{ flex: 1 }}>
                  <div className={styles.milestoneName}>{m.name}</div>
                  <div className={styles.milestoneEvent}>{m.event}</div>
                </div>
                <span className={styles.milestoneEmoji}>{m.emoji}</span>
                <span className={styles.milestoneWhen}>{m.when}</span>
              </div>
            ))}

            <p className={`${styles.subSectionLabel} ${styles.subSectionLabelMid}`}>Recent Achievements</p>
            {achievements.map((a) => (
              <div key={a.name} className={styles.achievement}>
                <Avatar name={a.name} size={24} />
                <div>
                  <div className={styles.achievementName}>{a.name}</div>
                  <div className={styles.achievementText}>{a.achievement}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};
