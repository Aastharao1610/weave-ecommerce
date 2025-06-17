import { sendEmail } from "./mailer.js";

export const sendVerificationEmail = async ({ email, token }) => {
  const verificationUrl = `${process.env.DOMAIN}/api/auth/verify-email?token=${token}`;

  const html = `
    <h2>Verify your email</h2>
    <p>Click below to verify your email address:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    html,
  });
};
