import { inngest } from "../inngest/index.js";
import Company from "../models/Company.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";

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

export const updateMyCompany = async (req, res) => {
  try {
    const { userId } = req.auth();
    const {
      name = "",
      slug = "",
      industry = "",
      size = "",
      location = "",
      website = "",
      description = "",
      technologies = "",
      frameworks = "",
    } = req.body;

    const company = await Company.findOne({ ownerId: userId });
    if (!company) {
      return res.json({ success: false, message: "Empresa nao encontrada." });
    }

    const parseTags = (value) => {
      if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
      return String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    };

    const updatedData = {
      name: name.trim() || company.name,
      slug: slug.trim() || company.slug,
      industry: industry.trim(),
      size: size.trim(),
      location: location.trim(),
      website: website.trim(),
      description: description.trim(),
      technologies: parseTags(technologies),
      frameworks: parseTags(frameworks),
    };

    const logoFile = req.files?.logo?.[0];
    const coverFile = req.files?.cover?.[0];

    if (logoFile) {
      try {
        const buffer = fs.readFileSync(logoFile.path);
        const response = await imagekit.upload({
          file: buffer,
          fileName: logoFile.originalname,
        });

        updatedData.logo = imagekit.url({
          path: response.filePath,
          transformation: [{ quality: "auto" }, { format: "webp" }, { width: "512" }],
        });
      } catch (error) {
        console.error("Error uploading company logo:", error);
      }
    }

    if (coverFile) {
      try {
        const buffer = fs.readFileSync(coverFile.path);
        const response = await imagekit.upload({
          file: buffer,
          fileName: coverFile.originalname,
        });

        updatedData.cover = imagekit.url({
          path: response.filePath,
          transformation: [{ quality: "auto" }, { format: "webp" }, { width: "1280" }],
        });
      } catch (error) {
        console.error("Error uploading company cover:", error);
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(company._id, updatedData, {
      new: true,
    }).populate("members", "_id full_name username profile_picture");

    res.json({ success: true, company: updatedCompany, message: "Empresa atualizada com sucesso." });
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
