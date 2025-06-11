import prisma from "../../lib/db.js";

const getImages = async (req, res) => {
  try {
    const { productId } = req.query;

    const images = await prisma.productImage.findMany({
      where: productId ? { productId: parseInt(productId) } : undefined,
    });

    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product images" });
  }
};

export default getImages;
