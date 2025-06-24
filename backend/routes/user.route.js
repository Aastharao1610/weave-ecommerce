import express from "express";
import saveAddress from "../controllers/authController/saveAddress.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/address/save", verifyToken, saveAddress);

export default router;
