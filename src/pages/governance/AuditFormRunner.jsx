/**
 * AuditFormRunner — universal audit execution UI.
 *
 * Consumes one audit template from `auditTemplates.js` and renders the
 * full pass / fail / N/A scoring screen. Every audit in every pack reuses
 * this same component — adding a new audit means seeding a new template,
 * not shipping a new page.
 *
 * Contract (props):
 *   • template        Required. AuditTemplate from auditTemplates.js
 *                     (id, title, focus, questions[], regulatorPrimary, …).
 *   • site            Required. { id, name, location? } — site this audit
 *                     run is scoped to. Surfaced in the sticky header.
 *   • auditor         Required. { id, displayName } — the user running
 *                     the audit. Passed to the submission payload so the
 *                     handler can stamp the audit_runs row.
 *   • initialResponses Optional. Pre-filled answers for resume / re-edit
 *                     flows. Shape:
 *                       { [questionId]: { status, actionRequired, photoCount } }
 *   • onSubmit        Required. Called when the user clicks
 *                     "Complete & Sign". Signature:
 *                       (payload) => void
 *                     payload = {
 *                       templateId, templateVersion, siteId, auditorId,
 *                       startedAt, completedAt,
 *                       responses: { [qId]: { status, actionRequired, photoCount } },
 *                       summary: { pass, fail, na, total },
 *                     }
 *   • onCancel        Optional. "Cancel" footer button — no-op if omitted.
 *   • onAddPhoto      Optional. (questionId, file) => void hook that fires
 *                     when the user picks a photo. Returns the new photo
 *                     count for that question (mock: increments by 1 here
 *                     since file storage lives outside this component).
 *
 * Out of scope (deliberate):
 *   • E-signature capture — the brief said "Complete & Sign", but the
 *     signature canvas / typed-name affidavit lives on the next screen.
 *     onSubmit fires; the parent decides what "sign" means.
 *   • Photo upload pipeline — onAddPhoto fires with the File; storage,
 *     compression, EXIF strip etc. is the caller's job. We just maintain
 *     the per-question counter for the badge.
 *   • Persistence — this component is stateless across sessions. Wrap it
 *     in a parent that hydrates initialResponses from IndexedDB / API if
 *     resume-mid-audit is needed.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { I } from "../../components/Icon";
import styles from "./AuditFormRunner.module.css";

/** Status values match the schema's `input_type: pass_fail_na`. Keep these
 *  string literals — they're persisted into audit_responses and reading
 *  evidence packs out 7 years from now must still decode them. */
export const AUDIT_STATUS = Object.freeze({
  pass: "pass",
  fail: "fail",
  na:   "na",
});

const STATUS_META = {
  [AUDIT_STATUS.pass]: { label: "Pass", icon: "check",   cardClass: "cardPass", segClass: "segBtnPass" },
  [AUDIT_STATUS.fail]: { label: "Fail", icon: "alert",   cardClass: "cardFail", segClass: "segBtnFail" },
  [AUDIT_STATUS.na]:   { label: "N/A",  icon: "minus",   cardClass: "cardNA",   segClass: "segBtnNA"   },
};

export function AuditFormRunner({
  template,
  site,
  auditor,
  initialResponses = {},
  onSubmit,
  onCancel,
  onAddPhoto,
  /** Per-answer change hook for incremental persistence. Fires on every
   *  status toggle AND every keystroke in Action Required. The parent is
   *  responsible for debouncing if it wants to coalesce rapid edits.
   *  Signature: (questionId, { status, actionRequired }) => void
   *  Optional — when omitted, the form keeps state in memory until onSubmit. */
  onAnswerChange,
}) {
  /* Per-question response state.
   * Shape: { [questionId]: { status, actionRequired, photoCount } }
   *
   * Why we keep `actionRequired` even when the user toggles back to Pass:
   * if they accidentally clicked Fail and typed a note, then switched to
   * Pass, the note is preserved in case they toggle Fail again. Persisted
   * payload strips this for non-Fail rows so only relevant notes save. */
  const [responses, setResponses] = useState(initialResponses);

  /* Capture the audit start time on first render so the audit_runs row
   * has a defensible startedAt timestamp. useRef survives re-renders
   * without re-firing; useState would too but burns an extra render. */
  const startedAt = useRef(new Date().toISOString()).current;

  /* Hidden file inputs — one per question, ref-mapped by question id so
   * "Add Photo Evidence" clicks the right input. */
  const fileInputRefs = useRef({});

  const setStatus = (qId, status) => {
    setResponses((prev) => {
      const existing = prev[qId] ?? {};
      const next = { ...prev, [qId]: { ...existing, status } };
      // Fire-and-forget incremental save. Parent decides whether to debounce.
      onAnswerChange?.(qId, {
        status,
        actionRequired: existing.actionRequired,
      });
      return next;
    });
  };

  const setActionRequired = (qId, value) => {
    setResponses((prev) => {
      const existing = prev[qId] ?? {};
      const next = { ...prev, [qId]: { ...existing, actionRequired: value } };
      onAnswerChange?.(qId, {
        status:         existing.status,
        actionRequired: value,
      });
      return next;
    });
  };

  /* Setters for the two new logbook input types — numeric (with min/max
   * threshold checking) and free-text. Both are independent of `status`;
   * the response object carries them as their own keys so we can mix
   * pass/fail/na cards with numeric/text cards in the same template. */
  const setNumericValue = (qId, value) => {
    setResponses((prev) => {
      const existing = prev[qId] ?? {};
      return { ...prev, [qId]: { ...existing, numericValue: value } };
    });
  };
  const setTextValue = (qId, value) => {
    setResponses((prev) => {
      const existing = prev[qId] ?? {};
      return { ...prev, [qId]: { ...existing, textValue: value } };
    });
  };

  const handlePhotoChange = (qId, fileList) => {
    if (!fileList || fileList.length === 0) return;
    const newCount = (responses[qId]?.photoCount ?? 0) + fileList.length;
    setResponses((prev) => {
      const existing = prev[qId] ?? {};
      return { ...prev, [qId]: { ...existing, photoCount: newCount } };
    });
    // Hand each File off to the parent (or noop if no handler wired).
    if (onAddPhoto) {
      Array.from(fileList).forEach((f) => onAddPhoto(qId, f));
    }
  };

  /* Tally — recomputed every render but it's O(n) over 5–10 questions so
   * memoisation would cost more than it saves. */
  /* Universal answered-check across the 3 input types. A question is
   * "answered" when:
   *   • pass_fail_na     → status is set
   *   • numeric_threshold → numericValue is a number (in or out of bounds)
   *   • text              → textValue is non-empty trimmed */
  const isAnswered = (q, r) => {
    if (!r) return false;
    if (q.input_type === "numeric_threshold") {
      return r.numericValue !== undefined && r.numericValue !== "" && !Number.isNaN(Number(r.numericValue));
    }
    if (q.input_type === "text") {
      return !!(r.textValue ?? "").trim();
    }
    return !!r.status;
  };

  const totals = useMemo(() => {
    const out = { total: template.questions.length, pass: 0, fail: 0, na: 0, answered: 0 };
    for (const q of template.questions) {
      const r = responses[q.id];
      if (!isAnswered(q, r)) continue;
      out.answered += 1;
      if (q.input_type === "pass_fail_na") {
        if (r.status === AUDIT_STATUS.pass) out.pass += 1;
        else if (r.status === AUDIT_STATUS.fail) out.fail += 1;
        else if (r.status === AUDIT_STATUS.na) out.na += 1;
      }
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses, template.questions]);

  const allComplete = totals.answered === totals.total;
  const progressPct = Math.round((totals.answered / Math.max(totals.total, 1)) * 100);

  /* Soft validation: Fail rows need an action note; numeric_threshold
   * values must be within min/max bounds before submission. */
  const failsMissingActions = useMemo(
    () => template.questions.filter((q) => {
      const r = responses[q.id];
      return r?.status === AUDIT_STATUS.fail && !(r?.actionRequired ?? "").trim();
    }),
    [responses, template.questions],
  );
  const criticalThresholdBreaches = useMemo(
    () => template.questions.filter((q) => {
      if (q.input_type !== "numeric_threshold") return false;
      const v = Number(responses[q.id]?.numericValue);
      if (Number.isNaN(v)) return false;
      return v < q.min || v > q.max;
    }),
    [responses, template.questions],
  );
  const canSubmit = allComplete
    && failsMissingActions.length === 0
    && criticalThresholdBreaches.length === 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // Strip transient UI state from the payload — only persist Fail-row
    // action notes; for Pass / N/A rows the note is irrelevant context.
    const cleaned = {};
    for (const q of template.questions) {
      const r = responses[q.id];
      if (!r) continue;
      cleaned[q.id] = {
        status:      r.status,
        actionRequired: r.status === AUDIT_STATUS.fail ? (r.actionRequired ?? "").trim() : null,
        photoCount:  r.photoCount ?? 0,
      };
    }
    onSubmit({
      templateId:      template.id,
      templateVersion: template.version,
      siteId:          site?.id ?? null,
      auditorId:       auditor?.id ?? null,
      startedAt,
      completedAt:     new Date().toISOString(),
      responses:       cleaned,
      summary: {
        pass:  totals.pass,
        fail:  totals.fail,
        na:    totals.na,
        total: totals.total,
      },
    });
  };

  /* When the user un-toggles Fail, drop the stale action_required value
   * after a short delay so the slide-out animation has time to play out. */
  useEffect(() => {
    /* no cleanup needed — kept for future "warn on unload if dirty" hook */
  }, [responses]);

  return (
    <div className={styles.runner}>
      <StickyHeader template={template} site={site} totals={totals} progressPct={progressPct} />

      <div className={styles.body}>
        {template.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            seq={i + 1}
            response={responses[q.id]}
            onSetStatus={(status) => setStatus(q.id, status)}
            onSetActionRequired={(v) => setActionRequired(q.id, v)}
            onSetNumeric={(v) => setNumericValue(q.id, v)}
            onSetText={(v) => setTextValue(q.id, v)}
            onPickPhoto={(fileList) => handlePhotoChange(q.id, fileList)}
            fileInputRefs={fileInputRefs}
          />
        ))}
      </div>

      <StickyFooter
        totals={totals}
        canSubmit={canSubmit}
        allComplete={allComplete}
        failsMissingActions={failsMissingActions}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

/* ─── Sticky top header ──────────────────────────────────────────────── */

function StickyHeader({ template, site, totals, progressPct }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerMain}>
        <div className={styles.headerEyebrow}>{template.regulatorPrimary ?? "Audit"}</div>
        <h1 className={styles.headerTitle}>{template.title}</h1>
        <div className={styles.headerSub}>
          {site && (
            <>
              <I name="map" size={11} color="var(--on-surface-variant)" />
              <span>{site.name}{site.location ? ` · ${site.location}` : ""}</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.headerProgress}>
        <span className={styles.headerProgressLabel}>
          {totals.answered} of {totals.total} completed
        </span>
        <div className={styles.headerProgressTrack} role="progressbar"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct}>
          <div className={styles.headerProgressFill} style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </header>
  );
}

/* ─── Question card ──────────────────────────────────────────────────── */

function QuestionCard({ question, seq, response, onSetStatus, onSetActionRequired, onSetNumeric, onSetText, onPickPhoto, fileInputRefs }) {
  const inputType = question.input_type ?? "pass_fail_na";
  const status = response?.status ?? null;
  const isFail = status === AUDIT_STATUS.fail;
  const meta   = status ? STATUS_META[status] : null;
  const photoCount = response?.photoCount ?? 0;

  // Numeric-threshold validation drives both the input styling and the
  // critical alert banner.
  let numericBreach = false;
  if (inputType === "numeric_threshold" && response?.numericValue !== undefined && response?.numericValue !== "") {
    const v = Number(response.numericValue);
    if (!Number.isNaN(v)) numericBreach = v < question.min || v > question.max;
  }

  let cardClass = styles.card;
  if (numericBreach) cardClass = `${styles.card} ${styles.cardFail}`;
  else if (meta) cardClass = `${styles.card} ${styles[meta.cardClass]}`;

  return (
    <section className={cardClass} aria-labelledby={`q-${question.id}`}>
      <div className={styles.cardHead}>
        <span className={styles.seq}>{String(seq).padStart(2, "0")}</span>
        <div className={styles.cardMain}>
          <div id={`q-${question.id}`} className={styles.questionText}>{question.text}</div>
          {question.regulatorRef && (
            <span className={styles.regulatorRef}>
              <I name="info" size={10} color="var(--primary)" />
              {question.regulatorRef}
            </span>
          )}
        </div>
      </div>

      {inputType === "pass_fail_na" && (
        <Segmented questionId={question.id} value={status} onChange={onSetStatus} />
      )}
      {inputType === "numeric_threshold" && (
        <NumericThresholdInput
          question={question}
          value={response?.numericValue ?? ""}
          breach={numericBreach}
          onChange={onSetNumeric}
        />
      )}
      {inputType === "text" && (
        <TextInput
          question={question}
          value={response?.textValue ?? ""}
          onChange={onSetText}
        />
      )}

      {/* Critical out-of-bounds banner — replaces the action-required slot
       * for numeric_threshold questions. Quotes the threshold message
       * verbatim from the template so the regulatory tone is preserved. */}
      {numericBreach && (
        <div className={styles.criticalBanner} role="alert">
          <span className={styles.criticalBannerIcon}>!</span>
          <div>
            <strong>CRITICAL OUT OF BOUNDS</strong>
            <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.45 }}>
              {question.criticalThresholdMessage ??
                `Value outside safe range (${question.min}-${question.max}${question.unit ? ' ' + question.unit : ''}). Escalate to the Practice Manager immediately.`}
            </div>
          </div>
        </div>
      )}

      {/* Photo + Action Required only make sense for pass_fail_na cards.
       * Numeric and text logbook entries are self-contained: the value
       * (or the breach banner) is the evidence. */}
      {inputType === "pass_fail_na" && (
        <>
          <div className={styles.cardActions}>
            <button
              type="button"
              className={styles.photoBtn}
              onClick={() => fileInputRefs.current[question.id]?.click()}
            >
              <I name="camera" size={12} />
              Add Photo Evidence
              {photoCount > 0 && <span className={styles.photoCount}>{photoCount}</span>}
            </button>
            {/* Hidden multi-file input — surfaced by clicking the button above. */}
            <input
              ref={(el) => { if (el) fileInputRefs.current[question.id] = el; }}
              type="file"
              accept="image/*"
              capture="environment"   /* opens rear camera on mobile */
              multiple
              hidden
              onChange={(e) => onPickPhoto(e.target.files)}
            />
          </div>

          {/* Slide-out Action Required — pure CSS grid-row animation, no JS height. */}
          <div className={`${styles.actionRequired} ${isFail ? styles.actionRequiredOpen : ""}`}
            aria-hidden={!isFail}>
            <div className={styles.actionRequiredInner}>
              <label className={styles.actionLabel} htmlFor={`action-${question.id}`}>
                <I name="alert" size={11} color="#c62828" />
                Action Required
              </label>
              <textarea
                id={`action-${question.id}`}
                className={styles.actionInput}
                value={response?.actionRequired ?? ""}
                onChange={(e) => onSetActionRequired(e.target.value)}
                placeholder={question.failGuidance ?? "Describe the non-conformance and the corrective action with owner + due date."}
                disabled={!isFail}
              />
              {question.failGuidance && (
                <div className={styles.actionHint}>{question.failGuidance}</div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* ─── Numeric threshold input ─────────────────────────────────────────────
 * Logbook entries with a regulatory min/max (e.g. vaccine fridge 2-8 °C).
 * Reads the threshold off the question and turns red on out-of-bounds. */

function NumericThresholdInput({ question, value, breach, onChange }) {
  return (
    <div className={styles.numericRow}>
      <div className={styles.numericField}>
        <input
          type="number"
          inputMode="decimal"
          step="any"
          className={`${styles.numericInput} ${breach ? styles.numericInputBreach : ""}`}
          value={value}
          placeholder={question.placeholder ?? "Enter reading"}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={breach || undefined}
        />
        {question.unit && <span className={styles.numericUnit}>{question.unit}</span>}
      </div>
      <div className={styles.numericMeta}>
        Safe range: <strong>{question.min}{question.unit ? ` ${question.unit}` : ""}</strong>
        {" to "}
        <strong>{question.max}{question.unit ? ` ${question.unit}` : ""}</strong>
      </div>
    </div>
  );
}

/* ─── Free-text input ─────────────────────────────────────────────────────
 * For logbook fields like "Operator initials" or "Cycle reference". No
 * validation beyond non-empty — that's already enforced by isAnswered(). */

function TextInput({ question, value, onChange }) {
  return (
    <input
      type="text"
      className={styles.textInput}
      value={value}
      placeholder={question.placeholder ?? "Enter value"}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* ─── Segmented Pass / Fail / N/A control ────────────────────────────── */

function Segmented({ questionId, value, onChange }) {
  return (
    <div className={styles.segmented} role="radiogroup" aria-label={`Response for question ${questionId}`}>
      {[AUDIT_STATUS.pass, AUDIT_STATUS.fail, AUDIT_STATUS.na].map((s) => {
        const meta = STATUS_META[s];
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${styles.segBtn} ${styles[meta.segClass]} ${active ? styles.segBtnActive : ""}`}
            onClick={() => onChange(s)}
          >
            <I name={meta.icon} size={11} color="currentColor" />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Sticky footer ──────────────────────────────────────────────────── */

function StickyFooter({ totals, canSubmit, allComplete, failsMissingActions, onSubmit, onCancel }) {
  /* Footer message reflects the live blocker (if any):
   *   • Some questions still unanswered → amber, count remaining
   *   • All answered but one or more Fail rows missing the action note → amber
   *   • All clear → green, "Ready to sign" */
  let statusLine;
  if (!allComplete) {
    const remaining = totals.total - totals.answered;
    statusLine = (
      <span className={styles.footerStatusGap}>
        <I name="alert" size={12} color="#ef6c00" />
        {remaining} question{remaining === 1 ? "" : "s"} still need a response
      </span>
    );
  } else if (failsMissingActions.length > 0) {
    statusLine = (
      <span className={styles.footerStatusGap}>
        <I name="alert" size={12} color="#ef6c00" />
        {failsMissingActions.length} Fail row{failsMissingActions.length === 1 ? "" : "s"} need an Action Required note
      </span>
    );
  } else {
    statusLine = (
      <span className={styles.footerStatusReady}>
        <I name="check" size={12} color="#2e7d32" />
        Ready to sign — {totals.pass} pass · {totals.fail} fail · {totals.na} N/A
      </span>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerStatus}>{statusLine}</div>
      {onCancel && (
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      )}
      <button
        type="button"
        className={styles.completeBtn}
        onClick={onSubmit}
        disabled={!canSubmit}
        title={canSubmit ? "Sign and submit the audit" : "Complete every question (and add Action notes on any Fail rows) to enable"}
      >
        <I name="edit" size={12} color="currentColor" />
        Complete &amp; Sign Audit
      </button>
    </footer>
  );
}
