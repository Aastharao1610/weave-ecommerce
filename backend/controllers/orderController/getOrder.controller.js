import prisma from "../../lib/db.js";

const getOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.userId,
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      message: `order fetched of user with ${orders.userId}`,
      orders,
    });
  } catch (error) {
    console.log(error);
    console.error("Failed to fetch orders:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve orders",
    });
  }
};
export default getOrder;
