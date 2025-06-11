import jwt from "jsonwebtoken";
import prisma from "../../lib/db.js";
import { otpStore } from "./sendOtp.controller.js";

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const stored = otpStore.get(phone);

  if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  otpStore.delete(phone);

  let user = await prisma.user.findFirst({
    where: {
      OR: [{ phone }, { email: req.body.email }],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        name: "MobileUser", // Optional: Ask name later
        role: "User",
        verified: true,
      },
    });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({
    message: "OTP verified, login successful",
    token,
    userId: user.id,
  });
};
