import { useState, useEffect, useMemo } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary, BtnOutline } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { Pill } from "../components/ui/Pill";
import { useClickOutside } from "../hooks/useClickOutside";
import { listStaff, createStaff, updateStaff, deleteStaff } from "../services/staff.service";
import { registerAccount } from "../services/auth.service";
import { gdcAlertsFor } from "../services/logic/staff.logic";
import styles from "./StaffPage.module.css";

// ── Static data ───────────────────────────────────────────────────────────────


const practices = ["London Flagship", "Manchester Central", "Birmingham", "Leeds North"];
const roleFilters = ["Dentist", "Dental Nurse", "Hygienist", "Orthodontist", "Practice Manager", "Receptionist"];
const practiceAddresses = {
  "London Flagship":    "42 Harley Street, Marylebone",
  "Manchester Central": "15 King Street, Manchester",
  "Birmingham":         "25 Colmore Row, Birmingham",
  "Leeds North":        "1 Park Row, Leeds",
};
const CLINICAL_ROLE_TYPES  = ["dentist", "nurse", "hygienist"];
const SUPPORT_ROLE_TYPES   = ["manager", "receptionist", "support"];
const cpdRequiredByType = { dentist: 100, nurse: 50, hygienist: 50, manager: 30, receptionist: 15 };
const gdcTypesByRole = {
  dentist: ["Dentist", "Specialist"],
  nurse: ["Dental Nurse"],
  hygienist: ["Dental Hygienist", "Dental Therapist", "Dental Therapist / Hygienist"],
};
const CLINICAL_INTERESTS = [
  "Implantology", "Orthodontics", "Cosmetic", "Endodontics",
  "Periodontics", "Oral Surgery", "Pediatric Care", "Digital Dentistry",
  "Restorative", "Preventive Care", "Radiography", "Sedation",
];
const EQUIPMENT_OPTIONS = [
  "iTero Scanners", "3Shape TRIOS", "CBCT Imaging", "CEREC Systems",
  "Digital X-Ray", "Intraoral Camera",
];
const STEPS = ["Personal Details", "Role & Registration", "Clinical Profile", "Documents & Access"];

const ROLE_COLORS = {
  manager:      "#006974",
  dentist:      "#1565c0",
  nurse:        "#2e7d32",
  hygienist:    "#00838f",
  receptionist: "#f57c00",
  support:      "#6a1b9a",
};

const ROLE_LABELS = {
  manager:      "Practice Manager",
  dentist:      "Dentist",
  nurse:        "Dental Nurse",
  hygienist:    "Hygienist / Therapist",
  receptionist: "Receptionist",
  support:      "Support Staff",
};

// ── Compliance helpers ────────────────────────────────────────────────────────

// ── Form helpers ──────────────────────────────────────────────────────────────

const toLines = (arr) => (arr || []).join("\n");
const fromLines = (str) => str.split("\n").map((s) => s.trim()).filter(Boolean);
const toCommas = (arr) => (arr || []).join(", ");
const fromCommas = (str) => str.split(",").map((s) => s.trim()).filter(Boolean);

const personToForm = (p) => ({
  name: p.name || "", email: p.email || "", ext: p.ext || "",
  practice: p.practice || "", startDate: p.startDate || "",
  dob: p.dob || "", gender: p.gender || "", photoPreview: null,
  roleType: p.roleType || "", roleLabel: p.roleLabel || "",
  gdc: p.gdc || "", gdcType: p.gdcType || "", gdcRenewal: p.gdcRenewal || "",
  nurseStatus: p.nurseStatus || "Qualified", radiographyCert: p.radiographyCert || false,
  assignedSurgery: p.assignedSurgery || "", scopeOfPractice: p.scopeOfPractice || "",
  lasCertified: p.lasCertified || false, cqcRegistered: p.cqcRegistered || false,
  directReports: p.directReports || "", emergencyContact: p.emergencyContact || false,
  workingHours: p.workingHours || "", firstAider: p.firstAider || false,
  fireWarden: p.fireWarden || false,
  surgeryDays: p.surgeryDays || "", surgeries: toCommas(p.surgeries),
  indemnity: p.indemnity || "",
  interests: p.interests || [], equipment: p.equipment || [],
  bio: p.bio || "", quals: toLines(p.quals),
  specialisms: toLines(p.specialisms), languages: toCommas(p.languages),
  responsibilities: toLines(p.responsibilities),
  gdcCertFile: p.docs?.gdc || "", indemnityFile: p.docs?.indemnity || "",
  dbsFile: p.docs?.dbs || "", sendInvite: true,
  username: "", tempPassword: "",
});

const emptyForm = personToForm({});

const formToPerson = (form, existingPerson) => ({
  ...(existingPerson || {}),
  id: existingPerson?.id || Date.now(),
  name: form.name, email: form.email, ext: form.ext,
  practice: form.practice, startDate: form.startDate,
  dob: form.dob, gender: form.gender,
  roleType: form.roleType, roleLabel: form.roleLabel,
  gdc: form.gdc, gdcType: form.gdcType, gdcRenewal: form.gdcRenewal,
  nurseStatus: form.nurseStatus, radiographyCert: form.radiographyCert,
  assignedSurgery: form.assignedSurgery, scopeOfPractice: form.scopeOfPractice,
  lasCertified: form.lasCertified, cqcRegistered: form.cqcRegistered,
  directReports: form.directReports, emergencyContact: form.emergencyContact,
  workingHours: form.workingHours, firstAider: form.firstAider, fireWarden: form.fireWarden,
  surgeryDays: form.surgeryDays, surgeries: fromCommas(form.surgeries),
  indemnity: form.indemnity,
  interests: form.interests, equipment: form.equipment,
  bio: form.bio, quals: fromLines(form.quals),
  specialisms: fromLines(form.specialisms), languages: fromCommas(form.languages),
  responsibilities: fromLines(form.responsibilities),
  docs: { gdc: form.gdcCertFile, indemnity: form.indemnityFile, dbs: form.dbsFile },
  cpdHours: existingPerson?.cpdHours ?? 0,
  cpdRequired: cpdRequiredByType[form.roleType] || 30,
  online: existingPerson?.online || false,
  featured: existingPerson?.featured || false,
});

// ── Small shared sub-components ───────────────────────────────────────────────

const Field = ({ label, children, error, required, span }) => (
  <div className={span ? `${styles.fieldWrap} ${styles.fieldSpan}` : styles.fieldWrap}>
    <label className={styles.fieldLabel}>
      {label}{required && <span className={styles.req}> *</span>}
    </label>
    {children}
    {error && <span className={styles.errMsg}>{error}</span>}
  </div>
);

const CheckToggle = ({ checked, onChange, label }) => (
  <button type="button" className={`${styles.checkToggle} ${checked ? styles.checkToggleOn : ""}`} onClick={onChange}>
    <span className={styles.checkToggleBox}>{checked && <I name="check" size={11} />}</span>
    {label}
  </button>
);

const ChipToggle = ({ label, selected, onToggle }) => (
  <button
    type="button"
    className={`${styles.chip} ${selected ? styles.chipSelected : ""}`}
    onClick={onToggle}
  >
    {label}
    {selected && <I name="check" size={11} />}
  </button>
);

const FileUploadField = ({ label, value, onChange, accept = ".pdf,.jpg,.png", required }) => {
  const ref = useRef();
  return (
    <div className={styles.fileUpload}>
      <div className={styles.fileUploadTop}>
        <span className={styles.fileUploadLabel}>
          {label}{required && <span className={styles.req}> *</span>}
        </span>
        {value
          ? <Pill bg="rgba(76,175,80,0.12)" color="#2e7d32" small><I name="check" size={11} /> {value}</Pill>
          : <Pill bg="var(--surface-container)" color="var(--on-surface-variant)" small>Not uploaded</Pill>
        }
      </div>
      <label className={styles.fileUploadBtn}>
        <I name="upload" size={14} />
        {value ? "Replace file" : "Upload file"}
        <input
          ref={ref} type="file" accept={accept} style={{ display: "none" }}
          onChange={(e) => e.target.files[0] && onChange(e.target.files[0].name)}
        />
      </label>
    </div>
  );
};

// ── Add / Edit modal (4-step) ─────────────────────────────────────────────────

const AddEditModal = ({ person, onClose, onSave }) => {
  const isEdit = !!person;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(isEdit ? personToForm(person) : emptyForm);
  const [errors, setErrors] = useState({});
  const photoRef = useRef();

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const toggle = (key) => setForm((p) => ({ ...p, [key]: !p[key] }));
  const toggleArr = (key, val) =>
    setForm((p) => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter((v) => v !== val) : [...p[key], val],
    }));

  const isGdcRole = ["dentist", "nurse", "hygienist"].includes(form.roleType);
  const isClinical = ["dentist", "nurse", "hygienist"].includes(form.roleType);

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Required";
      if (!form.email.trim()) e.email = "Required";
      if (!form.practice) e.practice = "Required";
      if (!form.startDate.trim()) e.startDate = "Required";
    }
    if (step === 1) {
      if (!form.roleType) e.roleType = "Required";
      if (!form.roleLabel.trim()) e.roleLabel = "Required";
      if (isGdcRole && !form.gdc.trim()) e.gdc = "GDC number required for this role";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const suggestedUsername = (() => {
    const cleaned = form.name.trim().toLowerCase()
      .replace(/^(dr\.|mr\.|ms\.|mrs\.|prof\.)\s*/i, "")
      .split(/\s+/).filter(Boolean);
    return cleaned.length >= 2 ? `${cleaned[0][0]}.${cleaned[cleaned.length - 1]}` : cleaned[0] || "";
  })();

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let pw = "Inspire@";
    for (let i = 0; i < 4; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    set("tempPassword", pw);
  };

  const copyCredentials = () => {
    navigator.clipboard?.writeText(`Username: ${form.username}\nPassword: ${form.tempPassword}`);
  };

  const next = () => {
    if (validateStep()) {
      if (step === 2 && !isEdit && !form.username && suggestedUsername)
        set("username", suggestedUsername);
      setStep((s) => s + 1);
    }
  };
  const back = () => { setErrors({}); setStep((s) => s - 1); };
  const handleSave = () => {
    if (validateStep())
      onSave(formToPerson(form, person), { username: form.username, tempPassword: form.tempPassword });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.addModal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.addModalHeader}>
          <div>
            <h2 className={styles.addModalTitle}>
              {isEdit ? "Edit Staff Profile" : "Add Staff Member"}
            </h2>
            <p className={styles.addModalSub}>
              {isEdit ? `Editing ${person.name}` : "Completed by Practice Manager · Staff will receive an account invite"}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <I name="xcircle" size={22} />
          </button>
        </div>

        {/* Step indicators */}
        <div className={styles.stepRow}>
          {STEPS.map((label, i) => (
            <div key={label} className={`${styles.step} ${i === step ? styles.stepActive : ""} ${i < step ? styles.stepDone : ""}`}>
              <div className={styles.stepDot}>
                {i < step ? <I name="check" size={12} /> : i + 1}
              </div>
              <span className={styles.stepLabel}>{label}</span>
              {i < STEPS.length - 1 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className={styles.addModalBody}>

          {/* ── Step 0: Personal Details ── */}
          {step === 0 && (
            <div className={styles.formGrid}>
              {/* Photo upload */}
              <div className={`${styles.fieldWrap} ${styles.fieldSpan} ${styles.photoRow}`}>
                <div
                  className={styles.photoCircle}
                  onClick={() => photoRef.current.click()}
                >
                  {form.photoPreview
                    ? <img src={form.photoPreview} alt="Preview" className={styles.photoImg} />
                    : <I name="camera" size={28} color="var(--outline-variant)" />
                  }
                  <div className={styles.photoBadge}><I name="plus" size={14} color="white" /></div>
                </div>
                <div>
                  <p className={styles.photoHint}>Profile Photo</p>
                  <p className={styles.photoHelp}>Upload a clear professional headshot for clinical identification.</p>
                </div>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) set("photoPreview", URL.createObjectURL(f));
                  }}
                />
              </div>

              <Field label="Full Name" required error={errors.name}>
                <input className={`${styles.input} ${errors.name ? styles.inputErr : ""}`} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Dr. Jane Smith" />
              </Field>
              <Field label="Email Address" required error={errors.email}>
                <input className={`${styles.input} ${errors.email ? styles.inputErr : ""}`} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane.smith@inspiredental.co.uk" />
              </Field>
              <Field label="Gender">
                <select className={styles.input} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">Prefer not to say</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                </select>
              </Field>
              <Field label="Date of Birth">
                <input className={styles.input} type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
              </Field>
              <Field label="Practice Location" required error={errors.practice}>
                <select className={`${styles.input} ${errors.practice ? styles.inputErr : ""}`} value={form.practice} onChange={(e) => set("practice", e.target.value)}>
                  <option value="">Select practice…</option>
                  {practices.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Start Date" required error={errors.startDate}>
                <input className={`${styles.input} ${errors.startDate ? styles.inputErr : ""}`} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} placeholder="e.g. January 2025" />
              </Field>
              <Field label="Phone Extension">
                <input className={styles.input} value={form.ext} onChange={(e) => set("ext", e.target.value)} placeholder="e.g. 105" />
              </Field>
            </div>
          )}

          {/* ── Step 1: Role & Registration ── */}
          {step === 1 && (
            <div className={styles.formGrid}>
              <Field label="Role Type" required error={errors.roleType}>
                <select className={`${styles.input} ${errors.roleType ? styles.inputErr : ""}`} value={form.roleType}
                  onChange={(e) => { set("roleType", e.target.value); set("gdcType", ""); }}>
                  <option value="">Select role type…</option>
                  <option value="dentist">Dentist / Specialist</option>
                  <option value="nurse">Dental Nurse</option>
                  <option value="hygienist">Hygienist / Therapist</option>
                  <option value="manager">Practice Manager</option>
                  <option value="receptionist">Receptionist / Front of House</option>
                </select>
              </Field>
              <Field label="Job Title" required error={errors.roleLabel}>
                <input className={`${styles.input} ${errors.roleLabel ? styles.inputErr : ""}`} value={form.roleLabel} onChange={(e) => set("roleLabel", e.target.value)} placeholder="e.g. Senior Dental Nurse" />
              </Field>

              {isGdcRole && (<>
                <Field label="GDC Number" required error={errors.gdc}>
                  <input className={`${styles.input} ${errors.gdc ? styles.inputErr : ""}`} value={form.gdc} onChange={(e) => set("gdc", e.target.value)} placeholder="e.g. 123456" />
                </Field>
                <Field label="GDC Registration Type">
                  <select className={styles.input} value={form.gdcType} onChange={(e) => set("gdcType", e.target.value)}>
                    <option value="">Select type…</option>
                    {(gdcTypesByRole[form.roleType] || []).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                {["nurse", "hygienist"].includes(form.roleType) && (
                  <Field label="GDC Renewal Date" span>
                    <input className={styles.input} value={form.gdcRenewal} onChange={(e) => set("gdcRenewal", e.target.value)} placeholder="e.g. 31 Jul 2026" />
                  </Field>
                )}
              </>)}

              {isClinical && (<>
                <Field label="Surgery Days">
                  <input className={styles.input} value={form.surgeryDays} onChange={(e) => set("surgeryDays", e.target.value)} placeholder="e.g. Monday – Thursday" />
                </Field>
                <Field label="Assigned Surgeries">
                  <input className={styles.input} value={form.surgeries} onChange={(e) => set("surgeries", e.target.value)} placeholder="e.g. Surgery 1, Surgery 3" />
                </Field>
              </>)}

              {form.roleType === "dentist" && (
                <Field label="Indemnity Provider">
                  <input className={styles.input} value={form.indemnity} onChange={(e) => set("indemnity", e.target.value)} placeholder="e.g. MDDUS" />
                </Field>
              )}

              {form.roleType === "nurse" && (<>
                <Field label="Qualification Status">
                  <select className={styles.input} value={form.nurseStatus} onChange={(e) => set("nurseStatus", e.target.value)}>
                    <option value="Qualified">Qualified</option>
                    <option value="Trainee">Trainee</option>
                  </select>
                </Field>
                <Field label="Radiography Certificate">
                  <CheckToggle checked={form.radiographyCert} onChange={() => toggle("radiographyCert")} label="Holds radiography certificate" />
                </Field>
                <Field label="Assigned Surgery" span>
                  <input className={styles.input} value={form.assignedSurgery} onChange={(e) => set("assignedSurgery", e.target.value)} placeholder="e.g. Surgery 1 & 3" />
                </Field>
              </>)}

              {form.roleType === "hygienist" && (<>
                <Field label="Scope of Practice">
                  <select className={styles.input} value={form.scopeOfPractice} onChange={(e) => set("scopeOfPractice", e.target.value)}>
                    <option value="">Select…</option>
                    <option value="Dental Hygienist">Dental Hygienist</option>
                    <option value="Dental Therapist">Dental Therapist</option>
                    <option value="Dental Therapist & Hygienist">Dental Therapist & Hygienist</option>
                  </select>
                </Field>
                <Field label="LAS Certified">
                  <CheckToggle checked={form.lasCertified} onChange={() => toggle("lasCertified")} label="Local anaesthesia certified" />
                </Field>
              </>)}

              {form.roleType === "manager" && (<>
                <Field label="CQC Registered Manager">
                  <CheckToggle checked={form.cqcRegistered} onChange={() => toggle("cqcRegistered")} label="CQC Registered Manager" />
                </Field>
                <Field label="Direct Reports">
                  <input className={styles.input} type="number" value={form.directReports} onChange={(e) => set("directReports", e.target.value)} placeholder="e.g. 12" />
                </Field>
                <Field label="Practice Emergency Contact" span>
                  <CheckToggle checked={form.emergencyContact} onChange={() => toggle("emergencyContact")} label="Listed as emergency contact" />
                </Field>
                <Field label="Responsibilities (one per line)" span>
                  <textarea className={styles.textarea} value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} placeholder={"HR & Recruitment\nCQC Compliance\nFinance & Invoicing"} rows={4} />
                </Field>
              </>)}

              {form.roleType === "receptionist" && (<>
                <Field label="Working Hours">
                  <input className={styles.input} value={form.workingHours} onChange={(e) => set("workingHours", e.target.value)} placeholder="e.g. Mon–Fri, 08:00–17:00" />
                </Field>
                <Field label="Additional Roles">
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <CheckToggle checked={form.firstAider} onChange={() => toggle("firstAider")} label="First Aider" />
                    <CheckToggle checked={form.fireWarden} onChange={() => toggle("fireWarden")} label="Fire Warden" />
                  </div>
                </Field>
              </>)}
            </div>
          )}

          {/* ── Step 2: Clinical Profile ── */}
          {step === 2 && (
            <div className={styles.formGrid}>
              {isClinical && (<>
                <Field label="Clinical Interests" span>
                  <div className={styles.chipGrid}>
                    {CLINICAL_INTERESTS.map((c) => (
                      <ChipToggle key={c} label={c} selected={form.interests.includes(c)} onToggle={() => toggleArr("interests", c)} />
                    ))}
                  </div>
                </Field>
                <Field label="Preferred Clinical Equipment" span>
                  <div className={styles.chipGrid}>
                    {EQUIPMENT_OPTIONS.map((eq) => (
                      <ChipToggle key={eq} label={eq} selected={form.equipment.includes(eq)} onToggle={() => toggleArr("equipment", eq)} />
                    ))}
                  </div>
                </Field>
              </>)}
              <Field label="Languages Spoken" span>
                <input className={styles.input} value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="e.g. English, French, Spanish" />
              </Field>
              <Field label="Qualifications (one per line)" span>
                <textarea className={styles.textarea} value={form.quals} onChange={(e) => set("quals", e.target.value)} placeholder={"BDS King's College London\nMSc Orthodontics UCL"} rows={3} />
              </Field>
              {form.roleType === "dentist" && (
                <Field label="Specialisms (one per line)" span>
                  <textarea className={styles.textarea} value={form.specialisms} onChange={(e) => set("specialisms", e.target.value)} placeholder={"Invisalign\nComposite Bonding"} rows={3} />
                </Field>
              )}
              <Field label="Professional Bio" span>
                <textarea className={styles.textarea} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Brief professional biography visible to colleagues…" rows={4} />
              </Field>
            </div>
          )}

          {/* ── Step 3: Documents & Access ── */}
          {step === 3 && (
            <div className={styles.formGrid}>
              <div className={`${styles.fieldSpan} ${styles.docsNotice}`}>
                <I name="shieldalert" size={15} color="var(--primary)" />
                <span>All documents are stored securely and used for compliance verification only.</span>
              </div>

              {isGdcRole && (
                <Field label="GDC Registration Certificate" span>
                  <FileUploadField
                    label="GDC Certificate (PDF)"
                    value={form.gdcCertFile}
                    onChange={(name) => set("gdcCertFile", name)}
                    required
                  />
                </Field>
              )}

              {form.roleType === "dentist" && (
                <Field label="Indemnity Insurance" span>
                  <FileUploadField
                    label="Indemnity Certificate"
                    value={form.indemnityFile}
                    onChange={(name) => set("indemnityFile", name)}
                    required
                  />
                </Field>
              )}

              <Field label="DBS Check" span>
                <FileUploadField
                  label="Enhanced DBS Certificate (issued within 3 years)"
                  value={form.dbsFile}
                  onChange={(name) => set("dbsFile", name)}
                  required
                />
              </Field>

              {/* Account credentials — only for new staff */}
              {!isEdit && (
                <div className={`${styles.fieldSpan} ${styles.credentialsBlock}`}>
                  <h4 className={styles.credentialsTitle}>
                    <I name="lock" size={14} /> Account Credentials
                  </h4>
                  <p className={styles.credentialsSub}>
                    The PM hands these to the staff member on their first day. They will be prompted to set a new password on first login.
                  </p>
                  <div className={styles.credentialsGrid}>
                    <Field label="Username" required>
                      <div className={styles.credInputRow}>
                        <input
                          className={styles.input}
                          value={form.username}
                          onChange={(e) => set("username", e.target.value)}
                          placeholder={suggestedUsername || "e.g. j.smith"}
                        />
                      </div>
                    </Field>
                    <Field label="Temporary Password" required>
                      <div className={styles.credInputRow}>
                        <input
                          className={styles.input}
                          value={form.tempPassword}
                          onChange={(e) => set("tempPassword", e.target.value)}
                          placeholder="e.g. Inspire@Ab12"
                        />
                        <button type="button" className={styles.generateBtn} onClick={generatePassword}>
                          Generate
                        </button>
                      </div>
                    </Field>
                  </div>
                  {form.username && form.tempPassword && (
                    <div className={styles.credPreview}>
                      <span className={styles.credPreviewItem}>
                        <I name="person" size={12} /> <strong>Username:</strong> {form.username}
                      </span>
                      <span className={styles.credPreviewItem}>
                        <I name="lock" size={12} /> <strong>Password:</strong> {form.tempPassword}
                      </span>
                      <button type="button" className={styles.copyBtn} onClick={copyCredentials}>
                        <I name="fileplus" size={12} /> Copy
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className={`${styles.fieldWrap} ${styles.fieldSpan}`}>
                <div className={styles.inviteCard}>
                  <div className={styles.inviteCardLeft}>
                    <I name="mail" size={20} color="var(--primary)" />
                    <div>
                      <p className={styles.inviteTitle}>Send Account Invite</p>
                      <p className={styles.inviteDesc}>
                        An email will be sent to <strong>{form.email || "the staff member"}</strong> with a secure link to set their password and activate their account.
                      </p>
                    </div>
                  </div>
                  <CheckToggle checked={form.sendInvite} onChange={() => toggle("sendInvite")} label="" />
                </div>
              </div>

              <Field label="Data Handling Agreement" span>
                <label className={styles.termsRow}>
                  <input
                    type="checkbox"
                    className={styles.termsCheckbox}
                    checked={form.termsAgreed || false}
                    onChange={() => toggle("termsAgreed")}
                  />
                  <span className={styles.termsText}>
                    I confirm this staff member has acknowledged the{" "}
                    <span className={styles.termsLink}>Clinical Data Handling Policy</span>{" "}
                    and <span className={styles.termsLink}>Terms of Use</span>.
                  </span>
                </label>
              </Field>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.addModalFooter}>
          <BtnOutline onClick={onClose}>Cancel</BtnOutline>
          <div className={styles.addModalFooterRight}>
            {step > 0 && <BtnOutline onClick={back}>Back</BtnOutline>}
            {step < STEPS.length - 1
              ? <BtnPrimary onClick={next}>Continue <I name="arrow" size={14} /></BtnPrimary>
              : <BtnPrimary onClick={handleSave}>{isEdit ? "Save Changes" : "Add Staff Member"}</BtnPrimary>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Profile modal ─────────────────────────────────────────────────────────────

const Section = ({ icon, title, locked, children }) => (
  <div className={styles.profileSection}>
    <h3 className={styles.profileSectionTitle}>
      <I name={icon} size={13} /> {title}
      {locked && <span className={styles.lockedBadge}><I name="lock" size={10} /> PM managed</span>}
    </h3>
    {children}
  </div>
);

const Row = ({ label, value }) =>
  value ? (
    <div className={styles.profileRow}>
      <span className={styles.profileRowLabel}>{label}</span>
      <span className={styles.profileRowValue}>{value}</span>
    </div>
  ) : null;

const ProfileModal = ({ person, onClose, onEdit, onDelete, isManager }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cpdPct = Math.round(((person.cpdHours ?? 0) / person.cpdRequired) * 100);
  const cpdColor = cpdPct >= 75 ? "var(--success)" : cpdPct >= 40 ? "var(--warning)" : "var(--error)";

  const docCount = Object.values(person.docs || {}).filter(Boolean).length;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.profileModal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatarWrap}>
            <Avatar name={person.name} size={72} bg={ROLE_COLORS[person.roleType]} />
            {person.online && <div className={styles.profileOnlineDot} />}
          </div>
          <div className={styles.profileHeaderInfo}>
            <div className={styles.profileHeaderTop}>
              <div>
                <h2 className={styles.profileName}>{person.name}</h2>
                <p className={styles.profileRoleLabel} style={ROLE_COLORS[person.roleType] ? { color: ROLE_COLORS[person.roleType] } : undefined}>
                  {person.roleLabel}
                  {ROLE_LABELS[person.roleType] && (
                    <span className={styles.roleTypePill} style={{ background: ROLE_COLORS[person.roleType] }}>
                      {ROLE_LABELS[person.roleType]}
                    </span>
                  )}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <BtnSecondary style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => onEdit(person)}>
                  <I name="edit" size={13} /> Edit Profile
                </BtnSecondary>
                {isManager && !confirmDelete && (
                  <button
                    className={styles.deleteBtnSoft}
                    onClick={() => setConfirmDelete(true)}
                    title="Delete staff member"
                  >
                    <I name="trash" size={14} />
                  </button>
                )}
                {isManager && confirmDelete && (
                  <div className={styles.deleteConfirm}>
                    <span className={styles.deleteConfirmText}>Delete {person.name}?</span>
                    <button className={styles.deleteBtnConfirm} onClick={() => onDelete(person.id)}>Yes, delete</button>
                    <button className={styles.deleteBtnCancel} onClick={() => setConfirmDelete(false)}>Cancel</button>
                  </div>
                )}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                  <I name="xcircle" size={22} />
                </button>
              </div>
            </div>
            <div className={styles.profileHeaderMeta}>
              <span className={styles.profileMetaItem}><I name="building" size={13} /> {person.practice}</span>
              {person.gdc && <span className={styles.profileMetaItem}><I name="shieldalert" size={13} /> GDC {person.gdc}</span>}
              <span className={styles.profileMetaItem}><I name="calendar" size={13} /> Since {person.startDate}</span>
              {person.gender && <span className={styles.profileMetaItem}><I name="person" size={13} /> {person.gender}</span>}
            </div>
            <div className={styles.profileActions}>
              <BtnOutline style={{ fontSize: 13, padding: "7px 14px" }}>
                <I name="at" size={13} /> {person.email}
              </BtnOutline>
              {person.ext && (
                <BtnOutline style={{ fontSize: 13, padding: "7px 14px" }}>Ext. {person.ext}</BtnOutline>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={styles.profileBody}>
          <div className={styles.profileGrid}>
            <div className={styles.profileMain}>
              {person.bio && (
                <Section icon="person" title="About">
                  <p className={styles.profileBio}>{person.bio}</p>
                </Section>
              )}
              {person.quals?.length > 0 && (
                <Section icon="bookmark" title="Qualifications" locked>
                  <ul className={styles.profileList}>
                    {person.quals.map((q) => (
                      <li key={q} className={styles.profileListItem}>
                        <I name="check" size={13} color="var(--primary)" /> {q}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
              {person.specialisms?.length > 0 && (
                <Section icon="star" title="Specialisms & Services" locked>
                  <div className={styles.pillRow}>
                    {person.specialisms.map((s) => (
                      <Pill key={s} bg="var(--tertiary-container)" color="var(--on-tertiary-container)" small>{s}</Pill>
                    ))}
                  </div>
                </Section>
              )}
              {person.interests?.length > 0 && (
                <Section icon="target" title="Clinical Interests">
                  <div className={styles.pillRow}>
                    {person.interests.map((i) => (
                      <Pill key={i} bg="var(--surface-container)" color="var(--on-surface-variant)" small>{i}</Pill>
                    ))}
                  </div>
                </Section>
              )}
              {person.equipment?.length > 0 && (
                <Section icon="monitor" title="Preferred Equipment">
                  <div className={styles.pillRow}>
                    {person.equipment.map((e) => (
                      <Pill key={e} bg="var(--surface-container)" color="var(--on-surface-variant)" small>{e}</Pill>
                    ))}
                  </div>
                </Section>
              )}
              {person.responsibilities?.length > 0 && (
                <Section icon="clipboard" title="Responsibilities" locked>
                  <div className={styles.pillRow}>
                    {person.responsibilities.map((r) => (
                      <Pill key={r} bg="var(--surface-container)" color="var(--on-surface-variant)" small>{r}</Pill>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            <div className={styles.profileSide}>
              {person.gdc && (
                <Section icon="shieldalert" title="GDC Registration" locked>
                  <Row label="Number" value={person.gdc} />
                  <Row label="Type" value={person.gdcType} />
                  <Row label="Renewal" value={person.gdcRenewal || "—"} />
                </Section>
              )}
              {(person.surgeryDays || person.surgeries?.length || person.indemnity) && (
                <Section icon="calendar" title="Clinical Details" locked>
                  <Row label="Surgery Days" value={person.surgeryDays} />
                  <Row label="Surgeries" value={person.surgeries?.join(", ")} />
                  <Row label="Indemnity" value={person.indemnity} />
                </Section>
              )}
              {person.scopeOfPractice && (
                <Section icon="stethoscope" title="Scope of Practice" locked>
                  <Row label="Scope" value={person.scopeOfPractice} />
                  <Row label="LAS Certified" value={person.lasCertified ? "Yes" : "No"} />
                </Section>
              )}
              {person.roleType === "nurse" && (
                <Section icon="usercheck" title="Nursing Details" locked>
                  <Row label="Status" value={person.nurseStatus} />
                  <Row label="Radiography Cert" value={person.radiographyCert ? "Yes" : "No"} />
                  <Row label="Assigned Surgery" value={person.assignedSurgery} />
                </Section>
              )}
              {person.roleType === "manager" && (
                <Section icon="briefcase" title="Management" locked>
                  <Row label="CQC Reg. Manager" value={person.cqcRegistered ? "Yes" : "No"} />
                  <Row label="Direct Reports" value={person.directReports?.toString()} />
                  <Row label="Emergency Contact" value={person.emergencyContact ? "Yes" : "No"} />
                </Section>
              )}
              {person.roleType === "receptionist" && (
                <Section icon="clock" title="Role Details" locked>
                  <Row label="Working Hours" value={person.workingHours} />
                  <Row label="First Aider" value={person.firstAider ? "Yes" : "No"} />
                  <Row label="Fire Warden" value={person.fireWarden ? "Yes" : "No"} />
                </Section>
              )}
              {person.languages?.length > 0 && (
                <Section icon="at" title="Languages">
                  <div className={styles.pillRow}>
                    {person.languages.map((l) => (
                      <Pill key={l} bg="var(--surface-container)" color="var(--on-surface-variant)" small>{l}</Pill>
                    ))}
                  </div>
                </Section>
              )}
              {person.docs && docCount > 0 && (
                <Section icon="file" title="Documents" locked>
                  {person.docs.gdc && <Row label="GDC Certificate" value="✓ On file" />}
                  {person.docs.indemnity && <Row label="Indemnity" value="✓ On file" />}
                  {person.docs.dbs && <Row label="DBS Check" value="✓ On file" />}
                </Section>
              )}
              <Section icon="award" title="CPD Progress">
                <div className={styles.cpdBar}>
                  <div className={styles.cpdBarTrack}>
                    <div className={styles.cpdBarFill} style={{ width: `${Math.min(cpdPct, 100)}%`, background: cpdColor }} />
                  </div>
                  <span className={styles.cpdBarLabel} style={{ color: cpdColor }}>
                    {person.cpdHours ?? 0} / {person.cpdRequired} hrs
                  </span>
                </div>
                <p className={styles.cpdNote}>Current CPD cycle</p>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Custom dropdown ───────────────────────────────────────────────────────────

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className={styles.customSelect} ref={ref}>
      <button
        type="button"
        className={value ? `${styles.tabDropdown} ${styles.tabDropdownActive}` : styles.tabDropdown}
        onClick={() => setOpen((o) => !o)}
      >
        {value || placeholder}
        <I name="chevrondown" size={13} />
      </button>
      {open && (
        <div className={styles.dropPanel}>
          <div
            className={!value ? `${styles.dropOption} ${styles.dropOptionSelected}` : styles.dropOption}
            onClick={() => { onChange(""); setOpen(false); }}
          >
            {placeholder}
          </div>
          {options.map((o) => (
            <div
              key={o}
              className={value === o ? `${styles.dropOption} ${styles.dropOptionSelected}` : styles.dropOption}
              onClick={() => { onChange(o); setOpen(false); }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

export const StaffPage = ({ currentUser }) => {
  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState("");
  const [practiceFilter, setPracticeFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { listStaff().then(setStaffList); }, []);

  const featured = useMemo(() => staffList.find((s) => s.featured), [staffList]);

  const gdcAlerts = useMemo(() => gdcAlertsFor(staffList), [staffList]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staffList.filter((s) => (
      (s.name.toLowerCase().includes(q) || s.roleLabel.toLowerCase().includes(q)) &&
      (!practiceFilter || s.practice === practiceFilter) &&
      (!roleFilter || s.roleLabel.toLowerCase().includes(roleFilter.toLowerCase()) || s.roleType.toLowerCase().includes(roleFilter.toLowerCase()))
    ));
  }, [staffList, search, practiceFilter, roleFilter]);

  const handleSave = async (data, accountData) => {
    const isNew = !staffList.some((s) => s.id === data.id);
    if (isNew) {
      const created = await createStaff(data);
      setStaffList((prev) => [...prev, created]);
      if (accountData?.username) {
        try {
          await registerAccount({
            username: accountData.username,
            password: accountData.tempPassword || "Welcome1",
            role: created.roleType,
            staffId: created.id,
            isTempPassword: true,
            displayName: created.name,
          });
        } catch (e) {
          // Username clash or similar — surface to UI later if needed.
          if (e.code !== "VALIDATION") throw e;
        }
      }
      if (selectedPerson?.id === created.id) setSelectedPerson(created);
    } else {
      const updated = await updateStaff(data.id, data);
      setStaffList((prev) => prev.map((s) => (s.id === data.id ? updated : s)));
      if (selectedPerson?.id === data.id) setSelectedPerson(updated);
    }
    setEditingPerson(null);
    setShowAdd(false);
  };

  const openEdit = (person) => { setSelectedPerson(null); setEditingPerson(person); };

  const handleDelete = async (id) => {
    await deleteStaff(id);
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    setSelectedPerson(null);
  };

  return (
    <div>
      <div className={styles.searchWrap}>
        <div className={styles.searchBar}>
          <I name="search" size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name, role, or specialty…" className={styles.searchInput} />
        </div>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Staff Directory</h1>
          <p className={styles.lead}>Connect with the Dental Group specialist team.</p>
        </div>
        {currentUser?.role === "manager" && (
          <BtnPrimary onClick={() => setShowAdd(true)}>
            <I name="userplus" size={15} /> Add Staff Member
          </BtnPrimary>
        )}
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => { setPracticeFilter(""); setRoleFilter(""); }}
          className={!practiceFilter && !roleFilter ? `${styles.tab} ${styles.active}` : styles.tab}
        >
          <I name="staff" size={14} />
          All Staff
        </button>

        <CustomSelect
          value={practiceFilter}
          onChange={(v) => { setPracticeFilter(v); setRoleFilter(""); }}
          options={practices}
          placeholder="By Practice"
        />

        <CustomSelect
          value={roleFilter}
          onChange={(v) => { setRoleFilter(v); setPracticeFilter(""); }}
          options={roleFilters}
          placeholder="By Role"
        />
      </div>

      {practiceFilter && (
        <div className={styles.practiceBanner}>
          <div className={styles.practiceBannerLeft}>
            <div className={styles.practiceBannerIcon}>
              <I name="building" size={20} color="var(--primary)" />
            </div>
            <div>
              <div className={styles.practiceBannerName}>{practiceFilter}</div>
              <div className={styles.practiceBannerAddress}>{practiceAddresses[practiceFilter]}</div>
            </div>
          </div>
          <div className={styles.practiceBannerStats}>
            <div className={styles.practiceStat}>
              <span className={styles.practiceStatValue}>
                {filtered.filter(s => CLINICAL_ROLE_TYPES.includes(s.roleType)).length.toString().padStart(2, "0")}
              </span>
              <span className={styles.practiceStatLabel}>Clinicians</span>
            </div>
            <div className={styles.practiceStat}>
              <span className={styles.practiceStatValue}>
                {filtered.filter(s => SUPPORT_ROLE_TYPES.includes(s.roleType)).length.toString().padStart(2, "0")}
              </span>
              <span className={styles.practiceStatLabel}>Support Staff</span>
            </div>
          </div>
        </div>
      )}

      {currentUser?.role === "manager" && gdcAlerts.length > 0 && (
        <div className={styles.complianceAlert}>
          <div className={styles.complianceAlertLeft}>
            <I name="shieldalert" size={16} color="#e53935" />
            <span className={styles.complianceAlertTitle}>
              GDC Registration — {gdcAlerts.filter(a => a.overdue).length > 0 ? "Action Required" : "Renewals Due Soon"}
            </span>
          </div>
          <div className={styles.complianceAlertRows}>
            {gdcAlerts.map(a => (
              <div key={a.id} className={styles.complianceAlertRow}>
                <Avatar name={a.name} size={22} bg={ROLE_COLORS[a.roleType]} />
                <span className={styles.complianceAlertName}>{a.name}</span>
                <span className={styles.complianceAlertRole}>{a.roleLabel}</span>
                <span
                  className={styles.complianceAlertDate}
                  style={{ color: a.overdue ? "#e53935" : "#b36000" }}
                >
                  {a.overdue
                    ? `GDC expired ${a.renewal} — OVERDUE`
                    : `GDC due ${a.renewal} — ${a.daysLeft} day${a.daysLeft !== 1 ? "s" : ""} remaining`}
                </span>
                <button className={styles.complianceAlertBtn} onClick={() => setSelectedPerson(staffList.find(s => s.id === a.id))}>
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
          {featured && !search && !practiceFilter && !roleFilter && (
            <Card hover={false} style={{ padding: 32, marginBottom: 28, display: "flex", gap: 32 }}>
              <div className={styles.featuredPhotoWrap}>
                <div className={styles.featuredPhoto}><Avatar name={featured.name} size={100} bg={ROLE_COLORS[featured.roleType]} /></div>
                <div className={styles.featuredBadge} style={ROLE_COLORS[featured.roleType] ? { background: ROLE_COLORS[featured.roleType], color: "#fff" } : undefined}>
                  <span className={styles.featuredBadgeText}>FOUNDER</span>
                </div>
              </div>
              <div className={styles.featuredBody}>
                <p className={styles.featuredEyebrow}>{featured.roleLabel}</p>
                <h2 className={styles.featuredName}>{featured.name}</h2>
                <p className={styles.featuredQual}>{featured.quals?.[0]}{featured.gdc ? ` · GDC: ${featured.gdc}` : ""}</p>
                <p className={styles.featuredBio}>{featured.bio}</p>
                <div className={styles.featuredActions}>
                  {currentUser?.role === "manager" && (
                    <BtnSecondary onClick={() => setSelectedPerson(featured)}>
                      <I name="person" size={14} /> View Profile
                    </BtnSecondary>
                  )}
                </div>
              </div>
            </Card>
          )}

          <div className={styles.staffGrid}>
            {filtered.map((s) => (
              <Card key={s.id} style={{ padding: 20, textAlign: "center" }}
                onClick={currentUser?.role === "manager" ? () => setSelectedPerson(s) : undefined}>
                <div className={styles.staffAvatarWrap}>
                  <Avatar name={s.name} size={64} bg={ROLE_COLORS[s.roleType]} />
                  {s.online && <div className={styles.onlineDot} />}
                </div>
                <h4 className={styles.staffName}>{s.name}</h4>
                <p className={styles.staffRole} style={ROLE_COLORS[s.roleType] ? { color: ROLE_COLORS[s.roleType] } : undefined}>{s.roleLabel}</p>
                {ROLE_LABELS[s.roleType] && (
                  <span className={styles.roleTypePill} style={{ background: ROLE_COLORS[s.roleType] }}>
                    {ROLE_LABELS[s.roleType]}
                  </span>
                )}
                {s.gdc && <p className={styles.staffGdc}>GDC {s.gdc}</p>}
                <p className={styles.staffPractice}>{s.practice}</p>
                {currentUser?.role === "manager" && (
                  <div className={styles.staffActions}>
                    <BtnSecondary style={{ padding: "6px 12px", fontSize: 11 }}
                      onClick={(e) => { e.stopPropagation(); setSelectedPerson(s); }}>
                      <I name="person" size={12} /> Profile
                    </BtnSecondary>
                  </div>
                )}
              </Card>
            ))}
          </div>
      </div>

      {selectedPerson && (
        <ProfileModal person={selectedPerson} onClose={() => setSelectedPerson(null)} onEdit={openEdit} onDelete={handleDelete} isManager={currentUser?.role === "manager"} />
      )}
      {(showAdd || editingPerson) && (
        <AddEditModal
          person={editingPerson || null}
          onClose={() => { setShowAdd(false); setEditingPerson(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
