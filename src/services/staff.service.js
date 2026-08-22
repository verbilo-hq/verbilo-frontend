// Staff service — talks to the backend `/staff` endpoints (VER-23/VER-24).
//
// The backend `StaffMember` record is currently a slim HR record:
//   { id, tenantId, siteId, userId, firstName, surname, email, phone,
//     role, gdcNumber, startedAt, endedAt, archivedAt, createdAt, updatedAt }
//
// The legacy `staffFixture` had a richer UI shape (bio, qualifications,
// specialisms, surgery days, CPD hours, etc.). Those richer fields aren't
// in the backend yet — `toUi()` defaults them to empty so the existing
// StaffPage keeps rendering. Future tickets will either extend the backend
// schema or move those fields into a per-tenant metadata store.
//
// `listPractices` / `getPracticeAddress` are still fixture-backed because
// the sites/practices endpoint is a separate concern (no Linear ticket
// yet — add one when the page needs live site data).

import { practicesFixture, practiceAddressesFixture } from "../fixtures/demo/staff";
import { isDemoMode } from "../lib/mode"; // VER-83: future tenant-mode branches (VER-86+) gate on this; currently unused, fixture imports above are returned unconditionally.
import { simulateLatency } from "./delay";
import { fetchJson } from "./http";
import { roleLabel } from "../lib/sector";

const STAFF_ROOT = "/staff";

function toUi(record) {
  if (!record) return null;
  const fullName = `${record.firstName ?? ""} ${record.surname ?? ""}`.trim();
  // Sector isn't known here (the service doesn't see TenantContext); fall back
  // to the generic role taxonomy. Consumers that do know the sector can
  // re-render with `roleLabel(roleType, sector, clinicalSpecialty)`.
  const defaultLabel = roleLabel(record.role, undefined, record.clinicalSpecialty);
  return {
    id: record.id,
    name: fullName,
    firstName: record.firstName ?? "",
    surname: record.surname ?? "",
    email: record.email ?? "",
    phone: record.phone ?? "",
    roleType: record.role ?? "",
    roleLabel: defaultLabel,
    clinicalSpecialty: record.clinicalSpecialty ?? "",
    practice: record.siteId ?? "",
    siteId: record.siteId ?? null,
    gdc: record.gdcNumber ?? "",
    // GDC registration is specific to dental; keep the field for backward
    // compat with the form. For other sectors this column is just empty.
    gdcType: record.clinicalSpecialty ?? "",
    startDate: record.startedAt ?? "",
    archivedAt: record.archivedAt ?? null,
    // UI-only fields the backend doesn't track yet — defaulted so StaffPage
    // renders without missing-key crashes.
    bio: "",
    quals: [],
    specialisms: [],
    interests: [],
    equipment: [],
    surgeryDays: "",
    surgeries: [],
    languages: [],
    indemnity: "",
    docs: {},
    cpdHours: 0,
    cpdRequired: 0,
    online: false,
    featured: false,
  };
}

function splitName(fullName) {
  if (!fullName) return { firstName: "", surname: "" };
  const trimmed = String(fullName).trim().replace(/^Dr\.?\s+/i, "");
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], surname: "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    surname: parts[parts.length - 1],
  };
}

function toApi(data) {
  const { firstName, surname } =
    data.firstName || data.surname
      ? { firstName: data.firstName ?? "", surname: data.surname ?? "" }
      : splitName(data.name);
  const out = {
    firstName,
    surname,
    email: data.email,
    role: data.roleType || data.role,
  };
  if (data.phone) out.phone = data.phone;
  if (data.gdc || data.gdcNumber) out.gdcNumber = data.gdc ?? data.gdcNumber;
  if (data.siteId) out.siteId = data.siteId;
  if (data.clinicalSpecialty || data.gdcType) {
    out.clinicalSpecialty = data.clinicalSpecialty ?? data.gdcType;
  }
  if (data.startDate) {
    // Best-effort: accept either an ISO string or a "March 2019"-style label.
    const d = new Date(data.startDate);
    if (!Number.isNaN(d.getTime())) out.startedAt = d.toISOString();
  }
  return out;
}

export async function listStaff() {
  const records = await fetchJson(STAFF_ROOT);
  return Array.isArray(records) ? records.map(toUi) : [];
}

export async function createStaff(data) {
  const created = await fetchJson(STAFF_ROOT, {
    method: "POST",
    body: toApi(data),
  });
  return toUi(created);
}

export async function updateStaff(id, patch) {
  const updated = await fetchJson(`${STAFF_ROOT}/${id}`, {
    method: "PATCH",
    body: toApi(patch),
  });
  return toUi(updated);
}

export async function deleteStaff(id) {
  // Backend uses soft-delete (sets archivedAt); same call site for the UI.
  await fetchJson(`${STAFF_ROOT}/${id}`, { method: "DELETE" });
}

// ── Practices (sites) — still fixture-backed; live /sites endpoint is a
//    separate ticket (StaffPage uses these for the practice filter).

export async function listPractices() {
  await simulateLatency();
  return [...practicesFixture];
}

export async function getPracticeAddress(practice) {
  await simulateLatency();
  return practiceAddressesFixture[practice] ?? null;
}
