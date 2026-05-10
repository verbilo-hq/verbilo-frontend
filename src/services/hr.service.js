import {
  policiesFixture,
  mandatoryTrainingFixture,
  noticesFixture,
  hrQuickLinksFixture,
} from "./fixtures/hr.fixture";
import { simulateLatency } from "./delay";
// import { fetchJson } from "./http";

let policiesStore = [...policiesFixture];

export async function listPolicies() {
  await simulateLatency();
  return [...policiesStore];
  // return fetchJson("/hr/policies");
}

export async function addPolicy(policy) {
  await simulateLatency();
  policiesStore = [policy, ...policiesStore];
  return policy;
  // return fetchJson("/hr/policies", { method: "POST", body: policy });
}

export async function listMandatoryTraining() {
  await simulateLatency();
  return [...mandatoryTrainingFixture];
  // return fetchJson("/hr/training/mandatory");
}

export async function listNotices() {
  await simulateLatency();
  return [...noticesFixture];
  // return fetchJson("/hr/notices");
}

export async function listHrQuickLinks() {
  await simulateLatency();
  return [...hrQuickLinksFixture];
  // return fetchJson("/hr/quick-links");
}

export async function submitLeaveRequest(req) {
  await simulateLatency();
  return { ...req, id: Date.now(), status: "pending" };
  // return fetchJson("/hr/leave", { method: "POST", body: req });
}
