import {
  policiesFixture,
  mandatoryTrainingFixture,
  noticesFixture,
  hrQuickLinksFixture,
} from "./fixtures/hr.fixture";
import { simulateLatency } from "./delay";
import { putFile, downloadFile, deleteFile } from "./clientFileStore";
// import { fetchJson } from "./http";

const LS_KEY = "verbilo.hr.policies";

function loadPolicies() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fall through */ }
  return [...policiesFixture];
}

function savePolicies(list) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { /* noop */ }
}

let policiesStore = loadPolicies();

export async function listPolicies() {
  await simulateLatency();
  return [...policiesStore];
  // return fetchJson("/hr/policies");
}

export async function addPolicy(policy) {
  await simulateLatency();
  const next = { ...policy, id: policy.id ?? Date.now() };
  policiesStore = [next, ...policiesStore];
  savePolicies(policiesStore);
  return next;
  // return fetchJson("/hr/policies", { method: "POST", body: policy });
}

/** Upload a real file as a policy and persist locally. */
export async function uploadPolicyFile(file) {
  if (!file) throw new Error("uploadPolicyFile: missing file");
  const { key } = await putFile("hr", file);
  const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  const now = new Date();
  const updated = `Updated ${now.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`;
  return addPolicy({ name, updated, fileKey: key, fileName: file.name });
}

export async function downloadPolicy(name) {
  const p = policiesStore.find((x) => x.name === name);
  if (!p?.fileKey) return false;
  await downloadFile(p.fileKey, p.fileName ?? `${name}.pdf`);
  return true;
}

export async function deletePolicy(name) {
  const p = policiesStore.find((x) => x.name === name);
  policiesStore = policiesStore.filter((x) => x.name !== name);
  savePolicies(policiesStore);
  if (p?.fileKey) {
    try { await deleteFile(p.fileKey); } catch { /* best effort */ }
  }
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
