import {
  clinicalTabsFixture,
  emergencyDrugsFixture,
  laDrugsFixture,
  antibioticsFixture,
  protocolCategoriesFixture,
  pilsFixture,
  safeguardingContactsFixture,
  safeguardingDocsFixture,
} from "./fixtures/clinical.fixture";
import { simulateLatency } from "./delay";
// import { fetchJson } from "./http";

export async function listClinicalTabs() {
  await simulateLatency();
  return [...clinicalTabsFixture];
  // return fetchJson("/clinical/tabs");
}

export async function listEmergencyDrugs() {
  await simulateLatency();
  return [...emergencyDrugsFixture];
  // return fetchJson("/clinical/emergency-drugs");
}

export async function listLaDrugs() {
  await simulateLatency();
  return [...laDrugsFixture];
  // return fetchJson("/clinical/la-drugs");
}

export async function listAntibiotics() {
  await simulateLatency();
  return [...antibioticsFixture];
  // return fetchJson("/clinical/antibiotics");
}

export async function listProtocolCategories() {
  await simulateLatency();
  return protocolCategoriesFixture.map((c) => ({ ...c, items: [...c.items] }));
  // return fetchJson("/clinical/protocols");
}

export async function listPils() {
  await simulateLatency();
  return [...pilsFixture];
  // return fetchJson("/clinical/pils");
}

export async function listSafeguardingContacts() {
  await simulateLatency();
  return [...safeguardingContactsFixture];
  // return fetchJson("/clinical/safeguarding/contacts");
}

export async function listSafeguardingDocs() {
  await simulateLatency();
  return [...safeguardingDocsFixture];
  // return fetchJson("/clinical/safeguarding/docs");
}
