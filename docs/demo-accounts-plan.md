# Demo accounts — provisioning plan

**Status:** proposed · **Owner:** senior dev review
**Why:** the hosted demo needs working logins for ~18 role personas, but no
credential may live in this repository. This document replaces the previous
approach of shipping demo passwords in `src/auth/demoUsers.js`.

## What changed

`src/auth/demoUsers.js` is still the canonical **org roster** — it is imported by
`timeOff.service.js`, `people.js`, `Sidebar.jsx` and `accounts.fixture.js` for
display data, the manager chain, scope and HR profiles. That data stays.

What has been removed is the credential half: `demoPassword()` now returns
`undefined` unconditionally, so no password (and no password *scheme*) is stored
in git. Authentication is delegated entirely to Cognito.

## The three environments

| Environment | Identity source | Credentials |
|---|---|---|
| Local dev | mock-Cognito (`scripts/mock-cognito.ts`) | Developer-local only; never committed |
| Hosted demo | real Cognito user pool | Provisioned in AWS, stored in a password manager |
| Production | real Cognito user pool | Customer-managed |

Local development keeps working because mock-Cognito mints a token for any
`sub` it is asked for — it never needed the fixture passwords to function. If a
developer wants clickable demo logins locally, they supply them via an
untracked local file (see *Local override* below), not via the repository.

## Hosted demo: provisioning steps

### 1. Create the Cognito users

For each persona in the roster, create a Cognito user with a **generated**
password (never `username == password`):

```bash
# one persona; loop over the roster for the rest
aws cognito-idp admin-create-user \
  --user-pool-id "$COGNITO_USER_POOL_ID" \
  --username "olivia.owner@verbilo.co.uk" \
  --user-attributes Name=email,Value="olivia.owner@verbilo.co.uk" Name=email_verified,Value=true \
  --message-action SUPPRESS

aws cognito-idp admin-set-user-password \
  --user-pool-id "$COGNITO_USER_POOL_ID" \
  --username "olivia.owner@verbilo.co.uk" \
  --password "$(openssl rand -base64 24)" \
  --permanent
```

Record each generated password **only** in the team password manager. Capture
the returned Cognito `sub` for the next step.

### 2. Map each `sub` to a `User` row

The backend already models identity and scope: `User` carries `cognitoId`,
`orgRole` and the group/area/site/team/self scope metadata added in migration
`20260715170000_user_org_scope`. Seed one row per persona so the API can derive
role and scope from the JWT alone:

```ts
// prisma/seed-demo-users.ts   (reads an untracked mapping file)
// mapping.json is gitignored: [{ "username": "o", "cognitoSub": "…", "orgRole": "companyOwner", … }]
const mapping = JSON.parse(fs.readFileSync(process.env.DEMO_USER_MAP!, "utf8"));
for (const m of mapping) {
  await prisma.user.upsert({
    where:  { cognitoId: m.cognitoSub },
    update: { orgRole: m.orgRole, scopeType: m.scopeType, scopeIds: m.scopeIds },
    create: {
      cognitoId: m.cognitoSub,
      tenantId:  demoTenantId,
      username:  m.username,
      displayName: m.displayName,
      orgRole:   m.orgRole,
      scopeType: m.scopeType,
      scopeIds:  m.scopeIds,
    },
  });
}
```

Run it once per demo environment:

```bash
DEMO_USER_MAP=/secure/path/mapping.json npx tsx prisma/seed-demo-users.ts
```

The mapping file holds no passwords — only `sub` → role/scope — but it is still
kept out of git because it identifies the demo accounts.

### 3. Point the frontend at the real pool

Set `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID` and `VITE_AWS_REGION`
to the demo pool. With a real pool id (not the `eu-north-1_devmockpool`
placeholder) `auth.service.js` automatically takes the real-Cognito branch and
enriches the session from `/users/me`. No frontend code change is needed.

## Local override (optional, developer machines only)

If a developer wants one-click persona switching locally, add an **untracked**
file and load it only under `import.meta.env.DEV`:

```
src/auth/demoCredentials.local.js     # gitignored, never committed
```

This keeps the convenience without ever putting a credential in the repository.

## Rules

1. No password, and no password *scheme*, in git — including comments and docs.
2. Demo passwords are generated, unique per persona, and rotated if shared
   outside the team.
3. The demo pool is separate from any production pool.
4. If the demo is publicly reachable, treat every persona as public: seed only
   fictional patients/staff, and never real patient data.
5. CI should fail the build if a password literal appears in `dist/`.
