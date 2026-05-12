import { fetchJson } from "./http";

export async function fetchMe() {
  return fetchJson("/users/me");
}

// VER-61: capability + scope payload from the backend. Drives the
// permission-aware nav on the frontend. Shape (matches the backend):
//   {
//     role: string,
//     capabilities: string[],
//     scope: { kind: 'platform' }
//          | { kind: 'tenant', tenantId }
//          | { kind: 'sites',  tenantId, siteIds: string[] }
//          | { kind: 'none' },
//     isPlatformAdmin: boolean,
//   }
// Backend remains the source of truth — frontend hides controls a
// user can't use, but every endpoint also enforces capability + scope.
export async function fetchMyPermissions() {
  return fetchJson("/users/me/permissions");
}
