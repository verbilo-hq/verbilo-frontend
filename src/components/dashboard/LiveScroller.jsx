/**
 * LiveScroller — auto-rotating list that mimics a real-time activity feed.
 *
 * Renders a fixed-height window of items that auto-advances vertically.
 * Every `intervalMs` the top item slides off + the bottom item appears
 * at the top (array rotation), creating the "live ticker" feeling.
 *
 * Pauses on hover so users can read at their own pace.
 *
 * Generic — accepts any item shape + a render function. Used by the
 * dashboard Compliance Feed today; will be re-used by Spotlight,
 * Activity Pulse, and any other widget that benefits from a live
 * cadence.
 *
 * Props:
 *   items         Array     Required. Source data — gets rotated.
 *   renderItem    (item, i) Required. Renders a single row.
 *   visibleCount  number    How many items show in the window. Default 4.
 *   intervalMs    number    Rotate cadence. Default 4000.
 *   itemKey       (item)    Key extractor. Default uses i.
 *   className     string    Wraps the scroll viewport.
 *
 * Accessibility: respects prefers-reduced-motion (no animation, no
 * auto-advance) so users with vestibular sensitivities get a static
 * list.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./LiveScroller.module.css";

export function LiveScroller({
  items,
  renderItem,
  visibleCount = 4,
  intervalMs   = 4000,
  itemKey      = (_, i) => i,
  className    = "",
}) {
  /* Offset = how many items we've rotated past. Modulo by items.length
   * keeps it bounded forever. */
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  /* Track whether the user prefers reduced motion. Subscribed live so
   * if they flip the OS toggle the dashboard reacts without reload. */
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  /* Auto-advance loop. Paused on hover + paused when the user prefers
   * reduced motion. Cleans up on unmount and re-creates if `intervalMs`
   * changes. */
  useEffect(() => {
    if (paused || reduceMotion) return;
    if (!items || items.length <= visibleCount) return;
    const id = setInterval(() => setOffset((o) => o + 1), intervalMs);
    return () => clearInterval(id);
  }, [paused, reduceMotion, items, visibleCount, intervalMs]);

  /* Rotate the source array so the "live" item is always at the top of
   * the visible window. If fewer items than visibleCount, render as-is. */
  const visibleItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (items.length <= visibleCount) return items;
    const start = ((offset % items.length) + items.length) % items.length;
    const out = [];
    for (let i = 0; i < visibleCount; i++) {
      out.push(items[(start + i) % items.length]);
    }
    return out;
  }, [items, offset, visibleCount]);

  return (
    <div
      className={`${styles.scroller} ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Live activity feed"
      aria-live="polite"
      tabIndex={0}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {visibleItems.map((item, i) => (
        <div
          /* `offset` in the key so React treats each rotation as fresh
           * mounts — that's what triggers the enter animation on the
           * new top item. */
          key={`${itemKey(item, i)}-${offset}`}
          className={`${styles.scrollerItem} ${i === 0 ? styles.scrollerItemTop : ""}`}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}
