import prisma from "../../lib/db.js";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../../lib/sendVerification.js";
import { v4 as uuidv4 } from "uuid";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = uuidv4();

    await prisma.pendingUser.create({
      data: {
        name,
        email,
        hashedPassword,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    // Just send the email — don't create the user again!
    await sendVerificationEmail({ email, token });

    res.status(201).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
