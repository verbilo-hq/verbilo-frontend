import {
  groupUpdatesFixture, tipsFixture, defaultQuickLinksFixture,
  linkIconsFixture, rssFeedsFixture, fallbackNewsFixture,
} from "../fixtures/demo/dashboard";
import { isDemoMode } from "../lib/mode";
import { simulateLatency } from "./delay";
import { fetchJson } from "./http";

const RSS2JSON = "https://api.rss2json.com/v1/api.json?count=3&rss_url=";
const INTERNAL_NEWS_KEY = "verbilo_internal_news";

const EMPTY_SUMMARY = {
  patientCount: 0,
  todaysAppointments: 0,
  openTasks: 0,
  recentActivity: [],
};

// VER-39: synthetic summary shown on demo.verbilo.co.uk. Plausible
// mid-sized practice numbers so the dashboard header cards have content
// instead of "0 patients". Numbers are static — the demo doesn't need
// to feel live, just complete.
const DEMO_SUMMARY = {
  patientCount: 1248,
  todaysAppointments: 23,
  openTasks: 7,
  recentActivity: [
    { id: "a1", label: "Sarah Patel completed CPD: Safeguarding Children", at: "2h ago" },
    { id: "a2", label: "New patient registered: Tom Brennan",              at: "4h ago" },
    { id: "a3", label: "Lab case #4421 returned from Henry Schein",        at: "yesterday" },
  ],
};

/**
 * Tenant + site-scoped summary for the DashboardPage header.
 * Shape mirrors the VER-25 backend DTO:
 *   { patientCount, todaysAppointments, openTasks, recentActivity[] }
 *
 * On 401/403 returns an empty-state shape so the page renders rather
 * than crashing — the auth layer will redirect to /login separately.
 */
export async function getDashboardSummary() {
  // VER-39: demo surface has no backend session and no real numbers;
  // serve synthetic data so the dashboard renders fully.
  if (isDemoMode()) return { ...DEMO_SUMMARY };
  try {
    return await fetchJson("/dashboard/summary");
  } catch (err) {
    if (err?.code === "UNAUTHORIZED" || err?.code === "FORBIDDEN") {
      return { ...EMPTY_SUMMARY };
    }
    throw err;
  }
}

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

  const results = await Promise.allSettled(
    rssFeedsFixture.map((feed) =>
      fetch(`${RSS2JSON}${encodeURIComponent(feed.url)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.status !== "ok") return [];
          return data.items.slice(0, 2).map((item) => ({
            tag:   feed.tag,
            icon:  feed.icon,
            bg:    feed.bg,
            color: feed.color,
            title: item.title?.trim() ?? "",
            desc:  stripHtml(item.description),
            date:  fmtDate(item.pubDate),
            href:  item.link,
            _ts:   new Date(item.pubDate).getTime(),
          }));
        })
    )
  );
  const items = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .sort((a, b) => b._ts - a._ts)
    .slice(0, 5);

  newsCache = items.length ? items : [...fallbackNewsFixture];
  newsCacheDay = todayKey();
  return newsCache;
}

/* Internal news posts — persisted to localStorage for the demo;
   swap to fetchJson("/dashboard/internal-news") when backend lands. */
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
