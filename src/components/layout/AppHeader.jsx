/**
 * Global app header — bell + user identity, rendered once in the shell so
 * every page gets a consistent top-right account / notifications strip.
 *
 * The bell is a placeholder for the future notifications inbox. Clicking it
 * opens a small popover that lists the user's actionable items (drafts
 * awaiting their review, evidence due, etc.). For now the popover is a stub
 * — wire it to a real notifications service when the backend lands.
 *
 * User identity and data scope come from the auth context. Local mock users
 * and production `/users/me` hydration share the same shape.
 */

import { useEffect, useRef, useState } from "react";
import { I } from "../Icon";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../auth/AuthContext";
import { useAgenda } from "../../contexts/AgendaContext";
import { ROLE_BY_ID, useDevRole } from "../../services/devRole";
import { visibleSites } from "../../services/scope";
import { areaName, siteName } from "../../services/sites";
import styles from "./AppHeader.module.css";

/* Demo notification feed — static, fixture-flavoured items so the bell
 * demonstrates the real inbox pattern instead of a permanent empty state.
 * Swap for the live notifications service when the backend lands. */
const DEMO_NOTIFICATIONS = [
  { id: "n1", icon: "clock",     text: "Weekly Soil Test is overdue at Southall — due yesterday.",                       time: "2h ago" },
  { id: "n2", icon: "calendar",  text: "Daisy Nurse requested annual leave (14–18 Jul) — awaiting approval.",            time: "3h ago" },
  { id: "n3", icon: "clipboard", text: "OrthoLab London returned case LC-2041 — book the fit appointment.",              time: "5h ago" },
  { id: "n4", icon: "award",     text: "2 CPD entries from Dr. Amir Dentist are awaiting verification.",                 time: "Yesterday" },
];

export function AppHeader({ onMenuClick }) {
  const { user } = useAuth();
  const [devRole] = useDevRole();
  const [bellOpen, setBellOpen] = useState(false);
  const ref = useRef(null);
  /* Trigger for the global Today's Compliance Agenda drawer. The
   * drawer itself is mounted at App root inside AgendaProvider; this
   * button only flips the open flag. */
  const { toggleDrawer } = useAgenda();

  // Close the bell popover on outside click / Escape.
  useEffect(() => {
    if (!bellOpen) return;
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setBellOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setBellOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [bellOpen]);

  // For dev: name + role from auth user, falling back to demo values so the
  // header still reads correctly when the mock token doesn't carry a name.
  const displayName = user?.displayName ?? user?.username ?? "Dr. Amir Dentist";
  // Prefer the user's real org-role label (e.g. "Lead Nurse", "Practice
  // Manager"); fall back to the capability-role label for the seed dev user.
  const roleLabel = (user?.orgRoleLabel ?? ROLE_BY_ID[devRole]?.label ?? "Group Admin").toUpperCase();
  const scopedSites = visibleSites(user);
  const scopeLabel = user?.scopeType === "global" || scopedSites.length > 3
    ? "All sites"
    : user?.scopeType === "area"
      ? areaName(user.areaId)
      : siteName(scopedSites[0]?.id ?? user?.siteId ?? user?.practiceId);

  return (
    <header className={styles.appHeader}>
      {/* Hamburger — only rendered into the layout under the tablet
       * breakpoint (CSS hides it on desktop); opens the off-canvas nav. */}
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        title="Menu"
        aria-label="Open navigation menu"
      >
        <I name="menu" size={18} color="var(--on-surface)" />
      </button>

      <div className={styles.right} ref={ref}>
        <span className={styles.scopeBadge} title={`Current data scope: ${scopeLabel}`}>
          <I name="map-pin" size={12} color="var(--primary)" />
          {scopeLabel}
        </span>
        {/* Today's Compliance Agenda trigger — opens the right-side
         * drawer that lists overdue / remaining / completed tasks for
         * the day. Reuses the .bellBtn pill shape for visual parity
         * with the existing notification bell. */}
        <button
          type="button"
          className={styles.agendaBtn}
          onClick={toggleDrawer}
          title="Today's Compliance Agenda"
          aria-label="Open today's compliance agenda"
        >
          <I name="clock" size={16} color="var(--on-surface)" />
        </button>

        <button
          type="button"
          className={styles.bellBtn}
          onClick={() => setBellOpen((v) => !v)}
          title="Notifications"
          aria-haspopup="true"
          aria-expanded={bellOpen}
        >
          <I name="bell" size={16} color="var(--on-surface)" />
        </button>

        {bellOpen && (
          <div className={styles.bellPopover} role="dialog" aria-label="Notifications">
            <div className={styles.popHead}>
              <strong>Notifications</strong>
              <span className={styles.popHeadHint}>{DEMO_NOTIFICATIONS.length} new</span>
            </div>
            <ul className={styles.popList}>
              {DEMO_NOTIFICATIONS.map((n) => (
                <li key={n.id} className={styles.popItem}>
                  <span className={styles.popItemIcon}>
                    <I name={n.icon} size={14} color="var(--primary)" />
                  </span>
                  <span className={styles.popItemText}>{n.text}</span>
                  <span className={styles.popItemTime}>{n.time}</span>
                </li>
              ))}
            </ul>
            <div className={styles.popFoot}>
              Sample items — the live feed arrives with the backend.
            </div>
          </div>
        )}

        <div className={styles.user}>
          <div className={styles.userText}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userRole}>{roleLabel}</div>
          </div>
          <Avatar name={displayName} size={36} />
        </div>
      </div>
    </header>
  );
}
