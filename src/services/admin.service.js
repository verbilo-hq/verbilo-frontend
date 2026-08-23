import { adminSectionsFixture, adminDocsFixture } from "./fixtures/admin.fixture";
import { simulateLatency } from "./delay";
import { putFile, deleteFile, downloadFile, formatSize, inferType } from "./clientFileStore";
// import { fetchJson } from "./http";

const LS_KEY = "verbilo.admin.docs_v2";

function loadDocs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to seed */
  }
  const seeded = [...adminDocsFixture];
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(seeded));
  } catch { /* quota or disabled */ }
  return seeded;
}

function saveDocs(docs) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(docs));
  } catch { /* quota or disabled */ }
}

let docsStore = loadDocs();

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

/**
 * Upload a real File to the local IndexedDB store and add a doc record
 * pointing at it. Returns the new doc record (with `fileKey`).
 */
export async function uploadAdminDoc({ file, section, description, uploadedBy }) {
  if (!file) throw new Error("uploadAdminDoc: missing file");
  const { key } = await putFile("admin", file, { section });
  const id = Math.max(0, ...docsStore.map((d) => d.id)) + 1;
  const doc = {
    id,
    fileKey: key,
    name: file.name,
    section,
    status: "pending",
    uploadedBy: uploadedBy ?? "You",
    date: new Date().toISOString().split("T")[0],
    size: formatSize(file.size),
    type: inferType(file),
    description: description ?? "",
    version: "1.0",
    downloads: 0,
  };
  docsStore = [doc, ...docsStore];
  saveDocs(docsStore);
  return doc;
}

export async function createAdminDoc(doc) {
  await simulateLatency();
  const id = Math.max(0, ...docsStore.map((d) => d.id)) + 1;
  const created = { ...doc, id };
  docsStore = [created, ...docsStore];
  saveDocs(docsStore);
  return created;
  // return fetchJson("/admin/docs", { method: "POST", body: doc });
}

export async function updateAdminDoc(id, patch) {
  await simulateLatency();
  docsStore = docsStore.map((d) => (d.id === id ? { ...d, ...patch } : d));
  saveDocs(docsStore);
  return docsStore.find((d) => d.id === id);
  // return fetchJson(`/admin/docs/${id}`, { method: "PATCH", body: patch });
}

export async function deleteAdminDoc(id) {
  await simulateLatency();
  const doc = docsStore.find((d) => d.id === id);
  docsStore = docsStore.filter((d) => d.id !== id);
  saveDocs(docsStore);
  if (doc?.fileKey) {
    try { await deleteFile(doc.fileKey); } catch { /* best effort */ }
  }
  // await fetchJson(`/admin/docs/${id}`, { method: "DELETE" });
}

/** Trigger a browser download for an uploaded doc. No-op for fixture docs. */
export async function downloadAdminDoc(id) {
  const doc = docsStore.find((d) => d.id === id);
  if (!doc?.fileKey) return false;
  await downloadFile(doc.fileKey, doc.name);
  docsStore = docsStore.map((d) =>
    d.id === id ? { ...d, downloads: (d.downloads ?? 0) + 1 } : d,
  );
  saveDocs(docsStore);
  return true;
}
