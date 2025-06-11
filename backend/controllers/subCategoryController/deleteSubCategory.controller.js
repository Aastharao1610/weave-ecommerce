import prisma from "../../lib/db.js";
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategoryId = parseInt(id);
    if (isNaN(subcategoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: {
        id: subcategoryId,
      },
    });
    if (existingSubcategory) {
      //  await prisma.productVariant.deleteMany({
      //   where: {
      //     productId: productId,
      //   },
      // });
      // await prisma.productImage.deleteMany({
      //   where: {
      //     productId: productId,
      //   },
      // });
      // await prisma.product.deleteMany({
      //   where: {
      //     subcategoryId: subcategoryId,
      //   },
      // });

      const products = await prisma.product.findMany({
        where: { subcategoryId },
        select: { id: true },
      });

      for (const product of products) {
        await prisma.productVariant.deleteMany({
          where: { productId: product.id },
        });

        await prisma.productImage.deleteMany({
          where: { productId: product.id },
        });

        await prisma.product.delete({
          where: { id: product.id },
        });
      }
      const deleteSubCategory = await prisma.subcategory.delete({
        where: {
          id: subcategoryId,
        },
      });
      res.status(200).json({
        message: "SubCateogry Deleted Sucessfully",
        subcategory: deleteSubCategory,
      });
    } else {
      res
        .status(404)
        .json({ message: "SubCateogry with thid id does not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export default deleteSubCategory;
