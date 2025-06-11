import prisma from "../../lib/db.js";
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { verified: true },
  });

  await prisma.emailVerificationToken.delete({ where: { token } });

  res.status(200).json({ message: "Email verified successfully" });
};

export default verifyEmail;
