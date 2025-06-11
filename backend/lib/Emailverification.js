import nodemailer from "nodemailer";
import crypto from "crypto";
import prisma from "./db.js";

export const sendVerificationEmail = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail", // or SMTP settings
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_NODEMAILER,
    },
  });

  const verificationUrl = `${process.env.DOMAIN}/api/auth/verify-email?token=${token}`;

  const html = `
    <h2>Verify your email</h2>
    <p>Click below to verify your email address:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify your email address",
    html,
  });
};
