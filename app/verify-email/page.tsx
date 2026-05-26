import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ResendButton from "./[token]/ResendButton";

export default async function VerifyEmailInfoPage({
  searchParams,
}: {
  searchParams: { message?: string; email?: string };
}) {
  const session = await getServerSession(authOptions);
  const paramEmail = searchParams.email || "";

  const userEmail = session?.user?.email || paramEmail;

  if (!userEmail) {
    redirect("/auth");
  }

  const message = searchParams.message || "Your email is not yet verified.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
        <div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 p-3 rounded-md">
            {message}
          </p>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            A verification link was sent to <span className="font-semibold text-gray-900 dark:text-white">{userEmail}</span>.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <ResendButton email={userEmail} />
          <Link
            href="/auth"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
