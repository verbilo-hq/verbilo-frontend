// VER-64: extract a primary/secondary/accent palette from a tenant
// logo URL using node-vibrant. Pure client-side — runs in the browser,
// no server changes. Returns either:
//   { ok: true,  primary, secondary, accent, primaryAdjusted? }
//   { ok: false, reason: "cors" | "load" | "monochrome" | "tiny" | "unknown" }
//
// `primaryAdjusted` is set when we darkened the extracted primary to
// hit WCAG AA 4.5:1 contrast against white — the original hex is
// returned as `primaryOriginal` so the UI can explain the tweak.

import { Vibrant } from "node-vibrant/browser";

const WCAG_AA_RATIO = 4.5;

// Pull a hex out of a node-vibrant Swatch, defensively. Returns null
// if the slot is missing or malformed.
function hexOf(swatch) {
  if (!swatch) return null;
  const hex = swatch.hex;
  return typeof hex === "string" && /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.toLowerCase() : null;
}

// Relative luminance per WCAG 2.x — input components are 0–255.
function relativeLuminance(r, g, b) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastAgainstWhite(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const l = relativeLuminance(r, g, b);
  return 1.05 / (l + 0.05);
}

function rgbToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    default: h = (r - g) / d + 4;
  }
  return [h * 60, s, l];
}

function hslToHex(h, s, l) {
  h /= 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) => {
    const v = Math.max(0, Math.min(255, Math.round(x * 255)));
    return v.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// If a hex doesn't meet WCAG AA against white, darken it in HSL
// L-space until it does (or floor at L=0.1 to avoid pure black).
function ensureAaOnWhite(hex) {
  if (contrastAgainstWhite(hex) >= WCAG_AA_RATIO) return { hex, adjusted: false };
  const [h, s, l0] = rgbToHsl(hex);
  let l = l0;
  for (let i = 0; i < 20; i++) {
    l -= 0.05;
    if (l < 0.1) break;
    const candidate = hslToHex(h, s, l);
    if (contrastAgainstWhite(candidate) >= WCAG_AA_RATIO) {
      return { hex: candidate, adjusted: true };
    }
  }
  return { hex, adjusted: false };
}

// Given an HSL hex, lift the L by `delta` (clamped to [0,1]).
function shiftL(hex, delta) {
  const [h, s, l] = rgbToHsl(hex);
  return hslToHex(h, s, Math.max(0, Math.min(1, l + delta)));
}

// Map a node-vibrant Palette to the three Verbilo slots, falling back
// to tonal variants of whatever's available so a monochrome logo still
// yields three distinct hexes.
function mapPalette(palette) {
  const vibrant      = hexOf(palette.Vibrant);
  const darkVibrant  = hexOf(palette.DarkVibrant);
  const lightVibrant = hexOf(palette.LightVibrant);
  const muted        = hexOf(palette.Muted);
  const darkMuted    = hexOf(palette.DarkMuted);
  const lightMuted   = hexOf(palette.LightMuted);

  // Primary: prefer the bolder swatches.
  const primary = vibrant ?? darkVibrant ?? muted ?? darkMuted;
  if (!primary) return { ok: false, reason: "monochrome" };

  // Secondary: prefer a muted dark for sidebars / supporting fills.
  const secondary = darkMuted ?? muted ?? darkVibrant ?? shiftL(primary, -0.2);

  // Accent: prefer a light tint for highlights / hover.
  const accent = lightVibrant ?? lightMuted ?? shiftL(primary, +0.35);

  return { primary, secondary, accent };
}

export async function paletteFromLogo(url, { signal } = {}) {
  if (!url || typeof url !== "string") return { ok: false, reason: "load" };

  try {
    const builder = Vibrant.from(url);
    // node-vibrant doesn't accept an AbortSignal natively; we race the
    // promise so callers can cancel in-flight extractions when the
    // input changes again before the previous one finishes.
    const palette = await new Promise((resolve, reject) => {
      let settled = false;
      builder.getPalette().then(
        (p) => { if (!settled) { settled = true; resolve(p); } },
        (e) => { if (!settled) { settled = true; reject(e); } },
      );
      if (signal) {
        signal.addEventListener("abort", () => {
          if (!settled) { settled = true; reject(new DOMException("aborted", "AbortError")); }
        }, { once: true });
      }
    });

    const mapped = mapPalette(palette);
    if (!mapped.ok && mapped.reason) return mapped;

    const { hex: primaryFinal, adjusted: primaryAdjusted } = ensureAaOnWhite(mapped.primary);
    return {
      ok: true,
      primary: primaryFinal,
      secondary: mapped.secondary,
      accent: mapped.accent,
      ...(primaryAdjusted ? { primaryOriginal: mapped.primary, primaryAdjusted: true } : {}),
    };
  } catch (err) {
    if (err?.name === "AbortError") return { ok: false, reason: "aborted" };
    const message = String(err?.message ?? err ?? "");
    // Best-effort CORS detection — node-vibrant surfaces canvas
    // SecurityError, network errors, or the underlying image load
    // failure, none of which give a stable error class. The string
    // sniff is brittle but the user-facing branch is the same either
    // way ("couldn't analyse this logo").
    const isCors =
      /tainted|security|cross\s*origin|cors/i.test(message) ||
      err?.name === "SecurityError";
    if (isCors) return { ok: false, reason: "cors" };
    if (/load|404|fetch|network/i.test(message)) return { ok: false, reason: "load" };
    return { ok: false, reason: "unknown" };
  }
}
