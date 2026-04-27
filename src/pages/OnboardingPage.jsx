import { useState } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary, BtnOutline } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { Input } from "../components/ui/Input";
import styles from "./OnboardingPage.module.css";

const steps = [
  { num: 1, label: "Identity", icon: "person" },
  { num: 2, label: "Clinical Interests", icon: "clinical" },
  { num: 3, label: "Credentials", icon: "file" },
  { num: 4, label: "Verification", icon: "checkcircle" },
];

const stepTitles = ["", "Identity", "Practice & Clinical Interests", "Clinical Compliance", "Review & Launch"];
const stepStages = ["", "Stage One", "Stage Two", "Stage Three", "Final Step"];

const ChipToggle = ({ label, selected, onToggle }) => (
  <button
    onClick={onToggle}
    className={selected ? `${styles.chipToggle} ${styles.chipToggleSelected}` : styles.chipToggle}
  >
    {label} {selected && <I name="checkcircle" size={14} color="var(--primary)" />}
  </button>
);

const CheckItem = ({ label, checked, onToggle }) => (
  <label className={checked ? `${styles.checkItem} ${styles.checkItemChecked}` : styles.checkItem}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      className={styles.checkItemBox}
    />
    <span className={styles.checkItemLabel}>{label}</span>
  </label>
);

const Step1 = ({ interests, toggleInterest }) => (
  <div className={styles.step1Row}>
    <div className={styles.step1Side}>
      <h2 className={styles.step1Heading}>Basic Info</h2>
      <p className={styles.step1Lead}>
        Start by introducing yourself to the group. Your professional bio helps colleagues find you for internal referrals and collaborative clinical cases.
      </p>
    </div>
    <div className={styles.step1Body}>
      <div className={styles.step1AvatarRow}>
        <div className={styles.step1AvatarBlock}>
          <Avatar name="Dr. Alistair Sterling" size={90} />
          <p className={styles.uploadHint}>Upload Photo</p>
        </div>
        <div style={{ flex: 1 }}>
          <Input label="Full Name" placeholder="e.g. Dr. Alistair Sterling" />
          <Input label="Professional Title" placeholder="Associate Dentist (Clinical Lead)" />
        </div>
      </div>

      <div className={styles.bioBlock}>
        <label className={styles.fieldLabel}>Professional Clinical Bio</label>
        <textarea
          rows={4}
          placeholder="Briefly describe your clinical background, years of experience, and patient philosophy..."
          className={styles.bioTextarea}
        />
      </div>

      <div className={styles.dualCardRow}>
        <Card hover={false} style={{ padding: 20 }}>
          <div className={styles.dualCardEyebrow}>
            <I name="building" size={16} color="var(--primary)" />
            <span className={styles.dualCardEyebrowText}>Primary Site</span>
          </div>
          <select className={styles.select}>
            <option>Select practice...</option>
            <option>London Flagship - Harley St</option>
            <option>Canary Wharf Clinic</option>
            <option>Bristol South West Hub</option>
          </select>
        </Card>
        <Card hover={false} style={{ padding: 20 }}>
          <div className={styles.dualCardEyebrow}>
            <I name="briefcase" size={16} color="var(--primary)" />
            <span className={styles.dualCardEyebrowText}>Clinical Role</span>
          </div>
          <select className={styles.select}>
            <option>Select role...</option>
            <option>Associate Dentist</option>
            <option>Hygienist</option>
            <option>Nurse</option>
            <option>Practice Manager</option>
          </select>
        </Card>
      </div>

      <div>
        <label className={styles.chipRowLabel}>Clinical Interests (Select All That Apply)</label>
        <div className={styles.chipRow}>
          {["Endodontics", "Implantology", "Cosmetic Dentistry", "Pediatric Care", "Practice Growth", "Digital Radiography"].map((c) => (
            <ChipToggle key={c} label={c} selected={interests.includes(c)} onToggle={() => toggleInterest(c)} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Step2 = ({ interests, toggleInterest, equipment, toggleEquipment }) => (
  <div>
    <div className={styles.step2Row}>
      <Card hover={false} style={{ padding: 28 }}>
        <h3 className={styles.step2HeadingFlex}>
          <I name="clinical" size={18} color="var(--primary)" /> Clinical Focus Areas
        </h3>
        <p className={styles.step2Lead}>Select the disciplines you wish to prioritize in your clinical rotation.</p>
        <div className={styles.chipRow} style={{ gap: 10 }}>
          {["Implantology", "Orthodontics", "Cosmetic", "Pedodontics", "Endodontics", "Periodontics", "Oral Surgery", "Digital Dentistry"].map((d) => (
            <ChipToggle key={d} label={d} selected={interests.includes(d)} onToggle={() => toggleInterest(d)} />
          ))}
        </div>
      </Card>

      <Card hover={false} style={{ padding: 24 }}>
        <h3 className={styles.step2HeadingFlex} style={{ fontSize: 16 }}>
          <I name="star" size={16} color="var(--primary)" /> Special Interests
        </h3>
        <p className={styles.step2Lead} style={{ fontSize: 12, marginBottom: 16 }}>
          Do you have specific areas of study or niche skills like sleep apnea therapy or sedation?
        </p>
        <textarea
          rows={5}
          placeholder="Describe your niche interests..."
          className={styles.bioTextarea}
          style={{ fontSize: 13 }}
        />
      </Card>
    </div>

    <div className={styles.step2BottomRow}>
      <Card hover={false} className={styles.equipmentCard}>
        <h3 className={styles.step2HeadingFlex} style={{ marginBottom: 20 }}>
          <I name="monitor" size={18} color="var(--primary)" /> Preferred Clinical Equipment
        </h3>
        <div className={styles.equipmentGrid}>
          {["iTero Scanners", "3Shape TRIOS", "CBCT Imaging", "CEREC Systems"].map((eq) => (
            <CheckItem key={eq} label={eq} checked={equipment.includes(eq)} onToggle={() => toggleEquipment(eq)} />
          ))}
        </div>
      </Card>

      <div className={styles.quoteBlock}>
        <div className={styles.quoteBg}>
          <I name="tooth" size={160} color="white" />
        </div>
        <p className={styles.quoteText}>"Delivering excellence through precision and care."</p>
        <span className={styles.quoteAuthor}>— Inspire Dental Standards</span>
      </div>
    </div>
  </div>
);

const Step3 = () => (
  <div>
    <div className={styles.step3Row}>
      <Card hover={false} style={{ padding: 32 }}>
        <div className={styles.gdcCardHeader}>
          <div className={styles.gdcIconWrap}>
            <I name="upload" size={22} color="var(--primary)" />
          </div>
          <Pill bg="rgba(168,56,54,0.07)" color="var(--error)">Upload Required</Pill>
        </div>
        <h3 className={styles.gdcTitle}>GDC Certificate</h3>
        <p className={styles.gdcLead}>
          Your General Dental Council registration certificate must be current and clearly show your registration number and specialty status.
        </p>
        <div className={styles.dropZone}>
          <I name="cloud" size={28} color="var(--outline-variant)" />
          <p className={styles.dropZoneTitle}>Drag and drop your PDF here</p>
          <p className={styles.dropZoneHelp}>Maximum file size: 10MB</p>
          <BtnSecondary style={{ marginTop: 14 }}>Select File</BtnSecondary>
        </div>
      </Card>

      <div className={styles.sideCardStack}>
        <Card hover={false} style={{ padding: 24 }}>
          <div className={styles.sideCardHeader}>
            <div
              className={styles.sideCardIconWrap}
              style={{ background: "rgba(150, 241, 255, 0.19)" }}
            >
              <I name="shield" size={18} color="var(--primary)" />
            </div>
            <Pill bg="rgba(255,152,0,0.09)" color="var(--warning)">Pending</Pill>
          </div>
          <h4 className={styles.sideCardTitle}>Indemnity Insurance</h4>
          <p className={styles.sideCardLead}>Verification of your current professional indemnity cover.</p>
          <div className={styles.uploadedFile}>
            <I name="checkcircle" size={14} color="var(--primary)" />
            <span className={styles.uploadedFileName}>indemnity_2024.pdf</span>
          </div>
        </Card>

        <Card hover={false} style={{ padding: 24 }}>
          <div className={styles.sideCardHeader}>
            <div
              className={styles.sideCardIconWrap}
              style={{ background: "rgba(168,56,54,0.03)" }}
            >
              <I name="alert" size={18} color="var(--error)" />
            </div>
            <Pill bg="rgba(168,56,54,0.07)" color="var(--error)">Missing</Pill>
          </div>
          <h4 className={styles.sideCardTitle}>DBS Check</h4>
          <p className={styles.sideCardLead}>
            Enhanced Disclosure and Barring Service certificate issued within 3 years.
          </p>
          <BtnOutline style={{ width: "100%", justifyContent: "center", padding: "10px 16px", fontSize: 12 }}>
            Start Upload
          </BtnOutline>
        </Card>
      </div>
    </div>

    <div className={styles.timelineNotice}>
      <I name="dot" size={16} color="var(--primary)" />
      <div>
        <span className={styles.timelineTitle}>Verification Timeline</span>
        <p className={styles.timelineDesc}>
          Once uploaded, our clinical compliance team typically verifies credentials within 48 business hours. You will receive an automated notification via your practice email once approved.
        </p>
      </div>
    </div>
  </div>
);

const Step4 = () => (
  <div>
    <div className={styles.step4Row}>
      <Card hover={false} className={styles.strengthCard}>
        <div className={styles.strengthRing}>
          <span className={styles.strengthRingValue}>100%</span>
          <span className={styles.strengthRingLabel}>Strength</span>
        </div>
        <h3 className={styles.strengthTitle}>Ready for Clinic</h3>
        <p className={styles.strengthLead}>
          Your professional profile is fully verified and ready for the intranet.
        </p>
      </Card>

      <div className={styles.summaryStack}>
        <Card hover={false} className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <I name="briefcase" size={18} color="var(--primary)" />
          </div>
          <div>
            <span className={styles.summaryEyebrow}>Placement Details</span>
            <div className={styles.summaryHeading}>Senior Associate Dentist</div>
            <div className={styles.summarySub}>Canary Wharf Clinic</div>
          </div>
        </Card>

        <Card hover={false} className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <I name="bookmark" size={18} color="var(--primary)" />
          </div>
          <div>
            <span className={styles.summaryEyebrow}>Focus Areas</span>
            <div className={styles.focusPills}>
              {["Endodontics", "Implantology", "Cosmetic Bonding"].map((f) => (
                <Pill key={f} bg="var(--surface-highest)" color="var(--on-surface)" small>{f}</Pill>
              ))}
            </div>
          </div>
        </Card>

        <Card hover={false} className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <I name="checksquare" size={18} color="var(--primary)" />
          </div>
          <div>
            <span className={styles.summaryEyebrow}>Verified Documents</span>
            <p className={styles.summaryDesc}>
              GDC Registration, Indemnity Certificate, and DBS clearance have been processed successfully.
            </p>
          </div>
        </Card>
      </div>
    </div>

    <div className={styles.welcomeBanner}>
      <div className={styles.welcomeBg}>
        <I name="tooth" size={200} color="white" />
      </div>
      <p className={styles.welcomeQuote}>
        "Welcome to the team. Your clinical sanctuary awaits."
      </p>
      <div className={styles.welcomeStatus}>
        <div className={styles.welcomeStatusDot} />
        <span className={styles.welcomeStatusLabel}>Systems Online</span>
      </div>
    </div>
  </div>
);

export const OnboardingPage = ({ onNav }) => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState(["Implantology", "Cosmetic"]);
  const [equipment, setEquipment] = useState(["iTero Scanners", "CBCT Imaging"]);

  const toggleInterest = (item) =>
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  const toggleEquipment = (item) =>
    setEquipment((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));

  const stepNode = {
    1: <Step1 interests={interests} toggleInterest={toggleInterest} />,
    2: <Step2 interests={interests} toggleInterest={toggleInterest} equipment={equipment} toggleEquipment={toggleEquipment} />,
    3: <Step3 />,
    4: <Step4 />,
  }[step];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.brand}>Inspire Dental Group</div>
        <div className={styles.brandTag}>Clinical Sanctuary</div>
        <p className={styles.welcome}>Welcome to the Clinical Sanctuary. Let's set up your profile.</p>
      </div>

      <div className={styles.progressBar}>
        {steps.map((s) => (
          <div key={s.num} className={styles.progressItem}>
            <div className={s.num <= step ? `${styles.progressTrack} ${styles.progressTrackDone}` : styles.progressTrack} />
            <span className={s.num === step ? `${styles.progressLabel} ${styles.progressLabelActive}` : styles.progressLabel}>
              Step {s.num}: {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.shell}>
        <div className={styles.stepHeader}>
          <span className={styles.stageEyebrow}>{stepStages[step]}</span>
          <h1 className={styles.stepTitle}>{stepTitles[step]}</h1>
        </div>
        {stepNode}
      </div>

      <div className={styles.footerNav}>
        {step > 1 ? (
          <BtnSecondary onClick={() => setStep(step - 1)}>
            <I name="arrow" size={14} color="var(--on-surface)" style={{ transform: "rotate(180deg)" }} /> Previous Step
          </BtnSecondary>
        ) : (
          <span className={styles.skipLink} onClick={() => onNav("dashboard")}>
            Save & Go to Dashboard
          </span>
        )}
        <div className={styles.nextActions}>
          {step < 4 && (
            <span className={styles.nextLabel}>
              Next up: <strong>{steps[step]?.label}</strong>
            </span>
          )}
          {step < 4 ? (
            <BtnPrimary onClick={() => setStep(step + 1)}>
              Next Step <I name="arrow" size={16} />
            </BtnPrimary>
          ) : (
            <BtnPrimary onClick={() => onNav("dashboard")} style={{ padding: "16px 32px", fontSize: 15 }}>
              Finish & Go to Dashboard <I name="arrow" size={16} />
            </BtnPrimary>
          )}
        </div>
      </div>
    </div>
  );
};
