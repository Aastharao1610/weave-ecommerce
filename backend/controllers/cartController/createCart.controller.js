import prisma from "../../lib/db.js";

const createCart = async (req, res) => {
  const userId = req.user.userId;
  const { productVariantId, quantity } = req.body;
  try {
    //finding user card if exis move to next if doesnt cart wull b createdd

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }
    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });

    if (!variant) {
      return res.status(404).json({ error: "Product variant not found" });
    }
    //checking if exsitng item -if exist upddate the cart item by quantity and if doesnt create new one
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId,
        priceAtPurchase: variant.price,
      },
    });
    if (existingItem) {
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId,
          quantity,
        },
      });
    }
    res.status(200).json({ message: "Item Added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default createCart;
