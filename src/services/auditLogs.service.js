import { isDemoMode } from "../lib/mode";
import { fetchJson } from "./http";

// VER-94: read-side of the audit log. Write side (VER-28) is handled by
// the backend interceptor on every mutating request; this service surfaces
// the entries for a compliance review UI.
//
// Backend response shape (see verbilo-backend/src/audit/audit.service.ts):
//   {
//     items: [{
//       id, actorUserId, tenantId, action, entityType, entityId,
//       payload, createdAt,
//       actor: { id, username, displayName } | null,
//     }],
//     nextCursor: string | null,
//   }

const DEMO_NOW = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Plausible synthetic audit trail for the demo subdomain. Covers the major
// action verbs so a sales tour can demonstrate "this is what CQC sees."
// Ordered newest first, matching the real endpoint's response.
const DEMO_ENTRIES = [
  {
    id: "demo-a-1",
    actorUserId: "demo-u-5",
    tenantId: "demo-tenant",
    action: "user.role.updated",
    entityType: "User",
    entityId: "demo-u-3",
    payload: { from: "employee", to: "practice_manager" },
    createdAt: new Date(DEMO_NOW - 2 * HOUR).toISOString(),
    actor: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
  {
    id: "demo-a-2",
    actorUserId: "demo-u-1",
    tenantId: "demo-tenant",
    action: "user.created",
    entityType: "User",
    entityId: "demo-u-new1",
    payload: { username: "rachel.thomas", role: "employee" },
    createdAt: new Date(DEMO_NOW - 4 * HOUR).toISOString(),
    actor: { id: "demo-u-1", username: "demo.user", displayName: "Demo User" },
  },
  {
    id: "demo-a-3",
    actorUserId: "demo-u-5",
    tenantId: "demo-tenant",
    action: "tenant.branding.updated",
    entityType: "Tenant",
    entityId: "demo-tenant",
    payload: { primaryColor: "#b91c1c" },
    createdAt: new Date(DEMO_NOW - 6 * HOUR).toISOString(),
    actor: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
  {
    id: "demo-a-4",
    actorUserId: "demo-u-1",
    tenantId: "demo-tenant",
    action: "user.disabled",
    entityType: "User",
    entityId: "demo-u-7",
    payload: { reason: "Left practice" },
    createdAt: new Date(DEMO_NOW - 22 * HOUR).toISOString(),
    actor: { id: "demo-u-1", username: "demo.user", displayName: "Demo User" },
  },
  {
    id: "demo-a-5",
    actorUserId: "demo-u-2",
    tenantId: "demo-tenant",
    action: "auth.password.reset",
    entityType: "User",
    entityId: "demo-u-6",
    payload: { method: "manager_initiated" },
    createdAt: new Date(DEMO_NOW - 1 * DAY - 3 * HOUR).toISOString(),
    actor: { id: "demo-u-2", username: "sarah.patel", displayName: "Sarah Patel" },
  },
  {
    id: "demo-a-6",
    actorUserId: "demo-u-1",
    tenantId: "demo-tenant",
    action: "user.created",
    entityType: "User",
    entityId: "demo-u-6",
    payload: { username: "james.wright", role: "employee" },
    createdAt: new Date(DEMO_NOW - 1 * DAY - 5 * HOUR).toISOString(),
    actor: { id: "demo-u-1", username: "demo.user", displayName: "Demo User" },
  },
  {
    id: "demo-a-7",
    actorUserId: "demo-u-5",
    tenantId: "demo-tenant",
    action: "tenant.sites.updated",
    entityType: "Tenant",
    entityId: "demo-tenant",
    payload: { added: ["Manchester Spinningfields"] },
    createdAt: new Date(DEMO_NOW - 2 * DAY).toISOString(),
    actor: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
  {
    id: "demo-a-8",
    actorUserId: "demo-u-2",
    tenantId: "demo-tenant",
    action: "user.role.updated",
    entityType: "User",
    entityId: "demo-u-4",
    payload: { from: "practice_manager", to: "area_manager" },
    createdAt: new Date(DEMO_NOW - 3 * DAY).toISOString(),
    actor: { id: "demo-u-2", username: "sarah.patel", displayName: "Sarah Patel" },
  },
  {
    id: "demo-a-9",
    actorUserId: "demo-u-1",
    tenantId: "demo-tenant",
    action: "auth.mfa.enrolled",
    entityType: "User",
    entityId: "demo-u-1",
    payload: { device: "authenticator-app" },
    createdAt: new Date(DEMO_NOW - 4 * DAY).toISOString(),
    actor: { id: "demo-u-1", username: "demo.user", displayName: "Demo User" },
  },
  {
    id: "demo-a-10",
    actorUserId: "demo-u-5",
    tenantId: "demo-tenant",
    action: "user.deleted",
    entityType: "User",
    entityId: "demo-u-old",
    payload: { username: "ben.cox" },
    createdAt: new Date(DEMO_NOW - 7 * DAY).toISOString(),
    actor: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
  {
    id: "demo-a-11",
    actorUserId: null,
    tenantId: "demo-tenant",
    action: "user.disabled",
    entityType: "User",
    entityId: "demo-u-stale",
    payload: { reason: "auto_inactivity", days: 90 },
    createdAt: new Date(DEMO_NOW - 9 * DAY).toISOString(),
    actor: null,
  },
  {
    id: "demo-a-12",
    actorUserId: "demo-u-5",
    tenantId: "demo-tenant",
    action: "tenant.branding.updated",
    entityType: "Tenant",
    entityId: "demo-tenant",
    payload: { logoUrl: "https://demo.verbilo.co.uk/uploaded-logo.svg" },
    createdAt: new Date(DEMO_NOW - 12 * DAY).toISOString(),
    actor: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
];

function filterDemo(entries, params) {
  return entries.filter((e) => {
    if (params.action && e.action !== params.action) return false;
    if (params.actorUserId && e.actorUserId !== params.actorUserId) return false;
    if (params.entityType && e.entityType !== params.entityType) return false;
    if (params.entityId && e.entityId !== params.entityId) return false;
    if (params.from && new Date(e.createdAt) < new Date(params.from)) return false;
    if (params.to && new Date(e.createdAt) > new Date(params.to)) return false;
    return true;
  });
}

export async function listAuditLogs(params = {}) {
  if (isDemoMode()) {
    const filtered = filterDemo(DEMO_ENTRIES, params);
    return { items: filtered, nextCursor: null };
  }
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const suffix = qs.toString() ? `?${qs}` : "";
  return fetchJson(`/audit-logs${suffix}`);
}

// Canonical action list — kept in sync with the backend audit actions used
// by the interceptor. Drives the filter dropdown in the UI.
export const KNOWN_AUDIT_ACTIONS = [
  "user.created",
  "user.role.updated",
  "user.disabled",
  "user.enabled",
  "user.deleted",
  "auth.password.reset",
  "auth.mfa.enrolled",
  "auth.mfa.reset",
  "tenant.branding.updated",
  "tenant.sites.updated",
  "tenant.archived",
];
