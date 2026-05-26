import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/mail";
import { forgotPasswordSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    // Rate limit check
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    let success = true;
    try {
      const limitResult = await rateLimit.limit(ip);
      success = limitResult.success;
    } catch (err) {
      console.error("Rate limit failed (falling back to allow):", err);
    }
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in 10 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email } = result.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return success even if not found to prevent enumeration
      return NextResponse.json({ message: "If an account exists, a reset link was sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.deleteMany({
        where: { email }
    });
    await prisma.passwordResetToken.create({
        data: { email, token, expires }
    });

    await sendPasswordResetEmail(email, token, new URL(req.url).origin);

    return NextResponse.json({ message: "If an account exists, a reset link was sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
