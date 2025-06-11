// routes/category.route.js
import express from "express";
import upload from "../utils/multer.js";
import { verifyToken } from "../middleware/auth.js";

import createCategory from "../controllers/categoryController/createCategory.controller.js";
import deleteCategory from "../controllers/categoryController/deleteController.controller.js";
import updateCategory from "../controllers/categoryController/updateCategory.controller.js";
import getCategory from "../controllers/categoryController/getController.controller.js";

const router = express.Router();

router.post("/create", verifyToken, upload.single("image"), createCategory);
router.get("/", verifyToken, getCategory);
router.put("/update/:id", verifyToken, upload.single("image"), updateCategory);
router.delete("/delete/:id", verifyToken, deleteCategory);

export default router;
