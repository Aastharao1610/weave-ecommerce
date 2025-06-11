import prisma from "../../lib/db.js";

const createImage = async (req, res) => {
  try {
    const { productId, url, altText } = req.body;

    const image = await prisma.productImage.create({
      data: {
        productId,
        url,
        altText,
      },
    });

    res.status(201).json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default createImage;
