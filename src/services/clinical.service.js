import {
  clinicalTabsFixture,
  emergencyDrugsFixture,
  laDrugsFixture,
  antibioticsFixture,
  protocolCategoriesFixture,
  safeguardingContactsFixture,
  safeguardingDocsFixture,
} from "./fixtures/clinical.fixture";
import { pilsFixture, pilCategories } from "./fixtures/clinical-pils.fixture";
import { consentsFixture, consentCategories } from "./fixtures/clinical-consents.fixture";
import { referralSpecialties } from "./fixtures/clinical-referrals.fixture";
import { perioQuickRefFixture }     from "./fixtures/clinical-perio-quickref.fixture";
import { endoQuickRefFixture }      from "./fixtures/clinical-endo-quickref.fixture";
import { iosQuickRefFixture }       from "./fixtures/clinical-ios-quickref.fixture";
import { whiteningQuickRefFixture } from "./fixtures/clinical-whitening-quickref.fixture";
import { deconQuickRefFixture }       from "./fixtures/clinical-decon-quickref.fixture";
import { radiographyQuickRefFixture } from "./fixtures/clinical-radiography-quickref.fixture";
import { medEmergQuickRefFixture }    from "./fixtures/clinical-medemerg-quickref.fixture";
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
  return pilsFixture.map((p) => ({ ...p }));
  // return fetchJson("/clinical/pils");
}

export async function listPilCategories() {
  await simulateLatency();
  return [...pilCategories];
  // return fetchJson("/clinical/pils/categories");
}

export async function getPil(id) {
  await simulateLatency();
  const p = pilsFixture.find((x) => x.id === id);
  return p ? JSON.parse(JSON.stringify(p)) : null;
  // return fetchJson(`/clinical/pils/${id}`);
}

export async function listConsents() {
  await simulateLatency();
  return consentsFixture.map((c) => ({ ...c }));
  // return fetchJson("/clinical/consents");
}

export async function listConsentCategories() {
  await simulateLatency();
  return [...consentCategories];
  // return fetchJson("/clinical/consents/categories");
}

export async function getConsent(id) {
  await simulateLatency();
  const c = consentsFixture.find((x) => x.id === id);
  return c ? JSON.parse(JSON.stringify(c)) : null;
  // return fetchJson(`/clinical/consents/${id}`);
}

export async function listReferralSpecialties() {
  await simulateLatency();
  return referralSpecialties.map((s) => ({
    ...s,
    documents: s.documents.map((d) => {
      const { sections, ...meta } = d;
      return { ...meta, hasContent: Array.isArray(sections) && sections.length > 0 };
    }),
  }));
  // return fetchJson("/clinical/referrals/specialties");
}

export async function getReferralDocument(specialtyId, docId) {
  await simulateLatency();
  const s = referralSpecialties.find((x) => x.id === specialtyId);
  const d = s?.documents.find((x) => x.id === docId);
  if (!d) return null;
  return {
    ...JSON.parse(JSON.stringify(d)),
    specialty: { id: s.id, label: s.label, color: s.color, icon: s.icon },
  };
  // return fetchJson(`/clinical/referrals/${specialtyId}/${docId}`);
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

export async function listPerioQuickRef() {
  await simulateLatency();
  return perioQuickRefFixture.map((c) => ({ ...c }));
  // return fetchJson("/clinical/perio/quick-reference");
}

export async function listEndoQuickRef() {
  await simulateLatency();
  return endoQuickRefFixture.map((c) => ({ ...c }));
  // return fetchJson("/clinical/endo/quick-reference");
}

export async function listIosQuickRef() {
  await simulateLatency();
  return iosQuickRefFixture.map((c) => ({ ...c }));
  // return fetchJson("/clinical/ios/quick-reference");
}

export async function listWhiteningQuickRef() {
  await simulateLatency();
  return whiteningQuickRefFixture.map((c) => ({ ...c }));
  // return fetchJson("/clinical/whitening/quick-reference");
}

export async function listDeconQuickRef() {
  await simulateLatency();
  return deconQuickRefFixture.map((c) => ({ ...c }));
  // return fetchJson("/clinical/decon/quick-reference");
}

export async function listRadiographyQuickRef() {
  await simulateLatency();
  return radiographyQuickRefFixture.map((c) => ({ ...c }));
  // return fetchJson("/clinical/radiography/quick-reference");
}

export async function listMedEmergQuickRef() {
  await simulateLatency();
  return medEmergQuickRefFixture.map((c) => ({ ...c }));
  // return fetchJson("/clinical/medical-emergencies/quick-reference");
}
