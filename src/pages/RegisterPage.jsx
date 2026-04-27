import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import styles from "./RegisterPage.module.css";

export const RegisterPage = ({ onNav }) => (
  <div className={styles.page}>
    <div className={styles.header}>
      <span className={styles.brand}>Inspire Dental Group</span>
      <BtnSecondary onClick={() => onNav("login")} style={{ padding: "8px 20px", fontSize: 13 }}>
        Login
      </BtnSecondary>
    </div>

    <div className={styles.body}>
      <div className={styles.shell}>
        <Pill bg="var(--surface-container)" color="var(--on-surface-variant)">Registration</Pill>
        <h1 className={styles.title}>Join with your email address</h1>
        <p className={styles.lead}>
          Create your professional profile to access the Inspire Dental Group clinical intranet and staff resources.
        </p>

        <div className={styles.layout}>
          <div className={styles.photoBlock}>
            <div className={styles.photoFrame}>
              <I name="camera" size={32} color="var(--outline-variant)" />
              <div className={styles.photoBadge}>
                <I name="plus" size={18} color="var(--on-primary)" />
              </div>
            </div>
            <p className={styles.photoLabel}>Profile Photo</p>
            <p className={styles.photoHelp}>
              Please upload a clear professional headshot for clinical identification.
            </p>
          </div>

          <Card hover={false} style={{ flex: 1, padding: 32 }}>
            <div className={styles.fieldGrid}>
              <Input label="Full Name" placeholder="Dr. Jane Smith" />
              <div>
                <label className={styles.selectLabel}>Gender</label>
                <select className={styles.select}>
                  <option>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
              <Input label="Username" placeholder="jsmith_clinical" />
              <Input label="Password" type="password" placeholder="••••••••••••" icon={<I name="eye" size={14} />} />
              <Input label="Email Address" placeholder="jane.smith@inspiredental.co.uk" />
              <Input label="Date of Birth" type="date" />
            </div>

            <label className={styles.terms}>
              <input type="checkbox" className={styles.termsCheckbox} />
              <span className={styles.termsText}>
                I agree to the <span className={styles.termsLink}>Terms of Use</span> and acknowledge the{" "}
                <span className={styles.termsLink}>Clinical Data Handling Policy</span> regarding patient confidentiality.
              </span>
            </label>

            <BtnPrimary onClick={() => onNav("onboarding")} style={{ padding: "16px 32px", fontSize: 15 }}>
              Create & Complete Profile <I name="arrow" size={16} />
            </BtnPrimary>
          </Card>
        </div>
      </div>
    </div>

    <div className={styles.footer}>
      <span className={styles.footerBrand}>Inspire Dental Group</span>
      <div className={styles.footerLinks}>
        {["Privacy Policy", "Terms of Service", "Clinical Standards"].map((l) => (
          <a key={l} className={styles.footerLink}>{l}</a>
        ))}
      </div>
      <span className={styles.footerCopy}>© 2024 Inspire Dental Group. All rights reserved.</span>
    </div>
  </div>
);
