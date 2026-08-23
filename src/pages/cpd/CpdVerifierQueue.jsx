/**
 * CpdVerifierQueue — manager-side dashboard listing every CPD activity
 * that's been submitted by a clinician and is awaiting verification.
 *
 * Powered by GET /cpd/verification-queue (backed by the partial index
 * `cpd_activity_verifier_queue_idx WHERE status = 'submitted'` — sub-10ms
 * even at scale).
 *
 * Each row shows the clinician, the source audit, the reflective notes
 * + benefit to patients + GDC outcomes the clinician declared. Verifier
 * clicks "Verify" → modal → POST /cpd/:id/verify → row disappears.
 *
 * Self-protection in the backend: a manager cannot verify their own
 * submission. UI doesn't need to enforce this — the API rejects with 403.
 */

import { useEffect, useState } from "react";
import { listVerifierQueue, verifyDraft } from "../../services/cpdActivities.api";

const GDC_OUTCOME_META = {
  A: { color: "#1565c0", label: "A · Communication" },
  B: { color: "#6a1b9a", label: "B · Management & leadership" },
  C: { color: "#2e7d32", label: "C · Knowledge" },
  D: { color: "#ef6c00", label: "D · Skills" },
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
const relativeTime = (iso) => {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "1 day ago";
  if (d < 7)   return `${d} days ago`;
  if (d < 30)  return `${Math.floor(d / 7)} wk ago`;
  return `${Math.floor(d / 30)} mo ago`;
};

export function CpdVerifierQueue() {
  const [queue,    setQueue]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [active,   setActive]   = useState(null);   // row being verified

  const load = async () => {
    try {
      setLoading(true); setError(null);
      setQueue(await listVerifierQueue());
    } catch (e) {
      // Backend returns 403 if the requester doesn't hold a verifier role —
      // surface that cleanly rather than as a generic error.
      setError(e.code === "UNAUTHORIZED" || e.message?.includes("verifier")
        ? "Only practice managers, governance leads and group admins can use this queue."
        : (e.message ?? "Could not load the verification queue"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleVerified = () => { setActive(null); load(); };

  if (loading) return <div style={{ padding: 24, color: "var(--on-surface-variant)" }}>Loading queue…</div>;
  if (error) {
    return (
      <div style={errorBoxStyle}>
        <strong>Couldn't load the queue.</strong>
        <div style={{ marginTop: 6, fontSize: 12.5 }}>{error}</div>
      </div>
    );
  }
  if (queue.length === 0) {
    return (
      <div style={emptyStyle}>
        <div style={{ fontSize: 28 }}>✓</div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Inbox zero</div>
        <div style={{ fontSize: 12.5, color: "var(--on-surface-variant)" }}>
          No CPD submissions awaiting verification right now.
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={headerStyle}>
        <div>
          <h3 style={titleStyle}>Awaiting your verification</h3>
          <p style={leadStyle}>
            {queue.length} CPD submission{queue.length === 1 ? "" : "s"} from clinicians at your sites.
            Verifying locks the record permanently for CQC inspection.
          </p>
        </div>
      </div>

      <ul style={listStyle}>
        {queue.map((a) => (
          <li key={a.id} style={rowStyle}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={rowTitleStyle}>{a.activityTitle}</div>
              <div style={rowMetaStyle}>
                <span><strong>{a.cpdHours} hr</strong> · activity {formatDate(a.activityDate)}</span>
                <span style={dotStyle}>·</span>
                <span>submitted {relativeTime(a.submittedAt)}</span>
                {a.auditSession?.template?.title && (
                  <>
                    <span style={dotStyle}>·</span>
                    <span>from “{a.auditSession.template.title}”</span>
                  </>
                )}
              </div>
              <div style={outcomesRowStyle}>
                {(a.gdcOutcomes ?? []).map((o) => (
                  <span key={o} style={{
                    ...outcomeChipStyle,
                    color: GDC_OUTCOME_META[o]?.color ?? "var(--on-surface)",
                    background: `color-mix(in srgb, ${GDC_OUTCOME_META[o]?.color ?? "var(--on-surface)"} 10%, transparent)`,
                  }}>{GDC_OUTCOME_META[o]?.label ?? o}</span>
                ))}
              </div>
            </div>
            <button type="button" style={ctaStyle} onClick={() => setActive(a)}>
              Review &amp; verify
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <VerifyModal
          activity={active}
          onCancel={() => setActive(null)}
          onVerified={handleVerified}
        />
      )}
    </>
  );
}

/* ─── Verify modal ────────────────────────────────────────────────────── */

function VerifyModal({ activity, onCancel, onVerified }) {
  const [verificationNote, setVerificationNote] = useState("");
  const [submitting,       setSubmitting]       = useState(false);
  const [error,            setError]            = useState(null);

  const handleVerify = async () => {
    try {
      setSubmitting(true); setError(null);
      await verifyDraft(activity.id, {
        verificationNote: verificationNote.trim() || undefined,
      });
      onVerified?.();
    } catch (e) {
      setError(e.message ?? "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={scrimStyle} onClick={onCancel}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <header style={modalHeadStyle}>
          <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 800, color: "#2e7d32" }}>
            Review &amp; verify CPD
          </div>
          <h3 style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700 }}>
            {activity.activityTitle}
          </h3>
          <div style={{ fontSize: 12, color: "var(--on-surface-variant)", marginTop: 4 }}>
            {activity.cpdHours} hr · submitted {relativeTime(activity.submittedAt)}
          </div>
        </header>

        <div style={modalBodyStyle}>
          <ReadOnlyField label="Reflective notes"     value={activity.reflectiveNotes} />
          <ReadOnlyField label="Benefit to patients"  value={activity.benefitToPatients} />
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>GDC outcomes claimed</label>
            <div style={outcomesRowStyle}>
              {(activity.gdcOutcomes ?? []).map((o) => (
                <span key={o} style={{
                  ...outcomeChipStyle,
                  color: GDC_OUTCOME_META[o]?.color ?? "var(--on-surface)",
                  background: `color-mix(in srgb, ${GDC_OUTCOME_META[o]?.color ?? "var(--on-surface)"} 10%, transparent)`,
                }}>{GDC_OUTCOME_META[o]?.label ?? o}</span>
              ))}
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Your verification note (optional)</label>
            <textarea value={verificationNote} onChange={(e) => setVerificationNote(e.target.value)}
              placeholder="e.g. Reflection well-supported by the audit findings. Verified."
              rows={3} style={inputStyle} />
            <span style={hintStyle}>
              Recorded in the immutable audit trail. Verification locks this entry — clinicians cannot edit it afterwards.
            </span>
          </div>

          {error && <div style={errorBoxStyle}>{error}</div>}
        </div>

        <footer style={modalFootStyle}>
          <button type="button" style={cancelBtnStyle} onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="button" style={{ ...primaryBtnStyle, opacity: submitting ? 0.5 : 1 }}
            onClick={handleVerify} disabled={submitting}>
            {submitting ? "Verifying…" : "✓ Verify and lock"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div style={fieldGroupStyle}>
      <label style={labelStyle}>{label}</label>
      <div style={readOnlyValueStyle}>{value || <em style={{ color: "var(--on-surface-variant)" }}>(empty)</em>}</div>
    </div>
  );
}

/* ─── Inline styles ───────────────────────────────────────────────────── */

const headerStyle = { marginBottom: 16 };
const titleStyle = {
  margin: 0, fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--on-surface)",
};
const leadStyle = { fontSize: 12.5, color: "var(--on-surface-variant)", marginTop: 4, maxWidth: 620, lineHeight: 1.5 };

const listStyle = { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 };
const rowStyle = {
  display: "flex", alignItems: "center", gap: 16, padding: 16,
  background: "var(--surface)", border: "1px solid var(--outline-variant)", borderRadius: 12,
};
const rowTitleStyle = { fontSize: 14, fontWeight: 700, color: "var(--on-surface)" };
const rowMetaStyle = {
  fontSize: 11.5, color: "var(--on-surface-variant)", marginTop: 4,
  display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap",
};
const dotStyle = { opacity: 0.5 };
const outcomesRowStyle = { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" };
const outcomeChipStyle = {
  padding: "2px 9px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.02em",
};
const ctaStyle = {
  appearance: "none", background: "var(--primary)", color: "var(--on-primary, white)",
  border: "none", padding: "9px 16px", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", flexShrink: 0,
};

const emptyStyle = {
  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  padding: "48px 20px", color: "var(--on-surface-variant)", textAlign: "center",
};
const errorBoxStyle = {
  padding: 12, marginBottom: 12,
  background: "color-mix(in srgb, #c62828 8%, transparent)",
  border: "1px solid color-mix(in srgb, #c62828 30%, transparent)",
  borderRadius: 8, color: "#b71c1c", fontSize: 12.5,
};

const scrimStyle = {
  position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.42)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "24px 16px", zIndex: 60, overflowY: "auto",
};
const modalStyle = {
  width: "100%", maxWidth: 580, background: "var(--surface)", borderRadius: 16,
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.24)",
  display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 48px)",
};
const modalHeadStyle = { padding: "18px 22px 14px", borderBottom: "1px solid var(--outline-variant)" };
const modalBodyStyle = { padding: "18px 22px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 };
const modalFootStyle = {
  display: "flex", gap: 10, padding: "14px 22px",
  borderTop: "1px solid var(--outline-variant)", justifyContent: "flex-end",
};
const fieldGroupStyle = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle = {
  fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase",
  fontWeight: 700, color: "var(--on-surface-variant)",
};
const inputStyle = {
  font: "inherit", fontSize: 13, padding: "9px 11px",
  border: "1px solid var(--outline-variant)", borderRadius: 8,
  background: "var(--surface)", color: "var(--on-surface)",
  resize: "vertical", fontFamily: "inherit",
};
const readOnlyValueStyle = {
  fontSize: 13, color: "var(--on-surface)", lineHeight: 1.5,
  padding: "10px 12px", background: "var(--surface-low)",
  borderRadius: 8, borderLeft: "3px solid var(--primary)",
};
const hintStyle = { fontSize: 11, color: "var(--on-surface-variant)", fontStyle: "italic", marginTop: 2 };
const cancelBtnStyle = {
  appearance: "none", background: "transparent",
  border: "1px solid var(--outline-variant)", padding: "9px 16px", borderRadius: 8,
  fontSize: 13, fontWeight: 600, color: "var(--on-surface)", cursor: "pointer",
};
const primaryBtnStyle = {
  appearance: "none", background: "#2e7d32", color: "white",
  border: "none", padding: "10px 18px", borderRadius: 8,
  fontSize: 13, fontWeight: 700, cursor: "pointer",
};
