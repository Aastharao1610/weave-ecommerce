import prisma from "../../lib/db.js";

const deleteImage = async (req, res) => {
  try {
    const imageId = parseInt(req.params.id);

    await prisma.productImage.delete({ where: { id: imageId } });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default deleteImage;
