import express from "express";
import { verifyToken } from "../middleware/auth.js";
import createCheckoutSession from "../controllers/paymentController/checkoutSession.controller.js";
import webhookHandler from "../controllers/paymentController/webhook.controller.js";
import createPayment from "../controllers/paymentController/createPayement.controller.js";
const router = express.Router();

router.post("/create", createPayment);
router.post("/checkoutSession/:id", createCheckoutSession);
router.post("/webhookHandler", webhookHandler);

export default router;
