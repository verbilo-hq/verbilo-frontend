# `src/fixtures/demo/` — demo-mode fixture content

This directory holds the rich, hypothetical-practice content that the Verbilo intranet shell renders today on every tenant. It dates from before [VER-82](https://linear.app/verbilo/issue/VER-82), when there was no separation between "what a brand-new tenant sees" and "what populated Verbilo looks like."

## What lives here

Per-module fixture data — fake "Coffee with Dr Sarah Jenkins" videos, fake protocols, fake CPD entries, fake KLOE evidence, etc. **Not** intended to ship as a real tenant's first view. Each subdirectory mirrors a tenant-side module page.

| Module | Source page | Status |
|---|---|---|
| `admin/` | (admin tenant settings — small) | Moved from `src/services/fixtures/admin.fixture.js` |
| `clinical/` | `ClinicalPage.jsx` | Moved from `src/services/fixtures/clinical.fixture.js` |
| `cpd/` | `CpdPage.jsx` | Moved from `src/services/fixtures/cpd.fixture.js` |
| `dashboard/` | `DashboardPage.jsx` | Moved from `src/services/fixtures/dashboard.fixture.js` |
| `hr/` | `HrPage.jsx` | Moved from `src/services/fixtures/hr.fixture.js` |
| `lab/` | `LabPage.jsx` | Moved from `src/services/fixtures/lab.fixture.js` |
| `manager/` | `ManagerPage.jsx` | Moved from `src/services/fixtures/manager.fixture.js` |
| `staff/` | `StaffPage.jsx` | Moved from `src/services/fixtures/staff.fixture.js` |

### Still-inline fixtures (not yet relocated)

These pages currently keep their fixture data inline rather than in a separate file. They'll be extracted to `src/fixtures/demo/<module>/` when their tenant-mode rewrite ticket lands:

| Module | Source page | Relocates during |
|---|---|---|
| `training` | `TrainingPage.jsx` (~1482 LoC of inline data) | [VER-88](https://linear.app/verbilo/issue/VER-88) |
| `cqc` | `CqcPage.jsx` (~1014 LoC) | [VER-89](https://linear.app/verbilo/issue/VER-89) |
| `marketing` | `MarketingPage.jsx` (~498 LoC) | [VER-90](https://linear.app/verbilo/issue/VER-90) |

## Where this gets consumed

Each service in `src/services/<module>.service.js` imports its fixture from here and currently returns it unconditionally. [VER-86](https://linear.app/verbilo/issue/VER-86) onwards add a branch: when `isDemoMode()` from `src/lib/mode.js` returns `false`, the service returns honest empty state / starter templates instead. Until then, every caller (tenant or otherwise) sees this demo content.

## Future home

[VER-39](https://linear.app/verbilo/issue/VER-39) plans a public `demo.verbilo.co.uk` subdomain — once that ships, the hostname will trigger `isDemoMode() === true` and this content becomes the demo site's data feed. Don't delete it.
