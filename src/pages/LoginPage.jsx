import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { BtnPrimary, BtnOutline } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import styles from "./LoginPage.module.css";

export const LoginPage = ({ onNav }) => (
  <div className={styles.page}>
    <div className={`${styles.blob} ${styles.blobTopRight}`} />
    <div className={`${styles.blob} ${styles.blobBottomLeft}`} />

    <div className={styles.shell}>
      <div className={styles.brand}>
        <div className={styles.brandLogo}>
          <I name="tooth" size={32} color="var(--on-primary)" />
        </div>
        <h1 className={styles.brandTitle}>
          <span className={styles.brandTitleEm}>Inspire</span> Dental Group
        </h1>
        <p className={styles.brandTagline}>The Clinical Sanctuary</p>
        <div className={styles.brandRule} />
      </div>

      <Card hover={false} style={{ padding: "40px 36px" }}>
        <Input label="Email" type="email" placeholder="dr.smith@dentalhub.co.uk" icon="@" />
        <div className={styles.passwordHeader}>
          <label className={styles.passwordLabel}>Password</label>
          <a className={styles.forgotLink}>Forgot Password?</a>
        </div>
        <Input type="password" placeholder="••••••••••••" icon={<I name="eye" size={14} />} />

        <label className={styles.rememberRow}>
          <input type="checkbox" className={styles.rememberCheckbox} />
          <span className={styles.rememberLabel}>Remember my session</span>
        </label>

        <BtnPrimary
          onClick={() => onNav("dashboard")}
          style={{ width: "100%", justifyContent: "center", padding: "16px 28px", fontSize: 15 }}
        >
          Sign In <I name="arrow" size={16} />
        </BtnPrimary>

        <div className={styles.divider}>
          <p className={styles.dividerText}>New to the Hub?</p>
          <BtnOutline
            onClick={() => onNav("register")}
            style={{ width: "100%", justifyContent: "center", padding: "14px 28px" }}
          >
            Register <I name="person" size={16} />
          </BtnOutline>
        </div>
      </Card>

      <div className={styles.footer}>
        <p className={styles.footerHeading}>Authorised Personnel Only</p>
        <div className={styles.staffOnDuty}>
          <div style={{ display: "flex" }}>
            <Avatar name="A" size={24} />
            <Avatar name="B" size={24} bg="var(--secondary)" />
          </div>
          <span className={styles.staffOnDutyLabel}>Join 120+ staff on duty</span>
        </div>
        <div className={styles.statusPill}>
          <div className={styles.statusDot} />
          <span className={styles.statusLabel}>System Status: Fully Operational</span>
        </div>
      </div>
    </div>
  </div>
);
