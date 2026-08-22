/**
 * Realistic equipment records per site. Service dates are computed relative
 * to "today" so the seed always produces a meaningful spread of overdue / due
 * soon / on schedule for the dashboard.
 */

import { EquipmentType, EquipmentStatus } from "../types";

const today = () => new Date();
const daysFromNow = (n) => {
  const d = today();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const DEMO_EQUIPMENT = [
  // ── Brighton — fully kitted ──────────────────────────────────────────────
  {
    id: "equip-br-auto-001",
    siteId: "site-brighton",
    type: EquipmentType.autoclave,
    makeModel: "Melag Vacuklav 40 B+",
    serialNumber: "BR-AUTO-001",
    roomLocation: "Decontamination Room",
    serviceProvider: "Eschmann Direct",
    lastServiceDate: daysFromNow(-305),
    nextServiceDate: daysFromNow(60),
    status: EquipmentStatus.active,
    evidenceRequired: true,
  },
  {
    id: "equip-br-wd-001",
    siteId: "site-brighton",
    type: EquipmentType.washer_disinfector,
    makeModel: "Miele PG 8581",
    serialNumber: "BR-WD-001",
    roomLocation: "Decontamination Room",
    serviceProvider: "Miele Professional",
    lastServiceDate: daysFromNow(-351),
    nextServiceDate: daysFromNow(14),
    status: EquipmentStatus.active,
    evidenceRequired: true,
    notes: "Next service approaching — engineer booked",
  },
  {
    id: "equip-br-us-001",
    siteId: "site-brighton",
    type: EquipmentType.ultrasonic_bath,
    makeModel: "Elma S60H",
    serialNumber: "BR-US-001",
    roomLocation: "Decontamination Room",
    serviceProvider: "Henry Schein One",
    lastServiceDate: daysFromNow(-180),
    nextServiceDate: daysFromNow(185),
    status: EquipmentStatus.active,
    evidenceRequired: true,
  },
  {
    id: "equip-br-wl-001",
    siteId: "site-brighton",
    type: EquipmentType.waterline_system,
    makeModel: "Dürr Dental",
    serialNumber: "BR-WL-001",
    roomLocation: "Surgery-wide",
    serviceProvider: "Dürr Dental UK",
    lastServiceDate: daysFromNow(-90),
    nextServiceDate: daysFromNow(95),
    status: EquipmentStatus.active,
    evidenceRequired: true,
  },

  // ── Hove — no WD; ultrasonic evidence is overdue ─────────────────────────
  {
    id: "equip-hv-auto-001",
    siteId: "site-hove",
    type: EquipmentType.autoclave,
    makeModel: "W&H Lisa 22L",
    serialNumber: "HV-AUTO-001",
    roomLocation: "Decontamination Room",
    serviceProvider: "W&H UK",
    lastServiceDate: daysFromNow(-200),
    nextServiceDate: daysFromNow(165),
    status: EquipmentStatus.active,
    evidenceRequired: true,
  },
  {
    id: "equip-hv-us-001",
    siteId: "site-hove",
    type: EquipmentType.ultrasonic_bath,
    makeModel: "Hydrim Ultrasonic Unit",
    serialNumber: "HV-US-001",
    roomLocation: "Decontamination Room",
    serviceProvider: "SciCan",
    lastServiceDate: daysFromNow(-420),     // overdue
    nextServiceDate: daysFromNow(-55),       // overdue
    status: EquipmentStatus.overdue_service,
    evidenceRequired: true,
    notes: "Annual service overdue — escalated to Practice Manager",
  },
  {
    id: "equip-hv-wl-001",
    siteId: "site-hove",
    type: EquipmentType.waterline_system,
    makeModel: "Alpron",
    serialNumber: "HV-WL-001",
    roomLocation: "Surgery-wide",
    serviceProvider: "Schülke",
    lastServiceDate: daysFromNow(-60),
    nextServiceDate: daysFromNow(120),
    status: EquipmentStatus.active,
    evidenceRequired: true,
  },

  // ── Worthing — WD-based, waterline test due soon ─────────────────────────
  {
    id: "equip-wo-auto-001",
    siteId: "site-worthing",
    type: EquipmentType.autoclave,
    makeModel: "Melag Vacuklav 41 B+",
    serialNumber: "WO-AUTO-001",
    roomLocation: "Decontamination Room",
    serviceProvider: "Eschmann Direct",
    lastServiceDate: daysFromNow(-150),
    nextServiceDate: daysFromNow(215),
    status: EquipmentStatus.active,
    evidenceRequired: true,
  },
  {
    id: "equip-wo-wd-001",
    siteId: "site-worthing",
    type: EquipmentType.washer_disinfector,
    makeModel: "Miele PG 8591",
    serialNumber: "WO-WD-001",
    roomLocation: "Decontamination Room",
    serviceProvider: "Miele Professional",
    lastServiceDate: daysFromNow(-120),
    nextServiceDate: daysFromNow(245),
    status: EquipmentStatus.active,
    evidenceRequired: true,
  },
  {
    id: "equip-wo-wl-001",
    siteId: "site-worthing",
    type: EquipmentType.waterline_system,
    makeModel: "Dürr Dental",
    serialNumber: "WO-WL-001",
    roomLocation: "Surgery-wide",
    serviceProvider: "Dürr Dental UK",
    lastServiceDate: daysFromNow(-95),
    nextServiceDate: daysFromNow(15),       // due soon
    status: EquipmentStatus.active,
    evidenceRequired: true,
    notes: "Quarterly microbiological sampling due in 2 weeks",
  },

  // ── Crawley — autoclave service OVERDUE, no WD ───────────────────────────
  {
    id: "equip-cr-auto-001",
    siteId: "site-crawley",
    type: EquipmentType.autoclave,
    makeModel: "Eschmann Little Sister",
    serialNumber: "CR-AUTO-001",
    roomLocation: "Decontamination Room",
    serviceProvider: "Eschmann Direct",
    lastServiceDate: daysFromNow(-380),
    nextServiceDate: daysFromNow(-15),       // overdue
    status: EquipmentStatus.overdue_service,
    evidenceRequired: true,
    notes: "Annual service overdue — operator competency on hold",
  },
  {
    id: "equip-cr-us-001",
    siteId: "site-crawley",
    type: EquipmentType.ultrasonic_bath,
    makeModel: "Elma Elmasonic P60H",
    serialNumber: "CR-US-001",
    roomLocation: "Decontamination Room",
    serviceProvider: "Henry Schein One",
    lastServiceDate: daysFromNow(-100),
    nextServiceDate: daysFromNow(265),
    status: EquipmentStatus.active,
    evidenceRequired: true,
  },
  {
    id: "equip-cr-wl-001",
    siteId: "site-crawley",
    type: EquipmentType.waterline_system,
    makeModel: "Manual flushing process",
    serialNumber: "CR-WL-001",
    roomLocation: "Surgery-wide",
    serviceProvider: "(in-house)",
    lastServiceDate: null,
    nextServiceDate: null,
    status: EquipmentStatus.active,
    evidenceRequired: true,
    notes: "No fitted system — manual flushing per HTM 01-05 guidance",
  },

  // Guildford / Portsmouth: deliberately empty to demonstrate "missing equipment profile"
];
