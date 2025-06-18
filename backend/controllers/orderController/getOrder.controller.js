import prisma from "../../lib/db.js";

const getOrder = async (req, res) => {
  try {
    const { role, userId } = req.user || {};
    console.log(req.user);

    if (!role) {
      return res.status(401).json({ message: "Unauthorized - No user info" });
    }

    const includeStructure = {
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  Subcategory: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    let orders;

    if (role === "ADMIN") {
      orders = await prisma.order.findMany({
        include: includeStructure,
        orderBy: { createdAt: "desc" },
      });
    } else {
      orders = await prisma.order.findMany({
        where: {
          userId: userId,
        },
        include: includeStructure,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return res.status(200).json({
      message: `Orders fetched successfully`,
      orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve orders",
    });
  }
};

export default getOrder;
