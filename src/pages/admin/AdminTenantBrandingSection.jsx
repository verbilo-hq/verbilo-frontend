import { useEffect, useRef, useState } from "react";
import { updateTenantBranding, uploadTenantLogo } from "../../services/tenants.service";
import { paletteFromLogo } from "../../lib/paletteFromLogo";
import styles from "./AdminCreateTenantPage.module.css";

// VER-69: enforce the same limits the backend enforces, just earlier
// so the operator gets immediate feedback. Backend remains the source
// of truth (magic-byte validation + size cap + IAM scoping).
const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const LOGO_ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp";
const LOGO_ACCEPT_LABEL = "PNG, JPG, SVG, or WebP up to 2 MB";

// VER-71: prefix of the Verbilo-hosted logo CDN. We use this to detect
// whether an existing `tenant.logoUrl` came from our upload endpoint
// (and should render as a chip) versus a pasted external URL (which
// stays in the URL input). Mirrors `TENANT_LOGO_PUBLIC_BASE_URL` in
// `verbilo-backend/src/tenants/tenants.service.ts`.
const VERBILO_LOGO_CDN_PREFIX =
  "https://verbilo-tenant-logos.s3.eu-west-2.amazonaws.com/";
const isUploadedLogoUrl = (url) =>
  typeof url === "string" && url.startsWith(VERBILO_LOGO_CDN_PREFIX);

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

  // VER-69: logo file upload (S3-backed). Client-side validates size
  // + type before the request; backend re-validates via magic bytes.
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // VER-71: how the current logoUrl was provided — "url" (operator
  // pasted an external URL) or "upload" (operator uploaded a file to
  // our CDN). Drives the input UI: upload mode shows a thumbnail chip
  // instead of the raw S3 URL.
  const [logoSource, setLogoSource] = useState(
    isUploadedLogoUrl(tenant?.logoUrl) ? "upload" : "url",
  );

  const handleLogoFile = async (file) => {
    setUploadError(null);
    if (!file) return;
    if (file.size > LOGO_MAX_BYTES) {
      setUploadError(`File is too large (max ${Math.round(LOGO_MAX_BYTES / 1024 / 1024)} MB).`);
      return;
    }
    if (!LOGO_ACCEPT.split(",").includes(file.type) && !/svg/i.test(file.name)) {
      // SVGs sometimes arrive without a recognised MIME (older Safari);
      // fall back to extension sniff.
      setUploadError(`Unsupported format. Use ${LOGO_ACCEPT_LABEL}.`);
      return;
    }
    if (!tenant?.id) {
      setUploadError("Tenant not loaded yet — refresh and retry.");
      return;
    }
    setUploading(true);
    // VER-71: extract the palette from the local file blob in parallel
    // with the S3 upload (fire-and-forget — palette state updates when
    // done, independent of upload outcome). Avoids depending on the S3
    // URL being readable for analysis (CORS preflight, propagation, and
    // browser image-loader quirks against freshly-PUT objects all
    // caused intermittent "load" errors). The blob URL is same-origin
    // so node-vibrant can read canvas pixels without a tainted-canvas
    // check.
    const blobUrl = URL.createObjectURL(file);
    suggestionAbortRef.current?.abort();
    const controller = new AbortController();
    suggestionAbortRef.current = controller;
    setSuggestionStatus("loading");
    setSuggestionError(null);
    paletteFromLogo(blobUrl, { signal: controller.signal })
      .then((paletteResult) => {
        if (controller.signal.aborted) return;
        if (paletteResult.ok) {
          setSuggestion(paletteResult);
          setSuggestionStatus("ready");
          setSuggestionError(null);
        } else if (paletteResult.reason !== "aborted") {
          setSuggestion(null);
          setSuggestionStatus("error");
          setSuggestionError(paletteResult.reason);
        }
      })
      .finally(() => {
        URL.revokeObjectURL(blobUrl);
      });

    try {
      const result = await uploadTenantLogo(tenant.id, file);
      setLogoUrl(result.logoUrl);
      setLogoSource("upload");
      // Let the parent know the tenant row changed so the next
      // re-fetch picks up the new logoUrl (audit log entry will
      // also show up under the tenant).
      onSaved?.();
    } catch (err) {
      const message =
        err.code === "PAYLOAD_TOO_LARGE"
          ? `File is too large (max ${Math.round(LOGO_MAX_BYTES / 1024 / 1024)} MB).`
          : err.code === "UNSUPPORTED_MEDIA"
          ? `Unsupported format. Use ${LOGO_ACCEPT_LABEL}.`
          : err.code === "FORBIDDEN"
          ? "You don't have permission to update branding for this tenant."
          : err.code === "SERVICE_UNAVAILABLE"
          ? "Logo upload isn't configured in this environment. Paste a URL instead."
          : `Couldn't upload the logo (${err.status ?? err.code ?? "error"}).`;
      setUploadError(message);
    } finally {
      setUploading(false);
      // Clear the file input so picking the same file again still fires onChange.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Keep local state in sync if the tenant prop updates (e.g. parent
  // re-fetched the row).
  useEffect(() => {
    const url = tenant?.logoUrl ?? "";
    setLogoUrl(url);
    setLogoSource(isUploadedLogoUrl(url) ? "upload" : "url");
    setPrimaryColor(tenant?.primaryColor ?? "");
    setSecondaryColor(tenant?.secondaryColor ?? "");
    setAccentColor(tenant?.accentColor ?? "");
  }, [tenant?.id, tenant?.logoUrl, tenant?.primaryColor, tenant?.secondaryColor, tenant?.accentColor]);

  // VER-64: debounced palette extraction on logo URL change. Skips
  // empty / obviously-invalid URLs (don't fire on every keystroke
  // before the operator has finished typing). Cancels any in-flight
  // extraction when the input changes again — paletteFromLogo
  // respects AbortSignal.
  //
  // VER-71: in upload mode the palette is already extracted from the
  // local file blob during handleLogoFile, so skip the URL-based
  // round-trip (avoids re-running against the public S3 URL, where
  // node-vibrant occasionally trips on the freshly-PUT object).
  useEffect(() => {
    if (logoSource === "upload") return;

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
  }, [logoUrl, logoSource]);

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

  // VER-72: "Reset to defaults" — clears all four branding fields in
  // local state. Operator still hits Save Branding to persist, which
  // mirrors how every other field on this section works (no surprise
  // server-side writes). Disabled when everything is already blank.
  const isAlreadyBlank =
    !logoUrl && !primaryColor && !secondaryColor && !accentColor;

  const resetToDefaults = () => {
    setLogoUrl("");
    setLogoSource("url");
    setPrimaryColor("");
    setSecondaryColor("");
    setAccentColor("");
    setSuggestion(null);
    setSuggestionStatus("idle");
    setSuggestionError(null);
  };

  return (
    <section className={styles.section}>
      <p className={styles.sectionTitle}>Branding</p>

      <form className={styles.form} onSubmit={handleSave} style={{ marginTop: 12, gap: 16 }}>
        <div className={styles.field}>
          <label className={styles.label}>Logo</label>
          {/* Hidden file picker — referenced from both modes. Defining
              it once outside the conditional means the ref stays stable
              even as we toggle between url/upload mode. */}
          <input
            ref={fileInputRef}
            type="file"
            accept={LOGO_ACCEPT}
            onChange={(e) => handleLogoFile(e.target.files?.[0])}
            style={{ display: "none" }}
          />
          {logoSource === "upload" ? (
            <UploadedLogoChip
              logoUrl={logoUrl}
              uploading={uploading}
              onReplace={() => fileInputRef.current?.click()}
              onRemove={() => {
                // Clear local state; the operator hits Save to persist
                // the change. Mirrors how other branding fields work.
                setLogoUrl("");
                setLogoSource("url");
                setSuggestion(null);
                setSuggestionStatus("idle");
                setSuggestionError(null);
              }}
            />
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                <input
                  className={styles.input}
                  style={{ flex: 1 }}
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://cdn.example.com/logo.svg"
                  type="url"
                  maxLength={2048}
                />
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title={`Upload an image file (${LOGO_ACCEPT_LABEL})`}
                >
                  {uploading ? "Uploading…" : "Upload logo"}
                </button>
              </div>
              <p className={styles.helperMuted} style={{ marginTop: 6, fontSize: 12 }}>
                Paste a public URL or upload an image directly ({LOGO_ACCEPT_LABEL}).
                Uploaded logos are stored on Verbilo's CDN.
              </p>
            </>
          )}
          {uploadError && (
            <p className={styles.submitError} style={{ marginTop: 6 }}>
              {uploadError}
            </p>
          )}
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
          {/* VER-72: Reset to Verbilo defaults — clears all four
              branding fields in local state. Operator still clicks
              Save Branding to persist (mirrors the rest of the
              form). Hidden when there's nothing to reset. */}
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={resetToDefaults}
            disabled={isAlreadyBlank || submitting}
            title="Clear logo + all colours (Save branding to apply)"
          >
            Reset to defaults
          </button>
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

// VER-71: chip shown in upload mode in place of the raw S3 URL. Renders
// a thumbnail of the uploaded image alongside a label, plus Replace
// (re-opens the file picker) and Remove (clears the URL — operator
// must hit Save to persist). Keeps the bucket URL out of operator
// sight while still letting them swap or clear it.
function UploadedLogoChip({ logoUrl, uploading, onReplace, onRemove }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: 10,
        border: "1px solid var(--outline, rgba(0,0,0,0.16))",
        borderRadius: 8,
        background: "var(--surface, white)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 6,
          background: "#f4f6f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        ) : null}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Logo uploaded</div>
        <div className={styles.helperMuted} style={{ fontSize: 12 }}>
          Stored on Verbilo's CDN.
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={onReplace}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Replace"}
        </button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={onRemove}
          disabled={uploading}
          title="Remove the uploaded logo (save to persist)"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

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

// Tenant-intranet shell preview. Renders a miniature of what
// {slug}.verbilo.co.uk will actually look like with the current
// primary/secondary/accent values applied — sidebar (secondary),
// content background (accent), primary button + active nav item.
// Re-renders live as the operator types so they can dial in the
// palette in context instead of guessing from three hex chips.
function BrandPreview({ preview, logoUrl, tenantName }) {
  const navItems = ["Dashboard", "Clinical", "Staff", "HR", "Training"];
  return (
    <div className={styles.field}>
      <label className={styles.label}>Preview</label>
      <div
        style={{
          borderRadius: 12,
          border: "1px solid var(--outline, rgba(0,0,0,0.12))",
          overflow: "hidden",
          background: "#f4f6f8",
          display: "grid",
          gridTemplateColumns: "120px 1fr",
          minHeight: 240,
          fontSize: 11,
          lineHeight: 1.3,
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            background: preview.secondary,
            color: "white",
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Brand row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: preview.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: 13,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              ) : (
                (tenantName?.[0] ?? "V").toUpperCase()
              )}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                {tenantName ?? "Tenant"}
              </div>
              <div style={{ opacity: 0.65, fontSize: 9 }}>Intranet</div>
            </div>
          </div>

          {/* Nav items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
            {navItems.map((label, i) => {
              const active = i === 0;
              return (
                <div
                  key={label}
                  style={{
                    padding: "5px 8px",
                    borderRadius: 4,
                    background: active ? preview.primary : "transparent",
                    color: active ? "white" : "rgba(255,255,255,0.85)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main area */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Top bar */}
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              background: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 600, color: "#1f2937" }}>Dashboard</div>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: preview.accent,
                border: `1px solid ${preview.primary}`,
              }}
            />
          </div>

          {/* Body */}
          <div
            style={{
              padding: 12,
              background: preview.accent,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: 6,
                padding: 10,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ fontWeight: 600, color: "#1f2937" }}>
                Welcome back
              </div>
              <div style={{ color: "rgba(0,0,0,0.55)", fontSize: 10 }}>
                3 tasks pending · 12 documents to review
              </div>
              <button
                type="button"
                disabled
                style={{
                  marginTop: 4,
                  alignSelf: "flex-start",
                  padding: "5px 10px",
                  background: preview.primary,
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: "default",
                }}
              >
                View details →
              </button>
            </div>
          </div>
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
    </div>
  );
}
