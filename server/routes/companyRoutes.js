import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getCompanyDetails,
  getMyCompany,
  getPendingCompanySync,
  addCompanyMember,
  joinCompany,
  listCompanies,
  syncCompanyFromOrganization,
  removeCompanyMember,
  updateMyCompany,
  updateCompanyMemberRole,
} from "../controllers/companyController.js";
import { upload } from "../configs/multer.js";

const companyRouter = express.Router();

companyRouter.post("/sync", protect, syncCompanyFromOrganization);
companyRouter.post(
  "/update",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateMyCompany
);
companyRouter.get("/my", protect, getMyCompany);
companyRouter.get("/sync/pending", protect, getPendingCompanySync);
companyRouter.get("/list", protect, listCompanies);
companyRouter.post("/:companyId/join", protect, joinCompany);
companyRouter.post("/:companyId/members", protect, addCompanyMember);
companyRouter.patch("/:companyId/members/:memberUserId", protect, updateCompanyMemberRole);
companyRouter.delete("/:companyId/members/:memberUserId", protect, removeCompanyMember);
companyRouter.get("/:companyId", protect, getCompanyDetails);

export default companyRouter;
