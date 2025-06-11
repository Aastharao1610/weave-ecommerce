import express from "express";
import { verifyToken } from "../middleware/auth.js";

import createWishlist from "../controllers/wislistController/createWishlist.js";
import getWishlist from "../controllers/wislistController/getWishlist.js";
import updateWishlistItem from "../controllers/wislistController/updateWishlist.js";
import deleteWishlistItem from "../controllers/wislistController/deleteWishlist.js";

const router = express.Router();

router.post("/create", verifyToken, createWishlist);
router.get("/", verifyToken, getWishlist);
router.get("/update/:id", verifyToken, updateWishlistItem);
router.delete("/delete/:id", verifyToken, deleteWishlistItem);

export default router;
