import { useState, useRef } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { SearchBar } from "../components/ui/SearchBar";
import { TopBar } from "../components/layout/TopBar";
import { useTenant } from "../auth/TenantContext";
import styles from "./MarketingPage.module.css";

/* ── Data ──────────────────────────────────────────────────────────────────── */

const logoAssets = [
  { label: "Primary Logo",       formats: ["SVG", "PNG", "PDF"], dims: "2400 × 800px", primary: false, display: "DENTAL\nGROUP",     big: false },
  { label: "Icon Mark",          formats: ["SVG", "PNG"],        dims: "512 × 512px",  primary: false, display: "DG",                big: true  },
  { label: "White Variant",      formats: ["SVG", "PNG"],        dims: "2400 × 800px", primary: true,  display: "DENTAL\nGROUP",     big: false },
  { label: "Dark Variant",       formats: ["SVG", "PNG"],        dims: "2400 × 800px", dark: true,     display: "DENTAL\nGROUP",     big: false },
  { label: "Stacked Layout",     formats: ["SVG", "PNG", "PDF"], dims: "800 × 800px",  primary: false, display: "DG\nDENTAL\nGROUP", big: false },
  { label: "Favicon / App Icon", formats: ["ICO", "PNG"],        dims: "32 × 32px",    primary: false, display: "DG",                big: true  },
  { label: "Monochrome",         formats: ["SVG", "PNG"],        dims: "2400 × 800px", mono: true,     display: "DENTAL\nGROUP",     big: false },
  { label: "Social Avatar",      formats: ["PNG"],               dims: "800 × 800px",  primary: false, display: "DG",                big: true  },
  { label: "Print-Ready PDF",    formats: ["PDF"],               dims: "2400 × 800px", primary: false, display: "DENTAL\nGROUP",     big: false },
];

const seedTemplates = [
  { icon: "file",      label: "Letterhead",         desc: "A4 branded letterhead for clinical and admin correspondence.", formats: ["DOCX", "PDF"] },
  { icon: "mail",      label: "Email Signature",     desc: "Standard email signature block with logo and contact details.",  formats: ["HTML", "PNG"] },
  { icon: "layout",    label: "Presentation Deck",   desc: "PowerPoint template for internal and external presentations.",    formats: ["PPTX"]       },
  { icon: "clipboard", label: "Patient Information", desc: "Branded patient leaflet template for clinical use.",              formats: ["DOCX", "PDF"] },
  { icon: "bookmark",  label: "Compliment Slip",     desc: "Printed compliment slip — DL format, single-sided.",             formats: ["PDF"]        },
  { icon: "printer",   label: "Appointment Card",    desc: "Branded appointment reminder card, 85 × 55mm.",                  formats: ["PDF", "PNG"] },
];

const seedPalette = [
  { name: "Primary Teal",   hex: "#006974", textDark: false },
  { name: "Teal Light",     hex: "#4DB6AC", textDark: false },
  { name: "On-Primary",     hex: "#FFFFFF", textDark: true  },
  { name: "Surface Low",    hex: "#F0F4F4", textDark: true  },
  { name: "Surface Lowest", hex: "#E4ECEC", textDark: true  },
  { name: "On-Surface",     hex: "#1A2B2B", textDark: false },
  { name: "Error / Alert",  hex: "#E53935", textDark: false },
  { name: "Success",        hex: "#2E7D32", textDark: false },
];

const typography = [
  { role: "Display / Headings", family: "Poppins", weight: "700–800", sample: "Aa Bb Cc 123",      sizes: "16px – 48px" },
  { role: "Body / UI",          family: "Inter",   weight: "400–600", sample: "The quick brown fox", sizes: "11px – 16px" },
];

const rules = [
  { icon: "palette", label: "Clear Space",  desc: "Maintain a minimum margin of the 'D' cap-height around all logo marks." },
  { icon: "shield",  label: "Don'ts",       desc: "Never stretch, rotate, recolour, or place the logo on a busy background." },
  { icon: "target",  label: "Minimum Size", desc: "Logo must never appear smaller than 24px tall in any digital context." },
];

/* ── Colour conversion helpers ─────────────────────────────────────────────── */
const hexToRgb = (hex) => {
  const n = hex.replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
};

const hexToHsl = (hex) => {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

/* ── Colour swatch ─────────────────────────────────────────────────────────── */
const Swatch = ({ name, hex, textDark }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard.writeText(hex).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  return (
    <button className={styles.swatch} style={{ background: hex, color: textDark ? "#1A2B2B" : "#fff" }} onClick={copy} title={`Copy ${hex}`}>
      <span className={styles.swatchName}>{copied ? "Copied!" : name}</span>
      <span className={styles.swatchHex}>{hex}</span>
    </button>
  );
};

/* ── Colour edit modal ─────────────────────────────────────────────────────── */
const ColourEditModal = ({ palette, onSave, onClose }) => {
  const [draft, setDraft] = useState(palette.map((c) => ({ ...c })));

  const update = (i, field, value) =>
    setDraft((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));

  const syncHex = (i, hex) => {
    const clean = hex.startsWith("#") ? hex : `#${hex}`;
    update(i, "hex", clean.toUpperCase());
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.editModalHeader}>
          <div>
            <h3 className={styles.editModalTitle}>Edit Colour Palette</h3>
            <p className={styles.editModalSub}>Adjust names and hex values. Changes apply immediately on save.</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}><I name="xcircle" size={20} /></button>
        </div>
        <div className={styles.editModalBody}>
          {draft.map((c, i) => {
            const rgb = hexToRgb(c.hex);
            const hsl = hexToHsl(c.hex);
            return (
              <div key={i} className={styles.editRow}>
                <input
                  type="color"
                  className={styles.colorPicker}
                  value={c.hex.length === 7 ? c.hex : "#000000"}
                  onChange={(e) => syncHex(i, e.target.value)}
                />
                <div className={styles.editFields}>
                  <input
                    className={styles.editInput}
                    value={c.name}
                    onChange={(e) => update(i, "name", e.target.value)}
                    placeholder="Colour name"
                  />
                  <input
                    className={`${styles.editInput} ${styles.editInputMono}`}
                    value={c.hex}
                    onChange={(e) => syncHex(i, e.target.value)}
                    placeholder="#000000"
                    maxLength={7}
                  />
                </div>
                <div className={styles.editCodes}>
                  <span className={styles.editCode}>RGB {rgb.r}, {rgb.g}, {rgb.b}</span>
                  <span className={styles.editCode}>HSL {hsl.h}°, {hsl.s}%, {hsl.l}%</span>
                </div>
                <label className={styles.editDarkToggle} title="Text on this colour is dark">
                  <input type="checkbox" checked={c.textDark} onChange={(e) => update(i, "textDark", e.target.checked)} />
                  <span>Dark text</span>
                </label>
              </div>
            );
          })}
        </div>
        <div className={styles.editModalFooter}>
          <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
          <BtnPrimary onClick={() => { onSave(draft); onClose(); }}>
            <I name="check" size={14} /> Save Palette
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

/* ── Delete confirmation modal ─────────────────────────────────────────────── */
const DeleteConfirmModal = ({ template, onConfirm, onClose }) => (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.confirmIconWrap}>
        <I name="trash" size={24} color="var(--error, #e53935)" />
      </div>
      <h3 className={styles.confirmTitle}>Delete Template?</h3>
      <p className={styles.confirmBody}>
        Are you sure you want to delete <strong>{template}</strong>? This cannot be undone and all
        copies of this file will be permanently removed from the hub.
      </p>
      <div className={styles.confirmActions}>
        <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
        <button className={styles.deleteBtnConfirm} onClick={onConfirm}>
          <I name="trash" size={14} /> Delete Template
        </button>
      </div>
    </div>
  </div>
);

/* ── Brand book print ──────────────────────────────────────────────────────── */
const openBrandBook = (palette, tenantName = "Verbilo") => {
  const win = window.open("", "_blank");
  if (!win) return;

  const colourRows = palette.map((c) => {
    const rgb = hexToRgb(c.hex);
    const hsl = hexToHsl(c.hex);
    return `
      <tr>
        <td><div style="width:48px;height:48px;border-radius:8px;background:${c.hex};border:1px solid rgba(0,0,0,0.08)"></div></td>
        <td><strong>${c.name}</strong></td>
        <td class="mono">${c.hex}</td>
        <td class="mono">rgb(${rgb.r}, ${rgb.g}, ${rgb.b})</td>
        <td class="mono">hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)</td>
      </tr>`;
  }).join("");

  const typoRows = typography.map((t) => `
    <tr>
      <td><span style="font-family:'${t.family}',sans-serif;font-size:22px;font-weight:700;color:#006974">${t.sample}</span></td>
      <td><strong>${t.family}</strong></td>
      <td>${t.role}</td>
      <td>${t.weight}</td>
      <td>${t.sizes}</td>
    </tr>`).join("");

  win.document.write(`<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <title>${tenantName} — Brand Book</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
      @page { margin: 16mm 20mm; }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; color: #1A2B2B; background: #fff; font-size: 13px; line-height: 1.6; padding: 32px 48px; }
      h1, h2, h3 { font-family: 'Poppins', sans-serif; }
      .cover { display: flex; align-items: center; justify-content: space-between; padding: 36px 44px; background: #006974; border-radius: 12px; margin-bottom: 40px; color: #fff; }
      .cover-title { font-size: 32px; font-weight: 800; letter-spacing: -0.5px; }
      .cover-sub { font-size: 14px; opacity: 0.75; margin-top: 4px; }
      .cover-logo { font-family: 'Poppins', sans-serif; font-size: 36px; font-weight: 800; color: rgba(255,255,255,0.9); letter-spacing: 0.05em; text-align: right; white-space: pre-line; line-height: 1.2; }
      section { margin-bottom: 40px; break-inside: avoid; page-break-inside: avoid; }
      h2 { font-size: 20px; font-weight: 800; color: #006974; margin-bottom: 4px; padding-bottom: 10px; border-bottom: 2px solid #E4ECEC; }
      .section-sub { font-size: 12px; color: #586161; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #586161; padding: 0 12px 8px 0; border-bottom: 1px solid #E4ECEC; }
      td { padding: 10px 12px 10px 0; border-bottom: 1px solid #F0F4F4; vertical-align: middle; }
      .mono { font-family: 'Courier New', monospace; font-size: 12px; }
      .rule-row { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F0F4F4; align-items: flex-start; }
      .rule-icon { width: 32px; height: 32px; border-radius: 50%; background: #F0F4F4; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; }
      .rule-label { font-weight: 700; font-size: 13px; margin-bottom: 2px; }
      .rule-desc { font-size: 12px; color: #586161; }
      .footer { margin-top: 48px; text-align: center; font-size: 11px; color: #9aabab; padding-top: 16px; border-top: 1px solid #E4ECEC; }
      @media print {
        body { padding: 0; }
        .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        td, th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        div[style*="background"] { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>
  </head><body>
    <div class="cover">
      <div>
        <div class="cover-title">Brand Book</div>
        <div class="cover-sub">${tenantName} · Colour, Typography &amp; Guidelines</div>
        <div style="margin-top:16px;font-size:11px;opacity:0.6">Generated ${new Date().toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}</div>
      </div>
      <div class="cover-logo">${tenantName.toUpperCase().replace(/\s+/g, "\n")}</div>
    </div>

    <section>
      <h2>Colour Palette</h2>
      <p class="section-sub">All colour values for digital and print use.</p>
      <table>
        <thead><tr>
          <th style="width:60px">Swatch</th>
          <th>Name</th>
          <th>HEX</th>
          <th>RGB</th>
          <th>HSL</th>
        </tr></thead>
        <tbody>${colourRows}</tbody>
      </table>
    </section>

    <section>
      <h2>Typography</h2>
      <p class="section-sub">Approved typefaces for all ${tenantName} communications.</p>
      <table>
        <thead><tr>
          <th>Sample</th>
          <th>Typeface</th>
          <th>Role</th>
          <th>Weights</th>
          <th>Sizes</th>
        </tr></thead>
        <tbody>${typoRows}</tbody>
      </table>
    </section>

    <section>
      <h2>Brand Rules</h2>
      <p class="section-sub">Guidelines for correct logo usage.</p>
      ${rules.map((r) => `
        <div class="rule-row">
          <div class="rule-icon">·</div>
          <div>
            <div class="rule-label">${r.label}</div>
            <div class="rule-desc">${r.desc}</div>
          </div>
        </div>`).join("")}
    </section>

    <div class="footer">© ${new Date().getFullYear()} ${tenantName} · Confidential — Internal Use Only</div>
    <script>window.onload = () => { window.print(); }</script>
  </body></html>`);
  win.document.close();
};

/* ── Page ──────────────────────────────────────────────────────────────────── */
export const MarketingPage = ({ currentUser }) => {
  const { tenant } = useTenant();
  const tenantName = tenant?.name ?? "Verbilo";
  const logoUploadRef     = useRef();
  const templateUploadRef = useRef();
  const [templateList, setTemplateList]   = useState(seedTemplates);
  const [palette, setPalette]             = useState(seedPalette);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [editingPalette, setEditingPalette] = useState(false);

  const triggerLogoUpload     = () => logoUploadRef.current.click();
  const triggerTemplateUpload = () => templateUploadRef.current.click();

  const handleDeleteConfirm = () => {
    setTemplateList((prev) => prev.filter((t) => t.label !== pendingDelete));
    setPendingDelete(null);
  };

  const canDelete = currentUser?.role === "manager";

  return (
  <>
  <div>
    <SearchBar placeholder="Search brand assets, templates, or colour codes..." />
    <TopBar title="Brand Hub" subtitle={`Official ${tenantName} brand assets, templates, and guidelines.`} />

    {/* Hidden file inputs */}
    <input ref={logoUploadRef}     type="file" accept=".svg,.png,.pdf,.ai,.eps" style={{ display: "none" }} />
    <input ref={templateUploadRef} type="file" accept=".pdf,.docx,.pptx,.html,.png" style={{ display: "none" }} />

    {/* Logo assets */}
    <Card hover={false} className={styles.logosCard}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.heading}>Logo Assets</h3>
          <p className={styles.helpText}>Download official {tenantName} logos in all formats.</p>
        </div>
        <div className={styles.headerBtns}>
          <BtnSecondary style={{ padding: "11px 18px", fontSize: 12 }} onClick={triggerLogoUpload}>
            <I name="upload" size={14} /> Upload Asset
          </BtnSecondary>
          <BtnPrimary style={{ padding: "11px 20px", fontSize: 12 }}>
            <I name="download" size={14} /> Download All (.ZIP)
          </BtnPrimary>
        </div>
      </div>
      <div className={styles.assetGrid}>
        {logoAssets.map((a) => {
          const tileClass = [
            styles.assetTile,
            a.primary && styles.assetTilePrimary,
            a.dark    && styles.assetTileDark,
            a.mono    && styles.assetTileMono,
          ].filter(Boolean).join(" ");
          const pillClass = (a.primary || a.dark) ? `${styles.assetFormatPill} ${styles.assetFormatPillWhite}` : styles.assetFormatPill;
          const btnClass  = (a.primary || a.dark) ? `${styles.assetDownloadBtn} ${styles.assetDownloadBtnWhite}` : styles.assetDownloadBtn;
          return (
            <div key={a.label} className={tileClass}>
              <span className={a.big ? `${styles.assetWordmark} ${styles.assetWordmarkLg}` : styles.assetWordmark}>
                {a.display}
              </span>
              <span className={styles.assetCaption}>{a.label}</span>
              <span className={styles.assetDims}>{a.dims}</span>
              <div className={styles.assetFormats}>
                {a.formats.map((f) => <span key={f} className={pillClass}>{f}</span>)}
              </div>
              <button className={btnClass}>
                <I name="download" size={12} /> Download
              </button>
            </div>
          );
        })}
      </div>
    </Card>

    {/* Templates + Brand guide */}
    <div className={styles.midRow}>
      {/* Downloadable templates */}
      <Card hover={false} style={{ padding: 28 }}>
        <div className={styles.cardHeader} style={{ marginBottom: 20 }}>
          <div>
            <h3 className={styles.heading}>Templates</h3>
            <p className={styles.helpText}>Branded documents ready to use.</p>
          </div>
          <BtnSecondary style={{ padding: "9px 16px", fontSize: 12 }} onClick={triggerTemplateUpload}>
            <I name="upload" size={13} /> Upload Template
          </BtnSecondary>
        </div>
        <div className={styles.templateList}>
          {templateList.map((t) => (
            <div key={t.label} className={styles.templateRow}>
              <div className={styles.templateIcon}>
                <I name={t.icon} size={16} color="var(--primary)" />
              </div>
              <div className={styles.templateMeta}>
                <span className={styles.templateLabel}>{t.label}</span>
                <span className={styles.templateDesc}>{t.desc}</span>
                <div className={styles.templateFormats}>
                  {t.formats.map((f) => <span key={f} className={styles.assetFormatPill}>{f}</span>)}
                </div>
              </div>
              <div className={styles.templateActions}>
                {canDelete && (
                  <button className={styles.deleteBtn} onClick={() => setPendingDelete(t.label)} title="Delete template">
                    <I name="trash" size={14} />
                  </button>
                )}
                <BtnSecondary style={{ padding: "7px 14px", fontSize: 11 }}>
                  <I name="download" size={12} /> Download
                </BtnSecondary>
              </div>
            </div>
          ))}
          {templateList.length === 0 && (
            <div className={styles.emptyTemplates}>
              <I name="file" size={28} color="var(--on-surface-variant)" />
              <p>No templates yet. Upload one using the button above.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Brand guide */}
      <Card hover={false} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Colour palette */}
        <div>
          <div className={styles.standardsTitleRow}>
            <h3 className={styles.standardsTitle}>Colour Palette</h3>
            <button className={styles.editIconBtn} onClick={() => setEditingPalette(true)} title="Edit colour palette">
              <I name="edit" size={13} />
            </button>
          </div>
          <div className={styles.swatchGrid}>
            {palette.map((c) => <Swatch key={c.hex + c.name} {...c} />)}
          </div>
          <p className={styles.swatchHint}>Click any swatch to copy the hex value.</p>
        </div>

        {/* Typography */}
        <div>
          <h3 className={styles.standardsTitle}>Typography</h3>
          {typography.map((t) => (
            <div key={t.family} className={styles.typographyRow}>
              <div className={styles.typographySample} style={{ fontFamily: t.family }}>{t.sample}</div>
              <div className={styles.typographyMeta}>
                <span className={styles.typographyFamily}>{t.family}</span>
                <span className={styles.typographyRole}>{t.role} · {t.weight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Brand rules */}
        <div>
          <h3 className={styles.standardsTitle}>Brand Rules</h3>
          {rules.map((v) => (
            <div key={v.label} className={styles.standardItem}>
              <div className={styles.standardIcon}><I name={v.icon} size={16} /></div>
              <div>
                <div className={styles.standardLabel}>{v.label}</div>
                <div className={styles.standardDesc}>{v.desc}</div>
              </div>
            </div>
          ))}
          <button className={styles.brandBookBtn} onClick={() => openBrandBook(palette, tenantName)}>
            <I name="download" size={13} /> Download Brand Book PDF
          </button>
        </div>
      </Card>
    </div>
  </div>

  {editingPalette && (
    <ColourEditModal
      palette={palette}
      onSave={setPalette}
      onClose={() => setEditingPalette(false)}
    />
  )}

  {pendingDelete && (
    <DeleteConfirmModal
      template={pendingDelete}
      onConfirm={handleDeleteConfirm}
      onClose={() => setPendingDelete(null)}
    />
  )}
  </>
  );
};
