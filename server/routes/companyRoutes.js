import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getCompanyDetails,
  getMyCompany,
  joinCompany,
  listCompanies,
  syncCompanyFromOrganization,
  updateMyCompany,
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
companyRouter.get("/list", protect, listCompanies);
companyRouter.post("/:companyId/join", protect, joinCompany);
companyRouter.get("/:companyId", protect, getCompanyDetails);

export default companyRouter;
