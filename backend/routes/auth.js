import loginRouter from "./login.js";
import signupRouter from "./signup.js";
import express from "express";

const router = express.Router();

router.post("/signup", signupRouter);
router.post("/login", loginRouter);

export default router;
