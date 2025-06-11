import prisma from "../../lib/db.js";
const deleteCart = async (req, res) => {
  const userId = req.user.userId;
  const productVariantId = parseInt(req.params.id);

  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId,
      },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await prisma.cartItem.delete({
      where: { id: existingItem.id },
    });

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default deleteCart;
