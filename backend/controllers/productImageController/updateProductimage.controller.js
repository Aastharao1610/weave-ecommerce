import prisma from "../../lib/db.js";

const updateImage = async (req, res) => {
  try {
    const imageId = parseInt(req.params.id);
    const { url, altText } = req.body;

    const updated = await prisma.productImage.update({
      where: { id: imageId },
      data: { url, altText },
    });

    res.status(200).json({ message: "Image updated", image: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update image" });
  }
};

export default updateImage;
