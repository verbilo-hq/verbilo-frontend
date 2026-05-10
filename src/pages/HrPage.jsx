import { useState, useEffect, useRef } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnPrimary } from "../components/ui/Buttons";
import { SearchBar } from "../components/ui/SearchBar";
import {
  listPolicies, addPolicy, listMandatoryTraining,
  listNotices, listHrQuickLinks, submitLeaveRequest,
} from "../services/hr.service";
import styles from "./HrPage.module.css";

const trainingStatus = {
  done:    { label: ()    => "Complete",        bg: "rgba(76,175,80,0.12)",  color: "#2e7d32"      },
  due:     { label: (due) => `Due ${due}`,      bg: "rgba(255,152,0,0.12)",  color: "#e65100"      },
  overdue: { label: (due) => `Overdue ${due}`,  bg: "rgba(229,57,53,0.12)",  color: "var(--error)" },
};

const LEAVE_TYPES = ["Annual Leave", "Compassionate Leave", "Sick Leave", "Study Leave"];

const calcWorkingDays = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const d = cur.getDay();
    if (d !== 0 && d !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

const LeaveModal = ({ balance, onClose, onSubmit }) => {
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const days = calcWorkingDays(startDate, endDate);

  const validate = () => {
    const e = {};
    if (!startDate) e.startDate = "Required";
    if (!endDate) e.endDate = "Required";
    if (startDate && endDate && new Date(endDate) < new Date(startDate))
      e.endDate = "Must be after start date";
    if (startDate && endDate && !e.endDate && days === 0)
      e.endDate = "No working days in range";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
    onSubmit({ leaveType, startDate, endDate, days, notes });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.leaveModal} onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className={styles.leaveSuccess}>
            <I name="checkcircle" size={52} color="var(--success)" />
            <h3 className={styles.leaveSuccessTitle}>Request Submitted</h3>
            <p className={styles.leaveSuccessDesc}>
              Your {leaveType.toLowerCase()} request for{" "}
              <strong>{days} working day{days !== 1 ? "s" : ""}</strong> has been
              sent to your Practice Manager for approval.
            </p>
            <BtnPrimary onClick={onClose}>Done</BtnPrimary>
          </div>
        ) : (
          <>
            <div className={styles.leaveModalHeader}>
              <div>
                <h2 className={styles.leaveModalTitle}>Request Time Off</h2>
                <p className={styles.leaveModalSub}>Sent to your Practice Manager for approval.</p>
              </div>
              <button className={styles.leaveCloseBtn} onClick={onClose} aria-label="Close">
                <I name="xcircle" size={22} />
              </button>
            </div>

            <div className={styles.leaveModalBody}>
              <div className={styles.leaveField}>
                <label className={styles.leaveFieldLabel}>Leave Type</label>
                <div className={styles.leaveTypeGrid}>
                  {LEAVE_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.leaveTypeBtn} ${leaveType === t ? styles.leaveTypeBtnActive : ""}`}
                      onClick={() => setLeaveType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.leaveDateRow}>
                <div className={styles.leaveField}>
                  <label className={styles.leaveFieldLabel}>
                    Start Date
                    {errors.startDate && <span className={styles.leaveErrText}> — {errors.startDate}</span>}
                  </label>
                  <input
                    type="date"
                    className={`${styles.leaveInput} ${errors.startDate ? styles.leaveInputErr : ""}`}
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setErrors({}); }}
                  />
                </div>
                <div className={styles.leaveField}>
                  <label className={styles.leaveFieldLabel}>
                    End Date
                    {errors.endDate && <span className={styles.leaveErrText}> — {errors.endDate}</span>}
                  </label>
                  <input
                    type="date"
                    className={`${styles.leaveInput} ${errors.endDate ? styles.leaveInputErr : ""}`}
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => { setEndDate(e.target.value); setErrors({}); }}
                  />
                </div>
              </div>

              {days > 0 && (
                <div className={styles.leaveDaysPreview}>
                  <I name="calendar" size={14} color="var(--primary)" />
                  <span>
                    <strong>{days} working day{days !== 1 ? "s" : ""}</strong>
                    {leaveType === "Annual Leave" && (
                      <> — {balance - days} day{balance - days !== 1 ? "s" : ""} remaining after approval</>
                    )}
                  </span>
                </div>
              )}

              <div className={styles.leaveField}>
                <label className={styles.leaveFieldLabel}>
                  Notes <span className={styles.leaveOptional}>(optional)</span>
                </label>
                <textarea
                  className={styles.leaveTextarea}
                  rows={3}
                  placeholder="Any context for your manager…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.leaveModalFooter}>
              <button className={styles.leaveCancelBtn} onClick={onClose}>Cancel</button>
              <BtnPrimary onClick={handleSubmit}>Submit Request</BtnPrimary>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const HrPage = () => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [mandatoryTraining, setMandatoryTraining] = useState([]);
  const [notices, setNotices] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const BALANCE = 12;

  useEffect(() => {
    listPolicies().then(setPolicies);
    listMandatoryTraining().then(setMandatoryTraining);
    listNotices().then(setNotices);
    listHrQuickLinks().then(setQuickLinks);
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.value ? e.target.files[0] : null;
    if (!file) return;
    const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const now = new Date();
    const updated = `Updated ${now.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`;
    const created = await addPolicy({ name, updated });
    setPolicies((prev) => [created, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
    e.target.value = "";
  };

  const handleLeaveSubmit = async (req) => {
    const saved = await submitLeaveRequest(req);
    if (saved.leaveType === "Annual Leave") setPendingRequest(saved);
  };

  return (
  <div>
    <SearchBar placeholder="Search HR policies, documents, or staff..." />

    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>HR Hub</h1>
        <p className={styles.lead}>
          Your central sanctuary for career management, employment records, and practice wellness.
        </p>
      </div>
      <BtnPrimary style={{ flexShrink: 0 }} onClick={() => setShowLeaveModal(true)}>
        <I name="plus" size={16} color="var(--on-primary)" /> Request Time Off
      </BtnPrimary>
    </div>

    <div className={styles.bentoTop}>
      <Card hover={false} style={{ padding: 28 }}>
        <div className={styles.smallEyebrow}>
          <I name="briefcase" size={16} color="var(--primary)" />
          <span className={styles.eyebrowText}>Employment Summary</span>
        </div>
        <h3 className={styles.cardTitle}>Senior Clinical Associate</h3>
        <div className={styles.factRow}>
          <I name="calendar" size={16} color="var(--outline)" />
          <div>
            <div className={styles.factLabel}>Join Date</div>
            <div className={styles.factValue}>October 14th, 2021</div>
          </div>
        </div>
        <div className={styles.factGrid}>
          <div className={styles.factTile}>
            <div className={styles.factLabel}>Contract</div>
            <div className={styles.factTileValue}>Full-Time (Permanent)</div>
          </div>
          <div className={styles.factTile}>
            <div className={styles.factLabel}>Location</div>
            <div className={styles.factTileValue}>Harley St. Clinic</div>
          </div>
        </div>
      </Card>

      <Card hover={false} className={styles.leaveCard} style={{ padding: 28 }}>
        <div className={styles.leaveBg}>
          <I name="umbrella" size={160} color="white" />
        </div>
        <div className={styles.leaveCount}>
          {pendingRequest ? BALANCE - pendingRequest.days : BALANCE}
        </div>
        <div className={styles.leaveTag}>Days Left</div>
        <div className={styles.leaveSub}>Annual Leave Balance</div>
        {pendingRequest && (
          <div className={styles.leavePending}>
            <I name="clock" size={12} />
            {pendingRequest.days} day{pendingRequest.days !== 1 ? "s" : ""} pending approval
          </div>
        )}
      </Card>

      <Card hover={false} className={styles.policyCard}>
        <div className={styles.policyHeader}>
          <div className={styles.policyHeading}>
            <I name="shield" size={16} color="var(--primary)" />
            <span className={styles.eyebrowText}>HR Policy Library</span>
          </div>
          <div className={styles.policyActions}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
            <button
              className={`${styles.uploadBtn} ${uploadSuccess ? styles.uploadBtnSuccess : ""}`}
              onClick={() => fileInputRef.current?.click()}
              title="Upload policy document"
            >
              <I name={uploadSuccess ? "checkcircle" : "upload"} size={13} color={uploadSuccess ? "var(--success)" : "var(--primary)"} />
              <span>{uploadSuccess ? "Uploaded!" : "Upload"}</span>
            </button>
            <a className={styles.policySeeAll}>See All</a>
          </div>
        </div>
        <div className={styles.policyList}>
          {policies.map((p) => (
            <div key={p.name} className={styles.policyRow}>
              <div>
                <div className={styles.policyName}>{p.name}</div>
                <div className={styles.policyUpdated}>{p.updated}</div>
              </div>
              <I name="download" size={16} color="var(--outline)" />
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div className={styles.bentoMid}>
      <Card hover={false} style={{ padding: 28 }}>
        <div className={styles.smallEyebrow}>
          <I name="shieldalert" size={16} color="var(--primary)" />
          <span className={styles.eyebrowText}>Mandatory Training</span>
        </div>
        <h3 className={styles.sectionTitle}>Compliance Status</h3>
        <div className={styles.trainingList}>
          {mandatoryTraining.map((t) => {
            const cfg = trainingStatus[t.status];
            return (
              <div key={t.name} className={styles.trainingRow}>
                <span className={styles.trainingName}>{t.name}</span>
                <span className={styles.trainingPill} style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.label(t.due)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card hover={false} style={{ padding: 28 }}>
        <div className={styles.smallEyebrow}>
          <I name="bell" size={16} color="var(--primary)" />
          <span className={styles.eyebrowText}>Team Notices</span>
        </div>
        <h3 className={styles.sectionTitle}>HR Announcements</h3>
        <div className={styles.noticeList}>
          {notices.map((n) => (
            <div key={n.title} className={styles.noticeRow}>
              <div className={styles.noticeTopRow}>
                <span className={styles.noticeTag}>{n.tag}</span>
                <span className={styles.noticeDate}>{n.date}</span>
              </div>
              <div className={styles.noticeTitle}>{n.title}</div>
              <div className={styles.noticeDesc}>{n.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div className={styles.quickLinksGrid}>
      {quickLinks.map((q) => (
        <Card key={q.title} style={{ padding: 28, cursor: "pointer" }}>
          <div className={styles.quickIconWrap} style={{ background: `color-mix(in srgb, ${q.tint} 10%, transparent)` }}>
            <I name={q.icon} size={22} color={q.tint} />
          </div>
          <h4 className={styles.quickTitle}>{q.title}</h4>
          <p className={styles.quickDesc}>{q.desc}</p>
        </Card>
      ))}
    </div>

    <div className={styles.footer}>
      <span className={styles.footerCopy}>© 2024 Dental Group Ltd.</span>
      <div className={styles.footerLinks}>
        {["Privacy Policy", "Terms of Employment", "Support Hub"].map((l) => (
          <a key={l} className={styles.footerLink}>{l}</a>
        ))}
      </div>
    </div>

    {showLeaveModal && (
      <LeaveModal
        balance={BALANCE}
        onClose={() => setShowLeaveModal(false)}
        onSubmit={handleLeaveSubmit}
      />
    )}
  </div>
  );
};
