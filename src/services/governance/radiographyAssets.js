/**
 * Radiography & IRMER hardware-asset metadata.
 *
 * Drives:
 *   • The Step 5 Equipment Register section headers + Add buttons
 *   • The Step 8 per-asset appendix slot generator (modality → equipment type)
 *   • Card icon / accent theming
 *
 * Each entry is a "physical hardware modality". Service contracts, software,
 * RPA/MPE providers and signage are intentionally excluded — they belong on
 * the SOP library or Operator entitlement page, not the equipment register.
 *
 * `profileFlag` is the Step 4 site-profile boolean that gates rendering.
 * Intraoral uses `alwaysVisible: true` because every dental practice with an
 * X-ray set has an intraoral unit — there's no realistic case where the
 * baseline category should be hidden.
 */

import { EquipmentType } from "./types";

export const RADIOGRAPHY_MODALITY_META = [
  {
    key:             "intraoral",
    equipmentType:   EquipmentType.intraoral_xray,
    profileFlag:     "intraoralXray",
    alwaysVisible:   true,
    title:           "Intraoral X-ray Units",
    titleShort:      "Intraoral unit",
    subtitle:        "Wall-mounted bitewing / periapical tube heads.",
    addButtonLabel:  "Add Intraoral Unit",
    icon:            "camera",
    accent:          "#006974",
  },
  {
    key:             "opg",
    equipmentType:   EquipmentType.opg_xray,
    profileFlag:     "opgXray",
    alwaysVisible:   false,
    title:           "Panoramic / Cephalometric (OPG) Units",
    titleShort:      "OPG unit",
    subtitle:        "Free-standing panoramic and cephalometric imaging units.",
    addButtonLabel:  "Add OPG Unit",
    icon:            "scan",
    accent:          "#1565c0",
  },
  {
    key:             "cbct",
    equipmentType:   EquipmentType.cbct_xray,
    profileFlag:     "cbctXray",
    alwaysVisible:   false,
    title:           "CBCT Scanners",
    titleShort:      "CBCT scanner",
    subtitle:        "Cone-beam 3D scanners — registered serials required for IRMER scope.",
    addButtonLabel:  "Add CBCT Scanner",
    icon:            "layers",
    accent:          "#6a1b9a",
  },
  {
    key:             "handheld",
    equipmentType:   EquipmentType.handheld_xray,
    profileFlag:     "handheldXray",
    alwaysVisible:   false,
    title:           "Handheld / Portable X-ray Units",
    titleShort:      "Handheld unit",
    subtitle:        "Battery-powered portable units — secure storage location required.",
    addButtonLabel:  "Add Handheld Unit",
    icon:            "zap",
    accent:          "#ef6c00",
  },
];

/**
 * Field schema for the Add Hardware Asset modal — the 5 IRR17-compliance
 * inputs captured for every radiation-emitting tube head. Modal renders
 * these directly (location dropdown is special-cased in the component to
 * accommodate the "Other" freeform escape hatch).
 */
export const RADIOGRAPHY_ASSET_FIELDS = [
  {
    name:     "roomLocation",
    label:    "Location / Surgery assigned",
    type:     "select",
    required: true,
    // options injected at render time so the list can adapt per site
  },
  {
    name:        "makeModel",
    label:       "Make & Model",
    type:        "text",
    required:    true,
    placeholder: "e.g. Belmont Phot-X II",
  },
  {
    name:        "serialNumber",
    label:       "Tube Head Serial Number",
    type:        "text",
    required:    true,
    placeholder: "Found on the tube head label",
    help:        "Critical for HSE notification and IRR17 record-keeping.",
  },
  {
    name:        "yearOfManufacture",
    label:       "Year of Manufacture",
    type:        "number",
    required:    false,
    placeholder: "e.g. 2019",
    help:        "(Optional — leave blank if unknown)",
  },
  {
    name:        "lastServiceDate",
    label:       "Last Routine Radiation Test (3-year IRR17 cycle)",
    type:        "date",
    required:    true,
    help:        "Statutory UK IRR17 radiation safety test — repeated every 3 years.",
  },
  /* Conditional field — only required when the parent modality is "handheld".
   * Schema declares it for documentation; the modal component branches on
   * `modalityKey === "handheld"` to render + validate it. */
  {
    name:        "secureStorageLocation",
    label:       "Designated Secure Storage Location",
    type:        "text",
    required:    false,            // schema-level optional; runtime-required for handheld only
    requiredFor: ["handheld"],
    placeholder: "e.g. Locked wall-cabinet in Surgery 1 / Practice Safe",
    help:        "IRR17 secure storage requirement — handheld units only.",
  },
];

/* TypeScript-style shape for documentation (consumed only by the modal
 * `onSave` callback). Kept as a JSDoc typedef so a future TS migration has
 * a single source of truth:
 *
 * @typedef {Object} RadiographyAssetInput
 * @property {string}        makeModel          Required — "Belmont Phot-X II"
 * @property {string|null}   serialNumber       Required — tube-head S/N
 * @property {string|null}   roomLocation       Required — "Surgery 3" or custom
 * @property {number|null}   yearOfManufacture  Optional — 1950..currentYear
 * @property {string|null}   lastServiceDate    Required — ISO date of last
 *                                              IRR17 Critical Examination
 * @property {string|null}   nextServiceDate    Auto-derived: lastServiceDate + 3y
 */
