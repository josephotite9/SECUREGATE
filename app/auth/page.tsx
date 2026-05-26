"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "login";
  const verified = searchParams.get("verified") === "true";
  const verifiedEmail = searchParams.get("email") || "";

  const setMode = (newMode: string, email?: string) => {
    const params = new URLSearchParams();
    params.set("mode", newMode);
    const emailToPass = email || verifiedEmail;
    if (newMode === "login") {
      if (verified) params.set("verified", "true");
      if (emailToPass) params.set("email", emailToPass);
    }
    router.push(`/auth?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        {mode !== "forgot-password" && (
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                mode === "login"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Sign up
            </button>
          </div>
        )}

        {mode === "login" && <LoginForm onModeChange={setMode} verified={verified} initialEmail={verifiedEmail} />}
        {mode === "signup" && <SignupForm onModeChange={setMode} />}
        {mode === "forgot-password" && <ForgotPasswordForm onModeChange={setMode} />}
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
