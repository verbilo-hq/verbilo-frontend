/**
 * PilBrandingAdmin — small admin modal for practice letterhead.
 *
 *   • Edit group default (siteId = null) — used by every site that doesn't
 *     override its own branding.
 *   • Edit per-site override — leave a field blank to inherit from the
 *     group default; the resolver merges them.
 *   • Upload a logo (PNG/JPG/SVG). Stored as a data URL — same client-only
 *     file persistence used elsewhere; re-wire to S3 before pushing to dev.
 *
 * The viewer re-renders live as the user edits, so the right-hand preview
 * is the most reliable indicator of "what the print job will look like".
 */
import { useEffect, useRef, useState } from "react";
import { I } from "../components/Icon";
import {
  getGroupBranding, getSiteBranding, setBranding, clearSiteBranding, effectiveBranding,
} from "../services/governance/practiceBranding.service";
import styles from "./ClinicalPage.module.css";

const BLANK = { practiceName: "", logoDataUrl: null, accentColor: "", address: "", phone: "" };

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.onerror = reject;
  r.readAsDataURL(file);
});

export const PilBrandingAdmin = ({ user, sites, onClose, onSaved }) => {
  const [target, setTarget] = useState("group"); // "group" | site.id
  const [draft, setDraft] = useState(BLANK);
  const fileRef = useRef(null);

  // Load whichever target is currently selected.
  useEffect(() => {
    if (!user) return;
    if (target === "group") {
      const row = getGroupBranding(user.tenantId);
      setDraft({ ...BLANK, ...(row ?? {}) });
    } else {
      const row = getSiteBranding(user.tenantId, target);
      setDraft({ ...BLANK, ...(row ?? {}) });
    }
  }, [user, target]);

  const inherit = target !== "group" ? effectiveBranding(user.tenantId, target) : null;

  const onLogoPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 250 * 1024) {
      alert("Logo must be under 250 KB. Try a smaller PNG or SVG.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setDraft((d) => ({ ...d, logoDataUrl: dataUrl }));
  };

  const onSave = () => {
    const siteId = target === "group" ? null : target;
    setBranding(user, siteId, draft);
    onSaved?.();
  };

  const onClearOverride = () => {
    if (target === "group") return;
    clearSiteBranding(user, target);
    onSaved?.();
    setTarget("group");
  };

  const preview = target === "group"
    ? { ...effectiveBranding(user.tenantId, null), ...draft }
    : { ...effectiveBranding(user.tenantId, target), ...Object.fromEntries(Object.entries(draft).filter(([, v]) => v !== "" && v !== null)) };

  return (
    <div className={styles.pilModalOverlay} onClick={onClose}>
      <div className={styles.pilBrandModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.pilActionBar}>
          <div className={styles.pilActionLeft}>
            <button className={styles.pilActionBtn} onClick={onClose} title="Close">
              <I name="xcircle" size={14} /> Close
            </button>
            <span className={styles.pilActionTitle}>Practice letterhead</span>
          </div>
        </div>

        <div className={styles.pilBrandBody}>
          <div className={styles.pilBrandForm}>
            <label className={styles.pilFieldLabel}>Editing</label>
            <select className={styles.pilFieldInput} value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="group">Group default (applies to every site)</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>Override for: {s.name}</option>
              ))}
            </select>
            {target !== "group" && (
              <div className={styles.pilFieldHint}>
                Leave any field blank to inherit from the group default.
              </div>
            )}

            <label className={styles.pilFieldLabel}>Practice name</label>
            <input
              className={styles.pilFieldInput}
              placeholder={inherit?.practiceName || "e.g. Dental Group Southall"}
              value={draft.practiceName ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, practiceName: e.target.value }))}
            />

            <label className={styles.pilFieldLabel}>Logo</label>
            <div className={styles.pilLogoRow}>
              {draft.logoDataUrl ? (
                <img src={draft.logoDataUrl} alt="" className={styles.pilLogoPreview} />
              ) : (
                <div className={styles.pilLogoPreviewEmpty}>No logo</div>
              )}
              <div className={styles.pilLogoActions}>
                <input type="file" accept="image/*" ref={fileRef} onChange={onLogoPick} style={{ display: "none" }} />
                <button className={styles.pilActionBtn} onClick={() => fileRef.current?.click()}>Upload</button>
                {draft.logoDataUrl && (
                  <button className={styles.pilActionBtn} onClick={() => setDraft((d) => ({ ...d, logoDataUrl: null }))}>Clear</button>
                )}
              </div>
            </div>
            <div className={styles.pilFieldHint}>PNG, JPG or SVG, under 250 KB. Letterhead height is around 30 px.</div>

            <label className={styles.pilFieldLabel}>Accent colour</label>
            <div className={styles.pilColourRow}>
              <input
                type="color"
                className={styles.pilColourInput}
                value={draft.accentColor || inherit?.accentColor || "#0d7280"}
                onChange={(e) => setDraft((d) => ({ ...d, accentColor: e.target.value }))}
              />
              <input
                className={styles.pilFieldInput}
                placeholder={inherit?.accentColor || "#0d7280"}
                value={draft.accentColor ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, accentColor: e.target.value }))}
              />
            </div>

            <label className={styles.pilFieldLabel}>Address (optional)</label>
            <input
              className={styles.pilFieldInput}
              placeholder={inherit?.address || "12 High Street, Southall UB1 3DA"}
              value={draft.address ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
            />

            <label className={styles.pilFieldLabel}>Phone (optional)</label>
            <input
              className={styles.pilFieldInput}
              placeholder={inherit?.phone || "01273 555 0100"}
              value={draft.phone ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
            />

            <div className={styles.pilFormActions}>
              {target !== "group" && (
                <button className={styles.pilActionBtn} onClick={onClearOverride}>Reset to group default</button>
              )}
              <span style={{ flex: 1 }} />
              <button className={styles.pilActionBtnPrimary} onClick={onSave}>Save</button>
            </div>
          </div>

          <div className={styles.pilBrandPreview}>
            <div className={styles.pilFieldLabel}>Preview</div>
            <div className={styles.pilBrandPreviewBox}>
              <div className={styles.pilHead}>
                <div className={styles.pilHeadLeft}>
                  {preview.logoDataUrl ? (
                    <img src={preview.logoDataUrl} alt="" className={styles.pilLogoImg} />
                  ) : (
                    <div className={styles.pilLogoBox} style={{ borderColor: preview.accentColor, color: preview.accentColor }}>
                      {(preview.practiceName || "PR").split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "PR"}
                    </div>
                  )}
                  <div className={styles.pilBrand} style={{ color: preview.accentColor }}>
                    {preview.practiceName || "Your Dental Practice"}
                  </div>
                </div>
                <div className={styles.pilHeadRight}>
                  <div className={styles.pilCategoryLabel} style={{ color: preview.accentColor }}>Preventive Care</div>
                  <div className={styles.pilRef}>Patient Information · PI-PRV-01</div>
                </div>
              </div>
              <div style={{ padding: "12px 0 4px 0", fontFamily: "Georgia, serif", fontSize: 22, color: "#14202c", fontWeight: 700 }}>
                Diet and Your Oral Health
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 12.5, color: "#3a4654", maxWidth: 360, lineHeight: 1.55 }}>
                What you eat and drink, and how often, has a direct effect on your teeth and gums…
              </div>
              {(preview.address || preview.phone) && (
                <div className={styles.pilFoot} style={{ marginTop: 32 }}>
                  <div>{preview.address}</div>
                  <div>{preview.phone}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
