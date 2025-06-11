import prisma from "../../lib/db.js";

const updateProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variantId = parseInt(id);
    const { color, size, sku, stock, price } = req.body;

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { color, size, sku, stock, price },
    });
    res.status(200).json(variant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default updateProductVariant;
