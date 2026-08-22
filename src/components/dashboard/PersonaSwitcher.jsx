/**
 * PersonaSwitcher — "viewing as" chip in the dashboard header.
 *
 * Dev / demo affordance until JWT-claim-based persona resolution
 * lands. Lets the user preview the dashboard as any of the 9
 * personas without changing their devRole.
 *
 * Persists the override to localStorage via `useDashboardPersona`.
 * When the override is null, the chip shows the default persona for
 * the current devRole + a discreet hint that nothing's overridden.
 */

import { useEffect, useRef, useState } from "react";
import { I } from "../Icon";
import { DASHBOARD_PERSONAS, useDashboardPersona } from "../../services/dashboard/persona";
import styles from "./PersonaSwitcher.module.css";

export function PersonaSwitcher() {
  const [, setPersona, { persona, isOverridden, clearOverride }] = useDashboardPersona();
  const [open, setOpen] = useState(false);
  /* Anchor position for the dropdown — measured from the chip's
   * bounding rect when the menu opens. We render the menu with
   * `position: fixed` to escape the welcome banner's `overflow:
   * hidden` clip (which was previously chopping the menu down to
   * a single visible row). */
  const [anchor, setAnchor] = useState(null);
  const ref     = useRef(null);
  const chipRef = useRef(null);

  /* Outside-click + ESC dismiss */
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey   = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        ref={chipRef}
        type="button"
        className={styles.chip}
        onClick={() => {
          /* Snapshot chip viewport position before toggling so the
           * fixed-position menu lands directly beneath the chip. */
          if (!open && chipRef.current) {
            const r = chipRef.current.getBoundingClientRect();
            setAnchor({ top: r.bottom + 6, right: window.innerWidth - r.right });
          }
          setOpen((v) => !v);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Preview the dashboard as a different persona"
      >
        {/* "Previewing as" (not "Viewing as") — deliberately distinct from the
            sidebar's demo sign-in switcher, which changes the actual session. */}
        <span className={styles.chipEyebrow}>{isOverridden ? "Previewing as" : "Dashboard view"}</span>
        <span className={styles.chipLabel}>{persona.label}</span>
        {isOverridden && <span className={styles.overrideDot} aria-hidden="true" />}
        <I name="chevrondown" size={11} color="currentColor" />
      </button>

      {open && (
        <div className={styles.menu}
          role="listbox" aria-label="Persona selector"
          style={anchor ? { top: anchor.top, right: anchor.right } : undefined}>
          <div className={styles.menuHead}>Preview the dashboard as…</div>
          {DASHBOARD_PERSONAS.map((p) => {
            const active = p.id === persona.id;
            return (
              <button
                key={p.id}
                type="button"
                role="option"
                aria-selected={active}
                className={`${styles.menuItem} ${active ? styles.menuItemActive : ""}`}
                onClick={() => { setPersona(p.id); setOpen(false); }}
              >
                <span className={styles.menuItemLabel}>{p.label}</span>
                <span className={styles.menuItemStage}>{p.stage}</span>
                {active && <I name="check" size={11} color="currentColor" />}
              </button>
            );
          })}
          {isOverridden && (
            <button
              type="button"
              className={styles.menuClear}
              onClick={() => { clearOverride(); setOpen(false); }}
            >
              ↺ Exit preview
            </button>
          )}
        </div>
      )}
    </div>
  );
}
