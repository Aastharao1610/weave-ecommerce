import express from "express";
import upload from "../utils/multer.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

import createProduct from "../controllers/productController/createProduct.controller.js";
import updateProduct from "../controllers/productController/updateProduct.controller.js";
import getproduct from "../controllers/productController/getProduct.controller.js";
import deleteProduct from "../controllers/productController/deleteProduct.controllr.js";

router.post("/create", verifyToken, upload.array("images"), createProduct);
router.get("/", getproduct);
router.put("/update/:id", verifyToken, upload.array("images"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
