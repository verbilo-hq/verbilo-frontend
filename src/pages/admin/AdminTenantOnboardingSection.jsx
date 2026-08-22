import { useCallback, useEffect, useState } from "react";
import {
  getTenantOnboarding,
  markHandoverComplete,
} from "../../services/onboarding.service";
import styles from "./AdminCreateTenantPage.module.css";

// VER-91: admin-side Onboarding checklist for a single tenant.
//
// Renders the four observable flags (auto-derived from tenant state) +
// the operator-toggled `handoverComplete` flag. "Mark handover complete"
// is one-way; clicking it audit-logs and ticks the final box.
//
// Capability is implicit — this section only renders inside
// AdminTenantSettingsPage, which is already gated to verbilo_super_admin
// / verbilo_support. Backend still enforces.

const CHECK_LABELS = [
  {
    key: "sitesAdded",
    label: "Sites added",
    hint: "At least one site is configured for this tenant.",
  },
  {
    key: "firstStaffInvited",
    label: "First staff invited",
    hint: "A non-bootstrap user account exists on this tenant.",
  },
  {
    key: "brandingConfigured",
    label: "Branding configured",
    hint: "Logo and primary colour are set.",
  },
  {
    key: "starterTemplatesPublished",
    label: "Starter templates published",
    hint:
      "At least one starter clinical / HR / training item has been published. (Wires up when VER-87 ships per-module publish persistence.)",
  },
  {
    key: "handoverComplete",
    label: "Handover complete",
    hint: "Operator has manually marked the tenant as handed over.",
  },
];

export const AdminTenantOnboardingSection = ({ tenantId }) => {
  const [state, setState] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [marking, setMarking] = useState(false);

  const refresh = useCallback(() => {
    setStatus("loading");
    setError(null);
    return getTenantOnboarding(tenantId)
      .then((data) => {
        setState(data);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [tenantId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleHandover = async () => {
    if (marking || state?.handoverComplete) return;
    setMarking(true);
    setError(null);
    try {
      const next = await markHandoverComplete(tenantId);
      setState(next);
    } catch (err) {
      setError(err);
    } finally {
      setMarking(false);
    }
  };

  if (status === "loading") {
    return (
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Onboarding</p>
        <p className={styles.sectionBody}>Loading onboarding state…</p>
      </section>
    );
  }

  if (status === "error" && !state) {
    return (
      <section className={styles.section}>
        <p className={styles.sectionTitle}>Onboarding</p>
        <p className={styles.submitError}>
          Couldn't load onboarding state ({error?.status ?? error?.code ?? "error"}).
        </p>
      </section>
    );
  }

  const completedAt = state?.handoverCompletedAt
    ? new Date(state.handoverCompletedAt).toLocaleString()
    : null;

  return (
    <section className={styles.section}>
      <p className={styles.sectionTitle}>Onboarding</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
        {CHECK_LABELS.map(({ key, label, hint }) => {
          const done = Boolean(state?.[key]);
          return (
            <div
              key={key}
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
                  background: done ? "var(--primary)" : "var(--surface-container)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  marginTop: 1,
                  fontWeight: 700,
                  color: "white",
                  fontSize: 12,
                }}
              >
                {done ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--on-surface)",
                    textDecoration: done ? "line-through" : "none",
                    opacity: done ? 0.7 : 1,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 12, color: "var(--on-surface-variant)", marginTop: 2 }}>
                  {hint}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p className={styles.submitError} style={{ marginTop: 10 }}>
          {error.code === "CONFLICT"
            ? "Handover is already marked complete."
            : error.code === "FORBIDDEN"
            ? "You don't have permission to mark handover."
            : `Action failed (${error.status ?? error.code ?? "error"}).`}
        </p>
      )}

      <div className={styles.actions} style={{ marginTop: 16 }}>
        {state?.handoverComplete ? (
          <p className={styles.sectionBody}>
            Handover marked complete{completedAt ? ` at ${completedAt}` : ""}.
          </p>
        ) : (
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleHandover}
            disabled={marking}
            title="Marks this tenant as fully handed over to the customer. Audit-logged."
          >
            {marking ? "Marking…" : "Mark handover complete"}
          </button>
        )}
      </div>
    </section>
  );
};
