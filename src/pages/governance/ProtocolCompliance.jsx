/**
 * Protocol Compliance Dashboard.
 *
 * For a multi-practice dental group, the Clinical Director adopts each
 * clinical protocol on behalf of the group, but every clinician at every
 * practice must individually acknowledge that they have read and will
 * follow it. This view gives the CD and each Practice Manager a
 * helicopter view of where compliance sits and — crucially — which
 * specific people they need to chase.
 *
 * Three lenses:
 *   1. Group summary tile — adopted protocols, total clinicians, overall %.
 *   2. Site rollup — per-site % of clinicians fully acknowledged.
 *   3. Gap focus — protocols sorted by lowest acknowledgement %, expandable
 *      to show the named clinicians who are pending. This is the "what to
 *      chase" view that turns the dashboard into an operational tool.
 *
 * A simple site filter at the top scopes everything for PMs who only
 * care about their own practice.
 */

import { useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { BackButton, formatDate, roleLabel } from "./Shared";
import { listSites, getSite } from "../../services/governance/sites.service";
import {
  groupSummary, siteRollup, gapFocus, clinicianGapList,
} from "../../services/governance/compliance.service";
import { PROTOCOLS, getCategoryMeta } from "./ProtocolLibrary";
import styles from "./Governance.module.css";

/* Colour bands for compliance % — green ≥ 90%, amber 60–89%, red < 60%. */
function bandColor(pct) {
  if (pct >= 90) return "#2e7d32";
  if (pct >= 60) return "#b36000";
  return "#c2410c";
}

const PctPill = ({ pct }) => {
  const color = bandColor(pct);
  return (
    <Pill bg={`color-mix(in srgb, ${color} 14%, transparent)`} color={color} small>
      {pct}%
    </Pill>
  );
};

const SummaryTiles = ({ summary, siteName }) => (
  <div className={styles.complianceTileRow}>
    <div className={styles.complianceTile}>
      <div className={styles.complianceTileLabel}>{siteName ? `${siteName} · adopted` : "Protocols adopted"}</div>
      <div className={styles.complianceTileValue}>{summary.adoptedCount} <span>of {summary.totalProtocols}</span></div>
    </div>
    <div className={styles.complianceTile}>
      <div className={styles.complianceTileLabel}>Clinicians in scope</div>
      <div className={styles.complianceTileValue}>{summary.clinicianCount}</div>
    </div>
    <div className={styles.complianceTile}>
      <div className={styles.complianceTileLabel}>Acknowledgements captured</div>
      <div className={styles.complianceTileValue}>{summary.totalAcks} <span>of {summary.totalPossible}</span></div>
    </div>
    <div className={styles.complianceTile} style={{ borderLeftColor: bandColor(summary.overallPct) }}>
      <div className={styles.complianceTileLabel}>Overall coverage</div>
      <div className={styles.complianceTileValue} style={{ color: bandColor(summary.overallPct) }}>
        {summary.overallPct}%
      </div>
    </div>
  </div>
);

const SiteRollupCard = ({ rollups, activeSiteId, onPick }) => (
  <Card hover={false} className={styles.complianceCard}>
    <div className={styles.complianceCardHead}>
      <h3 className={styles.complianceCardTitle}>By practice</h3>
      <span className={styles.complianceCardHint}>Click a site to filter the rest of the dashboard.</span>
    </div>
    <div className={styles.complianceSiteList}>
      <button
        className={`${styles.complianceSiteRow} ${activeSiteId === null ? styles.complianceSiteRowActive : ""}`}
        onClick={() => onPick(null)}
      >
        <span className={styles.complianceSiteName}>All sites</span>
        <span className={styles.complianceSiteClinicians}>
          {rollups.reduce((n, r) => n + r.clinicianCount, 0)} clinicians
        </span>
        <span className={styles.complianceSiteBar}>
          <span className={styles.complianceSiteBarFill} style={{ width: `${
            rollups.length === 0 ? 0
            : Math.round(rollups.reduce((sum, r) => sum + r.coveragePct, 0) / rollups.length)
          }%`, background: "var(--primary)" }} />
        </span>
        <PctPill pct={
          rollups.length === 0 ? 0
          : Math.round(rollups.reduce((sum, r) => sum + r.coveragePct, 0) / rollups.length)
        } />
      </button>
      {rollups.map((r) => (
        <button
          key={r.site.id}
          className={`${styles.complianceSiteRow} ${activeSiteId === r.site.id ? styles.complianceSiteRowActive : ""}`}
          onClick={() => onPick(r.site.id)}
        >
          <span className={styles.complianceSiteName}>{r.site.name}</span>
          <span className={styles.complianceSiteClinicians}>{r.clinicianCount} clinicians · {r.fullyAckedCount} fully signed</span>
          <span className={styles.complianceSiteBar}>
            <span
              className={styles.complianceSiteBarFill}
              style={{ width: `${r.coveragePct}%`, background: bandColor(r.coveragePct) }}
            />
          </span>
          <PctPill pct={r.coveragePct} />
        </button>
      ))}
    </div>
  </Card>
);

const GapRow = ({ entry, sites, allUsers }) => {
  const [open, setOpen] = useState(false);
  const cat = getCategoryMeta(entry.protocol.category);
  return (
    <div className={styles.complianceGapRow}>
      <button className={styles.complianceGapHead} onClick={() => setOpen(!open)}>
        <span className={styles.complianceGapRef} style={{ color: cat.color }}>
          {entry.protocol.reference}
        </span>
        <span className={styles.complianceGapTitle}>{entry.protocol.title}</span>
        <span className={styles.complianceGapMeta}>
          {entry.acked.length} of {entry.acked.length + entry.pending.length} signed
        </span>
        <span className={styles.complianceGapBar}>
          <span
            className={styles.complianceGapBarFill}
            style={{ width: `${entry.pct}%`, background: bandColor(entry.pct) }}
          />
        </span>
        <PctPill pct={entry.pct} />
        <I name={open ? "minus" : "plus"} size={11} color="var(--outline)" />
      </button>
      {open && (
        <div className={styles.complianceGapPending}>
          <div className={styles.complianceGapPendingLabel}>
            {entry.pending.length} clinician{entry.pending.length === 1 ? "" : "s"} pending:
          </div>
          <ul className={styles.complianceGapPendingList}>
            {entry.pending.map((p) => {
              const site = p.siteId ? sites.find((s) => s.id === p.siteId) : null;
              return (
                <li key={p.id} className={styles.complianceGapPendingItem}>
                  <span className={styles.complianceGapPendingName}>{p.displayName}</span>
                  <span className={styles.complianceGapPendingRole}>{roleLabel(p.role)}</span>
                  <span className={styles.complianceGapPendingSite}>{site?.name ?? "Group"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const ClinicianRow = ({ entry, sites }) => {
  const site = entry.user.siteId ? sites.find((s) => s.id === entry.user.siteId) : null;
  return (
    <div className={styles.complianceClinicianRow}>
      <div>
        <div className={styles.complianceClinicianName}>{entry.user.displayName}</div>
        <div className={styles.complianceClinicianMeta}>
          {roleLabel(entry.user.role)} · {site?.name ?? "Group"}
        </div>
      </div>
      <div className={styles.complianceClinicianStats}>
        <span className={styles.complianceClinicianStat}>
          {entry.ackedCount} of {entry.adoptedCount}
        </span>
        <span className={styles.complianceClinicianBar}>
          <span
            className={styles.complianceClinicianBarFill}
            style={{ width: `${entry.pct}%`, background: bandColor(entry.pct) }}
          />
        </span>
        <PctPill pct={entry.pct} />
      </div>
    </div>
  );
};

export const ProtocolCompliance = ({ user, onBack, onOpenProtocol }) => {
  const sites = listSites(user.tenantId);
  const [siteId, setSiteId] = useState(null);
  const [lens, setLens] = useState("protocols"); // "protocols" | "clinicians"

  /* PROTOCOLS in the library is a list of {reference, title, data}
   * wrappers — the compliance service expects flat protocol data objects
   * (id, version, category). Flatten and drop any rows without data. */
  const protocolData = PROTOCOLS.map((p) => p.data).filter(Boolean);

  const siteFilter = siteId ? { siteId } : {};
  const summary = groupSummary(user.tenantId, protocolData);
  const siteRollups = sites.map((s) => siteRollup(user.tenantId, protocolData, s));
  const gaps = gapFocus(user.tenantId, protocolData, siteFilter);
  const clinicians = clinicianGapList(user.tenantId, protocolData, siteFilter);

  const activeSite = siteId ? getSite(user.tenantId, siteId) : null;

  /* When a site is selected, recompute summary scoped to that site. */
  const scopedSummary = siteId
    ? (() => {
        const r = siteRollups.find((x) => x.site.id === siteId);
        return {
          adoptedCount:   summary.adoptedCount,
          totalProtocols: summary.totalProtocols,
          clinicianCount: r?.clinicianCount ?? 0,
          totalPossible:  (r?.clinicianCount ?? 0) * summary.adoptedCount,
          totalAcks:      Math.round(((r?.coveragePct ?? 0) / 100) * (r?.clinicianCount ?? 0) * summary.adoptedCount),
          overallPct:     r?.coveragePct ?? 0,
        };
      })()
    : summary;

  return (
    <div>
      <BackButton onClick={onBack} label="Back to protocol library" />

      <div className={styles.pvDocHeader}>
        <div className={styles.pvDocEyebrow}>Clinical Governance · Protocol compliance</div>
        <h2 className={styles.pvDocTitle}>Protocol Compliance Dashboard</h2>
        <p className={styles.pvDocSubtitle}>
          Helicopter view of protocol adoption and clinician acknowledgement across the group.
          {activeSite && <> Filtered to <strong>{activeSite.name}</strong>.</>}
        </p>
      </div>

      <SummaryTiles summary={scopedSummary} siteName={activeSite?.name} />

      <SiteRollupCard rollups={siteRollups} activeSiteId={siteId} onPick={setSiteId} />

      <div className={styles.complianceLensTabs}>
        <button
          className={`${styles.complianceLensTab} ${lens === "protocols" ? styles.complianceLensTabActive : ""}`}
          onClick={() => setLens("protocols")}
        >
          Gap focus — by protocol
          <span className={styles.complianceLensTabCount}>{gaps.length}</span>
        </button>
        <button
          className={`${styles.complianceLensTab} ${lens === "clinicians" ? styles.complianceLensTabActive : ""}`}
          onClick={() => setLens("clinicians")}
        >
          By clinician
          <span className={styles.complianceLensTabCount}>{clinicians.length}</span>
        </button>
      </div>

      {lens === "protocols" && (
        <Card hover={false} className={styles.complianceCard}>
          <div className={styles.complianceCardHead}>
            <h3 className={styles.complianceCardTitle}>What to chase</h3>
            <span className={styles.complianceCardHint}>Adopted protocols with outstanding acknowledgements, lowest first.</span>
          </div>
          {gaps.length === 0 ? (
            <div className={styles.complianceEmpty}>
              <I name="check" size={16} color="#2e7d32" />
              Every adopted protocol is fully acknowledged by all in-scope clinicians.
            </div>
          ) : (
            <div className={styles.complianceGapList}>
              {gaps.map((entry) => (
                <GapRow key={entry.protocol.id} entry={entry} sites={sites} allUsers={[]} />
              ))}
            </div>
          )}
        </Card>
      )}

      {lens === "clinicians" && (
        <Card hover={false} className={styles.complianceCard}>
          <div className={styles.complianceCardHead}>
            <h3 className={styles.complianceCardTitle}>Clinician status</h3>
            <span className={styles.complianceCardHint}>Each in-scope clinician's signing progress across adopted protocols (lowest first).</span>
          </div>
          {clinicians.length === 0 ? (
            <div className={styles.complianceEmpty}>No clinicians in this scope yet.</div>
          ) : (
            <div className={styles.complianceClinicianList}>
              {clinicians.map((c) => (
                <ClinicianRow key={c.user.id} entry={c} sites={sites} />
              ))}
            </div>
          )}
        </Card>
      )}

      {onOpenProtocol && (
        <p className={styles.complianceFooter}>
          Tip: open any protocol from the <button className={styles.linkBtn} onClick={onBack}>protocol library</button> to adopt or acknowledge.
        </p>
      )}
    </div>
  );
};
