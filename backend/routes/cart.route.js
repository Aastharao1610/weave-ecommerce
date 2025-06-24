import express from "express";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

import createCart from "../controllers/cartController/createCart.controller.js";
import updateCartItem from "../controllers/cartController/updateCart.controller.js";
import deleteCart from "../controllers/cartController/deleteCart.controller.js";
import getcartItem from "../controllers/cartController/getCart.cotroller.js";

router.post("/create", verifyToken, createCart);
router.get("/", verifyToken, getcartItem);
router.put("/update/:id", verifyToken, updateCartItem);
router.delete("/delete/:id", verifyToken, deleteCart);

export default router;
