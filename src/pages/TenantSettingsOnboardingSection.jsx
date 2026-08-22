import { useEffect, useState } from "react";
import { getMyOnboardingActions } from "../services/onboarding.service";
import styles from "./admin/AdminCreateTenantPage.module.css";

// VER-91 (follow-up): tenant-surface read-only onboarding checklist.
//
// Mirrors the dashboard's SetupChecklist widget but parked under
// Settings so admins/owners who want to see their progress in a
// structured place can. Reads from /users/me/onboarding-actions
// (the user-facing endpoint — same shape as the dashboard widget).
//
// No "Mark handover complete" button — that's an operator-only
// concept and lives in the Verbilo admin portal (VER-91 admin
// section). Customer admins shouldn't even know about it.
export const TenantSettingsOnboardingSection = () => {
  const [actions, setActions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getMyOnboardingActions()
      .then((data) => {
        if (cancelled) return;
        setActions(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setActions([]);
      });
    return () => { cancelled = true; };
  }, []);

  // Don't render at all for platform actors or fully-onboarded tenants
  // (both return empty action lists). Saves a card slot on the page.
  if (actions !== null && actions.length === 0) return null;

  return (
    <section className={styles.section}>
      <p className={styles.sectionTitle}>Onboarding</p>
      <p className={styles.sectionBody} style={{ marginTop: 4, marginBottom: 12 }}>
        A short list of things that'll make Verbilo more useful for your team.
      </p>

      {actions === null ? (
        <p className={styles.sectionBody}>Loading…</p>
      ) : error ? (
        <p className={styles.submitError}>
          Couldn't load onboarding state ({error?.status ?? error?.code ?? "error"}).
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {actions.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "12px 0",
                borderTop: "1px solid var(--outline-variant)",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: item.done ? "var(--primary)" : "var(--surface-container)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  marginTop: 1,
                  fontWeight: 700,
                  color: "white",
                  fontSize: 12,
                }}
              >
                {item.done ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--on-surface)",
                    textDecoration: item.done ? "line-through" : "none",
                    opacity: item.done ? 0.7 : 1,
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--on-surface-variant)", marginTop: 2 }}>
                  {item.hint}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
