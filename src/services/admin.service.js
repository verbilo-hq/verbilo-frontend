import { adminSectionsFixture, adminDocsFixture } from "./fixtures/admin.fixture";
import { simulateLatency } from "./delay";
// import { fetchJson } from "./http";

let docsStore = [...adminDocsFixture];

export async function listAdminSections() {
  await simulateLatency();
  return [...adminSectionsFixture];
  // return fetchJson("/admin/sections");
}

export async function listAdminDocs() {
  await simulateLatency();
  return [...docsStore];
  // return fetchJson("/admin/docs");
}

export async function createAdminDoc(doc) {
  await simulateLatency();
  const id = Math.max(0, ...docsStore.map((d) => d.id)) + 1;
  const created = { ...doc, id };
  docsStore = [created, ...docsStore];
  return created;
  // return fetchJson("/admin/docs", { method: "POST", body: doc });
}

export async function updateAdminDoc(id, patch) {
  await simulateLatency();
  docsStore = docsStore.map((d) => (d.id === id ? { ...d, ...patch } : d));
  return docsStore.find((d) => d.id === id);
  // return fetchJson(`/admin/docs/${id}`, { method: "PATCH", body: patch });
}

export async function deleteAdminDoc(id) {
  await simulateLatency();
  docsStore = docsStore.filter((d) => d.id !== id);
  // await fetchJson(`/admin/docs/${id}`, { method: "DELETE" });
}
