/**
 * People tab — combines staff acknowledgements + (for IRMER) operator
 * entitlement summary. The full entitlement matrix is reachable from a
 * "View full matrix" drill-in, not the default view.
 *
 * Default for a practice manager / staff user: their own ack queue + a roll-up
 * of their site's acknowledgement progress + (IRMER) an at-a-glance summary
 * of operators with action required.
 */

import { useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { BtnPrimary } from "../../components/ui/Buttons";
import { Bar, formatDate } from "./Shared";
import {
  listAll as listAcks, markAcknowledged, reconcileOverdue as reconcileAckOverdue,
  ackStatsForSite,
} from "../../services/governance/acknowledgements.service";
import { getDocument, getCurrentVersion } from "../../services/governance/documents.service";
import {
  listEntitlements, entitlementStatusBucket, ENTITLEMENT_BUCKETS,
} from "../../services/governance/operatorEntitlement.service";
import { OperatorEntitlementPage } from "./OperatorEntitlementPage";
import { AckStatus, ENTITLEMENT_TYPE_LABEL, ROLE_LABEL } from "../../services/governance/types";
import styles from "./Governance.module.css";

const RADIOGRAPHY_PACK_KEY = "radiography_irmer";

const MyAckQueue = ({ user, mine, onOpenDocument, onAck }) => (
  <Card hover={false} style={{ padding: 22, marginBottom: 18 }}>
    <h3 className={styles.cardTitle}>My acknowledgement queue</h3>
    <p className={styles.cardLead}>
      {mine.length === 0
        ? "Nothing assigned to you."
        : `${mine.filter((m) => m.status === AckStatus.acknowledged).length} of ${mine.length} acknowledged.`}
    </p>
    {mine.map((a) => {
      const doc = getDocument(user.tenantId, a.documentId);
      if (!doc) return null;
      const version = getCurrentVersion(user.tenantId, a.documentId);
      return (
        <div key={a.id} className={styles.ackRow}>
          <button className={styles.ackTitle} onClick={() => onOpenDocument(a.documentId)}>{doc.title}</button>
          <div className={styles.ackMeta}>v{version?.versionNumber ?? "—"} · Due {formatDate(a.dueDate)}</div>
          {a.status === AckStatus.acknowledged ? (
            <Pill bg="rgba(46,125,50,0.10)" color="#2e7d32" small>
              <I name="check" size={10} /> Acknowledged {formatDate(a.acknowledgedAt)}
            </Pill>
          ) : (
            <BtnPrimary onClick={() => onAck(a.id)} style={{ padding: "6px 12px", fontSize: 11 }}>
              <I name="check" size={11} color="var(--on-primary)" /> Acknowledge
            </BtnPrimary>
          )}
        </div>
      );
    })}
  </Card>
);

const AcksBySite = ({ tenantId, sites }) => (
  <Card hover={false} style={{ padding: 22, marginBottom: 18 }}>
    <h3 className={styles.cardTitle}>Acknowledgements by site</h3>
    <p className={styles.cardLead}>Live completion rate per practice for this pack.</p>
    <div className={styles.siteCompList}>
      {sites.map((s) => {
        const stats = ackStatsForSite(tenantId, s.id);
        const color = stats.pct >= 90 ? "#2e7d32" : stats.pct >= 70 ? "#b36000" : stats.total === 0 ? "var(--outline)" : "#e53935";
        return (
          <div key={s.id} className={styles.siteCompRow}>
            <div className={styles.siteCompName}>{s.name}</div>
            <Bar pct={stats.pct} color={color} />
            <div className={styles.siteCompPct} style={{ color }}>
              {stats.total === 0 ? "—" : `${stats.acknowledged}/${stats.total}`}
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);

/** Per-user entitlement roll-up — one row per IRMER duty-holder showing
 *  worst-case bucket across their entitlements (so "Action required" surfaces
 *  even if only one row is overdue). */
const EntitlementSummary = ({ tenantId, allUsers, sites, siteFilter, onOpenMatrix }) => {
  const rows = listEntitlements(tenantId);
  const filtered = siteFilter ? rows.filter((r) => r.siteId === siteFilter) : rows;

  // Worst bucket priority: expired > review_due > no_evidence > revoked > entitled
  const PRIORITY = { expired: 4, review_due: 3, no_evidence: 2, revoked: 1, entitled: 0 };
  const worstBucket = (entitlements) => {
    let best = "entitled";
    for (const e of entitlements) {
      const b = entitlementStatusBucket(e);
      if (PRIORITY[b] > PRIORITY[best]) best = b;
    }
    return best;
  };

  // Group entitlements by userId
  const byUser = new Map();
  for (const r of filtered) {
    if (!byUser.has(r.userId)) byUser.set(r.userId, []);
    byUser.get(r.userId).push(r);
  }

  const userRows = [];
  for (const [userId, ents] of byUser.entries()) {
    const u = allUsers.find((x) => x.id === userId);
    if (!u) continue;
    const bucket = worstBucket(ents);
    const site = sites.find((s) => s.id === u.siteId);
    userRows.push({ user: u, site, bucket, count: ents.length });
  }
  // Sort by worst bucket, then by user name
  userRows.sort((a, b) => (PRIORITY[b.bucket] - PRIORITY[a.bucket]) || (a.user.displayName ?? "").localeCompare(b.user.displayName ?? ""));

  const totals = {
    entitled:    userRows.filter((r) => r.bucket === "entitled").length,
    review_due:  userRows.filter((r) => r.bucket === "review_due").length,
    expired:     userRows.filter((r) => r.bucket === "expired").length,
    no_evidence: userRows.filter((r) => r.bucket === "no_evidence").length,
    revoked:     userRows.filter((r) => r.bucket === "revoked").length,
  };

  return (
    <Card hover={false} style={{ padding: 22, marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 6 }}>
        <div>
          <h3 className={styles.cardTitle}>Operator entitlement</h3>
          <p className={styles.cardLead}>
            {userRows.length} duty-holders tracked · {totals.entitled} OK · {totals.review_due} review due · {totals.expired} expired · {totals.no_evidence} missing evidence
          </p>
        </div>
        <button className={styles.linkBtn} onClick={onOpenMatrix}>
          <I name="arrow" size={11} /> View full matrix
        </button>
      </div>
      {userRows.length === 0 ? (
        <p className={styles.cardLead}>No entitlement records for this filter.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 10, border: "1px solid var(--outline-variant)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          {userRows.slice(0, 12).map(({ user: u, site, bucket, count }) => {
            const meta = ENTITLEMENT_BUCKETS[bucket];
            return (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 12, padding: "10px 14px", alignItems: "center", background: "var(--surface)", borderBottom: "1px solid var(--outline-variant)" }}>
                <div>
                  <div className={styles.cardTitle} style={{ fontSize: 13 }}>{u.displayName ?? u.username}</div>
                  <div className={styles.cardLead}>{u.jobTitle ?? ROLE_LABEL[u.role]}</div>
                </div>
                <div className={styles.cardLead}>{site?.name ?? "—"}</div>
                <div style={{ fontSize: 11, color: "var(--on-surface-variant)" }}>{count} entitlement{count === 1 ? "" : "s"}</div>
                <Pill bg={`color-mix(in srgb, ${meta.color} 14%, transparent)`} color={meta.color} small>{meta.label}</Pill>
              </div>
            );
          })}
          {userRows.length > 12 && (
            <div style={{ padding: "10px 14px", textAlign: "center" }}>
              <button className={styles.linkBtn} onClick={onOpenMatrix}>
                Show all {userRows.length} duty-holders
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export const PeopleTab = ({ user, allUsers, sites, packKey, siteFilter, onOpenDocument }) => {
  const [tick, setTick] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);

  // Reconcile overdue acks on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useState(() => { reconcileAckOverdue(user.tenantId); return null; });

  const handleAck = (id) => { markAcknowledged(user, id); setTick((t) => t + 1); };

  // Acks filtered by pack + site
  const allAcksRaw = listAcks(user.tenantId);
  const acksByPack = packKey
    ? allAcksRaw.filter((a) => {
        const d = getDocument(user.tenantId, a.documentId);
        return !d || d.packKey === packKey;
      })
    : allAcksRaw;
  const acks = siteFilter ? acksByPack.filter((a) => a.siteId === siteFilter) : acksByPack;
  const mine = acks.filter((a) => a.userId === user.id);

  const visibleSites = siteFilter ? sites.filter((s) => s.id === siteFilter) : sites;

  // Drill-in: full operator entitlement matrix
  if (showMatrix && packKey === RADIOGRAPHY_PACK_KEY) {
    return (
      <div>
        <button className={styles.linkBtn} onClick={() => setShowMatrix(false)} style={{ marginBottom: 10 }}>
          <I name="back" size={11} /> Back to People
        </button>
        <OperatorEntitlementPage user={user} allUsers={allUsers} sites={sites} siteFilter={siteFilter} />
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.areaTitle}>People</h2>
      <p className={styles.areaLead}>
        Staff acknowledgements and {packKey === RADIOGRAPHY_PACK_KEY ? "IRMER operator entitlements " : ""}for this pack.
      </p>

      <MyAckQueue user={user} mine={mine} onOpenDocument={onOpenDocument} onAck={handleAck} />

      {packKey === RADIOGRAPHY_PACK_KEY && (
        <EntitlementSummary
          tenantId={user.tenantId}
          allUsers={allUsers}
          sites={sites}
          siteFilter={siteFilter}
          onOpenMatrix={() => setShowMatrix(true)}
        />
      )}

      <AcksBySite tenantId={user.tenantId} sites={visibleSites} />
    </div>
  );
};
