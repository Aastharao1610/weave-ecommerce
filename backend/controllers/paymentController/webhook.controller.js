import stripe from "../../lib/stripe.js";
import prisma from "../../lib/db.js";
import { generateInvoicePDF } from "../../lib/pdfGenerator.js";
import { sendEmail } from "../../lib/mailer.js";
import fs from "fs";

const webhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = parseInt(session.metadata.orderId);

    const paymentUpdate = await prisma.payment.updateMany({
      where: { orderId },
      data: {
        status: "COMPLETED",
        transactionId: session.payment_intent,
        paymentMethod: session.payment_method_types?.[0] || "unknown",
        amount: session.amount_total / 100,
        paidAt: new Date(),
      },
    });
    if (paymentUpdate.count === 0) {
      console.error(` No payment record found for order ID ${orderId}`);
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED" },
    });
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            productVariant: true,
          },
        },
      },
    });

    // Generate PDF
    const invoiceData = {
      orderId,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      customerEmail: order.user.email,
      items: order.items.map((item) => ({
        name: item.productVariant.name,
        quantity: item.quantity,
        price: item.priceAtPurchase,
        total: item.priceAtPurchase * item.quantity,
      })),
      total: order.total,
    };

    const pdfPath = await generateInvoicePDF(invoiceData);
    console.log("PDF path:", pdfPath); // should be something like '.../invoices/invoice-4.pdf'
    console.log("PDF exists?", fs.existsSync(pdfPath)); // should return true

    await sendEmail({
      to: order.user.email,
      subject: `Invoice for OrderId ${orderId} `,
      html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your payment has been received and order #${orderId} is confirmed.</p>
      <p>Attached is your invoice.</p>
    `,
      attachments: [
        {
          filename: `invoice-${orderId}.pdf`,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    });
    // fs.unlinkSync(pdfPath);
    // console.log(`✅ Payment confirmed. Invoice sent to ${customer_email}`);
    console.log(` Payment confirmed. Order ${orderId} marked as SHIPPED`);
  }
  res.json({ received: true });
};
export default webhookHandler;
