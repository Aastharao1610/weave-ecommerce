import prisma from "../../lib/db.js";

const createPayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(orderId),
      },
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.payment?.status === "COMPLETED")
      return res.status(400).json({ error: "Payment already completed" });

    await prisma.payment.update({
      where: {
        orderId: orderId,
      },
      include: {
        payment: true,
        user: true,
      },
      data: {
        status: "COMPLETED",
        transactionId: `TXN-${Date.now()}`,
        paidAt: new Date(),
      },
    });
    let newStatus = "SHIPPED";
    const isTestUser = order.user.email.includes("test");

    if (isTestUser) {
      newStatus = "DELIVERED";
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus },
    });

    return res.status(200).json({
      success: true,
      message: `Payment completed. Order status: ${newStatus}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Simulated payment failed", error);
    return res.status(500).json({ error: "Payment simulation failed" });
  }
};
export default createPayment;
