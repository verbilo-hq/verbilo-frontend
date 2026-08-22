# Verbilo Frontend Agent Guide

This file is the working guide for AI agents and contributors in this repository. Follow it unless a newer user instruction explicitly overrides it.

## Project Context

- App: Verbilo, a multi-tenant intranet SaaS for UK multi-site healthcare operators (dental groups, GP federations, vet groups, optical chains, physiotherapy networks, etc.). `Tenant.sector` is one of `dental, gp, vets, physio, optometry, other, healthcare`. UI chrome (sidebar glyph, sector subtitle, role labels) adapts via `src/lib/sector.js`. Sector-specific features (CQC, GDC validation, NHS UDA tracking) gate behind `Tenant.enabledModules` rather than the `sector` field directly.
- Repository: React + Vite frontend deployed to Vercel.
- Backend: NestJS API deployed separately on Render. The frontend talks to it via `VITE_API_BASE`.
- Authentication: AWS Cognito user pool. The frontend obtains real Cognito ID tokens and stores them in session storage for API calls.

## Commands

- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Production build: `npm run build`
- Preview production build: `npm run preview`
- Tests: `npm test` (Node's built-in test runner against `src/**/*.test.js`)

Run `npm run build` after source changes. Documentation-only changes do not require a build.

## Environment Variables

Use `.env.local` for local secrets and deployment-specific values. Do not commit `.env.local` or any real secret values.

Required or supported Vite variables:

- `VITE_API_BASE`: Base URL for the backend API. In production this should be the Render backend URL, for example `https://verbilo-backend.onrender.com`.
- `VITE_COGNITO_USER_POOL_ID`: Cognito user pool id.
- `VITE_COGNITO_CLIENT_ID`: Cognito app client id. The client must not have a client secret.
- `VITE_AWS_REGION`: Cognito region. Current dev pool uses `eu-north-1`.
- `VITE_SENTRY_DSN`: Optional Sentry DSN.
- `VITE_DEV_SURFACE` / `VITE_DEV_TENANT_SLUG`: Local-dev overrides for surface routing (public / admin / tenant). See README.

`VITE_API_BASE` is the canonical API base variable. Do not reintroduce `VITE_API_URL`; `src/services/http.js` does not read it.

After changing any Vite env var, restart the dev server. Vite reads env vars at startup/build time.

## Authentication Contract

The public auth contract is defined by `src/auth/AuthContext.jsx`:

- `login`
- `setPassword`
- `logout`
- `user`
- `token`
- `isAuthenticated`
- `site`, `sites`, `setActiveSite` (VER-22)

Do not change this public shape unless the user explicitly asks for an auth contract change and the consumers are updated in the same patch.

Important files:

- `src/services/cognito.client.js` builds the Cognito user pool client from Vite env vars and should stay small.
- `src/services/auth.service.js` owns Cognito login, temp-password completion, and logout. `registerAccount` is currently a no-op stub — the real "invite user + link to StaffMember" backend endpoint isn't built yet.
- `src/services/http.js` owns API fetch behavior and auth header injection.
- `src/services/me.service.js` fetches `/users/me` for session enrichment.
- `src/services/session.js` owns the session-storage contract (`verbilo_session` key, `{ token, user }` shape). Use the exported `readSession` / `persistSession` / `clearSession` / `getToken` helpers — do not access `sessionStorage` directly. A legacy-migration shim still handles the old `inspire_session` key on first load; it'll be ripped out once active tabs have cycled.

On successful Cognito login/password completion, the frontend persists the basic session first, then attempts `/users/me` enrichment. If enrichment fails, login still succeeds with the basic session.

## Sector-aware UI Conventions (VER-47)

Use `src/lib/sector.js` for any sector-conditional UI:

- `sectorIcon(sector)` for the brand glyph in Sidebar / Login / SetPasswordPage / wherever a tenant logo would sit. Defaults to a generic medical glyph when sector is unknown.
- `sectorLabel(sector)` for the human-readable sector subtitle.
- `roleLabel(role, sector, clinicalSpecialty)` to render a `StaffRole` enum value with sector-appropriate vocabulary. The backend stores the generic six (`admin`, `manager`, `clinician`, `clinical_support`, `reception`, `admin_support`); the UI translates. A per-row `clinicalSpecialty` (e.g. "Senior Endodontist") wins as an override.

Sector-specific clinical content (CQC training, NHS UDA tracking, GDC validation, dental laboratory pages) is allowed but must be clearly tagged as sector-specific and gated via `Tenant.enabledModules` rather than always-on.

## API Conventions

- Use `fetchJson` from `src/services/http.js` for backend requests instead of adding separate fetch wrappers.
- Keep API paths relative, e.g. `/users/me`; `fetchJson` prefixes `VITE_API_BASE`.
- Authenticated calls inject the bearer token via `getToken()` from `session.js` — do not read `sessionStorage` directly.
- Tenant-scoped API calls auto-include `X-Tenant-Slug` derived from the current surface (`resolveSurface()` in `src/lib/host.js`).
- Do not hardcode production backend URLs in source files.

## Code Style

- Follow the existing React + Vite JavaScript style.
- Prefer small service functions and small components over broad rewrites.
- Keep exported function names and component props stable unless the task requires a breaking change.
- Use existing CSS/module patterns and design tokens before adding new styling systems.
- Avoid introducing large dependencies for narrow UI or data-fetching tasks.
- Do not rename files or move routes as incidental cleanup.

## UI Conventions

- Preserve the existing login and set-password user experience unless asked to redesign it.
- Keep operational screens dense, clear, and practical. Verbilo is an internal SaaS tool, not a marketing site (the public landing at `verbilo.co.uk` is the marketing surface).
- Use existing reusable components and visual patterns first.
- Avoid visible explanatory copy about implementation details, keyboard shortcuts, or internal auth mechanics unless the user asks for it.
- Tenant-facing copy should never hard-code a single sector ("dental group", etc.). Pull `tenant.name` from `useTenant()` for brand strings; pull sector-specific labels from `roleLabel` / `sectorLabel`.

## Deployment Notes

- Deployment target: Vercel.
- `vercel.json` ships a strict CSP + the standard hardening headers (VER-21). When adding a new third-party endpoint that the frontend needs to call (script, style, connect target), update the matching directive in `vercel.json` in the same PR.
- Production Vercel env must set `VITE_API_BASE` to the Render backend URL.
- Production Cognito env vars must match the backend Cognito env vars so tokens validate against the same pool.

## Git And File Hygiene

- Do not commit `.env`, `.env.local`, `node_modules`, `dist`, or build artifacts.
- Keep generated lockfile changes only when dependency changes require them.
- Keep commits focused. Frontend and backend are separate repos, so commit each repo independently.
- Before committing code changes, check `git status` and review the diff for accidental env values or unrelated edits.

## Known Out-Of-Scope Areas Unless Requested

- Do not add MFA or Cognito hosted UI (MFA is tracked separately in VER-36).
- Do not introduce self-signup. Account provisioning is admin-driven.
- Do not replace the existing auth context or login pages during service-layer auth work.
