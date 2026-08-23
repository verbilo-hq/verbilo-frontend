import {
  labContactsFixture,
  digitalGuidesFixture,
  labCasesFixture,
} from "./fixtures/lab.fixture";
import { simulateLatency } from "./delay";
// import { fetchJson } from "./http";

let casesStore = [...labCasesFixture];

export async function listLabContacts() {
  await simulateLatency();
  return [...labContactsFixture];
  // return fetchJson("/lab/contacts");
}

export async function listDigitalGuides() {
  await simulateLatency();
  return [...digitalGuidesFixture];
  // return fetchJson("/lab/guides");
}

export async function listLabCases() {
  await simulateLatency();
  return [...casesStore];
  // return fetchJson("/lab/cases");
}

export async function createLabCase(data) {
  await simulateLatency();
  const id = Math.max(0, ...casesStore.map((c) => c.id)) + 1;
  const created = { ...data, id };
  casesStore = [...casesStore, created];
  return created;
  // return fetchJson("/lab/cases", { method: "POST", body: data });
}

export async function updateLabCase(id, patch) {
  await simulateLatency();
  casesStore = casesStore.map((c) => (c.id === id ? { ...c, ...patch } : c));
  return casesStore.find((c) => c.id === id);
  // return fetchJson(`/lab/cases/${id}`, { method: "PATCH", body: patch });
}

export async function deleteLabCase(id) {
  await simulateLatency();
  casesStore = casesStore.filter((c) => c.id !== id);
  // await fetchJson(`/lab/cases/${id}`, { method: "DELETE" });
}
