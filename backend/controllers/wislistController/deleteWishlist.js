import prisma from "../../lib/db.js";

const deleteWishlistItem = async (req, res) => {
  const userId = req.user.userId;
  const wishlistItemId = parseInt(req.params.id);

  // try {
  //   const wishlist = await prisma.wishlist.findUnique({ where: { userId } });

  //   if (!wishlist) {
  //     return res.status(404).json({ message: "Wishlist not found" });
  //   }

  //   const item = await prisma.wishlistItem.findFirst({
  //     where: {
  //       wishlistId: wishlist.id,
  //       productVariantId,
  //     },
  //   });

  //   if (!item) {
  //     return res.status(404).json({ message: "Item not found in wishlist" });
  //   }

  //   await prisma.wishlistItem.delete({
  //     where: { id: item.id },
  //   });

  //   res.status(200).json({ message: "Item removed from wishlist" });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: "Internal Server Error" });
  // }
  try {
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id: wishlistItemId },
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    // Optional: You can still verify it's the user's wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist || wishlistItem.wishlistId !== wishlist.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this item" });
    }

    await prisma.wishlistItem.delete({
      where: { id: wishlistItemId },
    });

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default deleteWishlistItem;
