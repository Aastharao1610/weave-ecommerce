import stripe from "../../lib/stripe.js";
import prisma from "../../lib/db.js";

const createCheckoutSession = async (req, res) => {
  const orderId = parseInt(req.params.id);
  console.log(orderId);
  if (isNaN(orderId)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }
  const order = await prisma.order.findUnique({
    where: {
      id: parseInt(orderId),
    },
    include: {
      items: {
        include: {
          productVariant: true,
        },
      },
    },
  });
  if (!order) {
    return res.status(400).json({ error: "Order not found" });
  }

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.productVariant.name || "Unknown Product",
      },
      unit_amount: Math.round(item.priceAtPurchase * 100),
    },
    quantity: item.quantity,
  }));
  const existingPayment = await prisma.payment.findFirst({
    where: { orderId: order.id },
  });
  if (existingPayment?.status === "COMPLETED") {
    return res.status(400).json({ error: "This order has already been paid." });
  }

  if (!existingPayment) {
    await prisma.payment.create({
      data: {
        orderId: order.id,
        userId: order.userId,
        amount: order.total,
        status: "PENDING",
        paymentMethod: "pending",
      },
    });
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `http://localhost:3000/orders/payement-success?orderId=${order.id}`,
    cancel_url: `http://localhost:3000/payment-cancel?orderId=${order.id}`,
    metadata: {
      orderId: order.id.toString(),
      userId: order.userId.toString(),
    },
  });

  return res.status(200).json({ url: session.url });
};
export default createCheckoutSession;
