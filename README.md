# Verbilo Frontend

## Overview

React/Vite frontend for Verbilo.

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

## Environment Variables

- `VITE_API_URL` - Base URL for the Verbilo backend API.
- `VITE_COGNITO_USER_POOL_ID` - AWS Cognito user pool ID used by the frontend.
- `VITE_COGNITO_CLIENT_ID` - AWS Cognito app client ID used by the frontend.
- `VITE_SENTRY_DSN` - Sentry DSN for frontend error monitoring.
