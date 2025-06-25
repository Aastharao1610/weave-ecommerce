// controllers/orderController/ge.controller.js
import prisma from "../../lib/db.js";

const getOrderByID = async (req, res) => {
  try {
    const { role, userId } = req.user || {};
    const orderId = parseInt(req.params.id);

    if (!orderId) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    Subcategory: {
                      include: {
                        category: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If not admin, ensure the user owns this order
    if (role !== "ADMIN" && order.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.status(200).json({ order });
  } catch (err) {
    console.error("Failed to fetch order by ID:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getOrderByID;
