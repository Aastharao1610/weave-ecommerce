import prisma from "../../lib/db.js";

const getAddress = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const address = await prisma.userAddress.findFirst({
      where: { userId },
    });

    if (!address) {
      return res.status(404).json({ error: "No address found" });
    }

    res.status(200).json({ address });
  } catch (err) {
    console.error("Fetch address error:", err);
    res.status(500).json({ error: "Failed to fetch address" });
  }
};

export default getAddress;
