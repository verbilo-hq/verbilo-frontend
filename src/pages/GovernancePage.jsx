import { useEffect, useState } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import {
  listMeetings, listRisks, listActions,
} from "../services/governance.service";
import { GovernanceShell } from "./governance/GovernanceShell";
import { SopLibrary } from "./governance/SopLibrary";
import { HeaderActionsContext } from "./governance/Shared";
import { useAuth } from "../auth/AuthContext";
import styles from "./GovernancePage.module.css";

const TABS = [
  { id: "packs",      label: "Governance Packs", icon: "shield"      },
  { id: "governance", label: "Governance",       icon: "checksquare" },
];

const riskBadges = {
  Low:    { bg: "rgba(46,125,50,0.10)", color: "#2e7d32" },
  Medium: { bg: "rgba(245,124,0,0.10)", color: "#b36000" },
  High:   { bg: "rgba(229,57,53,0.10)", color: "#e53935" },
};
const riskStatusBadge = {
  open:       { label: "Open",       bg: "rgba(229,57,53,0.10)", color: "#e53935" },
  mitigated:  { label: "Mitigated",  bg: "rgba(46,125,50,0.10)", color: "#2e7d32" },
  monitoring: { label: "Monitoring", bg: "rgba(245,124,0,0.10)", color: "#b36000" },
};
const actionStatusBadge = {
  open:        { label: "Open",        bg: "rgba(229,57,53,0.10)", color: "#e53935" },
  in_progress: { label: "In Progress", bg: "rgba(245,124,0,0.10)", color: "#b36000" },
  done:        { label: "Done",        bg: "rgba(46,125,50,0.10)", color: "#2e7d32" },
};

const GovernanceSection = ({ meetings, risks, actions }) => (
  <div className={styles.govGrid}>
    <Card hover={false} style={{ padding: 24 }}>
      <div className={styles.govSectionHead}>
        <div>
          <h3 className={styles.govSectionTitle}>Practice Meetings</h3>
          <p className={styles.govSectionSub}>Governance, SER, and team huddles</p>
        </div>
        <Pill bg="var(--surface-container)" color="var(--on-surface-variant)" small>
          {meetings.length} this quarter
        </Pill>
      </div>
      <div className={styles.govList}>
        {meetings.map((m) => (
          <div key={m.id} className={styles.govRow}>
            <div>
              <div className={styles.govRowTitle}>{m.title}</div>
              <div className={styles.govRowMeta}>
                {m.date} · Chair: {m.chair} · {m.attendees} attendees · {m.actionsRaised} actions
              </div>
            </div>
            <Pill
              bg={m.minutesAvailable ? "rgba(46,125,50,0.10)" : "rgba(245,124,0,0.10)"}
              color={m.minutesAvailable ? "#2e7d32" : "#b36000"}
              small
            >
              {m.minutesAvailable ? "Minutes filed" : "Pending"}
            </Pill>
          </div>
        ))}
      </div>
    </Card>

    <Card hover={false} style={{ padding: 24 }}>
      <div className={styles.govSectionHead}>
        <div>
          <h3 className={styles.govSectionTitle}>Risk Register</h3>
          <p className={styles.govSectionSub}>Live clinical & operational risks</p>
        </div>
        <Pill bg="var(--surface-container)" color="var(--on-surface-variant)" small>
          {risks.length} risks
        </Pill>
      </div>
      <div className={styles.govList}>
        {risks.map((r) => {
          const lk = riskBadges[r.likelihood];
          const ip = riskBadges[r.impact];
          const st = riskStatusBadge[r.status];
          return (
            <div key={r.id} className={styles.govRow}>
              <div>
                <div className={styles.govRowTitle}>{r.risk}</div>
                <div className={styles.govRowMeta}>
                  {r.category} · Owner {r.owner} · {r.mitigation}
                </div>
                <div className={styles.riskBadges}>
                  <Pill bg={lk.bg} color={lk.color} small>Likelihood: {r.likelihood}</Pill>
                  <Pill bg={ip.bg} color={ip.color} small>Impact: {r.impact}</Pill>
                </div>
              </div>
              <Pill bg={st.bg} color={st.color} small>{st.label}</Pill>
            </div>
          );
        })}
      </div>
    </Card>

    <Card hover={false} style={{ padding: 24, gridColumn: "1 / -1" }}>
      <div className={styles.govSectionHead}>
        <div>
          <h3 className={styles.govSectionTitle}>Action Log</h3>
          <p className={styles.govSectionSub}>Actions raised from governance meetings & incidents</p>
        </div>
        <Pill bg="var(--surface-container)" color="var(--on-surface-variant)" small>
          {actions.filter((a) => a.status !== "done").length} open
        </Pill>
      </div>
      <div className={styles.actionTable}>
        <div className={styles.actionTableHead}>
          <span>Action</span><span>Owner</span><span>Source</span><span>Due</span><span>Status</span>
        </div>
        {actions.map((a) => {
          const st = actionStatusBadge[a.status];
          return (
            <div key={a.id} className={styles.actionTableRow}>
              <span className={styles.actionDesc}>{a.action}</span>
              <span className={styles.actionOwner}>
                <Avatar name={a.owner} size={20} />
                <span>{a.owner}</span>
              </span>
              <span className={styles.actionSource}>{a.source}</span>
              <span className={styles.actionDue}>{a.due}</span>
              <Pill bg={st.bg} color={st.color} small>{st.label}</Pill>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

export const GovernancePage = ({ initialView } = {}) => {
  // View routing: 'packs' is the default — pack catalogue / wizard / live
  // dashboards via GovernanceShell. The previous KPI-tile landing was retired
  // because it duplicated sidebar navigation and didn't earn its space.
  // 'library' shows the SOP Library; 'governance' shows the legacy meetings/
  // risks/actions section. 'clinical' jumps straight into the protocol library.
  // The sidebar's Clinical Protocols shortcut passes initialView="clinical"
  // so the page mounts directly in that view rather than the catalogue.
  const [view, setView] = useState(initialView ?? "packs");
  // Standalone = entered via a dedicated sidebar item (e.g. "Clinical
  // Protocols"). Strips the "Governance & SOPs" wrapper header so the page
  // looks like a top-level destination rather than a sub-view.
  const isStandalone = !!initialView;
  const [meetings, setMeetings] = useState([]);
  const [risks, setRisks] = useState([]);
  const [actions, setActions] = useState([]);
  const [headerActions, setHeaderActions] = useState(null);
  const { user } = useAuth();
  const tenantId = user?.tenantId ?? "demo-tenant";

  useEffect(() => {
    listMeetings().then(setMeetings);
    listRisks().then(setRisks);
    listActions().then(setActions);
  }, []);

  // Landing → destination routing. Quick links / priority actions that don't
  // yet have a dedicated screen route to the closest existing one for now.
  const navigate = (dest) => {
    switch (dest) {
      case "packs":     return setView("packs");
      case "library":   return setView("library");
      case "clinical":  return setView("clinical");
      case "governance":
      case "actions":   return setView("governance");
      // Reviews / acks / evidence / approvals — route to packs for now.
      default:          return setView("packs");
    }
  };

  return (
    <HeaderActionsContext.Provider value={setHeaderActions}>
    <div>
      {/* Standalone mode (entered via the Clinical Protocols sidebar item)
          skips the "Governance & SOPs" wrapper chrome — the library is the
          page, not a sub-view. */}
      {/* Page-level search bar removed — it didn't actually search anything
          (decorative placeholder) and just added visual noise above the
          pack chrome. The Protocols tab inside a live pack still has a
          functional title-search; that one stays. */}

      {!isStandalone && (
        <div className={styles.header} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 className={styles.title}>Governance &amp; SOPs</h1>
            <p className={styles.lead}>
              Controlled governance, SOPs and clinical governance documents.
              Set up, manage and stay on top of compliance across your dental group.
            </p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
            {/* Deeper views push their own actions (e.g. wizard's Back to catalogue) via context. */}
            {view !== "packs" && headerActions}
            {view !== "packs" && (
              <button
                onClick={() => setView("packs")}
                style={{ padding: "7px 12px", border: "1px solid var(--outline-variant)", borderRadius: 999, background: "var(--surface)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                ← Governance Packs
              </button>
            )}
          </div>
        </div>
      )}

      {view === "packs"      && <GovernanceShell />}
      {view === "clinical"   && <GovernanceShell initialView={{ kind: "library", packKey: "clinical_governance" }} standalone={isStandalone} onExitShell={isStandalone ? undefined : () => setView("packs")} />}
      {view === "library"    && <SopLibrary tenantId={tenantId} />}
      {view === "governance" && <GovernanceSection meetings={meetings} risks={risks} actions={actions} />}
    </div>
    </HeaderActionsContext.Provider>
  );
};
