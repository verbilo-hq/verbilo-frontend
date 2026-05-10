import {
  staffFixture, practicesFixture, practiceAddressesFixture,
} from "./fixtures/staff.fixture";
import { simulateLatency } from "./delay";
// import { fetchJson } from "./http";

let store = [...staffFixture];

export async function listStaff() {
  await simulateLatency();
  return [...store];
  // return fetchJson("/staff");
}

export async function createStaff(data) {
  await simulateLatency();
  const id = data.id ?? (Math.max(0, ...store.map((s) => s.id)) + 1);
  const created = { ...data, id };
  store = [...store, created];
  return created;
  // return fetchJson("/staff", { method: "POST", body: data });
}

export async function updateStaff(id, patch) {
  await simulateLatency();
  store = store.map((s) => (s.id === id ? { ...s, ...patch } : s));
  return store.find((s) => s.id === id);
  // return fetchJson(`/staff/${id}`, { method: "PATCH", body: patch });
}

export async function deleteStaff(id) {
  await simulateLatency();
  store = store.filter((s) => s.id !== id);
  // await fetchJson(`/staff/${id}`, { method: "DELETE" });
}

export async function listPractices() {
  await simulateLatency();
  return [...practicesFixture];
  // return fetchJson("/practices");
}

export async function getPracticeAddress(practice) {
  await simulateLatency();
  return practiceAddressesFixture[practice] ?? null;
  // return fetchJson(`/practices/${encodeURIComponent(practice)}`);
}
