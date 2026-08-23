/**
 * History tab — read-only audit trail. Reads from the append-only `audit_trail`
 * table populated by `logAction()`. Filtered to the active pack by matching
 * the document / pack / site references on each event.
 */

import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { formatDateTime } from "./Shared";
import { listTrail } from "../../services/governance/auditTrail";
import styles from "./Governance.module.css";

const ACTION_LABEL = {
  approve:            { label: "Approved",            color: "#2e7d32" },
  publish:            { label: "Published",           color: "#0277bd" },
  publish_minor:      { label: "Published (minor)",   color: "#0277bd" },
  publish_major:      { label: "Published (major)",   color: "#0277bd" },
  reject:             { label: "Rejected",            color: "#e53935" },
  request_changes:    { label: "Changes requested",   color: "#b36000" },
  submit_for_review:  { label: "Submitted",           color: "#6a1b9a" },
  create_draft:       { label: "Draft created",       color: "#1565c0" },
  edit:               { label: "Edited",              color: "#1565c0" },
  configure:          { label: "Configured",          color: "#1565c0" },
  apply:              { label: "Applied to site",     color: "#2e7d32" },
  exclude:            { label: "Excluded from pack",  color: "#6b7280" },
  create:             { label: "Created",             color: "#1565c0" },
  update:             { label: "Updated",             color: "#1565c0" },
  revoke:             { label: "Revoked",             color: "#e53935" },
};

const OBJECT_LABEL = {
  pack:                  "Pack",
  document:              "Document",
  site_profile:          "Site profile",
  operator_entitlement:  "Operator entitlement",
  evidence:              "Evidence",
  acknowledgement:       "Acknowledgement",
  equipment:             "Equipment",
  audit_schedule:        "Audit",
};

export const HistoryTab = ({ user, packKey, sites }) => {
  const sitesById = Object.fromEntries((sites ?? []).map((s) => [s.id, s]));
  // Pull all trail events; we then heuristically filter by pack:
  // - Pack events whose newValue.packKey matches
  // - Document events whose objectId belongs to a doc in this pack (we don't
  //   easily know without joining; for the demo we keep all doc events and
  //   the user filters by site)
  // - Operator entitlement events are radiography-only
  const events = listTrail(user.tenantId);
  const filtered = events.filter((e) => {
    if (packKey === "radiography_irmer") {
      // Show events tagged to the radiography pack, doc-rad-* docs, operator
      // entitlement events, and any rad-* objects.
      if (e.objectType === "operator_entitlement") return true;
      if (e.objectId?.startsWith("doc-rad-")) return true;
      if (e.objectId === "pack-radiography-irmer") return true;
      if (e.newValue?.packKey === "radiography_irmer") return true;
      if (e.objectId?.startsWith("profile-rad-")) return true;
      return false;
    }
    // Decon pack: anything not explicitly radiography
    if (e.objectType === "operator_entitlement") return false;
    if (e.objectId?.startsWith("doc-rad-")) return false;
    if (e.objectId === "pack-radiography-irmer") return false;
    if (e.objectId?.startsWith("profile-rad-")) return false;
    return true;
  });

  return (
    <div>
      <h2 className={styles.areaTitle}>History</h2>
      <p className={styles.areaLead}>
        Append-only audit trail for this pack — approvals, publishes, configuration changes, and
        IRMER-specific entitlement events.
      </p>

      {filtered.length === 0 ? (
        <Card hover={false} className={styles.emptyCard}>
          <I name="clock3" size={26} color="var(--outline-variant)" />
          <p>No events recorded yet for this pack.</p>
        </Card>
      ) : (
        <Card hover={false} style={{ padding: 0, overflow: "hidden" }}>
          {filtered.map((e) => {
            const meta = ACTION_LABEL[e.action] ?? { label: e.action, color: "#6b7280" };
            const site = e.siteId ? sitesById[e.siteId] : null;
            return (
              <div key={e.id} style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 14, padding: "12px 16px",
                borderBottom: "1px solid var(--outline-variant)",
                alignItems: "center",
              }}>
                <Pill bg={`color-mix(in srgb, ${meta.color} 14%, transparent)`} color={meta.color} small>
                  {meta.label}
                </Pill>
                <div>
                  <div className={styles.cardTitle} style={{ fontSize: 13 }}>
                    {OBJECT_LABEL[e.objectType] ?? e.objectType}
                    {e.objectId && <span style={{ color: "var(--on-surface-variant)", fontWeight: 500 }}> · {e.objectId}</span>}
                  </div>
                  <div className={styles.cardLead}>
                    {e.userDisplay ?? "System"}
                    {site && ` · ${site.name}`}
                    {e.newValue?.versionNumber && ` · v${e.newValue.versionNumber}`}
                    {e.newValue?.equipmentClass && ` · ${e.newValue.equipmentClass}`}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--on-surface-variant)" }}>
                  {formatDateTime(e.at)}
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};
