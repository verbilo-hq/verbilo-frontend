# Verbilo frontend

React 18 and Vite frontend for Verbilo. The application uses AWS Cognito in
production and the sibling backend's mock Cognito service during local
development.

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

Start the backend first with `npm run dev` from `../verbilo-backend`; it provides
PostgreSQL, the API on port 3000, and mock Cognito on port 9229.

## Build

```bash
npm run test:access
npm run build
npm test
npm run preview
```

`test:access` verifies the shared organisation-role navigation/deep-link
contract, including fail-closed handling for unknown staff roles.

The production build must be supplied with the real API and Cognito values. Do
not use the local mock pool ID or mock Cognito URL in production.

## Environment variables

- `VITE_API_BASE` — backend API base URL.
- `VITE_COGNITO_USER_POOL_ID` — Cognito user pool ID.
- `VITE_COGNITO_CLIENT_ID` — Cognito app client ID.
- `VITE_AWS_REGION` — Cognito AWS region.
- `VITE_MOCK_COGNITO_URL` — optional local mock issuer URL; development only.
- `VITE_MOCK_LATENCY` — optional artificial service latency in milliseconds.

See `../HANDOVER.md` for the remaining local-storage-to-production swap seams.
