import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getCompanyDetails,
  getMyCompany,
  joinCompany,
  listCompanies,
  syncCompanyFromOrganization,
} from "../controllers/companyController.js";

const companyRouter = express.Router();

companyRouter.post("/sync", protect, syncCompanyFromOrganization);
companyRouter.get("/my", protect, getMyCompany);
companyRouter.get("/list", protect, listCompanies);
companyRouter.post("/:companyId/join", protect, joinCompany);
companyRouter.get("/:companyId", protect, getCompanyDetails);

export default companyRouter;
