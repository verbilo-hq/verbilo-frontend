import { useState, useEffect } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { TopBar } from "../components/layout/TopBar";
import {
  listSnapshotActions, listLeaveRequests, updateLeaveStatus,
  listGdcRecords, listTrainingRecords, listManagerIncidents,
  getCqcSummary, getUdaTotal, listUdaDentists,
} from "../services/manager.service";
import { udaPaceTarget, udaOnTrack, udaCompletePct } from "../services/logic/manager.logic";
import { toRgba } from "../services/logic/shared.logic";
import { isDemoMode } from "../lib/mode";
import styles from "./ManagerPage.module.css";

const TRAINING_COLS = [
  { key: "bls",          label: "BLS/CPR"      },
  { key: "fire",         label: "Fire Safety"  },
  { key: "ipc",          label: "IPC"          },
  { key: "safeguarding", label: "Safeguarding" },
  { key: "gdpr",         label: "GDPR"         },
];

const UDA_TOTAL_DEFAULT = { contracted: 0, delivered: 0, period: "", monthsElapsed: 0, totalMonths: 1 };
const CQC_SUMMARY_DEFAULT = { complete: 0, total: 0, lastAudit: "—" };

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

/* VER-90: Tenant-mode Manager Hub.
 *
 * Honest zero-state. The fake UDA performance + financials + GDC
 * alerts that fill the demo path don't exist on a fresh tenant — show
 * empty cards with clear copy about what'll populate as the practice
 * records activity. */
function TenantManagerPage() {
  return (
    <div>
      <TopBar
        title="Manager Hub"
        subtitle="Practice performance, leave requests, registrations, training."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <Card hover={false}>
          <h3 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 6px 0", fontSize: 16, color: "var(--on-surface)" }}>
            <I name="trending-up" size={16} color="var(--primary)" /> UDA targets
          </h3>
          <p style={{ fontSize: 13, color: "var(--on-surface-variant)", margin: 0 }}>
            Populates once you record UDA contracts + appointment activity.
          </p>
        </Card>

        <Card hover={false}>
          <h3 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 6px 0", fontSize: 16, color: "var(--on-surface)" }}>
            <I name="calendar" size={16} color="var(--primary)" /> Leave requests
          </h3>
          <p style={{ fontSize: 13, color: "var(--on-surface-variant)", margin: 0 }}>
            No pending requests. Staff can submit leave once they're invited.
          </p>
        </Card>

        <Card hover={false}>
          <h3 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 6px 0", fontSize: 16, color: "var(--on-surface)" }}>
            <I name="award" size={16} color="var(--primary)" /> Registrations & training
          </h3>
          <p style={{ fontSize: 13, color: "var(--on-surface-variant)", margin: 0 }}>
            GDC / RCVS / HCPC expiry watch + mandatory-training overview appear here once staff records are added.
          </p>
        </Card>

        <Card hover={false}>
          <h3 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 6px 0", fontSize: 16, color: "var(--on-surface)" }}>
            <I name="shield" size={16} color="var(--primary)" /> CQC summary
          </h3>
          <p style={{ fontSize: 13, color: "var(--on-surface-variant)", margin: 0 }}>
            Compliance overview reflects evidence + incidents posted under the CQC Compliance Hub.
          </p>
        </Card>
      </div>
    </div>
  );
}

export const ManagerPage = ({ currentUser }) => {
  if (!isDemoMode()) {
    return <TenantManagerPage />;
  }

  const [snapshotActions, setSnapshotActions] = useState([]);
  const [leave,            setLeave]           = useState([]);
  const [gdcRecords,       setGdcRecords]      = useState([]);
  const [trainingRecords,  setTrainingRecords] = useState([]);
  const [incidents,        setIncidents]       = useState([]);
  const [cqcSummary,       setCqcSummary]      = useState(CQC_SUMMARY_DEFAULT);
  const [udaTotal,         setUdaTotal]        = useState(UDA_TOTAL_DEFAULT);
  const [udaDentists,      setUdaDentists]     = useState([]);
  const [inspectionDate,   setInspectionDate]  = useState("2026-05-08");
  const [open,             setOpen]            = useState({ snapshot: true });

  useEffect(() => {
    listSnapshotActions().then(setSnapshotActions);
    listLeaveRequests().then(setLeave);
    listGdcRecords().then(setGdcRecords);
    listTrainingRecords().then(setTrainingRecords);
    listManagerIncidents().then(setIncidents);
    getCqcSummary().then(setCqcSummary);
    getUdaTotal().then(setUdaTotal);
    listUdaDentists().then(setUdaDentists);
  }, []);

  const toggle = (id) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  const critical     = snapshotActions.filter(a => a.priority === "critical");
  const warning      = snapshotActions.filter(a => a.priority === "warning");
  const allClear     = snapshotActions.length === 0;
  const pendingLeave = leave.filter(r => r.status === "pending").length;

  const udaExpected = udaPaceTarget(udaTotal.contracted, udaTotal.monthsElapsed, udaTotal.totalMonths);
  const udaPct      = udaCompletePct(udaTotal.delivered, udaTotal.contracted);
  const udaTrk      = udaOnTrack(udaTotal.delivered, udaExpected);
  const udaBarPct   = Math.min(udaPct, 100);
  const udaExpPct   = udaCompletePct(udaExpected, udaTotal.contracted);

  const handleLeave = async (id, action) => {
    const updated = await updateLeaveStatus(id, action);
    setLeave(prev => prev.map(r => r.id === id ? updated : r));
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
            background: udaTrk ? "rgba(46,125,50,0.08)" : "rgba(229,57,53,0.08)",
            color: udaTrk ? "#2e7d32" : "#e53935",
          }}>
            <I name={udaTrk ? "checkcircle" : "alert"} size={13} />
            {udaTrk
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
            <span className={styles.udaStatVal} style={{ color: udaTrk ? "#2e7d32" : "#e53935" }}>{udaPct}%</span>
            <span className={styles.udaStatLabel}>Complete</span>
          </div>
        </div>

        {/* Group progress bar */}
        <div className={styles.udaBarWrap}>
          <div className={styles.udaBarTrack}>
            <div className={styles.udaBarFill} style={{ width: `${udaBarPct}%`, background: udaTrk ? "#2e7d32" : "#e53935" }} />
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

    </div>
  );
};
