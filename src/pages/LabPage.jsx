import { cloneElement, useState, useEffect, useMemo, useRef } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { TopBar } from "../components/layout/TopBar";
import { useModalA11y } from "../hooks/useModalA11y";
import { formatDate } from "../lib/formatDate";
import {
  listLabContacts, listDigitalGuides, listLabCases,
  createLabCase, updateLabCase,
} from "../services/lab.service";
import { useCap } from "../services/devRole";
import { allPeople } from "../services/people";
import { SITES } from "../services/sites";
import styles from "./LabPage.module.css";

/* ─── Constants ────────────────────────────────────────────────────────────── */

const WORK_TYPES = [
  "Crown (PFM)", "Crown (Zirconia)", "Crown (Gold)",
  "3-Unit Bridge", "Implant Crown", "Implant Abutment",
  "Porcelain Veneers", "Composite Veneers",
  "Upper Hawley Retainer", "Lower Essix Retainer",
  "Clear Aligner (Invisalign)", "Partial Denture (Acrylic)",
  "Full Upper Denture", "Full Lower Denture",
  "Occlusal Splint", "Sports Mouthguard", "Study Models", "Other",
];

const SEND_METHODS = [
  "Physical impression", "Scanner portal", "Courier", "Collection", "Other",
];
const SCANNER_PLATFORMS = ["iTero", "3Shape", "Medit", "CEREC", "Other"];

/* Directory-backed picker options. Free-typing clinician / site names invited
 * typos and broke reporting joins — the staff roster and site registry are
 * the canonical sources. Values stay display-name strings, so saved case
 * rows and the detail drawer read exactly as before. */
const isClinicianRole = (role) => /dentist|clinical|hygienist|therapist/i.test(role ?? "");
const CLINICIAN_OPTIONS = allPeople()
  .filter((p) => isClinicianRole(p.role))
  .map((p) => p.displayName)
  .sort((a, b) => a.localeCompare(b));
const STAFF_OPTIONS = allPeople()
  .map((p) => p.displayName)
  .sort((a, b) => a.localeCompare(b));
const SITE_OPTIONS = SITES.map((s) => s.name);

const STAGE_META = {
  draft:                 { label: "Draft",                  bg: "#f3f4f6", color: "#4b5563" },
  prescription_prepared: { label: "Prescription Prepared",  bg: "#e0f2f1", color: "#006974" },
  awaiting_scan:         { label: "Awaiting Scan",           bg: "#fff3e0", color: "#934b00" },
  ready_to_send:         { label: "Ready to Send",           bg: "#e3f2fd", color: "#1565c0" },
  sent_to_lab:           { label: "Sent to Lab",             bg: "#fff3e0", color: "#934b00" },
  lab_acknowledged:      { label: "Lab Acknowledged",        bg: "#e0f2f1", color: "#006974" },
  lab_query:             { label: "Lab Query",                bg: "#ffebee", color: "#c62828" },
  in_production:         { label: "In Production",            bg: "#e3f2fd", color: "#1565c0" },
  returned:              { label: "Returned to Practice",     bg: "#f3e5f5", color: "#6a1b9a" },
  checked:               { label: "Checked / Ready to Fit",   bg: "#e8f5e9", color: "#2e7d32" },
  fitted:                { label: "Fitted",                   bg: "#f0f0f0", color: "#666"    },
  remake:                { label: "Remake / Rework",          bg: "#fef3e2", color: "#7a3c00" },
  cancelled:             { label: "Cancelled",                 bg: "#f5f5f5", color: "#999"    },
};
const ALL_STAGES = Object.keys(STAGE_META);

const FILTER_CHIPS = [
  { id: "all",       label: "All"           },
  { id: "overdue",   label: "Overdue"       },
  { id: "week",      label: "Due This Week" },
  { id: "sent",      label: "Sent to Lab"   },
  { id: "query",     label: "Lab Query"     },
  { id: "returned",  label: "Returned"      },
  { id: "ready",     label: "Ready to Fit"  },
  { id: "completed", label: "Completed"     },
  { id: "remakes",   label: "Remakes"       },
];

/* Map legacy `status` strings to new `stage` values for back-compat. */
const LEGACY_STATUS_TO_STAGE = {
  "Sent": "sent_to_lab",
  "At Lab": "in_production",
  "Returned": "returned",
  "Fitted": "fitted",
  "Overdue": "in_production",
};
const stageOf = (c) => c.stage ?? LEGACY_STATUS_TO_STAGE[c.status] ?? "sent_to_lab";

const fmtDate = (d) => formatDate(d) || "—";
const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${formatDate(iso)} · ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const daysBetween = (a, b) => Math.round((b.getTime() - a.getTime()) / 86400000);

const todayMidnight = () => { const t = new Date(); t.setHours(0,0,0,0); return t; };

/* ─── KPI bucket calc ─────────────────────────────────────────────────────── */

function bucketCounts(cases) {
  const today = todayMidnight();
  const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + 7);
  let overdue = 0, dueToday = 0, dueWeek = 0, returnedNotFitted = 0, queries = 0, remakes = 0;
  for (const c of cases) {
    const s = stageOf(c);
    if (s === "fitted" || s === "cancelled") continue;
    const due = c.dueDate ? new Date(c.dueDate) : null;
    if (due) {
      if (s !== "returned" && s !== "checked" && due < today) overdue += 1;
      if (due.toDateString() === today.toDateString()) dueToday += 1;
      if (due > today && due <= weekEnd) dueWeek += 1;
    }
    if (s === "returned" || s === "checked") returnedNotFitted += 1;
    if (s === "lab_query") queries += 1;
    if (s === "remake") remakes += 1;
  }
  return { overdue, dueToday, dueWeek, returnedNotFitted, queries, remakes };
}

/* Needs-attention derivation: a case appears here if it has any of:
 * overdue · due in next 2 days · returned waiting fit · lab query ·
 * statement missing on returned · remake.  */
function needsAttention(cases) {
  const today = todayMidnight();
  const inTwoDays = new Date(today); inTwoDays.setDate(inTwoDays.getDate() + 2);
  const items = [];
  for (const c of cases) {
    const s = stageOf(c);
    if (s === "fitted" || s === "cancelled") continue;
    const due = c.dueDate ? new Date(c.dueDate) : null;

    if (s === "lab_query") {
      items.push({ case: c, reason: "Lab query awaiting response", action: "Open query", severity: "high" });
      continue;
    }
    if (s === "remake") {
      items.push({ case: c, reason: "Remake / rework required", action: "Submit remake", severity: "high" });
      continue;
    }
    if (due && due < today && s !== "returned" && s !== "checked") {
      const overdueDays = daysBetween(due, today);
      items.push({ case: c, reason: `${c.workType} overdue ${overdueDays} day${overdueDays === 1 ? "" : "s"}`, action: "Chase lab", severity: "high" });
      continue;
    }
    if ((s === "returned" || s === "checked") && c.complianceChecklist?.statementExpected && !c.complianceChecklist?.statementReceived) {
      items.push({ case: c, reason: "Statement missing on return", action: "Upload statement", severity: "medium" });
      continue;
    }
    if (s === "returned" || s === "checked") {
      items.push({ case: c, reason: "Returned — fit appointment pending", action: "Book / confirm fit", severity: "medium" });
      continue;
    }
    if (due && due <= inTwoDays && due >= today) {
      const days = daysBetween(today, due);
      items.push({
        case: c,
        reason: days === 0 ? "Due today" : `Due in ${days} day${days === 1 ? "" : "s"}`,
        action: "Confirm return",
        severity: "medium",
      });
      continue;
    }
  }
  // Sort: high severity first, then by due date.
  items.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === "high" ? -1 : 1;
    return new Date(a.case.dueDate ?? 0) - new Date(b.case.dueDate ?? 0);
  });
  return items;
}

/* Filter chip → predicate */
function filterPredicate(filterId) {
  const today = todayMidnight();
  const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + 7);
  return (c) => {
    const s = stageOf(c);
    const due = c.dueDate ? new Date(c.dueDate) : null;
    switch (filterId) {
      case "all":       return true;
      case "overdue":   return due && due < today && s !== "fitted" && s !== "cancelled" && s !== "returned" && s !== "checked";
      case "week":      return due && due >= today && due <= weekEnd && s !== "fitted" && s !== "cancelled";
      case "sent":      return s === "sent_to_lab" || s === "lab_acknowledged" || s === "in_production";
      case "query":     return s === "lab_query";
      case "returned":  return s === "returned";
      case "ready":     return s === "checked";
      case "completed": return s === "fitted";
      case "remakes":   return s === "remake";
      default:          return true;
    }
  };
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

/* Deterministic colour from a name — used for initial-avatar tinting in
 * tracker rows + needs-attention cards. */
const AVATAR_COLOURS = ["#006974", "#1565c0", "#6a1b9a", "#b36000", "#2e7d32", "#c62828", "#4527a0", "#ad1457"];
const colourFor = (s) => {
  if (!s) return AVATAR_COLOURS[0];
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLOURS[Math.abs(h) % AVATAR_COLOURS.length];
};
const initialsOf = (name) => (name || "?")
  .split(/\s+/).filter(Boolean).slice(-2).map((w) => w[0].toUpperCase()).join("");

const InitialsAvatar = ({ name, size = 32 }) => (
  <span
    className={styles.initialsAvatar}
    style={{ width: size, height: size, background: `color-mix(in srgb, ${colourFor(name)} 14%, transparent)`, color: colourFor(name) }}
  >
    {initialsOf(name)}
  </span>
);

const KpiCard = ({ icon, label, sublabel, value, tone = "neutral" }) => {
  const warn = tone === "warn" && value > 0;
  return (
    <div className={`${styles.kpiCard} ${warn ? styles.kpiCardWarn : ""}`}>
      <span className={styles.kpiCardIcon}>
        <I name={icon} size={17} color={warn ? "#EF4444" : "#0D9488"} />
      </span>
      <div className={styles.kpiCardBody}>
        <div className={styles.kpiCardValueRow}>
          <span className={styles.kpiCardValue}>{value}</span>
          {warn && <span className={styles.kpiCardDot} aria-hidden />}
        </div>
        <div className={styles.kpiCardLabel}>{label}</div>
        {sublabel && <div className={styles.kpiCardSub}>{sublabel}</div>}
      </div>
    </div>
  );
};

const NA_TONE = {
  // Maps recommended-action → button colour family. Keeps the visual cue
  // consistent regardless of severity (a chase always feels urgent, a fit
  // booking always feels positive).
  "Chase lab":              { bg: "#ffebee", color: "#c62828", border: "rgba(198,40,40,0.18)" },
  "Submit remake":          { bg: "#ffebee", color: "#c62828", border: "rgba(198,40,40,0.18)" },
  "Open query":             { bg: "#e3f2fd", color: "#1565c0", border: "rgba(21,101,192,0.18)" },
  "Upload statement":       { bg: "#fff3e0", color: "#934b00", border: "rgba(147,75,0,0.22)" },
  "Book / confirm fit":     { bg: "#e8f5e9", color: "#256f2a", border: "rgba(37,111,42,0.22)" },
  "Confirm return":         { bg: "#f3e5f5", color: "#6a1b9a", border: "rgba(106,27,154,0.18)" },
};
const naTone = (action) => NA_TONE[action] ?? { bg: "#e0f2f1", color: "#006974", border: "rgba(0,105,116,0.18)" };

/* Horizontal scroller for Needs Attention cards. Scales to any number of
 * items without wrapping or truncation. Shows prev / next arrow buttons only
 * when the content actually overflows, and dims them at the ends. */
const NeedsAttentionScroller = ({ children }) => {
  const ref = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const recalc = () => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    recalc();
    const onResize = () => recalc();
    el.addEventListener("scroll", recalc, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", recalc);
      window.removeEventListener("resize", onResize);
    };
  }, [children]);

  const scrollBy = (delta) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const overflowing = !atStart || !atEnd;

  return (
    <div className={styles.naScrollWrap}>
      {overflowing && (
        <button
          type="button"
          className={`${styles.naScrollBtn} ${styles.naScrollBtnLeft} ${atStart ? styles.naScrollBtnDisabled : ""}`}
          onClick={() => scrollBy(-260)}
          disabled={atStart}
          aria-label="Scroll left"
        >
          <I name="back" size={14} color="var(--on-surface)" />
        </button>
      )}
      <div ref={ref} className={styles.naCardRow}>
        {children}
      </div>
      {overflowing && (
        <button
          type="button"
          className={`${styles.naScrollBtn} ${styles.naScrollBtnRight} ${atEnd ? styles.naScrollBtnDisabled : ""}`}
          onClick={() => scrollBy(260)}
          disabled={atEnd}
          aria-label="Scroll right"
        >
          <I name="arrow" size={14} color="var(--on-surface)" />
        </button>
      )}
    </div>
  );
};

const NeedsAttentionCard = ({ item, onOpenCase }) => {
  const c = item.case;
  const tone = naTone(item.action);
  return (
    <div className={styles.naCardItem} onClick={() => onOpenCase(c)}>
      {/* Status pill at top — replaces the floating severity icon + reason
          line so the card has a single, unambiguous reason at the top edge. */}
      <span
        className={styles.naStatusPill}
        style={{ background: tone.bg, color: tone.color }}
      >
        {item.reason}
      </span>
      <div className={styles.naCardAvatarRow}>
        <InitialsAvatar name={c.patient} size={36} />
      </div>
      <div className={styles.naCardName}>{c.patient}</div>
      <div className={styles.naCardWork}>{c.workType}</div>
      <div className={styles.naCardLab}>
        <I name="building" size={10} color="var(--on-surface-variant)" />
        <span>{c.lab}</span>
      </div>
      <button
        type="button"
        className={styles.naCardBtn}
        style={{ background: tone.bg, color: tone.color, borderColor: "transparent" }}
        onClick={(e) => { e.stopPropagation(); onOpenCase(c); }}
      >
        {item.action} <I name="arrow" size={10} color="currentColor" />
      </button>
    </div>
  );
};

/* ─── Headline readiness card — donut + stat row (matches CQC pattern) ── */

const ReadinessDonut = ({ pct, label = "ON TRACK" }) => {
  const clamped = Math.max(0, Math.min(100, pct));
  const color = pct >= 90 ? "#2e7d32" : pct >= 75 ? "#f57c00" : "#c62828";
  // conic-gradient — matches the CQC Compliance Hub gauge proportions
  // exactly: 164px outer ring × 120px inner centre = 22px-thick ring.
  return (
    <div
      className={styles.donut}
      style={{
        background: `conic-gradient(${color} 0% ${clamped}%, #e5e7eb ${clamped}% 100%)`,
      }}
    >
      <div className={styles.donutCenter}>
        <span className={styles.donutPct}>{Math.round(pct)}%</span>
        <span className={styles.donutLabel}>{label}</span>
      </div>
    </div>
  );
};

const LabReadinessCard = ({ labCases, naCount, kpis }) => {
  const active = labCases.filter((c) => {
    const s = stageOf(c);
    return s !== "fitted" && s !== "cancelled";
  }).length;
  const onTrack = Math.max(0, active - naCount);
  const pct = active === 0 ? 100 : (onTrack / active) * 100;

  // Cases that landed at "fitted" this calendar month, derived from timeline.
  const now = new Date();
  const fittedThisMonth = labCases.filter((c) => {
    const fittedEvent = (c.timeline ?? []).find((e) => /fitted/i.test(e.event));
    if (!fittedEvent) return false;
    const d = new Date(fittedEvent.at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const description = active === 0
    ? "No active lab cases. Log a new case to start tracking workflow health."
    : naCount === 0
      ? `${active} active case${active === 1 ? "" : "s"} — all progressing on schedule.`
      : `${onTrack} of ${active} active cases on track. ${kpis.overdue} overdue, ${kpis.queries} lab quer${kpis.queries === 1 ? "y" : "ies"}, ${kpis.remakes} remake${kpis.remakes === 1 ? "" : "s"} to resolve.`;

  return (
    <div className={styles.headlineCard}>
      <div className={styles.headlineDonutWrap}>
        <ReadinessDonut pct={pct} />
      </div>
      <div className={styles.headlineBody}>
        <h2 className={styles.headlineTitle}>Dental Group — Lab Activity</h2>
        <p className={styles.headlineDesc}>{description}</p>
        <div className={styles.headlineLegend}>
          <span className={styles.headlineLegendItem}>
            <span className={styles.headlineDot} style={{ background: "#2e7d32" }} /> ≥90% On Track
          </span>
          <span className={styles.headlineLegendItem}>
            <span className={styles.headlineDot} style={{ background: "#f57c00" }} /> 75–89% Watch
          </span>
          <span className={styles.headlineLegendItem}>
            <span className={styles.headlineDot} style={{ background: "#c62828" }} /> &lt;75% Action Required
          </span>
        </div>
        <div className={styles.headlineStatRow}>
          <div className={styles.headlineStat}>
            <span className={styles.headlineStatValue} style={{ color: "#006974" }}>{active}</span>
            <span className={styles.headlineStatLabel}>Active</span>
          </div>
          <div className={styles.headlineStat}>
            <span className={styles.headlineStatValue} style={{ color: "#2e7d32" }}>{fittedThisMonth}</span>
            <span className={styles.headlineStatLabel}>Fitted this month</span>
          </div>
          <div className={styles.headlineStat}>
            <span className={styles.headlineStatValue} style={{ color: "var(--on-surface)" }}>{labCases.length}</span>
            <span className={styles.headlineStatLabel}>Total cases</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StagePill = ({ stage }) => {
  const m = STAGE_META[stage] ?? { label: stage, bg: "#f0f0f0", color: "#666" };
  return <span className={styles.stagePill} style={{ background: m.bg, color: m.color }}>{m.label}</span>;
};

const DocRow = ({ name, reviewed }) => (
  <div className={styles.docRow}>
    <div className={styles.docIconWrap}><I name="file" size={14} color="var(--primary)" /></div>
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

/* ─── Log Lab Case modal (4 sections) ─────────────────────────────────── */

const blankForm = (labContacts) => ({
  patient: "", patientId: "", clinician: "", owner: "", site: "",
  workType: "", toothSite: "", material: "", shade: "", occlusionNotes: "",
  specialInstructions: "",
  lab: labContacts[0]?.name ?? "",
  sendMethod: "Physical impression", scannerPlatform: "",
  sentDate: new Date().toISOString().slice(0, 10),
  dueDate: "", fitAppointmentDate: "", labReference: "",
  prescriptionCompleted: false, attachmentsProvided: false,
  statementExpected: true,        statementReceived: false,
  deviceChecked: false,
});

const LogCaseModal = ({ onClose, onSave, labContacts }) => {
  const dialogRef = useModalA11y(onClose);
  const [form, setForm] = useState(() => blankForm(labContacts));
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

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
    const stage = form.sendMethod && form.sentDate ? "sent_to_lab" : "draft";
    await onSave({
      patient: form.patient, patientId: form.patientId,
      clinician: form.clinician, owner: form.owner, site: form.site,
      workType: form.workType + (form.toothSite ? ` — ${form.toothSite}` : ""),
      toothSite: form.toothSite, material: form.material, shade: form.shade,
      occlusionNotes: form.occlusionNotes,
      lab: form.lab,
      sendMethod: form.sendMethod, scannerPlatform: form.scannerPlatform || null,
      sentDate: form.sentDate, dueDate: form.dueDate, fitAppointmentDate: form.fitAppointmentDate,
      labReference: form.labReference,
      stage, status: "Sent",
      nextAction: "Confirm receipt at lab",
      priority: "medium",
      notes: form.specialInstructions,
      complianceChecklist: {
        prescriptionCompleted: form.prescriptionCompleted,
        attachmentsProvided:   form.attachmentsProvided,
        statementExpected:     form.statementExpected,
        statementReceived:     form.statementReceived,
        deviceChecked:         form.deviceChecked,
      },
      timeline: [{ at: new Date().toISOString(), event: "Case created", by: form.owner || "—" }],
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div ref={dialogRef} className={styles.labCaseModal} onClick={(e) => e.stopPropagation()} aria-labelledby="log-lab-case-title">
        <div className={styles.labCaseModalHeader}>
          <div>
            <h3 id="log-lab-case-title" className={styles.labCaseModalTitle}>Log Lab Case</h3>
            <p className={styles.labCaseModalSub}>Record a new case sent to the dental laboratory.</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close lab case dialog"><I name="xcircle" size={22} /></button>
        </div>
        <div className={styles.labCaseModalBody}>
          {/* Section 1 */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>1 · Patient &amp; ownership</div>
            <div className={styles.labCaseGrid}>
              <Field label="Patient Name *" error={errors.patient}>
                <input className={styles.labCaseInput} value={form.patient} onChange={(e) => set("patient", e.target.value)} placeholder="e.g. Mr. James Powell" />
              </Field>
              <Field label="Patient ID">
                <input className={styles.labCaseInput} value={form.patientId} onChange={(e) => set("patientId", e.target.value)} placeholder="e.g. P-104872" />
              </Field>
              <Field label="Clinician">
                <select className={styles.labCaseInput} value={form.clinician} onChange={(e) => set("clinician", e.target.value)}>
                  <option value="">Select clinician…</option>
                  {form.clinician && !CLINICIAN_OPTIONS.includes(form.clinician) && <option>{form.clinician}</option>}
                  {CLINICIAN_OPTIONS.map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Owner / responsible staff">
                <select className={styles.labCaseInput} value={form.owner} onChange={(e) => set("owner", e.target.value)}>
                  <option value="">Select staff member…</option>
                  {form.owner && !STAFF_OPTIONS.includes(form.owner) && <option>{form.owner}</option>}
                  {STAFF_OPTIONS.map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Site / Surgery" wide>
                <select className={styles.labCaseInput} value={form.site} onChange={(e) => set("site", e.target.value)}>
                  <option value="">Select site…</option>
                  {form.site && !SITE_OPTIONS.includes(form.site) && <option>{form.site}</option>}
                  {SITE_OPTIONS.map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Section 2 */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>2 · Case details</div>
            <div className={styles.labCaseGrid}>
              <Field label="Work Type *" error={errors.workType}>
                <select className={styles.labCaseInput} value={form.workType} onChange={(e) => set("workType", e.target.value)}>
                  <option value="">Select…</option>
                  {WORK_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Tooth / Site">
                <input className={styles.labCaseInput} value={form.toothSite} onChange={(e) => set("toothSite", e.target.value)} placeholder="e.g. UR4 or UL1–UL2" />
              </Field>
              <Field label="Material">
                <input className={styles.labCaseInput} value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="e.g. Monolithic zirconia" />
              </Field>
              <Field label="Shade">
                <input className={styles.labCaseInput} value={form.shade} onChange={(e) => set("shade", e.target.value)} placeholder="e.g. A2" />
              </Field>
              <Field label="Occlusion notes" wide>
                <input className={styles.labCaseInput} value={form.occlusionNotes} onChange={(e) => set("occlusionNotes", e.target.value)} placeholder="e.g. Standard ICP, light excursions" />
              </Field>
              <Field label="Special instructions" wide>
                <input className={styles.labCaseInput} value={form.specialInstructions} onChange={(e) => set("specialInstructions", e.target.value)} placeholder="Anything else the technician should know" />
              </Field>
            </div>
          </div>

          {/* Section 3 */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>3 · Lab dispatch</div>
            <div className={styles.labCaseGrid}>
              <Field label="Laboratory">
                <select className={styles.labCaseInput} value={form.lab} onChange={(e) => set("lab", e.target.value)}>
                  {labContacts.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
                </select>
              </Field>
              <Field label="Send method">
                <select className={styles.labCaseInput} value={form.sendMethod} onChange={(e) => set("sendMethod", e.target.value)}>
                  {SEND_METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Scanner platform">
                <select className={styles.labCaseInput} value={form.scannerPlatform} onChange={(e) => set("scannerPlatform", e.target.value)}>
                  <option value="">—</option>
                  {SCANNER_PLATFORMS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Lab reference number">
                <input className={styles.labCaseInput} value={form.labReference} onChange={(e) => set("labReference", e.target.value)} placeholder="e.g. DAL-25-104872" />
              </Field>
              <Field label="Date sent">
                <input type="date" className={styles.labCaseInput} value={form.sentDate} onChange={(e) => set("sentDate", e.target.value)} />
              </Field>
              <Field label="Expected return *" error={errors.dueDate}>
                <input type="date" className={styles.labCaseInput} value={form.dueDate} min={form.sentDate} onChange={(e) => set("dueDate", e.target.value)} />
              </Field>
              <Field label="Fit appointment date">
                <input type="date" className={styles.labCaseInput} value={form.fitAppointmentDate} min={form.dueDate || form.sentDate} onChange={(e) => set("fitAppointmentDate", e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Section 4 */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>4 · Compliance checklist</div>
            <div className={styles.checklistGrid}>
              {[
                ["prescriptionCompleted", "Prescription completed"],
                ["attachmentsProvided",   "Scan / impression / photos attached"],
                ["statementExpected",     "Statement expected on return"],
                ["statementReceived",     "Statement received"],
                ["deviceChecked",         "Device checked before fit"],
              ].map(([k, l]) => (
                <label key={k} className={styles.checkboxRow}>
                  <input type="checkbox" checked={!!form[k]} onChange={(e) => set(k, e.target.checked)} />
                  <span>{l}</span>
                </label>
              ))}
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

const Field = ({ label, error, wide, children }) => (
  <div className={`${styles.labCaseField} ${wide ? styles.labCaseFieldSpan : ""}`}>
    <label className={styles.labCaseLabel}>{label}</label>
    {cloneElement(children, { "aria-label": label.replace(/\s*\*$/, "") })}
    {error && <span className={styles.labCaseErr}>{error}</span>}
  </div>
);

/* ─── Case Detail Drawer ─────────────────────────────────────────────────── */

/* ─── Lab Resources drawer — single-purpose per open (Contacts OR Protocols).
 * Which section shows is determined by which rail button was clicked; no
 * in-drawer toggle so the drawer stays focused on one thing. */
const LabResourcesDrawer = ({ tab, onClose, labContacts, digitalGuides }) => {
  const isContacts = tab === "contacts";
  return (
    <div className={styles.drawerScrim} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.drawerHead}>
          <div className={styles.drawerHeadTop}>
            <button className={styles.drawerClose} onClick={onClose}><I name="xcircle" size={20} /></button>
            <span className={styles.drawerRef}>Lab Resources</span>
          </div>
          <h2 className={styles.drawerTitle} style={{ marginTop: 6 }}>
            {isContacts ? "Laboratory Directory" : "Protocols & Templates"}
          </h2>
          <p className={styles.drawerSub}>
            {isContacts
              ? "Every lab you work with — turnaround, scanners, collection days, notes."
              : "Lab-workflow guides and templates for daily reference."}
          </p>
        </header>

        <div className={styles.drawerBody}>
          {isContacts ? (
            <div>
              {labContacts.map((l) => (
                <div key={l.name} className={styles.labContactBlock}>
                  <div className={styles.labContactTopLine}>
                    <span className={styles.labContactName}>{l.name}</span>
                    <a className={styles.labPhone} href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a>
                  </div>
                  <div className={styles.labContactServices}>
                    {(l.services ?? l.specialty?.split(",").map((s) => s.trim()) ?? []).map((s) => (
                      <span key={s} className={styles.labServiceChip}>{s}</span>
                    ))}
                  </div>
                  <div className={styles.labContactMetaGrid}>
                    <span className={styles.labContactMetaLbl}>Turnaround</span><span className={styles.labContactMetaVal}>{l.turnaround}</span>
                    {l.scanners && (<><span className={styles.labContactMetaLbl}>Scanners</span><span className={styles.labContactMetaVal}>{l.scanners.join(" · ")}</span></>)}
                    {l.collectionDays && (<><span className={styles.labContactMetaLbl}>Collection</span><span className={styles.labContactMetaVal}>{l.collectionDays}</span></>)}
                    {l.email && (<><span className={styles.labContactMetaLbl}>Email</span><span className={styles.labContactMetaVal}>{l.email}</span></>)}
                  </div>
                  {l.notes && <div className={styles.labContactNotes}>{l.notes}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.labGuideList}>
              {digitalGuides.map((g) => (
                <DocRow key={g.name} name={g.name} reviewed={g.reviewed} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

const CaseDetailDrawer = ({ caseRow, onClose, onAction, canAct = true }) => {
  if (!caseRow) return null;
  const s = stageOf(caseRow);
  const meta = STAGE_META[s] ?? STAGE_META.draft;
  const cl = caseRow.complianceChecklist ?? {};
  const checklistDone = Object.values(cl).filter(Boolean).length;
  const checklistTotal = Object.keys(cl).length || 5;
  return (
    <div className={styles.drawerScrim} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.drawerHead}>
          <div className={styles.drawerHeadTop}>
            <button className={styles.drawerClose} onClick={onClose}><I name="xcircle" size={20} /></button>
            <span className={styles.drawerRef}>{caseRow.labReference ?? `LAB-${caseRow.id}`}</span>
          </div>
          <h3 className={styles.drawerTitle}>{caseRow.patient}</h3>
          <div className={styles.drawerSubtitle}>{caseRow.workType} · {caseRow.lab}</div>
          <div className={styles.drawerHeadMeta}>
            <StagePill stage={s} />
            <span className={styles.drawerHeadMetaItem}><I name="clock3" size={11} color="var(--on-surface-variant)" /> Due {fmtDate(caseRow.dueDate)}</span>
            {caseRow.owner && <span className={styles.drawerHeadMetaItem}><I name="person" size={11} color="var(--on-surface-variant)" /> {caseRow.owner}</span>}
          </div>
        </header>

        <section className={styles.drawerSection}>
          <div className={styles.drawerSectionTitle}>Case details</div>
          <dl className={styles.drawerDl}>
            <Dt label="Clinician"        value={caseRow.clinician} />
            <Dt label="Site"             value={caseRow.site} />
            <Dt label="Tooth / site"     value={caseRow.toothSite} />
            <Dt label="Material"         value={caseRow.material} />
            <Dt label="Shade"            value={caseRow.shade} />
            <Dt label="Send method"      value={caseRow.sendMethod} />
            <Dt label="Scanner platform" value={caseRow.scannerPlatform} />
            <Dt label="Lab reference"    value={caseRow.labReference} />
            <Dt label="Sent"             value={fmtDate(caseRow.sentDate)} />
            <Dt label="Due"              value={fmtDate(caseRow.dueDate)} />
            <Dt label="Fit appointment"  value={fmtDate(caseRow.fitAppointmentDate)} />
          </dl>
          {caseRow.occlusionNotes && (
            <div className={styles.drawerNoteBlock}><span className={styles.drawerNoteLabel}>Occlusion</span> {caseRow.occlusionNotes}</div>
          )}
          {caseRow.notes && (
            <div className={styles.drawerNoteBlock}><span className={styles.drawerNoteLabel}>Notes</span> {caseRow.notes}</div>
          )}
        </section>

        <section className={styles.drawerSection}>
          <div className={styles.drawerSectionTitle}>Compliance checklist <span className={styles.drawerChecklistCount}>{checklistDone} / {checklistTotal}</span></div>
          <ul className={styles.drawerChecklist}>
            {[
              ["prescriptionCompleted", "Prescription completed"],
              ["attachmentsProvided",   "Scan / impression / photos attached"],
              ["statementExpected",     "Statement expected on return"],
              ["statementReceived",     "Statement received"],
              ["deviceChecked",         "Device checked before fit"],
            ].map(([k, label]) => (
              <li key={k} className={styles.drawerChecklistItem}>
                <span className={cl[k] ? styles.checkOn : styles.checkOff}>
                  {cl[k] ? <I name="check" size={10} color="white" /> : null}
                </span>
                <span className={cl[k] ? styles.checkLabelOn : styles.checkLabelOff}>{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {canAct && (
          <section className={styles.drawerSection}>
            <div className={styles.drawerSectionTitle}>Actions</div>
            <div className={styles.drawerActionGrid}>
              <DrawerActionBtn icon="phone"  label="Chase Lab"        onClick={() => onAction("chase",   caseRow)} />
              <DrawerActionBtn icon="edit"   label="Add Note"          onClick={() => onAction("note",    caseRow)} />
              <DrawerActionBtn icon="back"   label="Mark Returned"     onClick={() => onAction("returned", caseRow)} disabled={s === "fitted" || s === "returned" || s === "checked"} />
              <DrawerActionBtn icon="check"  label="Mark Checked"     onClick={() => onAction("checked",  caseRow)} disabled={s === "fitted" || s === "checked"} />
              <DrawerActionBtn icon="checkcircle" label="Mark Fitted" onClick={() => onAction("fitted",   caseRow)} disabled={s === "fitted"} primary />
              <DrawerActionBtn icon="refresh" label="Log Remake"      onClick={() => onAction("remake",   caseRow)} />
              <DrawerActionBtn icon="upload" label="Upload Statement" onClick={() => onAction("statement",caseRow)} />
              <DrawerActionBtn icon="download" label="Print Lab Slip" onClick={() => onAction("print",    caseRow)} />
            </div>
          </section>
        )}

        <section className={styles.drawerSection}>
          <div className={styles.drawerSectionTitle}>Timeline</div>
          <ol className={styles.drawerTimeline}>
            {(caseRow.timeline ?? []).slice().reverse().map((t, i) => (
              <li key={i} className={styles.drawerTimelineRow}>
                <span className={styles.drawerTimelineDot} />
                <div className={styles.drawerTimelineBody}>
                  <div className={styles.drawerTimelineEvent}>{t.event}</div>
                  <div className={styles.drawerTimelineMeta}>
                    {fmtDateTime(t.at)}{t.by ? ` · ${t.by}` : ""}
                  </div>
                  {t.note && <div className={styles.drawerTimelineNote}>{t.note}</div>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </aside>
    </div>
  );
};

const Dt = ({ label, value }) => (
  <div className={styles.drawerDlRow}>
    <dt className={styles.drawerDlLabel}>{label}</dt>
    <dd className={styles.drawerDlVal}>{value || "—"}</dd>
  </div>
);

const DrawerActionBtn = ({ icon, label, onClick, disabled, primary }) => (
  <button
    type="button"
    className={`${styles.drawerActionBtn} ${primary ? styles.drawerActionBtnPrimary : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    <I name={icon} size={13} color={primary ? "white" : "var(--on-surface)"} /> {label}
  </button>
);

/* ─── Page ─────────────────────────────────────────────────────────────── */

export const LabPage = () => {
  const [labCases,      setLabCases]      = useState([]);
  const [labContacts,   setLabContacts]   = useState([]);
  const [digitalGuides, setDigitalGuides] = useState([]);
  const [showLogCase,         setShowLogCase]         = useState(false);
  const [activeFilter,        setActiveFilter]        = useState("all");
  const [openCaseId,          setOpenCaseId]          = useState(null);
  const [showResourcesDrawer, setShowResourcesDrawer] = useState(false);
  const [resourcesTab,        setResourcesTab]        = useState("contacts"); // "contacts" | "protocols"
  // Role gates: only roles with `lab_log_case` see the Log New Case CTAs;
  // only roles with `lab_drawer_actions` see the action grid inside the
  // case detail drawer. Staff can still read the tracker / open cases.
  const canLogCase       = useCap("lab_log_case");
  const canDrawerActions = useCap("lab_drawer_actions");

  useEffect(() => {
    listLabCases().then(setLabCases);
    listLabContacts().then(setLabContacts);
    listDigitalGuides().then(setDigitalGuides);
  }, []);

  const kpis     = useMemo(() => bucketCounts(labCases),    [labCases]);
  const naItems  = useMemo(() => needsAttention(labCases),  [labCases]);
  const filtered = useMemo(() => labCases.filter(filterPredicate(activeFilter)), [labCases, activeFilter]);
  const openCase = labCases.find((c) => c.id === openCaseId) ?? null;

  const handleLogCase = async (data) => {
    const created = await createLabCase(data);
    setLabCases((prev) => [created, ...prev]);
  };

  const updateStage = async (id, nextStage, eventLabel) => {
    const current = labCases.find((c) => c.id === id);
    if (!current) return;
    const timelineEntry = { at: new Date().toISOString(), event: eventLabel, by: current.owner || "—" };
    const patch = {
      stage: nextStage,
      timeline: [...(current.timeline ?? []), timelineEntry],
      nextAction: NEXT_ACTION_BY_STAGE[nextStage] ?? null,
    };
    const updated = await updateLabCase(id, patch);
    setLabCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const appendTimeline = async (c, entry, extraPatch = {}) => {
    const patch = { timeline: [...(c.timeline ?? []), entry], ...extraPatch };
    const updated = await updateLabCase(c.id, patch);
    setLabCases((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
  };

  const handleAction = (action, c) => {
    switch (action) {
      case "returned":  return updateStage(c.id, "returned", "Marked as returned");
      case "checked":   return updateStage(c.id, "checked",  "Checked / ready to fit");
      case "fitted":    return updateStage(c.id, "fitted",   "Fitted / complete");
      case "remake":    return updateStage(c.id, "remake",   "Remake initiated");

      case "chase":
        return appendTimeline(c, {
          at: new Date().toISOString(),
          event: "Chased lab",
          note: "Chased lab — awaiting response",
          by: c.owner || "—",
        });

      case "note": {
        const text = window.prompt(`Add a note to ${c.patient}'s case:`, "");
        if (!text || !text.trim()) return;
        return appendTimeline(c, {
          at: new Date().toISOString(),
          event: "Note added",
          note: text.trim(),
          by: c.owner || "—",
        });
      }

      case "statement": {
        // Hidden file picker — accepts a PDF / image, stores filename in the
        // timeline, ticks the statementReceived compliance flag. Real file
        // bytes will be persisted by the backend's S3 wiring; for the local-
        // dev demo we capture the filename only.
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/pdf,image/*";
        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;
          appendTimeline(c, {
            at: new Date().toISOString(),
            event: "Statement uploaded",
            note: `${file.name} · ${(file.size / 1024).toFixed(0)} KB`,
            by: c.owner || "—",
          }, {
            complianceChecklist: {
              ...(c.complianceChecklist ?? {}),
              statementReceived: true,
            },
          });
        };
        input.click();
        return;
      }

      case "print": {
        // Open a print-ready slip in a new window and trigger window.print.
        const w = window.open("", "_blank", "width=720,height=900");
        if (!w) return;
        w.document.write(buildLabSlipHtml(c));
        w.document.close();
        // Give the new doc a tick to render before printing.
        setTimeout(() => { try { w.focus(); w.print(); } catch { /* user cancelled */ } }, 250);
        return;
      }

      default:
        return;
    }
  };

  return (
    <div>
      <TopBar
        title="Lab Work Hub"
        subtitle="Daily lab control centre — what needs action today, where each case sits in the workflow."
      />

      {kpis.overdue > 0 && (
        <div className={styles.overdueBanner}>
          <I name="alert" size={16} color="#b36000" />
          <span><strong>{kpis.overdue} case{kpis.overdue > 1 ? "s" : ""} overdue</strong> — see Needs Attention below or filter the tracker by Overdue.</span>
        </div>
      )}

      {/* ── KPI summary (full width, directly under banner) ─────────────── */}
      <div className={styles.kpiRow}>
        <KpiCard icon="alert"    label="Overdue"        sublabel="Need attention"    value={kpis.overdue}           tone="warn" />
        <KpiCard icon="clock3"   label="Due Today"      sublabel="Ready today"        value={kpis.dueToday}          />
        <KpiCard icon="calendar" label="Due This Week"  sublabel="Next 7 days"        value={kpis.dueWeek}           />
        <KpiCard icon="back"     label="Returned"       sublabel="Not yet fitted"     value={kpis.returnedNotFitted} />
        <KpiCard icon="alert"    label="Lab Queries"    sublabel="Awaiting response"  value={kpis.queries}           tone="warn" />
        <KpiCard icon="refresh"  label="Remakes"        sublabel="Issues to resolve"  value={kpis.remakes}           tone="warn" />
      </div>

      {/* ── 2-col main layout: action queue + tracker on left, support rail on right ─ */}
      <div className={styles.labMainLayout}>
      <div className={styles.labMainCol}>

      {/* ── Needs Attention queue ──────────────────────────────────────── */}
      <Card hover={false} className={styles.naCard}>
        <div className={styles.naCardHead}>
          <div>
            <h3 className={styles.naCardTitle}>Needs Attention</h3>
            <p className={styles.naCardSub}>Cases that need a decision or follow-up today.</p>
          </div>
          <span className={styles.naCardCount}>{naItems.length}</span>
        </div>
        {naItems.length === 0 ? (
          <div className={styles.naEmpty}>
            <I name="check" size={16} color="#2e7d32" />
            <span>All cases on track — nothing to action today.</span>
          </div>
        ) : (
          <NeedsAttentionScroller>
            {naItems.map((item) => (
              <NeedsAttentionCard key={item.case.id} item={item} onOpenCase={(c) => setOpenCaseId(c.id)} />
            ))}
          </NeedsAttentionScroller>
        )}
      </Card>

      {/* ── Step 3 — Live Lab Case Tracker ──────────────────────────────── */}
      <div className={styles.labTrackerWrap}>
        <div className={styles.labTrackerHeader}>
          <div>
            <h3 className={styles.labTrackerTitle}>Live Lab Case Tracker</h3>
            <p className={styles.labTrackerSub}>Every active case across the group, with current workflow stage.</p>
          </div>
          {canLogCase && (
            <button className={styles.logCaseBtn} onClick={() => setShowLogCase(true)}>
              <I name="plus" size={14} /> Log New Case
            </button>
          )}
        </div>

        <div className={styles.filterRow}>
          {FILTER_CHIPS.map((f) => (
            <button
              key={f.id}
              className={`${styles.filterChip} ${activeFilter === f.id ? styles.filterChipActive : ""}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
          <span className={styles.filterCount}>{filtered.length} of {labCases.length} cases</span>
        </div>

        <div className={styles.labTrackerCard}>
          <div className={styles.trackerHead}>
            <span style={{ flex: 2 }}>Patient / Clinician</span>
            <span style={{ flex: 1.6 }}>Work type</span>
            <span style={{ flex: 1.8 }}>Laboratory</span>
            <span style={{ flex: 1.4 }}>Stage</span>
            <span style={{ flex: 1.3 }}>Due / Fit</span>
            <span style={{ flex: 1.8 }}>Next action</span>
            <span style={{ flex: 1.1 }}>Owner</span>
            <span style={{ flex: 0.7 }}></span>
          </div>
          {filtered.length === 0 ? (
            labCases.length === 0 ? (
              <div className={styles.trackerEmpty} style={{ flexDirection: "column", padding: "48px 20px" }}>
                <I name="clipboard" size={28} color="var(--outline-variant)" />
                <h4 style={{ font: "inherit", fontSize: 14, fontWeight: 800, margin: "8px 0 4px", color: "var(--on-surface)" }}>No lab cases yet</h4>
                <p style={{ font: "inherit", fontSize: 12.5, color: "var(--on-surface-variant)", margin: "0 0 14px", maxWidth: 380, textAlign: "center", lineHeight: 1.5 }}>
                  Log your first case to start tracking work sent to the dental laboratory — dates, stage, fit appointment and statements.
                </p>
                {canLogCase && (
                  <button className={styles.logCaseBtn} onClick={() => setShowLogCase(true)}>
                    <I name="plus" size={14} /> Log first case
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.trackerEmpty}>
                <I name="search" size={20} color="var(--outline-variant)" />
                <span>No cases match the current filter.</span>
              </div>
            )
          ) : filtered.map((c) => {
            const s = stageOf(c);
            const today = todayMidnight();
            const due = c.dueDate ? new Date(c.dueDate) : null;
            const isOverdue = due && due < today && s !== "fitted" && s !== "cancelled" && s !== "returned" && s !== "checked";
            return (
              <div key={c.id} className={styles.trackerRow} onClick={() => setOpenCaseId(c.id)}>
                <div style={{ flex: 2, minWidth: 0, display: "flex", alignItems: "center", gap: 10 }}>
                  <InitialsAvatar name={c.patient} size={32} />
                  <div style={{ minWidth: 0 }}>
                    <div className={styles.labPatientName}>{c.patient}</div>
                    <div className={styles.labClinician}>{c.clinician}{c.site ? ` · ${c.site.replace(" Dental Practice", "")}` : ""}</div>
                  </div>
                </div>
                <div style={{ flex: 1.6, minWidth: 0 }}>
                  <div className={styles.labWorkType}>{c.workType}</div>
                  {c.material && <div className={styles.labNotes}>{c.material}{c.shade ? ` · ${c.shade}` : ""}</div>}
                </div>
                <div style={{ flex: 1.8, minWidth: 0 }}>
                  <div className={styles.labLabName}>{c.lab}</div>
                  {c.labReference && <div className={styles.labNotes}>{c.labReference}</div>}
                </div>
                <div style={{ flex: 1.4, minWidth: 0 }}>
                  <StagePill stage={s} />
                </div>
                <div style={{ flex: 1.3, minWidth: 0 }}>
                  <div className={isOverdue ? styles.labDueDateOverdue : styles.labDueDate}>Due {fmtDate(c.dueDate)}</div>
                  {c.fitAppointmentDate && <div className={styles.labSentDate}>Fit {fmtDate(c.fitAppointmentDate)}</div>}
                </div>
                <div style={{ flex: 1.8, minWidth: 0 }} className={styles.trackerNextAction}>
                  {c.nextAction ?? "—"}
                </div>
                <div style={{ flex: 1.1, minWidth: 0 }} className={styles.trackerOwner}>
                  {c.owner ?? "—"}
                </div>
                <div style={{ flex: 0.7 }} className={styles.trackerOpenCol}>
                  <span className={styles.trackerStatusOpen}>Open</span>
                  <I name="more" size={14} color="var(--outline)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      </div>{/* /labMainCol */}

      {/* ── Right support rail — compact, scannable, links into deeper sections ── */}
      <aside className={styles.labRightRail}>
        <div className={styles.rrCard}>
          <h4 className={styles.rrCardTitle}>Today's Lab Actions</h4>
          <ul className={styles.rrList}>
            <li><span className={styles.rrDot} /> {kpis.dueToday} {kpis.dueToday === 1 ? "case" : "cases"} due today</li>
            <li><span className={styles.rrDot} style={{ background: "#2e7d32" }} /> {kpis.returnedNotFitted} {kpis.returnedNotFitted === 1 ? "case" : "cases"} returned</li>
            <li><span className={styles.rrDot} style={{ background: "#f57c00" }} /> {kpis.queries} lab {kpis.queries === 1 ? "query" : "queries"} awaiting reply</li>
          </ul>
          <button type="button" className={styles.rrViewAll} onClick={() => setActiveFilter("overdue")}>
            View all actions <I name="arrow" size={10} color="currentColor" />
          </button>
        </div>

        <div className={styles.rrCard}>
          <h4 className={styles.rrCardTitle}>Quick Resources</h4>
          <ul className={styles.rrList}>
            <li><I name="file" size={11} color="var(--on-surface-variant)" /> Lab Communication Guide</li>
            <li><I name="file" size={11} color="var(--on-surface-variant)" /> Remake / Rework Policy</li>
            <li><I name="file" size={11} color="var(--on-surface-variant)" /> Lab Turnaround Standards</li>
          </ul>
          <button type="button" className={styles.rrViewAll} onClick={() => { setResourcesTab("protocols"); setShowResourcesDrawer(true); }}>
            View all resources <I name="arrow" size={10} color="currentColor" />
          </button>
        </div>

        <div className={styles.rrCard}>
          <h4 className={styles.rrCardTitle}>Key Lab Contacts</h4>
          <ul className={styles.rrList}>
            {labContacts.slice(0, 3).map((l) => (
              <li key={l.name}><I name="building" size={11} color="var(--on-surface-variant)" /> {l.name}</li>
            ))}
          </ul>
          <button type="button" className={styles.rrViewAll} onClick={() => { setResourcesTab("contacts"); setShowResourcesDrawer(true); }}>
            View all contacts <I name="arrow" size={10} color="currentColor" />
          </button>
        </div>
      </aside>
      </div>{/* /labMainLayout */}

      {showResourcesDrawer && (
        <LabResourcesDrawer
          tab={resourcesTab}
          onClose={() => setShowResourcesDrawer(false)}
          labContacts={labContacts}
          digitalGuides={digitalGuides}
        />
      )}

      {showLogCase && (
        <LogCaseModal
          onClose={() => setShowLogCase(false)}
          onSave={handleLogCase}
          labContacts={labContacts}
        />
      )}

      <CaseDetailDrawer
        caseRow={openCase}
        onClose={() => setOpenCaseId(null)}
        onAction={handleAction}
        canAct={canDrawerActions}
      />
    </div>
  );
};

const NEXT_ACTION_BY_STAGE = {
  draft:                 "Complete prescription",
  prescription_prepared: "Capture scan / impression",
  awaiting_scan:         "Capture scan / impression",
  ready_to_send:         "Dispatch to lab",
  sent_to_lab:           "Awaiting lab acknowledgement",
  lab_acknowledged:      "Lab processing",
  lab_query:             "Respond to lab query",
  in_production:         "Awaiting return",
  returned:              "Check device, book fit",
  checked:               "Fit appointment",
  fitted:                null,
  remake:                "Submit remake to lab",
  cancelled:             null,
};

/* Print-ready Lab Slip — opened in a new window then window.print()ed. */
function buildLabSlipHtml(c) {
  const row = (lbl, val) => val ? `<tr><th>${lbl}</th><td>${escapeHtml(String(val))}</td></tr>` : "";
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Lab Slip — ${escapeHtml(c.patient)}</title>
<style>
  body { font: 13px/1.45 -apple-system, "Segoe UI", system-ui, sans-serif; color: #1f2937; margin: 32px; }
  .band { background: #006974; color: #fff; padding: 14px 20px; border-radius: 6px 6px 0 0; }
  .band-top { display: flex; justify-content: space-between; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.9; }
  .band h1 { font-size: 20px; font-weight: 800; margin: 8px 0 2px; }
  .band .sub { font-size: 12px; opacity: 0.85; }
  table { width: 100%; border-collapse: collapse; margin: 0; }
  table th, table td { text-align: left; padding: 7px 20px; border-bottom: 1px solid #e5e7eb; font-weight: 400; }
  table th { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280; font-weight: 700; width: 30%; background: #f9fafb; }
  .notes { margin: 18px 20px 0; font-size: 12px; line-height: 1.55; padding: 12px; background: #fef3e2; border-left: 4px solid #f57c00; border-radius: 4px; }
  .footer { margin: 24px 20px 0; padding-top: 14px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280; display: flex; justify-content: space-between; }
  @media print { body { margin: 12mm; } }
</style></head><body>
<div class="band">
  <div class="band-top"><span>Pil Dental Practice</span><span>Lab Slip</span></div>
  <h1>${escapeHtml(c.patient)}</h1>
  <div class="sub">${escapeHtml(c.workType)} · ${escapeHtml(c.lab)}</div>
</div>
<table>
  ${row("Lab reference", c.labReference)}
  ${row("Clinician",     c.clinician)}
  ${row("Site",          c.site)}
  ${row("Owner",         c.owner)}
  ${row("Tooth / site",  c.toothSite)}
  ${row("Material",      c.material)}
  ${row("Shade",         c.shade)}
  ${row("Send method",   c.sendMethod)}
  ${row("Scanner",       c.scannerPlatform)}
  ${row("Sent",          c.sentDate)}
  ${row("Expected return", c.dueDate)}
  ${row("Fit appointment", c.fitAppointmentDate)}
</table>
${c.occlusionNotes ? `<div class="notes"><strong>Occlusion:</strong> ${escapeHtml(c.occlusionNotes)}</div>` : ""}
${c.notes ? `<div class="notes"><strong>Notes:</strong> ${escapeHtml(c.notes)}</div>` : ""}
<div class="footer">
  <span>Printed ${new Date().toLocaleString()}</span>
  <span>Verbilo · Dental Group</span>
</div>
</body></html>`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
