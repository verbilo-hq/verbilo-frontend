import assert from "node:assert/strict";
import test from "node:test";

import { canViewPage } from "./devRole.js";

const visiblePages = (role, orgRole) => [
  "dashboard", "manager", "management", "lab", "marketing", "clinical",
  "governance", "clinical_protocols", "logbooks", "audit_evidence", "cqc",
  "staff", "hr", "training", "supervision_hub", "cpd", "admin",
].filter((page) => canViewPage(role, page, orgRole));

test("reception roles see operational tools but not clinical or compliance management", () => {
  assert.deepEqual(visiblePages("staff", "receptionist"), [
    "dashboard", "lab", "marketing", "governance", "logbooks", "staff", "hr",
    "training", "cpd",
  ]);
});

test("clinical staff see clinical workspaces but not management compliance hubs", () => {
  assert.deepEqual(visiblePages("staff", "dentalNurse"), [
    "dashboard", "lab", "marketing", "clinical", "governance",
    "clinical_protocols", "logbooks", "staff", "hr", "training", "cpd",
  ]);
});

test("lead nurses receive the additional audit and CQC oversight surfaces", () => {
  assert.equal(canViewPage("staff", "audit_evidence", "leadNurse"), true);
  assert.equal(canViewPage("staff", "cqc", "leadNurse"), true);
  assert.equal(canViewPage("staff", "admin", "leadNurse"), false);
});

test("frontline role aliases stay within their intended profile", () => {
  for (const orgRole of [
    "traineeDentalNurse", "associateDentist", "foundationDentist",
  ]) {
    assert.equal(canViewPage("staff", "clinical_protocols", orgRole), true);
    assert.equal(canViewPage("staff", "cqc", orgRole), false);
  }
  for (const orgRole of [
    "frontOfHouseLead", "traineeReceptionist",
  ]) {
    assert.equal(canViewPage("staff", "logbooks", orgRole), true);
    assert.equal(canViewPage("staff", "clinical", orgRole), false);
  }
  for (const orgRole of [
    "treatmentCoordinator", "juniorTreatmentCoordinator",
  ]) {
    assert.equal(canViewPage("staff", "clinical", orgRole), true);
    assert.equal(canViewPage("staff", "clinical_protocols", orgRole), false);
  }
  for (const orgRole of ["employee", "traineeEmployee", "supportAssistant"]) {
    assert.equal(canViewPage("staff", "governance", orgRole), true);
    assert.equal(canViewPage("staff", "logbooks", orgRole), false);
  }
});

test("unknown staff roles fail closed to personal and published-content pages", () => {
  assert.deepEqual(visiblePages("staff", "unexpectedRole"), [
    "dashboard", "marketing", "governance", "staff", "hr", "training", "cpd",
  ]);
});

test("manager capability routes remain unchanged", () => {
  assert.equal(canViewPage("practice_manager", "manager", "practiceManager"), true);
  assert.equal(canViewPage("practice_manager", "management", "practiceManager"), false);
  assert.equal(canViewPage("area_manager", "management", "areaManager"), true);
  assert.equal(canViewPage("group_admin", "admin", "companyOwner"), true);
});
