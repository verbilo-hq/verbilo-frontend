/**
 * Polished SOP renderer — renders a markdown body as a styled document
 * (header band, metadata grid, numbered section bars, callout boxes, footer).
 *
 * Used by:
 *   - Admin Centre → SaaS Master Template Library (editor preview)
 *   - Governance pack wizard → Documents & SOPs to Review (per-doc preview)
 *
 * Supports a small markdown subset — # ## ### headings, paragraphs, ordered
 * & unordered lists, **bold**, _italic_ / *italic*, `inline code`, > blockquote,
 * --- horizontal rule. Auto-detects a leading metadata block (consecutive
 * `**Label:** value` lines), strips the first H1 into the header band, and
 * folds a trailing `_References: …_` line into the footer.
 */

import styles from "./SopPreview.module.css";

export function SopPreview({ body, template }) {
  if (!body?.trim()) {
    return <div className={styles.previewEmpty}>(no body yet — start typing to preview)</div>;
  }

  const lines = body.split("\n");
  let h1Title = template?.title ?? "";
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trimEnd().match(/^#\s+(.*)$/);
    if (m) { h1Title = m[1]; startIdx = i + 1; break; }
    if (lines[i].trim() !== "") break;
  }
  const restLines = lines.slice(startIdx);

  // Extract leading `**Label:** value` metadata block (Applies to / Frequency / …).
  const meta = [];
  let metaConsumed = 0;
  for (let i = 0; i < restLines.length; i++) {
    const line = restLines[i].trim();
    if (line === "") { metaConsumed = i + 1; continue; }
    const mm = line.match(/^\*\*([^:*]+):\*\*\s+(.+)$/);
    if (mm) {
      meta.push({ label: mm[1].trim(), value: mm[2].trim() });
      metaConsumed = i + 1;
    } else {
      break;
    }
  }
  const bodyLines = restLines.slice(metaConsumed);

  // Extract trailing references line into footer.
  let footerRefs = null;
  for (let i = bodyLines.length - 1; i >= 0; i--) {
    const line = bodyLines[i].trim();
    if (line === "") continue;
    const m1 = line.match(/^_References?:\s*(.+?)_?\.?\s*_?$/i);
    if (m1) { footerRefs = m1[1].replace(/_$/, "").trim(); bodyLines.splice(i); break; }
    break;
  }

  const blocks = renderBlocks(bodyLines);

  const docCode = template?.id
    ? `SOP-${(template.packKey ?? "decon").slice(0, 3).toUpperCase()}-${String(template.id).slice(0, 4).toUpperCase()}`
    : `SOP-DRAFT`;
  const version = template?.version ? `v${template.version}` : "v—";
  const status = (template?.status ?? "draft").toString().toUpperCase();
  const eyebrow = template?.eyebrow ?? "Decontamination & IPC";
  const brand = template?.brand ?? "Pil Dental Practice";

  return (
    <div className={styles.previewWrap}>
      <div className={styles.previewPaper}>
        <div className={styles.previewHeaderBand}>
          <div className={styles.previewHeaderTop}>
            <span className={styles.previewBrand}>{brand}</span>
            <span className={styles.previewKicker}>{eyebrow}</span>
          </div>
          <div className={styles.previewDocCode}>{docCode} · {version} · {status}</div>
          <h1 className={styles.previewTitle}>{h1Title}</h1>
        </div>

        {meta.length > 0 && (
          <div className={styles.previewMetaGrid}>
            {meta.map((m, i) => (
              <div key={i} className={styles.previewMetaItem}>
                <div className={styles.previewMetaLabel}>{m.label}</div>
                <div className={styles.previewMetaValue}>{m.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.previewBody}>{blocks}</div>

        {footerRefs && (
          <div className={styles.previewFooter}>
            <div className={styles.previewFooterLabel}>Reference standards</div>
            <div className={styles.previewFooterText}>{footerRefs}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function renderBlocks(lines) {
  const blocks = [];
  let para = [];
  let listType = null;
  let listItems = [];
  let sectionCount = 0;

  const flushPara = () => {
    if (para.length === 0) return;
    blocks.push(<p key={`p${blocks.length}`} className={styles.previewP}>{inline(para.join(" "))}</p>);
    para = [];
  };
  const flushList = () => {
    if (listItems.length === 0) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    blocks.push(
      <Tag key={`l${blocks.length}`} className={styles.previewList}>
        {listItems.map((it, i) => <li key={i}>{inline(it)}</li>)}
      </Tag>
    );
    listItems = [];
    listType = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line === "") { flushPara(); flushList(); continue; }
    if (/^---+$/.test(line)) {
      flushPara(); flushList();
      blocks.push(<hr key={`hr${blocks.length}`} className={styles.previewHr} />);
      continue;
    }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushPara(); flushList();
      const lvl = h[1].length;
      let text = h[2];
      if (lvl === 2) {
        text = text.replace(/^\d+\s*[.——-]\s*/, "");
        sectionCount += 1;
        blocks.push(
          <div key={`h${blocks.length}`} className={styles.previewSectionHead}>
            <span className={styles.previewSectionNum}>{String(sectionCount).padStart(2, "0")}</span>
            <h2 className={styles.previewH2}>{inline(text)}</h2>
          </div>
        );
      } else if (lvl === 3) {
        blocks.push(<h3 key={`h${blocks.length}`} className={styles.previewH3}>{inline(text)}</h3>);
      } else {
        blocks.push(<h2 key={`h${blocks.length}`} className={styles.previewH2}>{inline(text)}</h2>);
      }
      continue;
    }
    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ul) {
      flushPara();
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(ul[1]);
      continue;
    }
    if (ol) {
      flushPara();
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(ol[1]);
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara(); flushList();
      blocks.push(
        <div key={`q${blocks.length}`} className={styles.previewCallout}>
          <div className={styles.previewCalloutLabel}>Key point</div>
          <div className={styles.previewCalloutText}>{inline(line.slice(2))}</div>
        </div>
      );
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}

function inline(text) {
  const out = [];
  let rest = text;
  let key = 0;
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\b_[^_]+_\b)|(\*[^*]+\*)/;
  while (rest.length > 0) {
    const m = rest.match(pattern);
    if (!m) { out.push(rest); break; }
    if (m.index > 0) out.push(rest.slice(0, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      out.push(<code key={key++} className={styles.previewCode}>{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("**")) {
      out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("_") || tok.startsWith("*")) {
      out.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    }
    rest = rest.slice(m.index + tok.length);
  }
  return out;
}
