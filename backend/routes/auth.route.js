import express from "express";
import login from "../controllers/authController/login.controller.js";
import { signup } from "../controllers/authController/signup.controller.js";
import logout from "../controllers/authController/logout.controller.js";
import verifyEmail from "../controllers/authController/verifyEmail.controller.js";
import { verifyOtp } from "../controllers/authController/verifyOtp.Cotroller.js";
import { sendOtp } from "../controllers/authController/sendOtp.controller.js";
import { signupSchema } from "../utils/auth.validators.js";
import { validate } from "../middleware/validateInput.js";
import getUsers from "../controllers/authController/getUser.controller.js";
import deleteUser from "../controllers/authController/deleteUser.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/logout", logout);
// router.get("/verify-email", verifyEmail);

// router.post("/verify-otp", verifyOtp);
// router.get("/send-Otp", sendOtp);
// export default router;

// import express from "express";
// import login from "../controllers/authController/login.controller.js";
// import signup from "../controllers/authController/signup.controller.js";
// import logout from "../controllers/authController/logout.controller.js";
// import verifyEmail from "../controllers/authController/verifyEmail.controller.js";
// import { verifyOtp } from "../controllers/authController/verifyOtp.Cotroller.js";
// import { sendOtp } from "../controllers/authController/sendOtp.controller.js";

//const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing fields or user already exists
 */
router.post("/signup", validate(signupSchema), signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and return tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Incorrect password
 *       403:
 *         description: Email not verified
 *       404:
 *         description: User not found
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and clear refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Something went wrong
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verify user's email using token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token sent to user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get("/verify-email", verifyEmail);

/**
 * @swagger
 * /api/auth/verify-otp:
 *  post:
 *     summary: Verify OTP sent to phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - phone
 *             properties:
 *               otp:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /api/auth/send-Otp:
 *   post:
 *     summary: Send OTP to phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+917297943649"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Missing phone number
 *       500:
 *         description: Failed to send OTP
 */
router.post("/send-Otp", sendOtp);
router.get("/", getUsers);
router.delete("/user/:id", verifyToken, deleteUser);

export default router;
