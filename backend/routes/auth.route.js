import express from "express";
import login from "../controllers/authController/login.controller.js";
import signup from "../controllers/authController/signup.controller.js";
import logout from "../controllers/authController/logout.controller.js";
import verifyEmail from "../controllers/authController/verifyEmail.controller.js";
import { verifyOtp } from "../controllers/authController/verifyOtp.Cotroller.js";
import { sendOtp } from "../controllers/authController/sendOtp.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);

router.post("/verify-otp", verifyOtp);
router.get("/send-Otp", sendOtp);
export default router;
