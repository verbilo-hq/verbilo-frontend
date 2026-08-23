/**
 * Rota store — Slice PM-3.
 *
 * Module-level shared store (pattern matches devRole.js / agenda).
 * Lifted out of RotaView so the Manager Hub's Action Queue can
 * apply leave blocks to the rota without prop-drilling refs.
 *
 * Mutators:
 *   • assignCell      — pick a different person / nurse / mark vacant
 *   • applyLeaveBlock — flip a person's days to On-Leave (fires from
 *                       the "Approve & Auto-Update Rota" action button
 *                       in the PM Hub Action Queue)
 *   • publishWeek     — flip draft → published, stamp publishedBy/At
 *   • unpublishWeek   — flip published → draft so PM can edit again
 *
 * Conflict detection (`detectConflicts`) is pure — derives a
 * `{ [dayId]: Set<staffName> }` map per week showing names that
 * appear in >1 primary slot the same day. RotaView uses this to
 * highlight conflict cells.
 *
 * Backend swap: replace this module with a thin API client and the
 * RotaView component doesn't need to change.
 */

import { useEffect, useState } from "react";
import { clinicalStaffAtSite, personAtSiteByRole } from "../people";

/* ─── Staff roster — real, site-scoped (defaults to Southall) ─────
 * The store is module-level / site-agnostic, so it seeds from the
 * shared people roster for Southall (practice-harley) — the fully
 * staffed home practice. Names are pulled live from `people.js`
 * (no invented people, no "Brighton"). The rota "kind" tags map
 * 1:1 onto the picker's PRIMARY/SECONDARY_ROLES_FOR_KIND.
 *
 * Backend swap: pass the active site id through here instead of the
 * hardcoded "site-southall" and the rest of the module is unchanged. */
const ROTA_SITE_ID = "site-southall";

/* Pull each rota "kind" once, in roster order, so seed assignments
 * below can reference real people by index without re-querying. */
const dentists   = clinicalStaffAtSite(ROTA_SITE_ID, "Dentist");
const fds        = clinicalStaffAtSite(ROTA_SITE_ID, "FD");
const hygienists = clinicalStaffAtSite(ROTA_SITE_ID, "Hygienist");
const nurses     = clinicalStaffAtSite(ROTA_SITE_ID, "Nurse");
const receptions = clinicalStaffAtSite(ROTA_SITE_ID, "Reception");

/* Pick a display name by index with a safe wrap-around so the seed
 * never produces `undefined` even if a site is lightly staffed. */
const pick = (list, i) => list[i % list.length]?.displayName ?? "—";

/* Named seed handles — keeps the assignment tables readable and the
 * leave-block demo (Manager Hub → Approve & Auto-Update Rota) able to
 * target a real person. */
const DENTIST_A = pick(dentists, 0);
const DENTIST_B = pick(dentists, 1);
const FD_1      = pick(fds, 0);
const HYG_1     = pick(hygienists, 0);
const NURSE_A   = pick(nurses, 0);
const NURSE_B   = pick(nurses, 1);
const RECEP_1   = pick(receptions, 0);

/* The person whose week the PM Hub leave-block demo flips to On-Leave.
 * Exported so ManagerPage's "Approve & Auto-Update Rota" handler stays
 * in sync with whoever actually staffs the hygiene room here. */
export const ROTA_LEAVE_DEMO_STAFF = HYG_1;

export const STAFF_ROSTER = [
  ...dentists.map((p)   => ({ name: p.displayName, role: "Dentist"   })),
  ...fds.map((p)        => ({ name: p.displayName, role: "FD"        })),  // FD can slot into a dentist room with supervisor flag
  ...hygienists.map((p) => ({ name: p.displayName, role: "Hygienist" })),
  ...nurses.map((p)     => ({ name: p.displayName, role: "Nurse"     })),
  ...receptions.map((p) => ({ name: p.displayName, role: "Reception" })),
];

/* Which roles are valid for the PRIMARY slot of each surgery kind. */
export const PRIMARY_ROLES_FOR_KIND = {
  dentist:   ["Dentist", "FD"],
  hygiene:   ["Hygienist"],
  reception: ["Reception"],
  decon:     ["Nurse"],
};
/* Which roles are valid for the SECONDARY slot (typically a nurse). */
export const SECONDARY_ROLES_FOR_KIND = {
  dentist:   ["Nurse"],
  hygiene:   ["Nurse"],
  reception: [],
  decon:     [],
};

/* ─── Surgeries + day axis (static — doesn't mutate) ────────────── */

export const SURGERIES = [
  { id: "surg1", label: "Surgery 1",           kind: "dentist"   },
  { id: "surg2", label: "Surgery 2",           kind: "dentist"   },
  { id: "surg3", label: "Surgery 3 (Hygiene)", kind: "hygiene"   },
  { id: "recep", label: "Reception",            kind: "reception" },
  { id: "decon", label: "Decon Room",           kind: "decon"     },
];

const DAYS_W1 = [
  { id: "mon", label: "Mon", date: "26 May", weekday: "Monday"    },
  { id: "tue", label: "Tue", date: "27 May", weekday: "Tuesday"   },
  { id: "wed", label: "Wed", date: "28 May", weekday: "Wednesday" },
  { id: "thu", label: "Thu", date: "29 May", weekday: "Thursday"  },
  { id: "fri", label: "Fri", date: "30 May", weekday: "Friday"    },
  { id: "sat", label: "Sat", date: "31 May", weekday: "Saturday", partial: true },
];

const DAYS_W2 = [
  { id: "mon", label: "Mon", date: "02 Jun", weekday: "Monday"    },
  { id: "tue", label: "Tue", date: "03 Jun", weekday: "Tuesday"   },
  { id: "wed", label: "Wed", date: "04 Jun", weekday: "Wednesday" },
  { id: "thu", label: "Thu", date: "05 Jun", weekday: "Thursday"  },
  { id: "fri", label: "Fri", date: "06 Jun", weekday: "Friday"    },
  { id: "sat", label: "Sat", date: "07 Jun", weekday: "Saturday", partial: true },
];

/* ─── Seed weeks ─────────────────────────────────────────────────
 * NOTE: Week 23's Hannah-on-leave block is INTENTIONALLY removed.
 * PM-3 demo: Action Queue's "Approve & Auto-Update Rota" applies
 * the leave block live, so the empty starting state shows the
 * before/after contrast cleanly. */
const WEEK_1_SEED = {
  id:          "w22-2026",
  label:       "Week 22 · 26 – 31 May 2026",
  status:      "published",
  publishedAt: "23 May 2026, 16:42",
  publishedBy: personAtSiteByRole(ROTA_SITE_ID, "practiceManager")?.displayName,
  days:        DAYS_W1,
  assignments: {
    surg1: {
      mon: { primary: DENTIST_A,  primaryRole: "Dentist",  secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed" },
      tue: { primary: DENTIST_A,  primaryRole: "Dentist",  secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed" },
      wed: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "staffed" },
      thu: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "staffed" },
      fri: { primary: DENTIST_A,  primaryRole: "Dentist",  secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed" },
      sat: { primary: DENTIST_A,  primaryRole: "Dentist",  secondary: NURSE_A,  secondaryRole: "Nurse", status: "partial", note: "9:00 – 13:00" },
    },
    surg2: {
      mon: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "staffed" },
      tue: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "staffed" },
      wed: { primary: FD_1,        primaryRole: "FD",       secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed", note: `Supervisor: ${DENTIST_B}` },
      thu: { primary: FD_1,        primaryRole: "FD",       secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed", note: `Supervisor: ${DENTIST_B}` },
      fri: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "staffed" },
      sat: null,
    },
    surg3: {
      mon: { primary: HYG_1,                 primaryRole: "Hygienist", status: "staffed" },
      tue: { primary: HYG_1,                 primaryRole: "Hygienist", status: "staffed" },
      wed: { primary: null,                  primaryRole: null,        status: "open",   note: "Awaiting cover" },
      thu: { primary: HYG_1,                 primaryRole: "Hygienist", status: "staffed" },
      fri: { primary: HYG_1,                 primaryRole: "Hygienist", status: "staffed" },
      sat: null,
    },
    recep: {
      mon: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      tue: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      wed: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      thu: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      fri: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      sat: { primary: RECEP_1,               primaryRole: "Reception", status: "partial", note: "9:00 – 13:00" },
    },
    decon: {
      mon: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      tue: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      wed: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      thu: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      fri: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      sat: null,
    },
  },
};

const WEEK_2_SEED = {
  id:          "w23-2026",
  label:       "Week 23 · 2 – 7 Jun 2026",
  status:      "draft",
  publishedAt: null,
  publishedBy: null,
  days:        DAYS_W2,
  assignments: {
    surg1: {
      mon: { primary: DENTIST_A,  primaryRole: "Dentist",  secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed" },
      tue: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "staffed" },
      wed: { primary: DENTIST_A,  primaryRole: "Dentist",  secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed" },
      thu: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "staffed" },
      fri: { primary: DENTIST_A,  primaryRole: "Dentist",  secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed" },
      sat: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "partial", note: "9:00 – 13:00" },
    },
    surg2: {
      mon: { primary: FD_1,        primaryRole: "FD",       secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed", note: `Supervisor: ${DENTIST_B}` },
      tue: { primary: FD_1,        primaryRole: "FD",       secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed", note: `Supervisor: ${DENTIST_B}` },
      wed: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "staffed" },
      thu: { primary: FD_1,        primaryRole: "FD",       secondary: NURSE_A,  secondaryRole: "Nurse", status: "staffed", note: `Supervisor: ${DENTIST_B}` },
      fri: { primary: DENTIST_B,  primaryRole: "Dentist",  secondary: NURSE_B,  secondaryRole: "Nurse", status: "staffed" },
      sat: null,
    },
    surg3: {
      /* PM-3 demo: starts fully staffed. Action Queue Approve →
       * mutates Mon-Fri to On Leave. Empty before/full after. */
      mon: { primary: HYG_1,                 primaryRole: "Hygienist", status: "staffed" },
      tue: { primary: HYG_1,                 primaryRole: "Hygienist", status: "staffed" },
      wed: { primary: HYG_1,                 primaryRole: "Hygienist", status: "staffed" },
      thu: { primary: HYG_1,                 primaryRole: "Hygienist", status: "staffed" },
      fri: { primary: HYG_1,                 primaryRole: "Hygienist", status: "staffed" },
      sat: null,
    },
    recep: {
      mon: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      tue: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      wed: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      thu: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      fri: { primary: RECEP_1,               primaryRole: "Reception", status: "staffed" },
      sat: { primary: RECEP_1,               primaryRole: "Reception", status: "partial", note: "9:00 – 13:00" },
    },
    decon: {
      mon: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      tue: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      wed: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      thu: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      fri: { primary: "Rota Cover",          primaryRole: "Nurse pool", status: "cover" },
      sat: null,
    },
  },
};

/* ─── Module store + subscribers ────────────────────────────────── */

/* `surgeries` lives in the store now (was a static export) so PMs
 * can add Surgery 4, a second Reception desk, an Endo Specialist
 * room, etc., without redeploys. The exported `SURGERIES` const
 * remains as the SEED only — consumers should read from
 * `useRotaStore().surgeries` for live mutability. */
let store = { surgeries: [...SURGERIES], weeks: [WEEK_1_SEED, WEEK_2_SEED] };
const subs = new Set();
function notify() { subs.forEach((fn) => fn(store)); }
/* Merge the partial update over the previous store so a mutator that
 * only returns e.g. `{ weeks }` (assignCell, applyLeaveBlock, publish/
 * unpublishWeek) keeps the other top-level keys (notably `surgeries`,
 * which RotaView iterates). Always produces a fresh object reference so
 * subscribers re-render. */
function setStore(updater) { store = { ...store, ...updater(store) }; notify(); }

export function useRotaStore() {
  const [s, setS] = useState(store);
  useEffect(() => {
    subs.add(setS);
    return () => { subs.delete(setS); };
  }, []);
  return s;
}

/* ─── Mutators ──────────────────────────────────────────────────── */

/** Replace one cell's payload (used by the AssignCellModal save). */
export function assignCell(weekId, surgeryId, dayId, payload) {
  setStore((prev) => ({
    weeks: prev.weeks.map((w) => w.id !== weekId ? w : {
      ...w,
      assignments: {
        ...w.assignments,
        [surgeryId]: { ...w.assignments[surgeryId], [dayId]: payload },
      },
    }),
  }));
}

/** Flip a staff member's days to On-Leave across all surgeries. */
export function applyLeaveBlock(weekId, staffName, dayIds, note) {
  setStore((prev) => ({
    weeks: prev.weeks.map((w) => {
      if (w.id !== weekId) return w;
      const newAssignments = {};
      for (const [surgId, days] of Object.entries(w.assignments)) {
        newAssignments[surgId] = {};
        for (const [dayId, cell] of Object.entries(days)) {
          /* Match if person is in the primary slot AND day is in scope. */
          if (cell && cell.primary === staffName && dayIds.includes(dayId)) {
            newAssignments[surgId][dayId] = {
              primary: null, primaryRole: null,
              status: "leave",
              note,
            };
          } else {
            newAssignments[surgId][dayId] = cell;
          }
        }
      }
      return { ...w, assignments: newAssignments };
    }),
  }));
}

export function publishWeek(weekId, publisherName) {
  setStore((prev) => ({
    weeks: prev.weeks.map((w) => w.id !== weekId ? w : {
      ...w,
      status:      "published",
      publishedAt: new Date().toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      publishedBy: publisherName || "PM",
    }),
  }));
}

export function unpublishWeek(weekId) {
  setStore((prev) => ({
    weeks: prev.weeks.map((w) => w.id !== weekId ? w : {
      ...w,
      status:      "draft",
      publishedAt: null,
      publishedBy: null,
    }),
  }));
}

/* Add a new surgery / reception desk / decon room. Generates a
 * unique id, appends to the surgeries list, AND initializes empty
 * assignments for it across every week (so the grid row exists +
 * cells are clickable + empty). */
export function addSurgery(label, kind) {
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const newSurgery = { id, label: (label || "Untitled space").trim(), kind };
  setStore((prev) => ({
    surgeries: [...prev.surgeries, newSurgery],
    weeks: prev.weeks.map((w) => {
      const blankAssignments = {};
      for (const day of w.days) blankAssignments[day.id] = null;
      return {
        ...w,
        assignments: { ...w.assignments, [id]: blankAssignments },
      };
    }),
  }));
  return id;
}

/* Remove a surgery + clean its assignments out of every week. */
export function removeSurgery(id) {
  setStore((prev) => ({
    surgeries: prev.surgeries.filter((s) => s.id !== id),
    weeks: prev.weeks.map((w) => {
      const { [id]: _drop, ...rest } = w.assignments;
      return { ...w, assignments: rest };
    }),
  }));
}

/* Rename a surgery — trims whitespace + ignores empty strings
 * (caller's escape-to-cancel path). */
export function renameSurgery(id, label) {
  const next = (label || "").trim();
  if (!next) return;
  setStore((prev) => ({
    surgeries: prev.surgeries.map((s) => s.id === id ? { ...s, label: next } : s),
    weeks: prev.weeks,
  }));
}

/* Move a surgery one slot up or down in the display order.
 * `direction` = -1 (up) or +1 (down). No-op at boundaries. */
export function moveSurgery(id, direction) {
  setStore((prev) => {
    const idx = prev.surgeries.findIndex((s) => s.id === id);
    if (idx < 0) return prev;
    const target = idx + direction;
    if (target < 0 || target >= prev.surgeries.length) return prev;
    const next = [...prev.surgeries];
    [next[idx], next[target]] = [next[target], next[idx]];
    return { surgeries: next, weeks: prev.weeks };
  });
}

/* ─── Pure derivations ──────────────────────────────────────────── */

/** Returns the set of staff names on leave for each day in the week.
 *  Drives the "🚫 On leave" indicator inside the assignment picker. */
export function staffOnLeavePerDay(week) {
  const out = {};
  for (const day of week.days) out[day.id] = new Set();
  for (const surgId of Object.keys(week.assignments)) {
    for (const day of week.days) {
      const cell = week.assignments[surgId]?.[day.id];
      if (cell?.status === "leave" && cell?.note) {
        /* Try to extract a staff name from the note (e.g. "Hannah Reeves — annual leave"). */
        const m = cell.note.match(/^([^—-]+?)(?:\s*[—-]|$)/);
        if (m) out[day.id].add(m[1].trim());
      }
    }
  }
  return out;
}

/** Conflict detection: a name appearing in 2+ primary slots same day. */
export function detectConflicts(week) {
  const out = {};
  for (const day of week.days) {
    const seen = {};
    for (const surgId of Object.keys(week.assignments)) {
      const cell = week.assignments[surgId]?.[day.id];
      if (cell?.primary && cell.status !== "cover") {
        seen[cell.primary] = (seen[cell.primary] || 0) + 1;
      }
    }
    out[day.id] = new Set(
      Object.entries(seen).filter(([, n]) => n > 1).map(([name]) => name),
    );
  }
  return out;
}

/** Is `staffName` already assigned in another room same day in this week? */
export function isStaffBusyOn(week, dayId, staffName, exceptSurgeryId = null) {
  for (const surgId of Object.keys(week.assignments)) {
    if (surgId === exceptSurgeryId) continue;
    const cell = week.assignments[surgId]?.[dayId];
    if (cell?.primary === staffName) return true;
  }
  return false;
}

/* ─── "My Shifts" — derived per-person view (PM-4) ──────────────
 * Walks every week → day → surgery in order and returns up to
 * `limit` shifts the named person is scheduled for. Includes BOTH
 * primary-slot and secondary-slot assignments (a nurse who's
 * paired with a dentist in Surgery 1 gets a shift too). Skipped
 * entirely when the person's slot has been flipped to a non-
 * assigned status (open, leave, closed, cover), so leave blocks
 * cascade through to the personal widget automatically.
 *
 * Returns: [{ weekId, weekLabel, dayId, date, weekday, partial,
 *             surgeryId, surgery, surgeryKind, role, isPrimary,
 *             pairedWith?, note? }, ...]
 *
 * Reads from the LIVE store via the export above, so call sites
 * that use `useRotaStore()` to gate re-renders will recompute
 * shifts whenever the rota mutates. */
export function getMyShifts(staffName, options = {}) {
  const { limit = 3 } = options;
  if (!staffName) return [];
  const out = [];
  for (const week of store.weeks) {
    for (const day of week.days) {
      for (const surg of store.surgeries) {
        const cell = week.assignments[surg.id]?.[day.id];
        if (!cell) continue;
        /* Skip cells that aren't actively assigning this person */
        const isPrimary   = cell.primary   === staffName;
        const isSecondary = cell.secondary === staffName;
        if (!isPrimary && !isSecondary) continue;
        /* "leave" / "open" cells have primary=null so won't match;
         * cover cells have primary="Rota Cover" — no real shift. */
        out.push({
          weekId:      week.id,
          weekLabel:   week.label,
          dayId:       day.id,
          date:        day.date,
          weekday:     day.weekday,
          partial:     !!day.partial,
          surgeryId:   surg.id,
          surgery:     surg.label,
          surgeryKind: surg.kind,
          role:        isPrimary ? cell.primaryRole : cell.secondaryRole,
          isPrimary,
          pairedWith:  isPrimary ? cell.secondary : cell.primary,
          note:        cell.note,
          published:   week.status === "published",
        });
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}
