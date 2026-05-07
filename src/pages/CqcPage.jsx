import { useState, useRef, useCallback } from "react";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnOutline } from "../components/ui/Buttons";
import { Pill } from "../components/ui/Pill";
import { I } from "../components/Icon";
import styles from "./CqcPage.module.css";

// ── Audit definitions ─────────────────────────────────────────────────────────

const auditDefs = [
  // DECONTAMINATION & VALIDATION
  {
    key: "foil",
    title: "Foil Test",
    category: "decon",
    freq: "Daily",
    description: "Chemical indicator foil test to validate autoclave cycle efficacy per HTM 01-05.",
    fields: [
      { key: "autoclave_id", label: "Autoclave ID / Serial No.", type: "text", required: true },
      { key: "cycle_no", label: "Cycle Number", type: "text", required: true },
      { key: "temp_c", label: "Temperature (°C)", type: "number", required: true },
      { key: "pressure_bar", label: "Pressure (bar)", type: "number", required: true },
      { key: "duration_min", label: "Cycle Duration (min)", type: "number", required: true },
    ],
    checks: [
      { key: "indicator_changed", label: "Chemical indicator changed colour correctly" },
      { key: "no_wet_packs", label: "No wet packs detected after cycle" },
      { key: "pouches_intact", label: "All pouches intact with unbroken seals" },
    ],
    photo: false,
    signatureLabel: "Operator Signature",
  },
  {
    key: "protein",
    title: "Protein Residue Test",
    category: "decon",
    freq: "Weekly",
    description: "Ninhydrin protein residue test on a representative instrument to verify cleaning efficacy.",
    fields: [
      { key: "instrument_id", label: "Instrument Tested", type: "text", required: true },
      { key: "test_kit_lot", label: "Test Kit Lot No.", type: "text", required: true },
      { key: "result_reading", label: "Result Reading (µg/cm²)", type: "number", required: true },
    ],
    checks: [
      { key: "within_limit", label: "Result within acceptable limit (≤ 3 µg/cm²)" },
      { key: "visually_clean", label: "Instrument visually clean before test" },
      { key: "kit_in_date", label: "Test kit within expiry date" },
    ],
    photo: false,
    signatureLabel: "Operator Signature",
  },
  {
    key: "soil",
    title: "Soil Test",
    category: "decon",
    freq: "Weekly",
    description: "Process challenge device (PCD) test to validate washer-disinfector cleaning performance.",
    fields: [
      { key: "wd_id", label: "Washer-Disinfector ID", type: "text", required: true },
      { key: "cycle_no", label: "Cycle Number", type: "text", required: true },
      { key: "test_strip_lot", label: "Test Strip Lot No.", type: "text", required: true },
    ],
    checks: [
      { key: "soil_removed", label: "Test soil completely removed from PCD" },
      { key: "temp_reached", label: "Thermal disinfection temperature reached" },
      { key: "cycle_log_ok", label: "Cycle printout / log shows pass" },
    ],
    photo: false,
    signatureLabel: "Operator Signature",
  },
  {
    key: "sterilizer",
    title: "Sterilizer Validation",
    category: "decon",
    freq: "Annual",
    description: "Annual type test / periodic performance qualification for bench-top autoclave (HTM 01-05).",
    fields: [
      { key: "autoclave_id", label: "Autoclave ID / Serial No.", type: "text", required: true },
      { key: "engineer_name", label: "Validation Engineer", type: "text", required: true },
      { key: "company", label: "Validation Company", type: "text", required: true },
      { key: "next_due", label: "Next Validation Due Date", type: "date", required: true },
    ],
    checks: [
      { key: "pq_passed", label: "Performance qualification test passed" },
      { key: "printout_received", label: "Validation report / printout received" },
      { key: "certificate_filed", label: "Certificate issued and filed" },
      { key: "next_booked", label: "Next annual validation date confirmed" },
    ],
    photo: true,
    photoLabel: "Upload Validation Certificate",
    signatureLabel: "Practice Manager / Decon Lead Signature",
  },
  {
    key: "distiller",
    title: "Distiller Maintenance",
    category: "decon",
    freq: "Monthly",
    description: "Monthly inspection and maintenance log for the water distiller unit used in decontamination.",
    fields: [
      { key: "distiller_id", label: "Distiller ID / Make & Model", type: "text", required: true },
      { key: "conductivity", label: "Water Conductivity (µS/cm)", type: "number", required: true },
      { key: "filter_changed", label: "Filter Last Changed Date", type: "date", required: false },
    ],
    checks: [
      { key: "conductivity_ok", label: "Conductivity ≤ 15 µS/cm (BS EN 13060)" },
      { key: "tank_clean", label: "Reservoir / tank cleaned and descaled" },
      { key: "no_scale", label: "No visible scale or deposit in output nozzle" },
      { key: "drainage_ok", label: "Unit drains and refills correctly" },
    ],
    photo: true,
    photoLabel: "Upload Photo of Distiller & Conductivity Reading",
    signatureLabel: "Operator Signature",
  },
  {
    key: "decon_room",
    title: "Decontamination Room Audit",
    category: "decon",
    freq: "Monthly",
    description: "Full environmental audit of the decontamination room against HTM 01-05 zoning requirements.",
    fields: [
      { key: "auditor", label: "Auditor Name", type: "text", required: true },
    ],
    checks: [
      { key: "zoning", label: "Clean / dirty zone separation maintained" },
      { key: "workflow", label: "Single-direction workflow observed" },
      { key: "ppe", label: "Correct PPE available and in use" },
      { key: "surfaces_clean", label: "All surfaces clean and free from clutter" },
      { key: "sharps", label: "Sharps bins correctly labelled and < ¾ full" },
      { key: "eyewash", label: "Emergency eyewash station accessible and in date" },
      { key: "signage", label: "HTM 01-05 zoning signage clearly visible" },
    ],
    photo: true,
    photoLabel: "Upload Photo of Decontamination Room",
    signatureLabel: "Decon Lead / Practice Manager Signature",
  },

  // WATER & ENVIRONMENT SAFETY
  {
    key: "water_temps",
    title: "Hot & Cold Water Temperatures",
    category: "water",
    freq: "Monthly",
    description: "Legionella risk management — temperature checks at sentinel outlets (HTM 04-01).",
    fields: [
      { key: "inspector", label: "Inspector Name", type: "text", required: true },
      { key: "hot_temp", label: "Hot Water Temp at Furthest Outlet (°C)", type: "number", required: true },
      { key: "cold_temp", label: "Cold Water Temp at Furthest Outlet (°C)", type: "number", required: true },
    ],
    checks: [
      { key: "hot_ok", label: "Hot water ≥ 50°C at all sentinel outlets" },
      { key: "cold_ok", label: "Cold water ≤ 20°C after running for 2 minutes" },
      { key: "no_odour", label: "No discolouration or unusual odour" },
      { key: "thermometer_cal", label: "Thermometer calibrated and within service date" },
    ],
    photo: false,
    signatureLabel: "Inspector Signature",
  },
  {
    key: "fridge_temp",
    title: "Fridge Temperature Log",
    category: "water",
    freq: "Daily",
    description: "Daily temperature check for medication / material refrigerator to ensure cold chain integrity.",
    fields: [
      { key: "fridge_id", label: "Fridge ID / Location", type: "text", required: true },
      { key: "temp_am", label: "Morning Temperature (°C)", type: "number", required: true },
      { key: "temp_pm", label: "Afternoon Temperature (°C)", type: "number", required: true },
    ],
    checks: [
      { key: "in_range", label: "Both readings within 2–8°C (or manufacturer range)" },
      { key: "fridge_clean", label: "Fridge interior clean with no expired items" },
      { key: "door_seal", label: "Door seal intact — no condensation or frosting" },
    ],
    photo: false,
    signatureLabel: "Staff Member Signature",
  },
  {
    key: "dip_slide",
    title: "Dip Slide Test",
    category: "water",
    freq: "Monthly",
    description: "Microbiological water quality test using dip slides on dental unit waterlines (HTM 01-05).",
    fields: [
      { key: "unit_id", label: "Dental Unit ID", type: "text", required: true },
      { key: "slide_lot", label: "Dip Slide Lot No.", type: "text", required: true },
      { key: "cfu_result", label: "CFU Result (colony forming units/mL)", type: "text", required: true },
      { key: "incubation_date", label: "Incubation Start Date", type: "date", required: true },
    ],
    checks: [
      { key: "result_ok", label: "Result ≤ 200 CFU/mL (HTM 01-05 limit)" },
      { key: "shocked", label: "Waterline shock dosing performed this period" },
      { key: "slide_in_date", label: "Dip slide within expiry date" },
    ],
    photo: false,
    signatureLabel: "Operator Signature",
  },

  // HEALTH, SAFETY & PREMISES
  {
    key: "fire_safety",
    title: "Fire Safety Check",
    category: "safety",
    freq: "Monthly",
    description: "Monthly fire safety inspection of all equipment, emergency lighting, and escape routes.",
    fields: [
      { key: "inspector", label: "Inspector Name", type: "text", required: true },
    ],
    checks: [
      { key: "extinguishers", label: "All fire extinguishers within annual service date" },
      { key: "exits_clear", label: "All fire exits clear and unobstructed" },
      { key: "em_lighting", label: "Emergency lighting tested and functional" },
      { key: "alarm_tested", label: "Fire alarm test completed this period" },
      { key: "assembly_signed", label: "Assembly point sign clearly visible" },
      { key: "evac_plan", label: "Evacuation plan posted on each floor" },
      { key: "marshal_trained", label: "Fire marshal trained staff member on site" },
    ],
    photo: false,
    signatureLabel: "Fire Marshal / Manager Signature",
  },
  {
    key: "med_kit",
    title: "Medical Emergency Kit",
    category: "safety",
    freq: "Monthly",
    description: "Inspection of medical emergency drug kit and resuscitation equipment (GDC Standards).",
    fields: [
      { key: "inspector", label: "Inspector Name", type: "text", required: true },
      { key: "kit_location", label: "Kit Location", type: "text", required: true },
    ],
    checks: [
      { key: "adrenaline", label: "Adrenaline (epinephrine) 1:1000 — in date" },
      { key: "midazolam", label: "Midazolam (Epistatus) — in date" },
      { key: "glucagon", label: "Glucagon kit — in date" },
      { key: "oxygen", label: "Oxygen cylinder above 25% capacity" },
      { key: "aed", label: "AED charged with pads in date" },
      { key: "aspirin", label: "Aspirin 300 mg — in date" },
      { key: "gtn", label: "GTN spray — in date" },
      { key: "bvm", label: "Bag-valve-mask (BVM) present and complete" },
    ],
    photo: false,
    signatureLabel: "Responsible Clinician / Manager Signature",
  },
  {
    key: "material_expiry",
    title: "Material Expiry Check",
    category: "safety",
    freq: "Monthly",
    description: "Systematic check of clinical consumable and material expiry dates across all surgeries.",
    fields: [
      { key: "inspector", label: "Inspector Name", type: "text", required: true },
      { key: "areas", label: "Areas / Surgeries Checked", type: "text", required: true },
      { key: "expired_items", label: "Expired Items Found (or 'None')", type: "text", required: true },
    ],
    checks: [
      { key: "no_expired", label: "No expired clinical materials left in use" },
      { key: "la_in_date", label: "Local anaesthetic cartridges all in date" },
      { key: "impression_in_date", label: "Impression materials all in date" },
      { key: "near_expiry_flagged", label: "Items expiring within 30 days flagged for replacement" },
    ],
    photo: false,
    signatureLabel: "Inspector Signature",
  },
];

const categories = [
  {
    key: "decon",
    label: "Decontamination & Validation",
    subtitle: "HTM 01-05 Compliance",
    icon: "shield",
    color: "#006974",
    bg: "rgba(0,105,116,0.07)",
  },
  {
    key: "water",
    label: "Water & Environment Safety",
    subtitle: "Legionella & Microbiological Controls",
    icon: "cloud",
    color: "#0077aa",
    bg: "rgba(0,119,170,0.07)",
  },
  {
    key: "safety",
    label: "Health, Safety & Premises",
    subtitle: "CQC Regulation 12 & Fire Safety",
    icon: "checksquare",
    color: "#2e7d32",
    bg: "rgba(46,125,50,0.07)",
  },
];

const freqColors = {
  Daily:   { bg: "rgba(168,56,54,0.12)",  color: "#a83836" },
  Weekly:  { bg: "rgba(230,130,0,0.13)",  color: "#b36000" },
  Monthly: { bg: "rgba(0,105,116,0.12)",  color: "#005c66" },
  Annual:  { bg: "rgba(72,60,130,0.12)",  color: "#3d3380" },
};

// ── Signature Pad ─────────────────────────────────────────────────────────────

const SignaturePad = ({ canvasRef, onDrawn }) => {
  const isDrawing = useRef(false);
  const lastPos = useRef(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width),
      y: (src.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = useCallback(
    (e) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      isDrawing.current = true;
      lastPos.current = getPos(e, canvas);
    },
    [canvasRef]
  );

  const draw = useCallback(
    (e) => {
      e.preventDefault();
      if (!isDrawing.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const pos = getPos(e, canvas);
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = "#1a2b2c";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastPos.current = pos;
      onDrawn(true);
    },
    [canvasRef, onDrawn]
  );

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    onDrawn(false);
  };

  return (
    <div className={styles.sigWrap}>
      <canvas
        ref={canvasRef}
        className={styles.sigCanvas}
        width={560}
        height={100}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <button type="button" className={styles.sigClear} onClick={clearSig}>
        Clear
      </button>
    </div>
  );
};

// ── Audit Modal ───────────────────────────────────────────────────────────────

const AuditModal = ({ def, onClose, onComplete }) => {
  const [formData, setFormData] = useState({});
  const [checks, setChecks] = useState({});
  const [sigDrawn, setSigDrawn] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef(null);

  const setField = (key, val) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const toggleCheck = (key) =>
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));

  const handlePhoto = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls]);
  };

  const validate = () => {
    const errs = {};
    def.fields
      .filter((f) => f.required)
      .forEach((f) => {
        if (!formData[f.key]?.toString().trim()) errs[f.key] = "Required";
      });
    if (!sigDrawn) errs._sig = "Please sign before submitting";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    onComplete(def.key);
  };

  if (submitted) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.successScreen}>
            <div className={styles.successIcon}>
              <I name="checkcircle" size={52} color="var(--success)" />
            </div>
            <h2 className={styles.successTitle}>Audit Recorded</h2>
            <p className={styles.successMsg}>
              <strong>{def.title}</strong> has been submitted and the readiness gauge updated.
            </p>
            <BtnPrimary onClick={onClose}>Done</BtnPrimary>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form
        className={styles.modal}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderText}>
            <h2 className={styles.modalTitle}>{def.title}</h2>
            <p className={styles.modalSub}>{def.description}</p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <I name="xcircle" size={22} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Form fields */}
          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}>
              <I name="file" size={14} /> Form Details
            </h3>
            <div className={styles.fieldGrid}>
              {def.fields.map((f) => (
                <div key={f.key} className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>
                    {f.label}
                    {f.required && <span className={styles.req}> *</span>}
                  </label>
                  <input
                    type={f.type}
                    className={`${styles.fieldInput} ${
                      errors[f.key] ? styles.fieldInputErr : ""
                    }`}
                    value={formData[f.key] || ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                  {errors[f.key] && (
                    <span className={styles.errMsg}>{errors[f.key]}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Checklist */}
          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}>
              <I name="checksquare" size={14} /> Checklist
            </h3>
            <div className={styles.checkList}>
              {def.checks.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`${styles.checkRow} ${
                    checks[c.key] ? styles.checkRowDone : ""
                  }`}
                  onClick={() => toggleCheck(c.key)}
                >
                  <span className={styles.checkBox}>
                    {checks[c.key] ? <I name="check" size={13} /> : null}
                  </span>
                  <span className={styles.checkLabel}>{c.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Photo upload */}
          {def.photo && (
            <section className={styles.modalSection}>
              <h3 className={styles.sectionLabel}>
                <I name="camera" size={14} /> {def.photoLabel}
              </h3>
              <label className={styles.photoUpload}>
                <I name="upload" size={20} />
                <span>Click to upload photo(s)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhoto}
                  style={{ display: "none" }}
                />
              </label>
              {photos.length > 0 && (
                <div className={styles.photoPreview}>
                  {photos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Upload ${i + 1}`}
                      className={styles.photoThumb}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Signature */}
          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}>
              <I name="edit" size={14} /> {def.signatureLabel}
            </h3>
            <SignaturePad canvasRef={canvasRef} onDrawn={setSigDrawn} />
            {errors._sig && (
              <span className={styles.errMsg}>{errors._sig}</span>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <BtnOutline onClick={onClose}>Cancel</BtnOutline>
          <BtnPrimary type="submit">Submit Audit</BtnPrimary>
        </div>
      </form>
    </div>
  );
};

// ── Incident Reporting ───────────────────────────────────────────────────────

const INCIDENT_TYPES = [
  "Needlestick / Sharps Injury",
  "Medication / Prescribing Error",
  "Patient Fall or Injury",
  "Equipment Failure or Defect",
  "Infection Control Breach",
  "Staff Injury (Non-Sharps)",
  "Near Miss",
  "Data / Information Breach",
  "Verbal Complaint or Concern",
  "Other",
];

const incidentSeverityCfg = {
  Low:    { bg: "rgba(46,125,50,0.12)",  color: "#2e7d32" },
  Medium: { bg: "rgba(245,124,0,0.12)",  color: "#b36000" },
  High:   { bg: "rgba(229,57,53,0.12)",  color: "#e53935" },
};

const incidentStatusCfg = {
  Open:           { bg: "rgba(229,57,53,0.12)",  color: "#e53935" },
  "Under Review": { bg: "rgba(245,124,0,0.12)",  color: "#b36000" },
  Closed:         { bg: "rgba(46,125,50,0.12)",  color: "#2e7d32" },
};

const initialIncidents = [
  {
    id: 1,
    type: "Needlestick / Sharps Injury",
    severity: "High",
    date: "2026-04-28",
    reportedBy: "Dr. Sarah Jenkins",
    description: "Needlestick to left index finger whilst recapping a used local anaesthetic needle. Wound irrigated immediately.",
    actionTaken: "Wound irrigated. Occupational health notified. Patient blood-borne virus status reviewed.",
    status: "Under Review",
  },
  {
    id: 2,
    type: "Equipment Failure or Defect",
    severity: "Medium",
    date: "2026-04-22",
    reportedBy: "Jamie Osei",
    description: "Autoclave displayed cycle failure error mid-run. Load quarantined and not released for use.",
    actionTaken: "Load quarantined. Engineer scheduled. Backup autoclave brought into use.",
    status: "Open",
  },
  {
    id: 3,
    type: "Near Miss",
    severity: "Low",
    date: "2026-04-15",
    reportedBy: "Leo Vance",
    description: "Patient prescribed incorrect dose of amoxicillin — error identified by reception before dispensing to patient.",
    actionTaken: "Prescription corrected. Clinician briefed on double-check prescribing policy.",
    status: "Closed",
  },
];

const ReportIncidentModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    type: "", severity: "Low",
    date: new Date().toISOString().slice(0, 10),
    reportedBy: "", description: "", actionTaken: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.type) e.type = "Required";
    if (!form.reportedBy.trim()) e.reportedBy = "Required";
    if (!form.description.trim()) e.description = "Required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ id: Date.now(), ...form, status: "Open" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.successScreen}>
            <div className={styles.successIcon}><I name="checkcircle" size={52} color="var(--success)" /></div>
            <h2 className={styles.successTitle}>Incident Reported</h2>
            <p className={styles.successMsg}>The incident has been logged. For High severity events, notify the practice lead and relevant authority directly.</p>
            <BtnPrimary onClick={onClose}>Done</BtnPrimary>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderText}>
            <h2 className={styles.modalTitle}>Report an Incident</h2>
            <p className={styles.modalSub}>Log a clinical or operational incident, near miss, or safety concern.</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <I name="xcircle" size={22} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}><I name="file" size={14} /> Incident Details</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldRow} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.fieldLabel}>Incident Type <span className={styles.req}>*</span></label>
                <select className={`${styles.fieldInput} ${errors.type ? styles.fieldInputErr : ""}`}
                  value={form.type} onChange={e => set("type", e.target.value)}>
                  <option value="">Select type…</option>
                  {INCIDENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.type && <span className={styles.errMsg}>{errors.type}</span>}
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Severity</label>
                <div className={styles.severityBtnGroup}>
                  {["Low", "Medium", "High"].map(s => (
                    <button key={s} type="button"
                      className={`${styles.severityBtn} ${form.severity === s ? styles.severityBtnActive : ""}`}
                      style={form.severity === s ? { background: incidentSeverityCfg[s].bg, color: incidentSeverityCfg[s].color, borderColor: incidentSeverityCfg[s].color } : {}}
                      onClick={() => set("severity", s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Date of Incident</label>
                <input type="date" className={styles.fieldInput}
                  value={form.date} onChange={e => set("date", e.target.value)} />
              </div>
              <div className={styles.fieldRow} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.fieldLabel}>Reported By <span className={styles.req}>*</span></label>
                <input className={`${styles.fieldInput} ${errors.reportedBy ? styles.fieldInputErr : ""}`}
                  value={form.reportedBy} onChange={e => set("reportedBy", e.target.value)}
                  placeholder="Your full name" />
                {errors.reportedBy && <span className={styles.errMsg}>{errors.reportedBy}</span>}
              </div>
            </div>
          </section>

          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}><I name="file" size={14} /> Description &amp; Actions</h3>
            <div className={styles.fieldRow} style={{ marginBottom: 12 }}>
              <label className={styles.fieldLabel}>What happened? <span className={styles.req}>*</span></label>
              <textarea className={`${styles.fieldInput} ${errors.description ? styles.fieldInputErr : ""}`}
                rows={3} value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Describe what happened, where, and who was involved…"
                style={{ resize: "vertical" }} />
              {errors.description && <span className={styles.errMsg}>{errors.description}</span>}
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                Immediate action taken <span style={{ fontWeight: 400, color: "var(--on-surface-variant)" }}>(optional)</span>
              </label>
              <textarea className={styles.fieldInput} rows={2}
                value={form.actionTaken} onChange={e => set("actionTaken", e.target.value)}
                placeholder="What steps were taken immediately after the incident?"
                style={{ resize: "vertical" }} />
            </div>
          </section>
        </div>
        <div className={styles.modalFooter}>
          <BtnOutline onClick={onClose}>Cancel</BtnOutline>
          <BtnPrimary onClick={handleSave}><I name="alert" size={13} /> Submit Report</BtnPrimary>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export const CqcPage = () => {
  const [completed, setCompleted] = useState(new Set());
  const [openAudit, setOpenAudit] = useState(null);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const total = auditDefs.length;
  const done = completed.size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const gaugeColor =
    pct >= 85 ? "#4caf50" : pct >= 60 ? "#ff9800" : "#a83836";

  const activeDef = openAudit
    ? auditDefs.find((d) => d.key === openAudit)
    : null;

  const markComplete = (key) =>
    setCompleted((prev) => new Set([...prev, key]));

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>CQC Compliance Hub</h1>
          <p className={styles.pageSubtitle}>
            Inspire Dental Group — Audit &amp; Compliance Tracking
          </p>
        </div>
        <Pill bg="var(--tertiary-container)" color="var(--on-tertiary-container)">
          <I name="shield" size={13} /> CQC Registered
        </Pill>
      </div>

      {/* Readiness gauge banner */}
      <Card hover={false} className={styles.gaugeCard}>
        <div className={styles.gaugeLayout}>
          <div className={styles.gaugeRingWrap}>
            <div
              className={styles.gaugeRing}
              style={{
                background: `conic-gradient(${gaugeColor} 0% ${pct}%, var(--surface-high) ${pct}% 100%)`,
              }}
            >
              <div className={styles.gaugeCenter}>
                <span className={styles.gaugePct}>{pct}%</span>
                <span className={styles.gaugeSubLabel}>Compliant</span>
              </div>
            </div>
          </div>

          <div className={styles.gaugeContent}>
            <h2 className={styles.gaugeName}>Group Audit Readiness</h2>
            <p className={styles.gaugeDesc}>
              {done} of {total} audit checks completed this period.{" "}
              {pct >= 85
                ? "Excellent compliance — your practice is inspection-ready."
                : pct >= 60
                ? "Good progress. Complete remaining audits to reach inspection-ready status."
                : "Action required. Complete outstanding audits to achieve compliance."}
            </p>

            <div className={styles.gaugeBands}>
              <span className={styles.bandGreen}>
                <span className={styles.bandDot} style={{ background: "#4caf50" }} />
                ≥85% Ready
              </span>
              <span className={styles.bandAmber}>
                <span className={styles.bandDot} style={{ background: "#ff9800" }} />
                60–84% In Progress
              </span>
              <span className={styles.bandRed}>
                <span className={styles.bandDot} style={{ background: "#a83836" }} />
                &lt;60% Action Required
              </span>
            </div>

            <div className={styles.gaugeStats}>
              <div className={styles.gaugeStat}>
                <span className={styles.gaugeStatVal} style={{ color: "#4caf50" }}>
                  {done}
                </span>
                <span className={styles.gaugeStatLab}>Completed</span>
              </div>
              <div className={styles.gaugeDivider} />
              <div className={styles.gaugeStat}>
                <span
                  className={styles.gaugeStatVal}
                  style={{ color: total - done > 0 ? "#a83836" : "#4caf50" }}
                >
                  {total - done}
                </span>
                <span className={styles.gaugeStatLab}>Outstanding</span>
              </div>
              <div className={styles.gaugeDivider} />
              <div className={styles.gaugeStat}>
                <span className={styles.gaugeStatVal}>{total}</span>
                <span className={styles.gaugeStatLab}>Total Audits</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Audit categories */}
      {categories.map((cat) => {
        const catAudits = auditDefs.filter((d) => d.category === cat.key);
        const catDone = catAudits.filter((d) => completed.has(d.key)).length;

        return (
          <div key={cat.key} className={styles.catBlock}>
            <div
              className={styles.catHeader}
              style={{ borderLeftColor: cat.color, background: cat.bg }}
            >
              <I name={cat.icon} size={22} color={cat.color} />
              <div className={styles.catHeaderText}>
                <h2 className={styles.catTitle}>{cat.label}</h2>
                <p className={styles.catSub}>{cat.subtitle}</p>
              </div>
              <Pill
                bg="var(--surface-container)"
                color="var(--on-surface-variant)"
                small
              >
                {catDone} / {catAudits.length} complete
              </Pill>
            </div>

            <div className={styles.auditGrid}>
              {catAudits.map((def) => {
                const isDone = completed.has(def.key);
                return (
                  <Card
                    key={def.key}
                    hover
                    className={`${styles.auditCard} ${isDone ? styles.auditCardDone : ""}`}
                    onClick={() => setOpenAudit(def.key)}
                  >
                    <div className={styles.auditCardTop}>
                      <Pill
                        bg={
                          isDone
                            ? "rgba(76,175,80,0.15)"
                            : freqColors[def.freq]?.bg ?? "var(--surface-container)"
                        }
                        color={
                          isDone
                            ? "#2e7d32"
                            : freqColors[def.freq]?.color ?? "var(--on-surface-variant)"
                        }
                        small
                      >
                        {isDone ? "Complete" : def.freq}
                      </Pill>
                      {isDone && (
                        <I name="checkcircle" size={16} color="#4caf50" />
                      )}
                    </div>
                    <h3 className={styles.auditTitle}>{def.title}</h3>
                    <p className={styles.auditDesc}>{def.description}</p>
                    <div className={styles.auditAction}>
                      <span
                        className={`${styles.auditBtn} ${
                          isDone ? styles.auditBtnDone : styles.auditBtnPending
                        }`}
                      >
                        {isDone ? "View / Re-audit" : "Start Audit"}
                        <I name="arrow" size={13} />
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Incident Register */}
      <div className={styles.incidentSection}>
        <div className={styles.incidentSectionHeader}>
          <div>
            <h2 className={styles.incidentSectionTitle}>Incident Register</h2>
            <p className={styles.incidentSectionSub}>
              {incidents.length} incident{incidents.length !== 1 ? "s" : ""} logged this period. High severity incidents must be escalated to the CQC and/or HSE as required.
            </p>
          </div>
          <button className={styles.reportIncidentBtn} onClick={() => setShowIncidentModal(true)}>
            <I name="plus" size={14} /> Report Incident
          </button>
        </div>
        <Card hover={false} className={styles.incidentCard}>
          <div className={styles.incidentTableHead}>
            <span style={{ flex: 2 }}>Type / Date</span>
            <span style={{ flex: 3 }}>Description</span>
            <span style={{ flex: 1.5 }}>Reported By</span>
            <span style={{ flex: 1 }}>Severity</span>
            <span style={{ flex: 1 }}>Status</span>
          </div>
          {incidents.map(inc => {
            const sev = incidentSeverityCfg[inc.severity];
            const sta = incidentStatusCfg[inc.status];
            const [y, m, d] = inc.date.split("-");
            const dateStr = `${d}/${m}/${y}`;
            return (
              <div key={inc.id} className={styles.incidentRow}>
                <div style={{ flex: 2, minWidth: 0 }}>
                  <div className={styles.incidentType}>{inc.type}</div>
                  <div className={styles.incidentDate}>{dateStr}</div>
                </div>
                <div style={{ flex: 3, minWidth: 0 }}>
                  <div className={styles.incidentDesc}>{inc.description}</div>
                  {inc.actionTaken && (
                    <div className={styles.incidentAction}><strong>Action:</strong> {inc.actionTaken}</div>
                  )}
                </div>
                <div style={{ flex: 1.5, minWidth: 0 }} className={styles.incidentReporter}>{inc.reportedBy}</div>
                <div style={{ flex: 1 }}>
                  <span className={styles.incidentPill} style={{ background: sev.bg, color: sev.color }}>{inc.severity}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span className={styles.incidentPill} style={{ background: sta.bg, color: sta.color }}>{inc.status}</span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {showIncidentModal && (
        <ReportIncidentModal
          onClose={() => setShowIncidentModal(false)}
          onSave={(newInc) => setIncidents(prev => [newInc, ...prev])}
        />
      )}

      {/* Audit modal */}
      {activeDef && (
        <AuditModal
          def={activeDef}
          onClose={() => setOpenAudit(null)}
          onComplete={(key) => {
            markComplete(key);
            setOpenAudit(null);
          }}
        />
      )}
    </div>
  );
};
