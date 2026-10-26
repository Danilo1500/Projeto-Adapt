export const claimCompanyOrganization = async (UserModel, userId, clerkOrganizationId, pendingSync = null) => {
  if (!userId || !clerkOrganizationId) return false;
  const claimed = await UserModel.findOneAndUpdate({
    _id: String(userId),
    $or: [
      { companyOrgClaim: { $exists: false } },
      { companyOrgClaim: "" },
      { companyOrgClaim: null },
      { companyOrgClaim: String(clerkOrganizationId) },
    ],
  }, {
    $set: {
      companyOrgClaim: String(clerkOrganizationId),
      ...(pendingSync ? { pendingCompanySync: pendingSync } : {}),
    },
  }, { new: true, projection: { _id: 1 } });
  return Boolean(claimed);
};
