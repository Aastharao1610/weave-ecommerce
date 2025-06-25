import prisma from "../../lib/db.js";

const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log("Cookies received:", req.cookies);
  console.log(refreshToken, "refresh Token");

  try {
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token found" });
    }
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default logout;
