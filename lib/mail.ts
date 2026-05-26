import nodemailer from "nodemailer";

const getDomain = (baseUrl?: string) => baseUrl || process.env.NEXTAUTH_URL || "http://localhost:3000";

const smtpConfig = {
  host: process.env.SMTP_HOST || "",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
};

const fromAddress = `SecureGate <${process.env.SMTP_FROM || "noreply@securegate.local"}>`;

const isSmtpConfigured = () => {
  return !!(smtpConfig.host && smtpConfig.auth.user && smtpConfig.auth.pass);
};

const createTransporter = () => {
  return nodemailer.createTransport(smtpConfig);
};

const verificationEmailHtml = (confirmLink: string) => `
  <div style="font-family: sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #4F46E5;">Confirm your email</h2>
    <p>Thank you for registering. Please confirm your email by clicking the link below:</p>
    <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
      Verify Email
    </a>
    <p style="margin-top: 20px; font-size: 12px; color: #666;">
      If you did not request this email, you can safely ignore it.
    </p>
  </div>
`;

const passwordResetEmailHtml = (resetLink: string) => `
  <div style="font-family: sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #4F46E5;">Reset your password</h2>
    <p>We received a request to reset your password. Click the link below to proceed:</p>
    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
      Reset Password
    </a>
    <p style="margin-top: 20px; font-size: 12px; color: #666;">
      If you did not request a password reset, you can safely ignore this email.
    </p>
  </div>
`;

export const sendVerificationEmail = async (email: string, token: string, baseUrl?: string) => {
  const domain = getDomain(baseUrl);
  const confirmLink = `${domain}/verify-email/${token}`;
  console.log(`\n==================================================`);
  console.log(`[EMAIL] Verification link for ${email}:`);
  console.log(confirmLink);
  console.log(`==================================================\n`);

  if (!isSmtpConfigured()) {
    console.warn("[EMAIL] SMTP not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local");
    return;
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: "Confirm your email",
    html: verificationEmailHtml(confirmLink),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string, baseUrl?: string) => {
  const domain = getDomain(baseUrl);
  const resetLink = `${domain}/reset-password/${token}`;
  console.log(`\n==================================================`);
  console.log(`[EMAIL] Password reset link for ${email}:`);
  console.log(resetLink);
  console.log(`==================================================\n`);

  if (!isSmtpConfigured()) {
    console.warn("[EMAIL] SMTP not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local");
    return;
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: "Reset your password",
    html: passwordResetEmailHtml(resetLink),
  });
};
