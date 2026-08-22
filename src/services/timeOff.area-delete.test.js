import assert from "node:assert/strict";
import test from "node:test";

import {
  buildInitialTimeOffState,
  deleteAreaWithCascade,
} from "./timeOff.service.js";

const ownerIdFrom = (state) => state.users.find((user) => user.role === "companyOwner")?.id;

test("area deletion refuses to cascade into sites or user accounts", () => {
  const state = buildInitialTimeOffState();
  const ownerId = ownerIdFrom(state);
  const area = state.areas[0];

  assert.throws(
    () => deleteAreaWithCascade(state, ownerId, area.id, { confirmationText: area.name }),
    (error) => {
      assert.equal(error.code, "AREA_NOT_EMPTY");
      assert.ok(error.details.affectedSiteCount > 0);
      assert.ok(error.details.affectedUserCount > 0);
      return true;
    },
  );

  assert.equal(state.areas.some((item) => item.id === area.id), true);
  assert.equal(state.users.length, buildInitialTimeOffState().users.length);
});

test("an authorized user can delete an empty area and the action is audited", () => {
  const state = buildInitialTimeOffState();
  const ownerId = ownerIdFrom(state);
  const emptyArea = {
    id: "area-empty",
    name: "Empty Area",
    managerId: "",
    status: "active",
    description: "",
    siteIds: [],
  };
  state.areas.push(emptyArea);

  const result = deleteAreaWithCascade(state, ownerId, emptyArea.id, {
    confirmationText: emptyArea.name,
    now: "2026-07-16T12:00:00.000Z",
  });

  assert.equal(result.state.areas.some((area) => area.id === emptyArea.id), false);
  assert.equal(result.state.users.length, state.users.length);
  assert.equal(result.state.sites.length, state.sites.length);
  assert.deepEqual(result.deletedSites, []);
  assert.deepEqual(result.deletedUsers, []);
  assert.deepEqual(result.state.administrativeEvents.at(-1), {
    id: "admin-event-area-empty-2026-07-16t12-00-00-000z",
    action: "area.deleted",
    actorId: ownerId,
    targetType: "area",
    targetId: emptyArea.id,
    targetName: emptyArea.name,
    occurredAt: "2026-07-16T12:00:00.000Z",
  });
});

test("area deletion still requires an exact typed confirmation", () => {
  const state = buildInitialTimeOffState();
  const ownerId = ownerIdFrom(state);
  const emptyArea = { id: "area-empty", name: "Empty Area", siteIds: [] };
  state.areas.push(emptyArea);

  assert.throws(
    () => deleteAreaWithCascade(state, ownerId, emptyArea.id, { confirmationText: "empty area" }),
    (error) => error.code === "CONFIRMATION_REQUIRED",
  );
});
