import prisma from "../../lib/db.js";

const getCategory = async (req, res) => {
  try {
    const getCategory = await prisma.category.findMany({
      include: {
        Subcategory: {
          include: {
            products: true,
          },
        },
      },
    });
    res
      .status(200)
      .json({ message: "Get all category", category: getCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};
export default getCategory;
