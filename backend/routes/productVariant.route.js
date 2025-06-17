import express from "express";
import upload from "../utils/multer.js";
import { verifyToken } from "../middleware/auth.js";
import createProductVariant from "../controllers/productVariantController/createproductvariant.controller.js";
import updateProductVariant from "../controllers/productVariantController/updateproductvariant.controller.js";
import deleteProductVariant from "../controllers/productVariantController/deleteproductvariant.controller.js";
import getProductVariant from "../controllers/productVariantController/getproductvariant.controller.js";
const router = express.Router();

router.post(
  "/create",
  upload.array("image"),
  verifyToken,
  createProductVariant
);
router.get("/", getProductVariant);
router.put(
  "/update/:id",
  upload.array("image"),
  verifyToken,
  updateProductVariant
);
router.delete("/:id", verifyToken, deleteProductVariant);

export default router;
