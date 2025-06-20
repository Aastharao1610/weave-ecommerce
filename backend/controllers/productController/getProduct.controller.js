import prisma from "../../lib/db.js";
const getproduct = async (req, res) => {
  try {
    const getproduct = await prisma.product.findMany({
      include: {
        variant: true,
        images: true,
      },
    });
    if (getproduct) {
      res.status(200).json({
        message: "Products fetched successfully",
        product: getproduct,
      });
    } else {
      res.status(404).json({ message: "Some issue in fetching data" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error", error });
  }
};
export default getproduct;
