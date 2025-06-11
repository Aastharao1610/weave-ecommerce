import { PrismaClient } from "@prisma/client";
import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const router = express.Router();

const MAX_SESSIONS = 3;

router.post("/refresh-token", async (req, res) => {
  const oldToken = req.body.refreshToken;
  const ip = req.ip;
  const userAgent = req.get("User-Agent");

  if (!oldToken) {
    return res.status(401).json({ message: "Refresh Token Missing" });
  }

  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: oldToken },
    });

    if (!storedToken) {
      // Token reuse detected
      console.warn("Possible token reuse detected");
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { token: oldToken } });
      return res.status(403).json({ message: "Expired Refresh Token" });
    }

    const decoded = jwt.verify(oldToken, process.env.REFRESH_SECRET);

    // Delete old refresh token (rotation)
    await prisma.refreshToken.delete({ where: { token: oldToken } });

    // Check how many active sessions user has
    const activeTokens = await prisma.refreshToken.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "asc" }, // oldest first
    });

    if (activeTokens.length >= MAX_SESSIONS) {
      // Delete oldest token to keep within session limit
      await prisma.refreshToken.delete({
        where: { token: activeTokens[0].token },
      });
    }

    // Generate and store new refresh token
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role, jti: uuidv4() },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ip,
        userAgent,
      },
    });

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
});

// in future
// Expand to multi-device management

// Add admin controls

// Integrate 2FA

// Or audit login activity
