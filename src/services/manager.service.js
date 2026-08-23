import {
  snapshotActionsFixture,
  leaveRequestsFixture,
  gdcRecordsFixture,
  trainingRecordsFixture,
  managerIncidentsFixture,
  cqcSummaryFixture,
  udaTotalFixture,
  udaDentistsFixture,
  udaTotals,
} from "./fixtures/manager.fixture";
import { simulateLatency } from "./delay";
import { practiceMetrics } from "./practiceMetrics";
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

export async function listManagerIncidents(siteId) {
  await simulateLatency();
  const base = [...managerIncidentsFixture];
  // ⚠️ DEMO SHIM (delete when incidents are stored per-site): the fixture isn't
  // site-scoped, so a drill-in from the Management Hub slices the open-incident
  // count to match the league table's Incidents column for that practice.
  if (siteId) return base.slice(0, practiceMetrics(siteId).incidents);
  return base;
  // return fetchJson("/manager/incidents", { query: { siteId } });
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

export async function listUdaDentists(siteId) {
  await simulateLatency();
  /* Derive contracted + delivered from each clinician's monthly
   * arrays. UI receives the same shape it always did
   * (`{ name, contracted, delivered }`) plus the new monthly
   * arrays for the PM-2 edit modal. */
  const base = udaDentistsFixture.map((d) => ({ ...d, ...udaTotals(d) }));
  if (!siteId) return base;
  // ⚠️ DEMO SHIM (delete when UDA is stored per-site): the fixture isn't
  // site-scoped, so a drill-in from the Management Hub scales each clinician's
  // delivered UDAs to make the practice total match the league table's UDA %.
  // In PRODUCTION the per-dentist deliveries are REAL and the practice % is
  // simply their natural sum — there is nothing to scale, and this whole branch
  // disappears. (Direct opens — a PM's own hub — pass no siteId and keep the
  // full monthly model intact for the edit modal.)
  const target = practiceMetrics(siteId).udaPct;          // e.g. 85
  const totC = base.reduce((n, d) => n + (Number(d.contracted) || 0), 0);
  const totD = base.reduce((n, d) => n + (Number(d.delivered)  || 0), 0) || 1;
  const f = (totC * target) / 100 / totD;                  // scale factor to hit target %
  const scaled = base.map((d) => ({ ...d, delivered: Math.round((Number(d.delivered) || 0) * f) }));
  // Absorb per-clinician rounding drift into the largest-delivery clinician so
  // the practice TOTAL lands exactly on the target % the league table shows.
  const desiredTotD = Math.round((totC * target) / 100);
  const diff = desiredTotD - scaled.reduce((n, d) => n + d.delivered, 0);
  if (scaled.length && diff !== 0) {
    let idx = 0;
    for (let i = 1; i < scaled.length; i++) if (scaled[i].delivered > scaled[idx].delivered) idx = i;
    scaled[idx] = { ...scaled[idx], delivered: Math.max(0, scaled[idx].delivered + diff) };
  }
  return scaled;
  // return fetchJson("/manager/uda/by-dentist", { query: { siteId } });
}
