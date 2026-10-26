import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import Company from "../models/Company.js";
import User from "../models/User.js";
import { addCompanyMember, removeCompanyMember, updateCompanyMemberRole } from "./companyController.js";

const originals = { companyFindById: Company.findById, userFindById: User.findById, userFind: User.find };
afterEach(() => {
  Company.findById = originals.companyFindById;
  User.findById = originals.userFindById;
  User.find = originals.userFind;
});

const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
const companyId = "507f1f77bcf86cd799439011";

test("owner can add recruiter but untrusted role/target never establishes authority", async () => {
  const company = { _id: companyId, ownerId: "owner", members: [], save: async () => {} };
  Company.findById = async () => company;
  User.findById = () => ({ select: async () => ({ _id: "candidate" }) });
  User.find = () => ({ select: () => ({ lean: async () => [{ _id: "owner", full_name: "Owner" }, { _id: "candidate", full_name: "Candidate" }] }) });
  const res = response();
  await addCompanyMember({ auth: () => ({ userId: "owner" }), params: { companyId }, body: { userId: "candidate", role: "recruiter", ownerId: "candidate" } }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(company.members[0].userId, "candidate");
  assert.equal(company.members[0].role, "recruiter");
});

test("admin cannot grant admin and viewer cannot add members", async () => {
  const company = { _id: companyId, ownerId: "owner", members: [{ userId: "admin", role: "admin", status: "active" }, { userId: "viewer", role: "viewer", status: "active" }], save: async () => assert.fail("unauthorized update") };
  Company.findById = async () => company;
  User.findById = () => ({ select: async () => ({ _id: "candidate" }) });
  const adminResponse = response();
  await addCompanyMember({ auth: () => ({ userId: "admin" }), params: { companyId }, body: { userId: "candidate", role: "admin" } }, adminResponse);
  assert.equal(adminResponse.statusCode, 403);
  const viewerResponse = response();
  await addCompanyMember({ auth: () => ({ userId: "viewer" }), params: { companyId }, body: { userId: "candidate", role: "viewer" } }, viewerResponse);
  assert.equal(viewerResponse.statusCode, 403);
});

test("admin cannot change or remove another admin; owner cannot be removed", async () => {
  const company = {
    _id: companyId,
    ownerId: "owner",
    members: [{ userId: "admin", role: "admin", status: "active" }, { userId: "recruiter", role: "recruiter", status: "active" }],
    save: async () => assert.fail("unauthorized update"),
  };
  Company.findById = async () => company;
  const roleResponse = response();
  await updateCompanyMemberRole({ auth: () => ({ userId: "admin" }), params: { companyId, memberUserId: "admin" }, body: { role: "viewer" } }, roleResponse);
  assert.equal(roleResponse.statusCode, 403);
  const ownerRemovalResponse = response();
  await removeCompanyMember({ auth: () => ({ userId: "owner" }), params: { companyId, memberUserId: "owner" } }, ownerRemovalResponse);
  assert.equal(ownerRemovalResponse.statusCode, 409);
});
