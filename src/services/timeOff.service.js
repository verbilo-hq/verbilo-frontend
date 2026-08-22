import { demoUsers } from "../auth/demoUsers.js";
import { clinicalStaff } from "../auth/clinicalStaff.js";
import { simulateLatency } from "./delay.js";

const STORAGE_KEY = "verbilo_time_off_state_v3";

export const ROLE_LABELS = {
  hygienist: "Hygienist",
  companyOwner: "Company Owner",
  chiefOfStaff: "Owner's Left-Hand / Chief of Staff",
  operationsDirector: "Owner's Right-Hand / Operations Director",
  secondInCharge: "Second in Charge",
  areaManager: "Area Manager",
  practiceManager: "Practice Manager",
  deputyPracticeManager: "Deputy Practice Manager",
  clinicalLead: "Clinical Lead",
  leadNurse: "Lead Nurse",
  dentalNurse: "Dental Nurse",
  frontOfHouseLead: "Front of House Lead",
  receptionist: "Receptionist",
  employee: "Employee",
  associateDentist: "Associate Dentist",
  treatmentCoordinator: "Treatment Coordinator",
  traineeReceptionist: "Trainee Receptionist",
  traineeDentalNurse: "Trainee Dental Nurse",
  juniorTreatmentCoordinator: "Junior Treatment Coordinator",
  foundationDentist: "Foundation Dentist",
  traineeEmployee: "Trainee Employee",
  supportAssistant: "Support Assistant",
};

const NON_AREA_MANAGER_ROLE_LABELS = new Set(
  Object.entries(ROLE_LABELS)
    .filter(([role]) => role !== "areaManager")
    .map(([, label]) => label),
);

const ROLE_USERNAME_PREFIXES = {
  companyOwner: "o",
  chiefOfStaff: "lh",
  operationsDirector: "rh",
  secondInCharge: "m.m",
  areaManager: "a",
  practiceManager: "m",
  deputyPracticeManager: "dpm",
  clinicalLead: "cl",
  leadNurse: "ln",
  dentalNurse: "dn",
  frontOfHouseLead: "foh",
  receptionist: "rec",
  employee: "e",
  associateDentist: "ad",
  treatmentCoordinator: "tc",
  traineeReceptionist: "tr",
  traineeDentalNurse: "tdn",
  juniorTreatmentCoordinator: "jtc",
  foundationDentist: "fd",
  traineeEmployee: "te",
  supportAssistant: "sa",
};

const PRACTICE_REPORT_ROLES = [
  "employee",
  "traineeEmployee",
  "supportAssistant",
  "associateDentist",
  "foundationDentist",
  "treatmentCoordinator",
  "juniorTreatmentCoordinator",
  "receptionist",
  "traineeReceptionist",
  "dentalNurse",
  "traineeDentalNurse",
];

const PRACTICE_MANAGER_REPORT_ROLES = [
  "deputyPracticeManager",
  "clinicalLead",
  "leadNurse",
  "frontOfHouseLead",
  ...PRACTICE_REPORT_ROLES,
];

const ROLE_CHILD_ROLES = {
  companyOwner: ["chiefOfStaff", "operationsDirector", "secondInCharge", "areaManager"],
  chiefOfStaff: ["secondInCharge", "areaManager"],
  operationsDirector: ["secondInCharge", "areaManager"],
  secondInCharge: ["areaManager"],
  areaManager: ["practiceManager"],
  practiceManager: PRACTICE_MANAGER_REPORT_ROLES,
  deputyPracticeManager: PRACTICE_REPORT_ROLES,
  clinicalLead: PRACTICE_REPORT_ROLES,
  leadNurse: PRACTICE_REPORT_ROLES,
  frontOfHouseLead: PRACTICE_REPORT_ROLES,
  dentalNurse: PRACTICE_REPORT_ROLES,
  receptionist: PRACTICE_REPORT_ROLES,
  employee: PRACTICE_REPORT_ROLES,
  associateDentist: PRACTICE_REPORT_ROLES,
  treatmentCoordinator: PRACTICE_REPORT_ROLES,
  traineeReceptionist: PRACTICE_REPORT_ROLES,
  traineeDentalNurse: PRACTICE_REPORT_ROLES,
  juniorTreatmentCoordinator: PRACTICE_REPORT_ROLES,
  foundationDentist: PRACTICE_REPORT_ROLES,
  traineeEmployee: PRACTICE_REPORT_ROLES,
  supportAssistant: PRACTICE_REPORT_ROLES,
};

const SELF_CREATE_DIRECT_REPORT_ROLES = new Set([
  "companyOwner",
  "chiefOfStaff",
  "operationsDirector",
  "secondInCharge",
  "areaManager",
  "practiceManager",
  "deputyPracticeManager",
  "clinicalLead",
  "leadNurse",
  "frontOfHouseLead",
]);

// Roles that always belong to a specific practice site. The directory's
// "Add Staff Member" wizard surfaces these — non-practice roles (area
// manager, exec) are created from the org map instead.
export const PRACTICE_LEVEL_ROLES = new Set([
  "practiceManager",
  "deputyPracticeManager",
  "clinicalLead",
  "leadNurse",
  "dentalNurse",
  "traineeDentalNurse",
  "frontOfHouseLead",
  "receptionist",
  "traineeReceptionist",
  "associateDentist",
  "foundationDentist",
  "treatmentCoordinator",
  "juniorTreatmentCoordinator",
  "employee",
  "traineeEmployee",
  "supportAssistant",
]);

// For each role, the manager roles we prefer in priority order. The first
// matching manager found at the chosen practice wins. `areaManager` sits at the
// tail of every chain so that PM-less sites still resolve to a manager: the
// area manager acts as the de facto practice manager until a real PM is hired.
const PREFERRED_MANAGER_ROLES_FOR_ROLE = {
  practiceManager: ["areaManager"],
  deputyPracticeManager: ["practiceManager", "areaManager"],
  clinicalLead: ["practiceManager", "areaManager"],
  leadNurse: ["clinicalLead", "practiceManager", "areaManager"],
  dentalNurse: ["leadNurse", "clinicalLead", "practiceManager", "areaManager"],
  traineeDentalNurse: ["leadNurse", "clinicalLead", "practiceManager", "areaManager"],
  frontOfHouseLead: ["practiceManager", "areaManager"],
  receptionist: ["frontOfHouseLead", "practiceManager", "areaManager"],
  traineeReceptionist: ["frontOfHouseLead", "practiceManager", "areaManager"],
  associateDentist: ["clinicalLead", "practiceManager", "areaManager"],
  foundationDentist: ["clinicalLead", "practiceManager", "areaManager"],
  treatmentCoordinator: ["practiceManager", "areaManager"],
  juniorTreatmentCoordinator: ["treatmentCoordinator", "practiceManager", "areaManager"],
  employee: ["practiceManager", "areaManager"],
  traineeEmployee: ["practiceManager", "areaManager"],
  supportAssistant: ["practiceManager", "areaManager"],
};

// Roles that need GDC registration to legally practise.
export const CLINICAL_GDC_ROLES = new Set([
  "clinicalLead",
  "leadNurse",
  "dentalNurse",
  "traineeDentalNurse",
  "associateDentist",
  "foundationDentist",
]);

const DEFAULT_GDC_TYPE_BY_ROLE = {
  clinicalLead: "Dentist",
  associateDentist: "Dentist",
  foundationDentist: "Dentist",
  leadNurse: "Dental Nurse",
  dentalNurse: "Dental Nurse",
  traineeDentalNurse: "Dental Nurse",
};

export const isClinicalRole = (role) => CLINICAL_GDC_ROLES.has(role);
export const defaultGdcTypeForRole = (role) => DEFAULT_GDC_TYPE_BY_ROLE[role] ?? "";

const PROFILE_IMAGE_COUNT = 18;

// Illustrated avatars (DiceBear "micah") live in public/profile-photos as
// gender-matched pools (w-01..w-18 for women, m-01..m-18 for men). Pick the
// pool from the person's gender so avatars suit names, and index by staffId so
// each person gets a stable, distinct avatar. Unknown / "prefer-not-to-say"
// uses the women pool.
const profileImageForStaffId = (staffId, gender) => {
  const numericId = Number(staffId);
  const index = Number.isFinite(numericId) && numericId > 0 ? numericId : 1;
  const slot = ((index - 1) % PROFILE_IMAGE_COUNT) + 1;
  const pool = gender === "male" ? "m" : "w";
  return `/profile-photos/${pool}-${String(slot).padStart(2, "0")}.svg`;
};

const STAFF_PROFILE_FIELDS = [
  "email",
  "phoneExtension",
  "dateOfBirth",
  "gender",
  "startDate",
  "gdcNumber",
  "gdcType",
  "gdcRenewal",
  "bio",
  "qualifications",
  "languages",
  "documents",
  "profileImage",
];

// Returns only the staff-profile patch fields that the caller actually provided.
// Anything they leave undefined keeps its prior value via spread merging.
const pickStaffProfileFields = (input) => {
  const patch = {};
  for (const field of STAFF_PROFILE_FIELDS) {
    if (input[field] === undefined) continue;
    if (field === "qualifications" || field === "languages") {
      patch[field] = Array.isArray(input[field]) ? input[field].filter(Boolean) : [];
    } else if (typeof input[field] === "string") {
      patch[field] = input[field].trim();
    } else {
      patch[field] = input[field];
    }
  }
  return patch;
};

export const AREA_SITE_TARGETS = [
  { id: "site-southall", name: "Southall", areaId: "area-1", areaName: "Area 1" },
  { id: "site-reading", name: "Reading", areaId: "area-1", areaName: "Area 1" },
  { id: "site-new-cross", name: "New Cross", areaId: "area-1", areaName: "Area 1" },
  { id: "site-london", name: "London", areaId: "area-2", areaName: "Area 2" },
  { id: "site-manchester", name: "Manchester", areaId: "area-2", areaName: "Area 2" },
  { id: "site-birmingham", name: "Birmingham", areaId: "area-2", areaName: "Area 2" },
];

export const DEFAULT_AREAS = [
  {
    id: "area-1",
    name: "Area 1",
    managerId: "area-manager-1",
    status: "active",
    description: "Southall, Reading, and New Cross.",
    siteIds: ["site-southall", "site-reading", "site-new-cross"],
  },
  {
    id: "area-2",
    name: "Area 2",
    managerId: "area-manager-2",
    status: "active",
    description: "London, Manchester, and Birmingham.",
    siteIds: ["site-london", "site-manchester", "site-birmingham"],
  },
];

const AREA_ADMIN_ROLES = new Set(["companyOwner", "chiefOfStaff", "operationsDirector"]);
const LEAVE_SETTINGS_ADMIN_ROLES = new Set([
  "companyOwner",
  "chiefOfStaff",
  "operationsDirector",
  "secondInCharge",
]);
const DEFAULT_SICK_LEAVE_ENTITLEMENT = 10;

// Holiday year configuration. UK calendar default = 1 January, but many UK
// dental groups run April-to-March or other custom anniversaries — admins
// can set this from the Company Settings modal.
export const DEFAULT_HOLIDAY_YEAR_START = { month: 1, day: 1 };

const pad2 = (value) => String(value).padStart(2, "0");

const subOneDayIso = (iso) => {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
};

// Returns the holiday year window (start + end inclusive, both as YYYY-MM-DD)
// that contains `asOf`. Window length is always one calendar year. The end is
// the day before the next anniversary (so window.end < next year's window.start).
export function getCurrentHolidayYearWindow(settings, asOf = new Date()) {
  const start = settings?.holidayYear ?? DEFAULT_HOLIDAY_YEAR_START;
  const month = Math.min(Math.max(Number(start.month) || 1, 1), 12);
  const day = Math.min(Math.max(Number(start.day) || 1, 1), 28);

  // Compare in UTC YYYY-MM-DD space so DST / local-time quirks don't slip in.
  const asOfIso = (asOf instanceof Date ? asOf : new Date(asOf))
    .toISOString()
    .slice(0, 10);
  const year = Number(asOfIso.slice(0, 4));
  const thisAnniversary = `${year}-${pad2(month)}-${pad2(day)}`;
  if (asOfIso >= thisAnniversary) {
    return {
      start: thisAnniversary,
      end: subOneDayIso(`${year + 1}-${pad2(month)}-${pad2(day)}`),
    };
  }
  return {
    start: `${year - 1}-${pad2(month)}-${pad2(day)}`,
    end: subOneDayIso(thisAnniversary),
  };
}

// Returns true if `dateIso` is within (inclusive) the window. Both inputs are
// YYYY-MM-DD strings, so lex compare is correct.
export function isDateInWindow(dateIso, window) {
  if (!dateIso || !window) return false;
  return dateIso >= window.start && dateIso <= window.end;
}

const LEGACY_SITE_ALIASES = {
  "practice-harley": "site-southall",
  "practice-camden": "site-london",
  "practice-area-1-2": "site-reading",
  "practice-area-1-3": "site-new-cross",
  "practice-area-2-2": "site-manchester",
  "practice-area-2-3": "site-birmingham",
};

export const ABSENCE_TYPES = [
  "Holiday",
  "Holiday unpaid",
  "Compassionate leave",
  "Jury service",
  "Parental leave",
  "Paternity / partner leave",
  "Reserve forces training",
  "Sickness leave",
  "Sickness unpaid",
  "Sickness work-related accident",
  "Study leave",
  "Medical appointment",
  "Other authorised absence",
];

const SICKNESS_ABSENCE_TYPES = new Set([
  "Sickness leave",
  "Sickness unpaid",
  "Sickness work-related accident",
]);

const clone = (value) => JSON.parse(JSON.stringify(value));

const parseDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
};

const makeError = (message, code = "VALIDATION", details = {}) => {
  const err = new Error(message);
  err.code = code;
  err.details = details;
  return err;
};

const sortNewestFirst = (items) =>
  [...items].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

const roleLabelOf = (role) => ROLE_LABELS[role] ?? role;

const getCreateableRolesForRole = (role) => ROLE_CHILD_ROLES[role] ?? [];

const toTitleCaseFromId = (value) =>
  String(value ?? "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const slugify = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const areaRecordsOf = (state) => (Array.isArray(state?.areas) ? state.areas : DEFAULT_AREAS);

const siteTargetsOf = (state) => (Array.isArray(state?.sites) ? state.sites : AREA_SITE_TARGETS);

const areaLabelOf = (areaId, areas = DEFAULT_AREAS, sites = AREA_SITE_TARGETS) =>
  areas.find((area) => area.id === areaId)?.name ??
  sites.find((site) => site.areaId === areaId)?.areaName ??
  toTitleCaseFromId(areaId);

const withSiteAreaName = (site, areas = DEFAULT_AREAS, sites = AREA_SITE_TARGETS) =>
  site
    ? {
        ...site,
        areaName: site.areaName ?? areaLabelOf(site.areaId, areas, sites),
        status: site.status ?? "active",
        address: site.address ?? "",
      }
    : null;

const canonicalSiteIdOf = (practiceId) =>
  practiceId ? LEGACY_SITE_ALIASES[practiceId] ?? practiceId : null;

const siteTargetById = (siteId, sites = AREA_SITE_TARGETS, areas = DEFAULT_AREAS) =>
  withSiteAreaName(
    sites.find((site) => site.id === canonicalSiteIdOf(siteId)),
    areas,
    sites,
  );

const siteOfUser = (user, sites = AREA_SITE_TARGETS, areas = DEFAULT_AREAS) => {
  const siteId = canonicalSiteIdOf(user?.practiceId);
  if (!siteId) return null;

  const target = siteTargetById(siteId, sites, areas);
  if (target) return target;

  const fallbackName =
    user?.hrProfile?.location && user.hrProfile.location !== "Group Support"
      ? user.hrProfile.location
      : toTitleCaseFromId(siteId);
  return {
    id: siteId,
    name: fallbackName,
    areaId: user?.areaId ?? null,
    areaName: areaLabelOf(user?.areaId, areas, sites),
    status: "active",
    address: "",
  };
};

const managedSitesForUser = (user, sites = AREA_SITE_TARGETS, areas = DEFAULT_AREAS) =>
  user?.role === "areaManager" && user.areaId
    ? sites
        .filter((site) => site.areaId === user.areaId)
        .map((site) => withSiteAreaName(site, areas, sites))
    : [];

const summarizeSiteNames = (names) => {
  if (!names.length) return "";
  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} + ${names.length - 2} sites`;
};

const practiceManagersBySite = (users, areaId, sites = AREA_SITE_TARGETS, areas = DEFAULT_AREAS) => {
  const entries = users
    .filter((user) => user.role === "practiceManager" && (!areaId || user.areaId === areaId))
    .map((user) => [siteOfUser(user, sites, areas)?.id, user])
    .filter(([siteId]) => Boolean(siteId));
  return new Map(entries);
};

const nextPracticeSiteForManager = (
  users,
  manager,
  sequence,
  sites = AREA_SITE_TARGETS,
  areas = DEFAULT_AREAS,
) => {
  if (!manager?.areaId) return null;

  const areaSites = sites
    .filter((site) => site.areaId === manager.areaId)
    .map((site) => withSiteAreaName(site, areas, sites));
  const usedSites = practiceManagersBySite(users, manager.areaId, sites, areas);
  const openSite = areaSites.find((site) => !usedSites.has(site.id));
  if (openSite) return openSite;

  const practiceId = uniqueScopedId(users, `practice-${manager.areaId}`, sequence);
  return {
    id: practiceId,
    name: toTitleCaseFromId(practiceId),
    areaId: manager.areaId,
    areaName: areaLabelOf(manager.areaId, areas, sites),
    status: "active",
    address: "",
  };
};

const uniqueIdFrom = (users, base) => {
  const taken = new Set(users.map((user) => user.id));
  const cleanBase = slugify(base) || "user";
  if (!taken.has(cleanBase)) return cleanBase;

  let index = 2;
  while (taken.has(`${cleanBase}-${index}`)) index += 1;
  return `${cleanBase}-${index}`;
};

const uniqueUsernameFrom = (users, base) => {
  const taken = new Set(users.map((user) => (user.username ?? "").toLowerCase()));
  const cleanBase = String(base ?? "user").trim().toLowerCase() || "user";
  if (!taken.has(cleanBase)) return cleanBase;

  let index = 1;
  while (taken.has(`${cleanBase}.${index}`)) index += 1;
  return `${cleanBase}.${index}`;
};

const uniqueRecordIdFrom = (records, prefix, name) => {
  const taken = new Set(records.map((record) => record.id));
  const cleanName = slugify(name) || "new";
  const cleanPrefix = slugify(prefix) || "item";
  const base = cleanName.startsWith(`${cleanPrefix}-`)
    ? cleanName
    : `${cleanPrefix}-${cleanName}`;
  if (!taken.has(base)) return base;

  let index = 2;
  while (taken.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
};

const formatJoinDate = (value) => {
  const date = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const inferLocation = (manager, fields, sites = AREA_SITE_TARGETS, areas = DEFAULT_AREAS) => {
  if (fields.practiceId) {
    return siteTargetById(fields.practiceId, sites, areas)?.name ?? toTitleCaseFromId(fields.practiceId);
  }
  if (fields.areaId) return areaLabelOf(fields.areaId, areas, sites);
  return manager.hrProfile?.location ?? "Group Support";
};

// Derives a user's current-year leave balance from approved requests whose
// startDate falls inside `window`. Falls back to the user's stored fields when
// no window/requests are supplied (legacy callers + initial state snapshots).
const computeLeaveBalance = (user, requests, window) => {
  const entitlement = user.annualLeaveEntitlement ?? 25;
  if (!Array.isArray(requests) || !window) {
    return {
      annualLeaveEntitlement: entitlement,
      usedLeaveDays: user.usedLeaveDays ?? 0,
      remainingLeaveDays: user.remainingLeaveDays ?? entitlement,
    };
  }
  let used = 0;
  for (const request of requests) {
    if (request.userId !== user.id) continue;
    if (request.status !== "Approved") continue;
    if (!isDateInWindow(request.startDate, window)) continue;
    used += Number(request.requestedDays) || 0;
  }
  return {
    annualLeaveEntitlement: entitlement,
    usedLeaveDays: used,
    remainingLeaveDays: entitlement - used,
  };
};

const userSnapshotOf = (user, users = [], org = {}) => {
  if (!user) return null;
  const sites = org.sites ?? AREA_SITE_TARGETS;
  const areas = org.areas ?? DEFAULT_AREAS;
  const directReportCount = users.length ? getDirectReports(users, user.id).length : 0;
  const site = siteOfUser(user, sites, areas);
  const managedSites = managedSitesForUser(user, sites, areas);
  const managedSiteNames = managedSites.map((managedSite) => managedSite.name);
  const balance = computeLeaveBalance(user, org.requests, org.holidayYearWindow);
  return {
    id: user.id,
    name: user.displayName,
    role: user.role,
    roleLabel: roleLabelOf(user.role),
    managerId: user.managerId,
    scopeType: user.scopeType,
    scopeIds: user.scopeIds ?? [],
    areaId: user.areaId ?? null,
    areaName: user.areaId ? areaLabelOf(user.areaId, areas, sites) : "",
    practiceId: user.practiceId ?? null,
    siteId: site?.id ?? null,
    siteName: site?.name ?? null,
    siteAreaName: site?.areaName ?? null,
    managedSites,
    managedSiteNames,
    managedSiteLabel: summarizeSiteNames(managedSiteNames),
    teamId: user.teamId ?? null,
    directReportCount,
    canCreateDirectReport: getCreateableRolesForRole(user.role).length > 0,
    annualLeaveEntitlement: balance.annualLeaveEntitlement,
    usedLeaveDays: balance.usedLeaveDays,
    remainingLeaveDays: balance.remainingLeaveDays,
    sickLeaveEntitlement: user.sickLeaveEntitlement ?? DEFAULT_SICK_LEAVE_ENTITLEMENT,
    usedSickDays: user.usedSickDays ?? 0,
    remainingSickDays:
      user.remainingSickDays ?? user.sickLeaveEntitlement ?? DEFAULT_SICK_LEAVE_ENTITLEMENT,
    username: user.username ?? "",
    jobTitle: user.hrProfile?.jobTitle ?? roleLabelOf(user.role),
    location: user.hrProfile?.location ?? "Group Support",
    joinDate: user.hrProfile?.joinDate ?? "",
    email: user.email ?? "",
    phoneExtension: user.phoneExtension ?? "",
    dateOfBirth: user.dateOfBirth ?? "",
    gender: user.gender ?? "",
    startDate: user.startDate ?? "",
    gdcNumber: user.gdcNumber ?? "",
    gdcType: user.gdcType ?? "",
    gdcRenewal: user.gdcRenewal ?? "",
    bio: user.bio ?? "",
    qualifications: user.qualifications ?? [],
    languages: user.languages ?? [],
    documents: user.documents ?? { gdcCertificate: null, indemnity: null, dbs: null },
    profileImage: user.profileImage ?? profileImageForStaffId(user.staffId, user.gender),
    isOnline: user.isOnline === true,
  };
};

const withRequestPeople = (request, users, org = {}) => ({
  ...request,
  requester: userSnapshotOf(users.find((user) => user.id === request.userId), users, org),
  approver: request.approverId
    ? userSnapshotOf(users.find((user) => user.id === request.approverId), users, org)
    : null,
});

const leaveBucketForAbsenceType = (absenceType) =>
  SICKNESS_ABSENCE_TYPES.has(absenceType) ? "sick" : "annual";

// Sick leave still uses stored values (no holiday-year rollover for sick yet).
// Annual leave is now derived — pass requests + window for the freshest value;
// fall back to stored fields if not supplied (legacy callers).
const balanceForBucket = (user, bucket, requests, window) => {
  if (bucket === "sick") {
    return {
      entitlement: user.sickLeaveEntitlement ?? DEFAULT_SICK_LEAVE_ENTITLEMENT,
      used: user.usedSickDays ?? 0,
      remaining:
        user.remainingSickDays ?? user.sickLeaveEntitlement ?? DEFAULT_SICK_LEAVE_ENTITLEMENT,
    };
  }
  const derived = computeLeaveBalance(user, requests, window);
  return {
    entitlement: derived.annualLeaveEntitlement,
    used: derived.usedLeaveDays,
    remaining: derived.remainingLeaveDays,
  };
};

const canUseNegativeBalance = (absenceType) => {
  const value = absenceType.toLowerCase();
  return value.includes("unpaid") || value.includes("sickness");
};

export function calculateWorkingDays(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end || end < start) return 0;

  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) count += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
}

const isoDateOf = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return "";
};

const addDaysToIsoDate = (value, days) => {
  const date = parseDate(isoDateOf(value));
  if (!date) return "";
  date.setUTCDate(date.getUTCDate() + days);
  return isoDateOf(date);
};

const weekRangeOf = (value) => {
  const date = parseDate(isoDateOf(value));
  if (!date) return { weekStart: "", weekEnd: "" };
  const daysFromMonday = (date.getUTCDay() + 6) % 7;
  const start = new Date(date);
  start.setUTCDate(start.getUTCDate() - daysFromMonday);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  return { weekStart: isoDateOf(start), weekEnd: isoDateOf(end) };
};

const requestOverlapsRange = (request, startDate, endDate) => {
  const requestStart = parseDate(request.startDate);
  const requestEnd = parseDate(request.endDate);
  const rangeStart = parseDate(startDate);
  const rangeEnd = parseDate(endDate);
  if (!requestStart || !requestEnd || !rangeStart || !rangeEnd) return false;
  return requestEnd >= rangeStart && requestStart <= rangeEnd;
};

export function findCalendarClashes(calendar, input, requesterId) {
  if (
    !calendar ||
    !input?.startDate ||
    !input?.endDate ||
    calculateWorkingDays(input.startDate, input.endDate) <= 0
  ) {
    return [];
  }

  return (calendar.events ?? [])
    .filter((event) => event.userId !== requesterId)
    .filter((event) => event.status !== "Rejected")
    .filter((event) => requestOverlapsRange(event, input.startDate, input.endDate));
}

export function buildInitialTimeOffState(users = [...demoUsers, ...clinicalStaff]) {
  const areas = clone(DEFAULT_AREAS);
  const sites = AREA_SITE_TARGETS.map((site) => ({
    ...site,
    status: "active",
    address: "",
  }));

  return {
    areas,
    sites,
    users: users.map((user) => ({
      id: user.id,
      displayName: user.displayName,
      role: user.role,
      username: user.username,
      password: user.password,
      staffId: user.staffId ?? null,
      managerId: user.managerId ?? null,
      scopeType: user.scopeType ?? "self",
      scopeIds: user.scopeIds ?? [user.id],
      areaId: user.areaId ?? null,
      practiceId: user.practiceId ?? null,
      teamId: user.teamId ?? null,
      annualLeaveEntitlement: user.annualLeaveEntitlement ?? 25,
      usedLeaveDays: user.usedLeaveDays ?? 0,
      remainingLeaveDays: user.remainingLeaveDays ?? 25,
      sickLeaveEntitlement: user.sickLeaveEntitlement ?? DEFAULT_SICK_LEAVE_ENTITLEMENT,
      usedSickDays: user.usedSickDays ?? 0,
      remainingSickDays: user.remainingSickDays ?? DEFAULT_SICK_LEAVE_ENTITLEMENT,
      isTempPassword: user.isTempPassword ?? false,
      hrProfile: user.hrProfile ?? {
        jobTitle: roleLabelOf(user.role),
        joinDate: "April 8th, 2024",
        contract: "Full-Time (Permanent)",
        location: "Group Support",
        annualLeaveBalance: user.annualLeaveEntitlement ?? 25,
      },
      email: user.email ?? "",
      phoneExtension: user.phoneExtension ?? "",
      dateOfBirth: user.dateOfBirth ?? "",
      gender: user.gender ?? "",
      startDate: user.startDate ?? "",
      gdcNumber: user.gdcNumber ?? "",
      gdcType: user.gdcType ?? "",
      gdcRenewal: user.gdcRenewal ?? "",
      bio: user.bio ?? "",
      qualifications: user.qualifications ?? [],
      languages: user.languages ?? [],
      documents: user.documents ?? { gdcCertificate: null, indemnity: null, dbs: null },
      profileImage: user.profileImage ?? profileImageForStaffId(user.staffId, user.gender),
      isOnline: user.isOnline === true,
    })),
    requests: [],
    administrativeEvents: [],
    settings: {
      holidayYear: { ...DEFAULT_HOLIDAY_YEAR_START },
    },
  };
}

export function getDirectReports(users, userId) {
  return users.filter((user) => user.managerId === userId);
}

export function getAllReportsBelow(users, userId) {
  const currentUser = users.find((user) => user.id === userId);
  if (currentUser?.scopeType === "global") {
    return users.filter((user) => user.id !== userId);
  }

  const reports = getDirectReports(users, userId);
  return reports.flatMap((report) => [report, ...getAllReportsBelow(users, report.id)]);
}

export function canApprove(users, approverId, requestUserId) {
  return getAllReportsBelow(users, approverId).some((user) => user.id === requestUserId);
}

const organisationNodeOf = (user, users, depth, visited, peopleById, org) => {
  if (visited.has(user.id)) {
    return {
      ...userSnapshotOf(user, users, org),
      username: user.username,
      staffId: user.staffId ?? null,
      jobTitle: user.hrProfile?.jobTitle ?? roleLabelOf(user.role),
      location: user.hrProfile?.location ?? "Group Support",
      managerName: users.find((item) => item.id === user.managerId)?.displayName ?? null,
      depth,
      children: [],
    };
  }

  const nextVisited = new Set(visited);
  nextVisited.add(user.id);

  const node = {
    ...userSnapshotOf(user, users, org),
    username: user.username,
    staffId: user.staffId ?? null,
    jobTitle: user.hrProfile?.jobTitle ?? roleLabelOf(user.role),
    location: user.hrProfile?.location ?? "Group Support",
    managerName: users.find((item) => item.id === user.managerId)?.displayName ?? null,
    depth,
    children: [],
  };

  peopleById[user.id] = node;
  node.children = getDirectReports(users, user.id).map((report) =>
    organisationNodeOf(report, users, depth + 1, nextVisited, peopleById, org),
  );
  return node;
};

export function buildOrganisationMap(state) {
  const users = state.users ?? [];
  const org = {
    areas: areaRecordsOf(state),
    sites: siteTargetsOf(state),
  };
  const peopleById = {};
  const userIds = new Set(users.map((user) => user.id));
  const rootUsers = users.filter((user) => !user.managerId || !userIds.has(user.managerId));

  return {
    roots: rootUsers.map((user) =>
      organisationNodeOf(user, users, 0, new Set(), peopleById, org),
    ),
    peopleById,
    totalPeople: users.length,
  };
}

const nextRoleSequence = (users, managerId, role) =>
  getDirectReports(users, managerId).filter((user) => user.role === role).length + 1;

const scopeLabelFor = (manager, sites = AREA_SITE_TARGETS, areas = DEFAULT_AREAS) => {
  const site = siteOfUser(manager, sites, areas);
  if (site?.name) return site.name;
  if (manager.areaId) return areaLabelOf(manager.areaId, areas, sites);
  if (manager.practiceId) return toTitleCaseFromId(manager.practiceId);
  return "";
};

const makeDisplayNameSuggestion = (
  users,
  managerId,
  role,
  sites = AREA_SITE_TARGETS,
  areas = DEFAULT_AREAS,
) => {
  const manager = users.find((user) => user.id === managerId);
  const label = roleLabelOf(role);
  const sequence = nextRoleSequence(users, managerId, role);
  const site =
    role === "practiceManager"
      ? nextPracticeSiteForManager(users, manager, sequence, sites, areas)
      : null;
  if (site) return `${label} - ${site.name}`;

  const scopeLabel = manager ? scopeLabelFor(manager, sites, areas) : "";

  return scopeLabel ? `${label} ${sequence} - ${scopeLabel}` : `${label} ${sequence}`;
};

export function suggestDirectReportDefaults(state, managerId, role) {
  const users = state.users ?? [];
  const sites = siteTargetsOf(state);
  const areas = areaRecordsOf(state);
  const manager = users.find((user) => user.id === managerId);
  if (!manager) throw makeError("Manager not found", "NOT_FOUND");

  const createableRoles = getCreateableRolesForManager(users, managerId);
  if (createableRoles.length === 0) {
    throw makeError(
      "Direct report creation is only available for people who already have direct reports",
      "NO_DIRECT_REPORTS",
    );
  }

  const selectedRole = role ?? createableRoles[0];
  if (!ROLE_LABELS[selectedRole]) throw makeError("Role is not supported", "VALIDATION");
  if (!createableRoles.includes(selectedRole)) {
    throw makeError("This role is not available under the selected manager", "VALIDATION");
  }

  const username = uniqueUsernameFrom(users, ROLE_USERNAME_PREFIXES[selectedRole] ?? selectedRole);
  return {
    displayName: makeDisplayNameSuggestion(users, managerId, selectedRole, sites, areas),
    role: selectedRole,
    username,
    password: import.meta.env.DEV ? username : undefined,
  };
}

const getCreateableRolesForManager = (users, managerId) => {
  const manager = users.find((user) => user.id === managerId);
  return manager ? getCreateableRolesForRole(manager.role) : [];
};

const canCreateDirectReportForActor = (users, creatorId, managerId) => {
  const creator = users.find((user) => user.id === creatorId);
  const manager = users.find((user) => user.id === managerId);
  if (!creator || !manager) return false;
  if (getCreateableRolesForManager(users, managerId).length === 0) return false;

  if (creatorId === managerId) {
    return SELF_CREATE_DIRECT_REPORT_ROLES.has(manager.role);
  }

  return canApprove(users, creatorId, managerId);
};

const hasPracticeManagerForSite = (users, siteId) =>
  users.some(
    (user) =>
      user.role === "practiceManager" &&
      canonicalSiteIdOf(user.practiceId) === canonicalSiteIdOf(siteId),
  );

const canSeedPracticeManagerForSite = (users, actor, manager, input, sites, areas) => {
  const role = input?.role?.trim();
  const practiceId = canonicalSiteIdOf(input?.practiceId);
  const site = practiceId ? siteTargetById(practiceId, sites, areas) : null;
  return Boolean(
    role === "practiceManager" &&
      actor &&
      manager &&
      actor.id === manager.id &&
      AREA_ADMIN_ROLES.has(actor.role) &&
      site &&
      !hasPracticeManagerForSite(users, site.id),
  );
};

const preferredManagerRank = (managerRole, targetRole) => {
  const preferred = PREFERRED_MANAGER_ROLES_FOR_ROLE[targetRole] ?? [];
  const idx = preferred.indexOf(managerRole);
  return idx === -1 ? Infinity : idx;
};

const visiblePracticesForActor = (
  actor,
  sites = AREA_SITE_TARGETS,
  areas = DEFAULT_AREAS,
) => {
  if (!actor) return [];
  if (actor.scopeType === "global") {
    return sites.map((site) => withSiteAreaName(site, areas, sites));
  }
  if (actor.scopeType === "area" && actor.areaId) {
    return sites
      .filter((site) => site.areaId === actor.areaId)
      .map((site) => withSiteAreaName(site, areas, sites));
  }
  const siteId = canonicalSiteIdOf(actor.practiceId);
  return siteId
    ? sites
        .filter((site) => site.id === siteId)
        .map((site) => withSiteAreaName(site, areas, sites))
    : [];
};

// Builds the wizard's lookup tables: which practices the actor can add staff to,
// which roles each practice supports, and the inferred manager for every
// (practice, role) pair. Pre-computed once per dashboard render — no async calls
// needed during wizard navigation.
const buildStaffWizardOptions = (
  users,
  actorId,
  sites = AREA_SITE_TARGETS,
  areas = DEFAULT_AREAS,
) => {
  const actor = users.find((user) => user.id === actorId);
  const practices = visiblePracticesForActor(actor, sites, areas).map((site) => ({
    id: site.id,
    name: site.name,
    areaId: site.areaId,
    areaName: site.areaName,
  }));

  const rolesByPractice = {};
  const managerByPracticeRole = {};

  for (const practice of practices) {
    const candidateManagers = users.filter((user) => {
      const samePractice = canonicalSiteIdOf(user.practiceId) === practice.id;
      const areaCover = user.role === "areaManager" && user.areaId === practice.areaId;
      if (!samePractice && !areaCover) return false;
      return canCreateDirectReportForActor(users, actorId, user.id);
    });

    const bestManagerByRole = {};
    for (const manager of candidateManagers) {
      const createable = getCreateableRolesForRole(manager.role).filter((role) =>
        PRACTICE_LEVEL_ROLES.has(role),
      );
      for (const role of createable) {
        const current = bestManagerByRole[role];
        if (
          !current ||
          preferredManagerRank(manager.role, role) < preferredManagerRank(current.role, role)
        ) {
          bestManagerByRole[role] = manager;
        }
      }
    }

    // Acting-PM coverage: when no real practice manager exists at this site
    // and the area manager is in the candidate list, the AM auto-covers every
    // practice-level role (until a dedicated PM is created underneath them).
    const hasRealPm = hasPracticeManagerForSite(users, practice.id);
    if (!hasRealPm) {
      const actingAm = candidateManagers.find(
        (user) => user.role === "areaManager" && user.areaId === practice.areaId,
      );
      if (actingAm) {
        for (const role of PRACTICE_LEVEL_ROLES) {
          if (!bestManagerByRole[role]) bestManagerByRole[role] = actingAm;
        }
      }
    }

    if (
      !bestManagerByRole.practiceManager &&
      !hasRealPm &&
      canCreateAreasForActor(actor)
    ) {
      bestManagerByRole.practiceManager = actor;
    }

    const roleEntries = Object.entries(bestManagerByRole);
    if (roleEntries.length === 0) continue;

    rolesByPractice[practice.id] = roleEntries.map(([role]) => ({
      value: role,
      label: roleLabelOf(role),
      clinical: isClinicalRole(role),
    }));

    managerByPracticeRole[practice.id] = Object.fromEntries(
      roleEntries.map(([role, manager]) => [
        role,
        {
          id: manager.id,
          name: manager.displayName,
          roleLabel: roleLabelOf(manager.role),
        },
      ]),
    );
  }

  return {
    practices: practices.filter((practice) => rolesByPractice[practice.id]?.length),
    rolesByPractice,
    managerByPracticeRole,
  };
};

export function inferManagerForPracticeRole(state, actorId, practiceId, role) {
  const options = buildStaffWizardOptions(
    state.users ?? [],
    actorId,
    siteTargetsOf(state),
    areaRecordsOf(state),
  );
  return options.managerByPracticeRole[canonicalSiteIdOf(practiceId)]?.[role] ?? null;
}

const getEditableRolesForUser = (users, userId) => {
  const person = users.find((user) => user.id === userId);
  if (!person?.managerId) return [];

  const roles = getCreateableRolesForManager(users, person.managerId);
  return roles.includes(person.role) ? roles : [person.role, ...roles];
};

const canEditUserForActor = (users, actorId, userId) => {
  const actor = users.find((user) => user.id === actorId);
  const person = users.find((user) => user.id === userId);
  if (!actor || !person) return false;
  if (actor.id === person.id || !person.managerId) return false;
  return canApprove(users, actorId, userId);
};

const editableRolesForActor = (users, actorId, userId) =>
  canEditUserForActor(users, actorId, userId) ? getEditableRolesForUser(users, userId) : [];

const roleOptionsOf = (roles) =>
  roles.map((role) => ({
    value: role,
    label: roleLabelOf(role),
  }));

const uniqueScopedId = (users, prefix, baseSequence) => {
  let sequence = baseSequence;
  let value = `${prefix}-${sequence}`;
  const used = new Set(
    users.flatMap((user) => [user.areaId, user.practiceId, user.teamId].filter(Boolean)),
  );
  while (used.has(value)) {
    sequence += 1;
    value = `${prefix}-${sequence}`;
  }
  return value;
};

const teamPrefixForRole = (role) => {
  if (["clinicalLead", "associateDentist", "foundationDentist"].includes(role)) {
    return "team-clinical";
  }
  if (["leadNurse", "dentalNurse", "traineeDentalNurse"].includes(role)) {
    return "team-nursing";
  }
  if (
    [
      "frontOfHouseLead",
      "receptionist",
      "traineeReceptionist",
      "treatmentCoordinator",
      "juniorTreatmentCoordinator",
    ].includes(role)
  ) {
    return "team-front-house";
  }
  if (["supportAssistant", "traineeEmployee"].includes(role)) return "team-support";
  return "team";
};

const practiceSuffixFor = (manager) =>
  slugify(manager.practiceId || manager.areaId || manager.id || "group");

const deriveTeamId = (users, manager, role, sequence) => {
  if (manager.teamId && !["clinicalLead", "frontOfHouseLead", "leadNurse"].includes(role)) {
    return manager.teamId;
  }

  const prefix = `${teamPrefixForRole(role)}-${practiceSuffixFor(manager)}`;
  return uniqueScopedId(users, prefix, sequence);
};

const deriveNewUserScope = (
  users,
  manager,
  role,
  id,
  sites = AREA_SITE_TARGETS,
  areas = DEFAULT_AREAS,
  requestedPracticeId = null,
) => {
  const directReports = getDirectReports(users, manager.id);
  const roleReports = directReports.filter((report) => report.role === role);
  const template = roleReports[0] ?? {};
  const sequence = roleReports.length + 1;
  const base = {
    areaId: manager.areaId ?? template.areaId ?? null,
    practiceId: manager.practiceId ?? template.practiceId ?? null,
    teamId: manager.teamId ?? template.teamId ?? null,
  };

  if (role === "areaManager") {
    const areaId = uniqueScopedId(users, "area", sequence);
    return {
      scopeType: "area",
      scopeIds: [areaId],
      areaId,
      practiceId: null,
      teamId: null,
    };
  }

  if (role === "practiceManager" && (manager.areaId || requestedPracticeId)) {
    const selectedSite = siteTargetById(requestedPracticeId, sites, areas);
    const site = selectedSite ?? nextPracticeSiteForManager(users, manager, sequence, sites, areas);
    const areaId = site?.areaId ?? manager.areaId;
    const practiceId = site?.id ?? uniqueScopedId(users, `practice-${manager.areaId}`, sequence);
    return {
      scopeType: "practice",
      scopeIds: [practiceId],
      areaId,
      practiceId,
      teamId: null,
    };
  }

  if (role === "deputyPracticeManager") {
    return {
      scopeType: "practice",
      scopeIds: base.practiceId ? [base.practiceId] : [id],
      ...base,
      teamId: null,
    };
  }

  if (["clinicalLead", "frontOfHouseLead", "leadNurse"].includes(role)) {
    const teamId = template.teamId ?? deriveTeamId(users, manager, role, sequence);
    return {
      scopeType: "team",
      scopeIds: [teamId],
      areaId: base.areaId,
      practiceId: base.practiceId,
      teamId,
    };
  }

  return {
    scopeType: "self",
    scopeIds: [id],
    areaId: base.areaId,
    practiceId: base.practiceId,
    teamId: base.teamId,
  };
};

export function createDirectReport(state, creatorId, managerId, input, options = {}) {
  const next = clone(state);
  const sites = siteTargetsOf(next);
  const areas = areaRecordsOf(next);
  const creator = next.users.find((user) => user.id === creatorId);
  const manager = next.users.find((user) => user.id === managerId);
  if (!creator) throw makeError("Creator not found", "NOT_FOUND");
  if (!manager) throw makeError("Manager not found", "NOT_FOUND");

  const createableRoles = getCreateableRolesForManager(next.users, managerId);
  const role = input.role?.trim();
  const displayName = input.displayName?.trim();
  const username = input.username?.trim();
  const password = input.password?.trim();
  const canSeedPracticeManager = canSeedPracticeManagerForSite(
    next.users,
    creator,
    manager,
    { ...input, role },
    sites,
    areas,
  );

  if (createableRoles.length === 0 && !canSeedPracticeManager) {
    throw makeError(
      "Direct report creation is only available for people who already have direct reports",
      "NO_DIRECT_REPORTS",
    );
  }
  if (!canCreateDirectReportForActor(next.users, creatorId, managerId) && !canSeedPracticeManager) {
    throw makeError(
      creatorId === managerId
        ? "Direct report creation for this person must be made by someone above them"
        : "You are not allowed to manage this part of the hierarchy",
      "FORBIDDEN",
    );
  }

  if (!displayName) throw makeError("Name is required", "VALIDATION");
  if (!role || !ROLE_LABELS[role]) throw makeError("Role is required", "VALIDATION");
  if (!createableRoles.includes(role) && !canSeedPracticeManager) {
    throw makeError("This role is not available under the selected manager", "VALIDATION");
  }
  if (!username) throw makeError("Username is required", "VALIDATION");
  if (!password) throw makeError("Password is required", "VALIDATION");
  if (next.users.some((user) => (user.username ?? "").toLowerCase() === username.toLowerCase())) {
    throw makeError("Username is already in use", "VALIDATION");
  }

  const id = uniqueIdFrom(next.users, displayName);
  const hierarchyFields = deriveNewUserScope(
    next.users,
    manager,
    role,
    id,
    sites,
    areas,
    input.practiceId,
  );
  // When the caller (e.g. createAreaWithManager) has already prepared an area
  // for this new area manager, point the user at it instead of generating a
  // fresh, orphan areaId via deriveNewUserScope.
  if (options.targetAreaId && role === "areaManager") {
    hierarchyFields.areaId = options.targetAreaId;
    hierarchyFields.scopeIds = [options.targetAreaId];
  }
  const now = options.now ?? new Date().toISOString();
  const jobTitle = input.jobTitle?.trim() || roleLabelOf(role);
  const staffId = Math.max(0, ...next.users.map((item) => item.staffId ?? 0)) + 1;
  const user = {
    id,
    displayName,
    role,
    username,
    password,
    staffId,
    managerId,
    ...hierarchyFields,
    annualLeaveEntitlement: 25,
    usedLeaveDays: 0,
    remainingLeaveDays: 25,
    sickLeaveEntitlement: DEFAULT_SICK_LEAVE_ENTITLEMENT,
    usedSickDays: 0,
    remainingSickDays: DEFAULT_SICK_LEAVE_ENTITLEMENT,
    isTempPassword: Boolean(input.isTempPassword),
    createdAt: now,
    hrProfile: {
      jobTitle,
      joinDate: input.startDate ? formatJoinDate(input.startDate) : formatJoinDate(now),
      contract: "Full-Time (Permanent)",
      location: inferLocation(manager, hierarchyFields, sites, areas),
      annualLeaveBalance: 25,
    },
    email: input.email?.trim() ?? "",
    phoneExtension: input.phoneExtension?.trim() ?? "",
    dateOfBirth: input.dateOfBirth ?? "",
    gender: input.gender ?? "",
    startDate: input.startDate ?? "",
    gdcNumber: input.gdcNumber?.trim() ?? "",
    gdcType: input.gdcType?.trim() ?? "",
    gdcRenewal: input.gdcRenewal ?? "",
    bio: input.bio?.trim() ?? "",
    qualifications: Array.isArray(input.qualifications) ? input.qualifications.filter(Boolean) : [],
    languages: Array.isArray(input.languages) && input.languages.length ? input.languages.filter(Boolean) : ["English"],
    documents: input.documents ?? { gdcCertificate: null, indemnity: null, dbs: null },
    profileImage: input.profileImage?.trim() || profileImageForStaffId(staffId, input.gender),
    isOnline: false,
  };

  next.users.push(user);
  return { state: next, user };
}

const canUseOrgMoveTools = (user) =>
  user?.scopeType === "global" || user?.role === "areaManager";

const isInActorMoveScope = (users, actor, person) => {
  if (!actor || !person || actor.id === person.id) return false;
  if (actor.scopeType === "global") return true;
  if (actor.role !== "areaManager") return false;
  return person.areaId === actor.areaId && canApprove(users, actor.id, person.id);
};

const canManagerReceiveRole = (users, managerId, role) =>
  getCreateableRolesForManager(users, managerId).includes(role);

const getHierarchyDescendants = (users, userId) =>
  getDirectReports(users, userId).flatMap((report) => [
    report,
    ...getHierarchyDescendants(users, report.id),
  ]);

const deriveMovedUserScope = (user, manager) => {
  const areaId = manager.areaId ?? user.areaId ?? null;
  const practiceId = manager.practiceId ?? user.practiceId ?? null;
  const teamId = user.teamId ?? manager.teamId ?? null;
  const base = {
    areaId,
    practiceId,
    teamId,
  };

  if (["chiefOfStaff", "operationsDirector", "secondInCharge"].includes(user.role)) {
    return {
      scopeType: "global",
      scopeIds: ["all"],
      areaId: null,
      practiceId: null,
      teamId: null,
    };
  }

  if (user.role === "areaManager") {
    const movedAreaId = user.areaId ?? manager.areaId ?? user.id;
    return {
      scopeType: "area",
      scopeIds: [movedAreaId],
      areaId: movedAreaId,
      practiceId: null,
      teamId: null,
    };
  }

  if (user.role === "practiceManager") {
    const movedPracticeId = practiceId ?? user.id;
    return {
      scopeType: "practice",
      scopeIds: [movedPracticeId],
      areaId,
      practiceId: movedPracticeId,
      teamId: null,
    };
  }

  if (user.role === "deputyPracticeManager") {
    return {
      scopeType: "practice",
      scopeIds: base.practiceId ? [base.practiceId] : [user.id],
      ...base,
      teamId: null,
    };
  }

  if (["clinicalLead", "frontOfHouseLead", "leadNurse"].includes(user.role)) {
    const teamId = user.teamId ?? manager.teamId ?? null;
    return {
      scopeType: teamId ? "team" : "self",
      scopeIds: teamId ? [teamId] : [user.id],
      ...base,
      teamId,
    };
  }

  return {
    scopeType: "self",
    scopeIds: [user.id],
    ...base,
  };
};

export function getMoveTargetsForUser(users, actorId, userId) {
  const actor = users.find((user) => user.id === actorId);
  const person = users.find((user) => user.id === userId);
  if (!actor || !person || !canUseOrgMoveTools(actor)) return [];
  if (person.managerId === null) return [];
  if (!isInActorMoveScope(users, actor, person)) return [];

  const descendantIds = new Set(getHierarchyDescendants(users, userId).map((user) => user.id));
  return users.filter((candidate) => {
    if (candidate.id === person.id || candidate.id === person.managerId) return false;
    if (descendantIds.has(candidate.id)) return false;
    if (!isInActorMoveScope(users, actor, candidate)) return false;
    return canManagerReceiveRole(users, candidate.id, person.role);
  });
}

export function moveUserInHierarchy(state, actorId, userId, newManagerId) {
  const next = clone(state);
  const sites = siteTargetsOf(next);
  const areas = areaRecordsOf(next);
  const actor = next.users.find((user) => user.id === actorId);
  const person = next.users.find((user) => user.id === userId);
  const newManager = next.users.find((user) => user.id === newManagerId);

  if (!actor) throw makeError("Mover not found", "NOT_FOUND");
  if (!person) throw makeError("Person not found", "NOT_FOUND");
  if (!newManager) throw makeError("New manager not found", "NOT_FOUND");
  if (!canUseOrgMoveTools(actor)) {
    throw makeError("Organisation moves are only available from Area manager level or above", "FORBIDDEN");
  }
  if (person.id === actor.id) {
    throw makeError("You cannot move yourself in the organisation map", "VALIDATION");
  }

  const validTargets = getMoveTargetsForUser(next.users, actorId, userId);
  if (!validTargets.some((target) => target.id === newManagerId)) {
    throw makeError("You are not allowed to move this person to that manager", "FORBIDDEN");
  }

  const descendants = getHierarchyDescendants(next.users, userId);
  const usersById = new Map(next.users.map((user) => [user.id, user]));
  const movedUsersById = new Map();
  const nextScope = deriveMovedUserScope(person, newManager);
  const movedUser = {
    ...person,
    managerId: newManagerId,
    ...nextScope,
    hrProfile: {
      ...person.hrProfile,
      location: inferLocation(newManager, nextScope, sites, areas),
    },
  };
  movedUsersById.set(userId, movedUser);

  for (const descendant of descendants) {
    const updatedManager =
      movedUsersById.get(descendant.managerId) ?? usersById.get(descendant.managerId);
    if (!updatedManager) continue;
    const descendantScope = deriveMovedUserScope(descendant, updatedManager);
    movedUsersById.set(descendant.id, {
      ...descendant,
      ...descendantScope,
      hrProfile: {
        ...descendant.hrProfile,
        location: inferLocation(updatedManager, descendantScope, sites, areas),
      },
    });
  }

  next.users = next.users.map((user) => movedUsersById.get(user.id) ?? user);
  next.requests = next.requests.map((request) =>
    request.userId === userId && request.status === "Pending"
      ? { ...request, approverId: newManagerId }
      : request,
  );

  return { state: next, user: movedUser };
}

export function getEditableUserIdsForActor(users, actorId) {
  return users
    .filter((user) => canEditUserForActor(users, actorId, user.id))
    .map((user) => user.id);
}

export function updateUserDetails(state, actorId, userId, input) {
  const next = clone(state);
  const sites = siteTargetsOf(next);
  const areas = areaRecordsOf(next);
  const actor = next.users.find((user) => user.id === actorId);
  const person = next.users.find((user) => user.id === userId);

  if (!actor) throw makeError("Editor not found", "NOT_FOUND");
  if (!person) throw makeError("User not found", "NOT_FOUND");
  if (actor.id === person.id) {
    throw makeError("You cannot edit yourself from the organisation map", "VALIDATION");
  }
  if (!canEditUserForActor(next.users, actorId, userId)) {
    throw makeError("You are not allowed to edit this user", "FORBIDDEN");
  }

  const displayName = input.displayName?.trim();
  const role = input.role?.trim();
  const editableRoles = editableRolesForActor(next.users, actorId, userId);
  if (!displayName) throw makeError("Name is required", "VALIDATION");
  if (!role || !ROLE_LABELS[role]) throw makeError("Role is required", "VALIDATION");
  if (!editableRoles.includes(role)) {
    throw makeError("This role is not available under the selected manager", "VALIDATION");
  }

  const manager = next.users.find((user) => user.id === person.managerId);
  if (!manager) throw makeError("Manager not found", "NOT_FOUND");

  const descendants = getHierarchyDescendants(next.users, userId);
  const usersById = new Map(next.users.map((user) => [user.id, user]));
  const updatedUsersById = new Map();
  const nextScope = deriveMovedUserScope({ ...person, role }, manager);
  const staffPatch = pickStaffProfileFields(input);
  const updatedUser = {
    ...person,
    ...staffPatch,
    displayName,
    role,
    ...nextScope,
    hrProfile: {
      ...person.hrProfile,
      jobTitle: input.jobTitle?.trim() || roleLabelOf(role),
      location: inferLocation(manager, nextScope, sites, areas),
    },
  };
  updatedUsersById.set(userId, updatedUser);

  for (const descendant of descendants) {
    const updatedManager =
      updatedUsersById.get(descendant.managerId) ?? usersById.get(descendant.managerId);
    if (!updatedManager) continue;
    const descendantScope = deriveMovedUserScope(descendant, updatedManager);
    updatedUsersById.set(descendant.id, {
      ...descendant,
      ...descendantScope,
      hrProfile: {
        ...descendant.hrProfile,
        location: inferLocation(updatedManager, descendantScope, sites, areas),
      },
    });
  }

  next.users = next.users.map((user) => updatedUsersById.get(user.id) ?? user);
  return { state: next, user: updatedUser };
}

const canDeleteUser = (users, actorId, userId) => {
  const actor = users.find((user) => user.id === actorId);
  const person = users.find((user) => user.id === userId);
  if (!actor || !person) return false;
  if (actor.id === person.id || !person.managerId) return false;
  return canApprove(users, actorId, userId);
};

export function getDeleteableUserIdsForActor(users, actorId) {
  return users
    .filter((user) => canDeleteUser(users, actorId, user.id))
    .map((user) => user.id);
}

export function deleteUserFromHierarchy(state, actorId, userId, options = {}) {
  const next = clone(state);
  const actor = next.users.find((user) => user.id === actorId);
  const person = next.users.find((user) => user.id === userId);

  if (!actor) throw makeError("Deleter not found", "NOT_FOUND");
  if (!person) throw makeError("User not found", "NOT_FOUND");
  if (actor.id === person.id) {
    throw makeError("You cannot delete yourself from the organisation map", "VALIDATION");
  }
  if (!person.managerId) {
    throw makeError("Top-level users cannot be deleted from this mock org map", "VALIDATION");
  }
  if (!canApprove(next.users, actorId, userId)) {
    throw makeError("You are not allowed to delete this user", "FORBIDDEN");
  }

  const descendants = getHierarchyDescendants(next.users, userId);
  if (descendants.length > 0 && !options.cascade) {
    throw makeError(
      "Deleting this user requires cascade confirmation because they have people underneath them.",
      "CASCADE_CONFIRMATION_REQUIRED",
      { affectedUserIds: [person.id, ...descendants.map((user) => user.id)] },
    );
  }

  const deletedAt = options.now ?? new Date().toISOString();
  const deletedUsers = [person, ...descendants].map((user) => ({ ...user, deletedAt }));
  const deletedIds = new Set(deletedUsers.map((user) => user.id));
  const deletedUser = deletedUsers[0];
  next.users = next.users.filter((user) => !deletedIds.has(user.id));
  next.requests = next.requests
    .filter((request) => !deletedIds.has(request.userId))
    .map((request) =>
      deletedIds.has(request.approverId)
        ? { ...request, approverId: null, decisionComment: request.decisionComment || "Approver was removed" }
        : request,
    );

  return { state: next, user: deletedUser, deletedUsers };
}

export function createArea(state, actorId, input, options = {}) {
  const next = clone(state);
  next.areas = areaRecordsOf(next).map((area) => ({ ...area }));
  next.sites = siteTargetsOf(next).map((site) => ({ ...site }));
  const actor = next.users.find((user) => user.id === actorId);
  if (!actor) throw makeError("Area creator not found", "NOT_FOUND");
  if (!canCreateAreasForActor(actor)) {
    throw makeError(
      "Only the owner, chief of staff, or operations director can create areas",
      "FORBIDDEN",
    );
  }

  const name = input.name?.trim();
  if (!name) throw makeError("Area name is required", "VALIDATION");
  if (next.areas.some((area) => area.name.toLowerCase() === name.toLowerCase())) {
    throw makeError("An area with this name already exists", "VALIDATION");
  }

  const area = {
    id: uniqueRecordIdFrom(next.areas, "area", name),
    name,
    managerId: input.managerId?.trim() ?? "",
    status: input.status?.trim() || "active",
    description: input.description?.trim() ?? "",
    siteIds: [],
    createdAt: options.now ?? new Date().toISOString(),
  };

  next.areas.push(area);
  return { state: next, area };
}

export function createSite(state, actorId, areaId, input, options = {}) {
  const next = clone(state);
  next.areas = areaRecordsOf(next).map((area) => ({ ...area }));
  next.sites = siteTargetsOf(next).map((site) => ({ ...site }));
  const actor = next.users.find((user) => user.id === actorId);
  const area = next.areas.find((item) => item.id === areaId);
  if (!actor) throw makeError("Site creator not found", "NOT_FOUND");
  if (!area) throw makeError("Area not found", "NOT_FOUND");
  if (!canCreateSitesForActor(actor, areaId)) {
    throw makeError("You are not allowed to add sites to this area", "FORBIDDEN");
  }

  const name = input.name?.trim();
  if (!name) throw makeError("Site name is required", "VALIDATION");
  if (
    next.sites.some(
      (site) => site.areaId === areaId && site.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    throw makeError("A site with this name already exists in this area", "VALIDATION");
  }

  const site = {
    id: uniqueRecordIdFrom(next.sites, "site", name),
    name,
    areaId,
    areaName: area.name,
    address: input.address?.trim() ?? "",
    status: input.status?.trim() || "active",
    createdAt: options.now ?? new Date().toISOString(),
  };

  next.sites.push(site);
  next.areas = next.areas.map((item) =>
    item.id === areaId
      ? { ...item, siteIds: [...new Set([...(item.siteIds ?? []), site.id])] }
      : item,
  );
  return { state: next, site };
}

// Every user whose role can validly parent an area manager per ROLE_CHILD_ROLES.
// Sorted from most senior down so the wizard's dropdown reads naturally:
// owner first, then CoS / OD, then SecondInCharge.
const AREA_MANAGER_PARENT_ROLE_ORDER = [
  "companyOwner",
  "chiefOfStaff",
  "operationsDirector",
  "secondInCharge",
];

export const getAreaManagerParentCandidates = (users = []) => {
  const sorted = [];
  for (const role of AREA_MANAGER_PARENT_ROLE_ORDER) {
    for (const user of users) {
      if (user.role === role) sorted.push(user);
    }
  }
  return sorted.filter((user) =>
    getCreateableRolesForRole(user.role).includes("areaManager"),
  );
};

// Picks the default parent for a new area manager. The dropdown lets the user
// pick anyone above them in the company; this just seeds the initial selection.
// Preference order: SecondInCharge → OperationsDirector → ChiefOfStaff →
// CompanyOwner (matches the existing demo hierarchy where AMs report to SIC).
const pickAreaManagerParent = (users, actorId, excludeUserId = "") => {
  const actor = users.find((user) => user.id === actorId);
  if (!actor) return null;

  const preference = ["secondInCharge", "operationsDirector", "chiefOfStaff", "companyOwner"];
  for (const preferredRole of preference) {
    const candidate = users.find((user) => user.role === preferredRole);
    if (candidate?.id === excludeUserId) continue;
    if (candidate && canCreateDirectReportForActor(users, actorId, candidate.id)) {
      return candidate;
    }
  }
  return null;
};

// Users an Add-Area wizard is allowed to promote into the AM seat. Excludes the
// company owner (can't demote the root) and existing area managers (would
// orphan their current area — flag deferred to a future Edit-Area flow).
export const getPromoteableToAreaManager = (users = []) => {
  return users.filter(
    (user) => user.role !== "companyOwner" && user.role !== "areaManager",
  );
};

// Picks a fallback manager when promoting a user with direct reports — those
// reports cascade up so nothing is orphaned.
const cascadeOldReportsTo = (users, promotedUserId) => {
  const promoted = users.find((user) => user.id === promotedUserId);
  return promoted?.managerId ?? null;
};

// In-place promotion: changes the user's role to areaManager, repoints them at
// the new area, and re-parents any direct reports of theirs to whoever they
// used to report to.
const promoteUserToAreaManager = (state, userId, areaId, parentId, options = {}) => {
  const promoted = state.users.find((user) => user.id === userId);
  if (!promoted) throw makeError("User to promote not found", "NOT_FOUND");
  if (promoted.role === "companyOwner") {
    throw makeError("The company owner cannot be promoted to an area manager", "VALIDATION");
  }
  if (promoted.role === "areaManager") {
    throw makeError("This user is already an area manager", "VALIDATION");
  }

  const oldManagerId = cascadeOldReportsTo(state.users, userId);
  const now = options.now ?? new Date().toISOString();

  const nextUsers = state.users.map((user) => {
    if (user.id === userId) {
      return {
        ...user,
        role: "areaManager",
        managerId: parentId,
        scopeType: "area",
        scopeIds: [areaId],
        areaId,
        practiceId: null,
        teamId: null,
        promotedAt: now,
        hrProfile: {
          ...user.hrProfile,
          jobTitle: "Area Manager",
        },
      };
    }
    // Re-parent any direct reports of the promoted user to their old manager
    // so the org tree stays connected.
    if (user.managerId === userId) {
      return { ...user, managerId: oldManagerId };
    }
    return user;
  });

  return { ...state, users: nextUsers };
};

// Atomically creates a new area record AND either creates a new area manager
// user OR promotes an existing one into that seat. Either step throwing means
// no state mutation is returned to callers.
//
// Inputs:
//   areaInput: { name, description }
//   managerInput: either { ...new user fields, parentId? } or { promoteUserId, parentId? }
export function createAreaWithManager(state, creatorId, areaInput, managerInput, options = {}) {
  const areaResult = createArea(state, creatorId, areaInput, options);

  // Optional initial sites are created in the same atomic call so the new area
  // arrives stocked with its practice locations.
  let stateAfterSites = areaResult.state;
  const requestedSites = Array.isArray(areaInput.sites) ? areaInput.sites : [];
  for (const siteInput of requestedSites) {
    if (!siteInput?.name?.trim?.()) continue;
    const siteResult = createSite(
      stateAfterSites,
      creatorId,
      areaResult.area.id,
      siteInput,
      options,
    );
    stateAfterSites = siteResult.state;
  }

  // Resolve the parent the AM will report to: explicit pick > auto-resolved.
  const explicitParentId = managerInput.parentId?.trim?.() ?? "";
  if (managerInput.promoteUserId && explicitParentId === managerInput.promoteUserId) {
    throw makeError("An area manager cannot report to themselves", "VALIDATION");
  }
  let parent = null;
  if (explicitParentId) {
    parent = stateAfterSites.users.find((user) => user.id === explicitParentId);
    if (!parent) throw makeError("Selected reports-to person not found", "NOT_FOUND");
    if (!getCreateableRolesForRole(parent.role).includes("areaManager")) {
      throw makeError(
        "The chosen reports-to person isn't allowed to parent an area manager",
        "VALIDATION",
      );
    }
  } else {
    parent = pickAreaManagerParent(stateAfterSites.users, creatorId, managerInput.promoteUserId);
  }
  if (!parent) {
    throw makeError(
      "No eligible parent available for the new area manager. Add a Chief of Staff, Operations Director, or Second in Charge first.",
      "FORBIDDEN",
    );
  }

  // Branch on create-new vs promote-existing.
  if (managerInput.promoteUserId) {
    const promotedState = promoteUserToAreaManager(
      stateAfterSites,
      managerInput.promoteUserId,
      areaResult.area.id,
      parent.id,
      options,
    );
    const promotedUser = promotedState.users.find(
      (user) => user.id === managerInput.promoteUserId,
    );
    // Update the area's managerId + AM's hrProfile.location to the area name.
    const finalUsers = promotedState.users.map((user) =>
      user.id === promotedUser.id
        ? {
            ...user,
            hrProfile: {
              ...user.hrProfile,
              location: areaResult.area.name,
            },
          }
        : user,
    );
    const finalAreas = (promotedState.areas ?? []).map((area) =>
      area.id === areaResult.area.id ? { ...area, managerId: promotedUser.id } : area,
    );
    const finalState = { ...promotedState, users: finalUsers, areas: finalAreas };
    return {
      state: finalState,
      area: finalAreas.find((area) => area.id === areaResult.area.id),
      user: finalUsers.find((user) => user.id === promotedUser.id),
    };
  }

  // Create-new path.
  const userResult = createDirectReport(
    stateAfterSites,
    creatorId,
    parent.id,
    { ...managerInput, role: "areaManager" },
    { ...options, targetAreaId: areaResult.area.id },
  );

  const finalUsers = userResult.state.users.map((user) =>
    user.id === userResult.user.id
      ? {
          ...user,
          hrProfile: {
            ...user.hrProfile,
            location: areaResult.area.name,
          },
        }
      : user,
  );
  const finalAreas = (userResult.state.areas ?? []).map((area) =>
    area.id === areaResult.area.id ? { ...area, managerId: userResult.user.id } : area,
  );

  const finalState = {
    ...userResult.state,
    users: finalUsers,
    areas: finalAreas,
  };
  const finalUser = finalUsers.find((user) => user.id === userResult.user.id);
  const finalArea = finalAreas.find((area) => area.id === areaResult.area.id);

  return { state: finalState, area: finalArea, user: finalUser };
}

// Returns the records that must be moved before an area can be deleted. Area
// deletion never cascades into sites or user accounts: those are regulated
// organisation records and require an explicit reassignment workflow.
const previewAreaDeletionImpact = (state, areaId) => {
  const users = state.users ?? [];
  const sites = siteTargetsOf(state);
  const areas = areaRecordsOf(state);
  const affectedSites = sites.filter((site) => site.areaId === areaId);
  const affectedSiteIds = new Set(affectedSites.map((site) => site.id));
  const affectedUsers = users.filter(
    (user) => user.areaId === areaId || affectedSiteIds.has(siteOfUser(user, sites, areas)?.id),
  );
  return {
    affectedSiteCount: affectedSites.length,
    affectedUserCount: affectedUsers.length,
    affectedSiteNames: affectedSites.map((site) => site.name),
    affectedUserNames: affectedUsers.map((user) => user.displayName),
  };
};

// The historical function name is retained as a production swap seam, but the
// operation is deliberately non-cascading. An area can only be removed after
// its sites and people have been reassigned, and the action is recorded in the
// local administrative event ledger. The future API must enforce the same
// invariant and write its durable audit record server-side.
export function deleteAreaWithCascade(state, actorId, areaId, options = {}) {
  const next = clone(state);
  next.areas = areaRecordsOf(next).map((area) => ({ ...area }));
  next.sites = siteTargetsOf(next).map((site) => ({ ...site }));

  const actor = next.users.find((user) => user.id === actorId);
  if (!actor) throw makeError("Deleter not found", "NOT_FOUND");
  if (!canCreateAreasForActor(actor)) {
    throw makeError(
      "Only the owner, chief of staff, or operations director can delete areas",
      "FORBIDDEN",
    );
  }

  const area = next.areas.find((item) => item.id === areaId);
  if (!area) throw makeError("Area not found", "NOT_FOUND");

  const submittedText = (options.confirmationText ?? "").trim();
  if (submittedText !== area.name) {
    throw makeError(
      `Type the area name "${area.name}" exactly to confirm deletion.`,
      "CONFIRMATION_REQUIRED",
      { expected: area.name, received: submittedText },
    );
  }

  const impact = previewAreaDeletionImpact(next, areaId);
  if (impact.affectedSiteCount > 0 || impact.affectedUserCount > 0) {
    throw makeError(
      "Move every site and person out of this area before deleting it.",
      "AREA_NOT_EMPTY",
      impact,
    );
  }

  const deletedAt = options.now ?? new Date().toISOString();

  next.areas = next.areas.filter((item) => item.id !== areaId);
  next.administrativeEvents = [
    ...(next.administrativeEvents ?? []),
    {
      id: uniqueRecordIdFrom(next.administrativeEvents ?? [], "admin-event", `${areaId}-${deletedAt}`),
      action: "area.deleted",
      actorId,
      targetType: "area",
      targetId: areaId,
      targetName: area.name,
      occurredAt: deletedAt,
    },
  ];

  return {
    state: next,
    deletedArea: { ...area, deletedAt },
    deletedSites: [],
    deletedUsers: [],
  };
}

export function validateTimeOffRequest(input) {
  const errors = {};
  if (!input.startDate) errors.startDate = "Start date is required";
  if (!input.endDate) errors.endDate = "End date is required";
  if (!input.absenceType) errors.absenceType = "Absence type is required";
  if (input.absenceType && !ABSENCE_TYPES.includes(input.absenceType)) {
    errors.absenceType = "Absence type is not supported";
  }

  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  if (start && end && end < start) errors.endDate = "End date cannot be before start date";

  const requestedDays = calculateWorkingDays(input.startDate, input.endDate);
  if (start && end && requestedDays <= 0) {
    errors.requestedDays = "Requested days must be greater than 0";
  }

  return { isValid: Object.keys(errors).length === 0, errors, requestedDays };
}

export function updateLeaveBalanceAfterApproval(state, request) {
  const bucket = leaveBucketForAbsenceType(request.absenceType);
  // Annual-leave balance is derived from approved requests + the current
  // holiday-year window at read time. Don't mutate the stored fields here —
  // they'd diverge from the derived value the moment a year rolls over.
  if (bucket !== "sick") return state;

  const next = clone(state);
  next.users = next.users.map((user) =>
    user.id === request.userId
      ? {
          ...user,
          usedSickDays: (user.usedSickDays ?? 0) + request.requestedDays,
          remainingSickDays:
            (user.remainingSickDays ?? user.sickLeaveEntitlement ?? DEFAULT_SICK_LEAVE_ENTITLEMENT) -
            request.requestedDays,
        }
      : user,
  );
  return next;
}

export function createTimeOffRequest(state, userId, input, options = {}) {
  const user = state.users.find((item) => item.id === userId);
  if (!user) throw makeError("User not found", "NOT_FOUND");

  const validation = validateTimeOffRequest(input);
  if (!validation.isValid) {
    throw makeError(Object.values(validation.errors)[0], "VALIDATION", validation.errors);
  }

  const createdAt = options.now ?? new Date().toISOString();
  const approverId = user.managerId ?? null;
  const request = {
    id: options.id ?? `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    absenceType: input.absenceType,
    startDate: input.startDate,
    endDate: input.endDate,
    requestedDays: validation.requestedDays,
    comment: input.comment?.trim() ?? "",
    status: approverId ? "Pending" : "Approved",
    approverId,
    createdAt,
    decidedAt: approverId ? null : createdAt,
    decisionComment: approverId ? "" : "Self-managed - no approver required",
    selfManaged: !approverId,
  };

  let next = { ...clone(state), requests: [...state.requests, request] };
  if (!approverId) next = updateLeaveBalanceAfterApproval(next, request);

  return { state: next, request };
}

export function decideTimeOffRequest(state, approverId, requestId, decision, options = {}) {
  if (!["Approved", "Rejected"].includes(decision)) {
    throw makeError("Decision must be Approved or Rejected");
  }

  const next = clone(state);
  const request = next.requests.find((item) => item.id === requestId);
  if (!request) throw makeError("Request not found", "NOT_FOUND");
  if (request.status !== "Pending") throw makeError("Only pending requests can be decided");
  if (!canApprove(next.users, approverId, request.userId)) {
    throw makeError("Approver is not in the requester's hierarchy", "FORBIDDEN");
  }

  const requester = next.users.find((user) => user.id === request.userId);
  const bucket = leaveBucketForAbsenceType(request.absenceType);
  // For annual leave, balance is derived from approved requests inside the
  // holiday-year window that contains this request's start date — so a future
  // request for next year doesn't fail this year's balance check.
  const annualWindow =
    bucket === "annual"
      ? getCurrentHolidayYearWindow(next.settings, request.startDate || options.now)
      : null;
  const requestedBucketBalance = balanceForBucket(
    requester,
    bucket,
    next.requests,
    annualWindow,
  );
  if (
    decision === "Approved" &&
    requestedBucketBalance.remaining - request.requestedDays < 0 &&
    !canUseNegativeBalance(request.absenceType)
  ) {
    throw makeError("Insufficient remaining balance", "BALANCE_EXCEEDED");
  }

  request.status = decision;
  request.approverId = approverId;
  request.decidedAt = options.now ?? new Date().toISOString();
  request.decisionComment = options.decisionComment?.trim() ?? "";

  const finalState =
    decision === "Approved" ? updateLeaveBalanceAfterApproval(next, request) : next;
  const finalRequest = finalState.requests.find((item) => item.id === requestId);

  return { state: finalState, request: finalRequest };
}

const siteTargetsVisibleToUser = (
  currentUser,
  visibleUsers,
  sites = AREA_SITE_TARGETS,
  areas = DEFAULT_AREAS,
) => {
  if (currentUser.scopeType === "global") {
    return sites.map((site) => withSiteAreaName(site, areas, sites));
  }

  if (currentUser.scopeType === "area" && currentUser.areaId) {
    return sites
      .filter((site) => site.areaId === currentUser.areaId)
      .map((site) => withSiteAreaName(site, areas, sites));
  }

  const visibleSiteIds = new Set(
    visibleUsers.map((user) => siteOfUser(user, sites, areas)?.id).filter(Boolean),
  );
  return sites
    .filter((site) => visibleSiteIds.has(site.id))
    .map((site) => withSiteAreaName(site, areas, sites));
};

const buildSiteCoverage = (
  users,
  currentUser,
  reports,
  sites = AREA_SITE_TARGETS,
  areas = DEFAULT_AREAS,
) => {
  const visibleUsers = [currentUser, ...reports];
  const visibleTargets = siteTargetsVisibleToUser(currentUser, visibleUsers, sites, areas);
  const customSiteIds = new Set(visibleTargets.map((site) => site.id));
  const customSites = visibleUsers
    .map((user) => siteOfUser(user, sites, areas))
    .filter((site) => site && !customSiteIds.has(site.id));

  return [...visibleTargets, ...customSites].map((site) => {
    const sitePeople = visibleUsers.filter((user) => siteOfUser(user, sites, areas)?.id === site.id);
    const manager = sitePeople.find((user) => user.role === "practiceManager");
    return {
      ...site,
      peopleCount: sitePeople.length,
      managerId: manager?.id ?? "",
      managerName: manager?.displayName ?? "",
      occupied: sitePeople.length > 0,
    };
  });
};

const buildTeamSettings = (users, currentUser, reports, siteCoverage, org = {}) => {
  const visibleUsers = [currentUser, ...reports];
  const people = visibleUsers.map((user) => userSnapshotOf(user, users, org));

  return {
    siteCoverage,
    people,
    managers: people.filter((person) =>
      canCreateDirectReportForActor(users, currentUser.id, person.id),
    ),
  };
};

const calendarPeopleForUser = (
  users,
  currentUser,
  sites = AREA_SITE_TARGETS,
  areas = DEFAULT_AREAS,
) => {
  if (currentUser.scopeType === "global") {
    return {
      scopeLabel: "Whole company",
      scopeDescription: "All areas and practice locations",
      people: users,
    };
  }

  if (currentUser.scopeType === "area" && currentUser.areaId) {
    return {
      scopeLabel: areaLabelOf(currentUser.areaId, areas, sites),
      scopeDescription: summarizeSiteNames(
        sites.filter((site) => site.areaId === currentUser.areaId).map((site) => site.name),
      ),
      people: users.filter((user) => user.areaId === currentUser.areaId),
    };
  }

  const currentSite = siteOfUser(currentUser, sites, areas);
  if (currentSite) {
    return {
      scopeLabel: `${currentSite.name} team`,
      scopeDescription: currentSite.areaName,
      people: users.filter(
        (user) => siteOfUser(user, sites, areas)?.id === currentSite.id,
      ),
    };
  }

  const fallbackPeople = [currentUser, ...getAllReportsBelow(users, currentUser.id)];
  return {
    scopeLabel: `${currentUser.displayName} team`,
    scopeDescription: "Reporting line",
    people: fallbackPeople,
  };
};

const shouldShowRequestInCalendar = (users, viewerId, request) => {
  if (request.status === "Approved") return true;
  if (request.status !== "Pending") return false;
  return request.userId === viewerId || canApprove(users, viewerId, request.userId);
};

const summarizeCalendarEvents = (events, today = new Date()) => {
  const todayIso = isoDateOf(today);
  const { weekStart, weekEnd } = weekRangeOf(todayIso);
  const upcomingEnd = addDaysToIsoDate(todayIso, 14);
  const approvedEvents = events.filter((event) => event.status === "Approved");

  return {
    today: todayIso,
    weekStart,
    weekEnd,
    upcomingEnd,
    offToday: approvedEvents.filter((event) => requestOverlapsRange(event, todayIso, todayIso)),
    offThisWeek: approvedEvents.filter((event) => requestOverlapsRange(event, weekStart, weekEnd)),
    upcoming: approvedEvents.filter((event) => requestOverlapsRange(event, todayIso, upcomingEnd)),
  };
};

const buildTeamCalendar = (state, currentUser, org, options = {}) => {
  const users = state.users ?? [];
  const sites = org.sites ?? AREA_SITE_TARGETS;
  const areas = org.areas ?? DEFAULT_AREAS;
  const calendarScope = calendarPeopleForUser(users, currentUser, sites, areas);
  const people = calendarScope.people.map((user) => userSnapshotOf(user, users, org));
  const visibleUserIds = new Set(people.map((person) => person.id));

  const events = (state.requests ?? [])
    .filter((request) => visibleUserIds.has(request.userId))
    .filter((request) => shouldShowRequestInCalendar(users, currentUser.id, request))
    .map((request) => withRequestPeople(request, users, org))
    .filter((request) => request.requester)
    .map((request) => ({
      id: request.id,
      userId: request.userId,
      person: request.requester,
      approver: request.approver,
      absenceType: request.absenceType,
      status: request.status,
      startDate: request.startDate,
      endDate: request.endDate,
      requestedDays: request.requestedDays,
      comment: request.comment,
      createdAt: request.createdAt,
      decidedAt: request.decidedAt,
      selfManaged: request.selfManaged === true,
    }))
    .sort(
      (a, b) =>
        a.startDate.localeCompare(b.startDate) ||
        a.person.name.localeCompare(b.person.name) ||
        a.id.localeCompare(b.id),
    );

  return {
    scopeLabel: calendarScope.scopeLabel,
    scopeDescription: calendarScope.scopeDescription,
    people,
    events,
    summary: summarizeCalendarEvents(events, options.today),
    peopleCount: people.length,
    eventsCount: events.length,
  };
};

const canCreateAreasForActor = (actor) => AREA_ADMIN_ROLES.has(actor?.role);

const canCreateSitesForActor = (actor, areaId) => {
  if (!actor) return false;
  if (canCreateAreasForActor(actor)) return true;
  return actor.role === "areaManager" && actor.areaId === areaId;
};

const buildAreaManagement = (state, currentUser) => {
  const users = state.users ?? [];
  const areas = areaRecordsOf(state);
  const sites = siteTargetsOf(state);

  // Pre-compute wizard lookups so the UI never has to re-derive permissions.
  const parentCandidates = getAreaManagerParentCandidates(users).map((user) => ({
    id: user.id,
    name: user.displayName,
    roleLabel: roleLabelOf(user.role),
  }));
  const defaultParent = pickAreaManagerParent(users, currentUser.id);
  const promoteableUsers = canCreateAreasForActor(currentUser)
    ? getPromoteableToAreaManager(users).map((user) => {
        const site = siteOfUser(user, sites, areas);
        return {
          id: user.id,
          name: user.displayName,
          roleLabel: roleLabelOf(user.role),
          email: user.email ?? "",
          phoneExtension: user.phoneExtension ?? "",
          siteName: site?.name ?? "",
          areaName: user.areaId ? areaLabelOf(user.areaId, areas, sites) : "",
          directReportCount: getDirectReports(users, user.id).length,
        };
      })
    : [];

  return {
    canCreateAreas: canCreateAreasForActor(currentUser),
    parentCandidates,
    defaultParentId: defaultParent?.id ?? "",
    promoteableUsers,
    areas: areas
      .map((area) => {
        const areaManagerForArea =
          users.find((user) => user.id === area.managerId) ??
          users.find((user) => user.role === "areaManager" && user.areaId === area.id) ??
          null;
        const areaSites = sites
          .filter((site) => site.areaId === area.id)
          .map((site) => {
            const decoratedSite = withSiteAreaName(site, areas, sites);
            const sitePeople = users.filter(
              (person) => siteOfUser(person, sites, areas)?.id === decoratedSite.id,
            );
            const practiceManager = sitePeople.find((person) => person.role === "practiceManager");
            const hasPm = Boolean(practiceManager);
            return {
              ...decoratedSite,
              peopleCount: sitePeople.length,
              managerId: practiceManager?.id ?? "",
              managerName: practiceManager?.displayName ?? "",
              occupied: sitePeople.length > 0,
              // When no real PM exists, the area manager is the acting PM (the
              // implicit-fallback model). UI uses this to label site headers.
              actingManagerId: hasPm ? "" : areaManagerForArea?.id ?? "",
              actingManagerName: hasPm ? "" : areaManagerForArea?.displayName ?? "",
            };
          });
        const manager = areaManagerForArea;

        const impact = previewAreaDeletionImpact(state, area.id);
        return {
          ...area,
          siteIds: areaSites.map((site) => site.id),
          sites: areaSites,
          siteNames: areaSites.map((site) => site.name),
          siteLabel: summarizeSiteNames(areaSites.map((site) => site.name)),
          managerId: manager?.id ?? area.managerId ?? "",
          managerName: manager?.displayName ?? "",
          managerRoleLabel: manager ? roleLabelOf(manager.role) : "",
          peopleCount: users.filter((user) => user.areaId === area.id).length,
          canCreateSite: canCreateSitesForActor(currentUser, area.id),
          canDelete: canCreateAreasForActor(currentUser),
          canDeleteNow:
            canCreateAreasForActor(currentUser) &&
            impact.affectedSiteCount === 0 &&
            impact.affectedUserCount === 0,
          deletionImpact: impact,
        };
      }),
  };
};

export function canManageLeaveSettings(users, actorId) {
  const actor = users.find((user) => user.id === actorId);
  return LEAVE_SETTINGS_ADMIN_ROLES.has(actor?.role);
}

const buildLeaveSettings = (state, currentUser, org) => {
  const canManage = canManageLeaveSettings(state.users, currentUser.id);
  return {
    canManage,
    people: canManage
      ? state.users
          .map((user) => userSnapshotOf(user, state.users, org))
          .sort(
            (a, b) =>
              String(a.siteName || a.areaName || "Group").localeCompare(
                String(b.siteName || b.areaName || "Group"),
              ) || a.name.localeCompare(b.name),
          )
      : [],
  };
};

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object ?? {}, key);

const entitlementNumberFrom = (value, label) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw makeError(`${label} must be zero or higher`, "VALIDATION");
  }
  return Math.round(number * 2) / 2;
};

export function updateUserLeaveEntitlements(state, actorId, userId, input) {
  const next = clone(state);
  if (!canManageLeaveSettings(next.users, actorId)) {
    throw makeError("Only company leadership can manage leave settings", "FORBIDDEN");
  }

  const person = next.users.find((user) => user.id === userId);
  if (!person) throw makeError("User not found", "NOT_FOUND");

  const usedLeaveDays = person.usedLeaveDays ?? 0;
  const usedSickDays = person.usedSickDays ?? 0;
  const annualLeaveEntitlement = hasOwn(input, "annualLeaveEntitlement")
    ? entitlementNumberFrom(input.annualLeaveEntitlement, "Holiday entitlement")
    : person.annualLeaveEntitlement ?? 25;
  const sickLeaveEntitlement = hasOwn(input, "sickLeaveEntitlement")
    ? entitlementNumberFrom(input.sickLeaveEntitlement, "Sick leave entitlement")
    : person.sickLeaveEntitlement ?? DEFAULT_SICK_LEAVE_ENTITLEMENT;

  if (annualLeaveEntitlement < usedLeaveDays) {
    throw makeError(
      "Holiday entitlement cannot be lower than the days already used",
      "VALIDATION",
    );
  }
  if (sickLeaveEntitlement < usedSickDays) {
    throw makeError(
      "Sick leave entitlement cannot be lower than the sick days already used",
      "VALIDATION",
    );
  }

  next.users = next.users.map((user) =>
    user.id === userId
      ? {
          ...user,
          annualLeaveEntitlement,
          remainingLeaveDays: annualLeaveEntitlement - usedLeaveDays,
          sickLeaveEntitlement,
          remainingSickDays: sickLeaveEntitlement - usedSickDays,
          hrProfile: {
            ...(user.hrProfile ?? {}),
            annualLeaveBalance: annualLeaveEntitlement,
          },
        }
      : user,
  );

  return { state: next, user: next.users.find((user) => user.id === userId) };
}

export function buildTimeOffDashboard(state, userId, options = {}) {
  const currentUser = state.users.find((user) => user.id === userId);
  if (!currentUser) throw makeError("User not found", "NOT_FOUND");

  const asOf = options.asOf ?? new Date();
  const holidayYearWindow = getCurrentHolidayYearWindow(state.settings, asOf);
  const org = {
    areas: areaRecordsOf(state),
    sites: siteTargetsOf(state),
    requests: state.requests ?? [],
    holidayYearWindow,
  };
  const reports = getAllReportsBelow(state.users, userId);
  const reportIds = reports.map((user) => user.id);
  const visibleIds = [userId, ...reportIds];
  const decorate = (request) => withRequestPeople(request, state.users, org);

  const myRequests = sortNewestFirst(state.requests.filter((request) => request.userId === userId))
    .map(decorate);
  const requestHistory = sortNewestFirst(
    state.requests.filter((request) => visibleIds.includes(request.userId)),
  ).map(decorate);
  const hierarchyRequests = sortNewestFirst(
    state.requests.filter((request) => reportIds.includes(request.userId)),
  ).map(decorate);
  const pendingApprovals = sortNewestFirst(
    state.requests.filter(
      (request) => request.status === "Pending" && canApprove(state.users, userId, request.userId),
    ),
  ).map(decorate);
  const moveTargetsByPerson = Object.fromEntries(
    state.users
      .map((person) => [
        person.id,
        getMoveTargetsForUser(state.users, userId, person.id).map((target) => target.id),
      ])
      .filter(([, targets]) => targets.length > 0),
  );
  const deleteableUserIds = getDeleteableUserIdsForActor(state.users, userId);
  const siteCoverage = buildSiteCoverage(state.users, currentUser, reports, org.sites, org.areas);
  const areaManagement = buildAreaManagement(state, currentUser);
  const createableRolesByManager = Object.fromEntries(
    [currentUser, ...reports]
      .filter((report) => canCreateDirectReportForActor(state.users, userId, report.id))
      .map((report) => [
        report.id,
        roleOptionsOf(getCreateableRolesForManager(state.users, report.id)),
      ]),
  );
  const editableRolesByUser = Object.fromEntries(
    [currentUser, ...reports]
      .filter((person) => canEditUserForActor(state.users, userId, person.id))
      .map((person) => [
        person.id,
        roleOptionsOf(editableRolesForActor(state.users, userId, person.id)),
      ]),
  );

  // Index acting-PM coverage by site so the directory grid can render the
  // "Acting PM: <name>" pill without crawling areaManagement.
  const actingPmBySiteId = {};
  for (const area of areaManagement.areas) {
    for (const site of area.sites) {
      if (site.actingManagerId) {
        actingPmBySiteId[site.id] = {
          id: site.actingManagerId,
          name: site.actingManagerName,
          roleLabel: "Area Manager",
          areaName: area.name,
        };
      }
    }
  }

  return {
    currentUser: userSnapshotOf(currentUser, state.users, org),
    organisationMap: buildOrganisationMap(state),
    reports: reports.map((report) => userSnapshotOf(report, state.users, org)),
    areas: org.areas,
    sites: org.sites.map((site) => {
      const decorated = withSiteAreaName(site, org.areas, org.sites);
      const acting = actingPmBySiteId[site.id];
      return acting
        ? { ...decorated, actingManagerId: acting.id, actingManagerName: acting.name }
        : decorated;
    }),
    actingPmBySiteId,
    siteCoverage,
    areaManagement,
    leaveSettings: buildLeaveSettings(state, currentUser, org),
    teamSettings: buildTeamSettings(state.users, currentUser, reports, siteCoverage, org),
    teamCalendar: buildTeamCalendar(state, currentUser, org, options),
    createableRolesByManager,
    editableRolesByUser,
    moveTargetsByPerson,
    deleteableUserIds,
    staffWizard: buildStaffWizardOptions(state.users, userId, org.sites, org.areas),
    canAddOrganisationMembers: Object.keys(createableRolesByManager).length > 0,
    canEditOrganisationMembers: Object.keys(editableRolesByUser).length > 0,
    canMoveOrganisationMembers: Object.keys(moveTargetsByPerson).length > 0,
    canDeleteOrganisationMembers: deleteableUserIds.length > 0,
    myRequests,
    pendingRequests: myRequests.filter((request) => request.status === "Pending"),
    approvedRequests: myRequests.filter((request) => request.status === "Approved"),
    rejectedRequests: myRequests.filter((request) => request.status === "Rejected"),
    pendingApprovals,
    hierarchyRequests,
    requestHistory,
    settings: state.settings ?? { holidayYear: { ...DEFAULT_HOLIDAY_YEAR_START } },
    holidayYearWindow,
  };
}

export function readTimeOffState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeTimeOffState(JSON.parse(raw)) : buildInitialTimeOffState();
  } catch {
    return buildInitialTimeOffState();
  }
}

const normalizeAreas = (state) => {
  const rawAreas = Array.isArray(state?.areas) ? state.areas : DEFAULT_AREAS;
  const rawSites = Array.isArray(state?.sites) ? state.sites : AREA_SITE_TARGETS;
  return rawAreas.map((area) => ({
    id: area.id,
    name: area.name ?? toTitleCaseFromId(area.id),
    managerId: area.managerId ?? "",
    status: area.status ?? "active",
    description: area.description ?? "",
    siteIds: Array.isArray(area.siteIds)
      ? area.siteIds
      : rawSites.filter((site) => site.areaId === area.id).map((site) => site.id),
    createdAt: area.createdAt ?? null,
  }));
};

const normalizeSites = (state, areas) => {
  const rawSites = Array.isArray(state?.sites) ? state.sites : AREA_SITE_TARGETS;
  return rawSites.map((site) => ({
    id: canonicalSiteIdOf(site.id) ?? site.id,
    name: site.name ?? toTitleCaseFromId(site.id),
    areaId: site.areaId ?? "",
    areaName: site.areaName ?? areaLabelOf(site.areaId, areas, rawSites),
    address: site.address ?? "",
    status: site.status ?? "active",
    createdAt: site.createdAt ?? null,
  }));
};

const normalizeHrProfileForUser = (user, fallback, entitlement, areas, sites) => {
  const hrProfile = user.hrProfile ?? fallback.hrProfile ?? {
    jobTitle: roleLabelOf(user.role),
    joinDate: "April 8th, 2024",
    contract: "Full-Time (Permanent)",
    location: "Group Support",
    annualLeaveBalance: entitlement,
  };

  const jobTitle = hrProfile.jobTitle?.trim?.() ?? "";
  const hasStalePromotedTitle =
    user.role === "areaManager" &&
    (!jobTitle || NON_AREA_MANAGER_ROLE_LABELS.has(jobTitle));

  return hasStalePromotedTitle
    ? {
        ...hrProfile,
        jobTitle: ROLE_LABELS.areaManager,
        location: user.areaId ? areaLabelOf(user.areaId, areas, sites) : hrProfile.location,
      }
    : hrProfile;
};

export function normalizeTimeOffState(state) {
  const initial = buildInitialTimeOffState();
  const defaultsById = new Map(initial.users.map((user) => [user.id, user]));
  const users = Array.isArray(state?.users) ? state.users : initial.users;
  const areas = normalizeAreas(state);
  const sites = normalizeSites(state, areas);
  const siteIdsByArea = sites.reduce((acc, site) => {
    if (!acc.has(site.areaId)) acc.set(site.areaId, []);
    acc.get(site.areaId).push(site.id);
    return acc;
  }, new Map());

  return {
    areas: areas.map((area) => ({
      ...area,
      siteIds: siteIdsByArea.get(area.id) ?? area.siteIds ?? [],
    })),
    sites,
    users: users.map((user) => {
      const fallback = defaultsById.get(user.id) ?? {};
      const entitlement =
        user.annualLeaveEntitlement ?? fallback.annualLeaveEntitlement ?? 25;
      const usedLeaveDays = user.usedLeaveDays ?? fallback.usedLeaveDays ?? 0;
      const sickEntitlement =
        user.sickLeaveEntitlement ??
        fallback.sickLeaveEntitlement ??
        DEFAULT_SICK_LEAVE_ENTITLEMENT;
      const usedSickDays = user.usedSickDays ?? fallback.usedSickDays ?? 0;
      return {
        ...fallback,
        ...user,
        password: import.meta.env.DEV
          ? (user.password ?? fallback.password ?? user.username)
          : undefined,
        staffId: user.staffId ?? fallback.staffId ?? null,
        scopeType: user.scopeType ?? fallback.scopeType ?? "self",
        scopeIds: user.scopeIds ?? fallback.scopeIds ?? [user.id],
        areaId: user.areaId ?? fallback.areaId ?? null,
        practiceId: user.practiceId ?? fallback.practiceId ?? null,
        teamId: user.teamId ?? fallback.teamId ?? null,
        annualLeaveEntitlement: entitlement,
        usedLeaveDays,
        remainingLeaveDays: user.remainingLeaveDays ?? fallback.remainingLeaveDays ?? entitlement - usedLeaveDays,
        sickLeaveEntitlement: sickEntitlement,
        usedSickDays,
        remainingSickDays:
          user.remainingSickDays ??
          fallback.remainingSickDays ??
          sickEntitlement - usedSickDays,
        isTempPassword: user.isTempPassword ?? fallback.isTempPassword ?? false,
        hrProfile: normalizeHrProfileForUser(user, fallback, entitlement, areas, sites),
        profileImage:
          user.profileImage ??
          fallback.profileImage ??
          profileImageForStaffId(user.staffId ?? fallback.staffId, user.gender ?? fallback.gender),
      };
    }),
    requests: Array.isArray(state?.requests) ? state.requests : [],
    administrativeEvents: Array.isArray(state?.administrativeEvents)
      ? state.administrativeEvents
      : [],
    settings: {
      holidayYear: normalizeHolidayYearSetting(state?.settings?.holidayYear),
    },
  };
}

const normalizeHolidayYearSetting = (input) => {
  const month = Number(input?.month);
  const day = Number(input?.day);
  if (!Number.isFinite(month) || month < 1 || month > 12) return { ...DEFAULT_HOLIDAY_YEAR_START };
  // Cap at 28 so every month works without leap-year edge cases.
  if (!Number.isFinite(day) || day < 1 || day > 28) return { ...DEFAULT_HOLIDAY_YEAR_START };
  return { month, day };
};

export function saveTimeOffState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* localStorage unavailable; state remains in memory for this render cycle */
  }
}

export function resetTimeOffState() {
  const state = buildInitialTimeOffState();
  saveTimeOffState(state);
  return state;
}

/* ════════════════════════════════════════════════════════════════════════
 * PRODUCTION SWAP BOUNDARY — the async functions below are the ENTIRE network
 * surface of the HR/org engine. The UI only ever calls these (never the pure
 * functions or read/saveTimeOffState directly), so going to the real backend
 * is mechanical:
 *   1. Move the pure engine functions above (createTimeOffRequest,
 *      decideTimeOffRequest, createDirectReport, moveUserInHierarchy, …) to the
 *      server — they're side-effect-free (state in → {state, …} out).
 *   2. Replace each wrapper body here with a single `fetchJson('/hr/…', …)`.
 *   3. readTimeOffState/saveTimeOffState (localStorage) become DB reads/writes.
 *   4. RBAC (canApprove / getEditableUserIdsForActor / scope) MUST be
 *      re-enforced server-side — the client copies are UX only.
 * Endpoint mapping + schema live in the backend handover brief (Job 8).
 * ════════════════════════════════════════════════════════════════════════ */
export async function getTimeOffDashboard(userId) {
  await simulateLatency();
  return buildTimeOffDashboard(readTimeOffState(), userId);
  // PROD: return fetchJson(`/hr/dashboard`);  // server scopes to caller's identity
}

export async function submitTimeOffRequest(userId, input) {
  await simulateLatency();
  const result = createTimeOffRequest(readTimeOffState(), userId, input);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, userId);
}

export async function decideTimeOffRequestForApprover(approverId, requestId, decision, options) {
  await simulateLatency();
  const result = decideTimeOffRequest(readTimeOffState(), approverId, requestId, decision, options);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, approverId);
}

export async function createDirectReportForManager(creatorId, managerId, input) {
  await simulateLatency();
  const result = createDirectReport(readTimeOffState(), creatorId, managerId, input);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, creatorId);
}

export async function moveUserForManager(actorId, userId, newManagerId) {
  await simulateLatency();
  const result = moveUserInHierarchy(readTimeOffState(), actorId, userId, newManagerId);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, actorId);
}

export async function editUserForManager(actorId, userId, input) {
  await simulateLatency();
  const result = updateUserDetails(readTimeOffState(), actorId, userId, input);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, actorId);
}

export async function updateLeaveEntitlementsForManager(actorId, userId, input) {
  await simulateLatency();
  const result = updateUserLeaveEntitlements(readTimeOffState(), actorId, userId, input);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, actorId);
}

export async function deleteUserForManager(actorId, userId, options) {
  await simulateLatency();
  const result = deleteUserFromHierarchy(readTimeOffState(), actorId, userId, options);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, actorId);
}

export async function createAreaForManager(actorId, input) {
  await simulateLatency();
  const result = createArea(readTimeOffState(), actorId, input);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, actorId);
}

export async function createSiteForManager(actorId, areaId, input) {
  await simulateLatency();
  const result = createSite(readTimeOffState(), actorId, areaId, input);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, actorId);
}

export async function createAreaWithManagerForCreator(actorId, areaInput, managerInput) {
  await simulateLatency();
  const result = createAreaWithManager(readTimeOffState(), actorId, areaInput, managerInput);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, actorId);
}

export async function deleteAreaForManager(actorId, areaId, options) {
  await simulateLatency();
  const result = deleteAreaWithCascade(readTimeOffState(), actorId, areaId, options);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, actorId);
}

// Permission-gated company-wide settings update. Today this only carries the
// holidayYear key; adding more settings later just means widening the patch
// shape that normalize accepts.
export function updateCompanySettings(state, actorId, patch) {
  const actor = state.users.find((user) => user.id === actorId);
  if (!actor) throw makeError("Editor not found", "NOT_FOUND");
  if (!AREA_ADMIN_ROLES.has(actor.role)) {
    throw makeError(
      "Only the owner, chief of staff, or operations director can change company settings",
      "FORBIDDEN",
    );
  }

  const next = clone(state);
  const currentSettings = next.settings ?? { holidayYear: { ...DEFAULT_HOLIDAY_YEAR_START } };
  const nextSettings = { ...currentSettings };

  if (patch?.holidayYear) {
    const month = Number(patch.holidayYear.month);
    const day = Number(patch.holidayYear.day);
    if (!Number.isFinite(month) || month < 1 || month > 12) {
      throw makeError("Holiday year month must be between 1 and 12", "VALIDATION");
    }
    if (!Number.isFinite(day) || day < 1 || day > 28) {
      throw makeError(
        "Holiday year day must be between 1 and 28 (Feb 29 not yet supported)",
        "VALIDATION",
      );
    }
    nextSettings.holidayYear = { month, day };
  }

  next.settings = nextSettings;
  return { state: next, settings: nextSettings };
}

export async function updateCompanySettingsForCreator(actorId, patch) {
  await simulateLatency();
  const result = updateCompanySettings(readTimeOffState(), actorId, patch);
  saveTimeOffState(result.state);
  return buildTimeOffDashboard(result.state, actorId);
}

export async function getDirectReportDefaultsForManager(managerId, role) {
  await simulateLatency();
  return suggestDirectReportDefaults(readTimeOffState(), managerId, role);
}
