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
| Alerting / errors | Sentry (planned — projects exist but the SDK isn't initialised yet; see VER-20 / VER-35) |

## DNS

DNS records currently live at the **IONOS** registrar for `verbilo.co.uk`. The intended target is **AWS Route 53** — migration is queued separately.

Production records:
- `A @` → `216.198.79.1` (Vercel anycast)
- `CNAME www` → `39bd255adbcb8100.vercel-dns-017.com`

Staging records (VER-40):
- `CNAME staging` → `39bd255adbcb8100.vercel-dns-017.com`
- `CNAME *.staging` → `39bd255adbcb8100.vercel-dns-017.com`

A wildcard `CNAME *` for production tenant subdomains is added as part of VER-5.
