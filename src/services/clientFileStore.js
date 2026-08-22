/**
 * Client-side file store backed by IndexedDB.
 *
 * Replaces S3 for dev/offline: every file the user "uploads" through the app
 * is persisted to the browser's IndexedDB instead of being sent to a remote
 * bucket. Survives reloads, scoped per-origin per-browser.
 *
 * Each record:
 *   { key, blob, name, size, type, section, createdAt, ...extra }
 *
 * `key` is a string the caller picks (e.g. "admin/<docId>"). Use namespaced
 * keys to keep different features from colliding.
 */

const DB_NAME = "verbilo-client-files";
const DB_VERSION = 1;
const STORE = "files";

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "key" });
        store.createIndex("section", "section", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(mode, fn) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const store = t.objectStore(STORE);
        const result = fn(store);
        t.oncomplete = () => resolve(result);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }),
  );
}

function genKey(section) {
  // e.g. "admin/2026-05-17T13:49:53Z-9f3a"
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const rand = Math.random().toString(36).slice(2, 8);
  return `${section}/${ts}-${rand}`;
}

/**
 * Store a File (or Blob) under `section` with optional `extra` metadata.
 * Returns the generated key and the saved record (minus blob for sanity).
 */
export async function putFile(section, file, extra = {}) {
  if (!file) throw new Error("putFile: no file");
  const key = extra.key ?? genKey(section);
  const record = {
    key,
    section,
    blob: file,
    name: extra.name ?? file.name ?? "untitled",
    size: file.size,
    type: file.type || extra.type || "application/octet-stream",
    createdAt: extra.createdAt ?? new Date().toISOString(),
    ...extra,
    // never let `key` / `blob` be overwritten by extra spread above
    key2: undefined,
  };
  delete record.key2;
  await tx("readwrite", (s) => s.put(record));
  const { blob, ...meta } = record;
  return { key, meta };
}

/** Return `{ blob, meta }` or null if missing. */
export async function getFile(key) {
  const rec = await tx("readonly", (s) =>
    promiseFromRequest(s.get(key)),
  ).then((r) => r);
  if (!rec) return null;
  const { blob, ...meta } = rec;
  return { blob, meta };
}

/** Return metadata only (no blob load). */
export async function getMeta(key) {
  const f = await getFile(key);
  return f?.meta ?? null;
}

/**
 * List records by section. Returns metas (no blobs).
 * If `section` omitted, lists everything.
 */
export async function listMeta(section) {
  const recs = await tx("readonly", (s) => {
    if (section == null) return promiseFromRequest(s.getAll());
    const idx = s.index("section");
    return promiseFromRequest(idx.getAll(IDBKeyRange.only(section)));
  }).then((r) => r);
  return recs.map(({ blob, ...meta }) => meta);
}

export async function deleteFile(key) {
  await tx("readwrite", (s) => s.delete(key));
}

export async function deleteSection(section) {
  await tx("readwrite", (s) => {
    const idx = s.index("section");
    const req = idx.openKeyCursor(IDBKeyRange.only(section));
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        s.delete(cursor.primaryKey);
        cursor.continue();
      }
    };
  });
}

/** Convenience: trigger a browser download for a stored file. */
export async function downloadFile(key, overrideName) {
  const f = await getFile(key);
  if (!f) throw new Error(`downloadFile: no file at ${key}`);
  const url = URL.createObjectURL(f.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = overrideName ?? f.meta.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Convenience: create an object URL for inline preview (caller must revoke). */
export async function getObjectUrl(key) {
  const f = await getFile(key);
  if (!f) return null;
  return URL.createObjectURL(f.blob);
}

/** Format bytes like "2.4 MB" / "640 KB". */
export function formatSize(bytes) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/** Map a file's MIME / extension to a short display type. */
export function inferType(file) {
  const name = file.name ?? "";
  const ext = name.split(".").pop()?.toUpperCase() ?? "";
  if (ext && ext.length <= 5) return ext;
  const mime = file.type ?? "";
  return mime.split("/").pop()?.toUpperCase() ?? "FILE";
}

function promiseFromRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
