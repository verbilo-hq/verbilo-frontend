/**
 * Roster expansion — clinical/support staff needed to populate site-level
 * surfaces (rota, UDA breakdown, protocol compliance) with REAL people.
 *
 * Per the design (D6) the two main practices get full clinical teams:
 *   • Southall (practice-harley, area-1) — top-up of the existing demo team
 *   • London   (practice-camden, area-2) — a full clinical team
 * The other four sites stay lightly staffed (manager-level demoUsers only).
 *
 * These feed `services/people.js` (the single roster the app reads names
 * from). Field shape mirrors auth/demoUsers.js. Folding them into the HR
 * org-map / Staff Directory view is a separate follow-up.
 */

const c = (id, displayName, role, practiceId, areaId, extra = {}) => ({
  id,
  displayName,
  role,
  staffId: extra.staffId,
  scopeType: extra.scopeType ?? "self",
  scopeIds: [id],
  areaId,
  practiceId,
  teamId: extra.teamId ?? null,
  managerId: extra.managerId ?? null,
  isOnline: extra.isOnline ?? true,
  ...(extra.gdcType ? { gdcType: extra.gdcType, gdcNumber: extra.gdcNumber } : {}),
});

export const clinicalStaff = [
  /* ── Southall (practice-harley, area-1) — top-up to fill a rota ───────── */
  c("south-dentist-2", "Dr. Hannah Reed", "associateDentist", "practice-harley", "area-1",
    { staffId: 101, teamId: "team-clinical-harley", managerId: "manager", gdcType: "Dentist", gdcNumber: "260114" }),
  c("south-fd-1", "Dr. Leo Marsh", "foundationDentist", "practice-harley", "area-1",
    { staffId: 102, teamId: "team-clinical-harley", managerId: "clinical-lead", gdcType: "Dentist", gdcNumber: "284551" }),
  c("south-hyg-1", "Sophie Bennett", "hygienist", "practice-harley", "area-1",
    { staffId: 103, teamId: "team-clinical-harley", managerId: "clinical-lead", gdcType: "Dental Hygienist", gdcNumber: "271338" }),
  c("south-hyg-2", "Megan Hughes", "hygienist", "practice-harley", "area-1",
    { staffId: 104, teamId: "team-clinical-harley", managerId: "clinical-lead", gdcType: "Dental Hygienist", gdcNumber: "279902" }),
  c("south-nurse-2", "Priya Raman", "dentalNurse", "practice-harley", "area-1",
    { staffId: 105, teamId: "team-nursing-harley", managerId: "lead-nurse", gdcType: "Dental Nurse", gdcNumber: "301447" }),

  /* ── London (practice-camden, area-2) — full clinical team ────────────── */
  c("london-clinical-lead", "Dr. Marcus Webb", "clinicalLead", "practice-camden", "area-2",
    { staffId: 110, scopeType: "team", teamId: "team-clinical-camden", managerId: "practice-manager-area-2", gdcType: "Dentist", gdcNumber: "210556" }),
  c("london-dentist-1", "Dr. Aisha Karim", "associateDentist", "practice-camden", "area-2",
    { staffId: 111, teamId: "team-clinical-camden", managerId: "london-clinical-lead", gdcType: "Dentist", gdcNumber: "248890" }),
  c("london-dentist-2", "Dr. Tom Fletcher", "associateDentist", "practice-camden", "area-2",
    { staffId: 112, teamId: "team-clinical-camden", managerId: "london-clinical-lead", gdcType: "Dentist", gdcNumber: "255301" }),
  c("london-fd-1", "Dr. Ruby Shah", "foundationDentist", "practice-camden", "area-2",
    { staffId: 113, teamId: "team-clinical-camden", managerId: "london-clinical-lead", gdcType: "Dentist", gdcNumber: "291004" }),
  c("london-hyg-1", "Chloe Dawson", "hygienist", "practice-camden", "area-2",
    { staffId: 114, teamId: "team-clinical-camden", managerId: "london-clinical-lead", gdcType: "Dental Hygienist", gdcNumber: "276650" }),
  c("london-hyg-2", "Nadia Iqbal", "hygienist", "practice-camden", "area-2",
    { staffId: 115, teamId: "team-clinical-camden", managerId: "london-clinical-lead", gdcType: "Dental Hygienist", gdcNumber: "280119" }),
  c("london-lead-nurse", "Grace Adeyemi", "leadNurse", "practice-camden", "area-2",
    { staffId: 116, scopeType: "team", teamId: "team-nursing-camden", managerId: "london-clinical-lead", gdcType: "Dental Nurse", gdcNumber: "265120" }),
  c("london-nurse-1", "Ella Brooks", "dentalNurse", "practice-camden", "area-2",
    { staffId: 117, teamId: "team-nursing-camden", managerId: "london-lead-nurse", gdcType: "Dental Nurse", gdcNumber: "302788" }),
  c("london-nurse-2", "Daniel Osei", "dentalNurse", "practice-camden", "area-2",
    { staffId: 118, teamId: "team-nursing-camden", managerId: "london-lead-nurse", gdcType: "Dental Nurse", gdcNumber: "305491" }),
  c("london-reception-1", "Holly Turner", "receptionist", "practice-camden", "area-2",
    { staffId: 119, teamId: "team-front-house-camden", managerId: "practice-manager-area-2" }),
  c("london-tco-1", "Sofia Marino", "treatmentCoordinator", "practice-camden", "area-2",
    { staffId: 120, managerId: "practice-manager-area-2" }),
];
