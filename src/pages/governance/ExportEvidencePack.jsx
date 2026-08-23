import { useEffect } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { DocStatusPill, EvidenceStatusPill, SiteStatusPill, formatDate } from "./Shared";
import { getPackInstance, getPackCatalogueEntry, DECON_PACK_KEY } from "../../services/governance/packs.service";
import { listSites } from "../../services/governance/sites.service";
import { listProfiles } from "../../services/governance/siteProfiles.service";
import { listAll as listEquipmentAll } from "../../services/governance/equipment.service";
import { listDocuments, listVersions, getCurrentVersion } from "../../services/governance/documents.service";
import { listAll as listAllAcks } from "../../services/governance/acknowledgements.service";
import { list as listEvidence } from "../../services/governance/evidence.service";
import { listSchedules } from "../../services/governance/audits.service";
import { listTrail } from "../../services/governance/auditTrail";
import { listEntitlements, entitlementStatusBucket, ENTITLEMENT_BUCKETS } from "../../services/governance/operatorEntitlement.service";
import { userDisplay } from "../../services/governance/users.service";
import {
  DocumentStatus, AckStatus, EvidenceStatus, AUDIT_TYPES, EQUIPMENT_TYPE_LABEL,
  ENTITLEMENT_TYPE_LABEL,
} from "../../services/governance/types";
import styles from "./Governance.module.css";

const RADIOGRAPHY_PACK_KEY = "radiography_irmer";

/* ─── Aggregations ─────────────────────────────────────────────────────────── */

function buildExportPayload(tenantId, siteFilter, allUsers, packKey = DECON_PACK_KEY) {
  const pack  = getPackInstance(tenantId, packKey);
  const sites = listSites(tenantId);
  const profiles = pack ? listProfiles(tenantId, pack.id) : [];

  const inFilter = (siteId) => !siteFilter || siteId === siteFilter;

  const filteredSites = siteFilter ? sites.filter((s) => s.id === siteFilter) : sites;
  const filteredProfiles = profiles.filter((p) => inFilter(p.siteId));
  // Equipment is pack-scoped by the packKey column when seeded.
  const equipment = listEquipmentAll(tenantId)
    .filter((e) => !e.packKey || e.packKey === packKey)
    .filter((e) => inFilter(e.siteId));

  // Documents scoped to this pack
  const allDocs = listDocuments(tenantId, { packKey, includeArchived: true });
  const policies = allDocs.filter((d) => d.type === "policy");
  const sops     = allDocs.filter((d) => d.type === "sop");
  const appendices = allDocs.filter((d) => d.type === "appendix"
    && (!siteFilter || d.appliesToSiteId === siteFilter));
  const auditTools = allDocs.filter((d) => d.type === "audit_tool");

  const versions = [];
  for (const d of [...policies, ...sops, ...appendices]) {
    const vs = listVersions(tenantId, d.id);
    for (const v of vs) versions.push({ doc: d, version: v });
  }

  // Acks / evidence / audits scoped to this pack via document ID / audit type / packKey
  const docIdSet = new Set(allDocs.map((d) => d.id));
  const auditTypeSet = new Set(AUDIT_TYPES.filter((a) => a.pack === packKey).map((a) => a.id));

  const acks = listAllAcks(tenantId)
    .filter((a) => docIdSet.has(a.documentId))
    .filter((a) => inFilter(a.siteId));
  const evidence = listEvidence(tenantId)
    .filter((e) => (e.packKey === packKey) || docIdSet.has(e.documentId))
    .filter((e) => inFilter(e.siteId));
  const audits = listSchedules(tenantId)
    .filter((a) => auditTypeSet.has(a.auditType))
    .filter((a) => inFilter(a.siteId));

  // Operator entitlements (radiography only)
  const entitlements = packKey === RADIOGRAPHY_PACK_KEY
    ? listEntitlements(tenantId).filter((e) => inFilter(e.siteId))
    : [];

  const trail = listTrail(tenantId).slice(0, 50);

  const overdue = {
    acks: acks.filter((a) => a.status === AckStatus.overdue),
    evidence: evidence.filter((e) =>
      e.status === EvidenceStatus.overdue || e.status === EvidenceStatus.expired || e.status === EvidenceStatus.rejected),
    audits: audits.filter((a) => a.overdue),
    docsExpired: allDocs.filter((d) => d.status === DocumentStatus.expired),
    docsReviewDue: allDocs.filter((d) => d.status === DocumentStatus.review_due),
    entitlements: entitlements.filter((e) => {
      const b = entitlementStatusBucket(e);
      return b === "expired" || b === "review_due" || b === "no_evidence";
    }),
  };

  const reviewCalendar = versions
    .filter((vw) => vw.version.nextReviewDate && (vw.version.status === DocumentStatus.published || vw.version.status === DocumentStatus.review_due))
    .map((vw) => ({ doc: vw.doc, version: vw.version, due: vw.version.nextReviewDate }))
    .sort((a, b) => Date.parse(a.due) - Date.parse(b.due));

  return {
    pack, packKey,
    sites: filteredSites,
    profiles: filteredProfiles,
    equipment,
    policies, sops, appendices, auditTools,
    versions,
    acks, evidence, audits,
    entitlements,
    trail, overdue, reviewCalendar,
  };
}

/* ─── Section components ───────────────────────────────────────────────────── */

const SectionCard = ({ title, count, children }) => (
  <Card hover={false} className={styles.exportSection}>
    <div className={styles.exportSectionHead}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <Pill bg="var(--surface-container)" color="var(--on-surface-variant)" small>{count}</Pill>
    </div>
    {children}
  </Card>
);

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export const ExportEvidencePack = ({ user, siteFilter, allUsers, packKey = DECON_PACK_KEY }) => {
  const data = buildExportPayload(user.tenantId, siteFilter, allUsers, packKey);
  const sitesById = Object.fromEntries(data.sites.map((s) => [s.id, s]));
  const userName = (userId, fallback = "—") => userDisplay(user.tenantId, userId, fallback);
  const packEntry = getPackCatalogueEntry(packKey);
  const isIRMER = packKey === RADIOGRAPHY_PACK_KEY;

  const subtitle = siteFilter
    ? `Filtered to ${sitesById[siteFilter]?.name ?? siteFilter}`
    : `All ${data.sites.length} sites in ${data.pack?.groupName ?? "this group"}`;

  const handlePrint = () => window.print();

  // Per-pack overview key-value rows
  const overviewKVs = isIRMER ? [
    { label: "Group",                value: data.pack?.groupName ?? "—" },
    { label: "Pack",                 value: "Radiography & IRMER" },
    { label: "Status",               value: data.pack?.status ?? "—" },
    { label: "Clinical Director",    value: userName(data.pack?.clinicalDirectorUserId) },
    { label: "Group IRMER Lead",     value: userName(data.pack?.groupIrmerLeadUserId) },
    { label: "Governance Lead",      value: userName(data.pack?.groupGovernanceLeadUserId) },
    { label: "RPA contact",          value: data.pack?.rpaProviderName || "—" },
    { label: "MPE contact",          value: data.pack?.mpeProviderName || "—" },
    { label: "Review cycle",         value: `${data.pack?.reviewCycleMonths ?? "—"} months` },
  ] : [
    { label: "Group",                value: data.pack?.groupName ?? "—" },
    { label: "Pack",                 value: "Decontamination & IPC" },
    { label: "Status",               value: data.pack?.status ?? "—" },
    { label: "Clinical Director",    value: userName(data.pack?.clinicalDirectorUserId) },
    { label: "Group IPC Lead",       value: userName(data.pack?.groupIpcLeadUserId) },
    { label: "Group Decon Lead",     value: userName(data.pack?.groupDeconLeadUserId) },
    { label: "Review cycle",         value: `${data.pack?.reviewCycleMonths ?? "—"} months` },
  ];

  return (
    <div className={styles.exportRoot}>
      <div className={styles.exportHeader}>
        <div>
          <div className={styles.areaEyebrow}>{packEntry?.name ?? "Governance Pack"}</div>
          <h2 className={styles.areaTitle}>Export {isIRMER ? "Radiography & IRMER " : ""}Evidence Pack</h2>
          <p className={styles.areaLead}>
            Inspection-ready snapshot of the {packEntry?.name ?? "pack"} assembled from real stored
            data. {subtitle}.
          </p>
        </div>
        <div className={styles.exportActions}>
          <BtnSecondary onClick={handlePrint}><I name="download" size={13} /> Print preview</BtnSecondary>
          <BtnPrimary disabled style={{ opacity: 0.65 }}>
            <I name="download" size={13} color="var(--on-primary)" /> Generate PDF (Phase 2)
          </BtnPrimary>
        </div>
      </div>

      <div className={styles.exportContent}>

        {/* Pack overview */}
        <SectionCard title="Pack Overview" count="1">
          <div className={styles.kvGrid}>
            {overviewKVs.map((kv) => (
              <div key={kv.label}><span className={styles.kvLabel}>{kv.label}</span><span>{kv.value}</span></div>
            ))}
          </div>
        </SectionCard>

        {/* RPA / MPE contact + review summary — IRMER only */}
        {isIRMER && (
          <SectionCard title="RPA / MPE contact & review" count={data.profiles.filter((p) => p.applied).length}>
            <table className={styles.exportTable}>
              <thead><tr><th>Site</th><th>RPA provider</th><th>RPA review due</th><th>MPE provider</th><th>MPE review due</th></tr></thead>
              <tbody>
                {data.profiles.filter((p) => p.applied).map((p) => (
                  <tr key={p.id}>
                    <td>{sitesById[p.siteId]?.name ?? p.siteId}</td>
                    <td>{p.rpaProviderName || <em>missing</em>}</td>
                    <td>{formatDate(p.rpaReviewDate)}</td>
                    <td>{p.mpeProviderName || <em>missing</em>}</td>
                    <td>{formatDate(p.mpeReviewDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        )}

        {/* Operator entitlement summary — IRMER only */}
        {isIRMER && data.entitlements.length > 0 && (
          <SectionCard title="Operator Entitlement Summary" count={data.entitlements.length}>
            <table className={styles.exportTable}>
              <thead><tr><th>Operator</th><th>Site</th><th>Entitlement</th><th>Status</th><th>Review</th><th>Approved by</th></tr></thead>
              <tbody>
                {data.entitlements.slice(0, 80).map((e) => {
                  const bucket = entitlementStatusBucket(e);
                  const meta = ENTITLEMENT_BUCKETS[bucket];
                  return (
                    <tr key={e.id}>
                      <td>{userName(e.userId)}</td>
                      <td>{sitesById[e.siteId]?.name ?? e.siteId}</td>
                      <td>{ENTITLEMENT_TYPE_LABEL[e.equipmentClass] ?? e.equipmentClass}</td>
                      <td><span style={{ color: meta.color }}>{meta.label}</span></td>
                      <td>{formatDate(e.reviewDate)}</td>
                      <td>{userName(e.approvedByUserId)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {data.entitlements.length > 80 && (
              <p className={styles.cardLead}>… and {data.entitlements.length - 80} more rows in full export.</p>
            )}
          </SectionCard>
        )}

        {/* Sites + status */}
        <SectionCard title="Sites" count={data.sites.length}>
          <table className={styles.exportTable}>
            <thead><tr><th>Site</th><th>Location</th><th>Status</th><th>Active</th></tr></thead>
            <tbody>
              {data.sites.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.location ?? "—"}</td>
                  <td><SiteStatusPill status={s.status} /></td>
                  <td>{s.active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* Live policies */}
        <SectionCard title="Live Policies" count={data.policies.filter((d) => d.status === DocumentStatus.published).length}>
          <table className={styles.exportTable}>
            <thead><tr><th>Policy</th><th>v</th><th>Status</th><th>Next review</th></tr></thead>
            <tbody>
              {data.policies.map((d) => {
                const v = getCurrentVersion(user.tenantId, d.id);
                return (
                  <tr key={d.id}>
                    <td>{d.title}</td>
                    <td>{v?.versionNumber ?? "—"}</td>
                    <td><DocStatusPill status={d.status} /></td>
                    <td>{formatDate(v?.nextReviewDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SectionCard>

        {/* SOPs */}
        <SectionCard title="SOP Register" count={data.sops.length}>
          <table className={styles.exportTable}>
            <thead><tr><th>SOP</th><th>v</th><th>Status</th><th>Approver</th><th>Published</th><th>Next review</th></tr></thead>
            <tbody>
              {data.sops.map((d) => {
                const v = getCurrentVersion(user.tenantId, d.id);
                return (
                  <tr key={d.id}>
                    <td>{d.title}</td>
                    <td>{v?.versionNumber ?? "—"}</td>
                    <td><DocStatusPill status={d.status} /></td>
                    <td>{userName(v?.approverUserId)}</td>
                    <td>{formatDate(v?.publishedAt)}</td>
                    <td>{formatDate(v?.nextReviewDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SectionCard>

        {/* Version history (across all docs) */}
        <SectionCard title="Version history" count={data.versions.length}>
          <table className={styles.exportTable}>
            <thead><tr><th>Document</th><th>Version</th><th>Status</th><th>Approved</th><th>Published</th><th>Archived</th></tr></thead>
            <tbody>
              {data.versions.map((vw) => (
                <tr key={vw.version.id}>
                  <td>{vw.doc.title}</td>
                  <td>v{vw.version.versionNumber}</td>
                  <td><DocStatusPill status={vw.version.status} /></td>
                  <td>{formatDate(vw.version.approvedAt)}</td>
                  <td>{formatDate(vw.version.publishedAt)}</td>
                  <td>{formatDate(vw.version.archivedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* Equipment register */}
        <SectionCard title="Equipment Register" count={data.equipment.length}>
          <table className={styles.exportTable}>
            <thead><tr><th>Site</th><th>Type</th><th>Make/Model</th><th>Serial</th><th>Last service</th><th>Next service</th></tr></thead>
            <tbody>
              {data.equipment.map((e) => (
                <tr key={e.id}>
                  <td>{sitesById[e.siteId]?.name ?? "—"}</td>
                  <td>{EQUIPMENT_TYPE_LABEL[e.type]}</td>
                  <td>{e.makeModel}</td>
                  <td>{e.serialNumber ?? "—"}</td>
                  <td>{formatDate(e.lastServiceDate)}</td>
                  <td>{formatDate(e.nextServiceDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* Acknowledgement summary */}
        <SectionCard title="Staff acknowledgements summary" count={data.acks.length}>
          {(() => {
            const total = data.acks.length;
            const ack   = data.acks.filter((a) => a.status === AckStatus.acknowledged).length;
            const over  = data.acks.filter((a) => a.status === AckStatus.overdue).length;
            const pct   = total ? Math.round((ack / total) * 100) : 0;
            return <p className={styles.bodyText}>{ack} acknowledged · {over} overdue · {pct}% complete across {total} assignments.</p>;
          })()}
          <table className={styles.exportTable}>
            <thead><tr><th>Site</th><th>Assignments</th><th>Acknowledged</th><th>Overdue</th><th>Pct</th></tr></thead>
            <tbody>
              {data.sites.map((s) => {
                const list = data.acks.filter((a) => a.siteId === s.id);
                const ack = list.filter((a) => a.status === AckStatus.acknowledged).length;
                const over = list.filter((a) => a.status === AckStatus.overdue).length;
                const pct = list.length ? Math.round((ack / list.length) * 100) : 0;
                return (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{list.length}</td>
                    <td>{ack}</td>
                    <td>{over}</td>
                    <td>{list.length ? `${pct}%` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SectionCard>

        {/* Audit completion */}
        <SectionCard title="Audit completion" count={data.audits.length}>
          <table className={styles.exportTable}>
            <thead><tr><th>Site</th><th>Audit type</th><th>Frequency</th><th>Last completed</th><th>Score</th><th>RAG</th><th>Next due</th></tr></thead>
            <tbody>
              {data.audits.map((a) => {
                const at = AUDIT_TYPES.find((t) => t.id === a.auditType);
                return (
                  <tr key={a.id}>
                    <td>{sitesById[a.siteId]?.name ?? "—"}</td>
                    <td>{at?.label ?? a.auditType}</td>
                    <td>{a.frequency}</td>
                    <td>{formatDate(a.lastCompletedAt)}</td>
                    <td>{a.lastScore ?? "—"}</td>
                    <td>{a.ragStatus}</td>
                    <td>{formatDate(a.nextDueDate)}{a.overdue ? " (overdue)" : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SectionCard>

        {/* Evidence register */}
        <SectionCard title="Evidence Register" count={data.evidence.length}>
          <table className={styles.exportTable}>
            <thead><tr><th>Item</th><th>Site</th><th>Kind</th><th>Status</th><th>Due</th><th>Uploaded</th></tr></thead>
            <tbody>
              {data.evidence.slice(0, 80).map((e) => (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td>{sitesById[e.siteId]?.name ?? "—"}</td>
                  <td>{e.kind}</td>
                  <td><EvidenceStatusPill status={e.status} /></td>
                  <td>{formatDate(e.dueDate)}</td>
                  <td>{formatDate(e.uploadedAt)}</td>
                </tr>
              ))}
              {data.evidence.length > 80 && (
                <tr><td colSpan={6} style={{ color: "var(--on-surface-variant)" }}>+ {data.evidence.length - 80} more — full table available in generated PDF (Phase 2).</td></tr>
              )}
            </tbody>
          </table>
        </SectionCard>

        {/* Overdue actions */}
        <SectionCard title="Overdue / Action required" count={data.overdue.acks.length + data.overdue.evidence.length + data.overdue.audits.length + data.overdue.docsExpired.length + data.overdue.docsReviewDue.length}>
          <table className={styles.exportTable}>
            <thead><tr><th>Item</th><th>Type</th><th>Site</th><th>Status</th></tr></thead>
            <tbody>
              {data.overdue.docsExpired.map((d) => (
                <tr key={`exp-${d.id}`}><td>{d.title}</td><td>Document</td><td>—</td><td>Expired</td></tr>
              ))}
              {data.overdue.docsReviewDue.map((d) => (
                <tr key={`rd-${d.id}`}><td>{d.title}</td><td>Document</td><td>—</td><td>Review due</td></tr>
              ))}
              {data.overdue.audits.map((a) => (
                <tr key={`au-${a.id}`}><td>{AUDIT_TYPES.find((t) => t.id === a.auditType)?.label}</td><td>Audit</td><td>{sitesById[a.siteId]?.name}</td><td>Overdue</td></tr>
              ))}
              {data.overdue.evidence.slice(0, 30).map((e) => (
                <tr key={`ev-${e.id}`}><td>{e.title}</td><td>Evidence</td><td>{sitesById[e.siteId]?.name}</td><td>{e.status}</td></tr>
              ))}
              {data.overdue.acks.slice(0, 30).map((a) => (
                <tr key={`ak-${a.id}`}><td>Acknowledgement</td><td>Staff Ack</td><td>{sitesById[a.siteId]?.name}</td><td>Overdue</td></tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* Review calendar */}
        <SectionCard title="Review calendar" count={data.reviewCalendar.length}>
          <table className={styles.exportTable}>
            <thead><tr><th>Document</th><th>Version</th><th>Status</th><th>Next review</th></tr></thead>
            <tbody>
              {data.reviewCalendar.map((vw) => (
                <tr key={vw.version.id}>
                  <td>{vw.doc.title}</td>
                  <td>v{vw.version.versionNumber}</td>
                  <td><DocStatusPill status={vw.version.status} /></td>
                  <td>{formatDate(vw.due)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* Audit trail (last 50) */}
        <SectionCard title="Recent governance audit trail" count={data.trail.length}>
          <table className={styles.exportTable}>
            <thead><tr><th>When</th><th>User</th><th>Object</th><th>Action</th></tr></thead>
            <tbody>
              {data.trail.map((t) => (
                <tr key={t.id}>
                  <td>{formatDate(t.at)}</td>
                  <td>{t.userDisplay}</td>
                  <td>{t.objectType}</td>
                  <td>{t.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <p className={styles.exportNote}>
          PDF / ZIP export generation is a Phase 2 deliverable. This page renders the same data
          that the export would contain — every row above is live from the governance store and
          updates as data changes.
        </p>
      </div>
    </div>
  );
};
