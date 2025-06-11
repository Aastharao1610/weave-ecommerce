import prisma from "../../lib/db.js";

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    await prisma.subcategory.deleteMany({
      where: { categoryId },
    });

    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Deletion Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default deleteCategory;
