import jwt from "jsonwebtoken";
import prisma from "../../lib/db.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { credential, phone } = req.body; // optional: phone entered by user

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // Look for existing user
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, phone ? { phone } : undefined].filter(Boolean),
      },
    });

    if (!user) {
      // Ask phone first, or create without phone and prompt later
      if (!phone) {
        return res.status(400).json({
          message: "Phone number required to complete signup",
          askPhone: true,
        });
      }

      user = await prisma.user.create({
        data: {
          email,
          name,
          phone,
          verified: true,
          role: "User",
          authProvider: "google",
        },
      });
    } else {
      // Optionally update phone if not stored before
      if (!user.phone && phone) {
        await prisma.user.update({
          where: { id: user.id },
          data: { phone },
        });
      }
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Logged in with Google",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error", error);
    res.status(500).json({ error: "Google login failed" });
  }
};
