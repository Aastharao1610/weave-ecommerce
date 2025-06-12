import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

import webhookHandler from "./controllers/paymentController/webhook.controller.js";
app.post(
  "/api/payments/webhookHandler",
  express.raw({ type: "application/json" }),
  webhookHandler
);

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import subCategoryRoutes from "./routes/subCategory.route.js";
import variantRoutes from "./routes/productVariant.route.js";
import imageRoutes from "./routes/prductImage.route.js";
import cartRoutes from "./routes/cart.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import orderRoutes from "./routes/order.route.js";
import paymentRoutes from "./routes/payment.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/subCategory", subCategoryRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api", (req, res) => {
  res.json({ status: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
export default app;
