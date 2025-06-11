import prisma from "../../lib/db.js";

const deleteProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variantId = parseInt(id);

    await prisma.productVariant.delete({ where: { id: variantId } });
    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export default deleteProductVariant;
