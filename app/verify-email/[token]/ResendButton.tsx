"use client";

import { useState } from "react";

export default function ResendButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg("Verification email sent.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleResend}
        disabled={loading}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
      >
        {loading ? "Sending..." : "Resend Verification Email"}
      </button>
      {msg && <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">{msg}</p>}
    </div>
  );
}
