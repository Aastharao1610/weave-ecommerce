import prisma from "../../lib/db.js";

const saveAddress = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      shippingName,
      shippingPhone,
      shippingStreet,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
    } = req.body;

    if (
      !shippingName ||
      !shippingPhone ||
      !shippingStreet ||
      !shippingCity ||
      !shippingState ||
      !shippingPostalCode ||
      !shippingCountry
    ) {
      return res.status(400).json({ error: "All address fields are required" });
    }

    const existing = await prisma.userAddress.findUnique({
      where: { userId },
    });

    if (existing) {
      // Update existing address
      await prisma.userAddress.update({
        where: { userId },
        data: {
          shippingName,
          shippingPhone,
          shippingStreet,
          shippingCity,
          shippingState,
          shippingPostalCode,
          shippingCountry,
        },
      });
    } else {
      // Create new address
      await prisma.userAddress.create({
        data: {
          userId,
          shippingName,
          shippingPhone,
          shippingStreet,
          shippingCity,
          shippingState,
          shippingPostalCode,
          shippingCountry,
        },
      });
    }

    return res.status(200).json({ message: "Address saved successfully" });
  } catch (error) {
    console.error("Address save failed:", error);
    return res.status(500).json({ error: "Failed to save address" });
  }
};

export default saveAddress;
