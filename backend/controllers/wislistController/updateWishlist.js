import prisma from "../../lib/db.js";
const updateWishlistItem = async (req, res) => {
  const userId = req.user.userId;
  const productVariantId = parseInt(req.params.id);
  const { quantity } = req.body;
  try {
    //finding user card if exis move to next if doesnt wishliat wull b createdd
    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      res.status(404).json({ message: "Item not Found" });
    }
    //checking if exsitng item -if exist upddate the wishlist item by quantity and if doesnt create new one
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productVariantId,
      },
    });
    if (existingItem) {
      await prisma.wishlistItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "wishlist item updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default updateWishlistItem;
