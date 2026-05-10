// ════════════════════════════════════════════════════════════════════════════
// SECURITY NOTE
// ────────────────────────────────────────────────────────────────────────────
// This file ships demo credentials inside the client bundle for local
// development only. No production deployment may include this file.
//
// Real authentication is performed by services/auth.service.js via
// fetchJson("/auth/login") once a backend is available. At that point the
// fixture import in auth.service.js should be removed and login should round-
// trip to the server.
//
// CI should fail if this file is present in dist/ on a production build.
// ════════════════════════════════════════════════════════════════════════════

export const accountsFixture = [
  { username: "admin",     password: "Admin123!",  role: "manager",      staffId: 2, isTempPassword: false, displayName: "Mark Thompson"      },
  { username: "s.jenkins", password: "Welcome1",   role: "dentist",      staffId: 1, isTempPassword: true,  displayName: "Dr. Sarah Jenkins" },
  { username: "e.rossi",   password: "Welcome1",   role: "hygienist",    staffId: 3, isTempPassword: true,  displayName: "Elena Rossi"        },
  { username: "l.vance",   password: "Welcome1",   role: "dentist",      staffId: 4, isTempPassword: true,  displayName: "Leo Vance"          },
  { username: "j.wu",      password: "Welcome1",   role: "dentist",      staffId: 5, isTempPassword: true,  displayName: "Jessica Wu"         },
  { username: "a.clarke",  password: "Welcome1",   role: "nurse",        staffId: 6, isTempPassword: true,  displayName: "Amy Clarke"         },
  { username: "j.hart",    password: "Welcome1",   role: "hygienist",    staffId: 7, isTempPassword: true,  displayName: "James Hart"         },
  { username: "s.brown",   password: "Welcome1",   role: "receptionist", staffId: 8, isTempPassword: true,  displayName: "Sophie Brown"       },
];
