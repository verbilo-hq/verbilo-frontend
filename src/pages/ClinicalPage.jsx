import { useState } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnSecondary } from "../components/ui/Buttons";
import { SearchBar } from "../components/ui/SearchBar";
import { TopBar } from "../components/layout/TopBar";
import styles from "./ClinicalPage.module.css";

const kloe = [
  { label: "Safe", icon: "shield" },
  { label: "Effective", icon: "check" },
  { label: "Caring", icon: "heart" },
  { label: "Responsive", icon: "zap" },
  { label: "Well-Led", icon: "star" },
];

const kloeDocuments = {
  Safe: [
    { name: "Infection Prevention & Control Policy", type: "PDF", size: "1.8 MB", updated: "Jan 2024", status: "Current", author: "Compliance Team" },
    { name: "Sharps & Clinical Waste Protocol", type: "PDF", size: "920 KB", updated: "Nov 2023", status: "Current", author: "H&S Lead" },
    { name: "Radiography Safety & IRMER Compliance", type: "PDF", size: "2.1 MB", updated: "Dec 2023", status: "Current", author: "Dr. Maya Patel" },
    { name: "Medical Emergency Drugs Checklist", type: "DOCX", size: "340 KB", updated: "Feb 2024", status: "Updated", author: "Dr. Alexander Chen" },
    { name: "Lone Worker Risk Assessment", type: "PDF", size: "560 KB", updated: "Sep 2023", status: "Review Due", author: "Mark Thompson" },
  ],
  Effective: [
    { name: "Clinical Audit Cycle Framework", type: "PDF", size: "1.4 MB", updated: "Jan 2024", status: "Current", author: "Dr. Sarah Jenkins" },
    { name: "Evidence-Based Prescribing Guidelines", type: "PDF", size: "2.3 MB", updated: "Oct 2023", status: "Current", author: "Dr. Alexander Chen" },
    { name: "Restorative Outcomes Tracker Template", type: "XLSX", size: "780 KB", updated: "Dec 2023", status: "Current", author: "Clinical Governance" },
    { name: "Referral Pathway Effectiveness Review", type: "PDF", size: "1.1 MB", updated: "Nov 2023", status: "Current", author: "Dr. Maya Patel" },
  ],
  Caring: [
    { name: "Patient Communication Standards", type: "PDF", size: "1.2 MB", updated: "Feb 2024", status: "Updated", author: "Patient Experience Lead" },
    { name: "Consent & Capacity Policy", type: "PDF", size: "1.9 MB", updated: "Jan 2024", status: "Current", author: "Legal & Compliance" },
    { name: "Vulnerable Patient Pathway Guide", type: "PDF", size: "850 KB", updated: "Dec 2023", status: "Current", author: "Safeguarding Lead" },
    { name: "Patient Feedback Response Framework", type: "DOCX", size: "420 KB", updated: "Nov 2023", status: "Current", author: "Mark Thompson" },
  ],
  Responsive: [
    { name: "Complaints Handling Procedure", type: "PDF", size: "1.5 MB", updated: "Jan 2024", status: "Current", author: "Practice Manager" },
    { name: "Emergency Access & Triage Protocol", type: "PDF", size: "980 KB", updated: "Feb 2024", status: "Updated", author: "Dr. Alexander Chen" },
    { name: "Appointment Availability Standards", type: "PDF", size: "640 KB", updated: "Oct 2023", status: "Current", author: "Operations Team" },
    { name: "Special Needs & Accessibility Guide", type: "PDF", size: "1.1 MB", updated: "Dec 2023", status: "Current", author: "Patient Experience Lead" },
  ],
  "Well-Led": [
    { name: "Clinical Governance Framework 2024", type: "PDF", size: "3.2 MB", updated: "Jan 2024", status: "Current", author: "Dr. Sarah Jenkins" },
    { name: "Staff Appraisal & CPD Policy", type: "PDF", size: "1.4 MB", updated: "Nov 2023", status: "Current", author: "HR Team" },
    { name: "Risk Register & Mitigation Plan", type: "XLSX", size: "2.8 MB", updated: "Feb 2024", status: "Updated", author: "Compliance Team" },
    { name: "Whistleblowing & Duty of Candour Policy", type: "PDF", size: "720 KB", updated: "Sep 2023", status: "Review Due", author: "Legal & Compliance" },
    { name: "Business Continuity Plan", type: "PDF", size: "1.6 MB", updated: "Dec 2023", status: "Current", author: "Mark Thompson" },
  ],
};

const statusColors = {
  Current: "var(--success)",
  Updated: "var(--primary)",
  "Review Due": "var(--warning)",
};

const fileTypeColors = {
  PDF: "var(--error)",
  XLSX: "var(--success)",
  DOCX: "var(--primary)",
};

const fileTypeBg = {
  PDF: "rgba(168, 56, 54, 0.06)",
  XLSX: "rgba(76, 175, 80, 0.06)",
  DOCX: "rgba(0, 105, 116, 0.06)",
};

const referralPathways = [
  { label: "Oral Surgery", icon: "clinical" },
  { label: "Orthodontics", icon: "star" },
  { label: "Endo Specialists", icon: "tooth" },
];

const referralDocuments = {
  "Oral Surgery": [
    { name: "Oral Surgery Referral Form", type: "PDF", size: "420 KB", updated: "Feb 2024" },
    { name: "Surgical Extraction Pathway Guide", type: "PDF", size: "1.3 MB", updated: "Jan 2024" },
    { name: "Impacted Third Molar Referral Criteria", type: "PDF", size: "680 KB", updated: "Nov 2023" },
    { name: "Post-Surgical Complications Protocol", type: "PDF", size: "950 KB", updated: "Dec 2023" },
    { name: "Biopsy & Lesion Referral Pathway", type: "DOCX", size: "310 KB", updated: "Oct 2023" },
  ],
  Orthodontics: [
    { name: "Orthodontic Referral Form (Adults)", type: "PDF", size: "380 KB", updated: "Feb 2024" },
    { name: "Orthodontic Referral Form (Under 18s)", type: "PDF", size: "400 KB", updated: "Feb 2024" },
    { name: "Invisalign Clinical Pathway", type: "PDF", size: "2.1 MB", updated: "Jan 2024" },
    { name: "Complex Case Discussion Request Form", type: "DOCX", size: "290 KB", updated: "Dec 2023" },
    { name: "Orthodontic Emergency Triage Guide", type: "PDF", size: "540 KB", updated: "Nov 2023" },
    { name: "Retention Protocol & Follow-Up Pathway", type: "PDF", size: "720 KB", updated: "Oct 2023" },
  ],
  "Endo Specialists": [
    { name: "Endodontic Specialist Referral Form", type: "PDF", size: "350 KB", updated: "Jan 2024" },
    { name: "Root Canal Retreatment Pathway", type: "PDF", size: "1.1 MB", updated: "Feb 2024" },
    { name: "Apicectomy Referral Criteria", type: "PDF", size: "480 KB", updated: "Dec 2023" },
    { name: "CBCT Imaging Request for Endo Cases", type: "DOCX", size: "260 KB", updated: "Nov 2023" },
    { name: "Internal Resorption Management Guide", type: "PDF", size: "890 KB", updated: "Sep 2023" },
  ],
};

const protocols = [
  { name: "Emergency Drugs", desc: "Dosage and administration guide for medical emergencies." },
  { name: "Sedation Care", desc: "Pre and post-operative monitoring standards." },
  { name: "Endodontics", desc: "Aseptic technique and irrigation sequences." },
];

const audits = [
  { name: "Infection Control", status: "98% PASS", color: "var(--success)" },
  { name: "Radiography Audits", status: "IN PROGRESS", color: "var(--primary)" },
  { name: "Clinical Notes", status: "100% PASS", color: "var(--success)" },
];

export const ClinicalPage = () => {
  const [activeKloe, setActiveKloe] = useState(null);
  const [activeReferral, setActiveReferral] = useState(null);

  return (
    <div>
      <SearchBar placeholder="Search clinical protocols, CQC evidence, or referral guides..." />
      <TopBar
        title="Clinical Resources Hub"
        subtitle="Centralized evidence-based guidelines, compliance frameworks, and digital workflows for Inspire Dental Group clinicians."
      />

      <div className={styles.layout}>
        <div>
          <Card hover={false} className={styles.kloeCard}>
            <div className={styles.kloeHeader}>
              <div>
                <h3 className={styles.kloeTitle}>CQC KLOE Library</h3>
                <p className={styles.kloeLead}>
                  Quality evidence and documentation mapped to the Key Lines of Enquiry.
                </p>
              </div>
              <I name="check" size={22} color="var(--primary)" />
            </div>

            <div className={styles.kloeRow}>
              {kloe.map((k) => {
                const isActive = activeKloe === k.label;
                return (
                  <div
                    key={k.label}
                    onClick={() => setActiveKloe(isActive ? null : k.label)}
                    className={isActive ? `${styles.kloeChip} ${styles.kloeChipActive}` : styles.kloeChip}
                  >
                    <div className={styles.kloeIconWrap}>
                      <I name={k.icon} size={20} color={isActive ? "var(--on-primary)" : "var(--primary)"} />
                    </div>
                    <p className={styles.kloeChipLabel}>{k.label}</p>
                  </div>
                );
              })}
            </div>

            {activeKloe && (
              <div className={styles.docPanel}>
                <div className={styles.docPanelHeader}>
                  <div className={styles.docPanelHeading}>
                    <I name={kloe.find((k) => k.label === activeKloe)?.icon} size={16} color="var(--primary)" />
                    <h4 className={styles.docPanelTitle}>
                      {activeKloe} — {kloeDocuments[activeKloe]?.length} Documents
                    </h4>
                  </div>
                  <span onClick={() => setActiveKloe(null)} className={styles.docPanelClose}>
                    Close ✕
                  </span>
                </div>

                <div className={styles.docList}>
                  {kloeDocuments[activeKloe]?.map((doc) => (
                    <div key={doc.name} className={styles.docRow}>
                      <div
                        className={styles.docFileIcon}
                        style={{ background: fileTypeBg[doc.type] }}
                      >
                        <I name="file" size={16} color={fileTypeColors[doc.type]} />
                      </div>
                      <div className={styles.docInfo}>
                        <div className={styles.docName}>{doc.name}</div>
                        <div className={styles.docMeta}>
                          <span>{doc.type} • {doc.size}</span>
                          <span>Updated {doc.updated}</span>
                          <span>by {doc.author}</span>
                        </div>
                      </div>
                      <Pill
                        bg={`color-mix(in srgb, ${statusColors[doc.status]} 12%, transparent)`}
                        color={statusColors[doc.status]}
                        small
                      >
                        {doc.status}
                      </Pill>
                      <div className={styles.docActions}>
                        <div title="Preview" className={styles.docAction}>
                          <I name="eye" size={14} color="var(--primary)" />
                        </div>
                        <div title="Download" className={styles.docAction}>
                          <I name="download" size={14} color="var(--primary)" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className={styles.kloeMeta}>
              <I name="dot" size={12} /> Last updated 12 hours ago by Compliance Team
            </p>
          </Card>

          <div className={styles.bottomRow}>
            <Card hover={false} className={styles.subCard}>
              <h3 className={styles.subHeading}>
                <I name="book" size={18} /> Clinical Protocols
              </h3>
              {protocols.map((p) => (
                <div key={p.name} className={styles.protocolItem}>
                  <div className={styles.protocolName}>{p.name}</div>
                  <div className={styles.protocolDesc}>{p.desc}</div>
                </div>
              ))}
            </Card>

            <Card hover={false} className={styles.subCard}>
              <h3 className={styles.subHeading}>Quality Audit Center</h3>
              {audits.map((a) => (
                <div key={a.name} className={styles.auditRow}>
                  <span className={styles.auditName}>{a.name}</span>
                  <Pill
                    bg={`color-mix(in srgb, ${a.color} 14%, transparent)`}
                    color={a.color}
                    small
                  >
                    {a.status}
                  </Pill>
                </div>
              ))}
              <BtnSecondary style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
                <I name="plus" size={14} /> Submit New Audit
              </BtnSecondary>
            </Card>
          </div>
        </div>

        <div>
          <div className={styles.referralBlock}>
            <h3 className={styles.referralHeading}>Referral Pathways</h3>
            <p className={styles.referralLead}>
              Direct links to specialist secondary care and in-house consultants.
            </p>
            {referralPathways.map((s) => {
              const isActive = activeReferral === s.label;
              return (
                <div key={s.label}>
                  <div
                    onClick={() => setActiveReferral(isActive ? null : s.label)}
                    className={isActive ? `${styles.referralRow} ${styles.referralRowActive}` : styles.referralRow}
                  >
                    <div className={styles.referralLabel}>
                      <I name={s.icon} size={16} color="var(--on-primary)" /> {s.label}
                    </div>
                    <span className={isActive ? `${styles.referralChevron} ${styles.referralChevronOpen}` : styles.referralChevron}>
                      ▾
                    </span>
                  </div>

                  {isActive && (
                    <div className={styles.referralPanel}>
                      <div className={styles.referralPanelLabel}>
                        {referralDocuments[s.label]?.length} Documents
                      </div>
                      <div className={styles.referralDocList}>
                        {referralDocuments[s.label]?.map((doc) => (
                          <div key={doc.name} className={styles.referralDocRow}>
                            <div
                              className={styles.referralDocIcon}
                              style={{ background: doc.type === "PDF" ? "rgba(168,56,54,0.2)" : "rgba(0,105,116,0.2)" }}
                            >
                              <I
                                name="file"
                                size={13}
                                color={doc.type === "PDF" ? "#fa746f" : "var(--primary-container)"}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className={styles.referralDocName}>{doc.name}</div>
                              <div className={styles.referralDocMeta}>
                                {doc.type} • {doc.size} • {doc.updated}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                              <div title="Preview" className={styles.referralDocAction}>
                                <I name="eye" size={12} color="var(--on-primary)" />
                              </div>
                              <div title="Download" className={styles.referralDocAction}>
                                <I name="download" size={12} color="var(--on-primary)" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <BtnSecondary
              style={{ width: "100%", justifyContent: "center", marginTop: 16, background: "rgba(255,255,255,0.95)", color: "var(--primary)" }}
            >
              New Specialist Referral
            </BtnSecondary>
          </div>

          <Card hover={false} className={styles.labCard}>
            <h3 className={styles.labTitle}>Lab & Digital Hub</h3>
            <p className={styles.labLead}>Scanning protocols & digital laboratory dockets.</p>
            <div className={styles.labActions}>
              <BtnSecondary
                style={{ flex: 1, justifyContent: "center", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 12 }}
              >
                Digital Dockets
              </BtnSecondary>
              <BtnSecondary
                style={{ flex: 1, justifyContent: "center", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 12 }}
              >
                iTero Guides
              </BtnSecondary>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
