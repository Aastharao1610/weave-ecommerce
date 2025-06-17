import prisma from "../../lib/db.js";

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    const pendingUser = await prisma.pendingUser.findUnique({
      where: { token },
    });

    if (!pendingUser) {
      return res.status(400).json({ error: "Invalid token" });
    }

    if (new Date(pendingUser.expiresAt) < new Date()) {
      await prisma.pendingUser.delete({ where: { token } });
      return res.status(400).json({ error: "Token expired" });
    }

    const { email, name, hashedPassword } = pendingUser;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already verified" });
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verified: true,
        role: "User",
      },
    });

    await prisma.pendingUser.delete({ where: { token } });

    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

export default verifyEmail;
