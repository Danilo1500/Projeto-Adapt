import assert from "node:assert/strict";
import {
  getCompanyAccess,
  getCompanyMembers,
  getMemberUserId,
  hasCompanyPermission,
  planCompanyMemberMigration,
  upsertCompanyMember,
} from "./companyAccess.js";

const legacyCompany = { ownerId: "owner", members: ["owner", "viewer", "viewer", null] };
assert.equal(getMemberUserId("member-id"), "member-id");
assert.equal(getMemberUserId({ userId: "member-id", role: "recruiter" }), "member-id");
assert.equal(getMemberUserId({ user: { _id: "member-id" } }), "member-id");
assert.equal(getCompanyAccess(legacyCompany, "owner").role, "owner");
assert.equal(hasCompanyPermission(legacyCompany, "owner", "manageRoles"), true);
assert.equal(getCompanyAccess(legacyCompany, "viewer").role, "viewer");
assert.equal(hasCompanyPermission(legacyCompany, "viewer", "view"), true);
assert.equal(hasCompanyPermission(legacyCompany, "viewer", "manageJobs"), false);
assert.equal(getCompanyMembers(legacyCompany).length, 2);

const mixedCompany = {
  ownerId: "owner",
  members: ["legacy-member", { userId: "recruiter", role: "recruiter", status: "active" }],
};
assert.equal(hasCompanyPermission(mixedCompany, "legacy-member", "manageJobs"), false);
assert.equal(hasCompanyPermission(mixedCompany, "recruiter", "manageJobs"), true);
assert.equal(hasCompanyPermission(mixedCompany, "recruiter", "manageCompany"), false);
const adminCompany = { ownerId: "owner", members: [{ userId: "admin", role: "admin", status: "active" }] };
assert.equal(hasCompanyPermission(adminCompany, "admin", "manageMembers"), true);
assert.equal(hasCompanyPermission(adminCompany, "admin", "manageCompany"), true);
assert.equal(hasCompanyPermission(adminCompany, "admin", "manageRoles"), false);
assert.equal(hasCompanyPermission(adminCompany, "outsider", "view"), false);
assert.equal(hasCompanyPermission({ ownerId: "owner", members: [] }, "owner", "manageRoles"), true);
assert.equal(getCompanyAccess({ ownerId: "owner", members: [{ userId: "pending", role: "admin", status: "pending" }] }, "pending").allowed, false);

upsertCompanyMember(mixedCompany, { userId: "legacy-member", role: "viewer", status: "active" });
assert.equal(mixedCompany.members.filter((member) => getMemberUserId(member) === "legacy-member").length, 1);
assert.equal(mixedCompany.members.find((member) => getMemberUserId(member) === "legacy-member").role, "viewer");
assert.equal(mixedCompany.members.some((member) => getMemberUserId(member) === "recruiter"), true);

assert.throws(() => upsertCompanyMember(mixedCompany, { userId: "x", role: "owner" }), TypeError);

const plan = planCompanyMemberMigration({
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  members: ["legacy", "legacy", { userId: "admin", role: "admin", status: "active", joinedAt: new Date("2024-02-01T00:00:00.000Z") }],
});
assert.equal(plan.safeToApply, true);
assert.equal(plan.memberCountAfter, 2);
assert.equal(plan.removedDuplicateCount, 1);
assert.equal(plan.members.find((member) => member.userId === "legacy").role, "viewer");
assert.equal(plan.members.find((member) => member.userId === "admin").role, "admin");
assert.equal(planCompanyMemberMigration({ members: [null] }).safeToApply, false);
const duplicateRoles = { ownerId: "owner", members: [
  { userId: "duplicate", role: "admin", status: "active" },
  { userId: "duplicate", role: "viewer", status: "removed" },
] };
assert.equal(getCompanyAccess(duplicateRoles, "duplicate").allowed, false);
assert.equal(getCompanyAccess(duplicateRoles, "duplicate").role, "viewer");
console.log("Company authorization tests passed.");
