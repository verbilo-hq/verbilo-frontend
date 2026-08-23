# Audit run data path

`AuditRunPage.jsx` is the single audit-run entry point used by
`GovernanceShell.jsx`.

The page is API-first: it uses `/audit-sessions` for real audit sessions and
therefore participates in PostgreSQL RLS, immutable sign-off, and the automatic
CPD-draft trigger. Before starting a run it calls
`/audit-sessions/start-context`, maps the browser's stable display key onto the
permitted tenant site/schedule, and sends only the returned UUIDs to the mutation
endpoint. In local development it can still fall back to the browser-backed
governance store when the API is unavailable. That code path is development-only
and is removed from the production bundle; production shows the API error.

## Production prerequisites

Before enabling a deployment:

1. Apply all backend migrations with `prisma migrate deploy`.
2. Generate the Prisma client during the backend build/install.
3. Load the audit templates with the backend's
   `npm run seed:audit-templates` operation where required.
4. Populate each production site's tenant-unique `referenceKey` while the
   governance catalogue still uses browser display keys, or replace the catalogue
   with API site/schedule reads. The runner always persists with API UUIDs.
5. Verify tenant and role behaviour against the staging database.

The template seed imports the catalogue from the sibling frontend repository;
plan that dependency in the release process or package the catalogue into a
dedicated deployment artifact before production cutover.

Do not add a second wrapper that silently chooses a different persistence model.
Keep any future backend/local selection inside this page and gated to development.
