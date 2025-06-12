import prisma from "../../lib/db.js";

const OrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;
    const validStatus = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        validStatus,
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(orderId),
      },
    });
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }
    const statusFlow = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
    const currentIndex = statusFlow.indexOf(order.status);
    const newIndex = statusFlow.indexOf(status);

    if (status === "CANCELLED") {
      // Can only cancel PENDING or PROCESSING orders
      if (!["PENDING", "PROCESSING"].includes(order.status)) {
        return res.status(400).json({
          error: `Cannot cancel order in ${order.status} status`,
        });
      }
    } else {
      if (newIndex <= currentIndex) {
        return res.status(400).json({
          error: `Cannot move order from ${order.status} to ${status}`,
        });
      }
    }
    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status,
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
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Status update failed:", error);
    return res.status(500).json({
      error: "Failed to update order status",
    });
  }
};
export default OrderStatus;
