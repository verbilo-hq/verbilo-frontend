/**
 * PilViewer — modal that displays a patient information leaflet in a two-page
 * layout that mirrors the printed booklet. The same DOM is used for on-screen
 * preview and for printing — print CSS in ClinicalPage.module.css hides the
 * surrounding chrome and lets the browser handle pagination.
 *
 * View states:
 *   - On-screen   → full modal, scroll between the two pages, action buttons visible
 *   - On print    → only `.pilPrintRoot` is visible; page footers/headers render
 *                   on each printed page via CSS @page rules.
 */
import { I } from "../components/Icon";
import styles from "./ClinicalPage.module.css";

/** Initials used as a logo fallback when no logo image is uploaded. */
const initialsOf = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "PR";

const PrettyHeader = ({ leaflet, category, eyebrow, branding }) => {
  const accent = branding?.accentColor || "var(--primary)";
  const name = branding?.practiceName || "Your Dental Practice";
  return (
    <div className={styles.pilHead}>
      <div className={styles.pilHeadLeft}>
        {branding?.logoDataUrl ? (
          <img src={branding.logoDataUrl} alt={`${name} logo`} className={styles.pilLogoImg} />
        ) : (
          <div className={styles.pilLogoBox} style={{ borderColor: accent, color: accent }}>
            {initialsOf(name)}
          </div>
        )}
        <div>
          <div className={styles.pilBrand} style={{ color: accent }}>{name}</div>
        </div>
      </div>
      <div className={styles.pilHeadRight}>
        <div className={styles.pilCategoryLabel} style={{ color: category?.color || accent }}>
          {category?.label || ""}
        </div>
        <div className={styles.pilRef}>{eyebrow} · {leaflet.ref}</div>
      </div>
    </div>
  );
};

const Eyebrow = ({ text, pageNum, pageTotal }) => (
  <div className={styles.pilEyebrow}>
    {text.toUpperCase()} · PAGE {pageNum} OF {pageTotal}
  </div>
);

const Foot = ({ leaflet, category, pageNum, pageTotal, branding }) => {
  const name = branding?.practiceName || "Your Dental Practice";
  return (
    <div className={styles.pilFoot}>
      <div>{name}{category?.label ? ` · ${category.label}` : ""}</div>
      <div>Page {pageNum} / {pageTotal} · {leaflet.ref}</div>
    </div>
  );
};

const SectionTitle = ({ children, color }) => (
  <h3 className={styles.pilSectionTitle} style={color ? { color } : undefined}>{children}</h3>
);

const ProseSection = ({ section }) => (
  <section className={styles.pilSection}>
    <SectionTitle>{section.title}</SectionTitle>
    {section.intro && <p className={styles.pilIntro}>{section.intro}</p>}
    <div className={styles.pilProseList}>
      {section.items.map((it, i) => (
        <div key={i} className={styles.pilProseItem}>
          {it.lead && <span className={styles.pilProseLead}>{it.lead} </span>}
          <span>{it.body}</span>
        </div>
      ))}
    </div>
  </section>
);

const NumberedSection = ({ section }) => (
  <section className={styles.pilSection}>
    <SectionTitle>{section.title}</SectionTitle>
    {section.intro && <p className={styles.pilIntro}>{section.intro}</p>}
    <ol className={styles.pilNumberedList}>
      {section.items.map((it, i) => (
        <li key={i} className={styles.pilNumberedItem}>
          <div className={styles.pilNumBadge}>{i + 1}</div>
          <div>
            <div className={styles.pilNumTitle}>{it.title}</div>
            <div className={styles.pilNumBody}>{it.body}</div>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

const ListSection = ({ section }) => (
  <section className={styles.pilSection}>
    <SectionTitle>{section.title}</SectionTitle>
    {section.intro && <p className={styles.pilIntro}>{section.intro}</p>}
    <div className={styles.pilCheckList}>
      {section.items.map((it, i) => (
        <div key={i} className={styles.pilCheckItem}>
          <div className={styles.pilCheckbox} />
          <div className={styles.pilCheckBody}>
            <div className={styles.pilCheckHead}>
              <span className={styles.pilCheckTitle}>{it.title}</span>
              {it.tag && <span className={styles.pilCheckTag}>{it.tag}</span>}
            </div>
            {it.body && <div className={styles.pilCheckText}>{it.body}</div>}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const CompareSection = ({ section }) => (
  <section className={styles.pilSection}>
    <SectionTitle>{section.title}</SectionTitle>
    <div className={styles.pilCompareGrid}>
      <div className={`${styles.pilCompareCol} ${styles.pilCompareGood}`}>
        <div className={styles.pilCompareHead}>{section.left.title}</div>
        <ul className={styles.pilCompareList}>
          {section.left.items.map((it, i) => (
            <li key={i}><span className={styles.pilTick}>✓</span> {it}</li>
          ))}
        </ul>
      </div>
      <div className={`${styles.pilCompareCol} ${styles.pilCompareBad}`}>
        <div className={styles.pilCompareHead}>{section.right.title}</div>
        <ul className={styles.pilCompareList}>
          {section.right.items.map((it, i) => (
            <li key={i}><span className={styles.pilCross}>✕</span> {it}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

const TimelineSection = ({ section }) => (
  <section className={styles.pilSection}>
    <SectionTitle>{section.title}</SectionTitle>
    <div className={styles.pilTimeline}>
      {section.items.map((it, i) => (
        <div key={i} className={styles.pilTimelineItem}>
          <div className={styles.pilTimelineTime}>{it.time}</div>
          <div className={styles.pilTimelineTitle}>{it.title}</div>
          <div className={styles.pilTimelineBody}>{it.body}</div>
        </div>
      ))}
    </div>
  </section>
);

const Callout = ({ data }) => (
  <div className={styles.pilCallout}>
    <div className={styles.pilCalloutTitle}>{data.title}</div>
    <div className={styles.pilCalloutBody}>{data.body}</div>
  </div>
);

const Notice = ({ data }) => (
  <div className={styles.pilNotice}>
    <div className={styles.pilNoticeHead}>
      <span className={styles.pilNoticeBang}>!</span>
      <span>{data.title}</span>
    </div>
    {data.body && <div className={styles.pilNoticeBody}>{data.body}</div>}
    {data.items?.length > 0 && (
      <ul className={styles.pilNoticeList}>
        {data.items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    )}
  </div>
);

const renderSection = (section, idx) => {
  switch (section.kind) {
    case "numbered": return <NumberedSection key={idx} section={section} />;
    case "list":     return <ListSection     key={idx} section={section} />;
    case "compare":  return <CompareSection  key={idx} section={section} />;
    case "timeline": return <TimelineSection key={idx} section={section} />;
    case "callout":  return <Callout key={idx} data={section} />;
    case "notice":   return <Notice  key={idx} data={section} />;
    default:         return <ProseSection key={idx} section={section} />;
  }
};

const LeafletPage = ({ leaflet, category, page, pageNum, pageTotal, isFirst, branding }) => (
  <div className={styles.pilPage}>
    <PrettyHeader leaflet={leaflet} category={category} branding={branding} eyebrow={isFirst ? "Patient Information" : (page.eyebrow || "Everyday Habits")} />
    <Eyebrow text={page.eyebrow || (isFirst ? "Patient Information" : "Everyday Habits")} pageNum={pageNum} pageTotal={pageTotal} />
    <h1 className={styles.pilTitle}>{isFirst ? leaflet.title : (page.pageTitle || leaflet.title)}</h1>
    {(isFirst ? leaflet.intro : page.intro) && (
      <p className={styles.pilLead}>{isFirst ? leaflet.intro : page.intro}</p>
    )}
    {(page.sections || []).map((s, i) => renderSection(s, i))}
    {page.callout && <Callout data={page.callout} />}
    {page.notice && <Notice data={page.notice} />}
    {page.noticeBox && <Notice data={page.noticeBox} />}
    <Foot leaflet={leaflet} category={category} pageNum={pageNum} pageTotal={pageTotal} branding={branding} />
  </div>
);

export const PilViewer = ({ leaflet, category, onClose, branding, sites = [], currentSiteId = null, onSiteChange, onManageBranding }) => {
  if (!leaflet) return null;
  const total = leaflet.pages?.length || 1;
  return (
    <div className={styles.pilModalOverlay} onClick={onClose}>
      <div className={styles.pilModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.pilActionBar}>
          <div className={styles.pilActionLeft}>
            <button className={styles.pilActionBtn} onClick={onClose} title="Close">
              <I name="xcircle" size={14} /> Close
            </button>
            <span className={styles.pilActionTitle}>{leaflet.title}</span>
            {category && (
              <span className={styles.pilActionPill} style={{ background: `${category.color}1A`, color: category.color, borderColor: `${category.color}55` }}>
                {category.label}
              </span>
            )}
          </div>
          <div className={styles.pilActionRight}>
            {sites.length > 0 && (
              <label className={styles.pilSitePicker} title="Print under this site’s letterhead">
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
          {(leaflet.pages || []).map((page, i) => (
            <LeafletPage
              key={i}
              leaflet={leaflet}
              category={category}
              page={page}
              pageNum={i + 1}
              pageTotal={total}
              isFirst={i === 0}
              branding={branding}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
