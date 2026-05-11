# Verbilo Frontend

## Overview

React/Vite frontend for Verbilo. Deploys to Vercel.

## Tech Stack

- React
- Vite
- AWS Cognito
- Sentry

## Local Setup

```bash
npm install
cp .env.example .env.local
```

Fill in the values in `.env.local`, then start the development server:

```bash
npm run dev
```

The dev server runs on `http://localhost:5173`. To exercise the different surfaces (public landing / admin portal / tenant intranet) from a single dev server, use query overrides:

- `http://localhost:5173/` → public landing.
- `http://localhost:5173/?surface=admin` → admin portal.
- `http://localhost:5173/?surface=tenant&slug=companyx` → tenant app for `companyx`.

You can also pin a default tenant slug in `.env.local` via `VITE_DEV_TENANT_SLUG=companyx` and `VITE_DEV_SURFACE=tenant`.

## Environment Variables

- `VITE_API_BASE` — Base URL for the Verbilo backend API (e.g. `https://verbilo-backend.onrender.com` in prod, `https://verbilo-backend-staging.onrender.com` in staging).
- `VITE_COGNITO_USER_POOL_ID` — AWS Cognito user pool ID used by the frontend.
- `VITE_COGNITO_CLIENT_ID` — AWS Cognito app client ID used by the frontend.
- `VITE_AWS_REGION` — Cognito region (currently `eu-north-1`).
- `VITE_SENTRY_DSN` — Sentry DSN for frontend error monitoring (optional).
- `VITE_DEV_SURFACE` / `VITE_DEV_TENANT_SLUG` — Local-dev overrides for surface routing (see above).

## Branch and Deploy Model

This repo uses a two-track Git flow:

| Branch | Vercel environment | Domains |
|---|---|---|
| `main` | Production | `verbilo.co.uk`, `www.verbilo.co.uk`, `{slug}.verbilo.co.uk` |
| `dev` | Preview (treated as "staging") | `staging.verbilo.co.uk`, `*.staging.verbilo.co.uk` |
| Any other branch | Preview | Auto-assigned `*.vercel.app` URL only |

### Working convention

1. Branch off the latest `dev`: `git fetch && git checkout -b ogme01/ver-N-short-slug origin/dev`.
2. Open a PR targeting `dev`. (The repo's default branch is `dev`, so GitHub picks this for you.)
3. Merge to `dev` → Vercel deploys the staging surface at `https://staging.verbilo.co.uk`.
4. Once staging is sanity-checked, open a **release PR** from `dev` → `main`.
5. Merge to `main` → Vercel promotes to `https://verbilo.co.uk`.

### Vercel environment variables

Vercel scopes env vars by environment. Currently:

- `VITE_API_BASE`
  - **Production**: `https://verbilo-backend.onrender.com`
  - **Preview**: `https://verbilo-backend-staging.onrender.com`
- `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_AWS_REGION` — shared between Production and Preview (single Cognito pool for now; revisit when we onboard the first paying tenant).

### Promoting `dev` → `main`

```
git fetch
git checkout main
git pull --ff-only
git merge --no-ff origin/dev
git push origin main
```

…or open `https://github.com/verbilo-hq/verbilo-frontend/compare/main...dev` and merge via PR. The branch-protection rules on `main` require a PR, an approving review, and resolved conversations.

### Branch protection summary

- `main`: PR required, 1 approval, dismiss stale reviews, resolved conversations, no force-push, no deletion.
- `dev`: no force-push, no deletion (lighter rules so feature PRs can keep landing fast).

## Tech Stack (canonical)

| Layer | Service |
|---|---|
| Source / CI | GitHub (`verbilo-hq/verbilo-frontend`) |
| Frontend host | Vercel |
| Backend | Render (NestJS, separate repo) |
| Database | Neon PostgreSQL (backend only) |
| Auth | AWS Cognito (region `eu-north-1`) |
| DNS | AWS Route 53 (planned). Records currently live at the IONOS registrar; Route 53 migration is pending. |
| Alerting / errors | Sentry (wired in `src/instrument.js`; no-op when `VITE_SENTRY_DSN` is unset). |

## DNS

DNS records currently live at the **IONOS** registrar for `verbilo.co.uk`. The intended target is **AWS Route 53** — migration is queued separately.

Production records:
- `A @` → `216.198.79.1` (Vercel anycast)
- `CNAME www` → `39bd255adbcb8100.vercel-dns-017.com`

Staging records (VER-40):
- `CNAME staging` → `39bd255adbcb8100.vercel-dns-017.com`
- `CNAME *.staging` → `39bd255adbcb8100.vercel-dns-017.com`

A wildcard `CNAME *` for production tenant subdomains is added as part of VER-5.

## Operations

Living runbook — read this before touching production.

### Local dev from scratch

1. `git clone git@github.com:verbilo-hq/verbilo-frontend.git && cd verbilo-frontend`
2. `npm install`
3. `cp .env.example .env.local` — fill in the variables (see [Environment Variables](#environment-variables)). The Cognito pool ID + client ID are shared with the backend; pull them from the backend's `.env`.
4. `npm run dev` — Vite at `http://localhost:5173`.
5. Verify the public landing renders, then exercise other surfaces with `?surface=admin` or `?surface=tenant&slug=<your-tenant>` (or via `VITE_DEV_SURFACE` in `.env.local`).
6. To exercise a logged-in tenant flow, you'll need a backend (Render staging is fine for `VITE_API_BASE`) and a Cognito user (see the backend README's *Seeding a Cognito user* section).

### Where to find logs

| Surface | Where | Notes |
|---|---|---|
| Vercel build logs | Vercel dashboard → `verbilo-frontend` → *Deployments* → click a deploy → *Build Logs* | All build output. Failed builds are also surfaced as PR check failures. |
| Vercel runtime | Vercel dashboard → *Functions / Edge* tab | We're fully static + SPA today, so these are usually empty. Vercel serves `index.html` + assets directly. |
| Frontend errors | Sentry → project `verbilo-frontend` | Source-mapped stack traces. Requires `VITE_SENTRY_DSN` in Vercel env per environment. |
| Console / network (live) | Open the deployed URL in Chrome, DevTools → *Network* + *Console* | First stop for "the page is broken in prod but not local". |
| Backend API responses | Render dashboard → `verbilo-backend(-staging)` → *Logs* | Frontend errors that look like 4xx/5xx — check the backend log line with the same `x-request-id` (set by `RequestLoggerMiddleware`). |

### Rolling back a Vercel deploy

Vercel keeps every production deploy. Two paths:

1. **Promote an older deploy** — Vercel dashboard → *Deployments* → find the last known-good deploy → `⋯` menu → *Promote to Production*. Instant; serves the existing build with no rebuild.
2. **Revert the PR on GitHub** — `gh pr revert <num>` → merge to `main`. Bakes the rollback into git history. Preferred when the bad change is more than a few hours old or you want a paper trail.

CSP headers are set in `vercel.json` at deploy time — if a rollback restores an older CSP that breaks the live app, promote forward instead of back.

### CSP and headers

`vercel.json` ships a strict CSP plus the usual safe-by-default headers (X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy minimal, HSTS preload, COOP same-origin). When adding a third-party endpoint that the frontend needs to call (or a script/style host), the `connect-src` / `script-src` / `style-src` directives in `vercel.json` need updating in the same PR. Test in Preview before promoting.

### Promoting `dev` → `main`

See the [Promoting `dev` → `main`](#promoting-dev--main) section above. The CI checks gate the merge; on green, Vercel auto-promotes.

### Contacts and ownership

The frontend's external dependencies are documented in the backend README's *Operations → Contacts and ownership* table. For frontend-specific issues:

- Vercel access / billing / domains — Owen.
- Cognito tenant pool — Owen (shared resource; both repos talk to the same pool).
- Sentry frontend project — Owen.

When the live site is misbehaving: screenshot the console + network tab, grab the `x-request-id` from a failing API call, and post both to the team chat with a link to the Vercel deployment ID.
