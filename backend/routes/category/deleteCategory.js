import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    const deleteCategory = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    res.status(200).json({
      message: "Category deleted Sucessfully",
      category: deleteCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Interal Server Error" });
  }
});
export default router;
