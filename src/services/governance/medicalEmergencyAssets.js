/**
 * Medical Emergencies & Resuscitation — physical asset metadata.
 *
 * Collapses the prior 5-card register (drug box / AED / oxygen / suction /
 * BVM / glucose) down to three core asset containers per RCUK Quality
 * Standards for Cardiopulmonary Resuscitation Equipment:
 *
 *   • AED                            — one card per defibrillator
 *   • Medical Oxygen Cylinder        — one card per cylinder
 *   • Emergency Drug Kit / Resus Pack — parent container for the drug box
 *                                       plus its companion consumables
 *                                       (suction + BVM as embedded toggles
 *                                       inside the same card, not separate
 *                                       top-level entries).
 *
 * `profileFlag` is unused for med-emerg (RCUK kit is universally mandatory,
 * not site-toggled) but kept for shape parity with radiographyAssets.js so a
 * future generic renderer can consume both schemas. `alwaysVisible: true`
 * on every card.
 */

import { EquipmentType } from "./types";

export const MEDEMERG_ASSET_META = [
  {
    key:             "aed",
    equipmentType:   EquipmentType.aed_defibrillator,
    alwaysVisible:   true,
    title:           "Automated External Defibrillators (AED)",
    titleShort:      "AED",
    subtitle:        "RCUK requires at least one AED on-site, ready-to-use at all times.",
    addButtonLabel:  "Add AED",
    icon:            "zap",
    accent:          "#c62828",
  },
  {
    key:             "oxygen",
    equipmentType:   EquipmentType.oxygen_cylinder,
    alwaysVisible:   true,
    title:           "Medical Oxygen Cylinders",
    titleShort:      "Oxygen Cylinder",
    subtitle:        "Portable CD-size cylinder mandatory; E-size optional back-up.",
    addButtonLabel:  "Add Oxygen Cylinder",
    icon:            "wind",
    accent:          "#1565c0",
  },
  {
    key:             "drug_kit",
    equipmentType:   EquipmentType.emergency_drug_box,
    alwaysVisible:   true,
    title:           "Emergency Drug Kits & Resus Packs",
    titleShort:      "Emergency Kit Container",
    subtitle:        "Parent container — drugs, portable suction and BVM tracked here together.",
    addButtonLabel:  "Add Emergency Kit Container",
    icon:            "pill",
    accent:          "#6a1b9a",
  },
];

/**
 * Cylinder size options for the Oxygen modal. CD is the RCUK-required
 * portable size; E is a non-portable back-up some larger sites carry.
 */
export const OXYGEN_CYLINDER_SIZES = [
  { value: "CD", label: "CD Cylinder (Standard Portable)" },
  { value: "E",  label: "E Size (Large Practice Back-up)" },
];

/**
 * Per-asset field schemas. Modal renders these via a `data` blob on the
 * equipment record — fields here populate `equipment.data[fieldName]`.
 * Top-level columns (makeModel, serialNumber, roomLocation) remain on the
 * equipment row itself for indexable querying.
 *
 * `showIf(profile)` lets a field render conditionally per site profile —
 * used for paediatric pads (only shown when paediatricKitRequired is on).
 */
export const MEDEMERG_FIELD_SCHEMA = {
  aed: [
    { name: "roomLocation",       label: "Location Assigned",        type: "select-room", required: true },
    { name: "makeModel",          label: "Make & Model",              type: "text",        required: true,
      placeholder: "e.g. Zoll AED Plus" },
    { name: "serialNumber",       label: "Defibrillator Serial Number", type: "text",     required: true },
    { name: "adultPadsExpiry",    label: "Adult Pads Expiry Date",    type: "date",        required: true,
      help: "Drives the dashboard expiry push alert." },
    { name: "paediatricPadsExpiry", label: "Paediatric Pads Expiry Date", type: "date",  required: true,
      showIf: (profile) => !!profile?.paediatricKitRequired,
      help: "Only required when this site treats children — set in Step 4." },
    { name: "batteryExpiry",      label: "Battery Expiry Date",       type: "date",        required: true },
  ],
  oxygen: [
    { name: "cylinderSize",       label: "Cylinder Size",             type: "select",      required: true,
      options: OXYGEN_CYLINDER_SIZES },
    { name: "serialNumber",       label: "Serial Number / Barcode ID", type: "text",       required: true },
    { name: "cylinderSwapDate",   label: "Cylinder Expiry / Hydrostatic Swap Date", type: "date", required: true,
      help: "Supplier swap deadline — typically 3-yearly for portable medical O₂ cylinders." },
  ],
  drug_kit: [
    { name: "roomLocation",       label: "Kit Container Location",    type: "text",        required: true,
      placeholder: "e.g. Emergency Cabinet - Staff Room" },
    { name: "masterDrugBoxExpiry", label: "Master Drug Box Expiry Date", type: "date",     required: true,
      help: "Earliest expiring drug batch code inside the tray." },
    { name: "suctionPresent",     label: "Portable Suction Unit Present & Functional", type: "toggle",
      defaultValue: true },
    { name: "bvmPresent",         label: "Bag-Valve-Mask (BVM) Kit Present", type: "toggle",
      defaultValue: true },
  ],
};

/**
 * @typedef {Object} AedAssetInput
 * @property {string}       roomLocation         Required
 * @property {string}       makeModel            Required
 * @property {string}       serialNumber         Required
 * @property {string}       adultPadsExpiry      ISO date, required
 * @property {string|null}  paediatricPadsExpiry ISO date, required iff site.paediatricKitRequired
 * @property {string}       batteryExpiry        ISO date, required
 *
 * @typedef {Object} OxygenAssetInput
 * @property {"CD"|"E"}     cylinderSize         Required
 * @property {string}       serialNumber         Required
 * @property {string}       cylinderSwapDate     ISO date, required
 *
 * @typedef {Object} DrugKitAssetInput
 * @property {string}       roomLocation         Required
 * @property {string}       masterDrugBoxExpiry  ISO date, required
 * @property {boolean}      suctionPresent       Toggle
 * @property {boolean}      bvmPresent           Toggle
 */
