import { useState } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnPrimary } from "../components/ui/Buttons";
import { useAuth } from "../auth/AuthContext";
import { useTenant } from "../auth/TenantContext";
import { sectorIcon } from "../lib/sector";
import styles from "./SetPasswordPage.module.css";

export const SetPasswordPage = ({ onComplete }) => {
  const { user, setPassword } = useAuth();
  const { tenant } = useTenant();
  const sector = tenant?.sector ?? "";
  const displayName = user?.displayName;
  const username = user?.username;
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSet = async () => {
    if (pw.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (pw !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await setPassword(pw);
      onComplete?.();
    } catch {
      setError("Could not set password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !submitting) handleSet(); };

  return (
    <div className={styles.page}>
      <div className={`${styles.blob} ${styles.blobTopRight}`} />
      <div className={`${styles.blob} ${styles.blobBottomLeft}`} />

      <div className={styles.shell}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <I name={sectorIcon(sector)} size={32} color="var(--on-primary)" />
          </div>
          <h1 className={styles.brandTitle}>
            <span className={styles.brandTitleEm}>Ver</span>bilo
          </h1>
          <p className={styles.brandTagline}>Built for multi-site healthcare operators</p>
          <div className={styles.brandRule} />
        </div>

        <Card hover={false} style={{ padding: "40px 36px" }}>
          <div className={styles.welcomeBlock}>
            <div className={styles.welcomeIcon}>
              <I name="lock" size={22} color="var(--primary)" />
            </div>
            <div>
              <h2 className={styles.welcomeTitle}>
                Welcome{displayName ? `, ${displayName.split(" ")[0]}` : ""}
              </h2>
              <p className={styles.welcomeSub}>
                You're signed in as <strong>{username}</strong>. Please set a new password to activate your account.
              </p>
            </div>
          </div>

          <label className={styles.fieldLabel}>New Password</label>
          <div className={`${styles.inputWrap} ${error ? styles.inputWrapErr : ""}`}>
            <I name="lock" size={15} />
            <input
              className={styles.input}
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(""); }}
              onKeyDown={handleKey}
              placeholder="Min. 8 characters"
              autoFocus
            />
          </div>

          <label className={styles.fieldLabel}>Confirm Password</label>
          <div className={`${styles.inputWrap} ${error ? styles.inputWrapErr : ""}`}>
            <I name="lock" size={15} />
            <input
              className={styles.input}
              type="password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(""); }}
              onKeyDown={handleKey}
              placeholder="Repeat your new password"
            />
          </div>

          {error && (
            <div className={styles.errorMsg}>
              <I name="alert" size={13} /> {error}
            </div>
          )}

          <div className={styles.rules}>
            <span className={pw.length >= 8 ? styles.rulePass : styles.rulePending}>
              <I name={pw.length >= 8 ? "checkcircle" : "dot"} size={13} /> At least 8 characters
            </span>
            <span className={pw && pw === confirm ? styles.rulePass : styles.rulePending}>
              <I name={pw && pw === confirm ? "checkcircle" : "dot"} size={13} /> Passwords match
            </span>
          </div>

          <BtnPrimary
            onClick={handleSet}
            disabled={submitting}
            style={{ width: "100%", justifyContent: "center", padding: "16px 28px", fontSize: 15, marginTop: 8 }}
          >
            {submitting ? "Saving…" : "Set Password & Continue"} <I name="arrow" size={16} />
          </BtnPrimary>
        </Card>
      </div>
    </div>
  );
};
