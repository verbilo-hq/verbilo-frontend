// Tests for src/lib/sector.js — sector-aware UI helpers (VER-47).

import { test } from "node:test";
import assert from "node:assert/strict";
import { sectorIcon, sectorLabel, roleLabel, SECTORS } from "./sector.js";

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
