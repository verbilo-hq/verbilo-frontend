import { useState, useEffect } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnPrimary } from "../components/ui/Buttons";
import { TopBar } from "../components/layout/TopBar";
import { formatDate } from "../lib/formatDate";
import {
  listLabContacts, listDigitalGuides, listLabCases,
  createLabCase, updateLabCase,
} from "../services/lab.service";
import { isDemoMode } from "../lib/mode";
import styles from "./LabPage.module.css";

// VER-47: this page is UK dental-sector — dental lab case tracking (crowns,
// dentures, etc.). Surfaced to tenants with `sector === "dental"` and gated
// via `Tenant.enabledModules.includes("lab")`. Other sectors don't use it.

/* ── UI constants (not data — colour/status config kept page-local) ───────── */

const WORK_TYPES = [
  "Crown (PFM)", "Crown (Zirconia)", "Crown (Gold)",
  "3-Unit Bridge", "Implant Crown", "Implant Abutment",
  "Porcelain Veneers", "Composite Veneers",
  "Upper Hawley Retainer", "Lower Essix Retainer",
  "Clear Aligner (Invisalign)", "Partial Denture (Acrylic)",
  "Full Upper Denture", "Full Lower Denture",
  "Occlusal Splint", "Sports Mouthguard", "Study Models", "Other",
];

const labStatusCfg = {
  Sent:     { bg: "rgba(245,124,0,0.12)",  color: "#b36000", next: "At Lab",   nextLabel: "Mark at Lab"   },
  "At Lab": { bg: "rgba(21,101,192,0.12)", color: "#1565c0", next: "Returned", nextLabel: "Mark Returned" },
  Returned: { bg: "rgba(46,125,50,0.12)",  color: "#2e7d32", next: "Fitted",   nextLabel: "Mark Fitted"   },
  Fitted:   { bg: "rgba(100,100,100,0.1)", color: "#666",    next: null,       nextLabel: null            },
  Overdue:  { bg: "rgba(229,57,53,0.12)",  color: "#e53935", next: "Returned", nextLabel: "Mark Returned" },
};

const fmtDate = (d) => formatDate(d) || "—";

/* ── Doc row ───────────────────────────────────────────────────────────────── */

const DocRow = ({ name, reviewed }) => (
  <div className={styles.docRow}>
    <div className={styles.docIconWrap}>
      <I name="file" size={14} color="var(--primary)" />
    </div>
    <div className={styles.docInfo}>
      <span className={styles.docName}>{name}</span>
      <span className={styles.docMeta}>PDF · Reviewed {reviewed}</span>
    </div>
    <div className={styles.docActions}>
      <button className={styles.docBtn} title="Preview"><I name="eye" size={13} color="var(--primary)" /></button>
      <button className={styles.docBtn} title="Download"><I name="download" size={13} color="var(--primary)" /></button>
    </div>
  </div>
);

/* ── Log Case modal ────────────────────────────────────────────────────────── */

const LogCaseModal = ({ onClose, onSave, labContacts }) => {
  const [form, setForm] = useState({
    patient: "", clinician: "", lab: labContacts[0]?.name ?? "",
    workType: "", sentDate: new Date().toISOString().slice(0, 10),
    dueDate: "", notes: "",
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.patient.trim()) e.patient = "Required";
    if (!form.workType) e.workType = "Required";
    if (!form.dueDate) e.dueDate = "Required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    await onSave({ ...form, status: "Sent" });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.labCaseModal} onClick={e => e.stopPropagation()}>
        <div className={styles.labCaseModalHeader}>
          <div>
            <h3 className={styles.labCaseModalTitle}>Log Lab Case</h3>
            <p className={styles.labCaseModalSub}>Record a new case sent to the dental laboratory.</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}><I name="xcircle" size={22} /></button>
        </div>
        <div className={styles.labCaseModalBody}>
          <div className={styles.labCaseGrid}>
            <div className={styles.labCaseField}>
              <label className={styles.labCaseLabel}>Patient Name *</label>
              <input className={`${styles.labCaseInput} ${errors.patient ? styles.labCaseInputErr : ""}`}
                value={form.patient} onChange={e => set("patient", e.target.value)} placeholder="e.g. Mr. James Powell" />
              {errors.patient && <span className={styles.labCaseErr}>{errors.patient}</span>}
            </div>
            <div className={styles.labCaseField}>
              <label className={styles.labCaseLabel}>Clinician</label>
              <input className={styles.labCaseInput} value={form.clinician}
                onChange={e => set("clinician", e.target.value)} placeholder="e.g. Dr. Sarah Jenkins" />
            </div>
            <div className={styles.labCaseField}>
              <label className={styles.labCaseLabel}>Laboratory</label>
              <select className={styles.labCaseInput} value={form.lab} onChange={e => set("lab", e.target.value)}>
                {labContacts.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
              </select>
            </div>
            <div className={styles.labCaseField}>
              <label className={styles.labCaseLabel}>Work Type *</label>
              <select className={`${styles.labCaseInput} ${errors.workType ? styles.labCaseInputErr : ""}`}
                value={form.workType} onChange={e => set("workType", e.target.value)}>
                <option value="">Select…</option>
                {WORK_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              {errors.workType && <span className={styles.labCaseErr}>{errors.workType}</span>}
            </div>
            <div className={styles.labCaseField}>
              <label className={styles.labCaseLabel}>Date Sent</label>
              <input type="date" className={styles.labCaseInput}
                value={form.sentDate} onChange={e => set("sentDate", e.target.value)} />
            </div>
            <div className={styles.labCaseField}>
              <label className={styles.labCaseLabel}>Expected Return *</label>
              <input type="date" className={`${styles.labCaseInput} ${errors.dueDate ? styles.labCaseInputErr : ""}`}
                value={form.dueDate} min={form.sentDate} onChange={e => set("dueDate", e.target.value)} />
              {errors.dueDate && <span className={styles.labCaseErr}>{errors.dueDate}</span>}
            </div>
            <div className={`${styles.labCaseField} ${styles.labCaseFieldSpan}`}>
              <label className={styles.labCaseLabel}>Notes <span className={styles.labCaseOptional}>(optional)</span></label>
              <input className={styles.labCaseInput} value={form.notes}
                onChange={e => set("notes", e.target.value)} placeholder="Shade, special instructions…" />
            </div>
          </div>
        </div>
        <div className={styles.labCaseModalFooter}>
          <button className={styles.labCaseCancelBtn} onClick={onClose}>Cancel</button>
          <BtnPrimary onClick={handleSave}><I name="plus" size={13} /> Log Case</BtnPrimary>
        </div>
      </div>
    </div>
  );
};

/* ── Page ──────────────────────────────────────────────────────────────────── */

/* VER-89: Tenant-mode Lab Work Hub.
 *
 * Empty operational tracker — no fake cases. Demo path (existing
 * ~290 LoC of fixture-driven lab orders + contacts) lives below. */
function TenantLabPage() {
  return (
    <div>
      <TopBar
        title="Lab Work Hub"
        subtitle="Track lab orders, turnaround, and case status."
      />

      <Card hover={false}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 6px 0", fontSize: 18, color: "var(--on-surface)" }}>
          <I name="package" size={18} color="var(--primary)" /> Lab orders
        </h2>
        <p style={{ fontSize: 13, color: "var(--on-surface-variant)", margin: "0 0 16px 0" }}>
          Active and historical lab cases appear here once you add your first.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <BtnPrimary disabled title="Coming soon">
            <I name="plus" size={14} /> Add first lab order
          </BtnPrimary>
        </div>
      </Card>
    </div>
  );
}

export const LabPage = () => {
  if (!isDemoMode()) {
    return <TenantLabPage />;
  }

  const [labCases, setLabCases] = useState([]);
  const [labContacts, setLabContacts] = useState([]);
  const [digitalGuides, setDigitalGuides] = useState([]);
  const [showLogCase, setShowLogCase] = useState(false);

  useEffect(() => {
    listLabCases().then(setLabCases);
    listLabContacts().then(setLabContacts);
    listDigitalGuides().then(setDigitalGuides);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const advanceStatus = async (id) => {
    const current = labCases.find((c) => c.id === id);
    const next = current && labStatusCfg[current.status]?.next;
    if (!next) return;
    const updated = await updateLabCase(id, { status: next });
    setLabCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleLogCase = async (data) => {
    const created = await createLabCase(data);
    setLabCases((prev) => [created, ...prev]);
  };

  const overdueCount = labCases.filter(c => {
    const due = new Date(c.dueDate);
    return due < today && c.status !== "Fitted" && c.status !== "Returned";
  }).length;

  return (
    <div>
      <TopBar
        title="Lab Work Hub"
        subtitle="Laboratory contacts, digital scanning protocols, and live case tracker."
      />

      {overdueCount > 0 && (
        <div className={styles.overdueBanner}>
          <I name="alert" size={16} color="#b36000" />
          <span><strong>{overdueCount} case{overdueCount > 1 ? "s" : ""} overdue</strong> — check the tracker below and chase the relevant laboratory.</span>
        </div>
      )}

      <div className={styles.topLayout}>
        <Card hover={false} className={styles.labContactsCard}>
          <h3 className={styles.labCardTitle}>Laboratory Contacts & Turnaround</h3>
          {labContacts.map(l => (
            <div key={l.name} className={styles.labContactRow}>
              <div className={styles.labContactMain}>
                <span className={styles.labContactName}>{l.name}</span>
                <span className={styles.labContactSpec}>{l.specialty}</span>
              </div>
              <div className={styles.labContactRight}>
                <span className={styles.labTurnaround}><I name="clock" size={11} /> {l.turnaround}</span>
                <a className={styles.labPhone} href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a>
              </div>
            </div>
          ))}
        </Card>

        <Card hover={false} className={styles.labGuidesCard}>
          <h3 className={styles.labCardTitle}>Digital & Scanning Protocols</h3>
          <div className={styles.labGuideList}>
            {digitalGuides.map(g => (
              <DocRow key={g.name} name={g.name} reviewed={g.reviewed} />
            ))}
          </div>
        </Card>
      </div>

      {/* ── Lab Work Tracker ── */}
      <div className={styles.labTrackerWrap}>
        <div className={styles.labTrackerHeader}>
          <div>
            <h3 className={styles.labTrackerTitle}>Lab Work Tracker</h3>
            <p className={styles.labTrackerSub}>Live status of all cases currently with the dental laboratory.</p>
          </div>
          <button className={styles.logCaseBtn} onClick={() => setShowLogCase(true)}>
            <I name="plus" size={14} /> Log New Case
          </button>
        </div>
        <div className={styles.labTrackerCard}>
          <div className={styles.labTrackerTableHead}>
            <span style={{ flex: 2 }}>Patient / Clinician</span>
            <span style={{ flex: 2 }}>Work Type</span>
            <span style={{ flex: 2 }}>Laboratory</span>
            <span style={{ flex: 1.5 }}>Sent / Due</span>
            <span style={{ flex: 1 }}>Status</span>
            <span style={{ flex: 1.2 }}></span>
          </div>
          {labCases.map(c => {
            const due = new Date(c.dueDate);
            const isOverdue = due < today && c.status !== "Fitted" && c.status !== "Returned";
            const displayStatus = isOverdue ? "Overdue" : c.status;
            const cfg = labStatusCfg[displayStatus] ?? labStatusCfg[c.status];
            return (
              <div key={c.id} className={styles.labTrackerRow}>
                <div style={{ flex: 2, minWidth: 0 }}>
                  <div className={styles.labPatientName}>{c.patient}</div>
                  <div className={styles.labClinician}>{c.clinician}</div>
                </div>
                <div style={{ flex: 2, minWidth: 0 }}>
                  <div className={styles.labWorkType}>{c.workType}</div>
                  {c.notes && <div className={styles.labNotes}>{c.notes}</div>}
                </div>
                <div style={{ flex: 2, minWidth: 0 }} className={styles.labLabName}>{c.lab}</div>
                <div style={{ flex: 1.5, minWidth: 0 }}>
                  <div className={styles.labSentDate}>Sent {fmtDate(c.sentDate)}</div>
                  <div className={isOverdue ? styles.labDueDateOverdue : styles.labDueDate}>Due {fmtDate(c.dueDate)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <span className={styles.labStatusPill} style={{ background: cfg.bg, color: cfg.color }}>
                    {displayStatus}
                  </span>
                </div>
                <div style={{ flex: 1.2 }}>
                  {cfg.next && (
                    <button className={styles.labAdvanceBtn} onClick={() => advanceStatus(c.id)}>
                      {cfg.nextLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showLogCase && (
        <LogCaseModal
          onClose={() => setShowLogCase(false)}
          onSave={handleLogCase}
          labContacts={labContacts}
        />
      )}
    </div>
  );
};
