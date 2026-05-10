import { useState, useEffect, useRef } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { ProgressBar } from "../components/ui/ProgressBar";
import { formatDate } from "../lib/formatDate";
import {
  listCpdRoles, getCpdProfile, addCpdLogEntry, listPracticeStaffCpd,
} from "../services/cpd.service";
import styles from "./CpdPage.module.css";


const getStaffStatus = (s) => {
  const pct = (s.logged / s.required) * 100;
  if (s.cycleType === "gdc")    return pct >= 40 ? "on-track" : pct >= 20 ? "needs-attention" : "critical";
  return pct >= 55 ? "on-track" : pct >= 30 ? "needs-attention" : "critical";
};

const STATUS_META = {
  "on-track":        { label: "On Track",        bg: "rgba(46,125,50,0.1)",    color: "var(--success)" },
  "needs-attention": { label: "Needs Attention",  bg: "rgba(245,124,0,0.1)",    color: "#F57C00"        },
  "critical":        { label: "Critical",          bg: "rgba(229,57,53,0.1)",    color: "var(--error)"   },
};

/* ── Staff CPD card (PM overview) ─────────────────────────────────────────── */
const StaffCpdCard = ({ staff, onClick }) => {
  const pct    = Math.round((staff.logged / staff.required) * 100);
  const status = getStaffStatus(staff);
  const meta   = STATUS_META[status];
  return (
    <div className={styles.staffCpdCard} onClick={onClick}>
      <div className={styles.staffCpdTop}>
        <div className={styles.staffCpdAvatar}>{staff.initials}</div>
        <div className={styles.staffCpdInfo}>
          <span className={styles.staffCpdName}>{staff.name}</span>
          <span className={styles.staffCpdRole}>{staff.roleLabel}</span>
        </div>
        <span className={styles.staffCpdBadge} style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
      </div>
      <div className={styles.staffCpdBar}>
        <div className={styles.staffCpdBarFill} style={{ width: `${pct}%`, background: meta.color }} />
      </div>
      <div className={styles.staffCpdMeta}>
        <span className={styles.staffCpdHrs}>{staff.logged}/{staff.required} hrs · {pct}%</span>
        <span className={styles.staffCpdTopics} style={{ color: staff.topicsDone === staff.topicsTotal ? "var(--success)" : "var(--error)" }}>
          {staff.topicsDone}/{staff.topicsTotal} topics
        </span>
      </div>
    </div>
  );
};

/* ── Manager overview ─────────────────────────────────────────────────────── */
const ManagerOverview = ({ onViewStaff, onViewOwn, practiceStaff }) => {
  const [filter, setFilter] = useState("all");

  const statuses      = practiceStaff.map(getStaffStatus);
  const onTrackCount  = statuses.filter(s => s === "on-track").length;
  const needsCount    = statuses.filter(s => s === "needs-attention").length;
  const criticalCount = statuses.filter(s => s === "critical").length;
  const avgPct        = practiceStaff.length > 0
    ? Math.round(practiceStaff.reduce((sum, s) => sum + (s.logged / s.required) * 100, 0) / practiceStaff.length)
    : 0;

  const visible = filter === "all" ? practiceStaff : practiceStaff.filter(s => getStaffStatus(s) === filter);

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Practice Manager View</p>
          <h1 className={styles.title}>CPD Overview</h1>
          <p className={styles.lead}>London Flagship · {practiceStaff.length} staff members · Review each team member's progress and flag any gaps before their renewal deadline.</p>
        </div>
        <BtnSecondary onClick={onViewOwn} style={{ padding: "11px 18px", fontSize: 13, flexShrink: 0 }}>
          <I name="person" size={14} /> My CPD
        </BtnSecondary>
      </div>

      {/* Stats */}
      <div className={styles.overviewStats}>
        <div className={styles.overviewStat}>
          <span className={styles.overviewStatVal}>{practiceStaff.length}</span>
          <span className={styles.overviewStatLbl}>Total Staff</span>
        </div>
        <div className={styles.overviewStat}>
          <span className={styles.overviewStatVal}>{avgPct}%</span>
          <span className={styles.overviewStatLbl}>Avg. Completion</span>
        </div>
        <div className={styles.overviewStat} style={{ borderColor: "rgba(46,125,50,0.3)" }}>
          <span className={styles.overviewStatVal} style={{ color: "var(--success)" }}>{onTrackCount}</span>
          <span className={styles.overviewStatLbl}>On Track</span>
        </div>
        <div className={styles.overviewStat} style={{ borderColor: "rgba(245,124,0,0.3)" }}>
          <span className={styles.overviewStatVal} style={{ color: "#F57C00" }}>{needsCount}</span>
          <span className={styles.overviewStatLbl}>Needs Attention</span>
        </div>
        <div className={styles.overviewStat} style={{ borderColor: "rgba(229,57,53,0.3)" }}>
          <span className={styles.overviewStatVal} style={{ color: "var(--error)" }}>{criticalCount}</span>
          <span className={styles.overviewStatLbl}>Critical</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.overviewFilterBar}>
        {[
          { key: "all",              label: `All (${practiceStaff.length})` },
          { key: "on-track",         label: `On Track (${onTrackCount})`         },
          { key: "needs-attention",  label: `Needs Attention (${needsCount})`     },
          { key: "critical",         label: `Critical (${criticalCount})`          },
        ].map(f => (
          <button key={f.key}
            className={filter === f.key ? `${styles.overviewFilter} ${styles.overviewFilterActive}` : styles.overviewFilter}
            onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Staff grid */}
      <div className={styles.staffCpdGrid}>
        {visible.map(s => (
          <StaffCpdCard key={s.id} staff={s} onClick={() => onViewStaff(s)} />
        ))}
      </div>

      {visible.length === 0 && (
        <div className={styles.overviewEmpty}>
          <I name="checkcircle" size={32} color="var(--success)" />
          <p>No staff in this category.</p>
        </div>
      )}
    </div>
  );
};

const CPD_TYPES = ["Conference", "Workshop", "E-Learning", "Webinar", "Practical", "Study Day", "Masterclass", "Course", "Audit", "Reading", "Peer Review", "Training", "Network Event", "Other"];
const EVIDENCE_TYPES = ["Certificate", "Attendance Log", "Notes", "Audit Record", "Record Card", "Other"];

const typeColors = {
  Conference: "#9C27B0", Workshop: "var(--warning)", "E-Learning": "var(--success)",
  Webinar: "var(--secondary)", Practical: "#E91E63", "Study Day": "#FF5722",
  Masterclass: "#673AB7", Course: "var(--primary)", Audit: "#607D8B",
  Reading: "var(--outline)", "Peer Review": "#009688", Training: "var(--primary)",
  "Network Event": "#3F51B5", Other: "var(--outline)",
};

const EMPTY_FORM = {
  title: "", provider: "", date: "", type: "Workshop", hrs: "", evidence: "Certificate",
  learningNeed: "", relationToPractice: "", gdcOutcomes: [], benefit: "", reflection: "",
};

const GDC_OUTCOMES = [
  { key: "A", label: "Effective communication" },
  { key: "B", label: "Management of self / working with others" },
  { key: "C", label: "Safety and quality in the clinical environment" },
  { key: "D", label: "Maintenance and development of knowledge and skills" },
];

const LogModal = ({ onClose, onSubmit, isGdc }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [certFile, setCertFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const certInputRef = useRef(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleOutcome = (key) => {
    const curr = form.gdcOutcomes;
    set("gdcOutcomes", curr.includes(key) ? curr.filter(x => x !== key) : [...curr, key]);
  };

  const handleCertFile = (file) => {
    if (!file) return;
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) return;
    setCertFile(file);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())              e.title              = "Required";
    if (!form.provider.trim())           e.provider           = "Required";
    if (!form.date)                      e.date               = "Required";
    if (!form.hrs || isNaN(form.hrs) || Number(form.hrs) <= 0) e.hrs = "Enter a valid number";
    if (!form.learningNeed.trim())       e.learningNeed       = "Required";
    if (!form.relationToPractice.trim()) e.relationToPractice = "Required";
    if (!form.benefit.trim())            e.benefit            = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit({
      id:                 Date.now(),
      date:               formatDate(form.date),
      title:              form.title,
      provider:           form.provider,
      type:               form.type,
      hrs:                Number(form.hrs),
      evidence:           form.evidence,
      certFileName:       certFile ? certFile.name : null,
      certFileUrl:        certFile ? URL.createObjectURL(certFile) : null,
      learningNeed:       form.learningNeed,
      relationToPractice: form.relationToPractice,
      gdcOutcomes:        form.gdcOutcomes,
      benefit:            form.benefit,
      reflection:         form.reflection,
      isNew:              true,
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Log CPD Activity</h3>
            <p className={styles.modalSub}>Add a new entry to your CPD record</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <I name="xcircle" size={20} color="var(--on-surface-variant)" />
          </button>
        </div>

        {/* ── Activity Details ── */}
        <div className={styles.pdpSection}>
          <p className={styles.pdpSectionTitle}>Activity Details</p>
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formSpanFull}`}>
              <label className={styles.formLabel}>Activity Title <span className={styles.req}>*</span></label>
              <input className={`${styles.formInput} ${errors.title ? styles.inputErr : ""}`} placeholder="e.g. BDA Annual Conference 2026" value={form.title} onChange={e => set("title", e.target.value)} />
              {errors.title && <span className={styles.fieldErr}>{errors.title}</span>}
            </div>

            <div className={`${styles.formField} ${styles.formSpanFull}`}>
              <label className={styles.formLabel}>Provider / Organisation <span className={styles.req}>*</span></label>
              <input className={`${styles.formInput} ${errors.provider ? styles.inputErr : ""}`} placeholder="e.g. British Dental Association" value={form.provider} onChange={e => set("provider", e.target.value)} />
              {errors.provider && <span className={styles.fieldErr}>{errors.provider}</span>}
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Date <span className={styles.req}>*</span></label>
              <input type="date" className={`${styles.formInput} ${errors.date ? styles.inputErr : ""}`} value={form.date} onChange={e => set("date", e.target.value)} />
              {errors.date && <span className={styles.fieldErr}>{errors.date}</span>}
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>CPD Type</label>
              <select className={styles.formSelect} value={form.type} onChange={e => set("type", e.target.value)}>
                {CPD_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>CPD Hours <span className={styles.req}>*</span></label>
              <input type="number" min="0.5" step="0.5" className={`${styles.formInput} ${errors.hrs ? styles.inputErr : ""}`} placeholder="e.g. 3" value={form.hrs} onChange={e => set("hrs", e.target.value)} />
              {errors.hrs && <span className={styles.fieldErr}>{errors.hrs}</span>}
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Evidence Type</label>
              <select className={styles.formSelect} value={form.evidence} onChange={e => set("evidence", e.target.value)}>
                {EVIDENCE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className={`${styles.formField} ${styles.formSpanFull}`}>
              <label className={styles.formLabel}>Upload Certificate <span className={styles.formOptional}>(optional · PDF, JPG, PNG)</span></label>
              <input ref={certInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={e => handleCertFile(e.target.files[0])} />
              {certFile ? (
                <div className={styles.certFilled}>
                  <I name="file" size={16} color="var(--primary)" />
                  <span className={styles.certFileName}>{certFile.name}</span>
                  <button className={styles.certClearBtn} onClick={() => { setCertFile(null); if (certInputRef.current) certInputRef.current.value = ""; }}>
                    <I name="xcircle" size={14} color="var(--on-surface-variant)" />
                  </button>
                </div>
              ) : (
                <div
                  className={dragOver ? `${styles.certUploadZone} ${styles.certUploadZoneActive}` : styles.certUploadZone}
                  onClick={() => certInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleCertFile(e.dataTransfer.files[0]); }}
                >
                  <I name="upload" size={18} color="var(--outline)" />
                  <span className={styles.certUploadText}>Click to upload or drag & drop certificate</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Personal Development Plan ── */}
        <div className={styles.pdpSection}>
          <p className={styles.pdpSectionTitle}>Personal Development Plan</p>
          <div className={styles.formGrid}>
            <div className={`${styles.formField} ${styles.formSpanFull}`}>
              <label className={styles.formLabel}>Learning / Maintenance Need <span className={styles.req}>*</span></label>
              <textarea className={`${styles.formTextarea} ${errors.learningNeed ? styles.inputErr : ""}`} rows={2} placeholder="What gap or need prompted this CPD activity?" value={form.learningNeed} onChange={e => set("learningNeed", e.target.value)} />
              {errors.learningNeed && <span className={styles.fieldErr}>{errors.learningNeed}</span>}
            </div>

            <div className={`${styles.formField} ${styles.formSpanFull}`}>
              <label className={styles.formLabel}>Relation to Practice <span className={styles.req}>*</span></label>
              <textarea className={`${styles.formTextarea} ${errors.relationToPractice ? styles.inputErr : ""}`} rows={2} placeholder="How does this relate to your day-to-day clinical work?" value={form.relationToPractice} onChange={e => set("relationToPractice", e.target.value)} />
              {errors.relationToPractice && <span className={styles.fieldErr}>{errors.relationToPractice}</span>}
            </div>

            {isGdc && (
              <div className={`${styles.formField} ${styles.formSpanFull}`}>
                <label className={styles.formLabel}>GDC Development Outcome(s)</label>
                <div className={styles.gdcOutcomesGrid}>
                  {GDC_OUTCOMES.map(o => (
                    <button key={o.key} type="button"
                      className={`${styles.gdcOutcomeBtn} ${form.gdcOutcomes.includes(o.key) ? styles.gdcOutcomeBtnActive : ""}`}
                      onClick={() => toggleOutcome(o.key)}
                    >
                      <span className={styles.gdcOutcomeKey}>{o.key}</span>
                      <span className={styles.gdcOutcomeText}>{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={`${styles.formField} ${styles.formSpanFull}`}>
              <label className={styles.formLabel}>Benefit to Work / Patients <span className={styles.req}>*</span></label>
              <textarea className={`${styles.formTextarea} ${errors.benefit ? styles.inputErr : ""}`} rows={2} placeholder="What benefit will this have on your work or patient care?" value={form.benefit} onChange={e => set("benefit", e.target.value)} />
              {errors.benefit && <span className={styles.fieldErr}>{errors.benefit}</span>}
            </div>

            <div className={`${styles.formField} ${styles.formSpanFull}`}>
              <label className={styles.formLabel}>Reflective Notes <span className={styles.formOptional}>(optional)</span></label>
              <textarea className={styles.formTextarea} rows={3} placeholder="What did you learn? How will you apply it in practice?" value={form.reflection} onChange={e => set("reflection", e.target.value)} />
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <BtnSecondary onClick={onClose} style={{ padding: "10px 20px", fontSize: 13 }}>Cancel</BtnSecondary>
          <BtnPrimary onClick={handleSubmit} style={{ padding: "10px 24px", fontSize: 13 }}>
            <I name="plus" size={14} /> Log Activity
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

/* ── Certificates viewer modal ─────────────────────────────────────────────── */
const CertificatesModal = ({ entries, onClose }) => {
  const certs = entries.filter(e => e.certFileUrl);
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Uploaded Certificates</h3>
            <p className={styles.modalSub}>{certs.length} certificate{certs.length !== 1 ? "s" : ""} attached to your CPD log</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <I name="xcircle" size={20} color="var(--on-surface-variant)" />
          </button>
        </div>

        {certs.length === 0 ? (
          <div className={styles.certsEmpty}>
            <I name="file" size={36} color="var(--outline)" />
            <p>No certificates uploaded yet.</p>
            <p className={styles.certsEmptyHint}>When you log a CPD activity and attach a certificate, it will appear here.</p>
          </div>
        ) : (
          <div className={styles.certsList}>
            {certs.map(e => (
              <div key={e.id} className={styles.certsRow}>
                <div className={styles.certsIcon}>
                  <I name="file" size={16} color="var(--primary)" />
                </div>
                <div className={styles.certsInfo}>
                  <span className={styles.certsTitle}>{e.title}</span>
                  <span className={styles.certsMeta}>{e.date} · {e.provider}</span>
                  <span className={styles.certsFile}>{e.certFileName}</span>
                </div>
                <a
                  href={e.certFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.certsViewBtn}
                  onClick={ev => ev.stopPropagation()}
                >
                  <I name="external" size={13} /> View
                </a>
              </div>
            ))}
          </div>
        )}

        <div className={styles.modalFooter}>
          <BtnSecondary onClick={onClose} style={{ padding: "10px 20px", fontSize: 13 }}>Close</BtnSecondary>
        </div>
      </div>
    </div>
  );
};

export const CpdPage = ({ currentUser }) => {
  const isManager = currentUser?.role === "manager";
  const userRole  = currentUser?.role || "dentist";

  // pmView: "overview" | "own" | "drill"
  const [pmView,        setPmView]        = useState("overview");
  const [drillPerson,   setDrillPerson]   = useState(null);
  const [activeRole,    setActiveRole]    = useState(isManager ? "manager" : userRole);
  const [showModal,     setShowModal]     = useState(false);
  const [showCerts,     setShowCerts]     = useState(false);
  const [extraEntries,  setExtraEntries]  = useState({});
  const [roles,         setRoles]         = useState([]);
  const [profileMap,    setProfileMap]    = useState({});
  const [practiceStaff, setPracticeStaff] = useState([]);

  useEffect(() => {
    listCpdRoles().then(setRoles);
    listPracticeStaffCpd().then(setPracticeStaff);
  }, []);

  useEffect(() => {
    if (!profileMap[activeRole]) {
      getCpdProfile(activeRole).then((p) => {
        if (p) setProfileMap((prev) => ({ ...prev, [activeRole]: p }));
      });
    }
  }, [activeRole, profileMap]);

  const handleViewStaff = (staffMember) => {
    setActiveRole(staffMember.roleType);
    setDrillPerson(staffMember);
    setPmView("drill");
  };
  const handleViewOwn = () => { setActiveRole("manager"); setDrillPerson(null); setPmView("own"); };
  const handleBack    = () => { setPmView("overview"); setDrillPerson(null); };

  const profile = profileMap[activeRole];
  const role    = roles.find(r => r.id === activeRole);

  if (!profile || !role) {
    return (
      <div style={{ padding: 32, color: "var(--on-surface-variant)" }}>Loading CPD profile…</div>
    );
  }

  const allLog  = [...(extraEntries[activeRole] || []), ...profile.log];
  const pct = Math.round((profile.totalLogged / profile.totalRequired) * 100);

  const handleLogSubmit = async (entry) => {
    const saved = await addCpdLogEntry(activeRole, entry);
    setExtraEntries(prev => ({
      ...prev,
      [activeRole]: [saved, ...(prev[activeRole] || [])],
    }));
    setShowModal(false);
  };

  const exportLog = () => {
    const roleName  = role.label;
    const totalHrs  = allLog.reduce((s, e) => s + e.hrs, 0);
    const rows = allLog.map(e => `
      <tr>
        <td>${e.date}</td>
        <td><strong>${e.title}</strong><br/><span style="color:#586161;font-size:11px">${e.provider}</span></td>
        <td>${e.type}</td>
        <td style="text-align:center;font-weight:700">${e.hrs}</td>
        <td>${e.evidence}</td>
      </tr>`).join("");

    const topicRows = profile.mandatoryTopics.map(t => {
      const pct = Math.min(100, Math.round((t.logged / t.required) * 100));
      const status = pct === 100 ? "✓ Completed" : pct > 0 ? "In Progress" : "Not started";
      const color  = pct === 100 ? "#4caf50" : pct > 0 ? "#ff9800" : "#a83836";
      return `<tr>
        <td>${t.name}</td>
        <td style="text-align:center">${t.logged} hrs</td>
        <td style="text-align:center">${t.required} hrs</td>
        <td style="text-align:center;color:${color};font-weight:600">${status}</td>
      </tr>`;
    }).join("");

    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>CPD Log – ${roleName} – Dental Group</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; font-size: 13px; color: #2b3435; margin: 40px; }
        h1   { font-size: 22px; color: #006974; margin-bottom: 4px; }
        h2   { font-size: 15px; margin: 28px 0 10px; color: #2b3435; border-bottom: 2px solid #006974; padding-bottom: 6px; }
        .meta { font-size: 12px; color: #586161; margin-bottom: 24px; }
        .stats { display: flex; gap: 32px; background: #eff5f5; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
        .stat  { text-align: center; }
        .stat .val { font-size: 26px; font-weight: 800; color: #006974; display: block; }
        .stat .lbl { font-size: 11px; color: #586161; text-transform: uppercase; letter-spacing: 0.05em; }
        table  { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        th     { background: #eff5f5; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #586161; }
        td     { padding: 9px 10px; border-bottom: 1px solid #e2e9ea; font-size: 12px; }
        tr:last-child td { border-bottom: none; }
        .footer { margin-top: 40px; font-size: 11px; color: #737c7d; border-top: 1px solid #e2e9ea; padding-top: 12px; }
        @media print { body { margin: 20px; } }
      </style>
    </head><body>
      <h1>CPD Activity Log</h1>
      <div class="meta">
        <strong>${roleName}</strong> &nbsp;·&nbsp; ${profile.scheme} &nbsp;·&nbsp; ${profile.cyclePeriod}
        &nbsp;·&nbsp; Dental Group &nbsp;·&nbsp; Generated ${new Date().toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}
      </div>
      <div class="stats">
        <div class="stat"><span class="val">${totalHrs}</span><span class="lbl">Hours Logged</span></div>
        <div class="stat"><span class="val">${profile.totalRequired}</span><span class="lbl">Hours Required</span></div>
        <div class="stat"><span class="val">${profile.totalRequired - totalHrs}</span><span class="lbl">Hours Remaining</span></div>
        <div class="stat"><span class="val">${Math.round((totalHrs / profile.totalRequired) * 100)}%</span><span class="lbl">Cycle Complete</span></div>
      </div>
      <h2>${profile.isGdc ? "GDC Mandatory Topics" : "Key Competency Areas"}</h2>
      <table><thead><tr><th>Topic</th><th style="text-align:center">Logged</th><th style="text-align:center">Required</th><th style="text-align:center">Status</th></tr></thead>
      <tbody>${topicRows}</tbody></table>
      <h2>CPD Activity Log (${allLog.length} entries)</h2>
      <table><thead><tr><th>Date</th><th>Activity</th><th>Type</th><th style="text-align:center">Hrs</th><th>Evidence</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="footer">Dental Group &nbsp;·&nbsp; CPD Tracker &nbsp;·&nbsp; This document is for internal record-keeping purposes.</div>
    </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  // PM — show overview until they drill in or go to own CPD
  if (isManager && pmView === "overview") {
    return (
      <ManagerOverview
        onViewStaff={handleViewStaff}
        onViewOwn={handleViewOwn}
        practiceStaff={practiceStaff}
      />
    );
  }

  return (
    <div>
      {/* PM back button */}
      {isManager && (
        <button className={styles.backBtn} onClick={handleBack}>
          <I name="back" size={15} /> Back to Overview
        </button>
      )}

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{drillPerson ? drillPerson.name : "Professional Development"}</p>
          <h1 className={styles.title}>CPD Tracker</h1>
          <p className={styles.lead}>
            {drillPerson
              ? `Viewing CPD record for ${drillPerson.name} · ${drillPerson.roleLabel}.`
              : "Log external CPD from courses, webinars, and conferences here. Track your GDC hours, mandatory topics, and cycle progress."}
          </p>
        </div>
        <BtnPrimary onClick={() => setShowModal(true)} style={{ padding: "12px 20px", fontSize: 13, flexShrink: 0 }}>
          <I name="plus" size={15} /> Log CPD Activity
        </BtnPrimary>
      </div>

      {/* ── Role Tabs: only shown for PM when browsing all roles (not used now) ── */}

      {/* ── Main 2-column layout ── */}
      <div className={styles.layout}>

        {/* ════ Left / Main column ════ */}
        <div>

          {/* CPD Cycle Hero */}
          <div className={styles.heroCard}>
            <div className={styles.heroTop}>
              <div className={styles.heroMeta}>
                <span className={styles.heroScheme}>{profile.scheme}</span>
                <span className={styles.heroCycle}>{profile.cyclePeriod}</span>
                {profile.isGdc && (
                  <div className={styles.yearDots}>
                    {Array.from({ length: profile.cycleTotalYears }).map((_, i) => (
                      <div
                        key={i}
                        className={i < profile.cycleYear ? `${styles.yearDot} ${styles.yearDotFilled}` : styles.yearDot}
                        title={`Year ${i + 1}`}
                      />
                    ))}
                    <span className={styles.yearLabel}>Year {profile.cycleYear} of {profile.cycleTotalYears}</span>
                  </div>
                )}
              </div>

              {/* Ring */}
              <div
                className={styles.ring}
                style={{ background: `conic-gradient(rgba(255,255,255,0.92) 0% ${pct}%, rgba(255,255,255,0.18) ${pct}% 100%)` }}
              >
                <div className={styles.ringInner}>
                  <span className={styles.ringPct}>{pct}%</span>
                  <span className={styles.ringLabel}>complete</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatVal}>{profile.totalLogged}</span>
                <span className={styles.heroStatLbl}>Hours Logged</span>
              </div>
              <div className={styles.heroStatDiv} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatVal}>{profile.totalRequired - profile.totalLogged}</span>
                <span className={styles.heroStatLbl}>Hours Remaining</span>
              </div>
              <div className={styles.heroStatDiv} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatVal}>
                  {profile.mandatoryTopics.filter(t => t.logged >= t.required).length}/{profile.mandatoryTopics.length}
                </span>
                <span className={styles.heroStatLbl}>Mandatory Topics</span>
              </div>
            </div>

            {/* Progress bars */}
            <div className={styles.heroBars}>
              <div>
                <div className={styles.heroBarLabel}>
                  <span>Total Progress</span>
                  <span>{profile.totalLogged} / {profile.totalRequired} hrs</span>
                </div>
                <ProgressBar pct={pct} color="rgba(255,255,255,0.9)" bg="rgba(255,255,255,0.2)" h={6} />
              </div>
            </div>

            <p className={styles.heroNote}>{profile.note}</p>
          </div>

          {/* Mandatory Topics / Key Competency Areas */}
          <Card hover={false} className={styles.trackerCard}>
            <div className={styles.trackerHeader}>
              <h3 className={styles.sectionHeading}>
                <I name="shield" size={17} />
                {profile.isGdc ? "GDC Mandatory CPD Topics" : "Key Competency Areas"}
              </h3>
              <Pill bg="rgba(168,56,54,0.09)" color="var(--error)">
                {profile.mandatoryTopics.filter(t => t.logged < t.required).length} actions required
              </Pill>
            </div>
            {profile.mandatoryTopics.map(topic => {
              const done = topic.logged >= topic.required;
              const inProg = topic.logged > 0 && !done;
              const topicPct = Math.min(100, Math.round((topic.logged / topic.required) * 100));
              const statusBg    = done ? "rgba(76,175,80,0.09)"  : inProg ? "rgba(255,152,0,0.09)"  : "rgba(168,56,54,0.09)";
              const statusColor = done ? "var(--success)"        : inProg ? "var(--warning)"        : "var(--error)";
              const statusIcon  = done ? "checkcircle"           : inProg ? "clock"                 : "alert";
              const pillBg      = done ? "rgba(76,175,80,0.08)"  : inProg ? "rgba(255,152,0,0.08)"  : "rgba(168,56,54,0.08)";
              const pillLabel   = done ? "Completed"             : inProg ? "In Progress"           : "Required";
              return (
                <div key={topic.name} className={styles.trackerRow}>
                  <div className={styles.trackerInfo}>
                    <div className={styles.trackerIcon} style={{ background: statusBg }}>
                      <I name={statusIcon} size={15} color={statusColor} />
                    </div>
                    <div className={styles.trackerTextBlock}>
                      <span className={styles.trackerName}>{topic.name}</span>
                      <span className={styles.trackerMeta}>{topic.logged} / {topic.required} hrs logged</span>
                    </div>
                  </div>
                  <div className={styles.trackerRight}>
                    {!done && (
                      <div className={styles.trackerBar}>
                        <ProgressBar pct={topicPct} color={inProg ? "var(--warning)" : "var(--error)"} h={4} />
                      </div>
                    )}
                    <Pill bg={pillBg} color={statusColor} small>{pillLabel}</Pill>
                    <BtnSecondary
                      onClick={() => done
                        ? document.getElementById("cpd-log")?.scrollIntoView({ behavior: "smooth", block: "start" })
                        : setShowModal(true)
                      }
                      style={{ padding: "5px 12px", fontSize: 11 }}
                    >
                      {done ? "View Entries" : "Log Hours"}
                    </BtnSecondary>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* CPD Activity Log */}
          <div id="cpd-log" style={{ scrollMarginTop: 24 }} />
          <Card hover={false} className={styles.logCard}>
            <div className={styles.logHeader}>
              <h3 className={styles.sectionHeading}>
                <I name="clipboard" size={17} /> CPD Activity Log
                <span className={styles.logCount}>({allLog.length} entries)</span>
              </h3>
              <BtnSecondary onClick={() => setShowModal(true)} style={{ padding: "7px 14px", fontSize: 12 }}>
                <I name="plus" size={13} /> Add Entry
              </BtnSecondary>
            </div>

            <div className={styles.logTableWrap}>
              <div className={styles.logTableHead}>
                <span className={styles.logColDate}>Date</span>
                <span className={styles.logColTitle}>Activity</span>
                <span className={styles.logColType}>Type</span>
                <span className={styles.logColHrs}>Hrs</span>
                <span className={styles.logColEv}>Evidence</span>
              </div>
              {allLog.map(entry => (
                <div key={entry.id} className={`${styles.logRow} ${entry.isNew ? styles.logRowNew : ""}`}>
                  <span className={styles.logColDate}>
                    <span className={styles.logDate}>{entry.date}</span>
                  </span>
                  <span className={styles.logColTitle}>
                    <span className={styles.logTitle}>{entry.title}</span>
                    <span className={styles.logProvider}>{entry.provider}</span>
                  </span>
                  <span className={styles.logColType}>
                    <Pill
                      bg={`color-mix(in srgb, ${typeColors[entry.type] || "var(--primary)"} 12%, transparent)`}
                      color={typeColors[entry.type] || "var(--primary)"}
                      small
                    >
                      {entry.type}
                    </Pill>
                  </span>
                  <span className={styles.logColHrs}>
                    <span className={styles.logHrs}>{entry.hrs}</span>
                  </span>
                  <span className={styles.logColEv}>
                    <span className={styles.logEvidence}>{entry.evidence}</span>
                    {entry.certFileUrl && (
                      <a
                        href={entry.certFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.certViewBtn}
                        title={entry.certFileName || "View certificate"}
                        onClick={e => e.stopPropagation()}
                      >
                        <I name="file" size={12} color="var(--primary)" />
                      </a>
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.logFooter}>
              <span className={styles.logTotal}>
                Total logged: <strong>{allLog.reduce((s, e) => s + e.hrs, 0)} hrs</strong>
              </span>
              <BtnSecondary onClick={exportLog} style={{ padding: "7px 14px", fontSize: 12 }}>
                <I name="download" size={13} /> Export Log (PDF)
              </BtnSecondary>
            </div>
          </Card>
        </div>

        {/* ════ Right / Sidebar column ════ */}
        <div>

          {/* Requirements card */}
          <Card hover={false} className={styles.reqCard}>
            <h4 className={styles.reqTitle}>
              <I name="checkcircle" size={15} color="var(--primary)" />
              {profile.isGdc ? "GDC Requirements" : "Practice Requirements"}
            </h4>
            {profile.requirements.map(r => (
              <div key={r.label} className={styles.reqRow}>
                <span className={styles.reqLabel}>{r.label}</span>
                <span className={styles.reqVal}>{r.value}</span>
              </div>
            ))}
            {profile.isGdc && (
              <div className={styles.reqNote}>
                <I name="lightbulb" size={13} color="var(--primary)" />
                <span>Ensure your PDP is reviewed and updated annually before GDC renewal.</span>
              </div>
            )}
          </Card>

          {/* Mandatory topics summary */}
          <Card hover={false} className={styles.topicSummary}>
            <h4 className={styles.reqTitle}>
              <I name="barchart" size={15} color="var(--primary)" /> Topic Overview
            </h4>
            {profile.mandatoryTopics.map(t => {
              const topicPct = Math.min(100, Math.round((t.logged / t.required) * 100));
              const color = topicPct === 100 ? "var(--success)" : topicPct > 0 ? "var(--warning)" : "var(--error)";
              return (
                <div key={t.name} className={styles.topicRow}>
                  <div className={styles.topicRowTop}>
                    <span className={styles.topicRowName}>{t.name}</span>
                    <span className={styles.topicRowHrs} style={{ color }}>{t.logged}/{t.required} hrs</span>
                  </div>
                  <ProgressBar pct={topicPct} color={color} h={4} />
                </div>
              );
            })}
          </Card>


          {/* External CPD providers */}
          <Card hover={false} className={styles.reqCard}>
            <h4 className={styles.reqTitle}>
              <I name="external" size={15} color="var(--primary)" />
              External CPD Providers
            </h4>
            <p style={{ fontSize: 11, color: "var(--on-surface-variant)", lineHeight: 1.6, marginBottom: 14 }}>
              Attended a course, webinar, or conference? Log it above — it counts toward your cycle total.
            </p>
            {[
              { label: "BDA Learning",               url: "https://bda.org/cpd"                },
              { label: "GDC — Enhanced CPD",         url: "https://gdc-uk.org/cpd"             },
              { label: "FGDP CPD Courses",           url: "https://fgdp.org.uk"                },
              { label: "BSDHT Learning",             url: "https://bsdht.org.uk"               },
              { label: "Dental Update",              url: "https://dental-update.co.uk"        },
              { label: "Cpd Dentist (free CPD)",     url: "https://cpddentist.co.uk"           },
            ].map(p => (
              <div key={p.label} className={styles.reqRow} style={{ cursor: "pointer" }}
                onClick={() => window.open(p.url, "_blank", "noopener,noreferrer")}>
                <span className={styles.reqLabel}>{p.label}</span>
                <I name="external" size={11} color="var(--outline)" />
              </div>
            ))}
          </Card>

          {/* Quick Actions */}
          {[
            { icon: "award",     label: "View Certificates",    onClick: () => setShowCerts(true) },
            { icon: "download",  label: "Export CPD Log",       onClick: exportLog    },
            ...(profile.isGdc ? [{ icon: "external", label: "GDC CPD Submission", onClick: undefined }] : []),
          ].map(a => (
            <Card key={a.label} className={styles.quickAction} onClick={a.onClick}>
              <div className={styles.quickIcon}>
                <I name={a.icon} size={15} color="var(--primary)" />
              </div>
              <span className={styles.quickLabel}>{a.label}</span>
              <I name="arrow" size={14} color="var(--outline)" />
            </Card>
          ))}
        </div>
      </div>

      {showModal && (
        <LogModal onClose={() => setShowModal(false)} onSubmit={handleLogSubmit} isGdc={profile.isGdc} />
      )}
      {showCerts && (
        <CertificatesModal entries={allLog} onClose={() => setShowCerts(false)} />
      )}
    </div>
  );
};
