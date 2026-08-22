/**
 * ConsentViewer — modal that renders a fill-and-print consent form in the
 * practice's letterhead. Same DOM is used on-screen and at print time;
 * print CSS (in ClinicalPage.module.css) hides everything except the form
 * body and isolates each `.cfPage` as one A4 sheet.
 *
 * Reuses the per-site branding service from PIL, so a site override or the
 * group default flows through automatically.
 *
 * Section renderers supported (kind):
 *   fields     — labelled writing-line fields in a 1/2/3-col matrix
 *   options    — single labelled set of tick-box options
 *   cards      — checkbox + bold title + body paragraph
 *   pair       — two-column variant note cards
 *   questions  — Yes/No question matrix
 *   prefs      — multi-column preferences table
 *   notes      — labelled large writing areas
 *   summary    — 3-tile Purpose/Alternatives/No-treatment
 *   material   — copper-tinted "Proposed treatment" box
 *   signatures — signature ledger with 1–2 panels
 *   smallprint — small caveat paragraph
 */
import { I } from "../components/Icon";
import styles from "./ClinicalPage.module.css";

const initialsOf = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "PR";

const Head = ({ form, branding }) => {
  const accent = branding?.accentColor || "var(--primary)";
  const name = branding?.practiceName || "Your Dental Practice";
  return (
    <div className={styles.cfHead}>
      <div className={styles.cfHeadLeft}>
        {branding?.logoDataUrl ? (
          <img src={branding.logoDataUrl} alt={`${name} logo`} className={styles.cfLogoImg} />
        ) : (
          <div className={styles.cfLogo} style={{ borderColor: accent, color: accent }}>
            {initialsOf(name)}
          </div>
        )}
        <div>
          <div className={styles.cfPracticeName}>{name}</div>
          <div className={styles.cfPracticeSubtitle}>{form.practiceSubtitle}</div>
        </div>
      </div>
      <div className={styles.cfBadge}>
        <div className={styles.cfBadgeType} style={{ color: accent }}>{form.documentType}</div>
        <div className={styles.cfBadgeCode}>{form.ref} · Review May 2027</div>
      </div>
    </div>
  );
};

const TitlePanel = ({ page, accent }) => (
  <div className={styles.cfTitlePanel}>
    <div>
      <div className={styles.cfKicker} style={{ color: accent }}>{page.kicker}</div>
      <h1 className={styles.cfTitle}>{page.title}</h1>
      {page.lede && <p className={styles.cfLede}>{page.lede}</p>}
    </div>
    {page.statusChip && (
      <aside className={styles.cfStatusChip}>
        <strong>{page.statusChip.title}</strong>
        <span>{page.statusChip.body}</span>
      </aside>
    )}
  </div>
);

const Ribbon = ({ ribbon, accent }) => (
  <div className={styles.cfRibbon}>
    <div className={styles.cfRibbonMark} style={{ background: accent }}>{ribbon.mark}</div>
    <p>{ribbon.body}</p>
  </div>
);

const SectionTitle = ({ children, accent }) =>
  children ? (
    <h2 className={styles.cfSectionTitle} style={{ color: accent }}>
      <span className={styles.cfSectionDash} />
      {children}
    </h2>
  ) : null;

const FieldsSection = ({ section, accent }) => {
  const layout = section.layout || "2-col";
  return (
    <>
      <SectionTitle accent={accent}>{section.title}</SectionTitle>
      <section className={styles.cfFieldCard}>
        <div className={`${styles.cfFieldMatrix} ${layout === "3-col" ? styles.cfMatrix3 : layout === "1-col" ? styles.cfMatrix1 : ""}`}>
          {section.items.map((f, i) => (
            <div key={i} className={`${styles.cfField} ${f.full ? styles.cfFieldFull : ""}`}>
              <div className={styles.cfLabel}>{f.label}</div>
              <div className={`${styles.cfWritingLine} ${f.size === "medium" ? styles.cfLineMedium : f.size === "large" ? styles.cfLineLarge : f.size === "xlarge" ? styles.cfLineXlarge : ""}`} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

const OptionsSection = ({ section, accent }) => (
  <>
    <SectionTitle accent={accent}>{section.title}</SectionTitle>
    <section className={styles.cfFieldCard}>
      {section.items.map((it, i) => (
        <div key={i} className={styles.cfField} style={{ gridColumn: "1 / -1" }}>
          <div className={styles.cfLabel}>{it.label}</div>
          <div className={styles.cfOptionRow}>
            {it.options.map((opt, j) => (
              <span key={j} className={styles.cfOption}>
                <span className={styles.cfCheckSquare} style={{ borderColor: accent }} />
                <span>{opt}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  </>
);

const CardsSection = ({ section, accent }) => (
  <>
    <SectionTitle accent={accent}>{section.title}</SectionTitle>
    <ul className={`${styles.cfCards} ${section.twoCol ? styles.cfCardsTwo : ""}`}>
      {section.items.map((c, i) => (
        <li key={i} className={styles.cfCard}>
          <span className={styles.cfCheckSquare} style={{ borderColor: accent }} />
          <div>
            <strong>{c.title}</strong>
            {c.body && <p>{c.body}</p>}
          </div>
        </li>
      ))}
    </ul>
  </>
);

const PairSection = ({ section, accent }) => (
  <>
    <SectionTitle accent={accent}>{section.title}</SectionTitle>
    <div className={styles.cfTwoColumn}>
      {[section.left, section.right].map((col, i) => (
        <section key={i} className={`${styles.cfNoteCard} ${styles[`cfNote-${col.variant || "risk"}`]}`}>
          <h3>{col.title}</h3>
          <ul>
            {col.items.map((it, j) => (
              <li key={j}>{it}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </>
);

const QuestionsSection = ({ section, accent }) => (
  <>
    <SectionTitle accent={accent}>{section.title}</SectionTitle>
    <section className={styles.cfQuestionGrid}>
      <div className={styles.cfQHead}>Question</div>
      <div className={styles.cfQHead}>Yes</div>
      <div className={styles.cfQHead}>No</div>
      {section.items.map((q, i) => (
        <>
          <div key={`q-${i}`} className={styles.cfQuestion}>{q}</div>
          <span key={`y-${i}`} className={styles.cfCheckMini} style={{ borderColor: accent }} />
          <span key={`n-${i}`} className={styles.cfCheckMini} style={{ borderColor: accent }} />
        </>
      ))}
    </section>
  </>
);

const PrefsSection = ({ section, accent }) => (
  <>
    <SectionTitle accent={accent}>{section.title}</SectionTitle>
    <section className={styles.cfPrefTable}>
      <div className={`${styles.cfPrefRow} ${styles.cfPrefHeader}`}>
        {section.columns.map((c, i) => <div key={i}>{c}</div>)}
      </div>
      {section.rows.map((row, i) => (
        <div key={i} className={styles.cfPrefRow}>
          <div>{row}</div>
          {section.columns.slice(1).map((_, j) => (
            <span key={j} className={styles.cfCheckMini} style={{ borderColor: accent }} />
          ))}
        </div>
      ))}
    </section>
  </>
);

const NotesSection = ({ section, accent }) => (
  <>
    <SectionTitle accent={accent}>{section.title}</SectionTitle>
    <section className={styles.cfNotes}>
      {section.items.map((n, i) => (
        <div key={i}>
          <div className={styles.cfLabel}>{n.label}</div>
          <div className={`${styles.cfWritingLine} ${n.size === "medium" ? styles.cfLineMedium : n.size === "large" ? styles.cfLineLarge : styles.cfLineXlarge}`} />
        </div>
      ))}
    </section>
  </>
);

const SummarySection = ({ section, accent }) => (
  <>
    <SectionTitle accent={accent}>{section.title}</SectionTitle>
    <div className={styles.cfSummary}>
      {section.items.map((t, i) => (
        <div key={i} className={styles.cfSummaryTile}>
          <strong style={{ color: accent }}>{t.title}</strong>
          <span>{t.body}</span>
        </div>
      ))}
    </div>
  </>
);

const MaterialSection = ({ section }) => (
  <section className={styles.cfMaterial}>
    <h3>{section.title}</h3>
    <p>{section.body}</p>
  </section>
);

const SignaturesSection = ({ section, accent }) => (
  <section className={styles.cfSignatures}>
    <h2 style={{ color: accent }}>Signatures</h2>
    <div className={`${styles.cfSigGrid} ${section.panels.length === 1 ? styles.cfSigSingle : ""}`}>
      {section.panels.map((p, i) => (
        <div key={i} className={styles.cfSigPanel}>
          {p.lines.map((label, j) => (
            <div key={j}>
              <div className={styles.cfLabel}>{label}</div>
              <div className={styles.cfWritingLine} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </section>
);

const SmallPrint = ({ section }) => (
  <p className={styles.cfSmallPrint}>{section.body}</p>
);

const renderSection = (s, i, accent) => {
  switch (s.kind) {
    case "fields":     return <FieldsSection     key={i} section={s} accent={accent} />;
    case "options":    return <OptionsSection    key={i} section={s} accent={accent} />;
    case "cards":      return <CardsSection      key={i} section={s} accent={accent} />;
    case "pair":       return <PairSection       key={i} section={s} accent={accent} />;
    case "questions":  return <QuestionsSection  key={i} section={s} accent={accent} />;
    case "prefs":      return <PrefsSection      key={i} section={s} accent={accent} />;
    case "notes":      return <NotesSection      key={i} section={s} accent={accent} />;
    case "summary":    return <SummarySection    key={i} section={s} accent={accent} />;
    case "material":   return <MaterialSection   key={i} section={s} />;
    case "signatures": return <SignaturesSection key={i} section={s} accent={accent} />;
    case "smallprint": return <SmallPrint        key={i} section={s} />;
    default: return null;
  }
};

const ConsentPage = ({ form, page, branding, total, num }) => {
  const accent = branding?.accentColor || "var(--primary)";
  return (
    <article className={styles.cfPage}>
      <span className={styles.cfSpine} style={{ background: `linear-gradient(180deg, ${accent}, #a86635)` }} />
      <span className={styles.cfSpineLabel}>CONSENT</span>
      <Head form={form} branding={branding} />
      <TitlePanel page={page} accent={accent} />
      {page.ribbon && <Ribbon ribbon={page.ribbon} accent={accent} />}
      {(page.sections || []).map((s, i) => renderSection(s, i, accent))}
      {page.ongoing && (
        <aside className={styles.cfOngoing} style={{ background: accent }}>
          <strong>{page.ongoing.title}</strong>
          <p>{page.ongoing.body}</p>
        </aside>
      )}
      <footer className={styles.cfFoot}>
        <div>{branding?.practiceName || "Your Dental Practice"} · {form.documentType}</div>
        <div>Page {num} / {total} · {form.ref}</div>
      </footer>
    </article>
  );
};

export const ConsentViewer = ({ consent, category, onClose, branding, sites = [], currentSiteId = null, onSiteChange, onManageBranding }) => {
  if (!consent) return null;
  const total = consent.pages?.length || 1;
  return (
    <div className={styles.pilModalOverlay} onClick={onClose}>
      <div className={styles.pilModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.pilActionBar}>
          <div className={styles.pilActionLeft}>
            <button className={styles.pilActionBtn} onClick={onClose} title="Close">
              <I name="xcircle" size={14} /> Close
            </button>
            <span className={styles.pilActionTitle}>{consent.title}</span>
            {category && (
              <span className={styles.pilActionPill} style={{ background: `${category.color}1A`, color: category.color, borderColor: `${category.color}55` }}>
                {category.label}
              </span>
            )}
          </div>
          <div className={styles.pilActionRight}>
            {sites.length > 0 && (
              <label className={styles.pilSitePicker} title="Print under this site's letterhead">
                <span className={styles.pilSitePickerLabel}>Letterhead</span>
                <select className={styles.pilSitePickerSelect} value={currentSiteId ?? ""} onChange={(e) => onSiteChange?.(e.target.value || null)}>
                  <option value="">Group default</option>
                  {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
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
          {(consent.pages || []).map((page, i) => (
            <ConsentPage
              key={i}
              form={consent}
              page={page}
              branding={branding}
              total={total}
              num={i + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
