import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      const exists = await bcrypt.compare(password, existingUser.password);
      if (!exists) {
        res.status(404).json({ message: "Password dosen't match" });
      } else {
        res.status(200).json({ message: "Logged In Successfully" });
      }
    } else {
      res.status(404).json({ message: "User doesnt Exist ,please signup" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
export default router;
