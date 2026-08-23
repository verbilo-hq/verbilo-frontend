import { createContext, useContext, useEffect } from "react";
import { I } from "../../components/Icon";
import { Pill } from "../../components/ui/Pill";
import {
  DOCUMENT_STATUS_COLOR, DOCUMENT_STATUS_LABEL,
  SITE_STATUS_COLOR,    SITE_STATUS_LABEL,
  EVIDENCE_STATUS_COLOR, EVIDENCE_STATUS_LABEL,
  ROLE_LABEL,
} from "../../services/governance/types";
import styles from "./Governance.module.css";

export const DocStatusPill = ({ status, small = true }) => {
  const color = DOCUMENT_STATUS_COLOR[status] ?? "#6b7280";
  return (
    <Pill bg={`color-mix(in srgb, ${color} 14%, transparent)`} color={color} small={small}>
      {DOCUMENT_STATUS_LABEL[status] ?? status}
    </Pill>
  );
};

export const SiteStatusPill = ({ status, small = true }) => {
  const color = SITE_STATUS_COLOR[status] ?? "#6b7280";
  return (
    <Pill bg={`color-mix(in srgb, ${color} 14%, transparent)`} color={color} small={small}>
      {SITE_STATUS_LABEL[status] ?? status}
    </Pill>
  );
};

export const EvidenceStatusPill = ({ status, small = true }) => {
  const color = EVIDENCE_STATUS_COLOR[status] ?? "#6b7280";
  return (
    <Pill bg={`color-mix(in srgb, ${color} 14%, transparent)`} color={color} small={small}>
      {EVIDENCE_STATUS_LABEL[status] ?? status}
    </Pill>
  );
};

export const BackButton = ({ onClick, label = "Back" }) => (
  <button className={styles.pvBackBtn} onClick={onClick}>
    <I name="back" size={13} /> {label}
  </button>
);

/* Header actions slot — lets a child view inside the Governance area push a
 * right-aligned action (typically a Back button) into the "Governance & SOPs"
 * page header instead of stacking it above its own content. GovernancePage
 * provides the setter; views call useSetHeaderActions on mount and pass null
 * on unmount to clear. */
export const HeaderActionsContext = createContext(() => {});
export function useSetHeaderActions(node) {
  const setActions = useContext(HeaderActionsContext);
  useEffect(() => {
    setActions(node);
    return () => setActions(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);
}

export const ProvidedTag = ({ children }) => (
  <span className={styles.providedTag}>{children}</span>
);

export const ClientTag = ({ children }) => (
  <span className={`${styles.providedTag} ${styles.clientTag}`}>{children}</span>
);

export const StatTile = ({ label, value, helper, color = "var(--primary)", icon }) => (
  <div className={styles.statTile}>
    <div
      className={styles.statTileIcon}
      style={{ background: `color-mix(in srgb, ${color} 14%, transparent)` }}
    >
      <I name={icon} size={18} color={color} />
    </div>
    <div>
      <div className={styles.statTileValue} style={{ color }}>{value}</div>
      <div className={styles.statTileLabel}>{label}</div>
      {helper && <div className={styles.statTileHelper}>{helper}</div>}
    </div>
  </div>
);

export function formatDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return "—"; }
}

export function formatDateTime(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleString("en-GB"); }
  catch { return "—"; }
}

export function roleLabel(role) {
  return ROLE_LABEL[role] ?? role;
}

export const Bar = ({ pct, color = "var(--primary)" }) => (
  <div className={styles.bar}>
    <div className={styles.barFill} style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
  </div>
);
