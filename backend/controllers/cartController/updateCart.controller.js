import prisma from "../../lib/db.js";

const updateCartItem = async (req, res) => {
  const userId = req.user.userId;
  const productVariantId = parseInt(req.params.id);
  const { quantity } = req.body;
  try {
    //finding user card if exis move to next if doesnt cart wull b createdd
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      res.status(404).json({ message: "Item not Found" });
    }
    //checking if exsitng item -if exist upddate the cart item by quantity and if doesnt create new one
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId,
      },
    });
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateCartItem;
