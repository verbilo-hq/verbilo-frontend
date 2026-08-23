import s from './ConicGauge.module.css';

/**
 * Conic-gradient gauge whose fill is driven by `--p` (0..1) on the .ring
 * element. The component is purely presentational — the parent scene writes
 * `--p` to ringRef and `textContent` to valueRef on each rAF tick. Keeps
 * React quiet during scroll (no state, no re-renders).
 *
 *   <ConicGauge ringRef={ringRef} valueRef={valueRef} label="Compliance" />
 */
export default function ConicGauge({ ringRef, valueRef, label = 'Compliance' }) {
  return (
    <div className={s.gauge} role="img" aria-label={`${label} gauge`}>
      <div ref={ringRef} className={s.ring} style={{ '--p': 0 }}>
        <div className={s.disc}>
          <div className={s.readout}>
            <span ref={valueRef} className={s.value}>0</span>
            <span className={s.unit}>%</span>
          </div>
          <span className={s.label}>{label}</span>
        </div>
      </div>
    </div>
  );
}
