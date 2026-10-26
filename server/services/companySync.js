import { getCompanyMembers, upsertCompanyMember } from "./companyAccess.js";

export const applyCompanyUpsert = async (data, CompanyModel) => {
  const {
    ownerId,
    clerkOrganizationId,
    name,
    slug = "",
    industry = "",
    size = "",
    location = "",
    website = "",
    description = "",
    cover = "",
    logo = "",
    technologies = [],
    frameworks = [],
    certifications = [],
    syncOperationId = "",
    syncRequestedAt = null,
  } = data || {};

  if (!ownerId || !clerkOrganizationId || !name) return { message: "Invalid payload for company upsert." };
  const loadCompany = async () => {
    const query = CompanyModel.findOne({ clerkOrganizationId });
    if (query && typeof query.select === "function") query.select("+lastSyncOperationId +lastSyncRequestedAt");
    return query;
  };
  const existingCompany = await loadCompany();
  if (!existingCompany) {
    try {
      await CompanyModel.create({
        ownerId,
        clerkOrganizationId,
        name,
        slug,
        industry,
        size,
        location,
        website,
        description,
        cover,
        logo,
        technologies: Array.isArray(technologies) ? technologies : [],
        frameworks: Array.isArray(frameworks) ? frameworks : [],
        certifications: Array.isArray(certifications) ? certifications : [],
        members: [ownerId],
        ...(syncOperationId ? { lastSyncOperationId: syncOperationId } : {}),
        ...(syncRequestedAt ? { lastSyncRequestedAt: syncRequestedAt } : {}),
      });
      return { message: "Company created." };
    } catch (error) {
      if (error?.code !== 11000) throw error;
      // Another retry/worker created the organization first; read and update that document.
    }
  }

  const company = existingCompany || await loadCompany();
  if (!company) throw new Error("Duplicate company create was reported, but the company could not be reloaded.");
  if (company.ownerId && String(company.ownerId) !== String(ownerId)) {
    throw new Error("Company owner conflict; refusing to apply organization sync event.");
  }
  if (syncRequestedAt && company.lastSyncRequestedAt && new Date(syncRequestedAt) < new Date(company.lastSyncRequestedAt)) {
    return { message: "Stale company sync event ignored." };
  }

  company.ownerId = company.ownerId || ownerId;
  company.name = name || company.name;
  company.slug = slug || company.slug;
  company.industry = industry;
  company.size = size;
  company.location = location;
  company.website = website;
  company.description = description;
  company.cover = cover;
  company.logo = logo;
  company.technologies = Array.isArray(technologies) ? technologies : [];
  company.frameworks = Array.isArray(frameworks) ? frameworks : [];
  company.certifications = Array.isArray(certifications) ? certifications : [];
  if (!getCompanyMembers(company).some((member) => member.userId === String(ownerId))) {
    upsertCompanyMember(company, { userId: ownerId, role: "viewer", status: "active" });
  }
  if (syncOperationId) company.lastSyncOperationId = syncOperationId;
  if (syncRequestedAt) company.lastSyncRequestedAt = syncRequestedAt;
  await company.save();
  return { message: "Company updated." };
};
