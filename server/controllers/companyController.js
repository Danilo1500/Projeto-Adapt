import { inngest } from "../inngest/index.js";
import { getAdminClerkOrganization } from "../services/companyAuthorization.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import {
  COMPANY_ROLES,
  getCompanyAccess,
  getCompanyMembers,
  getMemberUserId,
  hasCompanyPermission,
  serializeCompanyMembers,
  upsertCompanyMember,
} from "../services/companyAccess.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { claimCompanyOrganization } from "../services/companyOwnership.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const cleanText = (value, maxLength) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";
const cleanStringList = (value, maxItems = 40, maxLength = 60) => Array.isArray(value)
  ? [...new Set(value.filter((item) => typeof item === "string").map((item) => item.trim().slice(0, maxLength)).filter(Boolean))].slice(0, maxItems)
  : [];

const withCompanyMembers = async (company) => {
  if (!company) return company;
  const value = company.toObject ? company.toObject() : { ...company };
  value.members = await serializeCompanyMembers(company, User);
  return value;
};

const findCompanyByIdOrClerkId = async (companyId) => {
  if (mongoose.isValidObjectId(companyId)) {
    const byMongoId = await Company.findById(companyId);
    if (byMongoId) return byMongoId;
  }
  return Company.findOne({ clerkOrganizationId: companyId });
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
      return res.status(400).json({
        success: false,
        message: "clerkOrganizationId e name sao obrigatorios.",
      });
    }

    const organization = await getAdminClerkOrganization(userId, clerkOrganizationId);
    if (!organization) {
      return res.status(403).json({ success: false, message: "Somente um administrador da organização pode sincronizar a empresa." });
    }

    const companyProfile = {
      industry: cleanText(industry, 100),
      size: cleanText(size, 60),
      location: cleanText(location, 160),
      website: cleanText(website, 500),
      description: cleanText(description, 4000),
      cover: cleanText(cover, 1000),
      logo: cleanText(logo, 1000),
      technologies: cleanStringList(technologies),
      frameworks: cleanStringList(frameworks),
      certifications: Array.isArray(certifications) ? certifications.slice(0, 50).filter((item) => item && typeof item === "object").map((item) => ({
        name: cleanText(item.name, 160),
        issuer: cleanText(item.issuer, 160),
        year: cleanText(item.year, 8),
        url: cleanText(item.url, 1000),
      })).filter((item) => item.name) : [],
    };

    const existingCompany = await Company.findOne({ clerkOrganizationId });
    if (existingCompany && String(existingCompany.ownerId) !== String(userId)) {
      return res.status(409).json({ success: false, message: "Esta organização já está vinculada a outra conta." });
    }

    const ownedCompanies = await Company.find({ ownerId: userId }).select("_id clerkOrganizationId").limit(2);
    if (ownedCompanies.some((company) => String(company.clerkOrganizationId) !== String(clerkOrganizationId))) {
      return res.status(409).json({
        success: false,
        code: "OWNER_COMPANY_CONFLICT",
        message: "Esta conta possui mais de uma empresa vinculada. Resolva o conflito antes de sincronizar outra empresa.",
      });
    }
    const syncOperationId = randomUUID();
    const syncRequestedAt = new Date();
    const pendingPayload = {
      ownerId: userId,
      clerkOrganizationId,
      name: organization.name,
      slug: organization.slug || cleanText(slug, 80),
      ...companyProfile,
    };
    const claimAcquired = await claimCompanyOrganization(User, userId, clerkOrganizationId, {
      payload: pendingPayload,
      syncOperationId,
      syncRequestedAt,
    });
    if (!claimAcquired) {
      return res.status(409).json({
        success: false,
        code: "OWNER_COMPANY_CLAIM_CONFLICT",
        message: "Esta conta já iniciou a sincronização de outra organização. Use a organização vinculada ou solicite revisão do vínculo pendente.",
      });
    }

    await inngest.send({
      name: "app/company.upsert",
      data: {
        ...pendingPayload,
        syncOperationId,
        syncRequestedAt,
      },
    });

    let company = null;
    for (let i = 0; i < 8; i += 1) {
      company = await Company.findOne({ clerkOrganizationId }).select("+lastSyncOperationId +lastSyncRequestedAt");
      if (company?.lastSyncOperationId === syncOperationId) break;
      await wait(500);
    }

    if (!company || company.lastSyncOperationId !== syncOperationId) {
      return res.status(202).json({
        success: false,
        code: "COMPANY_SYNC_PENDING",
        syncStatus: "pending",
        message: "A sincronização foi recebida, mas a persistência ainda não foi confirmada. Tente novamente em instantes.",
      });
    }

    await User.updateOne({ _id: userId, "pendingCompanySync.syncOperationId": syncOperationId }, {
      $unset: { pendingCompanySync: 1 },
    });
    return res.json({
      success: true,
      message: "Sincronizacao da empresa enviada com sucesso.",
      company: await withCompanyMembers(company),
    });
  } catch (error) {
    console.error("Failed to sync company from Clerk organization:", error);
    return res.status(500).json({ success: false, message: "Não foi possível sincronizar a empresa." });
  }
};

export const getPendingCompanySync = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).select("+pendingCompanySync").lean();
    return res.json({ success: true, pending: user?.pendingCompanySync || null });
  } catch (error) {
    console.error("Failed to load pending company sync:", error.message);
    return res.status(500).json({ success: false, message: "Nao foi possivel verificar a sincronizacao pendente." });
  }
};

export const getMyCompany = async (req, res) => {
  try {
    const { userId } = req.auth();
    const selectedId = String(req.query.companyId || "");
    const ownedCompanies = await Company.find({ ownerId: userId }).sort({ createdAt: 1 }).limit(2);
    if (ownedCompanies.length > 1) {
      return res.status(409).json({
        success: false,
        code: "OWNER_COMPANY_CONFLICT",
        message: "Sua conta possui mais de uma empresa vinculada. É necessária uma resolução explícita.",
      });
    }
    const candidateCompanies = await Company.find({
      $or: [{ ownerId: userId }, { members: String(userId) }, { "members.userId": String(userId) }],
    }).sort({ createdAt: 1 });
    const manageable = candidateCompanies.filter((item) => getCompanyAccess(item, userId).permissions.includes("manageJobs"));
    let company = selectedId
      ? manageable.find((item) => String(item._id) === selectedId) || null
      : manageable.length === 1 ? manageable[0] : null;
    if (selectedId && !company) return res.status(403).json({ success: false, message: "Você não tem permissão para gerenciar vagas nesta empresa." });
    if (!selectedId && manageable.length > 1) {
      return res.status(409).json({
        success: false,
        code: "COMPANY_SELECTION_REQUIRED",
        message: "Selecione a empresa que deseja gerenciar.",
        companies: manageable.map((item) => ({ _id: item._id, name: item.name, access: getCompanyAccess(item, userId) })),
      });
    }

    if (!company) {
      return res.json({
        success: false,
        message: "Voce ainda nao possui empresa cadastrada.",
      });
    }

    res.json({ success: true, company: await withCompanyMembers(company), access: getCompanyAccess(company, userId) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateMyCompany = async (req, res) => {
  try {
    const { userId } = req.auth();
    const {
      companyId = "",
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

    const company = companyId
      ? await findCompanyByIdOrClerkId(companyId)
      : await Company.findOne({ ownerId: userId });
    if (!company) {
      return res.status(404).json({ success: false, message: "Empresa nao encontrada." });
    }
    if (!hasCompanyPermission(company, userId, "manageCompany")) {
      return res.status(403).json({ success: false, message: "Você não tem permissão para editar esta empresa." });
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

    const updatedCompany = await Company.findByIdAndUpdate(company._id, updatedData, { new: true });

    res.json({
      success: true,
      company: await withCompanyMembers(updatedCompany),
      access: getCompanyAccess(updatedCompany, userId),
      message: "Empresa atualizada com sucesso.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getCompanyDetails = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { companyId } = req.params;

    const company = await findCompanyByIdOrClerkId(companyId);
    if (!company) {
      return res.json({ success: false, message: "Empresa nao encontrada." });
    }

    const access = getCompanyAccess(company, userId);
    res.json({
      success: true,
      company: await withCompanyMembers(company),
      isOwner: access.role === "owner",
      isMember: access.allowed,
      access,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const listCompanies = async (req, res) => {
  try {
    const { userId } = req.auth();
    const query = String(req.query.q || "").trim().slice(0, 100);
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = query
      ? {
          $or: [
            { name: new RegExp(safeQuery, "i") },
            { industry: new RegExp(safeQuery, "i") },
            { location: new RegExp(safeQuery, "i") },
          ],
        }
      : {};

    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const normalizedCompanies = companies.map((company) => {
      const access = getCompanyAccess(company, userId);
      const memberCount = getCompanyMembers(company).filter((member) => member.status === "active").length;
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
        memberCount,
        isOwner: access.role === "owner",
        isMember: access.allowed,
        access,
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

    const existingMember = getCompanyMembers(company).find((member) => member.userId === String(userId));
    if (existingMember?.status === "active") {
      return res.json({ success: true, message: "Você já participa desta empresa.", access: getCompanyAccess(company, userId) });
    }
    const user = await User.findById(userId).select("_id");
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    try {
      upsertCompanyMember(company, { userId, role: "viewer", status: "active" });
      await company.save();
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: "Voce agora faz parte da empresa.", access: getCompanyAccess(company, userId) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loadCompanyForMemberManagement = async (req, res, permission) => {
  const company = await findCompanyByIdOrClerkId(req.params.companyId);
  if (!company) {
    res.status(404).json({ success: false, message: "Empresa nao encontrada." });
    return null;
  }
  const access = getCompanyAccess(company, req.auth().userId);
  if (!access.permissions.includes(permission)) {
    res.status(403).json({ success: false, message: "Você não tem permissão para gerenciar membros desta empresa." });
    return null;
  }
  return { company, access };
};

export const addCompanyMember = async (req, res) => {
  try {
    const loaded = await loadCompanyForMemberManagement(req, res, "manageMembers");
    if (!loaded) return;
    const { company, access } = loaded;
    const targetUserId = String(req.body?.userId || "");
    const role = req.body?.role || "viewer";
    if (!targetUserId || !COMPANY_ROLES.includes(role) || role === "owner") {
      return res.status(400).json({ success: false, message: "Informe um usuário e um papel válidos." });
    }
    if (role === "admin" && access.role !== "owner") {
      return res.status(403).json({ success: false, message: "Somente o responsável pode atribuir o papel de administrador." });
    }
    const targetUser = await User.findById(targetUserId).select("_id");
    if (!targetUser) return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    if (String(company.ownerId) === targetUserId) {
      return res.status(409).json({ success: false, message: "O responsável já possui acesso de owner." });
    }
    const existingMember = getCompanyMembers(company).find((member) => member.userId === targetUserId);
    if (existingMember?.role === "admin" && access.role !== "owner") {
      return res.status(403).json({ success: false, message: "Somente o responsavel pode alterar um administrador." });
    }
    upsertCompanyMember(company, { userId: targetUserId, role, status: "active" });
    await company.save();
    return res.status(201).json({ success: true, company: await withCompanyMembers(company) });
  } catch (error) {
    console.error("Failed to add company member:", error);
    return res.status(500).json({ success: false, message: "Nao foi possivel adicionar o membro." });
  }
};

export const updateCompanyMemberRole = async (req, res) => {
  try {
    const loaded = await loadCompanyForMemberManagement(req, res, "manageMembers");
    if (!loaded) return;
    const { company, access } = loaded;
    const targetUserId = String(req.params.memberUserId || "");
    const role = req.body?.role;
    if (!COMPANY_ROLES.includes(role) || role === "owner") {
      return res.status(400).json({ success: false, message: "Papel inválido." });
    }
    if (String(company.ownerId) === targetUserId) {
      return res.status(409).json({ success: false, message: "O papel do responsável não pode ser alterado." });
    }
    const targetMembership = getCompanyMembers(company).find((member) => member.userId === targetUserId);
    if (!targetMembership) return res.status(404).json({ success: false, message: "Membro não encontrado." });
    if (access.role !== "owner" && (targetMembership.role === "admin" || role === "admin")) {
      return res.status(403).json({ success: false, message: "Somente o responsável pode alterar administradores." });
    }
    upsertCompanyMember(company, { userId: targetUserId, role, status: targetMembership.status, joinedAt: targetMembership.joinedAt || new Date() });
    await company.save();
    return res.json({ success: true, company: await withCompanyMembers(company) });
  } catch (error) {
    console.error("Failed to update company member role:", error);
    return res.status(500).json({ success: false, message: "Nao foi possivel atualizar o papel." });
  }
};

export const removeCompanyMember = async (req, res) => {
  try {
    const { userId } = req.auth();
    const loaded = await loadCompanyForMemberManagement(req, res, "manageMembers");
    if (!loaded) return;
    const { company, access } = loaded;
    const targetUserId = String(req.params.memberUserId || "");
    if (String(company.ownerId) === targetUserId) {
      return res.status(409).json({ success: false, message: "O responsável não pode ser removido da empresa." });
    }
    const targetMembership = getCompanyMembers(company).find((member) => member.userId === targetUserId);
    if (!targetMembership) return res.status(404).json({ success: false, message: "Membro não encontrado." });
    if (access.role !== "owner" && targetMembership.role === "admin") {
      return res.status(403).json({ success: false, message: "Somente o responsável pode remover um administrador." });
    }
    company.members = (Array.isArray(company.members) ? company.members : []).filter((member) => getMemberUserId(member) !== targetUserId);
    await company.save();
    return res.json({ success: true, company: await withCompanyMembers(company), removedUserId: targetUserId, requesterIsSelf: String(userId) === targetUserId });
  } catch (error) {
    console.error("Failed to remove company member:", error);
    return res.status(500).json({ success: false, message: "Nao foi possivel remover o membro." });
  }
};
