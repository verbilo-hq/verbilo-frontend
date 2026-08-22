# Role-based people & scope — design spec

**Date:** 2026-06-18
**Status:** Draft for review
**Scope:** `verbilo-frontend` (client-side demo data + pages). Demo site only — no backend changes required.

## 1. Goal

Every surface in the app must:

1. Show **real users from the Staff Directory** (one roster) — no more random/orphan names.
2. Be **role- and scope-aware** like the org map: a user sees only the area(s)/site(s) they're scoped to, with an in-scope area/site selector where they cover several. Group Admin / Company roles see everything.

The user's example: the **Practice Manager Hub** UDA breakdown and rota show invented names ("Dr Alexander Chen", "Jessica O'Connor") for a "Brighton" site that isn't in the directory.

## 2. Decisions (agreed)

| # | Decision | Choice |
|---|---|---|
| D1 | Roster source of truth | The Staff Directory roster (`demoUsers` + HR engine), **expanded only where needed**. |
| D2 | Scoping behaviour | **Scoped + in-scope selector** (org-map style). Group/Company see all. |
| D3 | Governance users | **Unify** governance onto the same roster. |
| D4 | Approach | **Shared layer + audit first** (this doc), then convert module-by-module, PM Hub first. |
| D5 | Site taxonomy | **Org-map set wins**: Southall, Reading, New Cross (area-1); London, Manchester, Birmingham (area-2). Governance + fixtures remap onto these. |
| D6 | Roster depth | **Full clinical teams at the two main practices** (Southall `practice-harley`, London `practice-camden`); other 4 sites lighter. |

Out of scope: the public marketing **Landing page** names (intentional marketing), **Brand Hub** and **Training Hub** (no people).

## 3. Current state (audit summary)

A real scope engine already exists and works: `src/services/timeOff.service.js` (`getAllReportsBelow(userId)` + `scopeType` global/area/practice/team/self) and `src/services/devRole.js` (org→capability role map + `hasCap`). **Staff Directory and HR Hub already scope correctly off it** — this is the reference pattern.

Three parallel identity systems exist today:

| System | Source | Sites used | Used by |
|---|---|---|---|
| **A. Canonical HR** (source of truth) | `src/auth/demoUsers.js` (18) via `timeOff.service` | Southall/Reading/New Cross/London/Manchester/Birmingham | Staff Directory ✅, HR Hub ✅ |
| **B. Governance** (~30 separate users) | `src/services/governance/seed/users.js` | Brighton/Hove/Worthing/Crawley/Guildford/Portsmouth | All governance, CQC, evidence, operator-entitlement, audit-trail pages |
| **C. Ad-hoc fixtures** (~30 orphan names) | `persona.js`, `manager.fixture.js`, `rota/rotaStore.js`, `staff.fixture.js`, `lab.fixture.js`, `admin.fixture.js`, Supervision seed, `AuditEvidenceCentre` `ASSIGNEE_BY_PACK`/`SIMULATION_PERSONA` | mostly hardcoded "Brighton" | Dashboard, PM Hub, Lab, Admin, Supervision |

**Per-module scope status:**

| Module | File(s) | Names source | Scoped today? | Action |
|---|---|---|---|---|
| Staff Directory | `pages/StaffDirectory.jsx` | A (canonical) | yes | reference pattern — no change |
| HR Hub | `pages/HrPage.jsx` | A (canonical) | yes | reference pattern — no change |
| Practice Manager Hub | `pages/ManagerPage.jsx`, `pages/manager/*`, `services/rota/rotaStore.js`, `fixtures/manager.fixture.js` | C, hardcoded "Brighton" | no | **convert (first)** |
| Dashboard | `pages/DashboardPage.jsx`, `services/dashboard/{persona,spotlightLibrary,activityPulse,actionQueue}.js` | C | persona switches but names + sites orphan | convert |
| Governance suite | `pages/GovernancePage.jsx`, `pages/governance/*`, `services/governance/*`, `pages/AuditEvidenceCentre.jsx`, `CqcPage.jsx`, `pages/logbooks/*` | B (+ hardcoded leads/persona) | scoped, but wrong roster + sites | migrate roster + remap sites |
| Management Hub | `pages/ManagementHubPage.jsx`, `services/{practiceMetrics,groupFinancials}.service.js` | B sites | scoped by region, wrong sites | remap sites |
| Lab Work Hub | `pages/LabPage.jsx`, `fixtures/lab.fixture.js` | C | read not scoped (actions cap-gated) | convert |
| Admin Centre | `pages/AdminPage.jsx`, `fixtures/admin.fixture.js` | C | no | convert |
| Supervision Hub | `pages/SupervisionHubPage.jsx` (`SUPERVISION_STORE_SEED`) | C | no, not role-gated | convert |
| CPD Hub | `pages/CpdPage.jsx` | backend (RLS) + hardcoded "Brighton Dental Practice" string | mostly yes | fix hardcoded site string only |
| Brand Hub, Training Hub | `MarketingPage.jsx`, `TrainingPage.jsx` | none | n/a | no change |

Note: `fixtures/staff.fixture.js` is a third parallel people list (Dr Sarah Jenkins, Mark Thompson…); confirm consumers during implementation and retire it.

## 4. Target architecture (the shared layer)

Four shared units; everything else consumes them.

### 4.1 `people` roster (single source of names)
- Built on `demoUsers`, **expanded** (see §5). Each person: `id, displayName, username, orgRole, capabilityRole, scopeType, scopeIds, areaId, siteId, teamId, managerId, gdc/profile fields`.
- Exposes lookups: `getPerson(id)`, `peopleAtSite(siteId)`, `peopleInArea(areaId)`, `peopleByRole(role, scope)`, `clinicalStaffAtSite(siteId, kinds)`.
- This is where rota, UDA, governance leads, lab owners, admin reviewers, dashboard personas, etc. all draw names.

### 4.2 `scope.service` (single scoping rule)
- Lift the existing `getAllReportsBelow` + `scopeType` logic out of `timeOff.service` into a reusable module so every page filters identically to how the Staff Directory does.
- API: `visibleSites(user)`, `visiblePeople(user)`, `defaultSiteFor(user)`, `canSeeAllSites(user)`.
- Rule: `global` → all; `area` → sites in `areaId`; `practice` → own `siteId`; `team`/`self` → own site (read) / self (personal widgets). Group/Company → all.

### 4.3 Canonical sites + alias map
- One exported `SITES` list = the org-map six (already in `timeOff.service` `AREA_SITE_TARGETS`).
- Extend the existing `LEGACY_SITE_ALIASES` to fold **system B + C** site names onto canonical ids:
  - `site-brighton → site-southall`, `site-hove → site-reading`, `site-worthing → site-new-cross` (area-1)
  - `site-crawley → site-london`, `site-guildford → site-manchester`, `site-portsmouth → site-birmingham` (area-2)
  - bare `"Brighton"` (rota/fixtures) → the logged-in user's site (or `site-southall` default).

### 4.4 In-scope site/area selector
- A small shared `<ScopeSwitcher>` (mirrors the org-map area/site picker) shown on multi-site surfaces (Management Hub, PM Hub when area-scoped, Governance). Options limited to `visibleSites(user)`; hidden when the user has one site. Drives the page's active-site filter.

### 4.5 Conversion pattern (per module)
Keep each surface's **domain data** (rota assignments, lab cases, documents, audit schedules) but:
1. Replace every literal person name with a roster `id` resolved through `people`.
2. Filter the surface's people/rows by `scope.service` for the logged-in user.
3. Replace site strings with canonical site ids via the alias map; add `<ScopeSwitcher>` where multiple sites are in scope.

## 5. Data plan (roster expansion — D6)

Two practices get full clinical teams; the others keep their current light staffing.

- **Southall (`practice-harley`, area-1)** — already has Maya (PM), Dev (deputy), Dr Callum Lead (clinical lead), Nina (lead nurse), Daisy (nurse), Freya (FoH), Ria (reception), Emma, Dr Amir (associate dentist), Tara (TCO). **Top up** for a rota: +1 dentist, +1–2 hygienists, +1–2 nurses, +1 FD/associate.
- **London (`practice-camden`, area-2)** — currently only Priya (PM) + Elliot. **Build a full clinical team**: PM (Priya), deputy, 2 dentists, FD, 2 hygienists, lead nurse + 2 nurses, reception, TCO.
- A site needs roughly: 2 dentists + 1 FD/associate, 2 hygienists, 1 lead nurse + 2 nurses, 1 reception, 1 TCO (~10–11) to populate rota (5 surgeries) + UDA + protocol compliance.
- New people are added to the roster with proper `orgRole`, `siteId`, `areaId`, `scopeType` so they flow through scoping automatically (and appear in the Staff Directory). Other 4 sites keep manager-only/light staffing; their rota/UDA show what exists.

## 6. Remediation order

1. **Practice Manager Hub** (the example) — rota roster → site clinical staff; UDA/protocol-compliance/action-queue/compliance-rhythms → roster; bind to logged-in PM's site (or `<ScopeSwitcher>` for area+). Proves the pattern end-to-end.
2. **Dashboard** — personas/spotlight/activity-pulse/feed/"Verbilo Pulse" → roster + scope; greeting uses logged-in user.
3. **Governance** — migrate `governance/seed/users.js` onto the roster; remap sites; replace hardcoded `ASSIGNEE_BY_PACK`/`SIMULATION_PERSONA` with resolved site leads.
4. **Lab / Admin / Supervision** — case owners/clinicians, doc uploaders/reviewers, trainees/supervisors → roster + scope + role-gating.
5. **CPD** — fix hardcoded "Brighton Dental Practice" → logged-in user's site name.
6. **Management Hub** — re-point league/exceptions/financials onto canonical sites.

Each module is a self-contained slice: convert → verify (log in as the relevant roles) → next.

## 7. Verification

For each converted module, log in (via the Viewing-as switcher) as a representative of each role and confirm:
- Every visible name is a real roster person (cross-check Staff Directory).
- Group Admin sees all sites; Area Manager sees only their area (with selector); Practice Manager sees only their site; Staff see self/own site.
- No orphan names (grep the module for literal names returns nothing) and no "Brighton/Hove/…" strings outside the alias map.

## 8. Risks & notes

- **Governance store is self-contained** (its own TABLES/seed); migrating it is the largest single slice — isolate it.
- Some surfaces need more clinical staff than exist (rota) — covered by §5; if a light site can't fill a rota, the rota shows open/unstaffed cells (acceptable, realistic).
- Backend-RLS-scoped lists (CPD, audit sessions) are already correct; don't double-filter on the client.
- `staff.fixture.js` may be dead — verify and retire rather than migrate.

## 9. Out of scope

Public Landing page marketing names; Brand Hub; Training Hub; any backend/Prisma changes; production data wiring.
