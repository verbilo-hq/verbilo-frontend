import { useEffect, useRef, useState } from "react";
import { updateTenantBranding } from "../../services/tenants.service";
import { paletteFromLogo } from "../../lib/paletteFromLogo";
import styles from "./AdminCreateTenantPage.module.css";

// Default Verbilo brand colours — used as the live-preview baseline when
// the tenant hasn't overridden anything. Keep in sync with the
// `:root` defaults shipped in global CSS.
const VERBILO_DEFAULT_PRIMARY   = "#006974";
const VERBILO_DEFAULT_SECONDARY = "#1f2937";
const VERBILO_DEFAULT_ACCENT    = "#ebfcff";

const HEX_COLOR_RE = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function normaliseHex(value) {
  if (value == null) return "";
  const trimmed = String(value).trim();
  return trimmed;
}

// VER-59: Branding section on the AdminTenantSettings page. Logo URL +
// three hex colours (primary / secondary / accent). On save calls the
// new PATCH /admin/tenants/:id/branding endpoint; the backend will 403
// if the operator's role lacks `tenant.update_branding`, and 400 if no
// real change was sent. The form sends only changed fields.
export const AdminTenantBrandingSection = ({ tenant, onSaved }) => {
  const [logoUrl, setLogoUrl]                 = useState(tenant?.logoUrl ?? "");
  const [primaryColor, setPrimaryColor]       = useState(tenant?.primaryColor ?? "");
  const [secondaryColor, setSecondaryColor]   = useState(tenant?.secondaryColor ?? "");
  const [accentColor, setAccentColor]         = useState(tenant?.accentColor ?? "");
  const [submitting, setSubmitting]           = useState(false);
  const [error, setError]                     = useState(null);
  const [savedAt, setSavedAt]                 = useState(null);

  // VER-64: palette suggestion derived from the uploaded logo. Null
  // when there's no usable suggestion (no URL, still loading, or
  // extraction failed). `suggestionError` is set to a reason string
  // ('cors' | 'load' | etc.) when extraction failed deterministically
  // so we can surface a friendly hint without spamming console errors.
  const [suggestion, setSuggestion] = useState(null);
  const [suggestionStatus, setSuggestionStatus] = useState("idle"); // idle | loading | ready | error
  const [suggestionError, setSuggestionError] = useState(null);
  const suggestionAbortRef = useRef(null);

  // Keep local state in sync if the tenant prop updates (e.g. parent
  // re-fetched the row).
  useEffect(() => {
    setLogoUrl(tenant?.logoUrl ?? "");
    setPrimaryColor(tenant?.primaryColor ?? "");
    setSecondaryColor(tenant?.secondaryColor ?? "");
    setAccentColor(tenant?.accentColor ?? "");
  }, [tenant?.id, tenant?.logoUrl, tenant?.primaryColor, tenant?.secondaryColor, tenant?.accentColor]);

  // VER-64: debounced palette extraction on logo URL change. Skips
  // empty / obviously-invalid URLs (don't fire on every keystroke
  // before the operator has finished typing). Cancels any in-flight
  // extraction when the input changes again — paletteFromLogo
  // respects AbortSignal.
  useEffect(() => {
    const trimmed = logoUrl?.trim?.() ?? "";
    if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
      setSuggestion(null);
      setSuggestionStatus("idle");
      setSuggestionError(null);
      return;
    }
    const controller = new AbortController();
    suggestionAbortRef.current?.abort();
    suggestionAbortRef.current = controller;
    setSuggestionStatus("loading");
    setSuggestionError(null);
    const timer = setTimeout(async () => {
      const result = await paletteFromLogo(trimmed, { signal: controller.signal });
      if (controller.signal.aborted) return;
      if (result.ok) {
        setSuggestion(result);
        setSuggestionStatus("ready");
        setSuggestionError(null);
      } else if (result.reason !== "aborted") {
        setSuggestion(null);
        setSuggestionStatus("error");
        setSuggestionError(result.reason);
      }
    }, 600);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [logoUrl]);

  // Apply one suggested swatch into a single colour input. The
  // existing live-preview re-renders without further wiring.
  const applySuggestionSlot = (slot) => {
    if (!suggestion) return;
    if (slot === "primary")   setPrimaryColor(suggestion.primary);
    if (slot === "secondary") setSecondaryColor(suggestion.secondary);
    if (slot === "accent")    setAccentColor(suggestion.accent);
  };

  const applySuggestionAll = () => {
    if (!suggestion) return;
    setPrimaryColor(suggestion.primary);
    setSecondaryColor(suggestion.secondary);
    setAccentColor(suggestion.accent);
  };

  // Detect what's actually changed vs the loaded tenant — backend
  // rejects no-op requests with 400, and we want to surface clear
  // "nothing to save" UX rather than relying on that error.
  const diff = {
    logoUrl:        normaliseHexOrUrl(logoUrl)        !== (tenant?.logoUrl        ?? "") ? toPayload(logoUrl)        : undefined,
    primaryColor:   normaliseHex(primaryColor)        !== (tenant?.primaryColor   ?? "") ? toPayload(primaryColor)   : undefined,
    secondaryColor: normaliseHex(secondaryColor)      !== (tenant?.secondaryColor ?? "") ? toPayload(secondaryColor) : undefined,
    accentColor:    normaliseHex(accentColor)         !== (tenant?.accentColor    ?? "") ? toPayload(accentColor)    : undefined,
  };

  const hasChange = Object.values(diff).some((v) => v !== undefined);

  // Inline validation — only flag colours that are non-empty and don't
  // match the hex pattern. Empty is fine (means "leave at default").
  const colorFieldError = (value) =>
    value && !HEX_COLOR_RE.test(value.trim()) ? "Must be a hex colour like #006974" : null;

  const errors = {
    primaryColor:   colorFieldError(primaryColor),
    secondaryColor: colorFieldError(secondaryColor),
    accentColor:    colorFieldError(accentColor),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!hasChange || hasErrors || submitting) return;
    setSubmitting(true);
    setError(null);
    setSavedAt(null);
    try {
      // Strip `undefined` keys before sending.
      const payload = Object.fromEntries(
        Object.entries(diff).filter(([, v]) => v !== undefined),
      );
      await updateTenantBranding(tenant.id, payload);
      setSavedAt(new Date());
      onSaved?.();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const preview = {
    primary:   primaryColor   || VERBILO_DEFAULT_PRIMARY,
    secondary: secondaryColor || VERBILO_DEFAULT_SECONDARY,
    accent:    accentColor    || VERBILO_DEFAULT_ACCENT,
  };

  return (
    <section className={styles.section}>
      <p className={styles.sectionTitle}>Branding</p>
      <p className={styles.sectionBody}>
        Logo + colour overrides for this tenant. Leave empty to inherit Verbilo defaults. Hex
        colours accept <code>#006974</code> or <code>#006974FF</code>; #-prefixed.
      </p>

      <form className={styles.form} onSubmit={handleSave} style={{ marginTop: 12, gap: 16 }}>
        <div className={styles.field}>
          <label className={styles.label}>Logo URL</label>
          <input
            className={styles.input}
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://cdn.example.com/logo.svg"
            type="url"
            maxLength={2048}
          />
          <SuggestedPalette
            status={suggestionStatus}
            suggestion={suggestion}
            errorReason={suggestionError}
            onApplyAll={applySuggestionAll}
            onApplySlot={applySuggestionSlot}
          />
        </div>

        <ColorField
          label="Primary"
          value={primaryColor}
          onChange={setPrimaryColor}
          fallback={VERBILO_DEFAULT_PRIMARY}
          error={errors.primaryColor}
        />
        <ColorField
          label="Secondary"
          value={secondaryColor}
          onChange={setSecondaryColor}
          fallback={VERBILO_DEFAULT_SECONDARY}
          error={errors.secondaryColor}
        />
        <ColorField
          label="Accent"
          value={accentColor}
          onChange={setAccentColor}
          fallback={VERBILO_DEFAULT_ACCENT}
          error={errors.accentColor}
        />

        <BrandPreview preview={preview} logoUrl={logoUrl} tenantName={tenant?.name} />

        {error && (
          <p className={styles.submitError}>
            {error.code === "FORBIDDEN"
              ? "You don't have permission to update branding."
              : error.status === 400
              ? "Nothing to save — change a field first."
              : `Couldn't save branding (${error.status ?? error.code ?? "error"}).`}
          </p>
        )}
        {savedAt && !error && (
          <p className={styles.helperMuted ?? styles.sectionBody}>
            Saved at {savedAt.toLocaleTimeString()}.
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={!hasChange || hasErrors || submitting}
          >
            {submitting ? "Saving…" : "Save branding"}
          </button>
        </div>
      </form>
    </section>
  );
};

// Inline color picker — text input for the hex (in case the operator
// wants alpha) plus a native <input type="color"> swatch for the
// no-alpha case. The two are kept in lockstep.
function ColorField({ label, value, onChange, fallback, error }) {
  const swatchValue = sanitiseForNativePicker(value || fallback);
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label} colour</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          value={swatchValue}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-label={`${label} colour swatch`}
          style={{ width: 44, height: 36, padding: 0, border: "1px solid var(--outline, rgba(0,0,0,0.2))", borderRadius: 6, cursor: "pointer" }}
        />
        <input
          className={styles.input}
          style={{ flex: 1, fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fallback}
          maxLength={9}
        />
      </div>
      {error && <p className={`${styles.helper} ${styles.error}`}>{error}</p>}
    </div>
  );
}

function BrandPreview({ preview, logoUrl, tenantName }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>Preview</label>
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          border: "1px solid var(--outline, rgba(0,0,0,0.12))",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: preview.accent,
          color: preview.secondary,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: preview.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: 18,
            overflow: "hidden",
          }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt="" style={{ maxWidth: "100%", maxHeight: "100%" }} />
          ) : (
            (tenantName?.[0] ?? "V").toUpperCase()
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong style={{ fontSize: 16 }}>{tenantName ?? "Tenant"}</strong>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Brand preview</span>
        </div>
      </div>
    </div>
  );
}

// HTML <input type="color"> only accepts 6-digit hex; strip alpha + the
// `#` for the swatch picker. If the value is unparseable, fall back to
// the supplied default so the picker has *something* to display.
function sanitiseForNativePicker(value) {
  if (!value) return "#000000";
  const v = value.trim();
  const m = /^#([0-9a-fA-F]{6})/.exec(v);
  if (m) return `#${m[1].toUpperCase()}`;
  const short = /^#([0-9a-fA-F]{3})$/.exec(v);
  if (short) {
    const [, abc] = short;
    return `#${abc[0]}${abc[0]}${abc[1]}${abc[1]}${abc[2]}${abc[2]}`.toUpperCase();
  }
  return "#000000";
}

// Convert a form value into the API payload:
//   ""    → null  (clear the field)
//   value → value (trimmed)
function toPayload(value) {
  const v = (value ?? "").trim();
  return v === "" ? null : v;
}

// Logo URLs are URLs, not hex — `normaliseHex` would strip nothing for them.
// Kept as a separate helper for symmetry / clarity at the call site.
function normaliseHexOrUrl(value) {
  return (value ?? "").trim();
}

// VER-64: row of three swatches + a button rendered under the Logo
// URL input once an extraction has produced a usable palette. Each
// swatch is independently click-applyable; the right-side button
// applies all three at once.
function SuggestedPalette({ status, suggestion, errorReason, onApplyAll, onApplySlot }) {
  if (status === "idle") return null;

  if (status === "loading") {
    return (
      <p className={styles.helperMuted} style={{ marginTop: 8 }}>
        Analysing logo…
      </p>
    );
  }

  if (status === "error") {
    const message =
      errorReason === "cors"
        ? "Couldn't analyse this logo — the image isn't served with CORS enabled. Pick colours manually below or host the logo on a CORS-enabled URL."
        : errorReason === "load"
        ? "Couldn't load that URL — double-check it points at a public image (PNG, JPG, or SVG)."
        : errorReason === "monochrome"
        ? "Logo only contains one tone — pick colours manually below."
        : "Couldn't analyse this logo — pick colours manually below.";
    return (
      <p className={styles.helperMuted} style={{ marginTop: 8 }}>{message}</p>
    );
  }

  if (!suggestion) return null;

  const slots = [
    { key: "primary",   label: "Primary",   hex: suggestion.primary },
    { key: "secondary", label: "Secondary", hex: suggestion.secondary },
    { key: "accent",    label: "Accent",    hex: suggestion.accent },
  ];

  return (
    <div style={{ marginTop: 10 }}>
      <p className={styles.helperMuted} style={{ marginBottom: 6 }}>
        Suggested palette from logo — click a swatch to apply just that one, or use the button.
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {slots.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onApplySlot(s.key)}
            title={`Apply ${s.label}: ${s.hex}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 8px",
              border: "1px solid var(--outline, rgba(0,0,0,0.16))",
              borderRadius: 6,
              background: "var(--surface, white)",
              cursor: "pointer",
              font: "inherit",
              fontSize: 12,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: s.hex,
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            />
            <span style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}>
              {s.hex}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={onApplyAll}
          className={styles.btnSecondary}
          style={{ marginLeft: "auto" }}
        >
          Use suggested palette
        </button>
      </div>
      {suggestion.primaryAdjusted && suggestion.primaryOriginal && (
        <p className={styles.helperMuted} style={{ marginTop: 6, fontSize: 12 }}>
          Primary adjusted slightly for legibility against white (original was{" "}
          <code>{suggestion.primaryOriginal}</code>).
        </p>
      )}
    </div>
  );
}
