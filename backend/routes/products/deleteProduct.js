import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const deleteProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    res
      .status(200)
      .json({ message: "Prodcut deleted sucessfully", product: deleteProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
});

export default router;
