import express from "express";
import upload from "../utils/multer.js";
import { verifyToken } from "../middleware/auth.js";
import createSubCategory from "../controllers/subCategoryController/createSubCategory.controller.js";
import updateSubCategory from "../controllers/subCategoryController/updateSubCategory.controller.js";
import getSubcategory from "../controllers/subCategoryController/getsubCategory.controller.js";
import deleteSubCategory from "../controllers/subCategoryController/deleteSubCategory.controller.js";

const router = express.Router();

router.post("/create", upload.single("image"), verifyToken, createSubCategory);
router.get("/", upload.single("image"), verifyToken, getSubcategory);
router.put(
  "/update/:id",
  upload.single("image"),
  verifyToken,
  updateSubCategory
);
router.delete("/:id", verifyToken, deleteSubCategory);

export default router;
