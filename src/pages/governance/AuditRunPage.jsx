/**
 * AuditRunPage — wrapper that takes the universal AuditFormRunner from
 * mock-state-only to fully API-wired.
 *
 * Three modes, picked by what the caller passes in `entryView`:
 *   • { sessionId }                     → resume an in-progress session
 *   • { scheduleId, templateId, siteId} → start a new session against a schedule
 *   • { templateId, siteId }            → ad-hoc audit (no schedule link)
 *
 * Lifecycle:
 *   1. On mount → POST /audit-sessions or GET /audit-sessions/:id
 *   2. AuditFormRunner renders with the template + initial answers
 *   3. Each answer change → debounced PATCH /audit-sessions/:id/answers/:qid
 *      (so closing the browser mid-audit doesn't lose work)
 *   4. On Complete & Sign → final flush + POST /audit-sessions/:id/complete
 *      (Postgres trigger then locks the session and creates the CPD draft)
 *   5. onDone() callback returns the user to the Audits tab with a banner
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { AuditFormRunner, AUDIT_STATUS } from "./AuditFormRunner";
import {
  getStartContext, startSession, getSession, setAnswer, completeSession,
} from "../../services/auditSessions.api";
import { getAuditTemplate } from "../../services/governance/auditTemplates";
import { getSite } from "../../services/governance/sites.service";
import { createAuditRun } from "../../services/governance/auditRuns.service";

/* ─── Offline session builder ─────────────────────────────────────────
 * Synthesises the same payload shape that GET /audit-sessions/:id returns
 * but sourced entirely from the frontend's auditTemplates.js + the local
 * sites Store. Used when the API is unreachable so the UI stays demoable.
 * The submit-path branches on `offlineMode` to write to localStorage via
 * createAuditRun instead of POSTing /complete. */
function buildOfflineSession({ user, entryView, activeSite }) {
  const tpl = getAuditTemplate(entryView.auditTypeId);
  if (!tpl) return null;
  // Site resolution priority:
  //   1. activeSite (the header dropdown's currently-selected site, so
  //      "viewing as Brighton" flows into the audit header)
  //   2. Store lookup by entryView.siteId (the schedule's bound site)
  //   3. Placeholder so the form still renders
  const site = activeSite
    ?? (user && entryView.siteId ? getSite(user.tenantId, entryView.siteId) : null);
  return {
    id:           `offline-${crypto.randomUUID()}`,
    status:       'in_progress',
    startedAt:    new Date().toISOString(),
    completedAt:  null,
    signedAt:     null,
    lockedAt:     null,
    passCount: 0, failCount: 0, naCount: 0,
    site:    site ? { id: site.id, name: site.name, location: site.location ?? null }
                  : { id: entryView.siteId ?? null, name: '(unknown site)', location: null },
    auditor: user ? { id: user.id, displayName: user.displayName ?? '' }
                  : { id: null, displayName: '' },
    template: {
      id:               tpl.id,
      title:            tpl.title,
      focus:            tpl.focus ?? null,
      regulatorPrimary: tpl.regulatorPrimary ?? null,
      cpdEligible:      false,        // offline doesn't trigger backend CPD draft
    },
    questions: tpl.questions.map((q, i) => ({
      id:           `offline-q-${tpl.id}-${i}`,
      questionKey:  q.id,
      sequence:     i + 1,
      text:         q.text,
      regulatorRef: q.regulatorRef ?? null,
      failGuidance: q.failGuidance ?? null,
      answer:       null,
    })),
  };
}

/* ─── SHA-256 helper for the signature hash ───────────────────────────── */

async function sha256Hex(payload) {
  const enc = new TextEncoder().encode(JSON.stringify(payload));
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Browser governance fixtures use stable site/audit keys for display. Resolve
 * those once through the authenticated API and send only real tenant-scoped
 * UUIDs to the mutation endpoint.
 */
async function resolveStartEntry(entryView) {
  if (UUID_RE.test(entryView.siteId ?? "") &&
      (!entryView.scheduleId || UUID_RE.test(entryView.scheduleId))) {
    return entryView;
  }

  const context = await getStartContext();
  const site = context.sites.find(
    (candidate) => candidate.referenceKey === entryView.siteId,
  );
  if (!site) {
    throw new Error(`No API site mapping is configured for ${entryView.siteId}.`);
  }
  const schedule = context.schedules.find(
    (candidate) => candidate.siteId === site.id &&
      candidate.auditTypeId === entryView.auditTypeId &&
      candidate.packKey === entryView.packKey,
  );
  if (entryView.scheduleId && !schedule) {
    throw new Error(
      `No API audit schedule is configured for ${entryView.packKey}/${entryView.auditTypeId}.`,
    );
  }
  return {
    ...entryView,
    siteId: site.id,
    scheduleId: schedule?.id,
  };
}

/* ─── Debounce helper — fires the fn 500ms after the last call per key ──
 * Why per-key: each question id is debounced independently so rapid edits
 * to question 3 don't delay the save of question 1. */
function useDebouncedSave(fn, ms = 500) {
  const timers = useRef({});
  return (key, ...args) => {
    if (timers.current[key]) clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => fn(...args), ms);
  };
}

/* ─── Root component ──────────────────────────────────────────────────── */

export function AuditRunPage({ user, entryView, activeSite, onDone, onCancel }) {
  // session shape mirrors what AuditSessionDetailResponse returns
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [saving,  setSaving]  = useState(false);
  // On successful submission we stash a small summary here and render a
  // celebration modal. Dismissing the modal calls onDone() so the parent
  // returns to the Audits tab.
  const [completedInfo, setCompletedInfo] = useState(null);
  // When true, the backend wasn't reachable / returned an error and we
  // fell back to a frontend-only synthetic session. submit will write to
  // localStorage via createAuditRun instead of POST /complete.
  const [offlineMode, setOfflineMode] = useState(false);

  /* Initial load — try the API first, fall back to local templates
   * (offline mode) on any failure so the UI stays demoable even when
   * the backend isn't fully wired or has crashed. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true); setError(null); setOfflineMode(false);
        // Three entry shapes:
        //   { sessionId }            → resume
        //   { templateId, siteId }   → start with a known UUID
        //   { auditTypeId, packKey,
        //     siteId, scheduleId? }  → start via the (auditType, pack) pair
        //                              — used by AuditsPage which only
        //                              knows local string IDs.
        const s = entryView.sessionId
          ? await getSession(entryView.sessionId)
          : await resolveStartEntry(entryView).then((resolved) => startSession({
              templateId:  resolved.templateId,
              auditTypeId: resolved.auditTypeId,
              packKey:     resolved.packKey,
              siteId:      resolved.siteId,
              scheduleId:  resolved.scheduleId,
            }));
        if (!cancelled) setSession(s);
      } catch (e) {
        // ── Backend-not-reachable fallback ───────────────────────────
        // Synthesise a session payload from the local auditTemplates.js
        // file + the local sites Store. UI renders the same form; only
        // submit changes path (localStorage write instead of POST).
        const localSession = import.meta.env.DEV
          ? buildOfflineSession({ user, entryView, activeSite })
          : null;
        if (!cancelled) {
          if (localSession) {
            console.warn('[AuditRunPage] Backend unavailable, falling back to offline mode.', e?.message);
            setOfflineMode(true);
            setSession(localSession);
          } else {
            // Couldn't even build offline (e.g. unknown auditTypeId) —
            // surface the real error so we at least know why.
            setError(e?.message || "Failed to load audit");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [
    entryView.sessionId,
    entryView.templateId,
    entryView.auditTypeId,
    entryView.packKey,
    entryView.siteId,
    entryView.scheduleId,
    activeSite,
    user,
  ]);

  /* Map API session shape → AuditFormRunner's expected `template` +
   * `initialResponses` props. The runner already groups everything off
   * the template's questions[] array; we just need to convert the API's
   * { id, questionKey, sequence, text, answer? } into the runner's
   * question + response shapes. */
  const { template, initialResponses } = useMemo(() => {
    if (!session) return { template: null, initialResponses: {} };
    const t = {
      id:              session.template.id,
      title:           session.template.title,
      focus:           session.template.focus,
      regulatorPrimary: session.template.regulatorPrimary,
      version:         1,                          // not displayed; runner expects field
      // Map question shapes to what the runner reads.
      questions: session.questions.map((q) => ({
        id:           q.id,                        // runner uses this as the response key
        text:         q.text,
        input_type:   "pass_fail_na",
        regulatorRef: q.regulatorRef,
        failGuidance: q.failGuidance,
      })),
    };
    const r = {};
    for (const q of session.questions) {
      if (!q.answer) continue;
      r[q.id] = {
        status:         q.answer.status,
        actionRequired: q.answer.actionRequired ?? "",
        photoCount:     q.answer.photoCount ?? 0,
      };
    }
    return { template: t, initialResponses: r };
  }, [session]);

  /* Per-answer auto-save. Wraps setAnswer in a debounce so rapid toggles
   * don't hammer the API; saves on each "settled" change instead. */
  const debouncedSave = useDebouncedSave(async (sessionId, questionId, payload) => {
    try {
      setSaving(true);
      await setAnswer(sessionId, questionId, payload);
    } catch (e) {
      console.error("Failed to save answer", e);
      // Soft-fail — local state continues; final completeSession will retry.
    } finally {
      setSaving(false);
    }
  }, 500);

  /* Per-answer incremental save. In online mode, debounced PATCH to the
   * API. In offline mode, no-op — we keep all state in AuditFormRunner's
   * own React state until Complete & Sign writes the whole run at once. */
  const handleAnswerChange = (questionId, { status, actionRequired }) => {
    if (!session || !status) return;
    if (offlineMode) return;                    // no API to talk to; state lives in the runner
    debouncedSave(questionId, session.id, questionId, {
      status,
      actionRequired: actionRequired ?? undefined,
    });
  };

  /* Sign-off — two paths:
   *   online  → final-flush PATCH each answer + POST /complete; DB trigger
   *             locks the session and creates the CPD draft.
   *   offline → write the whole run to localStorage via createAuditRun,
   *             which advances the linked AuditSchedule's nextDueDate the
   *             same way the legacy browser-backed audit flow did. */
  const handleSubmit = async (payload) => {
    if (!session) return;
    try {
      setSaving(true);

      if (import.meta.env.DEV && offlineMode) {
        // Re-shape the runner payload back into the createAuditRun shape
        // used by the browser-backed demo. createAuditRun handles the
        // localStorage persistence + audit_trail log + schedule advance.
        const localPayload = {
          ...payload,
          templateId: session.template.id,
          // Map our offline-q-... keys back to the questionKeys
          // (q_hand_01 etc) so the saved run aligns with the master
          // template's stable question IDs.
          responses: Object.fromEntries(
            Object.entries(payload.responses).map(([qId, r]) => {
              const q = session.questions.find((x) => x.id === qId);
              return [q?.questionKey ?? qId, r];
            }),
          ),
        };
        createAuditRun(user, localPayload, {
          scheduleId: entryView.scheduleId ?? null,
          packKey:    entryView.packKey ?? null,
        });
        // Show the celebration modal first; user dismissal calls onDone.
        setCompletedInfo({
          sessionId:     session.id,
          templateTitle: session.template.title,
          siteName:      session.site?.name ?? '(unknown site)',
          summary:       payload.summary,
          offline:       true,
        });
        return;
      }

      // ── Online path ─────────────────────────────────────────────────
      // Final flush — handles the case where the last keystroke hasn't
      // yet flushed through the 500ms debounce. Cheap (idempotent PATCH).
      for (const [qId, r] of Object.entries(payload.responses)) {
        await setAnswer(session.id, qId, {
          status:         r.status,
          actionRequired: r.actionRequired ?? undefined,
        });
      }
      const signatureHash = await sha256Hex({
        sessionId: session.id,
        responses: payload.responses,
        summary:   payload.summary,
        signedAt:  payload.completedAt,
      });
      await completeSession(session.id, { signatureHash });
      setCompletedInfo({
        sessionId:     session.id,
        templateTitle: session.template.title,
        siteName:      session.site?.name ?? '(unknown site)',
        summary:       payload.summary,
        cpdDraftMade:  session.template.cpdEligible,
      });
    } catch (e) {
      setError(`Could not complete audit: ${e.message ?? "request failed"}`);
    } finally {
      setSaving(false);
    }
  };

  /* ─── Render states ─────────────────────────────────────────────────── */

  if (loading) {
    return <div style={{ padding: 24, color: "var(--on-surface-variant)" }}>Loading audit…</div>;
  }
  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{
          padding: 16, background: "color-mix(in srgb, #c62828 8%, transparent)",
          border: "1px solid color-mix(in srgb, #c62828 30%, transparent)",
          borderRadius: 10, color: "#b71c1c", fontSize: 14,
        }}>
          <strong>Couldn't load this audit.</strong>
          <div style={{ marginTop: 6, fontSize: 12.5 }}>{error}</div>
          <button onClick={onCancel} style={{
            marginTop: 12, padding: "6px 12px", border: "1px solid #c62828",
            background: "transparent", color: "#c62828", borderRadius: 6,
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Back to audits</button>
        </div>
      </div>
    );
  }
  if (!session || !template) return null;

  return (
    <>
      <AuditFormRunner
        template={template}
        site={session.site}
        auditor={session.auditor}
        initialResponses={initialResponses}
        onAnswerChange={handleAnswerChange}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
      {completedInfo && (
        <AuditCompletedModal
          info={completedInfo}
          onClose={() => {
            setCompletedInfo(null);
            onDone?.(completedInfo);
          }}
        />
      )}
    </>
  );
}

/* ─── Completion modal ────────────────────────────────────────────────── */

function AuditCompletedModal({ info, onClose }) {
  const summary = info.summary ?? { pass: 0, fail: 0, na: 0, total: 0 };
  return (
    <div style={scrimStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={badgeStyle}>OK</div>
        <h2 style={titleStyle}>Audit Successfully Finalised!</h2>
        <p style={leadStyle}>
          This signed record has been filed to the <strong>Audit &amp; Evidence Ledger</strong> for{" "}
          <strong>{info.siteName}</strong>.
        </p>
        <div style={summaryStyle}>
          <span><strong>{summary.pass}</strong> pass</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span><strong>{summary.fail}</strong> fail</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span><strong>{summary.na}</strong> N/A</span>
        </div>
        <div style={metaRowStyle}>{info.templateTitle}</div>
        {info.cpdDraftMade && (
          <div style={cpdHintStyle}>
            A draft CPD entry has been auto-created in your CPD Hub awaiting your reflection.
          </div>
        )}
        {import.meta.env.DEV && info.offline && (
          <div style={offlineHintStyle}>
            Saved locally (offline mode).
          </div>
        )}
        <button type="button" style={closeBtnStyle} onClick={onClose}>
          Return to Audits
        </button>
      </div>
    </div>
  );
}

/* ─── Modal styles (inline — page-local, ~8 rules) ────────────────────── */

const scrimStyle = {
  position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.5)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: 24, zIndex: 70,
  animation: "fadeIn 0.18s ease-out",
};
const modalStyle = {
  width: "100%", maxWidth: 460, background: "var(--surface)",
  borderRadius: 16, padding: "32px 28px 24px", textAlign: "center",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.28)",
};
const badgeStyle = {
  width: 56, height: 56, borderRadius: "50%",
  background: "color-mix(in srgb, #2e7d32 14%, transparent)",
  color: "#1b5e20",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  fontSize: 22, fontWeight: 800, marginBottom: 14,
};
const titleStyle = {
  margin: "0 0 8px", fontFamily: "var(--font-display)",
  fontSize: 20, fontWeight: 800, color: "var(--on-surface)",
};
const leadStyle = {
  fontSize: 13.5, color: "var(--on-surface-variant)",
  lineHeight: 1.55, margin: "0 0 18px",
};
const summaryStyle = {
  display: "inline-flex", gap: 10, alignItems: "center",
  padding: "10px 16px", background: "var(--surface-low)",
  borderRadius: 999, fontSize: 13, color: "var(--on-surface)",
  marginBottom: 8,
};
const metaRowStyle = {
  fontSize: 11.5, color: "var(--on-surface-variant)",
  letterSpacing: "0.04em", textTransform: "uppercase",
  marginBottom: 14,
};
const cpdHintStyle = {
  fontSize: 12, color: "var(--primary)",
  padding: "8px 14px", background: "color-mix(in srgb, var(--primary) 8%, transparent)",
  borderRadius: 8, marginBottom: 14, fontStyle: "italic",
};
const offlineHintStyle = {
  fontSize: 11, color: "var(--on-surface-variant)",
  marginBottom: 14, fontStyle: "italic",
};
const closeBtnStyle = {
  appearance: "none", background: "var(--primary)", color: "var(--on-primary, white)",
  border: "none", padding: "11px 26px", borderRadius: 10,
  font: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer",
};
