import {
  cpdRolesFixture,
  cpdRoleProfilesFixture,
  practiceStaffFixture,
} from "../fixtures/demo/cpd";
import { isDemoMode } from "../lib/mode"; // VER-83: future tenant-mode branches (VER-86+) gate on this; currently unused, fixture imports above are returned unconditionally.
import { simulateLatency } from "./delay";
import { fetchJson } from "./http";

// VER-89: starter-template for CPD — returns the sector's regulator
// framework (GDC / RCVS / GOC / HCPC / GMC) as a single item. Page
// uses it to label the (otherwise empty) CPD log.
export async function listCpdStarterTemplates(tenantId) {
  if (!tenantId) return { items: [] };
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/starter-templates?module=cpd`,
  );
}

let profilesStore = JSON.parse(JSON.stringify(cpdRoleProfilesFixture));

export async function listCpdRoles() {
  await simulateLatency();
  return [...cpdRolesFixture];
  // return fetchJson("/cpd/roles");
}

export async function getCpdProfile(roleId) {
  await simulateLatency();
  return profilesStore[roleId] ? JSON.parse(JSON.stringify(profilesStore[roleId])) : null;
  // return fetchJson(`/cpd/profile/${roleId}`);
}

export async function addCpdLogEntry(roleId, entry) {
  await simulateLatency();
  const profile = profilesStore[roleId];
  if (!profile) throw Object.assign(new Error("Role not found"), { code: "NOT_FOUND" });
  const id = Math.max(0, ...profile.log.map((l) => l.id ?? 0)) + 1;
  const created = { ...entry, id };
  profile.log = [created, ...profile.log];
  profile.totalLogged = (profile.totalLogged ?? 0) + (entry.hrs ?? 0);
  return created;
  // return fetchJson(`/cpd/profile/${roleId}/log`, { method: "POST", body: entry });
}

export async function listPracticeStaffCpd() {
  await simulateLatency();
  return [...practiceStaffFixture];
  // return fetchJson("/cpd/practice-staff");
}
