import { PrismaClient, Role } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: Role.user,
        },
      });
      res
        .status(201)
        .json({ message: "User Created Sucessfully", userId: newUser.id });
    } else {
      return res.status(400).json({ error: "User already exists" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});
export default router;
