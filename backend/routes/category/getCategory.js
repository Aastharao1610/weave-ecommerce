import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const getCategory = await prisma.category.findMany({
      include: {
        parent: true,
        subCategories: true,
        products: true,
      },
    });
    res
      .status(200)
      .json({ message: "Get all category", category: getCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
});
export default router;
