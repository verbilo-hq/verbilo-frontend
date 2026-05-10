# Verbilo Frontend Agent Guide

This file is the working guide for AI agents and contributors in this repository. Follow it unless a newer user instruction explicitly overrides it.

## Project Context

- App: Verbilo, a multi-tenant intranet SaaS for UK dental group practices.
- Repository: React + Vite frontend deployed to Vercel.
- Backend: NestJS API deployed separately on Render. The frontend talks to it via `VITE_API_BASE`.
- Authentication: AWS Cognito user pool. The frontend obtains real Cognito ID tokens and stores them in session storage for API calls.

## Commands

- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Production build: `npm run build`
- Preview production build: `npm run preview`

Run `npm run build` after source changes. Documentation-only changes do not require a build.

## Environment Variables

Use `.env.local` for local secrets and deployment-specific values. Do not commit `.env.local` or any real secret values.

Required or supported Vite variables:

- `VITE_API_BASE`: Base URL for the backend API. In production this should be the Render backend URL, for example `https://verbilo-backend.onrender.com`.
- `VITE_COGNITO_USER_POOL_ID`: Cognito user pool id.
- `VITE_COGNITO_CLIENT_ID`: Cognito app client id. The client must not have a client secret.
- `VITE_AWS_REGION`: Cognito region. Current dev pool uses `eu-north-1`.
- `VITE_SENTRY_DSN`: Optional Sentry DSN.

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

Do not change this public shape unless the user explicitly asks for an auth contract change and the consumers are updated in the same patch.

Important files:

- `src/services/cognito.client.js` builds the Cognito user pool client from Vite env vars and should stay small.
- `src/services/auth.service.js` owns login, temp-password completion, logout, and fixture-backed account helpers.
- `src/services/http.js` owns API fetch behavior and auth header injection.
- `src/services/me.service.js` fetches `/users/me` for session enrichment.

`src/services/auth.service.js` intentionally has mixed responsibilities during the migration:

- `login`, `setPassword`, and `logout` use Cognito.
- `getSession`, `registerAccount`, and `listAccounts` still use local fixtures because admin/manager pages depend on them.

Do not migrate the fixture-backed helpers unless that is the requested task.

The session storage key is `inspire_session`. Keep that key and the stored shape `{ token, user }` unless the user explicitly requests a coordinated cleanup. `src/services/http.js` depends on this exact storage contract.

On successful Cognito login/password completion, the frontend should persist the basic session first, then attempt `/users/me` enrichment. If enrichment fails, login should still succeed with the basic session.

## API Conventions

- Use `fetchJson` from `src/services/http.js` for backend requests instead of adding separate fetch wrappers.
- Keep API paths relative, e.g. `/users/me`; `fetchJson` prefixes `VITE_API_BASE`.
- Authenticated API calls should rely on the token stored in `sessionStorage.inspire_session.token`.
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
- Keep operational screens dense, clear, and practical. Verbilo is an internal SaaS tool, not a marketing site.
- Use existing reusable components and visual patterns first.
- Avoid visible explanatory copy about implementation details, keyboard shortcuts, or internal auth mechanics unless the user asks for it.

## Deployment Notes

- Deployment target: Vercel.
- Vite is auto-detected; do not add `vercel.json` unless there is a concrete deployment requirement.
- Production Vercel env must set `VITE_API_BASE` to the Render backend URL.
- Production Cognito env vars must match the backend Cognito env vars so tokens validate against the same pool.

## Git And File Hygiene

- Do not commit `.env`, `.env.local`, `node_modules`, `dist`, or build artifacts.
- Keep generated lockfile changes only when dependency changes require them.
- Keep commits focused. Frontend and backend are separate repos, so commit each repo independently.
- Before committing code changes, check `git status` and review the diff for accidental env values or unrelated edits.

## Known Out-Of-Scope Areas Unless Requested

- Do not add MFA, self-signup, or Cognito hosted UI.
- Do not rename `SESSION_KEY` or the `inspire_session` storage key.
- Do not migrate admin account fixtures to backend/Cognito APIs unless requested.
- Do not replace the existing auth context or login pages during service-layer auth work.
