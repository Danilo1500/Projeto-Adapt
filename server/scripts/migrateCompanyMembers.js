import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import { getMemberUserId, planCompanyMemberMigration } from "../services/companyAccess.js";

const apply = process.argv.includes("--apply");
if (!process.argv.includes("--run-read-only-audit")) {
  console.log("No database was accessed. Review the target database, then rerun with --run-read-only-audit when authorized.");
  process.exit(0);
}
if (apply && !process.argv.includes("--backup-confirmed")) {
  throw new Error("Applying this migration requires a verified backup and --backup-confirmed.");
}

const summaries = [];
const batches = (values, size = 500) => Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, (index + 1) * size));

try {
  await connectDB();
  const companies = await Company.find({}).lean();
  const memberIds = [...new Set(companies.flatMap((company) => (company.members || []).map(getMemberUserId).filter(Boolean)))];
  const validUserIds = new Set();
  for (const batch of batches(memberIds)) {
    const users = await User.find({ _id: { $in: batch } }).select("_id").lean();
    users.forEach((user) => validUserIds.add(String(user._id)));
  }

  for (const company of companies) {
    const plan = planCompanyMemberMigration(company);
    const orphanUserIds = [...new Set((company.members || []).map(getMemberUserId).filter(Boolean).filter((id) => !validUserIds.has(id)))];
    const safe = plan.safeToApply && orphanUserIds.length === 0;
    const summary = {
      companyId: String(company._id),
      safeToApply: safe,
      memberCountBefore: plan.memberCountBefore,
      memberCountAfter: plan.memberCountAfter,
      removedDuplicateCount: plan.removedDuplicateCount,
      invalidEntryIndexes: plan.invalidEntries,
      orphanUserIds,
      applied: false,
    };
    if (apply && safe && plan.changed) {
      const versionFilter = company.__v == null ? { __v: { $exists: false } } : { __v: company.__v };
      const result = await Company.updateOne({ _id: company._id, ...versionFilter }, {
        $set: { members: plan.members },
        $inc: { __v: 1 },
      });
      summary.applied = result.modifiedCount === 1;
      summary.concurrentModification = result.modifiedCount !== 1;
    }
    if (plan.changed || !safe) summaries.push(summary);
  }

  console.log(JSON.stringify({
    mode: apply ? "apply-after-backup" : "dry-run",
    database: mongoose.connection.name,
    companyCount: companies.length,
    changedOrBlocked: summaries.length,
    summaries,
  }, null, 2));
  if (!apply) console.log("No data was changed. Review the audit report and take a verified backup before using --apply --backup-confirmed.");
} catch (error) {
  console.error("Company member migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
