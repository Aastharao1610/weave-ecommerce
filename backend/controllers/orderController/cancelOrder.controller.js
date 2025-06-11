import prisma from "../../lib/db.js";

const cancelOrder = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(req.params.orderId),
      },
    });
    //if order exsit or beloeng to user
    if (!order || order.userId != req.user.userId) {
      return res.status(404).json({ error: "Order not found" });
    }
    //some conditions to cance lthe order
    if (order.status === "SHIPPED" || order.status === "DELVIERED") {
      return res.status(400).json({
        error: "Order cannot be cancelled as it has already been shipped",
      });
    } else {
      const cancelledOrder = await prisma.order.update({
        where: {
          id: parseInt(req.params.orderId),
        },
        data: {
          status: "CANCELED",
          updatedAt: new Date(),
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
      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        order: cancelledOrder,
      });
    }
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to cancel order",
    });
  }
};

export default cancelOrder;
