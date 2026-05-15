import { isDemoMode } from "../lib/mode";
import { fetchJson } from "./http";

// VER-93: real Announcement CRUD. Replaces the localStorage-backed
// `listInternalNews()` stub that previously sat in dashboard.service.js.
// Backend: POST/GET/PATCH/DELETE /announcements, capability-gated by
//   announcements.list / .create / .delete (granted per role in
//   verbilo-backend/src/common/capabilities.ts).
//
// Response shape (single):
//   { id, tenantId, title, body, visibilityScope, scopeSiteIds, pinned,
//     publishedAt, expiresAt, createdAt, updatedAt, author: {...} | null }

const DEMO_NOW = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Plausible synthetic announcements for the demo subdomain. Mix of
// pinned + regular, mix of company/site scope, mix of authors so the
// dashboard surfaces something representative.
//
// Stored module-scope so the create/delete flow can mutate it across
// renders within a visitor's session. Each page load resets to seed.
const DEMO_SEED = [
  {
    id: "demo-ann-1",
    tenantId: "demo-tenant",
    title: "Updated infection control policy — please review by Friday",
    body: "We've revised our infection control SOP to align with the latest BDA guidance on instrument decontamination. Everyone on the clinical floor must read and acknowledge the new policy in the CQC Compliance Hub by end of day Friday. Practice managers, please verify completion for your site.",
    visibilityScope: "company",
    scopeSiteIds: [],
    pinned: true,
    publishedAt: new Date(DEMO_NOW - 4 * HOUR).toISOString(),
    expiresAt: null,
    createdAt: new Date(DEMO_NOW - 4 * HOUR).toISOString(),
    updatedAt: new Date(DEMO_NOW - 4 * HOUR).toISOString(),
    author: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
  {
    id: "demo-ann-2",
    tenantId: "demo-tenant",
    title: "London Flagship closed Friday afternoon for team training",
    body: "London Flagship will close at 13:00 on Friday for our quarterly all-team training. Patients with afternoon appointments have been rebooked. Please direct any walk-ins to the Camden site (5 min walk).",
    visibilityScope: "site",
    scopeSiteIds: ["site-london-flagship"],
    pinned: false,
    publishedAt: new Date(DEMO_NOW - 1 * DAY).toISOString(),
    expiresAt: new Date(DEMO_NOW + 3 * DAY).toISOString(),
    createdAt: new Date(DEMO_NOW - 1 * DAY).toISOString(),
    updatedAt: new Date(DEMO_NOW - 1 * DAY).toISOString(),
    author: { id: "demo-u-1", username: "demo.user", displayName: "Demo User" },
  },
  {
    id: "demo-ann-3",
    tenantId: "demo-tenant",
    title: "New referral pathway with St Thomas' Maxillofacial",
    body: "We've finalised the referral agreement with St Thomas' OMFS department. The new pathway form is live in Clinical Resources → Referral Forms. Please use it for all complex extractions and oral surgery referrals from this week onwards.",
    visibilityScope: "company",
    scopeSiteIds: [],
    pinned: false,
    publishedAt: new Date(DEMO_NOW - 3 * DAY).toISOString(),
    expiresAt: null,
    createdAt: new Date(DEMO_NOW - 3 * DAY).toISOString(),
    updatedAt: new Date(DEMO_NOW - 3 * DAY).toISOString(),
    author: { id: "demo-u-2", username: "sarah.patel", displayName: "Sarah Patel" },
  },
  {
    id: "demo-ann-4",
    tenantId: "demo-tenant",
    title: "CPD funding pot — Q2 applications open",
    body: "The Q2 CPD funding round is now open for applications. Up to £1,200 per clinician for external courses. Apply via the CPD Hub by 31 May. Priority given to courses aligned with our growth areas: clear aligner therapy, implant maintenance, and behavioural sciences.",
    visibilityScope: "company",
    scopeSiteIds: [],
    pinned: false,
    publishedAt: new Date(DEMO_NOW - 6 * DAY).toISOString(),
    expiresAt: null,
    createdAt: new Date(DEMO_NOW - 6 * DAY).toISOString(),
    updatedAt: new Date(DEMO_NOW - 6 * DAY).toISOString(),
    author: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
];

let demoAnnouncements = DEMO_SEED.map((a) => ({ ...a }));

function findDemo(id) {
  return demoAnnouncements.find((a) => a.id === id) ?? null;
}

function sortAnnouncements(rows) {
  return [...rows].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });
}

export async function listAnnouncements(params = {}) {
  if (isDemoMode()) {
    const now = Date.now();
    const visible = demoAnnouncements.filter((a) => {
      if (a.deletedAt) return false;
      if (a.expiresAt && new Date(a.expiresAt).getTime() < now) return false;
      return true;
    });
    return { items: sortAnnouncements(visible), nextCursor: null };
  }
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const suffix = qs.toString() ? `?${qs}` : "";
  return fetchJson(`/announcements${suffix}`);
}

export async function createAnnouncement(payload) {
  if (isDemoMode()) {
    const row = {
      id: `demo-ann-${Date.now()}`,
      tenantId: "demo-tenant",
      title: payload.title,
      body: payload.body,
      visibilityScope: payload.visibilityScope,
      scopeSiteIds: payload.scopeSiteIds ?? [],
      pinned: Boolean(payload.pinned),
      publishedAt: new Date().toISOString(),
      expiresAt: payload.expiresAt ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: { id: "demo-u-1", username: "demo.user", displayName: "Demo User" },
    };
    demoAnnouncements = [row, ...demoAnnouncements];
    return row;
  }
  return fetchJson("/announcements", { method: "POST", body: payload });
}

export async function updateAnnouncement(id, payload) {
  if (isDemoMode()) {
    const row = findDemo(id);
    if (row) {
      Object.assign(row, payload, { updatedAt: new Date().toISOString() });
    }
    return row;
  }
  return fetchJson(`/announcements/${encodeURIComponent(id)}`, { method: "PATCH", body: payload });
}

export async function deleteAnnouncement(id) {
  if (isDemoMode()) {
    demoAnnouncements = demoAnnouncements.filter((a) => a.id !== id);
    return { id };
  }
  return fetchJson(`/announcements/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// VER-93 helper: turn an announcement's visibilityScope into a short
// human-readable label for the dashboard pill. Kept here (not in the
// component) so the modal preview + the dashboard agree.
export function scopeLabel(scope, scopeSiteIds = []) {
  if (scope === "company") return "Company-wide";
  if (scope === "site") return scopeSiteIds.length === 1 ? "Single site" : "Sites";
  if (scope === "area") return `${scopeSiteIds.length} sites`;
  return scope;
}
