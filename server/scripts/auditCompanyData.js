import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { getMemberUserId } from "../services/companyAccess.js";

if (!process.argv.includes("--run-read-only-audit")) {
  console.log("Read-only only. Review the target database and rerun with --run-read-only-audit when authorized.");
  process.exit(0);
}

const chunks = (values, size = 500) => Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, (index + 1) * size));

try {
  await connectDB();
  const [companies, jobs] = await Promise.all([
    Company.find({}).lean(),
    Job.find({}).select("_id user company companyId").lean(),
  ]);
  const ownershipClaims = await User.find({ companyOrgClaim: { $exists: true, $ne: "" } })
    .select("_id +companyOrgClaim")
    .lean();

  const ownerCounts = new Map();
  const userIds = new Set();
  const invalidMemberEntries = [];
  const duplicateMembers = [];
  for (const company of companies) {
    const ownerId = String(company.ownerId || "");
    if (ownerId) {
      ownerCounts.set(ownerId, [...(ownerCounts.get(ownerId) || []), String(company._id)]);
      userIds.add(ownerId);
    }
    const seen = new Set();
    for (const [index, member] of (company.members || []).entries()) {
      const memberId = getMemberUserId(member);
      if (!memberId) {
        invalidMemberEntries.push({ companyId: String(company._id), index });
        continue;
      }
      userIds.add(memberId);
      if (seen.has(memberId)) duplicateMembers.push({ companyId: String(company._id), userId: memberId });
      seen.add(memberId);
    }
  }

  for (const job of jobs) if (job.user) userIds.add(String(job.user));

  const existingUserIds = new Set();
  for (const batch of chunks([...userIds])) {
    const users = await User.find({ _id: { $in: batch } }).select("_id").lean();
    users.forEach((user) => existingUserIds.add(String(user._id)));
  }

  const orphanOwners = companies
    .filter((company) => !company.ownerId || !existingUserIds.has(String(company.ownerId)))
    .map((company) => ({ companyId: String(company._id), ownerId: company.ownerId || null }));
  const orphanMembers = [];
  for (const company of companies) {
    for (const member of company.members || []) {
      const userId = getMemberUserId(member);
      if (userId && !existingUserIds.has(userId)) orphanMembers.push({ companyId: String(company._id), userId });
    }
  }

  const companiesById = new Set(companies.map((company) => String(company._id)));
  const organizationIds = new Set(companies.map((company) => String(company.clerkOrganizationId)));
  const companiesByOrganizationId = new Map(companies.map((company) => [String(company.clerkOrganizationId), company]));
  const invalidJobCompanyReferences = jobs
    .filter((job) => job.companyId && !companiesById.has(String(job.companyId)))
    .map((job) => ({ jobId: String(job._id), companyId: String(job.companyId) }));
  const orphanJobAuthors = jobs
    .filter((job) => job.user && !existingUserIds.has(String(job.user)))
    .map((job) => ({ jobId: String(job._id), userId: String(job.user) }));
  const jobsWithoutCompanyId = jobs
    .filter((job) => !job.companyId)
    .map((job) => ({ jobId: String(job._id), authorId: String(job.user || ""), companyLabel: job.company || "" }));

  const report = {
    generatedAt: new Date().toISOString(),
    database: mongoose.connection.name,
    mode: "read-only",
    totals: { usersReferenced: userIds.size, companies: companies.length, jobs: jobs.length },
    ownersWithMultipleCompanies: [...ownerCounts.entries()]
      .filter(([, ids]) => ids.length > 1)
      .map(([ownerId, companyIds]) => ({ ownerId, companyIds })),
    orphanOwners,
    duplicateMembers,
    orphanMembers,
    invalidMemberEntries,
    jobsWithoutCompanyId,
    invalidJobCompanyReferences,
    orphanJobAuthors,
    ownershipClaimsWithoutCompany: ownershipClaims
      .filter((user) => !organizationIds.has(String(user.companyOrgClaim)))
      .map((user) => ({ userId: String(user._id), clerkOrganizationId: user.companyOrgClaim })),
    ownershipClaimMismatches: ownershipClaims
      .filter((user) => {
        const company = companiesByOrganizationId.get(String(user.companyOrgClaim));
        return company && String(company.ownerId) !== String(user._id);
      })
      .map((user) => ({ userId: String(user._id), clerkOrganizationId: user.companyOrgClaim, companyId: String(companiesByOrganizationId.get(String(user.companyOrgClaim))._id) })),
  };
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error("Company data audit failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
