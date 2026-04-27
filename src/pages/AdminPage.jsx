import { useState } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { SearchBar } from "../components/ui/SearchBar";
import styles from "./AdminPage.module.css";

const sections = [
  { id: "clinical", label: "Clinical Resources", icon: "clinical", color: "var(--primary)" },
  { id: "staff", label: "Staff Directory", icon: "staff", color: "var(--secondary)" },
  { id: "marketing", label: "Marketing Hub", icon: "marketing", color: "var(--on-tertiary-container)" },
  { id: "training", label: "Training Hub", icon: "training", color: "var(--success)" },
  { id: "cpd", label: "CPD Tracker", icon: "chart", color: "var(--warning)" },
];

const initialDocs = [
  { id: 1, name: "Infection Control Policy v3.2", section: "clinical", status: "approved", uploadedBy: "Dr. Sarah Jenkins", date: "2024-01-15", size: "2.4 MB", type: "PDF", approvedBy: "Mark Thompson", approvedDate: "2024-01-16", version: "3.2", downloads: 47 },
  { id: 2, name: "Emergency Drug Dosage Chart", section: "clinical", status: "approved", uploadedBy: "Dr. Alexander Chen", date: "2024-01-08", size: "890 KB", type: "PDF", approvedBy: "Dr. Sarah Jenkins", approvedDate: "2024-01-09", version: "5.1", downloads: 112 },
  { id: 3, name: "Radiography Audit Checklist", section: "clinical", status: "in_review", uploadedBy: "Dr. Maya Patel", date: "2024-02-25", size: "1.8 MB", type: "PDF", reviewer: "Dr. Sarah Jenkins", version: "4.0", downloads: 0 },
  { id: 4, name: "Sedation Monitoring Standards", section: "clinical", status: "pending", uploadedBy: "Leo Vance", date: "2024-02-22", size: "1.2 MB", type: "PDF", version: "2.0", downloads: 0 },
  { id: 5, name: "Endodontic Irrigation Protocol", section: "clinical", status: "approved", uploadedBy: "Dr. Maya Patel", date: "2024-01-20", size: "640 KB", type: "PDF", approvedBy: "Dr. Alexander Chen", approvedDate: "2024-01-21", version: "3.0", downloads: 38 },
  { id: 6, name: "Staff Onboarding Checklist 2024", section: "staff", status: "approved", uploadedBy: "Elena Rossi", date: "2024-02-01", size: "1.1 MB", type: "DOCX", approvedBy: "Mark Thompson", approvedDate: "2024-02-02", version: "1.0", downloads: 24 },
  { id: 7, name: "Organisation Chart - Q1 2024", section: "staff", status: "approved", uploadedBy: "Mark Thompson", date: "2024-01-10", size: "420 KB", type: "PDF", approvedBy: "Dr. Alexander Chen", approvedDate: "2024-01-11", version: "2.1", downloads: 56 },
  { id: 8, name: "New Starter Bio Template", section: "staff", status: "pending", uploadedBy: "Jessica Wu", date: "2024-02-28", size: "280 KB", type: "DOCX", version: "1.0", downloads: 0 },
  { id: 9, name: "Team Photo Guidelines", section: "staff", status: "approved", uploadedBy: "Elena Rossi", date: "2024-01-05", size: "350 KB", type: "PDF", approvedBy: "Mark Thompson", approvedDate: "2024-01-06", version: "1.2", downloads: 15 },
  { id: 10, name: "Brand Guidelines - Summer Campaign", section: "marketing", status: "rejected", uploadedBy: "Jessica Wu", date: "2024-02-18", size: "5.7 MB", type: "PDF", rejectedBy: "Mark Thompson", rejectedReason: "Logo usage on pg.4 doesn't meet brand standards.", version: "1.0", downloads: 0 },
  { id: 11, name: "Social Media Template Pack", section: "marketing", status: "approved", uploadedBy: "Jessica Wu", date: "2024-01-25", size: "12.4 MB", type: "ZIP", approvedBy: "Mark Thompson", approvedDate: "2024-01-26", version: "3.0", downloads: 31 },
  { id: 12, name: "Patient Testimonial Release Form", section: "marketing", status: "approved", uploadedBy: "Elena Rossi", date: "2024-01-12", size: "180 KB", type: "DOCX", approvedBy: "Mark Thompson", approvedDate: "2024-01-13", version: "2.1", downloads: 22 },
  { id: 13, name: "Whitening Campaign Assets", section: "marketing", status: "in_review", uploadedBy: "Jessica Wu", date: "2024-02-26", size: "8.3 MB", type: "ZIP", reviewer: "Mark Thompson", version: "1.0", downloads: 0 },
  { id: 14, name: "CPR Refresher Slides 2024", section: "training", status: "approved", uploadedBy: "Dr. Alexander Chen", date: "2024-01-18", size: "4.2 MB", type: "PPTX", approvedBy: "Dr. Sarah Jenkins", approvedDate: "2024-01-19", version: "6.0", downloads: 67 },
  { id: 15, name: "Safeguarding Level 2 Certificate Template", section: "training", status: "pending", uploadedBy: "Leo Vance", date: "2024-02-22", size: "340 KB", type: "DOCX", version: "2.0", downloads: 0 },
  { id: 16, name: "Infection Control E-Learning Module", section: "training", status: "approved", uploadedBy: "Dr. Sarah Jenkins", date: "2024-02-05", size: "18.6 MB", type: "ZIP", approvedBy: "Dr. Alexander Chen", approvedDate: "2024-02-06", version: "4.1", downloads: 89 },
  { id: 17, name: "New Composite Technique Masterclass", section: "training", status: "approved", uploadedBy: "Dr. Maya Patel", date: "2024-02-10", size: "2.8 MB", type: "PDF", approvedBy: "Dr. Sarah Jenkins", approvedDate: "2024-02-11", version: "1.0", downloads: 43 },
  { id: 18, name: "GDC CPD Requirements 2024 Guide", section: "cpd", status: "approved", uploadedBy: "Dr. Sarah Jenkins", date: "2024-01-02", size: "1.6 MB", type: "PDF", approvedBy: "Dr. Alexander Chen", approvedDate: "2024-01-03", version: "2.0", downloads: 74 },
  { id: 19, name: "CPD Activity Log Template", section: "cpd", status: "approved", uploadedBy: "Elena Rossi", date: "2024-01-08", size: "220 KB", type: "XLSX", approvedBy: "Mark Thompson", approvedDate: "2024-01-09", version: "3.2", downloads: 52 },
  { id: 20, name: "Reflective Practice Worksheet", section: "cpd", status: "pending", uploadedBy: "Dr. Maya Patel", date: "2024-02-27", size: "380 KB", type: "DOCX", version: "1.0", downloads: 0 },
  { id: 21, name: "Enhanced CPD Compliance Checklist", section: "cpd", status: "in_review", uploadedBy: "Leo Vance", date: "2024-02-24", size: "290 KB", type: "PDF", reviewer: "Dr. Sarah Jenkins", version: "1.5", downloads: 0 },
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

const UploadModal = ({ uploadSection, setUploadSection, onClose }) => {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div className={styles.modalScrim} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Upload Document</h2>
          <div onClick={onClose} className={styles.modalCloser}>
            <I name="xcircle" size={22} color="var(--outline)" />
          </div>
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

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          className={dragOver ? `${styles.dropZone} ${styles.dropZoneActive}` : styles.dropZone}
        >
          <div className={styles.dropZoneIconWrap}>
            <I name="cloud" size={24} color="var(--primary)" />
          </div>
          <p className={styles.dropZoneTitle}>Drag & drop files here</p>
          <p className={styles.dropZoneHelp}>
            or <span className={styles.dropZoneLink}>browse from your device</span>
          </p>
          <p className={styles.dropZoneFormats}>PDF, DOCX, XLSX, PPTX, ZIP up to 25MB</p>
        </div>

        <div className={styles.modalBlock}>
          <label className={styles.modalLabel}>Description</label>
          <textarea
            rows={2}
            placeholder="Brief description of the document..."
            className={styles.modalTextarea}
          />
        </div>

        <div className={styles.modalNotice}>
          <I name="shieldalert" size={16} color="var(--primary)" />
          <span className={styles.modalNoticeText}>
            Documents require approval before they become visible to staff.
          </span>
        </div>

        <div className={styles.modalActions}>
          <BtnPrimary onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>
            <I name="upload" size={16} color="var(--on-primary)" /> Upload & Submit for Review
          </BtnPrimary>
          <BtnSecondary onClick={onClose} style={{ padding: "14px 20px" }}>Cancel</BtnSecondary>
        </div>
      </div>
    </div>
  );
};

const DetailPanel = ({ doc, currentSection, onClose, onApprove, onReject, onDelete }) => {
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
          <BtnPrimary onClick={() => {}} style={{ width: "100%", justifyContent: "center" }}>
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
  const [activeSection, setActiveSection] = useState("clinical");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadSection, setUploadSection] = useState("clinical");
  const [docs, setDocs] = useState(initialDocs);

  const sectionDocs = docs.filter((d) => d.section === activeSection);
  const filtered = sectionDocs.filter(
    (d) => filterStatus === "all" || d.status === filterStatus
  );
  const sectionStats = {
    total: sectionDocs.length,
    approved: sectionDocs.filter((d) => d.status === "approved").length,
    pending: sectionDocs.filter((d) => d.status === "pending" || d.status === "in_review").length,
    rejected: sectionDocs.filter((d) => d.status === "rejected").length,
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  const handleApprove = (id) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: "approved", approvedBy: "Dr. Alexander Chen", approvedDate: new Date().toISOString().split("T")[0] }
          : d
      )
    );
    setSelectedDoc(null);
  };

  const handleReject = (id) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: "rejected", rejectedBy: "Dr. Alexander Chen", rejectedReason: "Needs revision — see comments." }
          : d
      )
    );
    setSelectedDoc(null);
  };

  const handleDelete = (id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setSelectedDoc(null);
  };

  const statTiles = [
    { label: "Total", value: sectionStats.total, icon: "layers", color: currentSection.color },
    { label: "Approved", value: sectionStats.approved, icon: "checkcircle", color: "var(--success)" },
    { label: "Pending", value: sectionStats.pending, icon: "clock3", color: "var(--warning)" },
    { label: "Rejected", value: sectionStats.rejected, icon: "xcircle", color: "var(--error)" },
  ];

  return (
    <div>
      {showUpload && (
        <UploadModal
          uploadSection={uploadSection}
          setUploadSection={setUploadSection}
          onClose={() => setShowUpload(false)}
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
        />
      )}

      <SearchBar placeholder="Search documents across all sections..." />

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Document Upload Centre</h1>
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
                <div className={styles.rowActionBtn} onClick={(e) => e.stopPropagation()}>
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
            Cloud Storage: <span className={styles.cloudInfoBold}>4.8 GB</span> of 50 GB used • AWS S3 (eu-west-2)
          </span>
        </div>
        <span className={styles.cloudSync}>
          <I name="refresh" size={12} color="var(--outline)" /> Last synced: 2 mins ago
        </span>
      </div>
    </div>
  );
};
