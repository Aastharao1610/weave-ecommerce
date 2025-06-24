import prisma from "../../lib/db.js";

const createOrder = async (req, res) => {
  let transaction;
  try {
    // 1. Authentication & Input Validation
    if (!req.user?.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const requiredFields = [
      "shippingName",
      "shippingPhone",
      "shippingStreet",
      "shippingCity",
      "shippingState",
      "shippingPostalCode",
      "shippingCountry",
      "items",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
      });
    }

    const { items: selectedItems, ...shippingBillingInfo } = req.body;

    // 2. Validate selected items
    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).json({ error: "Invalid items selection" });
    }

    // 3. Start transaction
    transaction = await prisma.$transaction(async (tx) => {
      // 4. Get cart with inventory data
      const cart = await tx.cart.findFirst({
        where: { userId: req.user.userId },
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

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // 5. Match and validate selected items
      const selectedCartItems = cart.items.filter((cartItem) => {
        const selected = selectedItems.find(
          (item) => item.productVariantId === cartItem.productVariantId
        );
        return selected && selected.quantity <= cartItem.quantity;
      });

      if (selectedCartItems.length !== selectedItems.length) {
        const invalidItems = selectedItems.filter(
          (item) =>
            !selectedCartItems.some(
              (ci) => ci.productVariantId === item.productVariantId
            )
        );
        throw new Error(`Invalid items: ${JSON.stringify(invalidItems)}`);
      }

      // 6. Check stock availability
      const outOfStockItems = selectedCartItems.filter(
        (item) => item.productVariant.stock < item.quantity
      );

      if (outOfStockItems.length > 0) {
        throw new Error(
          `Insufficient stock for: ${outOfStockItems.map(
            (i) => i.productVariantId
          )}`
        );
      }

      // 7. Calculate total
      const total = selectedCartItems.reduce(
        (sum, item) =>
          sum +
          (item.productVariant.price ?? item.productVariant.product.basePrice) *
            item.quantity,
        0
      );

      // 8. Create order
      const order = await tx.order.create({
        data: {
          userId: req.user.userId,
          status: "PROCESSING",
          total,
          ...shippingBillingInfo,

          items: {
            create: selectedCartItems.map((item) => ({
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              priceAtPurchase:
                item.productVariant.price ??
                item.productVariant.product.basePrice,
            })),
          },
        },
        include: { items: true },
      });

      // 9. Update inventory
      await Promise.all(
        selectedCartItems.map((item) =>
          tx.productVariant.update({
            where: { id: item.productVariantId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      // 10. Remove only ordered items from cart
      // await tx.cartItem.deleteMany({
      //   where: {
      //     cartId: cart.id,
      //     productVariantId: {
      //       in: selectedCartItems.map((item) => item.productVariantId),
      //     },
      //   },
      // });

      return order;
    });

    // 11. Success response
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: transaction,
    });
  } catch (error) {
    console.error("Order creation failed:", error);

    // Handle specific error cases
    if (error.message.includes("Cart is empty")) {
      return res.status(400).json({ error: "Your cart is empty" });
    }
    if (error.message.includes("Invalid items")) {
      return res.status(400).json({ error: "Invalid items in cart" });
    }
    if (error.message.includes("Insufficient stock")) {
      return res.status(409).json({ error: "Some items are out of stock" });
    }

    return res.status(500).json({
      error: "Order processing failed",
      //   details:
      //     process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export default createOrder;
