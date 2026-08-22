import { Fragment, useEffect, useMemo, useState } from "react";
import { I } from "../Icon";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../auth/AuthContext";
import { useIndustry } from "../../contexts/IndustryContext";
import { SECTION_ORDER } from "../../services/industry";
import { canViewPage, hasCap, useDevRole, ROLE_BY_ID } from "../../services/devRole";
import { ThemedSelect } from "../ui/ThemedSelect";
import { demoUsers } from "../../auth/demoUsers";
import { ROLE_LABELS } from "../../services/timeOff.service";
import styles from "./Sidebar.module.css";

/* Human-readable role for the sidebar footer. Prefers the granular org-role
 * label from the session ("Lead Nurse"), then the HR job title, then the
 * capability-role label — never a raw enum like "group_admin" or "staff". */
const prettyRole = (user) =>
  user?.orgRoleLabel ??
  user?.hrProfile?.jobTitle ??
  ROLE_BY_ID[user?.role]?.label ??
  String(user?.role ?? "").replace(/_/g, " ");

const storageKey = (industryId) => `verbilo.sidebar.order.${industryId}`;

// Apply a saved id-order to the industry's nav items. Items present in the
// saved order render in that order; items added later (e.g. a new nav entry
// after the user saved their order) are appended at the end so they don't
// vanish.
function applyOrder(items, savedOrder) {
  if (!Array.isArray(savedOrder) || savedOrder.length === 0) return items;
  const byId = new Map(items.map((i) => [i.id, i]));
  const result = [];
  for (const id of savedOrder) {
    const it = byId.get(id);
    if (it) { result.push(it); byId.delete(id); }
  }
  for (const it of byId.values()) result.push(it);
  return result;
}

export const Sidebar = ({ current, onNav, open = false }) => {
  const { user, logout, login } = useAuth();
  const { industry } = useIndustry();

  const [editing, setEditing] = useState(false);
  const [order, setOrder] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  // Dev-only capability role (until Cognito carries real role claims). Drives
  // capability gates across the app via hasCap(role, capability); the auth layer
  // keeps it in sync with the logged-in user (applyCapabilityRole on login).
  const [devRole] = useDevRole();

  // Demo "Viewing as" user switcher. One representative per org role (first in
  // the demo set) — e.g. with two Area Managers, only the first shows. Picking
  // one logs in as that user, so identity, role gating and scope all follow.
  const switchUsers = useMemo(() => {
    const TITLES = new Set(["Dr.", "Dr", "Mr.", "Mr", "Mrs.", "Mrs", "Ms.", "Ms", "Prof.", "Prof"]);
    const firstName = (name = "") => {
      const parts = name.split(" ").filter(Boolean);
      return parts.find((p) => !TITLES.has(p)) ?? parts[0] ?? name;
    };
    const seen = new Set();
    return demoUsers.reduce((acc, u) => {
      if (seen.has(u.role)) return acc;
      seen.add(u.role);
      acc.push({
        value: u.username,
        label: `${firstName(u.displayName)} · ${ROLE_LABELS[u.role] ?? u.role}`,
      });
      return acc;
    }, []);
  }, []);
  const currentSwitchValue = switchUsers.some((u) => u.value === user?.username)
    ? user.username
    : "";
  const handleSwitchUser = async (username) => {
    const account = demoUsers.find((u) => u.username === username);
    if (!account || account.username === user?.username) return;
    try {
      await login(account.username, account.password);
      window.location.reload();
    } catch (err) {
      console.error("[viewing-as] failed to switch user", err);
    }
  };

  // Load saved order whenever the industry changes (each industry has its own).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(industry.id));
      setOrder(raw ? JSON.parse(raw) : null);
    } catch {
      setOrder(null);
    }
    setEditing(false);
  }, [industry.id]);

  const persistOrder = (next) => {
    setOrder(next);
    try { localStorage.setItem(storageKey(industry.id), JSON.stringify(next)); } catch { /* noop */ }
  };

  const resetOrder = () => {
    setOrder(null);
    try { localStorage.removeItem(storageKey(industry.id)); } catch { /* noop */ }
  };

  // The actual visible list — apply the saved order, then filter by role
  // (legacy `roles` array) and by the new capability map (`cap` key).
  const visibleItems = useMemo(() => {
    const ordered = applyOrder(industry.navItems, order);
    return ordered.filter((item) => {
      if (!canViewPage(devRole, item.id, user?.orgRole)) return false;
      if (item.roles && !item.roles.includes(user?.role)) return false;
      if (item.cap && !hasCap(devRole, item.cap)) return false;
      return true;
    });
  }, [industry.navItems, order, user?.role, user?.orgRole, devRole]);

  // Group items by section for static section labels. SECTION_ORDER drives
  // outer ordering; unknown sections fall through at the end. Within each
  // section, items keep their (possibly reordered) order from visibleItems.
  const groupedSections = useMemo(() => {
    const groups = new Map();
    for (const item of visibleItems) {
      const sec = item.section || "OTHER";
      if (!groups.has(sec)) groups.set(sec, []);
      groups.get(sec).push(item);
    }
    const known = SECTION_ORDER.filter((s) => groups.has(s));
    const unknown = [...groups.keys()].filter((s) => !SECTION_ORDER.includes(s));
    return [...known, ...unknown].map((s) => ({ section: s, items: groups.get(s) }));
  }, [visibleItems]);

  // Drag-reorder is constrained within the source item's section so the
  // section grouping stays coherent. Cross-section drops are rejected.
  const draggedItem = dragIdx != null ? visibleItems[dragIdx] : null;

  const handleDragStart = (idx) => (e) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    // Firefox refuses to start a drag without payload.
    e.dataTransfer.setData("text/plain", String(idx));
  };
  const handleDragOver = (idx) => (e) => {
    if (dragIdx == null) return;
    // Block cross-section drags so the section grouping stays coherent.
    const target = visibleItems[idx];
    if (draggedItem && target && draggedItem.section !== target.section) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overIdx !== idx) setOverIdx(idx);
  };
  const handleDrop = (idx) => (e) => {
    e.preventDefault();
    if (dragIdx == null || dragIdx === idx) {
      setDragIdx(null); setOverIdx(null);
      return;
    }
    const target = visibleItems[idx];
    if (draggedItem && target && draggedItem.section !== target.section) {
      setDragIdx(null); setOverIdx(null);
      return;
    }
    const ids = visibleItems.map((i) => i.id);
    const [moved] = ids.splice(dragIdx, 1);
    ids.splice(idx, 0, moved);
    persistOrder(ids);
    setDragIdx(null);
    setOverIdx(null);
  };
  const handleDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
  <aside className={open ? `${styles.sidebar} ${styles.sidebarOpen}` : styles.sidebar}>
    <div className={styles.brand}>
      <div className={styles.brandRow}>
        <div className={styles.logo}>
          <I name={industry.icon} size={20} />
        </div>
        <div>
          <div className={styles.brandTitle}>{industry.brand}</div>
          <div className={styles.brandSubtitle}>{industry.tagline}</div>
        </div>
      </div>
    </div>

    <nav className={editing ? `${styles.nav} ${styles.navEditing}` : styles.nav}>
      {groupedSections.map((group) => (
        <Fragment key={group.section}>
          <div className={styles.sectionLabel}>{group.section}</div>
          {group.items.map((item) => {
            const idx = visibleItems.indexOf(item);
            const active = current === item.id;
            const isDragging = dragIdx === idx;
            const isOver = overIdx === idx && dragIdx != null && dragIdx !== idx;
            const cls = [
              styles.link,
              active && !editing ? styles.linkActive : "",
              editing ? styles.linkEditing : "",
              isDragging ? styles.linkDragging : "",
              isOver ? styles.linkDragOver : "",
            ].filter(Boolean).join(" ");
            return (
              <a
                key={item.id}
                role="button"
                tabIndex={editing ? -1 : 0}
                aria-current={active && !editing ? "page" : undefined}
                draggable={editing}
                onClick={editing ? undefined : () => onNav(item.id)}
                onKeyDown={editing ? undefined : (e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNav(item.id); }
                }}
                onDragStart={editing ? handleDragStart(idx) : undefined}
                onDragOver={editing ? handleDragOver(idx) : undefined}
                onDrop={editing ? handleDrop(idx) : undefined}
                onDragEnd={editing ? handleDragEnd : undefined}
                className={cls}
                style={editing ? { cursor: "grab" } : undefined}
              >
                {editing && <I name="more" size={14} color="var(--outline)" />}
                <I name={item.icon} size={18} />
                {item.label}
              </a>
            );
          })}
        </Fragment>
      ))}

      <div className={styles.editRow}>
        {editing ? (
          <>
            <button type="button" className={styles.editDoneBtn} onClick={() => setEditing(false)}>
              <I name="check" size={14} /> Done
            </button>
            {order && (
              <button type="button" className={styles.editResetBtn} onClick={resetOrder} title="Reset to default order">
                <I name="refresh" size={13} /> Reset
              </button>
            )}
          </>
        ) : (
          <button type="button" className={styles.editBtn} onClick={() => setEditing(true)} title="Reorder the sidebar">
            <I name="edit" size={13} /> Edit nav
          </button>
        )}
      </div>

      {/* Demo-only user switcher — dev builds only; never ships to production. */}
      {import.meta.env.DEV && (
        <div className={styles.devRoleRow} title="Demo: switch the logged-in user to test different roles">
          {/* "Sign in as" (not "Viewing as") — this switcher REALLY re-logs-in,
              unlike the dashboard's persona preview chip. */}
          <span className={styles.devRoleLabel}>Demo: sign in as</span>
          <ThemedSelect
            value={currentSwitchValue}
            onChange={handleSwitchUser}
            options={switchUsers}
            placeholder="Switch user…"
            ariaLabel="Switch the logged-in user (demo)"
          />
        </div>
      )}
    </nav>

    <div className={styles.footer}>
      {/* Logged-in user */}
      {user && (
        <div className={styles.currentUser}>
          <Avatar name={user.displayName} size={32} />
          <div className={styles.currentUserInfo}>
            <span className={styles.currentUserName}>{user.displayName}</span>
            <span className={styles.currentUserRole}>
              {prettyRole(user)}
            </span>
          </div>
        </div>
      )}

      {/* Storage widget removed — it displayed fabricated usage figures
          (a hardcoded "21% · 213 GB of 1 TB") with no backing data source.
          Re-add when real storage metrics are available from the backend. */}

      <a
        role="button"
        tabIndex={0}
        onClick={logout}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); logout(); } }}
        className={styles.footerLink}
      >
        <I name="logout" size={16} /> Logout
      </a>
      <p className={styles.copyright}>
        © 2026 BrainPower Technologies Ltd. All rights reserved.
      </p>
    </div>
  </aside>
  );
};
