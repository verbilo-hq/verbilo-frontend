import { useState } from "react";
import { I } from "../../components/Icon";
import { useModalA11y } from "../../hooks/useModalA11y";
import styles from "./OperationalLogsPage.module.css";

/* ═══ Dynamic modal ════════════════════════════════════════════════════
 * Renders the template's questions one per row with the right input type
 * + an Operator Signature box in the footer. Submit collects every value
 * into a { values, signature } payload and hands it to the parent.
 *
 * Lives in its own module (not OperationalLogsPage.jsx) because the
 * Today's Compliance Agenda drawer — mounted eagerly at the App root —
 * also renders it; importing it from the page would pull the whole
 * lazy-loaded logbooks page into the main bundle. */

export function LogModal({
  template, displayTitle, site, defaultOperatorName, initialValues,
  onCancel, onSubmit,
  /* Optional read-only archive mode — used by the Audit & Evidence
   * Centre's "View Entry" click on completed rows. When true:
   *   • every field (text + numeric + pass/fail/na + signature) is
   *     rendered with `disabled`
   *   • the footer collapses to a single low-emphasis "Close" button
   *   • `submitLabel` overrides the primary button text
   *   • `topBanner` renders an immutable-ledger banner above the
   *     question stack */
  readOnly = false,
  submitLabel,
  topBanner,
}) {
  /* `initialValues` lets callers pre-populate the form — used by the
   * "Simulate Priya's Submission" demo shortcut + the read-only
   * archive view to show a fully-filled-in historical record. */
  const [values,    setValues]    = useState(() => initialValues ?? {});
  const [signature, setSignature] = useState(defaultOperatorName ?? "");

  const dialogRef = useModalA11y(onCancel);

  /* Lightweight per-field validation. Every question must have a value,
   * numeric questions must parse as a number (out-of-bounds is allowed —
   * we surface it as an Active Equipment Alert post-submit rather than
   * blocking — matches HTM 01-05 "log and escalate" workflow). */
  const missingFields = template.questions.filter((q) => {
    const v = values[q.id];
    if (q.input_type === "pass_fail_na") return !v;
    if (q.input_type === "numeric_threshold") return v === undefined || v === "" || Number.isNaN(Number(v));
    if (q.input_type === "text") return !(v ?? "").toString().trim();
    return !v;
  });
  const canSubmit = missingFields.length === 0 && signature.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ values, signature: signature.trim() });
  };

  return (
    <div className={styles.modalScrim} onClick={onCancel}>
      <div
        ref={dialogRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className={styles.modalHead}>
          <div>
            <div className={styles.modalEyebrow}>
              {template.regulatorPrimary} {site && <>&nbsp;•&nbsp; {site.name}</>}
            </div>
            <h2 id="modal-title" className={styles.modalTitle}>{displayTitle}</h2>
          </div>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className={styles.modalBody}>
          {/* Optional immutable-ledger banner — only rendered by the
           * read-only archive view. Sits above the first question so
           * the security context is the first thing the eye lands on. */}
          {topBanner && (
            <div className={styles.archiveBanner} role="status">{topBanner}</div>
          )}

          {template.questions.map((q) => (
            <FieldRow
              key={q.id}
              question={q}
              value={values[q.id]}
              onChange={(v) => setValues((prev) => ({ ...prev, [q.id]: v }))}
              readOnly={readOnly}
            />
          ))}

          {/* Operator Signature — always last. Free text for the MVP;
           * production replaces with a canvas signature pad. Disabled
           * + helper-text swapped in read-only archive mode. */}
          <div className={styles.signatureBlock}>
            <label className={styles.fieldLabel} htmlFor="modal-signature">
              Operator Signature
              {!readOnly && <span className={styles.required}> *</span>}
            </label>
            <input
              id="modal-signature"
              type="text"
              className={styles.signatureInput}
              value={signature}
              placeholder="Type your full name to sign"
              onChange={(e) => setSignature(e.target.value)}
              disabled={readOnly}
              readOnly={readOnly}
            />
            <div className={styles.signatureHint}>
              {readOnly
                ? "Signature locked. This entry was cryptographically stamped at submission and cannot be altered."
                : "Submission cryptographically stamps this entry to the immutable ledger."}
            </div>
          </div>
        </div>

        <footer className={styles.modalFooter}>
          {readOnly ? (
            /* Archive mode — single low-emphasis Close button.
             * No Cancel / Submit / validation messaging since the
             * record is locked and inert. */
            <>
              <div className={styles.modalFooterStatus} />
              <button type="button" className={styles.modalCancelBtn} onClick={onCancel}>
                {submitLabel ?? "Close"}
              </button>
            </>
          ) : (
            <>
              <div className={styles.modalFooterStatus}>
                {!canSubmit && (
                  <>
                    <I name="alert" size={11} color="#ef6c00" />
                    {signature.trim().length === 0
                      ? "Operator signature required"
                      : `${missingFields.length} field${missingFields.length === 1 ? "" : "s"} need a value`}
                  </>
                )}
              </div>
              <button type="button" className={styles.modalCancelBtn} onClick={onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.modalSubmitBtn}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {submitLabel ?? "Submit Audit"}
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

/* ─── Field row dispatcher ────────────────────────────────────────────── */

function FieldRow({ question, value, onChange, readOnly = false }) {
  /* Detect a numeric breach so the row turns red as the user types. */
  let numericBreach = false;
  if (question.input_type === "numeric_threshold" && value !== undefined && value !== "") {
    const v = Number(value);
    if (!Number.isNaN(v)) numericBreach = v < question.min || v > question.max;
  }

  return (
    <div className={`${styles.field} ${numericBreach ? styles.fieldBreach : ""}`}>
      <label className={styles.fieldLabel}>
        {question.text}
        {!readOnly && <span className={styles.required}> *</span>}
      </label>

      {question.input_type === "text" && (
        <input
          type="text"
          className={styles.fieldInput}
          value={value ?? ""}
          placeholder={question.placeholder ?? "Enter value"}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
          readOnly={readOnly}
        />
      )}

      {question.input_type === "numeric_threshold" && (
        <div className={styles.numericRow}>
          <div className={styles.numericField}>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              className={`${styles.fieldInput} ${styles.fieldInputNumeric} ${numericBreach ? styles.fieldInputBreach : ""}`}
              value={value ?? ""}
              /* Short placeholder — the safe range hint on the right
               * already tells the user what value is expected, so a
               * concise example reads better than verbose copy that
               * gets clipped inside the input width. */
              placeholder="0.0"
              onChange={(e) => onChange(e.target.value)}
              aria-invalid={numericBreach || undefined}
              disabled={readOnly}
              readOnly={readOnly}
            />
            {question.unit && <span className={styles.numericUnit}>{question.unit}</span>}
          </div>
          <span className={styles.numericMeta}>
            Safe range: <strong>{question.min}</strong> to <strong>{question.max}</strong>
            {question.unit ? ` ${question.unit}` : ""}
          </span>
        </div>
      )}

      {question.input_type === "pass_fail_na" && (
        <div className={styles.segmented} role="radiogroup" aria-disabled={readOnly}>
          {["pass", "fail", "na"].map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={value === s}
              className={`${styles.segBtn} ${styles[`seg_${s}`]} ${value === s ? styles.segBtnActive : ""}`}
              onClick={() => !readOnly && onChange(s)}
              disabled={readOnly}
            >
              {s === "pass" ? "Pass" : s === "fail" ? "Fail" : "N/A"}
            </button>
          ))}
        </div>
      )}

      {numericBreach && (
        <div className={styles.fieldBreachMsg} role="alert">
          <strong>Out of bounds.</strong>{" "}
          {question.criticalThresholdMessage
            ?? `Value outside safe range (${question.min}-${question.max}${question.unit ? ' ' + question.unit : ''}).`}
        </div>
      )}

      {question.regulatorRef && (
        <div className={styles.fieldRegRef}>{question.regulatorRef}</div>
      )}
    </div>
  );
}
