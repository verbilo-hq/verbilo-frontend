import {
  snapshotActionsFixture,
  leaveRequestsFixture,
  gdcRecordsFixture,
  trainingRecordsFixture,
  managerIncidentsFixture,
  cqcSummaryFixture,
  udaTotalFixture,
  udaDentistsFixture,
} from "../fixtures/demo/manager";
import { isDemoMode } from "../lib/mode"; // VER-83: future tenant-mode branches (VER-86+) gate on this; currently unused, fixture imports above are returned unconditionally.
import { simulateLatency } from "./delay";
// import { fetchJson } from "./http";

let leaveStore = [...leaveRequestsFixture];

export async function listSnapshotActions() {
  await simulateLatency();
  return [...snapshotActionsFixture];
  // return fetchJson("/manager/snapshot");
}

export async function listLeaveRequests() {
  await simulateLatency();
  return [...leaveStore];
  // return fetchJson("/manager/leave");
}

export async function updateLeaveStatus(id, status) {
  await simulateLatency();
  leaveStore = leaveStore.map((r) => (r.id === id ? { ...r, status } : r));
  return leaveStore.find((r) => r.id === id);
  // return fetchJson(`/manager/leave/${id}`, { method: "PATCH", body: { status } });
}

export async function listGdcRecords() {
  await simulateLatency();
  return [...gdcRecordsFixture];
  // return fetchJson("/manager/gdc");
}

export async function listTrainingRecords() {
  await simulateLatency();
  return [...trainingRecordsFixture];
  // return fetchJson("/manager/training");
}

export async function listManagerIncidents() {
  await simulateLatency();
  return [...managerIncidentsFixture];
  // return fetchJson("/manager/incidents");
}

export async function getCqcSummary() {
  await simulateLatency();
  return { ...cqcSummaryFixture };
  // return fetchJson("/manager/cqc-summary");
}

export async function getUdaTotal() {
  await simulateLatency();
  return { ...udaTotalFixture };
  // return fetchJson("/manager/uda/total");
}

export async function listUdaDentists() {
  await simulateLatency();
  return [...udaDentistsFixture];
  // return fetchJson("/manager/uda/by-dentist");
}
