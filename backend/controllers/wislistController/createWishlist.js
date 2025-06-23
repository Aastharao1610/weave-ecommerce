import prisma from "../../lib/db.js";

const createWishlist = async (req, res) => {
  const userId = req.user.userId;
  const { productVariantId, quantity } = req.body;
  if (!productVariantId) {
    return res.status(400).json({ error: "Missing productVariantId" });
  }
  try {
    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }
    const variantExists = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });

    if (!variantExists) {
      return res.status(404).json({ error: "Product variant not found" });
    }

    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productVariantId,
      },
    });

    if (existingItem) {
      await prisma.wishlistItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productVariantId,
          quantity,
        },
      });
    }

    res.status(200).json({ message: "Item added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createWishlist;
