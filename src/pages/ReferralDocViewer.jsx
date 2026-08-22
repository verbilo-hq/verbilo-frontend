/**
 * Referral document viewer.
 *
 * Mirrors PilViewer / ConsentViewer:
 *   - Action bar with Close, title, Letterhead picker, Branding admin, Save PDF, Print.
 *   - Print-isolated root (`pilPrintRoot`) so window.print() outputs just the document.
 *   - Practice letterhead at the top of every printed document, respecting per-site overrides.
 *
 * Layout is professional clinician-facing — Inter/system sans-serif, accent
 * coloured ribbons and document-code pills. Content is rendered from a
 * declarative `sections` array on the document (see clinical-referrals.fixture.js).
 */
import { I } from "../components/Icon";
import styles from "./ClinicalPage.module.css";

/* ── Brand / governance header ──────────────────────────────────────────── */

const BrandHeader = ({ branding }) => {
  if (!branding) return null;
  return (
    <div className={styles.refBrandHead}>
      {branding.logoUrl
        ? <img src={branding.logoUrl} alt={branding.practiceName} className={styles.pilLogoImg} />
        : <div className={styles.refBrandName}>{branding.practiceName ?? "Your Dental Practice"}</div>}
      {branding.tagline && <div className={styles.refBrandTagline}>{branding.tagline}</div>}
      {(branding.address || branding.phone || branding.email) && (
        <div className={styles.refBrandMeta}>
          {[branding.address, branding.phone, branding.email].filter(Boolean).join("  ·  ")}
        </div>
      )}
    </div>
  );
};

const DocHeader = ({ doc, specialty }) => (
  <div className={styles.refDocHead} style={{ borderColor: specialty?.color ?? "var(--primary)" }}>
    <div className={styles.refDocEyebrow}>CLINICAL RESOURCES HUB · REFERRALS</div>
    <h1 className={styles.refDocTitle}>{doc.title}</h1>
    <div className={styles.refDocPills}>
      <span className={styles.refDocPill} style={{ background: `color-mix(in srgb, ${specialty?.color ?? "var(--primary)"} 12%, transparent)`, color: specialty?.color ?? "var(--primary)" }}>{doc.type}</span>
      <span className={styles.refDocPill}>Code: {doc.code}</span>
      <span className={styles.refDocPill}>Updated: {doc.updated}</span>
      <span className={styles.refDocPill}>Review due: {doc.review}</span>
    </div>
  </div>
);

const GovernanceNote = ({ body }) => (
  <div className={styles.refGovNote}>
    <strong>Governance note:</strong> {body}
  </div>
);

/* ── Section renderers ──────────────────────────────────────────────────── */

const SectionTitle = ({ section }) => <h2 className={styles.refSectionTitle}>{section.title}</h2>;

const Paragraph = ({ section }) => <p className={styles.refParagraph}>{section.body}</p>;

const Callout = ({ section }) => {
  const variantClass =
    section.variant === "danger"  ? styles.refCalloutDanger
  : section.variant === "warning" ? styles.refCalloutWarning
  :                                 styles.refCalloutInfo;
  return (
    <div className={`${styles.refCallout} ${variantClass}`}>
      {section.title && <strong>{section.title}: </strong>}
      <span>{section.body}</span>
    </div>
  );
};

const FieldRows = ({ section }) => (
  <div className={styles.refFieldTable}>
    {section.rows.map((row, i) => (
      <div key={i} className={styles.refFieldRow}>
        <div className={styles.refFieldRowLabel}>{row.label}</div>
        <div className={styles.refFieldRowFields}>
          {row.fields.map((f, j) => (
            <div
              key={j}
              className={f.lines && f.lines > 1 ? styles.refFieldCellTall : styles.refFieldCell}
              style={f.span && f.span > 1 ? { gridColumn: `span ${f.span}` } : undefined}
            >
              <span className={styles.refFieldCellLabel}>{f.label}</span>
              <div className={styles.refFieldCellInput} style={f.lines && f.lines > 1 ? { minHeight: `${f.lines * 18}px` } : undefined} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Checkboxes = ({ section }) => (
  <div className={styles.refCheckBlock}>
    {section.title && <div className={styles.refBlockTitle}>{section.title}</div>}
    <div className={styles.refCheckList}>
      {section.items.map((item, i) => (
        <div key={i} className={styles.refCheckItem}>
          <span className={styles.refCheckBox} />
          <span className={styles.refCheckLabel}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const DataTable = ({ section }) => (
  <div className={styles.refTableBlock}>
    {section.title && <div className={styles.refBlockTitle}>{section.title}</div>}
    <table className={styles.refTable}>
      <thead>
        <tr>{section.columns.map((c, i) => <th key={i}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {section.rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Script = ({ section }) => (
  <div className={styles.refScriptBlock}>
    {section.title && <div className={styles.refBlockTitle}>{section.title}</div>}
    <div className={styles.refScriptBody}>{section.body}</div>
  </div>
);

const InfoGrid = ({ section }) => (
  <div
    className={styles.refInfoGrid}
    style={section.cols ? { gridTemplateColumns: `repeat(${section.cols}, minmax(0, 1fr))` } : undefined}
  >
    {section.items.map((item, i) => (
      <div key={i} className={styles.refInfoCard}>
        <div className={styles.refInfoCardTitle}>{item.title}</div>
        {item.body && <div className={styles.refInfoCardBody}>{item.body}</div>}
        {item.bullets && (
          <ul className={styles.refInfoCardList}>
            {item.bullets.map((b, j) => <li key={j}>{b}</li>)}
          </ul>
        )}
      </div>
    ))}
  </div>
);

const ProseList = ({ section }) => (
  <div className={styles.refProseListBlock}>
    {section.title && <div className={styles.refBlockTitle}>{section.title}</div>}
    <ul className={styles.refProseList}>
      {section.items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  </div>
);

const References = ({ section }) => (
  <div className={styles.refRefsBlock}>
    <div className={styles.refBlockTitle}>{section.title ?? "References and source guidance"}</div>
    <ol className={styles.refRefsList}>
      {section.items.map((r, i) => (
        <li key={i}>
          <strong>{r.name}</strong>
          {r.url && <> <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.refRefsLink}>{r.url}</a></>}
        </li>
      ))}
    </ol>
  </div>
);

const NumberedSteps = ({ section }) => (
  <div className={styles.refStepsBlock}>
    {section.title && <div className={styles.refBlockTitle}>{section.title}</div>}
    <ol className={styles.refSteps}>
      {section.items.map((item, i) => (
        <li key={i} className={styles.refStep}>
          <span className={styles.refStepNum}>{i + 1}</span>
          <div className={styles.refStepBody}>
            <div className={styles.refStepTitle}>{item.title}</div>
            {item.body && <div className={styles.refStepText}>{item.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  </div>
);

const ReferenceBasis = ({ section }) => (
  <div className={styles.refReferenceBasis}>
    <strong>Reference basis: </strong>{section.body}
  </div>
);

const renderSection = (section, i) => {
  switch (section.kind) {
    case "section":          return <SectionTitle    key={i} section={section} />;
    case "paragraph":        return <Paragraph       key={i} section={section} />;
    case "callout":          return <Callout         key={i} section={section} />;
    case "field-rows":       return <FieldRows       key={i} section={section} />;
    case "checkboxes":       return <Checkboxes      key={i} section={section} />;
    case "table":            return <DataTable       key={i} section={section} />;
    case "script":           return <Script          key={i} section={section} />;
    case "info-grid":        return <InfoGrid        key={i} section={section} />;
    case "prose-list":       return <ProseList       key={i} section={section} />;
    case "numbered-steps":   return <NumberedSteps   key={i} section={section} />;
    case "references":       return <References      key={i} section={section} />;
    case "reference-basis":  return <ReferenceBasis  key={i} section={section} />;
    default:                 return null;
  }
};

/* ── Document body ──────────────────────────────────────────────────────── */

const StubBody = ({ doc }) => (
  <div className={styles.refStubBody}>
    <div className={styles.refStubIcon}><I name="file" size={28} color="var(--on-surface-variant)" /></div>
    <div className={styles.refStubTitle}>Document content coming soon</div>
    <p className={styles.refStubText}>
      This entry is part of the {doc.specialty?.label ?? "referral"} pack. Full content will be added in the next batch — for now, the metadata above (code, type, review date) is the published reference.
    </p>
  </div>
);

const DocFooter = () => (
  <div className={styles.refDocFooter}>
    <span>Owner: Clinical Governance Lead / Referral Lead.</span>
    <span>Approved by: __________________  Approval date: __________________  Next review: __________________</span>
    <span>This document does not replace clinical judgement, local NHS/private referral rules, safeguarding procedures, consent requirements or IR(ME)R duties.</span>
  </div>
);

/* ── Viewer shell ───────────────────────────────────────────────────────── */

export const ReferralDocViewer = ({
  doc,
  onClose,
  branding,
  sites = [],
  currentSiteId = null,
  onSiteChange,
  onManageBranding,
}) => {
  if (!doc) return null;
  const specialty = doc.specialty;
  const hasSections = Array.isArray(doc.sections) && doc.sections.length > 0;

  return (
    <div className={styles.pilModalOverlay} onClick={onClose}>
      <div className={styles.pilModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.pilActionBar}>
          <div className={styles.pilActionLeft}>
            <button className={styles.pilActionBtn} onClick={onClose} title="Close">
              <I name="xcircle" size={14} /> Close
            </button>
            <span className={styles.pilActionTitle}>{doc.title}</span>
            {specialty && (
              <span
                className={styles.pilActionPill}
                style={{ background: `${specialty.color}1A`, color: specialty.color, borderColor: `${specialty.color}55` }}
              >
                {specialty.label}
              </span>
            )}
          </div>
          <div className={styles.pilActionRight}>
            {sites.length > 0 && (
              <label className={styles.pilSitePicker} title="Print under this site's letterhead">
                <span className={styles.pilSitePickerLabel}>Letterhead</span>
                <select
                  className={styles.pilSitePickerSelect}
                  value={currentSiteId ?? ""}
                  onChange={(e) => onSiteChange?.(e.target.value || null)}
                >
                  <option value="">Group default</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>
            )}
            {onManageBranding && (
              <button className={styles.pilActionBtn} onClick={onManageBranding} title="Manage branding">
                <I name="settings" size={14} /> Branding
              </button>
            )}
            <button className={styles.pilActionBtn} onClick={() => window.print()} title="Save as PDF (choose 'Save as PDF' in the print dialog)">
              <I name="download" size={14} /> Save PDF
            </button>
            <button className={styles.pilActionBtnPrimary} onClick={() => window.print()} title="Print">
              <I name="printer" size={14} /> Print
            </button>
          </div>
        </div>

        <div className={styles.pilPrintRoot}>
          <div className={styles.refPage}>
            <BrandHeader branding={branding} />
            <DocHeader doc={doc} specialty={specialty} />
            {doc.governanceNote && <GovernanceNote body={doc.governanceNote} />}
            {hasSections ? doc.sections.map(renderSection) : <StubBody doc={doc} />}
            <DocFooter />
          </div>
        </div>
      </div>
    </div>
  );
};
