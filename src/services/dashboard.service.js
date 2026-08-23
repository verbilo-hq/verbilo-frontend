import {
  groupUpdatesFixture, tipsFixture, defaultQuickLinksFixture,
  linkIconsFixture, fallbackNewsFixture,
} from "./fixtures/dashboard.fixture";
import { simulateLatency } from "./delay";
import { fetchJson } from "./http";
import { isOfflineDemo } from "../lib/demoMode.js";
const INTERNAL_NEWS_KEY = "inspire_internal_news";

const stripHtml = (html) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);

let newsCache = null;
let newsCacheDay = null;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export async function listGroupUpdates() {
  await simulateLatency();
  return [...groupUpdatesFixture];
  // return fetchJson("/dashboard/group-updates");
}

export async function listTips() {
  await simulateLatency();
  return [...tipsFixture];
  // return fetchJson("/dashboard/tips");
}

export async function listLinkIcons() {
  await simulateLatency();
  return [...linkIconsFixture];
}

export async function listQuickLinks() {
  await simulateLatency();
  return [...defaultQuickLinksFixture];
  // return fetchJson("/dashboard/quick-links");
}

/* RSS news feed — daily in-memory cache, falls back to FALLBACK_NEWS on total failure. */
export async function fetchNews({ force = false } = {}) {
  if (!force && newsCache && newsCacheDay === todayKey()) return newsCache;

  const fmtDate = (str) => {
    if (!str) return "";
    const d = new Date(str);
    return Number.isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  let items = [];
  try {
    // Deployed demo has no backend it can authenticate against - fall straight
    // through to the offline regulator-link fallback below.
    if (isOfflineDemo()) throw new Error("offline demo");
    const response = await fetchJson("/dashboard/news");
    items = Array.isArray(response)
      ? response.map((item) => ({
          ...item,
          title: String(item.title ?? "").trim(),
          desc: stripHtml(item.desc),
          date: item.date || fmtDate(item.pubDate),
        }))
      : [];
  } catch {
    // UI-only local work does not require the backend. The static regulator
    // links below are the deliberate offline fallback, not fabricated news.
  }

  newsCache = items.length ? items : [...fallbackNewsFixture];
  newsCacheDay = todayKey();
  return newsCache;
}

/* Internal news / Verbilo Pulse posts — persisted to localStorage for the
   demo; swap to fetchJson("/dashboard/internal-news") when backend lands.
   The dashboard renders the newest post as the Pulse card; management
   roles author new ones via the "New post" composer. */
export function listInternalNews() {
  try {
    return JSON.parse(localStorage.getItem(INTERNAL_NEWS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveInternalNews(posts) {
  localStorage.setItem(INTERNAL_NEWS_KEY, JSON.stringify(posts));
}

/* Anonymous suggestion box — submissions persist so the management team
   can actually review them (the card promises a weekly review). No user
   identity is stored, deliberately: the box is advertised as anonymous. */
const SUGGESTIONS_KEY = "verbilo_suggestions";

export function listSuggestions() {
  try {
    return JSON.parse(localStorage.getItem(SUGGESTIONS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveSuggestion(text) {
  const entry = {
    id: `sug-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    at: new Date().toISOString(),
  };
  const all = [entry, ...listSuggestions()].slice(0, 100);
  try { localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(all)); } catch { /* noop */ }
  return entry;
}

/** Remove a reviewed suggestion; returns the remaining list. */
export function dismissSuggestion(id) {
  const all = listSuggestions().filter((s) => s.id !== id);
  try { localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(all)); } catch { /* noop */ }
  return all;
}
