// ════════════════════════════════════════════════════════════════════════════
// SECURITY NOTE
// ────────────────────────────────────────────────────────────────────────────
// This file ships demo credentials inside the client bundle for local
// development only. No production deployment may include this file.
//
// Real authentication is performed by services/auth.service.js — in dev it
// validates against these accounts and mints a mock-Cognito JWT; in production
// it round-trips through AWS Cognito and the rich profile comes from
// `/users/me`. At that point this fixture import should be removed.
//
// CI should fail if this file is present in dist/ on a production build.
// ════════════════════════════════════════════════════════════════════════════

// The canonical login set is the HR Hub / Staff Directory org model: 18 demo
// users spanning the full role hierarchy (owner → exec → area → practice →
// team → individual), each carrying role, manager chain, scope and HR profile.
// See auth/demoUsers.js. Demo passwords match the username (o/o, m/m, …).
export { demoUsers as accountsFixture } from "../../auth/demoUsers.js";
