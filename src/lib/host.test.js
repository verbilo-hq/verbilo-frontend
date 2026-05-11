// Tests for src/lib/host.js — run with `npm test` (uses Node's built-in
// test runner, so no devDependencies needed).

import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveSurface, isValidSlug, isReservedSubdomain, tenantUrl } from "./host.js";

const surface = (hostname, search = "", env = {}) =>
  resolveSurface({ hostname, search, env });

// ---------- Production surfaces ----------

test("apex verbilo.co.uk → public/production", () => {
  assert.deepEqual(surface("verbilo.co.uk"), {
    surface: "public",
    slug: null,
    environment: "production",
  });
});

test("www.verbilo.co.uk → public/production", () => {
  assert.deepEqual(surface("www.verbilo.co.uk"), {
    surface: "public",
    slug: null,
    environment: "production",
  });
});

test("admin.verbilo.co.uk → admin/production", () => {
  assert.deepEqual(surface("admin.verbilo.co.uk"), {
    surface: "admin",
    slug: null,
    environment: "production",
  });
});

test("{slug}.verbilo.co.uk → tenant/production", () => {
  assert.deepEqual(surface("smileco.verbilo.co.uk"), {
    surface: "tenant",
    slug: "smileco",
    environment: "production",
  });
});

test("reserved sub on prod (e.g. api.verbilo.co.uk) → public/production", () => {
  assert.deepEqual(surface("api.verbilo.co.uk"), {
    surface: "public",
    slug: null,
    environment: "production",
  });
});

test("invalid slug on prod (too short) → public/production", () => {
  assert.deepEqual(surface("ab.verbilo.co.uk"), {
    surface: "public",
    slug: null,
    environment: "production",
  });
});

test("nested prod sub (x.y.verbilo.co.uk) → public/production", () => {
  assert.deepEqual(surface("x.y.verbilo.co.uk"), {
    surface: "public",
    slug: null,
    environment: "production",
  });
});

// ---------- Staging surfaces ----------

test("staging.verbilo.co.uk → public/staging", () => {
  assert.deepEqual(surface("staging.verbilo.co.uk"), {
    surface: "public",
    slug: null,
    environment: "staging",
  });
});

test("admin.staging.verbilo.co.uk → admin/staging", () => {
  assert.deepEqual(surface("admin.staging.verbilo.co.uk"), {
    surface: "admin",
    slug: null,
    environment: "staging",
  });
});

test("{slug}.staging.verbilo.co.uk → tenant/staging", () => {
  assert.deepEqual(surface("acme.staging.verbilo.co.uk"), {
    surface: "tenant",
    slug: "acme",
    environment: "staging",
  });
});

test("www.staging.verbilo.co.uk → public/staging", () => {
  assert.deepEqual(surface("www.staging.verbilo.co.uk"), {
    surface: "public",
    slug: null,
    environment: "staging",
  });
});

test("reserved sub on staging (api.staging.verbilo.co.uk) → public/staging", () => {
  assert.deepEqual(surface("api.staging.verbilo.co.uk"), {
    surface: "public",
    slug: null,
    environment: "staging",
  });
});

test("nested under staging (x.y.staging.verbilo.co.uk) → public/staging", () => {
  assert.deepEqual(surface("x.y.staging.verbilo.co.uk"), {
    surface: "public",
    slug: null,
    environment: "staging",
  });
});

// ---------- Dev override / unrecognised hosts ----------

test("localhost with no override → public/development", () => {
  assert.deepEqual(surface("localhost"), {
    surface: "public",
    slug: null,
    environment: "development",
  });
});

test("?surface=admin override → admin/development", () => {
  assert.deepEqual(surface("localhost", "?surface=admin"), {
    surface: "admin",
    slug: null,
    environment: "development",
  });
});

test("?surface=tenant&slug=acme → tenant/development", () => {
  assert.deepEqual(surface("localhost", "?surface=tenant&slug=acme"), {
    surface: "tenant",
    slug: "acme",
    environment: "development",
  });
});

test("env override (VITE_DEV_SURFACE=tenant + slug) wins on unknown host", () => {
  assert.deepEqual(
    surface("preview-abc123.vercel.app", "", {
      VITE_DEV_SURFACE: "tenant",
      VITE_DEV_TENANT_SLUG: "acme",
    }),
    { surface: "tenant", slug: "acme", environment: "development" },
  );
});

test("dev override does NOT override a recognised prod host", () => {
  // verbilo.co.uk should stay public/production even if ?surface=admin set.
  assert.deepEqual(surface("verbilo.co.uk", "?surface=admin"), {
    surface: "public",
    slug: null,
    environment: "production",
  });
});

// ---------- Helpers ----------

test("isValidSlug accepts kebab-case 3–32 chars", () => {
  assert.equal(isValidSlug("acme"), true);
  assert.equal(isValidSlug("smile-co"), true);
  assert.equal(isValidSlug("a1b2c3"), true);
  assert.equal(isValidSlug("ab"), false); // too short
  assert.equal(isValidSlug("-acme"), false); // leading dash
  assert.equal(isValidSlug("acme-"), false); // trailing dash
  assert.equal(isValidSlug("ACME"), false); // upper case
  assert.equal(isValidSlug("12345"), false); // pure numeric
  assert.equal(isValidSlug("a".repeat(33)), false); // too long
});

test("isReservedSubdomain", () => {
  assert.equal(isReservedSubdomain("admin"), true);
  assert.equal(isReservedSubdomain("staging"), true);
  assert.equal(isReservedSubdomain("acme"), false);
});

test("tenantUrl builds production by default", () => {
  assert.equal(tenantUrl("acme"), "https://acme.verbilo.co.uk");
});

test("tenantUrl builds staging when asked", () => {
  assert.equal(tenantUrl("acme", "staging"), "https://acme.staging.verbilo.co.uk");
});
