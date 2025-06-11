import prisma from "../../lib/db.js";

const getcartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not Found" });
    }
    res.status(200).json({ message: "Cart Itme get successfully", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default getcartItem;
