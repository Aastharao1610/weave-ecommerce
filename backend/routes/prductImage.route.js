import express from "express";
import createImage from "../controllers/productImageController/uploadProductimage.controller.js";
import getImages from "../controllers/productImageController/getProductimage.controller.js";
import updateImage from "../controllers/productImageController/updateProductimage.controller.js";
import deleteImage from "../controllers/productImageController/deleteProductimage.controller.js";

const router = express.Router();

router.post("/", createImage);
router.get("/", getImages);
router.put("/:id", updateImage);
router.delete("/:id", deleteImage);

export default router;
