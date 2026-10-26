import assert from "node:assert/strict";
import { applyCompanyUpsert } from "./companySync.js";

const payload = {
  ownerId: "owner",
  clerkOrganizationId: "org_1",
  name: "Adapt",
  syncOperationId: "sync_1",
  syncRequestedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const createModel = (company = null) => {
  const state = { company, creates: 0, saves: 0 };
  return {
    state,
    findOne: () => state.company,
    create: async (data) => {
      state.creates += 1;
      state.company = { ...data, save: async function () { state.saves += 1; } };
      return state.company;
    },
  };
};

const model = createModel();
assert.equal((await applyCompanyUpsert(payload, model)).message, "Company created.");
assert.equal((await applyCompanyUpsert(payload, model)).message, "Company updated.");
assert.equal(model.state.creates, 1);
assert.equal(model.state.company.members.length, 1);
assert.equal(model.state.company.lastSyncOperationId, "sync_1");
assert.equal(model.state.saves, 1);

const racedCompany = {
  ...payload,
  members: ["owner"],
  save: async function () { this.saveCount = (this.saveCount || 0) + 1; },
};
let reads = 0;
const duplicateCreateModel = {
  findOne: async () => { reads += 1; return reads === 1 ? null : racedCompany; },
  create: async () => {
    const error = new Error("duplicate unique organization");
    error.code = 11000;
    throw error;
  },
};
assert.equal((await applyCompanyUpsert(payload, duplicateCreateModel)).message, "Company updated.");
assert.equal(racedCompany.saveCount, 1);
assert.equal(racedCompany.members.length, 1);

const conflicting = createModel({ ownerId: "different-owner", clerkOrganizationId: "org_1", members: [], save: async () => {} });
await assert.rejects(() => applyCompanyUpsert(payload, conflicting), /owner conflict/i);

const newer = createModel({
  ownerId: "owner",
  clerkOrganizationId: "org_1",
  lastSyncRequestedAt: new Date("2025-02-01T00:00:00.000Z"),
  members: ["owner"],
  save: async () => { assert.fail("stale event must not save"); },
});
assert.equal((await applyCompanyUpsert(payload, newer)).message, "Stale company sync event ignored.");
console.log("Company sync tests passed.");
