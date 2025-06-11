import prisma from "../../lib/db.js";

const getSubcategory = async (req, res) => {
  try {
    const getSubcategory = await prisma.subcategory.findMany({
      include: {
        category: true,
        products: true,
      },
    });
    res.status(200).json({
      message: "Sub cateogory get sucessfully",
      subcategory: getSubcategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server Error",
      error,
    });
  }
};
export default getSubcategory;
