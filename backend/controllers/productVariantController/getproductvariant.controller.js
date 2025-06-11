import prisma from "../../lib/db.js";

const getProductVariant = async (req, res) => {
  try {
    const { productId } = req.query;
    const variants = await prisma.productVariant.findMany({
      where: productId ? { productId: parseInt(productId) } : undefined,
    });
    res.status(200).json(variants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product variants" });
  }
};

export default getProductVariant;
