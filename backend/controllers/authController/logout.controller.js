import prisma from "../../lib/db.js";

const logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default logout;
