import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import crypto from "crypto";
import { XCircle } from "lucide-react";
import ResendButton from "./ResendButton";

export default async function VerifyEmailPage({ params }: { params: { token: string } }) {
  const { token } = params;

  let error = "";
  let email = "";

  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token },
    });

    if (!verificationToken) {
      error = "Invalid or expired token.";
    } else {
      email = verificationToken.identifier;
      if (verificationToken.expires < new Date()) {
        error = "Token has expired.";
        await prisma.verificationToken.deleteMany({ where: { token } });
      } else {
        await prisma.user.update({
          where: { email },
          data: { emailVerified: new Date() },
        });

        await prisma.verificationToken.deleteMany({ where: { token } });

        const loginToken = crypto.randomBytes(32).toString("hex");
        await prisma.verificationToken.create({
          data: {
            identifier: email,
            token: loginToken,
            expires: new Date(Date.now() + 60 * 1000),
          },
        });

        redirect(`/verify-email/success?t=${loginToken}`);
      }
    }
  } catch (err) {
    if (err instanceof Error && "digest" in err) throw err;
    console.error("Verification page error:", err);
    error = "An unexpected error occurred.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
        <div>
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">
            Verification Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {error}
          </p>
          <div className="mt-6 space-y-4">
            {email && <ResendButton email={email} />}
            <Link
              href="/auth"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
