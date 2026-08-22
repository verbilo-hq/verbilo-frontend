import { useEffect, useRef, useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { Avatar } from "../../components/ui/Avatar";
import { BackButton, EvidenceStatusPill, formatDate, formatDateTime, Bar } from "./Shared";
import {
  listAll as listAcks, markAcknowledged, reconcileOverdue as reconcileAckOverdue,
  ackStatsForSite,
} from "../../services/governance/acknowledgements.service";
import {
  list as listEvidence, uploadEvidence, downloadEvidence, reviewEvidence,
  reconcileEvidenceStatus,
} from "../../services/governance/evidence.service";
import {
  listSchedules, completeAudit, reconcileOverdue as reconcileAuditOverdue,
} from "../../services/governance/audits.service";
import { lastRunForSchedule } from "../../services/governance/auditRuns.service";
import { getAuditTemplate } from "../../services/governance/auditTemplates";
import { getDocument, getCurrentVersion } from "../../services/governance/documents.service";
import { listSites } from "../../services/governance/sites.service";
import {
  AckStatus, EvidenceStatus, EvidenceKind, AUDIT_TYPES, AuditRagStatus,
} from "../../services/governance/types";
import styles from "./Governance.module.css";

/* ─── Acknowledgements ─────────────────────────────────────────────────────── */

export const AcknowledgementsPage = ({ user, onOpenDocument, siteFilter, packKey }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => { reconcileAckOverdue(user.tenantId); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const allRaw = listAcks(user.tenantId);
  const allBySite = siteFilter ? allRaw.filter((a) => a.siteId === siteFilter) : allRaw;
  // Pack scope: drop acks whose document belongs to a different pack.
  const all = packKey
    ? allBySite.filter((a) => {
        const d = getDocument(user.tenantId, a.documentId);
        return !d || d.packKey === packKey;
      })
    : allBySite;
  const mine = all.filter((a) => a.userId === user.id);
  const allSites = listSites(user.tenantId);
  const sites = siteFilter ? allSites.filter((s) => s.id === siteFilter) : allSites;

  const handleAck = (id) => { markAcknowledged(user, id); setTick((t) => t + 1); };

  return (
    <div>
      <h2 className={styles.areaTitle}>Staff Acknowledgements</h2>
      <p className={styles.areaLead}>
        Acknowledgements are tied to specific document versions. Publishing a new major version
        invalidates older acknowledgements and assigns fresh ones.
      </p>

      {/* My queue */}
      <Card hover={false} style={{ padding: 22, marginBottom: 18 }}>
        <h3 className={styles.cardTitle}>My queue</h3>
        <p className={styles.cardLead}>{mine.length === 0 ? "Nothing assigned to you." : `${mine.filter((m) => m.status === AckStatus.acknowledged).length} of ${mine.length} acknowledged.`}</p>
        {mine.map((a) => {
          const doc = getDocument(user.tenantId, a.documentId);
          if (!doc) return null;
          const version = getCurrentVersion(user.tenantId, a.documentId);
          return (
            <div key={a.id} className={styles.ackRow}>
              <button className={styles.ackTitle} onClick={() => onOpenDocument(a.documentId)}>{doc.title}</button>
              <div className={styles.ackMeta}>
                v{version?.versionNumber ?? "—"} · Due {formatDate(a.dueDate)}
              </div>
              {a.status === AckStatus.acknowledged
                ? <Pill bg="rgba(46,125,50,0.10)" color="#2e7d32" small><I name="check" size={10} /> Acknowledged {formatDate(a.acknowledgedAt)}</Pill>
                : <BtnPrimary onClick={() => handleAck(a.id)} style={{ padding: "6px 12px", fontSize: 11 }}>
                    <I name="check" size={11} color="var(--on-primary)" /> Acknowledge
                  </BtnPrimary>}
            </div>
          );
        })}
      </Card>

      {/* Site breakdown */}
      <Card hover={false} style={{ padding: 22 }}>
        <h3 className={styles.cardTitle}>By site</h3>
        <div className={styles.siteCompList}>
          {sites.map((s) => {
            const stats = ackStatsForSite(user.tenantId, s.id);
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
    </div>
  );
};

/* ─── Evidence Register ────────────────────────────────────────────────────── */

const UploadModal = ({ evidence, onUpload, onCancel }) => {
  const ref = useRef(null);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  return (
    <div className={styles.scrim} onClick={onCancel}>
      <Card hover={false} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <h3 className={styles.modalTitle}>Upload evidence</h3>
          <button className={styles.modalClose} onClick={onCancel}><I name="xcircle" size={18} color="var(--outline)" /></button>
        </div>
        <p className={styles.cardLead} style={{ marginBottom: 12 }}>{evidence.title}</p>
        <input ref={ref} type="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button className={file ? `${styles.uploaderZone} ${styles.uploaderZoneFilled}` : styles.uploaderZone} onClick={() => ref.current?.click()}>
          <I name="upload" size={16} color="var(--primary)" />
          {file ? `${file.name} · ${(file.size / 1024).toFixed(0)} KB` : "Click to choose a file"}
        </button>
        <textarea className={styles.wizInput} rows={2} placeholder="Optional notes" style={{ marginTop: 10 }} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <BtnPrimary onClick={() => file && onUpload(file, notes)} disabled={!file}><I name="upload" size={13} color="var(--on-primary)" /> Upload</BtnPrimary>
          <BtnSecondary onClick={onCancel}>Cancel</BtnSecondary>
        </div>
      </Card>
    </div>
  );
};

export const EvidenceRegister = ({ user, onOpenDocument, siteFilter, packKey }) => {
  const [tick, setTick] = useState(0);
  const [uploading, setUploading] = useState(null);
  const [filter, setFilter] = useState("all");
  useEffect(() => { reconcileEvidenceStatus(user.tenantId); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const rows = listEvidence(user.tenantId).filter((e) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (siteFilter && e.siteId !== siteFilter) return false;
    if (packKey && e.documentId) {
      const d = getDocument(user.tenantId, e.documentId);
      if (d && d.packKey !== packKey) return false;
    }
    return true;
  });
  const sites = listSites(user.tenantId);
  const siteName = (siteId) => sites.find((s) => s.id === siteId)?.name ?? "—";

  const handleUpload = async (file, notes) => {
    await uploadEvidence(user, uploading.id, file, { notes });
    setUploading(null);
    setTick((t) => t + 1);
  };

  return (
    <div>
      <h2 className={styles.areaTitle}>Evidence Register</h2>
      <p className={styles.areaLead}>
        All required evidence across sites, documents, equipment and audits. Status flips
        automatically as you upload, get accepted, or expire.
      </p>

      <div className={styles.docFilters}>
        {["all", "required", "submitted", "accepted", "overdue", "expired", "rejected"].map((f) => (
          <button key={f} className={filter === f ? `${styles.chip} ${styles.chipOn}` : styles.chip} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Card hover={false} className={styles.emptyCard}>
          <I name="file" size={26} color="var(--outline-variant)" />
          <p>No evidence required yet — publish at least one document to start the workflow.</p>
        </Card>
      ) : (
        <Card hover={false} style={{ padding: 0, overflow: "hidden" }}>
          {rows.map((e) => (
            <div key={e.id} className={styles.evidenceRow}>
              <button className={styles.ackTitle} onClick={() => e.documentId && onOpenDocument(e.documentId)}>
                {e.title}
              </button>
              <div className={styles.evidenceMeta}>{siteName(e.siteId)} · {e.kind.replace(/_/g, " ")}</div>
              <EvidenceStatusPill status={e.status} />
              <div style={{ display: "flex", gap: 6 }}>
                {e.status === EvidenceStatus.required || e.status === EvidenceStatus.rejected || e.status === EvidenceStatus.overdue ? (
                  <BtnSecondary onClick={() => setUploading(e)} style={{ padding: "5px 10px", fontSize: 11 }}>
                    <I name="upload" size={11} /> Upload
                  </BtnSecondary>
                ) : e.fileKey ? (
                  <BtnSecondary onClick={() => downloadEvidence(user.tenantId, e.id)} style={{ padding: "5px 10px", fontSize: 11 }}>
                    <I name="download" size={11} /> File
                  </BtnSecondary>
                ) : null}
                {e.status === EvidenceStatus.submitted && (
                  <>
                    <button className={styles.iconBtn} title="Accept"
                      onClick={() => { reviewEvidence(user, e.id, "accept"); setTick((t) => t + 1); }}>
                      <I name="check" size={11} color="var(--success)" />
                    </button>
                    <button className={styles.iconBtn} title="Reject"
                      onClick={() => { const r = prompt("Rejection reason?"); if (r !== null) { reviewEvidence(user, e.id, "reject", r); setTick((t) => t + 1); } }}>
                      <I name="xcircle" size={11} color="var(--error)" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}

      {uploading && <UploadModal evidence={uploading} onUpload={handleUpload} onCancel={() => setUploading(null)} />}
    </div>
  );
};

/* ─── Audits ───────────────────────────────────────────────────────────────── */

const RAG_PILL = {
  green:   { bg: "rgba(46,125,50,0.10)", color: "#2e7d32", label: "Green" },
  amber:   { bg: "rgba(245,124,0,0.10)", color: "#b36000", label: "Amber" },
  red:     { bg: "rgba(229,57,53,0.10)", color: "#e53935", label: "Red"   },
  unknown: { bg: "var(--surface-container)", color: "var(--on-surface-variant)", label: "—" },
};

export const AuditsPage = ({ user, siteFilter, packKey, onStartAudit }) => {
  const [tick, setTick] = useState(0);
  // Suppress unused — kept so we can force-refresh after legacy quick-score below.
  // eslint-disable-next-line no-unused-vars
  const _tick = tick;
  useEffect(() => { reconcileAuditOverdue(user.tenantId); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const schedulesAll = listSchedules(user.tenantId);
  const auditTypeIsForPack = (auditType) => {
    if (!packKey) return true;
    const at = AUDIT_TYPES.find((a) => a.id === auditType);
    return !at || at.pack === packKey;
  };
  const schedulesByPack = packKey ? schedulesAll.filter((s) => auditTypeIsForPack(s.auditType)) : schedulesAll;
  const schedules = siteFilter ? schedulesByPack.filter((s) => s.siteId === siteFilter) : schedulesByPack;
  const sites = listSites(user.tenantId);
  const sitesById = Object.fromEntries(sites.map((s) => [s.id, s]));

  return (
    <div>
      <h2 className={styles.areaTitle}>Audit Dashboard</h2>
      <p className={styles.areaLead}>
        Recurring audits scheduled per site by audit type. Schedules are generated automatically
        when the pack goes live, based on each site's applied profile.
      </p>

      {schedules.length === 0 ? (
        <Card hover={false} className={styles.emptyCard}>
          <I name="checksquare" size={26} color="var(--outline-variant)" />
          <p>No audit schedules yet — they're created when the pack goes live.</p>
        </Card>
      ) : (
        <Card hover={false} style={{ padding: 0, overflow: "hidden" }}>
          {schedules.map((s) => {
            const auditTypeLabel = AUDIT_TYPES.find((a) => a.id === s.auditType)?.label ?? s.auditType;
            const rag = RAG_PILL[s.ragStatus] ?? RAG_PILL.unknown;
            // Does this audit type have a question-bank template authored?
            // If not, we fall back to the legacy quick-score prompt so the
            // schedule isn't bricked while content is still being seeded.
            const hasTemplate = !!getAuditTemplate(s.auditType);
            const lastRun     = lastRunForSchedule(user.tenantId, s.id);
            return (
              <div key={s.id} className={styles.evidenceRow}>
                <div className={styles.docRowTitle}>{auditTypeLabel}</div>
                <div className={styles.evidenceMeta}>
                  {sitesById[s.siteId]?.name ?? "—"} · {s.frequency}
                  {lastRun && (
                    <> · <span title={`Score ${lastRun.score}, ${lastRun.summary?.pass ?? 0} pass / ${lastRun.summary?.fail ?? 0} fail`}>
                      Last: {formatDate(lastRun.completedAt)} · {lastRun.score}%
                    </span></>
                  )}
                </div>
                <Pill bg={rag.bg} color={rag.color} small>{rag.label}</Pill>
                <div className={styles.evidenceMeta} style={{ minWidth: 140 }}>
                  {s.overdue ? <span style={{ color: "#e53935" }}>Overdue · </span> : null}
                  Due {formatDate(s.nextDueDate)}
                </div>
                {hasTemplate && onStartAudit ? (
                  <BtnPrimary
                    onClick={() => onStartAudit(s.id)}
                    style={{ padding: "5px 12px", fontSize: 11 }}
                  >
                    <I name="edit" size={11} color="var(--on-primary)" /> Start audit
                  </BtnPrimary>
                ) : (
                  /* Legacy fallback for audit types still being authored —
                   * keeps the schedule usable rather than dead-ending. */
                  <BtnSecondary
                    onClick={() => {
                      const score = Number(prompt("Audit score (0–100)?", "85"));
                      if (!Number.isFinite(score)) return;
                      const rag = score >= 90 ? AuditRagStatus.green : score >= 70 ? AuditRagStatus.amber : AuditRagStatus.red;
                      completeAudit(user, s.id, { score, rag });
                      setTick((t) => t + 1);
                    }}
                    style={{ padding: "5px 10px", fontSize: 11 }}
                  >
                    Quick complete
                  </BtnSecondary>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};
