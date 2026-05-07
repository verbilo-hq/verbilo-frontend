import { useState } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnPrimary } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { TopBar } from "../components/layout/TopBar";
import styles from "./ManagerPage.module.css";

const INTERNAL_KEY = "inspire_internal_news";
const todayStr = () =>
  new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/* ── Data ──────────────────────────────────────────────────────────────────── */

const SNAPSHOT_ACTIONS = [
  { priority: "critical", icon: "shieldalert", category: "Registration", text: "Amy Clarke — GDC registration expired Feb 2026",     nav: "staff" },
  { priority: "critical", icon: "alert",       category: "Incident",     text: "Needlestick incident — High severity, under review",  nav: "cqc"   },
  { priority: "critical", icon: "alert",       category: "Training",     text: "Safeguarding Adults — Amy Clarke overdue",            nav: "hr"    },
  { priority: "warning",  icon: "shieldalert", category: "Registration", text: "James Hart — GDC renewal due 30 Jun 2026 (56 days)",  nav: "staff" },
  { priority: "warning",  icon: "calendar",    category: "Leave",        text: "Leo Vance — 5 days annual leave requested (1–5 Jun)", nav: null    },
];

const initialLeave = [
  { id: 1, name: "Leo Vance",   role: "Dentist",      type: "Annual Leave",        dates: "1–5 Jun 2026",   days: 5, status: "pending"  },
  { id: 2, name: "Amy Clarke",  role: "Dental Nurse", type: "Annual Leave",        dates: "16–17 Jun 2026", days: 2, status: "pending"  },
  { id: 3, name: "Elena Rossi", role: "Hygienist",    type: "Annual Leave",        dates: "7–11 Jul 2026",  days: 5, status: "approved" },
  { id: 4, name: "James Hart",  role: "Hygienist",    type: "Study Leave",         dates: "20 May 2026",    days: 1, status: "approved" },
  { id: 5, name: "Jessica Wu",  role: "Dentist",      type: "Compassionate Leave", dates: "12 May 2026",    days: 1, status: "pending"  },
];

const gdcRecords = [
  { name: "Dr. Sarah Jenkins", role: "Dentist",             gdc: "123456", expiry: "31 Dec 2026", status: "ok"      },
  { name: "Leo Vance",         role: "Dentist",             gdc: "345678", expiry: "30 Jun 2026", status: "warning" },
  { name: "Jessica Wu",        role: "Dentist",             gdc: "456789", expiry: "31 Dec 2026", status: "ok"      },
  { name: "Elena Rossi",       role: "Hygienist/Therapist", gdc: "234567", expiry: "30 Sep 2026", status: "ok"      },
  { name: "James Hart",        role: "Hygienist/Therapist", gdc: "678901", expiry: "30 Jun 2026", status: "warning" },
  { name: "Amy Clarke",        role: "Dental Nurse",        gdc: "567890", expiry: "28 Feb 2026", status: "expired" },
  { name: "Sophie Brown",      role: "Receptionist",        gdc: "—",      expiry: "—",           status: "na"      },
];

const trainingRecords = [
  { name: "Dr. Sarah Jenkins", bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Leo Vance",         bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Jessica Wu",        bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Elena Rossi",       bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "James Hart",        bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Amy Clarke",        bls: "ok", fire: "ok", ipc: "ok", safeguarding: "overdue", gdpr: "ok" },
  { name: "Sophie Brown",      bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
];

const TRAINING_COLS = [
  { key: "bls",          label: "BLS/CPR"      },
  { key: "fire",         label: "Fire Safety"  },
  { key: "ipc",          label: "IPC"          },
  { key: "safeguarding", label: "Safeguarding" },
  { key: "gdpr",         label: "GDPR"         },
];

const incidents = [
  { id: 1, type: "Needlestick / Sharps Injury", severity: "High",   date: "20 Apr 2026", status: "Under Review", staff: "Amy Clarke"     },
  { id: 2, type: "Equipment Failure or Defect", severity: "Medium", date: "28 Apr 2026", status: "Open",         staff: "Mark Thompson"  },
  { id: 3, type: "Near Miss",                   severity: "Low",    date: "15 Mar 2026", status: "Closed",       staff: "Dr. S. Jenkins" },
];

const cqcSummary = { complete: 4, total: 13, lastAudit: "2 May 2026" };

const udaTotal = {
  contracted: 4800, delivered: 2340,
  period: "Apr 2025 – Mar 2026", monthsElapsed: 7, totalMonths: 12,
};

const udaDentists = [
  { name: "Dr. Sarah Jenkins", contracted: 2400, delivered: 1180 },
  { name: "Leo Vance",         contracted: 1400, delivered:  720 },
  { name: "Jessica Wu",        contracted: 1000, delivered:  440 },
];

/* ── Status configs ────────────────────────────────────────────────────────── */

const GDC_CFG = {
  ok:      { label: "Active",   bg: "rgba(46,125,50,0.1)",   color: "#2e7d32" },
  warning: { label: "Due Soon", bg: "rgba(245,124,0,0.1)",   color: "#b36000" },
  expired: { label: "Expired",  bg: "rgba(229,57,53,0.1)",   color: "#e53935" },
  na:      { label: "N/A",      bg: "rgba(150,150,150,0.1)", color: "#888"    },
};

const TRAINING_CFG = {
  ok:      { bg: "rgba(46,125,50,0.12)",  color: "#2e7d32", label: "✓" },
  warning: { bg: "rgba(245,124,0,0.12)",  color: "#b36000", label: "!" },
  overdue: { bg: "rgba(229,57,53,0.12)",  color: "#e53935", label: "✕" },
};

const SEVERITY_CFG = {
  High:   { bg: "rgba(229,57,53,0.1)",  color: "#e53935" },
  Medium: { bg: "rgba(245,124,0,0.1)",  color: "#b36000" },
  Low:    { bg: "rgba(46,125,50,0.1)",  color: "#2e7d32" },
};

const STATUS_CFG = {
  "Under Review": { bg: "rgba(245,124,0,0.1)",  color: "#b36000" },
  "Open":         { bg: "rgba(229,57,53,0.1)",  color: "#e53935" },
  "Closed":       { bg: "rgba(46,125,50,0.1)",  color: "#2e7d32" },
};

const LEAVE_CFG = {
  pending:  { bg: "rgba(245,124,0,0.1)",  color: "#b36000", label: "Pending"  },
  approved: { bg: "rgba(46,125,50,0.1)",  color: "#2e7d32", label: "Approved" },
  declined: { bg: "rgba(229,57,53,0.1)",  color: "#e53935", label: "Declined" },
};

/* ── Accordion helpers ─────────────────────────────────────────────────────── */

const toRgba = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const Section = ({ id, icon, iconColor, accentColor, title, badge, badgeStyle, open, onToggle, children }) => {
  const acc = accentColor || "#006974";
  const sectionStyle = {
    "--acc":        acc,
    "--acc-bg":     toRgba(acc, 0.04),
    "--acc-header": toRgba(acc, 0.06),
  };
  return (
    <div className={styles.accordion} style={sectionStyle}>
      <button className={styles.accordionHeader} onClick={() => onToggle(id)}>
        <div className={styles.accordionTitleRow}>
          <I name={icon} size={15} color={iconColor || acc} />
          <span className={styles.accordionTitle}>{title}</span>
          {badge != null && (
            <span className={styles.accordionBadge} style={badgeStyle}>{badge}</span>
          )}
        </div>
        <span style={{ display: "inline-flex", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
          <I name="chevrondown" size={16} color="var(--on-surface-variant)" />
        </span>
      </button>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  );
};

/* ── Page ──────────────────────────────────────────────────────────────────── */

export const ManagerPage = ({ currentUser }) => {
  const [leave,          setLeave]          = useState(initialLeave);
  const [inspectionDate, setInspectionDate] = useState("2026-05-08");
  const [postTitle,      setPostTitle]      = useState("");
  const [postDesc,       setPostDesc]       = useState("");
  const [postSent,       setPostSent]       = useState(false);
  const [open,           setOpen]           = useState({ snapshot: true });

  const toggle = (id) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  const critical    = SNAPSHOT_ACTIONS.filter(a => a.priority === "critical");
  const warning     = SNAPSHOT_ACTIONS.filter(a => a.priority === "warning");
  const allClear    = SNAPSHOT_ACTIONS.length === 0;
  const pendingLeave = leave.filter(r => r.status === "pending").length;

  const udaExpected = Math.round((udaTotal.contracted / udaTotal.totalMonths) * udaTotal.monthsElapsed);
  const udaPct      = Math.round((udaTotal.delivered / udaTotal.contracted) * 100);
  const udaOnTrack  = udaTotal.delivered >= udaExpected * 0.95;
  const udaBarPct   = Math.min(udaPct, 100);
  const udaExpPct   = Math.round((udaExpected / udaTotal.contracted) * 100);

  const handleLeave = (id, action) =>
    setLeave(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));

  const handlePost = () => {
    if (!postTitle.trim()) return;
    const post = {
      id: Date.now(), title: postTitle.trim(), desc: postDesc.trim(),
      date: todayStr(), author: currentUser?.displayName || "Management",
    };
    const existing = (() => { try { return JSON.parse(localStorage.getItem(INTERNAL_KEY)) || []; } catch { return []; } })();
    localStorage.setItem(INTERNAL_KEY, JSON.stringify([post, ...existing]));
    setPostTitle(""); setPostDesc(""); setPostSent(true);
    setTimeout(() => setPostSent(false), 3500);
  };

  return (
    <div>
      <TopBar
        title="Manager Hub"
        subtitle={`London Flagship · ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
      />

      {/* ══ UDA Performance Hero ══ */}
      <Card hover={false} className={styles.udaHero}>

        {/* Header row */}
        <div className={styles.udaHeroHeader}>
          <div>
            <h3 className={styles.udaHeroTitle}>
              <I name="barchart" size={16} color="var(--primary)" /> UDA Performance
            </h3>
            <p className={styles.udaHeroPeriod}>{udaTotal.period} · Month {udaTotal.monthsElapsed} of {udaTotal.totalMonths}</p>
          </div>
          <div className={styles.udaStatus} style={{
            background: udaOnTrack ? "rgba(46,125,50,0.08)" : "rgba(229,57,53,0.08)",
            color: udaOnTrack ? "#2e7d32" : "#e53935",
          }}>
            <I name={udaOnTrack ? "checkcircle" : "alert"} size={13} />
            {udaOnTrack
              ? `On track — ${(udaTotal.delivered - udaExpected).toLocaleString()} UDAs ahead`
              : `Behind — ${(udaExpected - udaTotal.delivered).toLocaleString()} UDAs below pace`}
          </div>
        </div>

        {/* Group totals */}
        <div className={styles.udaStats}>
          <div className={styles.udaStat}>
            <span className={styles.udaStatVal}>{udaTotal.delivered.toLocaleString()}</span>
            <span className={styles.udaStatLabel}>Delivered</span>
          </div>
          <div className={styles.udaStatDivider} />
          <div className={styles.udaStat}>
            <span className={styles.udaStatVal}>{udaExpected.toLocaleString()}</span>
            <span className={styles.udaStatLabel}>Expected by now</span>
          </div>
          <div className={styles.udaStatDivider} />
          <div className={styles.udaStat}>
            <span className={styles.udaStatVal}>{udaTotal.contracted.toLocaleString()}</span>
            <span className={styles.udaStatLabel}>Annual target</span>
          </div>
          <div className={styles.udaStatDivider} />
          <div className={styles.udaStat}>
            <span className={styles.udaStatVal} style={{ color: udaOnTrack ? "#2e7d32" : "#e53935" }}>{udaPct}%</span>
            <span className={styles.udaStatLabel}>Complete</span>
          </div>
        </div>

        {/* Group progress bar */}
        <div className={styles.udaBarWrap}>
          <div className={styles.udaBarTrack}>
            <div className={styles.udaBarFill} style={{ width: `${udaBarPct}%`, background: udaOnTrack ? "#2e7d32" : "#e53935" }} />
            <div className={styles.udaBarMarker} style={{ left: `${Math.min(udaExpPct, 100)}%` }} title="Expected by now" />
          </div>
          <div className={styles.udaBarLabels}>
            <span>0</span>
            <span>Expected pace</span>
            <span>{udaTotal.contracted.toLocaleString()} UDAs</span>
          </div>
        </div>

        {/* Per-dentist breakdown */}
        <div className={styles.udaDivider} />
        <div className={styles.udaDentistHead}>
          <span style={{ flex: 2 }}>Clinician</span>
          <span style={{ flex: 3 }}>Progress</span>
          <span style={{ flex: 1, textAlign: "right" }}>Delivered</span>
          <span style={{ flex: 1, textAlign: "right" }}>Target</span>
          <span style={{ flex: 1, textAlign: "right" }}>%</span>
        </div>
        {udaDentists.map(d => {
          const pct   = Math.round((d.delivered / d.contracted) * 100);
          const exp   = Math.round((d.contracted / udaTotal.totalMonths) * udaTotal.monthsElapsed);
          const onTrk = d.delivered >= exp * 0.95;
          return (
            <div key={d.name} className={styles.udaDentistRow}>
              <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <Avatar name={d.name} size={26} />
                <span className={styles.udaDentistName}>{d.name}</span>
              </div>
              <div style={{ flex: 3, paddingRight: 20 }}>
                <div className={styles.udaMiniBarTrack}>
                  <div className={styles.udaMiniBarFill} style={{ width: `${Math.min(pct, 100)}%`, background: onTrk ? "#2e7d32" : "#e53935" }} />
                </div>
              </div>
              <span style={{ flex: 1, textAlign: "right" }} className={styles.udaDentistStat}>{d.delivered.toLocaleString()}</span>
              <span style={{ flex: 1, textAlign: "right" }} className={styles.udaDentistStat}>{d.contracted.toLocaleString()}</span>
              <span className={styles.udaDentistPct} style={{ flex: 1, color: onTrk ? "#2e7d32" : "#e53935" }}>{pct}%</span>
            </div>
          );
        })}
      </Card>

      {/* ══ Accordion sections ══ */}

      <Section
        id="snapshot" icon="layers" accentColor="#006974" title="Practice Snapshot"
        badge={critical.length || undefined}
        badgeStyle={{ background: "rgba(229,57,53,0.1)", color: "#e53935" }}
        open={open.snapshot} onToggle={toggle}
      >
        {allClear ? (
          <div className={styles.allClear}>
            <I name="checkcircle" size={16} color="#2e7d32" />
            <span>Everything looks good — no actions required.</span>
          </div>
        ) : (
          <div className={styles.actionList}>
            {critical.length > 0 && (
              <>
                <div className={styles.groupLabel} style={{ color: "var(--error)" }}>
                  <I name="alert" size={11} color="var(--error)" /> Critical
                </div>
                {critical.map((a, i) => (
                  <div key={i} className={`${styles.actionRow} ${styles.actionRowCritical}`}>
                    <I name={a.icon} size={13} color="var(--error)" />
                    <span className={styles.actionCategory}>{a.category}</span>
                    <span className={styles.actionText}>{a.text}</span>
                    <I name="arrow" size={12} color="var(--outline)" />
                  </div>
                ))}
              </>
            )}
            {warning.length > 0 && (
              <>
                <div className={styles.groupLabel} style={{ color: "#b36000", marginTop: critical.length ? 12 : 0 }}>
                  <I name="clock" size={11} color="#b36000" /> Attention Needed
                </div>
                {warning.map((a, i) => (
                  <div key={i} className={`${styles.actionRow} ${styles.actionRowWarning}`}>
                    <I name={a.icon} size={13} color="#b36000" />
                    <span className={styles.actionCategory} style={{ color: "#b36000", background: "rgba(245,124,0,0.1)" }}>{a.category}</span>
                    <span className={styles.actionText}>{a.text}</span>
                    <I name="arrow" size={12} color="var(--outline)" />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </Section>

      <Section
        id="leave" icon="calendar" accentColor="#f57c00" title="Leave Requests"
        badge={pendingLeave || undefined}
        badgeStyle={{ background: "rgba(245,124,0,0.1)", color: "#b36000" }}
        open={open.leave} onToggle={toggle}
      >
        <div className={styles.leaveList}>
          {leave.map(r => {
            const cfg = LEAVE_CFG[r.status];
            return (
              <div key={r.id} className={styles.leaveRow}>
                <Avatar name={r.name} size={30} />
                <div className={styles.leaveInfo}>
                  <span className={styles.leaveName}>{r.name}</span>
                  <span className={styles.leaveMeta}>{r.type} · {r.dates} · {r.days}d</span>
                </div>
                {r.status === "pending" ? (
                  <div className={styles.leaveActions}>
                    <button className={styles.approveBtn} onClick={() => handleLeave(r.id, "approved")}>
                      <I name="check" size={12} /> Approve
                    </button>
                    <button className={styles.declineBtn} onClick={() => handleLeave(r.id, "declined")}>
                      <I name="xcircle" size={12} /> Decline
                    </button>
                  </div>
                ) : (
                  <span className={styles.leavePill} style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="gdc" icon="award" accentColor="#1565c0" title="GDC Registration Status" open={open.gdc} onToggle={toggle}>
        <div className={styles.gdcTable}>
          <div className={styles.gdcTableHead}>
            <span style={{ flex: 2 }}>Staff Member</span>
            <span style={{ flex: 1.5 }}>Role</span>
            <span style={{ flex: 1 }}>GDC No.</span>
            <span style={{ flex: 1 }}>Expiry</span>
            <span style={{ flex: 1 }}>Status</span>
          </div>
          {gdcRecords.map(r => {
            const cfg = GDC_CFG[r.status];
            return (
              <div key={r.name} className={styles.gdcRow}>
                <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <Avatar name={r.name} size={26} />
                  <span className={styles.gdcName}>{r.name}</span>
                </div>
                <span style={{ flex: 1.5 }} className={styles.gdcRole}>{r.role}</span>
                <span style={{ flex: 1 }} className={styles.gdcNum}>{r.gdc}</span>
                <span style={{ flex: 1 }} className={styles.gdcExpiry}>{r.expiry}</span>
                <span style={{ flex: 1 }}>
                  <span className={styles.statusPill} style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="training" icon="training" accentColor="#2e7d32" title="Mandatory Training Compliance" open={open.training} onToggle={toggle}>
        <div className={styles.trainingTable}>
          <div className={styles.trainingHead}>
            <span className={styles.trainingNameCol}>Staff</span>
            {TRAINING_COLS.map(c => (
              <span key={c.key} className={styles.trainingCol}>{c.label}</span>
            ))}
          </div>
          {trainingRecords.map(r => (
            <div key={r.name} className={styles.trainingRow}>
              <span className={styles.trainingNameCol}>{r.name.split(" ").pop()}</span>
              {TRAINING_COLS.map(c => {
                const cfg = TRAINING_CFG[r[c.key]] ?? TRAINING_CFG.ok;
                return (
                  <span key={c.key} className={styles.trainingCol}>
                    <span className={styles.trainingDot} style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        <p className={styles.trainingNote}>
          <I name="info" size={11} /> Full training records and due dates in <strong>HR Hub</strong> and <strong>Training Hub</strong>.
        </p>
      </Section>

      <Section id="cqc" icon="checksquare" accentColor="#6a1b9a" title="CQC Audit Progress" open={open.cqc} onToggle={toggle}>
        <div className={styles.cqcRow}>
          <div className={styles.cqcCircle}>
            <span className={styles.cqcCircleVal}>{cqcSummary.complete}/{cqcSummary.total}</span>
            <span className={styles.cqcCircleLabel}>checks done</span>
          </div>
          <div className={styles.cqcDetail}>
            <div className={styles.cqcBarTrack}>
              <div className={styles.cqcBarFill} style={{ width: `${Math.round((cqcSummary.complete / cqcSummary.total) * 100)}%` }} />
            </div>
            <p className={styles.cqcMeta}>Last audit logged: {cqcSummary.lastAudit}</p>
            <div className={styles.cqcInspection}>
              <label className={styles.cqcInspLabel}>Next CQC inspection</label>
              <input
                type="date"
                className={styles.cqcInspInput}
                value={inspectionDate}
                onChange={e => setInspectionDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="incidents" icon="alert" accentColor="#c62828" iconColor="#c62828" title="Incident Register" open={open.incidents} onToggle={toggle}>
        {incidents.map(inc => (
          <div key={inc.id} className={styles.incidentRow}>
            <div className={styles.incidentMain}>
              <span className={styles.incidentType}>{inc.type}</span>
              <span className={styles.incidentMeta}>{inc.date} · {inc.staff}</span>
            </div>
            <span className={styles.statusPill} style={{ background: SEVERITY_CFG[inc.severity].bg, color: SEVERITY_CFG[inc.severity].color }}>{inc.severity}</span>
            <span className={styles.statusPill} style={{ background: STATUS_CFG[inc.status].bg, color: STATUS_CFG[inc.status].color }}>{inc.status}</span>
          </div>
        ))}
        <p className={styles.trainingNote} style={{ marginTop: 10 }}>
          <I name="info" size={11} /> Full incident details and reporting in <strong>CQC Compliance Hub</strong>.
        </p>
      </Section>

      <Section id="announce" icon="send" accentColor="#9c27b0" title="Post Group Announcement" open={open.announce} onToggle={toggle}>
        <p className={styles.announceSub}>Announcements appear in the Group section of the dashboard for all staff.</p>
        {postSent ? (
          <div className={styles.postSent}>
            <I name="checkcircle" size={16} color="#2e7d32" />
            <span>Announcement posted to the dashboard.</span>
          </div>
        ) : (
          <div className={styles.postForm}>
            <input
              className={styles.postInput}
              placeholder="Headline…"
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
            />
            <textarea
              className={styles.postTextarea}
              placeholder="Details (optional)…"
              rows={3}
              value={postDesc}
              onChange={e => setPostDesc(e.target.value)}
            />
            <BtnPrimary onClick={handlePost} style={{ alignSelf: "flex-start", fontSize: 13 }}>
              <I name="send" size={13} /> Publish to Dashboard
            </BtnPrimary>
          </div>
        )}
      </Section>
    </div>
  );
};
