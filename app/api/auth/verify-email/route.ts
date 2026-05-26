import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.emailVerified) {
      return NextResponse.json({ message: "Verification email sent if account exists and is unverified." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Fallback: delete any existing token for this email first
    await prisma.verificationToken.deleteMany({
        where: { identifier: email }
    });
    await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
    });

    try {
      await sendVerificationEmail(email, token, new URL(req.url).origin);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return NextResponse.json(
        { error: "Failed to send verification email. Please check email configuration and try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Verification email sent." });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
