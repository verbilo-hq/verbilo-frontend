/**
 * Overview tab — simplified per the mockups:
 *   1. Pack meta strip (Status / Sites applied / Next review / Owner)
 *   2. 4-5 headline tiles (compliance / acks / evidence / audits overdue)
 *      For IRMER, swap one tile for Operator Entitlement.
 *   3. Compliance by site bar chart
 *   4. Alerts callout — overdue evidence, expired docs, RPA/MPE review,
 *      config gaps. One unified list, not five tiles.
 *
 * Every tile + every alert reads from stored data via the existing service
 * helpers; no hard-coded numbers.
 */

import { useEffect } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { StatTile, Bar, SiteStatusPill, formatDate } from "./Shared";
import { getPackInstance, DECON_PACK_KEY } from "../../services/governance/packs.service";
import { listSites } from "../../services/governance/sites.service";
import { listProfiles } from "../../services/governance/siteProfiles.service";
import { listAll as listEquipmentAll, serviceStatusBucket } from "../../services/governance/equipment.service";
import { listDocuments, reconcileReviewDueStatuses } from "../../services/governance/documents.service";
import { listAll as listAcks, ackStatsForTenant, ackStatsForSite, reconcileOverdue as reconcileAckOverdue } from "../../services/governance/acknowledgements.service";
import { list as listEvidence, evidenceStatsForTenant, evidenceStatsForSite, reconcileEvidenceStatus } from "../../services/governance/evidence.service";
import { listSchedules, reconcileOverdue as reconcileAuditOverdue } from "../../services/governance/audits.service";
import { listEntitlements, entitlementStatusBucket } from "../../services/governance/operatorEntitlement.service";
import { userDisplay } from "../../services/governance/users.service";
import { DocumentStatus, AUDIT_TYPES } from "../../services/governance/types";
import styles from "./Governance.module.css";

const RADIOGRAPHY_PACK_KEY = "radiography_irmer";

/* ─── Shared building blocks ─────────────────────────────────────────────── */

const PackMetaStrip = ({ pack, appliedCount, sitesTotal, owner, nextReviewDate }) => {
  const statusColor = pack?.status === "live" ? "#2e7d32"
                    : pack?.status === "awaiting_approval" ? "#6a1b9a"
                    : "#1565c0";
  return (
    <div className={styles.packMetaStrip}>
      <div className={styles.packMetaCell}>
        <span className={styles.packMetaCellLabel}>Status</span>
        <Pill bg={`color-mix(in srgb, ${statusColor} 14%, transparent)`} color={statusColor} small>
          {pack?.status === "live" ? "Live" : pack?.status === "awaiting_approval" ? "Awaiting approval" : "In setup"}
        </Pill>
      </div>
      <div className={styles.packMetaCell}>
        <span className={styles.packMetaCellLabel}>Sites applied</span>
        <span className={styles.packMetaCellValue}>{appliedCount} of {sitesTotal}</span>
      </div>
      <div className={styles.packMetaCell}>
        <span className={styles.packMetaCellLabel}>Next review</span>
        <span className={styles.packMetaCellValue}>{formatDate(nextReviewDate)}</span>
      </div>
      <div className={styles.packMetaCell}>
        <span className={styles.packMetaCellLabel}>Owner</span>
        <span className={styles.packMetaCellValue}>{owner ?? "—"}</span>
      </div>
    </div>
  );
};

const AlertsCard = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <Card hover={false} style={{ padding: 22, marginTop: 18 }}>
        <h3 className={styles.cardTitle}><I name="check" size={14} color="#2e7d32" /> No outstanding actions</h3>
        <p className={styles.cardLead}>All evidence, audits, reviews and acknowledgements are up to date.</p>
      </Card>
    );
  }
  return (
    <Card hover={false} style={{ padding: 22, marginTop: 18 }}>
      <h3 className={styles.cardTitle}>Action required</h3>
      <p className={styles.cardLead}>{alerts.length} item{alerts.length === 1 ? "" : "s"} need attention.</p>
      <div className={styles.alertList}>
        {alerts.map((a, i) => (
          <div key={i} className={styles.alertRow}>
            <I name={a.icon ?? "alert"} size={14} color={a.color} />
            <div>
              <div className={styles.alertRowTitle}>{a.title}</div>
              <div className={styles.alertRowMeta}>{a.detail}</div>
            </div>
            <span className={styles.alertRowSev} style={{ background: `color-mix(in srgb, ${a.color} 14%, transparent)`, color: a.color }}>
              {a.severity}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const ComplianceBySite = ({ tenantId, sites, getSiteRatio }) => (
  <Card hover={false} style={{ padding: 22, marginTop: 18 }}>
    <h3 className={styles.cardTitle}>Compliance by site</h3>
    <p className={styles.cardLead}>Weighted combination of acknowledgements and evidence.</p>
    <div className={styles.siteCompList}>
      {sites.map((s) => {
        const ratio = getSiteRatio(s.id);
        const color = ratio.pct >= 90 ? "#2e7d32" : ratio.pct >= 70 ? "#b36000" : ratio.empty ? "var(--outline-variant)" : "#e53935";
        return (
          <div key={s.id} className={styles.siteCompRow}>
            <div className={styles.siteCompName}>{s.name}</div>
            <Bar pct={ratio.pct} color={color} />
            <div className={styles.siteCompPct} style={{ color }}>{ratio.empty ? "—" : `${ratio.pct}%`}</div>
            <SiteStatusPill status={s.status} />
          </div>
        );
      })}
    </div>
  </Card>
);

/* ─── Decon Pack Overview ────────────────────────────────────────────────── */

export const DeconPackDashboard = ({ user, siteFilter, packKey = DECON_PACK_KEY }) => {
  const tenantId = user.tenantId;
  useEffect(() => {
    reconcileReviewDueStatuses(tenantId);
    reconcileAckOverdue(tenantId);
    reconcileEvidenceStatus(tenantId);
    reconcileAuditOverdue(tenantId);
  }, [tenantId]);

  const pack = getPackInstance(tenantId, packKey);
  const allSites = listSites(tenantId);
  const profiles = pack ? listProfiles(tenantId, pack.id) : [];
  const appliedProfiles = profiles.filter((p) => p.applied);
  const sites = siteFilter ? allSites.filter((s) => s.id === siteFilter) : allSites;

  const allDocs = listDocuments(tenantId, { packKey, includeArchived: false });
  const reviewDue = allDocs.filter((d) => d.status === DocumentStatus.review_due).length;
  const expired   = allDocs.filter((d) => d.status === DocumentStatus.expired).length;

  const ackStats      = siteFilter ? ackStatsForSite(tenantId, siteFilter)      : ackStatsForTenant(tenantId);
  const evidenceStats = siteFilter ? evidenceStatsForSite(tenantId, siteFilter) : evidenceStatsForTenant(tenantId);

  const auditsAll = listSchedules(tenantId).filter((s) =>
    AUDIT_TYPES.find((a) => a.id === s.auditType)?.pack === packKey,
  );
  const audits = siteFilter ? auditsAll.filter((a) => a.siteId === siteFilter) : auditsAll;
  const audOverdue = audits.filter((a) => a.overdue).length;

  const equipment = listEquipmentAll(tenantId)
    .filter((e) => !e.packKey || e.packKey === packKey)
    .filter((e) => !siteFilter || e.siteId === siteFilter);
  const equipOverdue = equipment.filter((e) => serviceStatusBucket(e) === "overdue").length;

  const compliance = Math.round(((ackStats.pct || 0) + (evidenceStats.pct || 0)) / 2);

  // Alerts: overdue evidence (top 3), expired docs, review-due docs, equipment overdue
  const alerts = [];
  if (audOverdue > 0)        alerts.push({ icon: "checksquare", color: "#e53935", title: `${audOverdue} audit${audOverdue === 1 ? "" : "s"} overdue`,                 detail: "Schedule and complete to clear the action", severity: "Action" });
  if (expired > 0)           alerts.push({ icon: "file",        color: "#e53935", title: `${expired} document${expired === 1 ? "" : "s"} expired`,                   detail: "Re-approve and publish a new version",      severity: "Critical" });
  if (reviewDue > 0)         alerts.push({ icon: "clock3",      color: "#b36000", title: `${reviewDue} document${reviewDue === 1 ? "" : "s"} review due`,             detail: "Schedule annual review",                     severity: "Soon" });
  if (ackStats.overdue > 0)  alerts.push({ icon: "usercheck",   color: "#b36000", title: `${ackStats.overdue} staff acknowledgement${ackStats.overdue === 1 ? "" : "s"} overdue`, detail: "Send reminders",                         severity: "Soon" });
  if (evidenceStats.overdue > 0) alerts.push({ icon: "file",    color: "#e53935", title: `${evidenceStats.overdue} evidence record${evidenceStats.overdue === 1 ? "" : "s"} overdue`, detail: "Upload outstanding evidence", severity: "Action" });
  if (equipOverdue > 0)      alerts.push({ icon: "clipboard",   color: "#e53935", title: `${equipOverdue} equipment item${equipOverdue === 1 ? "" : "s"} overdue for service`, detail: "Book service appointment",            severity: "Action" });

  const getSiteRatio = (siteId) => {
    const ack = ackStatsForSite(tenantId, siteId);
    const ev = evidenceStatsForSite(tenantId, siteId);
    if (ack.total === 0 && ev.total === 0) return { pct: 0, empty: true };
    return { pct: Math.round(((ack.pct || 0) + (ev.pct || 0)) / 2), empty: false };
  };

  return (
    <div>
      <PackMetaStrip
        pack={pack}
        appliedCount={appliedProfiles.length}
        sitesTotal={allSites.length}
        owner={userDisplay(tenantId, pack?.groupIpcLeadUserId)}
        nextReviewDate={null}
      />

      <div className={styles.dashGrid} style={{ marginTop: 14 }}>
        <StatTile label="IPC Compliance"        value={`${compliance}%`}         icon="shield"      color={compliance >= 90 ? "#2e7d32" : compliance >= 70 ? "#b36000" : "#e53935"} helper="Acks + evidence average" />
        <StatTile label="Acknowledgements"      value={`${ackStats.pct}%`}       icon="usercheck"   color={ackStats.pct >= 90 ? "#2e7d32" : "#b36000"} helper={`${ackStats.acknowledged}/${ackStats.total} complete`} />
        <StatTile label="Evidence Completion"   value={`${evidenceStats.pct}%`}  icon="file"        color={evidenceStats.pct >= 90 ? "#2e7d32" : evidenceStats.pct >= 70 ? "#b36000" : "#e53935"} helper={`${evidenceStats.accepted}/${evidenceStats.total} accepted`} />
        <StatTile label="Audits Overdue"        value={audOverdue}               icon="checksquare" color={audOverdue > 0 ? "#e53935" : "#2e7d32"} helper={`${audits.length} scheduled`} />
      </div>

      <ComplianceBySite tenantId={tenantId} sites={sites} getSiteRatio={getSiteRatio} />
      <AlertsCard alerts={alerts} />
    </div>
  );
};

/* ─── IRMER Pack Overview ────────────────────────────────────────────────── */

export const IRMERPackDashboard = ({ user, siteFilter }) => {
  const tenantId = user.tenantId;
  useEffect(() => {
    reconcileReviewDueStatuses(tenantId);
    reconcileAckOverdue(tenantId);
    reconcileEvidenceStatus(tenantId);
    reconcileAuditOverdue(tenantId);
  }, [tenantId]);

  const pack = getPackInstance(tenantId, RADIOGRAPHY_PACK_KEY);
  const allSites = listSites(tenantId);
  const profiles = pack ? listProfiles(tenantId, pack.id) : [];
  const appliedProfiles = profiles.filter((p) => p.applied);
  const sites = siteFilter ? allSites.filter((s) => s.id === siteFilter) : allSites;

  const allDocs = listDocuments(tenantId, { packKey: RADIOGRAPHY_PACK_KEY, includeArchived: false });
  const reviewDue = allDocs.filter((d) => d.status === DocumentStatus.review_due).length;
  const expired   = allDocs.filter((d) => d.status === DocumentStatus.expired).length;

  const docIds = new Set(allDocs.map((d) => d.id));
  const allAcks = listAcks(tenantId).filter((a) => docIds.has(a.documentId));
  const acks = siteFilter ? allAcks.filter((a) => a.siteId === siteFilter) : allAcks;
  const ackTotal = acks.length;
  const ackAck   = acks.filter((a) => a.status === "acknowledged").length;
  const ackPct   = ackTotal ? Math.round((ackAck / ackTotal) * 100) : 0;
  const ackOver  = acks.filter((a) => a.status === "overdue").length;

  const allEvidence = listEvidence(tenantId).filter((e) => e.packKey === RADIOGRAPHY_PACK_KEY || docIds.has(e.documentId));
  const ev = siteFilter ? allEvidence.filter((e) => e.siteId === siteFilter) : allEvidence;
  const evActionable = ev.filter((e) => e.status !== "not_applicable");
  const evAccepted   = evActionable.filter((e) => e.status === "accepted").length;
  const evOverdue    = evActionable.filter((e) => e.status === "overdue").length;
  const evPct        = evActionable.length ? Math.round((evAccepted / evActionable.length) * 100) : 0;

  const auditsAll = listSchedules(tenantId).filter((s) =>
    AUDIT_TYPES.find((a) => a.id === s.auditType)?.pack === RADIOGRAPHY_PACK_KEY,
  );
  const audits = siteFilter ? auditsAll.filter((a) => a.siteId === siteFilter) : auditsAll;
  const audOverdue = audits.filter((a) => a.overdue).length;

  // Entitlements
  const allEnts = listEntitlements(tenantId);
  const ents = siteFilter ? allEnts.filter((e) => e.siteId === siteFilter) : allEnts;
  const entOK    = ents.filter((e) => entitlementStatusBucket(e) === "entitled").length;
  const entTotal = ents.length;
  const entPct   = entTotal ? Math.round((entOK / entTotal) * 100) : 0;
  const entExpired   = ents.filter((e) => entitlementStatusBucket(e) === "expired").length;
  const entReviewDue = ents.filter((e) => entitlementStatusBucket(e) === "review_due").length;
  const entNoEv      = ents.filter((e) => entitlementStatusBucket(e) === "no_evidence").length;

  const equipment = listEquipmentAll(tenantId).filter((e) => e.packKey === RADIOGRAPHY_PACK_KEY);
  const eqScoped = siteFilter ? equipment.filter((e) => e.siteId === siteFilter) : equipment;
  const eqOverdue = eqScoped.filter((e) => serviceStatusBucket(e) === "overdue").length;

  // Configuration gaps
  const configGapSites = appliedProfiles.filter((p) =>
    !p.rpsUserId || !p.localRulesRequired || !p.rpaProviderName ||
    equipment.filter((e) => e.siteId === p.siteId).length === 0,
  );

  // RPA / MPE review timing
  const nowMs = Date.now();
  const isOverdue = (iso) => iso && new Date(iso).getTime() < nowMs;
  const rpaOverdue = appliedProfiles.filter((p) => isOverdue(p.rpaReviewDate)).length;
  const mpeOverdue = appliedProfiles.filter((p) => isOverdue(p.mpeReviewDate)).length;

  const compliance = Math.round((ackPct + evPct + entPct) / 3);

  const alerts = [];
  if (audOverdue > 0)    alerts.push({ icon: "checksquare", color: "#e53935", title: `${audOverdue} audit${audOverdue === 1 ? "" : "s"} overdue`, detail: "Image quality / local rules / QA — schedule and complete", severity: "Action" });
  if (expired > 0)       alerts.push({ icon: "file",        color: "#e53935", title: `${expired} controlled document expired`, detail: "Re-approve and publish a new version", severity: "Critical" });
  if (entExpired > 0)    alerts.push({ icon: "usercheck",   color: "#e53935", title: `${entExpired} operator entitlement${entExpired === 1 ? "" : "s"} expired`, detail: "Re-train and re-attest before next exposure", severity: "Critical" });
  if (entReviewDue > 0)  alerts.push({ icon: "clock3",      color: "#b36000", title: `${entReviewDue} entitlement${entReviewDue === 1 ? "" : "s"} review due`, detail: "Annual review with RPS", severity: "Soon" });
  if (entNoEv > 0)       alerts.push({ icon: "file",        color: "#1565c0", title: `${entNoEv} entitlement${entNoEv === 1 ? "" : "s"} missing evidence`, detail: "Upload training certificates", severity: "Required" });
  if (reviewDue > 0)     alerts.push({ icon: "clock3",      color: "#b36000", title: `${reviewDue} document${reviewDue === 1 ? "" : "s"} review due`, detail: "Schedule annual review", severity: "Soon" });
  if (ackOver > 0)       alerts.push({ icon: "usercheck",   color: "#b36000", title: `${ackOver} acknowledgement${ackOver === 1 ? "" : "s"} overdue`, detail: "Send reminders", severity: "Soon" });
  if (evOverdue > 0)     alerts.push({ icon: "file",        color: "#e53935", title: `${evOverdue} evidence record${evOverdue === 1 ? "" : "s"} overdue`, detail: "Upload outstanding evidence", severity: "Action" });
  if (eqOverdue > 0)     alerts.push({ icon: "clipboard",   color: "#e53935", title: `${eqOverdue} radiography unit${eqOverdue === 1 ? "" : "s"} overdue for service`, detail: "Book service appointment", severity: "Action" });
  if (rpaOverdue > 0)    alerts.push({ icon: "shield",      color: "#e53935", title: `${rpaOverdue} site${rpaOverdue === 1 ? "" : "s"} with RPA review overdue`, detail: "Contact Radiation Protection Adviser", severity: "Critical" });
  if (mpeOverdue > 0)    alerts.push({ icon: "shield",      color: "#e53935", title: `${mpeOverdue} site${mpeOverdue === 1 ? "" : "s"} with MPE review overdue`, detail: "Contact Medical Physics Expert", severity: "Critical" });
  for (const p of configGapSites) {
    const site = allSites.find((s) => s.id === p.siteId);
    const missing = [];
    if (!p.rpsUserId)           missing.push("RPS not assigned");
    if (!p.localRulesRequired)  missing.push("local rules");
    if (!p.rpaProviderName)     missing.push("RPA contact");
    if (equipment.filter((e) => e.siteId === p.siteId).length === 0) missing.push("equipment");
    alerts.push({ icon: "alert", color: "#b36000", title: `${site?.name ?? "Site"} configuration gap`, detail: `Missing: ${missing.join(", ")}`, severity: "Setup" });
  }

  const getSiteRatio = (siteId) => {
    const profile = profiles.find((p) => p.siteId === siteId);
    if (!profile) return { pct: 0, empty: true };
    if (!profile.applied) return { pct: 0, empty: true };
    const sAcks = allAcks.filter((a) => a.siteId === siteId);
    const sPct = sAcks.length ? Math.round((sAcks.filter((a) => a.status === "acknowledged").length / sAcks.length) * 100) : 0;
    const sEv = allEvidence.filter((e) => e.siteId === siteId && e.status !== "not_applicable");
    const sEvPct = sEv.length ? Math.round((sEv.filter((e) => e.status === "accepted").length / sEv.length) * 100) : 0;
    const sEnt = allEnts.filter((e) => e.siteId === siteId);
    const sEntPct = sEnt.length ? Math.round((sEnt.filter((e) => entitlementStatusBucket(e) === "entitled").length / sEnt.length) * 100) : 0;
    return { pct: Math.round((sPct + sEvPct + sEntPct) / 3), empty: false };
  };

  return (
    <div>
      <PackMetaStrip
        pack={pack}
        appliedCount={appliedProfiles.length}
        sitesTotal={allSites.length}
        owner={userDisplay(tenantId, pack?.groupIrmerLeadUserId)}
        nextReviewDate={null}
      />

      <div className={styles.dashGrid} style={{ marginTop: 14 }}>
        <StatTile label="IRMER Compliance"     value={`${compliance}%`}     icon="shield"      color={compliance >= 90 ? "#2e7d32" : compliance >= 70 ? "#b36000" : "#e53935"} helper="Acks + evidence + entitlement" />
        <StatTile label="Acknowledgements"     value={`${ackPct}%`}         icon="usercheck"   color={ackPct >= 90 ? "#2e7d32" : "#b36000"} helper={`${ackAck}/${ackTotal} complete · ${ackOver} overdue`} />
        <StatTile label="Operator Entitlement" value={`${entPct}%`}         icon="usercheck"   color={entPct >= 90 ? "#2e7d32" : entPct >= 70 ? "#b36000" : "#e53935"} helper={`${entOK}/${entTotal} entitled`} />
        <StatTile label="Evidence Completion"  value={`${evPct}%`}          icon="file"        color={evPct >= 90 ? "#2e7d32" : evPct >= 70 ? "#b36000" : "#e53935"} helper={`${evAccepted}/${evActionable.length} accepted`} />
        <StatTile label="Audits Overdue"       value={audOverdue}           icon="checksquare" color={audOverdue > 0 ? "#e53935" : "#2e7d32"} helper={`${audits.length} scheduled`} />
      </div>

      <ComplianceBySite tenantId={tenantId} sites={sites} getSiteRatio={getSiteRatio} />
      <AlertsCard alerts={alerts} />
    </div>
  );
};
