/**
 * Generic localStorage-backed table store, scoped per tenant.
 *
 * Each entity (sites, profiles, equipment, documents, …) is persisted as a
 * JSON array under a deterministic key. This mirrors how the Prisma backend
 * will store the same rows, so swapping to fetchJson is a one-line change
 * per service when the NestJS controllers come online.
 *
 * Every row carries a `tenantId` so the local store can later be cleared by
 * tenant without affecting demo data for other groups.
 */

const PREFIX = "verbilo.governance";

const key = (tenantId, table) => `${PREFIX}.${tenantId}.${table}`;

// In-memory buffer used during Store.batch(). When non-null, reads consult
// the buffer first (no JSON.parse) and writes update the buffer (no
// JSON.stringify or localStorage write). On batch exit each touched table
// is serialised exactly once. Without this, the seed routine pays
// O(n²) JSON cost — 100 documents = 5,050 row-serialisations of growing
// arrays, which on a real device adds up to 5-6 seconds.
let batchBuffer = null;

function read(tenantId, table) {
  const storageKey = key(tenantId, table);
  if (batchBuffer && batchBuffer.has(storageKey)) return batchBuffer.get(storageKey);
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(tenantId, table, rows) {
  const storageKey = key(tenantId, table);
  if (batchBuffer) { batchBuffer.set(storageKey, rows); return; }
  try {
    localStorage.setItem(storageKey, JSON.stringify(rows));
  } catch { /* noop */ }
}

export function batch(fn) {
  if (batchBuffer) return fn();
  batchBuffer = new Map();
  try { return fn(); }
  finally {
    const toFlush = batchBuffer;
    batchBuffer = null;
    for (const [storageKey, rows] of toFlush) {
      try { localStorage.setItem(storageKey, JSON.stringify(rows)); } catch { /* noop */ }
    }
  }
}

export function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // RFC4122-ish fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const Store = {
  list(tenantId, table, predicate) {
    const rows = read(tenantId, table);
    return predicate ? rows.filter(predicate) : rows;
  },
  get(tenantId, table, id) {
    return read(tenantId, table).find((r) => r.id === id) ?? null;
  },
  insert(tenantId, table, row) {
    const rows = read(tenantId, table);
    // Idempotent when an explicit id is provided: if a row with that id
    // already exists, return it without inserting a duplicate. Protects
    // against accidental re-seeding (which previously left duplicate rows
    // for sites / users / profiles etc.).
    if (row.id) {
      const existing = rows.find((r) => r.id === row.id);
      if (existing) return existing;
    }
    const fresh = { id: row.id ?? uuid(), createdAt: new Date().toISOString(), ...row, tenantId };
    rows.push(fresh);
    write(tenantId, table, rows);
    return fresh;
  },
  update(tenantId, table, id, patch) {
    let updated = null;
    const next = read(tenantId, table).map((r) => {
      if (r.id !== id) return r;
      updated = { ...r, ...patch, updatedAt: new Date().toISOString() };
      return updated;
    });
    write(tenantId, table, next);
    return updated;
  },
  upsert(tenantId, table, predicate, fallbackRow) {
    const existing = read(tenantId, table).find(predicate);
    if (existing) return existing;
    return Store.insert(tenantId, table, fallbackRow);
  },
  replaceWhere(tenantId, table, predicate, patch) {
    const next = read(tenantId, table).map((r) => (predicate(r) ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r));
    write(tenantId, table, next);
    return next.filter(predicate);
  },
  remove(tenantId, table, id) {
    write(tenantId, table, read(tenantId, table).filter((r) => r.id !== id));
  },
  clear(tenantId, table) {
    write(tenantId, table, []);
  },
  clearAllForTenant(tenantId) {
    if (typeof localStorage === "undefined") return;
    const prefix = `${PREFIX}.${tenantId}.`;
    const toDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) toDelete.push(k);
    }
    for (const k of toDelete) localStorage.removeItem(k);
  },
};

export const TABLES = Object.freeze({
  users:                "users",
  sites:                "sites",
  packs:                "pack_instances",
  site_profiles:        "site_profiles",
  equipment:            "equipment_records",
  equipment_assets:     "equipment_assets",
  documents:            "governance_documents",
  document_versions:    "document_versions",
  acknowledgements:     "staff_acknowledgements",
  evidence:             "evidence_records",
  audits:               "audit_schedules",
  /* One row per completed audit execution. Holds the auditor, template +
   * version, schedule it satisfied (nullable for ad-hoc runs), summary
   * tally, and the started/completed timestamps for SLA tracking. */
  audit_runs:           "audit_runs",
  /* Per-question response — denormalised so each q gets a queryable row.
   * Holds status (pass/fail/na), action-required note for Fail rows, and
   * a photo count placeholder (binary blobs land in a separate store). */
  audit_responses:      "audit_responses",
  audit_trail:          "audit_trail",
  /* Per-site uploaded spatial files (decon layout, radiation shielding
   * schematic). One row per (siteId × slotKey). Holds metadata only —
   * binary blobs sit in IndexedDB via the same client-store pattern as
   * `evidence`. Rendered as named dropzones on SiteProfile. */
  site_maps:            "site_maps",
  operator_entitlements: "operator_entitlements",
  protocol_signatures:  "protocol_signatures",
  practice_branding:    "practice_branding",
  org_settings:         "org_settings",
});
