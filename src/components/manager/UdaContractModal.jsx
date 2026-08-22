/**
 * UdaContractModal — PM-2.
 *
 * Edit a 12-month UDA contract for up to 6 clinicians. Per-clinician
 * tabs across the top; each tab opens a Target / Actual grid for
 * the April → March year. Changes propagate LIVE to the parent
 * setter so the UDA Performance bars on the PM Hub update as the
 * PM types — no Save-confirmation lag.
 *
 * Add Clinician button caps at 6 (per product brief).
 * Cancel reverts to the snapshot taken on modal open.
 */

import { useMemo, useState } from "react";
import { I } from "../Icon";
import { useModalA11y } from "../../hooks/useModalA11y";
import { UDA_MONTHS, udaTotals } from "../../services/fixtures/manager.fixture";
import styles from "./UdaContractModal.module.css";

/* No hard cap — large group practices can carry 10+ clinicians. */

/** Empty clinician shell — used by "+ Add Clinician". */
function emptyClinician(n) {
  return {
    name: `New Clinician ${n}`,
    monthlyTargets: Array(12).fill(0),
    monthlyActuals: Array(12).fill(0),
    /* Belt-and-braces: include zero-valued totals so even if the
     * parent's setDentists wrapper somehow misfires, the per-row
     * `d.delivered.toLocaleString()` calls don't explode. */
    contracted: 0,
    delivered:  0,
  };
}

export function UdaContractModal({ dentists, setDentists, period, onClose }) {
  /* Snapshot for Cancel-revert. Freeze on first mount. */
  const [snapshot] = useState(() => dentists.map((d) => ({
    name: d.name,
    monthlyTargets: [...d.monthlyTargets],
    monthlyActuals: [...d.monthlyActuals],
  })));

  const [activeIdx, setActiveIdx] = useState(0);
  const active = dentists[activeIdx];

  /* ─── Live mutators — every change propagates immediately. ─── */

  const updateName = (name) => {
    setDentists((prev) => prev.map((d, i) => i === activeIdx ? { ...d, name } : d));
  };
  const updateCell = (monthIdx, field, raw) => {
    const value = Math.max(0, Number(raw) || 0);
    setDentists((prev) => prev.map((d, i) => {
      if (i !== activeIdx) return d;
      const next = [...d[field]];
      next[monthIdx] = value;
      return { ...d, [field]: next };
    }));
  };
  const handleAddClinician = () => {
    setDentists((prev) => [...prev, emptyClinician(prev.length + 1)]);
    setActiveIdx(dentists.length);
  };
  const handleRemoveActive = () => {
    if (dentists.length <= 1) return;
    setDentists((prev) => prev.filter((_, i) => i !== activeIdx));
    setActiveIdx((idx) => Math.max(0, idx - 1));
  };

  const handleCancel = () => {
    /* Restore snapshot, then close. */
    setDentists(snapshot.map((d) => ({ ...d, ...udaTotals(d) })));
    onClose();
  };
  const handleSaveClose = () => {
    /* Changes were already applied live — Save just closes. */
    onClose();
  };
  const dialogRef = useModalA11y(handleCancel);

  /* ─── Derived totals for the live mini-summary inside the modal. ─── */
  const activeTotals = useMemo(() => active ? udaTotals(active) : { contracted: 0, delivered: 0 }, [active]);

  if (!active) return null;

  return (
    <div className={styles.scrim} onClick={handleCancel}>
      <div ref={dialogRef} className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Edit UDA targets and delivered">
        <header className={styles.head}>
          <div>
            <div className={styles.eyebrow}>UDA Contract Entry · Manual</div>
            <h2 className={styles.title}>Edit UDA Targets &amp; Delivered — {period}</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={handleCancel} aria-label="Cancel">×</button>
        </header>

        {/* Clinician tabs across the top */}
        <nav className={styles.tabBar} aria-label="Clinicians">
          {dentists.map((d, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                aria-pressed={isActive}
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                onClick={() => setActiveIdx(i)}
              >
                {d.name}
              </button>
            );
          })}
          <button type="button" className={styles.addTab} onClick={handleAddClinician}>
            <I name="plus" size={11} color="currentColor" />
            Add Clinician
          </button>
        </nav>

        {/* Active clinician editor */}
        <div className={styles.body}>
          <div className={styles.nameRow}>
            <label htmlFor="uda-clinician-name" className={styles.nameLabel}>Clinician name</label>
            <input
              id="uda-clinician-name"
              type="text"
              className={styles.nameInput}
              value={active.name}
              onChange={(e) => updateName(e.target.value)}
            />
            {dentists.length > 1 && (
              <button type="button" className={styles.removeBtn} onClick={handleRemoveActive}>
                <I name="trash" size={11} color="currentColor" />
                Remove
              </button>
            )}
          </div>

          {/* 12-month grid: Month · Target · Actual */}
          <div className={styles.grid}>
            <div className={styles.gridHead}>
              <span>Month</span>
              <span className={styles.gridHeadCentre}>Target</span>
              <span className={styles.gridHeadCentre}>Actual</span>
              <span className={styles.gridHeadCentre}>% pace</span>
            </div>
            {UDA_MONTHS.map((m, monthIdx) => {
              const target  = active.monthlyTargets[monthIdx] ?? 0;
              const actual  = active.monthlyActuals[monthIdx] ?? 0;
              const pct     = target > 0 ? Math.round((actual / target) * 100) : 0;
              const hasData = actual > 0;
              const pctTone = !hasData ? "" :
                              pct >= 100 ? styles.pctGood   :
                              pct >= 85  ? styles.pctSteady :
                              pct >= 50  ? styles.pctWarn   :
                                           styles.pctBad;
              return (
                <div key={m} className={styles.gridRow}>
                  <span className={styles.monthLabel}>{m}</span>
                  <input
                    aria-label={`${m} target UDAs`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className={styles.cellInput}
                    value={target}
                    onChange={(e) => updateCell(monthIdx, "monthlyTargets", e.target.value)}
                  />
                  <input
                    aria-label={`${m} actual UDAs`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    className={styles.cellInput}
                    value={actual}
                    onChange={(e) => updateCell(monthIdx, "monthlyActuals", e.target.value)}
                  />
                  <span className={`${styles.pctCell} ${pctTone}`}>
                    {hasData ? `${pct}%` : "—"}
                  </span>
                </div>
              );
            })}
            <div className={styles.gridFootRow}>
              <span className={styles.monthLabel}><strong>Annual</strong></span>
              <span className={styles.totalCell}>{activeTotals.contracted.toLocaleString()}</span>
              <span className={styles.totalCell}>{activeTotals.delivered.toLocaleString()}</span>
              <span className={styles.totalCell}>
                {activeTotals.contracted > 0
                  ? `${Math.round((activeTotals.delivered / activeTotals.contracted) * 100)}%`
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        <footer className={styles.foot}>
          <p className={styles.liveHint}>
            <I name="info" size={11} color="var(--on-surface-variant)" />
            Performance bars update live as you type.
          </p>
          <div className={styles.footBtns}>
            <button type="button" className={styles.btnGhost} onClick={handleCancel}>Cancel</button>
            <button type="button" className={styles.btnPrimary} onClick={handleSaveClose}>
              <I name="check" size={12} color="currentColor" />
              Save &amp; Close
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
