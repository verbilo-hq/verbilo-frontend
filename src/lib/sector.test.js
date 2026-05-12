// Tests for src/lib/sector.js — sector-aware UI helpers (VER-47).

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sectorIcon,
  sectorLabel,
  roleLabel,
  userRoleLabel,
  SECTORS,
  SECTOR_OPTIONS,
} from "./sector.js";

// ---------- SECTORS const ----------

test("SECTORS covers the canonical seven values", () => {
  assert.deepEqual([...SECTORS].sort(), [
    "dental",
    "gp",
    "healthcare",
    "optometry",
    "other",
    "physio",
    "vets",
  ]);
});

// ---------- SECTOR_OPTIONS const ----------

test("SECTOR_OPTIONS has one entry per canonical sector with id + label", () => {
  assert.equal(SECTOR_OPTIONS.length, SECTORS.length);
  for (const opt of SECTOR_OPTIONS) {
    assert.ok(SECTORS.includes(opt.id), `unexpected sector id: ${opt.id}`);
    assert.equal(typeof opt.label, "string");
    assert.ok(opt.label.length > 0, `empty label for ${opt.id}`);
  }
  // Every canonical sector has a matching option (no missing ids).
  const ids = new Set(SECTOR_OPTIONS.map((o) => o.id));
  for (const s of SECTORS) {
    assert.ok(ids.has(s), `missing option for canonical sector: ${s}`);
  }
});

test("SECTOR_OPTIONS is frozen (immutable canonical list)", () => {
  assert.equal(Object.isFrozen(SECTOR_OPTIONS), true);
});

// ---------- sectorIcon ----------

test("sectorIcon returns sector-specific glyphs", () => {
  assert.equal(sectorIcon("dental"), "tooth");
  assert.equal(sectorIcon("gp"), "shield");
  assert.equal(sectorIcon("vets"), "heart");
  assert.equal(sectorIcon("physio"), "zap");
  assert.equal(sectorIcon("optometry"), "eye");
});

test("sectorIcon falls back to a generic glyph for unknown / fallback sectors", () => {
  assert.equal(sectorIcon("healthcare"), "heart");
  assert.equal(sectorIcon("other"), "heart");
  assert.equal(sectorIcon(""), "heart");
  assert.equal(sectorIcon(undefined), "heart");
  assert.equal(sectorIcon("not-a-real-sector"), "heart");
});

// ---------- sectorLabel ----------

test("sectorLabel returns human-readable labels for each known sector", () => {
  assert.equal(sectorLabel("dental"), "Dental Practice");
  assert.equal(sectorLabel("gp"), "GP Practice");
  assert.equal(sectorLabel("vets"), "Veterinary Practice");
  assert.equal(sectorLabel("physio"), "Physiotherapy Practice");
  assert.equal(sectorLabel("optometry"), "Optometry Practice");
  assert.equal(sectorLabel("other"), "Healthcare Practice");
  assert.equal(sectorLabel("healthcare"), "Healthcare Operator");
});

test("sectorLabel falls back to the generic 'Healthcare Operator' label", () => {
  assert.equal(sectorLabel(undefined), "Healthcare Operator");
  assert.equal(sectorLabel(""), "Healthcare Operator");
  assert.equal(sectorLabel("unrecognised"), "Healthcare Operator");
});

// ---------- roleLabel ----------

test("roleLabel maps generic roles to sector-specific vocabulary", () => {
  assert.equal(roleLabel("clinician", "dental"), "Dentist");
  assert.equal(roleLabel("clinician", "gp"), "GP");
  assert.equal(roleLabel("clinician", "vets"), "Veterinarian");
  assert.equal(roleLabel("clinician", "physio"), "Physiotherapist");
  assert.equal(roleLabel("clinician", "optometry"), "Optometrist");
});

test("roleLabel renders clinical_support per sector", () => {
  assert.equal(roleLabel("clinical_support", "dental"), "Dental Nurse");
  assert.equal(roleLabel("clinical_support", "gp"), "Practice Nurse");
  assert.equal(roleLabel("clinical_support", "vets"), "Veterinary Nurse");
});

test("roleLabel returns the generic label when sector is unknown / absent", () => {
  assert.equal(roleLabel("clinician", undefined), "Clinician");
  assert.equal(roleLabel("clinical_support", ""), "Clinical Support");
  assert.equal(roleLabel("manager", "made-up"), "Practice Manager");
});

test("roleLabel returns the clinicalSpecialty override when set", () => {
  // Override wins even for known sectors — useful for "Senior Hygienist",
  // "Locum Dentist" etc. that don't map cleanly to a single enum value.
  assert.equal(
    roleLabel("clinician", "dental", "Senior Endodontist"),
    "Senior Endodontist",
  );
  assert.equal(
    roleLabel("clinical_support", "vets", "Anaesthesia Specialist"),
    "Anaesthesia Specialist",
  );
});

test("roleLabel returns the raw role value when neither sector mapping nor override applies", () => {
  // An unknown enum member just echoes back.
  assert.equal(roleLabel("custom_role", "dental"), "custom_role");
  assert.equal(roleLabel(undefined, "dental"), "");
  assert.equal(roleLabel("", "dental"), "");
});

// ---------- userRoleLabel (VER-60) ----------

test("userRoleLabel returns sector-agnostic labels for platform roles", () => {
  // Verbilo internal staff aren't tied to a customer sector — labels
  // should be identical regardless of the sector arg (including undefined).
  for (const sector of ["dental", "vets", "optometry", "other", "", undefined]) {
    assert.equal(userRoleLabel("verbilo_super_admin", sector), "Verbilo Admin");
    assert.equal(userRoleLabel("verbilo_support",     sector), "Verbilo Support");
  }
});

test("userRoleLabel renders practice_manager with the sector's customer vocabulary", () => {
  assert.equal(userRoleLabel("practice_manager", "dental"),    "Practice Manager");
  assert.equal(userRoleLabel("practice_manager", "gp"),        "Practice Manager");
  assert.equal(userRoleLabel("practice_manager", "vets"),      "Practice Manager");
  assert.equal(userRoleLabel("practice_manager", "physio"),    "Practice Manager");
  assert.equal(userRoleLabel("practice_manager", "optometry"), "Branch Manager");
  // Generic fallback for "other" / "healthcare" / unknown sector.
  assert.equal(userRoleLabel("practice_manager", "other"),      "Site Manager");
  assert.equal(userRoleLabel("practice_manager", "healthcare"), "Site Manager");
  assert.equal(userRoleLabel("practice_manager", "unknown"),    "Site Manager");
});

test("userRoleLabel renders area_manager with the sector vocabulary", () => {
  assert.equal(userRoleLabel("area_manager", "dental"), "Area Manager");
  assert.equal(userRoleLabel("area_manager", "vets"),   "Regional Manager");
  assert.equal(userRoleLabel("area_manager", "other"),  "Area Manager");
});

test("userRoleLabel returns common labels for company_admin / company_owner / employee across all sectors", () => {
  for (const sector of ["dental", "vets", "optometry", "other"]) {
    assert.equal(userRoleLabel("company_admin", sector), "Company Admin");
    assert.equal(userRoleLabel("company_owner", sector), "Company Owner");
    assert.equal(userRoleLabel("employee",      sector), "Employee");
  }
});

test("userRoleLabel falls back to the raw role for unknown roles", () => {
  // Defensive: a hand-edited or legacy role just echoes back rather
  // than rendering as undefined / empty.
  assert.equal(userRoleLabel("some_legacy_role", "dental"), "some_legacy_role");
});

test("userRoleLabel returns empty string for null/undefined/empty role", () => {
  assert.equal(userRoleLabel(null,      "dental"), "");
  assert.equal(userRoleLabel(undefined, "dental"), "");
  assert.equal(userRoleLabel("",        "dental"), "");
});
