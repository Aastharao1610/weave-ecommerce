import prisma from "../../lib/db.js";

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const ProdcutExists = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (ProdcutExists) {
      await prisma.productVariant.deleteMany({
        where: {
          productId: productId,
        },
      });
      await prisma.productImage.deleteMany({
        where: {
          productId: productId,
        },
      });

      const deleteProduct = await prisma.product.delete({
        where: {
          id: productId,
        },
      });
      res.status(200).json({
        message: "Prodcut deleted sucessfully",
        product: deleteProduct,
      });
    } else {
      res.status(404).json({ message: "Product does not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export default deleteProduct;
