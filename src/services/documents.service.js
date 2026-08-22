import { isDemoMode } from "../lib/mode";
import { fetchJson, fetchMultipart } from "./http";

// VER-92: Document CRUD against /documents. Multipart upload through
// the backend (browser → Nest → S3). Downloads use signed URLs returned
// from the backend — frontend then navigates window.location to that
// URL, which forces a download (S3 sets Content-Disposition: attachment).
//
// Demo subdomain short-circuits the network: synthetic documents live in
// module-scope state and "download" returns a no-op data URL.

const DEMO_NOW = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const DEMO_SEED = [
  {
    id: "demo-doc-1",
    tenantId: "demo-tenant",
    title: "Practice handbook 2026",
    category: "Handbook",
    visibilityScope: "company",
    scopeSiteIds: [],
    fileName: "practice-handbook-2026.pdf",
    mimeType: "application/pdf",
    byteSize: 2_341_874,
    createdAt: new Date(DEMO_NOW - 2 * DAY).toISOString(),
    updatedAt: new Date(DEMO_NOW - 2 * DAY).toISOString(),
    uploader: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
  {
    id: "demo-doc-2",
    tenantId: "demo-tenant",
    title: "Infection control SOP (v3.1)",
    category: "Clinical protocol",
    visibilityScope: "company",
    scopeSiteIds: [],
    fileName: "infection-control-sop-v3-1.pdf",
    mimeType: "application/pdf",
    byteSize: 487_213,
    createdAt: new Date(DEMO_NOW - 4 * HOUR).toISOString(),
    updatedAt: new Date(DEMO_NOW - 4 * HOUR).toISOString(),
    uploader: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
  {
    id: "demo-doc-3",
    tenantId: "demo-tenant",
    title: "London Flagship — fire safety plan",
    category: "Compliance",
    visibilityScope: "site",
    scopeSiteIds: ["site-london-flagship"],
    fileName: "london-flagship-fire-safety.pdf",
    mimeType: "application/pdf",
    byteSize: 1_122_408,
    createdAt: new Date(DEMO_NOW - 6 * DAY).toISOString(),
    updatedAt: new Date(DEMO_NOW - 6 * DAY).toISOString(),
    uploader: { id: "demo-u-1", username: "demo.user", displayName: "Demo User" },
  },
  {
    id: "demo-doc-4",
    tenantId: "demo-tenant",
    title: "DBS check renewal form",
    category: "HR policy",
    visibilityScope: "company",
    scopeSiteIds: [],
    fileName: "dbs-renewal-form-2026.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    byteSize: 89_344,
    createdAt: new Date(DEMO_NOW - 10 * DAY).toISOString(),
    updatedAt: new Date(DEMO_NOW - 10 * DAY).toISOString(),
    uploader: { id: "demo-u-2", username: "sarah.patel", displayName: "Sarah Patel" },
  },
  {
    id: "demo-doc-5",
    tenantId: "demo-tenant",
    title: "Q1 KPI dashboard export",
    category: "Operations",
    visibilityScope: "company",
    scopeSiteIds: [],
    fileName: "q1-kpis.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    byteSize: 312_018,
    createdAt: new Date(DEMO_NOW - 14 * DAY).toISOString(),
    updatedAt: new Date(DEMO_NOW - 14 * DAY).toISOString(),
    uploader: { id: "demo-u-5", username: "olivia.davies", displayName: "Olivia Davies" },
  },
];

let demoDocuments = DEMO_SEED.map((d) => ({ ...d }));

function findDemo(id) {
  return demoDocuments.find((d) => d.id === id) ?? null;
}

export async function listDocuments(params = {}) {
  if (isDemoMode()) {
    let rows = demoDocuments.filter((d) => !d.deletedAt);
    if (params.category) rows = rows.filter((d) => d.category === params.category);
    rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { items: rows, nextCursor: null };
  }
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const suffix = qs.toString() ? `?${qs}` : "";
  return fetchJson(`/documents${suffix}`);
}

// VER-92: multipart upload. Browser POSTs FormData to /documents; the
// backend streams the file to S3 and returns the Document row.
//
// Demo mode pushes a synthetic row to the in-memory store — no actual
// S3 round-trip. ObjectURL provides a stable preview key when the
// visitor clicks "Download" (browser navigates to the blob URL).
export async function uploadDocument({ file, title, category, visibilityScope, scopeSiteIds = [] }) {
  if (isDemoMode()) {
    const row = {
      id: `demo-doc-${Date.now()}`,
      tenantId: "demo-tenant",
      title,
      category,
      visibilityScope,
      scopeSiteIds,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      byteSize: file.size,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      uploader: { id: "demo-u-1", username: "demo.user", displayName: "Demo User" },
      _demoBlobUrl: URL.createObjectURL(file),
    };
    demoDocuments = [row, ...demoDocuments];
    return row;
  }
  const form = new FormData();
  form.append("file", file);
  form.append("title", title);
  form.append("category", category);
  form.append("visibilityScope", visibilityScope);
  if (scopeSiteIds.length) {
    scopeSiteIds.forEach((id) => form.append("scopeSiteIds[]", id));
  }
  return fetchMultipart("/documents", form);
}

// VER-92: backend returns a presigned URL; frontend then navigates to
// it. In demo mode we return the blob URL captured at upload time, or
// (for seed entries) a no-op data URL so the click doesn't error.
export async function getDownloadUrl(id) {
  if (isDemoMode()) {
    const row = findDemo(id);
    const url = row?._demoBlobUrl ?? "data:text/plain,Demo%20file%20%E2%80%94%20no%20real%20bytes";
    return { url, expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() };
  }
  return fetchJson(`/documents/${encodeURIComponent(id)}/download`);
}

export async function softDeleteDocument(id) {
  if (isDemoMode()) {
    demoDocuments = demoDocuments.filter((d) => d.id !== id);
    return { id };
  }
  return fetchJson(`/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// VER-92: human-readable file size for the list view.
export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// File-type label for the table — strip "application/vnd.openxmlformats-..."
// down to something readable.
export function fileTypeLabel(mimeType) {
  if (!mimeType) return "File";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.includes("wordprocessingml")) return "Word";
  if (mimeType.includes("spreadsheetml")) return "Excel";
  if (mimeType.startsWith("image/")) return mimeType.replace("image/", "").toUpperCase();
  return mimeType;
}
