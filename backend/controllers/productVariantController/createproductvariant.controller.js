import prisma from "../../lib/db.js";
const createProductVariant = async (req, res) => {
  try {
    const { productId, color, size, sku, stock, price } = req.body;

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        color,
        size,
        sku,
        stock,
        price,
      },
    });
    res.status(201).json(variant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default createProductVariant;
