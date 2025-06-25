import express from "express";
import saveAddress from "../controllers/authController/saveAddress.controller.js";
import getAddress from "../controllers/authController/getAddress.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/address/save", verifyToken, saveAddress);
router.get("/address", verifyToken, getAddress);

export default router;
