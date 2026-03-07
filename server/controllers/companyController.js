import { inngest } from "../inngest/index.js";
import Company from "../models/Company.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCompanyByIdOrClerkId = async (companyId) => {
  const byMongoId = await Company.findById(companyId).populate(
    "members",
    "_id full_name username profile_picture"
  );

  if (byMongoId) {
    return byMongoId;
  }

  return Company.findOne({ clerkOrganizationId: companyId }).populate(
    "members",
    "_id full_name username profile_picture"
  );
};

export const syncCompanyFromOrganization = async (req, res) => {
  try {
    const { userId } = req.auth();
    const {
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
    } = req.body;

    if (!clerkOrganizationId || !name) {
      return res.json({
        success: false,
        message: "clerkOrganizationId e name sao obrigatorios.",
      });
    }

    await inngest.send({
      name: "app/company.upsert",
      data: {
        ownerId: userId,
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
        technologies,
        frameworks,
        certifications,
      },
    });

    let company = null;
    for (let i = 0; i < 8; i += 1) {
      company = await Company.findOne({ clerkOrganizationId }).populate(
        "members",
        "_id full_name username profile_picture"
      );
      if (company) break;
      await wait(500);
    }

    return res.json({
      success: true,
      message: "Sincronizacao da empresa enviada com sucesso.",
      company,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getMyCompany = async (req, res) => {
  try {
    const { userId } = req.auth();
    const company = await Company.findOne({ ownerId: userId }).populate(
      "members",
      "_id full_name username profile_picture"
    );

    if (!company) {
      return res.json({
        success: false,
        message: "Voce ainda nao possui empresa cadastrada.",
      });
    }

    res.json({ success: true, company });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getCompanyDetails = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { companyId } = req.params;

    const company = await getCompanyByIdOrClerkId(companyId);
    if (!company) {
      return res.json({ success: false, message: "Empresa nao encontrada." });
    }

    const isOwner = String(company.ownerId) === String(userId);
    const isMember = company.members.some((member) =>
      typeof member === "string"
        ? String(member) === String(userId)
        : String(member?._id) === String(userId)
    );

    res.json({ success: true, company, isOwner, isMember });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const listCompanies = async (req, res) => {
  try {
    const { userId } = req.auth();
    const query = String(req.query.q || "").trim();
    const filter = query
      ? {
          $or: [
            { name: new RegExp(query, "i") },
            { industry: new RegExp(query, "i") },
            { location: new RegExp(query, "i") },
          ],
        }
      : {};

    const companies = await Company.find(filter)
      .populate("members", "_id")
      .sort({ createdAt: -1 })
      .limit(50);

    const normalizedCompanies = companies.map((company) => {
      const isOwner = String(company.ownerId) === String(userId);
      const isMember = company.members.some((member) => String(member._id) === String(userId));
      return {
        _id: company._id,
        clerkOrganizationId: company.clerkOrganizationId,
        ownerId: company.ownerId,
        name: company.name,
        slug: company.slug,
        industry: company.industry,
        size: company.size,
        location: company.location,
        website: company.website,
        description: company.description,
        logo: company.logo,
        cover: company.cover,
        memberCount: company.members.length,
        isOwner,
        isMember,
      };
    });

    res.json({ success: true, companies: normalizedCompanies });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const joinCompany = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.json({ success: false, message: "Empresa nao encontrada." });
    }

    if (!company.members.includes(userId)) {
      company.members.push(userId);
      await company.save();
    }

    res.json({ success: true, message: "Voce agora faz parte da empresa." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
