import {
  groupUpdatesFixture, tipsFixture, defaultQuickLinksFixture,
  linkIconsFixture, rssFeedsFixture, fallbackNewsFixture,
} from "./fixtures/dashboard.fixture";
import { simulateLatency } from "./delay";
// import { fetchJson } from "./http";

const RSS2JSON = "https://api.rss2json.com/v1/api.json?count=3&rss_url=";
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
