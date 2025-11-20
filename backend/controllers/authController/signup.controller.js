export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const existingPending = await prisma.pendingUser.findUnique({
      where: { email },
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = uuidv4();

    if (existingPending) {
      // update existing pending entry
      await prisma.pendingUser.update({
        where: { email },
        data: {
          name,
          hashedPassword,
          token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
    } else {
      // create a new pending entry
      await prisma.pendingUser.create({
        data: {
          name,
          email,
          hashedPassword,
          token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
    }

    await sendVerificationEmail({ email, token });

    res.status(201).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
