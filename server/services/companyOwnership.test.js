import assert from "node:assert/strict";
import { claimCompanyOrganization } from "./companyOwnership.js";

const makeUserModel = () => {
  const users = new Map([["owner", { _id: "owner", companyOrgClaim: "" }]]);
  return {
    users,
  findOneAndUpdate: async (filter, update) => {
      const user = users.get(filter._id);
      if (!user) return null;
      const matches = !user.companyOrgClaim || user.companyOrgClaim === update.$set.companyOrgClaim;
      if (!matches) return null;
      Object.assign(user, update.$set);
      return { _id: user._id };
    },
  };
};

const UserModel = makeUserModel();
const competing = await Promise.all([
  claimCompanyOrganization(UserModel, "owner", "org_a", { payload: { name: "A" } }),
  claimCompanyOrganization(UserModel, "owner", "org_b", { payload: { name: "B" } }),
]);
assert.equal(competing.filter(Boolean).length, 1);
const winningOrganization = UserModel.users.get("owner").companyOrgClaim;
assert.equal(UserModel.users.get("owner").pendingCompanySync.payload.name, winningOrganization === "org_a" ? "A" : "B");
assert.equal(await claimCompanyOrganization(UserModel, "owner", winningOrganization), true);
assert.equal(await claimCompanyOrganization(UserModel, "owner", "org_other"), false);
assert.equal(await claimCompanyOrganization(UserModel, "missing", "org_a"), false);
console.log("Company ownership claim tests passed.");
