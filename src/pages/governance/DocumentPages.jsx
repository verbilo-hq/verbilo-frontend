import { useEffect, useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { BackButton, DocStatusPill, formatDate, formatDateTime } from "./Shared";
import {
  listDocuments, getDocument, listVersions, getCurrentVersion,
  saveDraftBody, submitForReview, approveVersion, rejectVersion,
  publishVersion, archiveDocument, activateRelevantDocuments,
} from "../../services/governance/documents.service";
import { assignOnPublish } from "../../services/governance/acknowledgements.service";
import { generateRequiredForDocument } from "../../services/governance/evidence.service";
import { getPackInstance } from "../../services/governance/packs.service";
import { listProfiles } from "../../services/governance/siteProfiles.service";
import { listTrail } from "../../services/governance/auditTrail";
import {
  DocumentType, DocumentStatus, DOCUMENT_TYPE_LABEL, DOCUMENT_STATUS_LABEL,
  SITE_PROFILE_FLAGS, UserRole,
} from "../../services/governance/types";
import styles from "./Governance.module.css";

/* ─── Document register (list) ─────────────────────────────────────────────── */

const TYPE_FILTERS = [
  { id: "all",          label: "All" },
  { id: "policy",       label: "Policies" },
  { id: "sop",          label: "SOPs" },
  { id: "log_template", label: "Logs" },
  { id: "audit_tool",   label: "Audit Tools" },
];

const STATUS_FILTERS = [
  { id: "all",        label: "All statuses" },
  { id: "template",   label: "Template" },
  { id: "draft",      label: "Draft" },
  { id: "in_review",  label: "In review" },
  { id: "approved",   label: "Approved" },
  { id: "published",  label: "Published" },
  { id: "review_due", label: "Review due" },
];

export const DocumentRegister = ({ user, onOpen, allUsers, siteFilter, packKey }) => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  const docs = listDocuments(user.tenantId, { packKey, includeArchived: false }).filter((d) => {
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (query && !d.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (siteFilter && d.scope === "site" && d.appliesToSiteId !== siteFilter) return false;
    return true;
  });

  // Group by type for nice readability
  const buckets = ["policy", "sop", "log_template", "audit_tool", "appendix"];
  const byType = Object.fromEntries(buckets.map((b) => [b, []]));
  for (const d of docs) (byType[d.type] ??= []).push(d);

  return (
    <div>
      <div className={styles.docHeader}>
        <div>
          <h2 className={styles.areaTitle}>Protocols</h2>
          <p className={styles.areaLead}>
            All controlled documents in this pack — policies, SOPs, logs, audit tools and
            site appendices. Each is versioned: editing a published document creates a new draft;
            the live version stays untouched until you publish. Set status to <em>In review</em> to
            see the approvals queue.
          </p>
        </div>
      </div>

      <div className={styles.docFilters}>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            className={typeFilter === f.id ? `${styles.chip} ${styles.chipOn}` : styles.chip}
            onClick={() => setTypeFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
        <select className={styles.wizSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ marginLeft: 12 }}>
          {STATUS_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
        <input
          className={styles.wizInput}
          placeholder="Search document title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {docs.length === 0 ? (
        <Card hover={false} className={styles.emptyCard}>
          <I name="file" size={26} color="var(--outline-variant)" />
          <p>No documents match your filters.</p>
        </Card>
      ) : (
        buckets.filter((b) => byType[b]?.length).map((b) => (
          <Card key={b} hover={false} className={styles.docBucketCard}>
            <div className={styles.docBucketHead}>
              <h4 className={styles.cardTitle}>
                {DOCUMENT_TYPE_LABEL[b]}{b === "policy" ? "" : "s"}
              </h4>
              <Pill bg="var(--surface-container)" color="var(--on-surface-variant)" small>
                {byType[b].length}
              </Pill>
            </div>
            {byType[b].map((d) => {
              const v = getCurrentVersion(user.tenantId, d.id);
              return (
                <button key={d.id} className={styles.docRow} onClick={() => onOpen(d.id)}>
                  <div>
                    <div className={styles.docRowTitle}>{d.title}</div>
                    <div className={styles.docRowMeta}>
                      v{v?.versionNumber ?? "—"} · {d.category} · Next review: {formatDate(v?.nextReviewDate)}
                    </div>
                  </div>
                  <DocStatusPill status={d.status} />
                  <I name="arrow" size={13} color="var(--outline)" />
                </button>
              );
            })}
          </Card>
        ))
      )}
    </div>
  );
};

/* ─── Document detail ──────────────────────────────────────────────────────── */

const DETAIL_TABS = [
  { id: "overview",  label: "Overview" },
  { id: "body",      label: "Body" },
  { id: "versions",  label: "Versions" },
  { id: "history",   label: "History" },
];

const BodyEditor = ({ initial, onSave, onCancel }) => {
  const [body, setBody] = useState(initial ?? "");
  const [summary, setSummary] = useState("");
  return (
    <div className={styles.scrim} onClick={onCancel}>
      <Card hover={false} className={styles.modal} style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <h3 className={styles.modalTitle}>Edit document body</h3>
          <button className={styles.modalClose} onClick={onCancel}><I name="xcircle" size={18} color="var(--outline)" /></button>
        </div>
        <textarea
          rows={16}
          className={styles.wizInput}
          style={{ width: "100%", fontFamily: "monospace", fontSize: 12 }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <input
          className={styles.wizInput}
          style={{ marginTop: 10 }}
          placeholder="Change summary (shown in version history)…"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <BtnPrimary onClick={() => onSave(body, summary)}><I name="check" size={13} color="var(--on-primary)" /> Save draft</BtnPrimary>
          <BtnSecondary onClick={onCancel}>Cancel</BtnSecondary>
        </div>
      </Card>
    </div>
  );
};

const ApprovalActions = ({ user, doc, version, onAction }) => {
  const can = (act) => {
    switch (act) {
      case "edit":      return [DocumentStatus.draft, DocumentStatus.rejected, DocumentStatus.template, DocumentStatus.published, DocumentStatus.review_due].includes(doc.status);
      case "submit":    return version?.status === DocumentStatus.draft;
      case "approve":   return version?.status === DocumentStatus.in_review && [UserRole.clinical_director, UserRole.governance_lead, UserRole.group_admin, UserRole.super_admin].includes(user.role);
      case "reject":    return version?.status === DocumentStatus.in_review && [UserRole.clinical_director, UserRole.governance_lead, UserRole.group_admin, UserRole.super_admin].includes(user.role);
      case "publish":   return version?.status === DocumentStatus.approved && [UserRole.clinical_director, UserRole.group_admin, UserRole.governance_lead, UserRole.super_admin].includes(user.role);
      case "archive":   return doc.status === DocumentStatus.published;
      default: return false;
    }
  };
  return (
    <div className={styles.docActions}>
      {can("edit") && (
        <BtnSecondary onClick={() => onAction("edit")}><I name="edit" size={13} /> Edit draft</BtnSecondary>
      )}
      {can("submit") && (
        <BtnPrimary onClick={() => onAction("submit")}><I name="send" size={13} color="var(--on-primary)" /> Submit for review</BtnPrimary>
      )}
      {can("approve") && (
        <BtnPrimary onClick={() => onAction("approve")}><I name="checkcircle" size={13} color="var(--on-primary)" /> Approve</BtnPrimary>
      )}
      {can("reject") && (
        <BtnSecondary onClick={() => { const reason = prompt("Reason for rejection / changes requested?"); if (reason !== null) onAction("reject", reason); }}>
          <I name="xcircle" size={13} /> Request changes
        </BtnSecondary>
      )}
      {can("publish") && (
        <BtnPrimary onClick={() => onAction("publish")}><I name="shield" size={13} color="var(--on-primary)" /> Publish live</BtnPrimary>
      )}
      {can("archive") && (
        <BtnSecondary onClick={() => { if (confirm("Archive this document?")) onAction("archive"); }}>
          <I name="archive" size={13} /> Archive
        </BtnSecondary>
      )}
    </div>
  );
};

export const DocumentDetail = ({ user, documentId, onBack, allUsers, sites, onOpenDocument }) => {
  const [tick, setTick] = useState(0);
  const [tab, setTab] = useState("overview");
  const [editorOpen, setEditorOpen] = useState(false);
  const doc = getDocument(user.tenantId, documentId);
  if (!doc) return null;
  const versions = listVersions(user.tenantId, documentId);
  const currentVersion = getCurrentVersion(user.tenantId, documentId);
  const version = [...versions].reverse().find((candidate) =>
    [DocumentStatus.draft, DocumentStatus.in_review, DocumentStatus.approved, DocumentStatus.rejected].includes(candidate.status),
  ) ?? currentVersion;
  const trail = listTrail(user.tenantId, { objectType: "document_version", objectId: version?.id });
  const refresh = () => setTick((t) => t + 1);

  const handleAction = (action, payload) => {
    if (action === "edit") { setEditorOpen(true); return; }
    if (action === "submit") {
      const pack = getPackInstance(user.tenantId);
      submitForReview(user, doc.id, version.id, pack?.defaultReviewerUserId ?? null);
    } else if (action === "approve") {
      approveVersion(user, doc.id, version.id);
    } else if (action === "reject") {
      rejectVersion(user, doc.id, version.id, payload);
    } else if (action === "publish") {
      publishVersion(user, doc.id, version.id, { major: !versions.some((v) => v.status === DocumentStatus.archived), reviewCycleMonths: 12 });
      // Generate ack assignments + required evidence for applied sites
      const pack = getPackInstance(user.tenantId);
      const profiles = listProfiles(user.tenantId, pack.id).filter((p) => p.applied);
      const appliedSiteIds = profiles.map((p) => p.siteId);
      const sitesWithApplied = sites.map((s) => ({ ...s, appliedToPack: appliedSiteIds.includes(s.id) }));
      assignOnPublish(user, doc.id, version.id, { major: !versions.some((v) => v.status === DocumentStatus.archived), allUsers, sites: sitesWithApplied });
      generateRequiredForDocument(user, doc, appliedSiteIds);
    } else if (action === "archive") {
      archiveDocument(user, doc.id);
    }
    refresh();
  };

  const profileFlagsLabel = (flag) => SITE_PROFILE_FLAGS.find((f) => f.id === flag)?.label;

  return (
    <div>
      <BackButton onClick={onBack} label="Back to documents" />

      <div className={styles.docDetailHead}>
        <div>
          <div className={styles.docDetailType}>{DOCUMENT_TYPE_LABEL[doc.type]} · {doc.category}</div>
          <h2 className={styles.areaTitle}>{doc.title}</h2>
          <div className={styles.docDetailMeta}>
            <span>v{version?.versionNumber ?? "—"}</span>
            <span>·</span>
            <DocStatusPill status={version?.status ?? doc.status} />
            {doc.references?.length > 0 && (
              <>
                <span>·</span>
                <span>References: {doc.references.join(", ")}</span>
              </>
            )}
          </div>
        </div>
        <ApprovalActions user={user} doc={doc} version={version} onAction={handleAction} />
      </div>

      <div className={styles.tabBar}>
        {DETAIL_TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? `${styles.tabBtn} ${styles.tabBtnActive}` : styles.tabBtn} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <Card hover={false} style={{ padding: 24 }}>
        {tab === "overview" && (
          <div>
            <p className={styles.bodyText}>
              <strong>Purpose:</strong> {doc.type === "policy" ? "Establishes the group-wide policy" : doc.type === "sop" ? "Specifies the operational procedure" : "Captures operational evidence"} for {doc.category.replace(/_/g, " ")}.
            </p>
            {doc.requiredFlag && (
              <p className={styles.bodyText} style={{ marginTop: 8 }}>
                <strong>Activates when:</strong> the site profile has <em>{profileFlagsLabel(doc.requiredFlag)}</em> enabled.
              </p>
            )}
            {doc.linkedAuditType && (
              <p className={styles.bodyText} style={{ marginTop: 8 }}>
                <strong>Linked audit:</strong> {doc.linkedAuditType.replace(/_/g, " ")}
              </p>
            )}
            <p className={styles.bodyText} style={{ marginTop: 8 }}>
              <strong>Acknowledgement required:</strong> {doc.acknowledgementRequired ? "Yes — assigned to staff at applied sites on publish." : "No"}
            </p>

            {/* Linked site appendices — when this doc has child appendices
             * (one per applied site for equipment-bound parent SOPs), surface
             * them as a clickable list grouped by site. Each opens in
             * DocumentDetail so users can review/approve local detail. */}
            {(() => {
              const children = listDocuments(user.tenantId, { packKey: doc.packKey })
                .filter((d) => d.type === "appendix" && d.parentDocumentId === doc.id && d.status !== DocumentStatus.archived);
              if (children.length === 0) return null;
              return (
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--outline-variant)" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                    <strong style={{ fontSize: 13 }}>Linked site appendices</strong>
                    <span style={{ fontSize: 11, color: "var(--on-surface-variant)" }}>
                      {children.length} site{children.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {children.map((c) => {
                      const childSite = sites.find((s) => s.id === c.appliesToSiteId);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => onOpenDocument?.(c.id)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            gap: 12, padding: "10px 12px", background: "transparent",
                            border: "none", borderTop: "1px solid var(--outline-variant)",
                            font: "inherit", textAlign: "left", cursor: "pointer",
                          }}
                        >
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--on-surface)" }}>
                              {childSite?.name ?? "Unknown site"}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--on-surface-variant)", marginTop: 2 }}>
                              {c.title}
                            </div>
                          </span>
                          <DocStatusPill status={c.status} />
                          <I name="arrow" size={11} color="var(--outline)" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        {tab === "body" && (
          <pre className={styles.docBody}>{version?.body ?? "(empty)"}</pre>
        )}
        {tab === "versions" && (
          <div className={styles.versionList}>
            {versions.map((v) => (
              <div key={v.id} className={styles.versionRow}>
                <div>
                  <div className={styles.cardTitle}>v{v.versionNumber}</div>
                  <div className={styles.cardLead}>{v.changeSummary || "—"}</div>
                  <div className={styles.versionMeta}>
                    {v.publishedAt ? `Published ${formatDate(v.publishedAt)}` :
                     v.approvedAt  ? `Approved ${formatDate(v.approvedAt)}` :
                     v.submittedAt ? `Submitted ${formatDate(v.submittedAt)}` :
                                     `Drafted ${formatDate(v.createdAt)}`}
                  </div>
                </div>
                <DocStatusPill status={v.status} />
              </div>
            ))}
          </div>
        )}
        {tab === "history" && (
          <div className={styles.historyList}>
            {trail.length === 0 && <div style={{ color: "var(--on-surface-variant)" }}>No events yet.</div>}
            {trail.map((h) => (
              <div key={h.id} className={styles.historyRow}>
                <div className={styles.historyDot} />
                <div>
                  <div className={styles.cardTitle} style={{ fontSize: 13 }}>{h.action}</div>
                  <div className={styles.versionMeta}>{formatDateTime(h.at)} · {h.userDisplay}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {editorOpen && (
        <BodyEditor
          initial={version?.body}
          onSave={(body, summary) => {
            saveDraftBody(user, doc.id, body, summary);
            setEditorOpen(false);
            refresh();
          }}
          onCancel={() => setEditorOpen(false)}
        />
      )}
    </div>
  );
};

/* ─── Approvals queue ──────────────────────────────────────────────────────── */

export const ApprovalsQueue = ({ user, onOpen, packKey }) => {
  const inReview = listDocuments(user.tenantId, { packKey })
    .map((doc) => ({
      doc,
      version: [...listVersions(user.tenantId, doc.id)].reverse()
        .find((candidate) => candidate.status === DocumentStatus.in_review),
    }))
    .filter((entry) => entry.version);
  return (
    <div>
      <h2 className={styles.areaTitle}>Approval Queue</h2>
      <p className={styles.areaLead}>
        Documents awaiting your approval. As {user.role === "clinical_director" ? "Clinical Director" : "Governance Lead"}, you can approve, request changes or reject.
      </p>
      {inReview.length === 0 ? (
        <Card hover={false} className={styles.emptyCard}>
          <I name="checkcircle" size={26} color="var(--success)" />
          <p>Nothing waiting for approval.</p>
        </Card>
      ) : (
        <Card hover={false} style={{ padding: 0, overflow: "hidden" }}>
          {inReview.map(({ doc: d, version: v }) => {
            return (
              <button key={d.id} className={styles.docRow} onClick={() => onOpen(d.id)}>
                <div>
                  <div className={styles.docRowTitle}>{d.title}</div>
                  <div className={styles.docRowMeta}>v{v?.versionNumber} · submitted {formatDate(v?.submittedAt)}</div>
                </div>
                <DocStatusPill status={v.status} />
                <I name="arrow" size={13} color="var(--outline)" />
              </button>
            );
          })}
        </Card>
      )}
    </div>
  );
};
