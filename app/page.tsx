import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Shield, Zap, Mail, ArrowRight, CheckCircle2, Server, Key } from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-600/30">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
              SecureGate
            </span>
          </div>

          <nav className="flex items-center space-x-4">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-1 px-4 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center space-x-1 px-4 py-2 border border-slate-800 rounded-lg text-sm font-semibold text-slate-100 bg-slate-900/80 hover:bg-slate-800/80 hover:border-slate-700 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-400 shadow-inner">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <span>Next-Gen Full-Stack Gateway</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Securing access for{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              modern applications
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            A state-of-the-art authentication gateway featuring advanced rate limiting, verification checkpoints, and real-time security safeguards.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 px-8 py-3 rounded-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] shadow-xl shadow-indigo-600/30 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 px-8 py-3 rounded-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] shadow-xl shadow-indigo-600/30 transition-all"
                >
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 px-8 py-3 rounded-lg text-base font-semibold text-slate-100 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 hover:scale-[1.02] transition-all"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-t border-slate-900/60 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Advanced Security Layers
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              SecureGate wraps standard authentication in hardened security patterns to guard endpoints from automated abuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-900/40 border border-slate-850 hover:border-slate-750 p-6 rounded-xl space-y-4 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Rate Limiting</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sliding-window IP rate limiter powered by Upstash Redis prevents brute-force attempts on all authentication endpoints.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/40 border border-slate-850 hover:border-slate-750 p-6 rounded-xl space-y-4 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Password Integrity</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Dynamic visual strength scoring checks for length, capitalization, digits, and special characters. Salted with 12 bcrypt rounds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/40 border border-slate-850 hover:border-slate-750 p-6 rounded-xl space-y-4 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Verification Tokens</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Email verification check points block login attempts until verification tokens sent via Resend are activated.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/40 border border-slate-850 hover:border-slate-750 p-6 rounded-xl space-y-4 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
                <Server className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Secure Sessions</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Next-auth JWT sessions configured with cryptographic tokens to store immutable verified flags across route middleware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} SecureGate. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
