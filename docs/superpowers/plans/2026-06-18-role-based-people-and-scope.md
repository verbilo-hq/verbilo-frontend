# Role-based people & scope — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline, with live-app verification between slices) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every surface show real Staff-Directory users (no random/orphan names) and filter by the logged-in user's role + area/site scope, org-map style.

**Architecture:** Introduce a shared people/scope layer (one roster, one scope rule, one canonical site set + alias map, one in-scope selector) lifted from the already-working HR engine, then convert each module to read people from the roster and filter by scope. Domain data (rota cells, lab cases, documents) is kept; only the *people* and *site* references are rebound.

**Tech Stack:** React 18 + Vite, plain JS, CSS Modules. No test framework — verification is via the running dev server (preview DOM checks) + grep.

**Spec:** `docs/superpowers/specs/2026-06-18-role-based-people-and-scope-design.md`

## Conventions for this plan
- **No unit tests** (no harness). Each task ends with a **Verify** step: a `Grep` that the orphan names are gone, and/or a live-app check (log in via the sidebar "Viewing as" switcher as the relevant role; confirm names match the Staff Directory and scope is correct). The dev server runs at http://localhost:5174.
- **No git commits** unless the user asks. Work stays in the working tree.
- **Follow the reference pattern:** `pages/StaffDirectory.jsx` + `services/timeOff.service.js` already do roster + scope correctly. New code mirrors them.
- After each module, run the **orphan-name grep** for that module (Task 0.6) — it must return nothing.

## File structure

**Create:**
- `src/services/people.js` — the single roster API (built on `demoUsers`, expanded). Lookups by id/site/area/role.
- `src/services/scope.js` — single scoping rule (`visibleSites`, `visiblePeople`, `defaultSiteFor`, `canSeeAllSites`), lifted from `timeOff.service`.
- `src/services/sites.js` — canonical `SITES`, `AREAS`, `SITE_ALIASES`; `resolveSiteId(any)`, `siteName(id)`, `siteArea(id)`.
- `src/components/layout/ScopeSwitcher.jsx` + `.module.css` — org-map-style in-scope area/site picker.
- `src/auth/clinicalStaff.js` — roster expansion (extra clinical staff for Southall + London), merged by `people.js`.

**Modify (by phase):** `timeOff.service.js`, then `ManagerPage.jsx` + `manager/*` + `rota/rotaStore.js` + `manager.fixture.js`, `DashboardPage.jsx` + `dashboard/*`, governance (`seed/users.js` + pages/services + `AuditEvidenceCentre.jsx`), `LabPage.jsx`/`lab.fixture.js`, `AdminPage.jsx`/`admin.fixture.js`, `SupervisionHubPage.jsx`, `CpdPage.jsx`, `ManagementHubPage.jsx` + metrics services.

---

## Phase 0 — Shared layer + roster expansion

### Task 0.1: Canonical sites + alias map
**Files:** Create `src/services/sites.js`

- [ ] **Step 1:** Export canonical model (mirror `timeOff.service` `AREA_SITE_TARGETS`):
```js
export const AREAS = [
  { id: "area-1", name: "Area 1", siteIds: ["site-southall", "site-reading", "site-new-cross"] },
  { id: "area-2", name: "Area 2", siteIds: ["site-london", "site-manchester", "site-birmingham"] },
];
export const SITES = [
  { id: "site-southall",   name: "Southall",   areaId: "area-1", practiceId: "practice-harley" },
  { id: "site-reading",    name: "Reading",    areaId: "area-1" },
  { id: "site-new-cross",  name: "New Cross",  areaId: "area-1" },
  { id: "site-london",     name: "London",     areaId: "area-2", practiceId: "practice-camden" },
  { id: "site-manchester", name: "Manchester", areaId: "area-2" },
  { id: "site-birmingham", name: "Birmingham", areaId: "area-2" },
];
export const SITE_ALIASES = {
  "site-brighton": "site-southall", brighton: "site-southall",
  "site-hove": "site-reading", hove: "site-reading",
  "site-worthing": "site-new-cross", worthing: "site-new-cross",
  "site-crawley": "site-london", crawley: "site-london",
  "site-guildford": "site-manchester", guildford: "site-manchester",
  "site-portsmouth": "site-birmingham", portsmouth: "site-birmingham",
  "practice-harley": "site-southall", "practice-camden": "site-london",
};
const byId = Object.fromEntries(SITES.map((s) => [s.id, s]));
export function resolveSiteId(raw, fallback = "site-southall") {
  if (!raw) return fallback;
  if (byId[raw]) return raw;
  const key = String(raw).toLowerCase().replace(/\s+/g, "-");
  return SITE_ALIASES[raw] ?? SITE_ALIASES[key] ?? fallback;
}
export const siteName = (id) => byId[resolveSiteId(id)]?.name ?? "—";
export const siteArea = (id) => byId[resolveSiteId(id)]?.areaId ?? null;
```
- [ ] **Step 2: Verify** no Vite error (`preview_console_logs` clean); `resolveSiteId("Brighton") === "site-southall"`.

### Task 0.2: Roster expansion (clinical staff for the 2 main practices)
**Files:** Create `src/auth/clinicalStaff.js`

- [ ] **Step 1:** Define extra staff so Southall (`practice-harley`) and London (`practice-camden`) can fill a rota (2 dentists, FD/associate, 2 hygienists, lead+2 nurses, reception, TCO). Same field shape as `demoUsers` (id, username, password, role, staffId, scopeType, scopeIds, areaId, practiceId, teamId, managerId, displayName, gdcType/Number for clinical, isOnline). Example:
```js
export const clinicalStaff = [
  { id: "den-southall-2", username: "den.s2", password: "x", role: "associateDentist", staffId: 101,
    scopeType: "self", scopeIds: ["den-southall-2"], areaId: "area-1", practiceId: "practice-harley",
    teamId: "team-clinical-harley", managerId: "manager", displayName: "Dr. Hannah Reed",
    gdcType: "Dentist", gdcNumber: "260114", isOnline: true },
  // …hygienists, nurses, reception, TCO for Southall…
  // …full London team: practiceId: practice-camden, areaId: area-2,
  //   teamIds team-clinical-camden / team-nursing-camden, managerId "practice-manager-area-2"…
];
```
Target: Southall +~5, London +~10. Final per-practice ≈ 10–12 clinical/support.
- [ ] **Step 2: Verify** in Task 0.3 (directory shows new people at Southall/London).

### Task 0.3: `people` roster API
**Files:** Create `src/services/people.js`
```js
import { demoUsers } from "../auth/demoUsers";
import { clinicalStaff } from "../auth/clinicalStaff";
import { capabilityRoleFor } from "./devRole";
import { resolveSiteId } from "./sites";
const ROSTER = [...demoUsers, ...clinicalStaff].map((u) => ({
  ...u, capabilityRole: capabilityRoleFor(u.role),
  siteId: u.practiceId ? resolveSiteId(u.practiceId) : null,
}));
const byId = Object.fromEntries(ROSTER.map((u) => [u.id, u]));
export const allPeople = () => ROSTER;
export const getPerson = (id) => byId[id] ?? null;
export const personName = (id) => byId[id]?.displayName ?? "—";
export const peopleAtSite = (siteId) => ROSTER.filter((u) => u.siteId === resolveSiteId(siteId));
export const peopleInArea = (areaId) => ROSTER.filter((u) => u.areaId === areaId);
const CLINICAL = { Dentist: ["associateDentist","clinicalLead"], FD: ["foundationDentist"],
  Hygienist: ["hygienist"], Nurse: ["leadNurse","dentalNurse"], Reception: ["receptionist","frontOfHouseLead"] };
export const clinicalStaffAtSite = (siteId, kind) =>
  peopleAtSite(siteId).filter((u) => !kind || (CLINICAL[kind] ?? []).includes(u.role));
```
- [ ] **Verify:** login `o`, Staff Directory shows new clinical staff at Southall/London; no console errors.

### Task 0.4: `scope` service (lift the working rule)
**Files:** Create `src/services/scope.js`
```js
import { allPeople } from "./people";
import { SITES } from "./sites";
export function canSeeAllSites(user) {
  return user?.scopeType === "global" ||
    ["group_admin","company_management"].includes(user?.capabilityRole);
}
export function visibleSites(user) {
  if (!user) return [];
  if (canSeeAllSites(user)) return SITES;
  if (user.scopeType === "area") return SITES.filter((s) => s.areaId === user.areaId);
  return SITES.filter((s) => s.id === user.siteId);
}
export const defaultSiteFor = (user) => visibleSites(user)[0]?.id ?? "site-southall";
export function visiblePeople(user) {
  const ids = new Set(visibleSites(user).map((s) => s.id));
  return allPeople().filter((p) => !p.siteId || ids.has(p.siteId));
}
```
- [ ] **Verify:** as `a1` → 3 area-1 sites; `m` → Southall only; `o` → all 6 (temporary `window.__scopeProbe` eval, then remove).

### Task 0.5: `ScopeSwitcher` component
**Files:** Create `src/components/layout/ScopeSwitcher.jsx` + `.module.css`
- [ ] **Step 1:** Controlled site picker using `ThemedSelect`; options = `visibleSites(user)`; renders `null` if `<= 1`. Props `{ user, value, onChange }`.
- [ ] **Verify:** with first consumer (Phase 1): area manager sees 3 options, practice manager sees none.

### Task 0.6: Orphan-name grep baseline
- [ ] Record the orphan set for verification. `Grep` across `src/` (exclude `auth/demoUsers.js`, `auth/clinicalStaff.js`, `pages/LandingPage.jsx`, `docs/`): `Jessica O'Connor`, `Alexander Chen`, `Sarah Patel`, `Hannah Reeves`, `Amy Clarke`, `Sophia Nguyen`, `Maria Lopez`, `Mira Okafor`, `Sarah Jenkins`, `Mark Thompson`, `Elena Rossi`, `Leo Vance`, `Jessica Wu`, `Liam Vance`, `Chloe Brooks`, `James Owens`, `Priya Shah`, `Brighton`, `Hove`, `Worthing`, `Crawley`, `Guildford`, `Portsmouth`. This shrinks to zero (outside allowed files) as phases complete.

---

## Phase 1 — Practice Manager Hub (proves the pattern)
**Files:** `services/rota/rotaStore.js`, `services/fixtures/manager.fixture.js`, `pages/ManagerPage.jsx`, `pages/manager/RotaView.jsx`
- [ ] **Task 1.1 — Rota:** Replace `STAFF_ROSTER` with `clinicalStaffAtSite(activeSiteId)` → `{ name: personName, role }`. Seed assignments by roster people for the active site (default `defaultSiteFor(user)`), not "Brighton". `publishedBy` → the site's practice manager.
- [ ] **Task 1.2 — UDA / protocol-compliance / action-queue / compliance-rhythms:** Replace `udaDentistsFixture`, `ADOPTED_PROTOCOL_COMPLIANCE`, `ACTION_QUEUE_SEED`, `COMPLIANCE_RHYTHMS_SEED` names with roster people for the active site (dentists for UDA, clinical staff for protocol compliance). Keep the metrics/numbers.
- [ ] **Task 1.3 — Scope:** Bind hub to `defaultSiteFor(user)`; for area+ render `<ScopeSwitcher>` and re-derive from selected site. Header → `siteName(activeSiteId)` (remove "Brighton Dental Practice").
- [ ] **Verify:** login `m` (Southall PM) → Southall data, real Southall staff, no "Brighton"; `a1` → ScopeSwitcher (Southall/Reading/New Cross). `Grep` ManagerPage/manager/rota for orphan list → empty.

## Phase 2 — Dashboard
**Files:** `services/dashboard/{persona,spotlightLibrary,activityPulse,actionQueue}.js`, `pages/DashboardPage.jsx`
- [ ] **Task 2.1:** Map each persona to a real roster person by capability role; greeting uses logged-in user's first name + site.
- [ ] **Task 2.2:** Rebind `spotlightLibrary`, `activityPulse`, `COMPLIANCE_FEED`, `VERBILO_PULSE` author → roster people + canonical sites; scope manager-only widgets to `visibleSites`.
- [ ] **Verify:** several roles → greeting/spotlight/feed reference roster people + canonical sites. `Grep` dashboard files for orphan list → empty.

## Phase 3 — Governance (largest; isolate)
**Files:** `services/governance/seed/users.js`, `seed/sites.js`, `users.service.js`, governance pages, `pages/AuditEvidenceCentre.jsx`
- [ ] **Task 3.1:** Reseed `governance/seed/users.js` from the canonical roster (map governance roles → roster people at resolved sites), or make `users.service` read from `people.js`. Reseed `seed/sites.js` to canonical site ids (or pass through `resolveSiteId`).
- [ ] **Task 3.2:** Replace hardcoded `ASSIGNEE_BY_PACK` + `SIMULATION_PERSONA` (`AuditEvidenceCentre.jsx`) with the resolved site lead from the site profile / roster.
- [ ] **Task 3.3:** Confirm governance pages still scope by site/role on the canonical data.
- [ ] **Verify:** governance approver/acknowledger/operator/evidence names are roster people; sites canonical. `Grep` governance tree for orphan list → empty.

## Phase 4 — Lab, Admin, Supervision
**Files:** `lab.fixture.js`/`LabPage.jsx`, `admin.fixture.js`/`AdminPage.jsx`, `SupervisionHubPage.jsx`; retire `staff.fixture.js` if unused.
- [ ] **Task 4.1 — Lab:** case `clinician`/`owner`/timeline `by` → roster people at active site; site fields → canonical; scope case list to `visibleSites`.
- [ ] **Task 4.2 — Admin:** doc `uploadedBy`/`approvedBy`/`reviewer` → roster people; visibility per role.
- [ ] **Task 4.3 — Supervision:** replace `SUPERVISION_STORE_SEED` trainees/supervisors with roster people (FD/associate as trainees, clinical lead as ES); role-gate so only supervisors/PMs see trainees.
- [ ] **Task 4.4:** `Grep` for `staff.fixture` consumers; if none, delete it.
- [ ] **Verify:** roster people scoped to the user; `Grep` orphan list across these files → empty.

## Phase 5 — CPD (small)
**Files:** `pages/CpdPage.jsx`
- [ ] **Task 5.1:** Replace hardcoded `"Brighton Dental Practice"` (≈ line 77) with `siteName(defaultSiteFor(user))`. (List data is backend/RLS — leave it.)
- [ ] **Verify:** CPD manager-overview header shows the user's real site.

## Phase 6 — Management Hub
**Files:** `pages/ManagementHubPage.jsx`, `services/practiceMetrics.service.js`, `services/groupFinancials.service.js`
- [ ] **Task 6.1:** Re-point league/exceptions/financials onto canonical `SITES` (via `resolveSiteId` on governance seed sites). Keep region scoping; use `visibleSites(user)`.
- [ ] **Verify:** group_admin sees 6 canonical sites; area_manager sees their 3. `Grep` orphan list across these files → empty.

## Final verification
- [ ] Full Task 0.6 grep across `src/` (minus allowed files) → **zero** orphan names / non-canonical sites.
- [ ] Log in as one of each capability role (group_admin, company_management, area_manager, practice_manager, clinical_director, staff); click every hub: names real, scope correct, ScopeSwitcher behaves.
- [ ] `preview_console_logs` clean; production `vite build` succeeds.

## Self-review notes
- Spec coverage: D1–D6 mapped (roster=0.2/0.3, scope=0.4, governance=Phase 3, sites=0.1, depth=0.2, order=phases). ✔
- No test harness by design (documented); verification = app + grep.
- Type consistency: `resolveSiteId`/`siteName`/`siteArea`/`personName`/`visibleSites`/`defaultSiteFor`/`clinicalStaffAtSite` used consistently across phases.
