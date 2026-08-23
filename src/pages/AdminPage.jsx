import { useState, useEffect, useRef } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { SearchBar } from "../components/ui/SearchBar";
import {
  listAdminSections, listAdminDocs,
  updateAdminDoc, deleteAdminDoc,
  uploadAdminDoc, downloadAdminDoc,
} from "../services/admin.service";
import { OrganisationSettings } from "./admin/OrganisationSettings";
import { MasterTemplateLibrary } from "./admin/MasterTemplateLibrary";
import { hasCap, useDevRole } from "../services/devRole";
import { personName } from "../services/people";
import { useModalA11y } from "../hooks/useModalA11y";
import styles from "./AdminPage.module.css";

/* Approver of record for doc approve/reject actions — a real roster person
 * (the clinical lead) instead of an invented name. */
const DOC_APPROVER = personName("clinical-lead");

/* Top-level Admin Centre areas. "documents" preserves existing behaviour. */
const ADMIN_AREAS = [
  { id: "documents",    label: "Documents",                  icon: "file"     },
  { id: "templates",    label: "SaaS Master Template Library", icon: "layers", cap: "master_template_lib" },
  { id: "organisation", label: "Organisation Settings",      icon: "settings", cap: "org_settings_edit"   },
];

const statusConfig = {
  approved: { label: "Approved", color: "var(--success)", icon: "checkcircle" },
  pending: { label: "Pending", color: "var(--warning)", icon: "clock3" },
  in_review: { label: "In Review", color: "var(--primary)", icon: "eye" },
  rejected: { label: "Rejected", color: "var(--error)", icon: "xcircle" },
};

const filterOptions = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in_review", label: "In Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const UploadModal = ({ uploadSection, setUploadSection, onClose, onUpload, sections }) => {
  const dialogRef = useModalA11y(onClose);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const addFiles = (incoming) => {
    const arr = Array.from(incoming ?? []);
    if (arr.length) setFiles((prev) => [...prev, ...arr]);
  };

  const handleSubmit = async () => {
    if (!files.length || submitting) return;
    setSubmitting(true);
    try {
      for (const file of files) {
        await onUpload({ file, section: uploadSection, description });
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalScrim} onClick={onClose}>
      <div ref={dialogRef} onClick={(e) => e.stopPropagation()} className={styles.modalCard} aria-labelledby="upload-document-title">
        <div className={styles.modalHeader}>
          <h2 id="upload-document-title" className={styles.modalTitle}>Upload Document</h2>
          <button type="button" onClick={onClose} className={styles.modalCloser} aria-label="Close upload dialog">
            <I name="xcircle" size={22} color="var(--outline)" />
          </button>
        </div>

        <div className={styles.modalBlock}>
          <label className={styles.modalLabel}>Upload to Section</label>
          <div className={styles.sectionPicker}>
            {sections.map((s) => {
              const active = uploadSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setUploadSection(s.id)}
                  className={styles.sectionPickerBtn}
                  style={
                    active
                      ? { background: s.color, color: "white" }
                      : undefined
                  }
                >
                  <I name={s.icon} size={13} color={active ? "white" : "var(--on-surface-variant)"} /> {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={dragOver ? `${styles.dropZone} ${styles.dropZoneActive}` : styles.dropZone}
          style={{ cursor: "pointer" }}
        >
          <div className={styles.dropZoneIconWrap}>
            <I name="cloud" size={24} color="var(--primary)" />
          </div>
          <p className={styles.dropZoneTitle}>Drag & drop files here</p>
          <p className={styles.dropZoneHelp}>
            or <span className={styles.dropZoneLink}>browse from your device</span>
          </p>
          <p className={styles.dropZoneFormats}>PDF, DOCX, XLSX, PPTX, ZIP — stored locally in your browser</p>
        </div>

        {files.length > 0 && (
          <div className={styles.modalBlock}>
            <label className={styles.modalLabel}>Selected files ({files.length})</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface-container)", borderRadius: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <I name="file" size={14} color="var(--outline)" />
                    {f.name} <span style={{ color: "var(--on-surface-variant)" }}>· {(f.size / 1024).toFixed(0)} KB</span>
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFiles((prev) => prev.filter((_, j) => j !== i)); }}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <I name="xcircle" size={16} color="var(--outline)" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.modalBlock}>
          <label className={styles.modalLabel}>Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the document..."
            className={styles.modalTextarea}
          />
        </div>

        <div className={styles.modalNotice}>
          <I name="shieldalert" size={16} color="var(--primary)" />
          <span className={styles.modalNoticeText}>
            Files are stored in your browser's local storage — no cloud upload needed for dev.
          </span>
        </div>

        <div className={styles.modalActions}>
          <BtnPrimary
            onClick={handleSubmit}
            disabled={!files.length || submitting}
            style={{ flex: 1, justifyContent: "center", opacity: !files.length || submitting ? 0.6 : 1 }}
          >
            <I name="upload" size={16} color="var(--on-primary)" />
            {submitting ? "Uploading…" : "Upload & Submit for Review"}
          </BtnPrimary>
          <BtnSecondary onClick={onClose} style={{ padding: "14px 20px" }}>Cancel</BtnSecondary>
        </div>
      </div>
    </div>
  );
};

const DetailPanel = ({ doc, currentSection, onClose, onApprove, onReject, onDelete, onDownload }) => {
  const sc = statusConfig[doc.status];
  const meta = [
    { label: "Uploaded by", value: doc.uploadedBy, icon: "person" },
    { label: "Upload date", value: doc.date, icon: "calendar" },
    { label: "File size", value: doc.size, icon: "file" },
    { label: "Downloads", value: String(doc.downloads), icon: "download" },
    doc.approvedBy && { label: "Approved by", value: `${doc.approvedBy} (${doc.approvedDate})`, icon: "checkcircle" },
    doc.reviewer && { label: "Reviewing", value: doc.reviewer, icon: "eye" },
    doc.rejectedBy && { label: "Rejected by", value: doc.rejectedBy, icon: "xcircle" },
  ].filter(Boolean);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Document Details</h3>
          <div onClick={onClose} style={{ cursor: "pointer" }}>
            <I name="xcircle" size={20} color="var(--outline)" />
          </div>
        </div>
        <div className={styles.panelPreview}>
          <I name="file" size={32} color="var(--outline)" />
          <span className={styles.panelPreviewMeta}>{doc.type} • {doc.size}</span>
        </div>
      </div>

      <div className={styles.panelBody}>
        <h4 className={styles.panelDocName}>{doc.name}</h4>
        <div className={styles.panelTags}>
          <Pill bg={`color-mix(in srgb, ${sc.color} 14%, transparent)`} color={sc.color} small>{sc.label}</Pill>
          <Pill bg="var(--surface-highest)" color="var(--on-surface)" small>v{doc.version}</Pill>
          <Pill
            bg={`color-mix(in srgb, ${currentSection.color} 11%, transparent)`}
            color={currentSection.color}
            small
          >
            {currentSection.label}
          </Pill>
        </div>

        <div className={styles.panelMetaList}>
          {meta.map((m) => (
            <div key={m.label} className={styles.panelMetaRow}>
              <I name={m.icon} size={14} color="var(--outline)" />
              <div>
                <span className={styles.panelMetaLabel}>{m.label}</span>
                <div className={styles.panelMetaValue}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        {doc.rejectedReason && (
          <div className={styles.rejectionBox}>
            <div className={styles.rejectionTitle}>Rejection Reason</div>
            <div className={styles.rejectionReason}>{doc.rejectedReason}</div>
          </div>
        )}

        <div className={styles.panelActions}>
          <BtnPrimary
            onClick={() => onDownload?.(doc.id)}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <I name="download" size={16} color="var(--on-primary)" /> Download
          </BtnPrimary>
          {(doc.status === "pending" || doc.status === "in_review") && (
            <div className={styles.approveRejectRow}>
              <button onClick={() => onApprove(doc.id)} className={styles.approveBtn}>
                <I name="checkcircle" size={15} color="var(--success)" /> Approve
              </button>
              <button onClick={() => onReject(doc.id)} className={styles.rejectBtn}>
                <I name="xcircle" size={15} color="var(--error)" /> Reject
              </button>
            </div>
          )}
          <button onClick={() => onDelete(doc.id)} className={styles.deleteBtn}>
            <I name="trash" size={14} color="var(--error)" /> Delete Document
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminPage = () => {
  const [adminArea, setAdminArea] = useState("documents");
  const [activeSection, setActiveSection] = useState("clinical");
  const [filterStatus, setFilterStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadSection, setUploadSection] = useState("clinical");
  const [docs, setDocs] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    listAdminSections().then(setSections);
    listAdminDocs().then(setDocs);
  }, []);

  const sectionDocs = docs.filter((d) => d.section === activeSection);
  const q = query.trim().toLowerCase();
  const filtered = sectionDocs.filter(
    (d) =>
      (filterStatus === "all" || d.status === filterStatus) &&
      (!q || `${d.name} ${d.uploadedBy} ${d.type}`.toLowerCase().includes(q))
  );
  const sectionStats = {
    total: sectionDocs.length,
    approved: sectionDocs.filter((d) => d.status === "approved").length,
    pending: sectionDocs.filter((d) => d.status === "pending" || d.status === "in_review").length,
    rejected: sectionDocs.filter((d) => d.status === "rejected").length,
  };

  const currentSection = sections.find((s) => s.id === activeSection) ?? { id: activeSection, label: "", icon: "folder", color: "var(--primary)" };

  const handleApprove = async (id) => {
    const updated = await updateAdminDoc(id, {
      status: "approved",
      approvedBy: DOC_APPROVER,
      approvedDate: new Date().toISOString().split("T")[0],
    });
    setDocs((prev) => prev.map((d) => (d.id === id ? updated : d)));
    setSelectedDoc(null);
  };

  const handleReject = async (id) => {
    const updated = await updateAdminDoc(id, {
      status: "rejected",
      rejectedBy: DOC_APPROVER,
      rejectedReason: "Needs revision — see comments.",
    });
    setDocs((prev) => prev.map((d) => (d.id === id ? updated : d)));
    setSelectedDoc(null);
  };

  const handleDelete = async (id) => {
    await deleteAdminDoc(id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setSelectedDoc(null);
  };

  const handleUpload = async ({ file, section, description }) => {
    const created = await uploadAdminDoc({ file, section, description });
    setDocs((prev) => [created, ...prev]);
    if (section !== activeSection) setActiveSection(section);
  };

  const handleDownload = async (id) => {
    const ok = await downloadAdminDoc(id);
    if (!ok) alert("This demo doc has no attached file. Upload one to download.");
  };

  const statTiles = [
    { label: "Total", value: sectionStats.total, icon: "layers", color: currentSection.color },
    { label: "Approved", value: sectionStats.approved, icon: "checkcircle", color: "var(--success)" },
    { label: "Pending", value: sectionStats.pending, icon: "clock3", color: "var(--warning)" },
    { label: "Rejected", value: sectionStats.rejected, icon: "xcircle", color: "var(--error)" },
  ];

  /* Top-level area tab strip — switches between Documents (existing) and
     Organisation Settings (new). Master Templates comes in Slice 1B. */
  const [devRole] = useDevRole();
  const visibleAreas = ADMIN_AREAS.filter((a) => !a.cap || hasCap(devRole, a.cap));
  // If the current area got hidden by a role switch, fall back to documents.
  useEffect(() => {
    if (!visibleAreas.some((a) => a.id === adminArea)) setAdminArea("documents");
  }, [adminArea, devRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const AreaTabs = (
    <div className={styles.adminAreaTabs}>
      {visibleAreas.map((a) => {
        const active = adminArea === a.id;
        return (
          <button
            key={a.id}
            onClick={() => setAdminArea(a.id)}
            className={active ? `${styles.adminAreaTab} ${styles.adminAreaTabActive}` : styles.adminAreaTab}
          >
            <I name={a.icon} size={14} color={active ? "var(--primary)" : "var(--on-surface-variant)"} />
            <span>{a.label}</span>
          </button>
        );
      })}
    </div>
  );

  if (adminArea === "organisation") {
    return (
      <div>
        {AreaTabs}
        <OrganisationSettings />
      </div>
    );
  }
  if (adminArea === "templates") {
    return (
      <div>
        {AreaTabs}
        <MasterTemplateLibrary />
      </div>
    );
  }

  return (
    <div>
      {AreaTabs}
      {showUpload && (
        <UploadModal
          uploadSection={uploadSection}
          setUploadSection={setUploadSection}
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
          sections={sections}
        />
      )}
      {selectedDoc && (
        <DetailPanel
          doc={selectedDoc}
          currentSection={currentSection}
          onClose={() => setSelectedDoc(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      )}

      <SearchBar
        placeholder="Search this section by document, uploader or type…"
        value={query}
        onChange={setQuery}
      />

      <div className={styles.header}>
        <div>
          {/* Title matches the sidebar nav label — the page covers documents,
              master templates AND org settings, not just document upload. */}
          <h1 className={styles.title}>Admin Centre</h1>
          <p className={styles.lead}>
            Manage documents, control approvals, and maintain the clinical knowledge base.
          </p>
        </div>
        <BtnPrimary
          onClick={() => { setUploadSection(activeSection); setShowUpload(true); }}
          style={{ flexShrink: 0 }}
        >
          <I name="upload" size={16} color="var(--on-primary)" /> Upload Document
        </BtnPrimary>
      </div>

      <div className={styles.sectionTabs}>
        {sections.map((s) => {
          const active = activeSection === s.id;
          const count = docs.filter((d) => d.section === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => { setActiveSection(s.id); setFilterStatus("all"); }}
              className={active ? `${styles.sectionTab} ${styles.sectionTabActive}` : styles.sectionTab}
              style={active ? { color: s.color } : undefined}
            >
              <I name={s.icon} size={18} color={active ? s.color : "var(--outline-variant)"} />
              <span>{s.label}</span>
              <span
                className={styles.sectionTabBadge}
                style={
                  active
                    ? { background: `color-mix(in srgb, ${s.color} 12%, transparent)`, color: s.color }
                    : undefined
                }
              >
                {count} docs
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.statsRow}>
        {statTiles.map((s) => (
          <Card key={s.label} hover={false} className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}
            >
              <I name={s.icon} size={18} color={s.color} />
            </div>
            <div>
              <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.filterRow}>
        {filterOptions.map((f) => {
          const active = filterStatus === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={styles.filterChip}
              style={active ? { background: currentSection.color, color: "white" } : undefined}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <Card hover={false} style={{ overflow: "hidden" }}>
        <div className={styles.tableHeader}>
          {["Document", "Status", "Uploaded by", "Date", ""].map((h) => (
            <span key={h} className={styles.tableHeaderCell}>{h}</span>
          ))}
        </div>
        {filtered.map((doc) => {
          const sc = statusConfig[doc.status];
          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={styles.tableRow}
            >
              <div className={styles.docCell}>
                <div
                  className={styles.docIcon}
                  style={{ background: `color-mix(in srgb, ${currentSection.color} 10%, transparent)` }}
                >
                  <I name="file" size={15} color={currentSection.color} />
                </div>
                <div>
                  <div className={styles.docName}>{doc.name}</div>
                  <div className={styles.docMeta}>{doc.type} • {doc.size}</div>
                </div>
              </div>
              <div className={styles.statusCell}>
                <I name={sc.icon} size={14} color={sc.color} />
                <span className={styles.statusLabel} style={{ color: sc.color }}>{sc.label}</span>
              </div>
              <div className={styles.uploaderCell}>
                <Avatar name={doc.uploadedBy} size={22} />
                <span className={styles.uploaderName}>
                  {doc.uploadedBy.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
              <span className={styles.dateCell}>{doc.date}</span>
              <div className={styles.rowActions}>
                <div
                  className={styles.rowActionBtn}
                  onClick={(e) => { e.stopPropagation(); handleDownload(doc.id); }}
                >
                  <I name="download" size={14} color="var(--outline)" />
                </div>
                <div className={styles.rowActionBtn} onClick={(e) => e.stopPropagation()}>
                  <I name="more" size={14} color="var(--outline)" />
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <I name="file" size={28} color="var(--outline-variant)" />
            <p className={styles.emptyText}>No documents match your filters</p>
          </div>
        )}
      </Card>

      <div className={styles.cloudFooter}>
        <div className={styles.cloudInfo}>
          <I name="cloud" size={16} color="var(--primary)" />
          <span className={styles.cloudInfoText}>
            {import.meta.env.DEV
              ? <><span className={styles.cloudInfoBold}>Local development storage</span> · Browser-only sample data</>
              : <><span className={styles.cloudInfoBold}>Storage status unavailable</span> · Connect the authenticated storage health API</>}
          </span>
        </div>
        <span className={styles.cloudSync}>
          <I name="refresh" size={12} color="var(--outline)" /> Not cloud-synchronised
        </span>
      </div>
    </div>
  );
};
