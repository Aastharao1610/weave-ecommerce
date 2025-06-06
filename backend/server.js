// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products/createProducts.js";
import createCategoryRoutes from "./routes/category/createCategory.js";
import updateCategoryRoutes from "./routes/category/updateCategory.js";
import getCategoryRoutes from "./routes/category/getCategory.js";
import deleteCategoryRoutes from "./routes/category/deleteCategory.js";
import updateProductRoutes from "./routes/products/updateProduct.js";
import deleteProductRoute from "./routes/products/deleteProduct.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/category", createCategoryRoutes); // POST /api/category/create
app.use("/api/category", updateCategoryRoutes);
app.use("/api/category", getCategoryRoutes);
app.use("/api/category", deleteCategoryRoutes);
app.use("/api/products/", productRoutes);
app.use("/api/products", updateProductRoutes);
app.use("/api/products", deleteProductRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
