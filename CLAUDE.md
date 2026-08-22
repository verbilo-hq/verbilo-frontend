# Verbilo Frontend — Agent Guide

> Vite + React SPA for Verbilo. Start with the umbrella
> [`../CLAUDE.md`](../CLAUDE.md) for project-wide context and hard constraints.
> Keep this file current — see [Keeping this file current](#keeping-this-file-current).

## Stack

- **Vite 6.4 + React 18**, **plain JavaScript (no TypeScript)**.
- **CSS Modules** (`X.module.css` beside each component) + a token-based theme.
- **No router** — hash-based routing implemented in `App.jsx`.
- **No state library** — React Context + `localStorage`.
- `lucide-react` icons (wrapped by `src/components/Icon.jsx`).
- `amazon-cognito-identity-js` for the real-auth path (mock path used locally).

## Run / build

```bash
npm run dev       # Vite dev server (host '::' dual-stack; tries :5173, bumps if held)
npm run build     # production build to dist/  (main chunk ~582 kB after code-split)
npm run preview   # serve the built dist/
npm test          # focused route-access and destructive-area safety contracts
npm run test:access # focused organisation-role route-matrix tests
```

`vite.config.js` uses **polling watch (2 s interval)** and a **local `~/.cache`
cacheDir** for reliable development on Windows-hosted workspaces. It also
`define`s `global: 'globalThis'` (the Cognito SDK needs it) and warms up the
governance/clinical/CPD/training entry trees. Production builds split stable
React/icon/auth dependencies and the largest clinical/governance catalogues into
cacheable chunks so page implementation chunks remain small. Test
host/watch/cache/build changes in the actual workspace before simplifying them.

## Entry & routing

- **`src/main.jsx`** — mounts providers: `AuthProvider` (`src/auth/AuthContext.jsx`),
  `IndustryProvider` (`src/contexts/IndustryContext.jsx`), `ErrorBoundary`. DEV-only:
  defines `window.devLogin()` / `window.devLogout()` against the mock-Cognito
  `/dev-token` minter. This block is `import.meta.env.DEV`-gated and tree-shaken from
  prod.
- **`src/App.jsx`** — the shell + **hash router**. `page` state mirrors to
  `location.hash` (`#/hr`), so Back/Forward/refresh/deep-links work with no router
  dep; unknown hashes fall back to `dashboard`. `pageComponents` maps id → component.
  **Most pages are `React.lazy`** (code-split); only `DashboardPage`, `LandingPage`,
  `LoginPage`, `SetPasswordPage` are eager. Cross-page navigation uses
  `handleNav(next, opts)` where `opts` becomes `pageContext` (deep-link payload, e.g.
  CQC → Audit Centre pre-filtered to a pack).

## State / contexts

- **`AuthContext`** (`src/auth/`) — session object in `sessionStorage['inspire_session']`
  (tab-scoped). "Remember me" also mirrors it to `localStorage` (see security review).
  `logout()` clears both. User shape: `{ id, orgRole, role (capability), capabilityRole,
  orgRoleLabel, ... }` — pages resolve identity by `id`.
- **`IndustryContext`** (`src/contexts/`) — the white-label config (brand name, nav
  items, industry copy). Dental-only today; the switcher was removed but the config
  seam remains for future tenant provisioning.
- **`AgendaContext`** (`src/contexts/`) — "Today's Compliance Agenda" drawer state +
  the single global toast (fired when a logbook entry is signed off).

## Services layer (`src/services/`)

The data engine. **Large**, mostly **`localStorage`-backed
dev stand-ins** behind a **"PRODUCTION SWAP BOUNDARY"**: the async wrappers each map
1:1 to a future backend endpoint (see [`../HANDOVER.md`](../HANDOVER.md) §2–§3 for the
full seam table). The UI only ever calls the wrappers. The audit-run flow uses the
single API-first `AuditRunPage`, with a development fallback for legacy local
schedules; see `src/pages/governance/AuditRunPage.README.md`.

Key modules:

- **`timeOff.service.js`** (~2.9k lines) — HR/org identity + hierarchy + leave engine.
  Scope/approval logic (`canApprove`, `getEditableUserIdsForActor`), user/area/site
  CRUD, org map. State key `verbilo_time_off_state_v3`. **Pure engine fns are
  side-effect-free** (state in → state out), ready to lift server-side. **Design
  background:** `docs/superpowers/specs/2026-06-18-role-based-people-and-scope-design.md`.
- **`auth.service.js`** — mock-Cognito vs real-Cognito branches (`USE_MOCK_COGNITO`).
  `persistSession`, `registerAccount`, `listAccounts`; both login paths normalise
  capability roles.
- **`devRole.js`** — granular org-role → capability-role projection,
  organisation-role-aware page visibility, and `hasCap(role, cap)` action gating.
  Frontline roles receive role-specific workspaces; unknown/missing staff roles
  fail closed to personal and published-content pages. Stand-in for the
  production database-hydrated role/scope assignment.
- **`practiceMetrics.service.js`** — per-practice metrics seam (league table + PM Hub
  read through it so they can't disagree).
- **`dashboard.service.js`** — Verbilo Pulse posts + suggestion inbox (localStorage
  keys `inspire_internal_news`, `verbilo_suggestions`).
- **`governance/`**, **`logbooks/`**, **`rota/`**, **`logic/`** — subsystem services;
  `governance/permissions.js` is the client-side `can()`/`assertCan()` gate (UX only).
- **`fixtures/`** — seed content (governance packs, clinical quickrefs, demo accounts).
  **Dev-only**; `accounts.fixture.js` / `demoUsers.js` carry demo credentials.
- **`pages/cpd/CpdVerifierQueue.jsx`** — intentionally unmounted production seam for
  the active `/cpd/verification-queue` API. Retain it until the verifier workflow is
  explicitly accepted and scheduled for navigation; mounting it now would change
  the current UI.

## Theme system (`src/theme/tokens.css`)

**Single source of truth.** CSS custom properties: radii (`--radius-sm` 3px / `-md` 4px
/ `-lg` 6px / `-pill` 4px), `--shadow-card` (`0 2px 6px rgba(15,23,42,0.06)`),
`--surface*` palette, fonts (`--font-display` Manrope / `--font-body` Inter),
`--gradient-primary`. `index.css` holds global control/select baselines including the
global `<select>` chevron. **Canonical component recipes** (card, control, modal, scrim)
are documented in `tokens.css` — match them; don't invent new radii/shadows/borders.

> **The user is exacting about theme consistency.** Do not change token values or
> introduce off-recipe borders/shadows/corners without an explicit request. When
> styling a new surface, copy an existing canonical recipe.

## Conventions

- Plain JS, function components, hooks. No TS, no PropTypes.
- CSS Modules per component/page; the generated class hash encodes the source line
  (e.g. `_title_1gk27_19` = `.title` at line 19) — handy for locating a rule.
- Icons: `import { I } from ".../components/Icon"` then `<I name="..." />` (lucide).
- Print/export views build HTML strings for `window.open().document.write()` — always
  HTML-escape interpolated user/data fields with `src/utils/escapeHtml.js`.

## Directory map

```
src/
  main.jsx, App.jsx, index.css, App.module.css
  auth/          AuthContext, demoUsers.js (18 seed users, DEV), auth helpers
  contexts/      IndustryContext, AgendaContext
  hooks/         shared hooks
  lib/           small utils (formatDate, etc.)
  theme/         tokens.css (the theme)
  components/     Icon, ErrorBoundary, SopPreview, ThemedSelect, Card, ...
    layout/       Sidebar, AppHeader, TopBar
    agenda/       TodaysAgendaDrawer (renders logbooks/LogModal)
    dashboard/, manager/, ui/
  pages/          one file per page (some ~1.4k lines)
    admin/, cpd/, governance/, landing/, logbooks/, manager/
  services/       the data engine (see above) + dashboard/, fixtures/,
                  governance/, logbooks/, logic/, rota/
  utils/
```

## Gotchas & how to verify (important for agents)

- **Screenshots of the in-app browser pane time out** (hidden-tab render freeze), and
  CSS transitions freeze mid-flight. **Verify with `javascript_tool` computed-style
  probes + `read_page`, not screenshots.** To measure a post-transition position,
  disable the transition first (`el.style.transition='none'; void el.offsetHeight;`).
- A dev server is often **already running on `:5174`** — check tabs before starting one.
- **CRLF line endings** — scripted/regex edits must use `\r?\n`, not bare `\n`.
- **localStorage shadows fixtures:** after changing `demoUsers.js` shape, clear
  `verbilo_time_off_state_v3` or the saved state wins. Logic/permission changes need no
  reset.
- Demo login is `password == username`. Roles switch via the DEV role switcher / persona.
- Large chunks `ClinicalPage`/`GovernancePage` are big because of **embedded demo
  content** (protocol libraries, pack data), not code — moving that to fetched JSON is
  the future win.

## Security-sensitive spots

The 2026-07-13 findings were remediated in the current working tree. See
`../docs/reviews/2026-07-15-hardening-review.md` for the implemented controls and
remaining release gates. Demo credentials and developer token helpers must remain
development-only and absent from production bundles.

Sidebar filtering and hash/deep-link guards now use the same granular
organisation-role route matrix. Route visibility is UX only: action capabilities
and backend scope enforcement remain authoritative.

## Keeping this file current

Update this file in the **same turn** you:
- add/remove/rename a page, route id, or nav item (routing + directory map);
- add/remove a context or a top-level `services/` module (state / services sections);
- introduce a new `localStorage`-backed stand-in (also add a `HANDOVER.md` row);
- change theme tokens or a canonical recipe (theme section);
- fix or introduce a security-relevant behavior (security section).
