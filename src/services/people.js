/**
 * people.js — the single roster the whole app reads names from.
 *
 * One source of truth = the Staff Directory users (`demoUsers`) plus the
 * clinical/support expansion (`clinicalStaff`). Every surface (rota, UDA,
 * governance leads, lab owners, admin reviewers, dashboard personas, …)
 * resolves names through here instead of hardcoding them.
 *
 * Each roster person carries `capabilityRole` (for RBAC gates) and a
 * normalised `siteId` (canonical), derived once here.
 */

import { demoUsers } from "../auth/demoUsers";
import { clinicalStaff } from "../auth/clinicalStaff";
import { capabilityRoleFor } from "./devRole";
import { resolveSiteId } from "./sites";

const ROSTER = [...demoUsers, ...clinicalStaff].map((u) => ({
  ...u,
  capabilityRole: capabilityRoleFor(u.role),
  // Area/global users have no practice → no bound site (siteId null).
  siteId: u.practiceId ? resolveSiteId(u.practiceId) : null,
}));

const byId = Object.fromEntries(ROSTER.map((u) => [u.id, u]));

/* Map a rota/UDA "kind" to the org roles that fill it. */
const CLINICAL_ROLES = {
  Dentist: ["associateDentist", "clinicalLead"],
  FD: ["foundationDentist"],
  Hygienist: ["hygienist"],
  Nurse: ["leadNurse", "dentalNurse"],
  Reception: ["receptionist", "frontOfHouseLead"],
};

export const allPeople = () => ROSTER;
export const getPerson = (id) => byId[id] ?? null;
export const personName = (id) => byId[id]?.displayName ?? "—";
export const peopleAtSite = (siteId) => {
  const sid = resolveSiteId(siteId);
  return ROSTER.filter((u) => u.siteId === sid);
};
export const peopleInArea = (areaId) => ROSTER.filter((u) => u.areaId === areaId);

/** Clinical/support staff at a site, optionally filtered to a rota "kind"
 *  (Dentist | FD | Hygienist | Nurse | Reception). */
export const clinicalStaffAtSite = (siteId, kind) => {
  const roles = kind ? CLINICAL_ROLES[kind] : null;
  return peopleAtSite(siteId).filter((u) => !roles || roles.includes(u.role));
};

/** First person at a site matching any of the given org roles (e.g. the
 *  practice manager) — handy for "publishedBy", owners, approvers. */
export const personAtSiteByRole = (siteId, roles) => {
  const wanted = Array.isArray(roles) ? roles : [roles];
  return peopleAtSite(siteId).find((u) => wanted.includes(u.role)) ?? null;
};
