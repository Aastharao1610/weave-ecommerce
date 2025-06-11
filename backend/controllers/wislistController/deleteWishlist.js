import prisma from "../../lib/db.js";

const deleteWishlistItem = async (req, res) => {
  const userId = req.user.userId;
  const productVariantId = parseInt(req.params.id);

  try {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const item = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productVariantId,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    await prisma.wishlistItem.delete({
      where: { id: item.id },
    });

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default deleteWishlistItem;
