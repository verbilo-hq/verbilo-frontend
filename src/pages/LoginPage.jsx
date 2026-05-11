import { useState } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnPrimary } from "../components/ui/Buttons";
import { useAuth } from "../auth/AuthContext";
import styles from "./LoginPage.module.css";

export const LoginPage = ({ onLoggedIn }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      onLoggedIn?.();
    } catch (e) {
      setError(e.code === "UNAUTHORIZED" ? "Username or password is incorrect." : "Sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !submitting) handleSignIn(); };

  return (
    <div className={styles.page}>
      <div className={`${styles.blob} ${styles.blobTopRight}`} />
      <div className={`${styles.blob} ${styles.blobBottomLeft}`} />

      <div className={styles.shell}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <I name="tooth" size={32} color="var(--on-primary)" />
          </div>
          <h1 className={styles.brandTitle}>
            <span className={styles.brandTitleEm}>Ver</span>bilo
          </h1>
          <p className={styles.brandTagline}>Built for multi-site healthcare operators</p>
          <div className={styles.brandRule} />
        </div>

        <Card hover={false} style={{ padding: "40px 36px" }}>
          {/* Username */}
          <label className={styles.fieldLabel}>Username</label>
          <div className={`${styles.inputWrap} ${error ? styles.inputWrapErr : ""}`}>
            <I name="person" size={15} />
            <input
              className={styles.input}
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={handleKey}
              placeholder="e.g. s.jenkins"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className={styles.passwordHeader}>
            <label className={styles.passwordLabel}>Password</label>
          </div>
          <div className={`${styles.inputWrap} ${error ? styles.inputWrapErr : ""}`}>
            <I name="lock" size={15} />
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKey}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* Error */}
          {error && (
            <div className={styles.errorMsg}>
              <I name="alert" size={13} /> {error}
            </div>
          )}

          <label className={styles.rememberRow}>
            <input
              type="checkbox"
              className={styles.rememberCheckbox}
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <span className={styles.rememberLabel}>Remember my session</span>
          </label>

          <BtnPrimary
            onClick={handleSignIn}
            disabled={submitting}
            style={{ width: "100%", justifyContent: "center", padding: "16px 28px", fontSize: 15 }}
          >
            {submitting ? "Signing in…" : "Sign In"} <I name="arrow" size={16} />
          </BtnPrimary>

          <div className={styles.divider}>
            <p className={styles.dividerText}>
              <I name="lock" size={13} /> New staff? Contact your Practice Manager to request access.
            </p>
          </div>
        </Card>

        <div className={styles.footer}>
          <p className={styles.footerHeading}>Authorised Personnel Only</p>
          <div className={styles.statusPill}>
            <div className={styles.statusDot} />
            <span className={styles.statusLabel}>System Status: Fully Operational</span>
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} Verbilo Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
