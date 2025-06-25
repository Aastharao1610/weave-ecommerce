import express from "express";
import { verifyToken } from "../middleware/auth.js";
import createOrder from "../controllers/orderController/createOrder.controller.js";
import cancelOrder from "../controllers/orderController/CancelOrder.controller.js";
import getOrder from "../controllers/orderController/getOrder.controller.js";
import OrderStatus from "../controllers/orderController/orderStatus.controller.js";
import getOrderByID from "../controllers/orderController/getOrserById.controller.js";
const router = express.Router();

router.post("/create", verifyToken, createOrder);
router.patch("/:orderId/cancel", verifyToken, cancelOrder);
router.get("/", verifyToken, getOrder);
router.patch("/:orderId/status", verifyToken, OrderStatus);

router.get("/:id", verifyToken, getOrderByID);

export default router;
