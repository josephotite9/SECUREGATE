"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const loginToken = searchParams.get("t");
    if (!loginToken) {
      setStatus("error");
      setError("Invalid login link.");
      return;
    }

    signIn("credentials", {
      loginToken,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        setStatus("error");
        setError(res.error);
      } else {
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
        {status === "verifying" && (
          <div>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">
              Verifying your email...
            </h2>
          </div>
        )}

        {status === "success" && (
          <div>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-extrabold text-gray-900 dark:text-white">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your email has been verified. Redirecting to dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <h2 className="mt-4 text-2xl font-extrabold text-red-600 dark:text-red-400">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
