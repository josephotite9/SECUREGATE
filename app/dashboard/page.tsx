"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Shield,
  Monitor,
  List,
  LogOut,
  Clock,
  CheckCircle,
  ShieldAlert,
  ShieldOff,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ElementType;
  active?: boolean;
  comingSoon?: boolean;
  action?: () => void;
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function getFirstName(name: string | null | undefined): string {
  if (!name) return "User";
  return name.trim().split(/\s+/)[0];
}

function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }) + " — " + date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SidebarSkeleton() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] h-screen fixed left-0 top-0 z-30 p-4">
      <div className="h-8 w-32 bg-slate-700 rounded animate-pulse mb-8" />
      <div className="space-y-2 flex-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-700 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-10 bg-slate-700 rounded-lg animate-pulse mt-auto" />
    </aside>
  );
}

function MobileNavSkeleton() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a] z-30 flex justify-around py-2 px-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-6 w-6 bg-slate-700 rounded animate-pulse" />
      ))}
    </nav>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <SidebarSkeleton />
      <MobileNavSkeleton />
      <div className="md:ml-64 pb-20 md:pb-0">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-6">
          <div className="h-6 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </header>
        <main className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-56 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        </main>
      </div>
    </div>
  );
}

function ComingSoonTooltip({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:md:block px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap shadow-lg z-50">
        Coming soon
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [signingOut, setSigningOut] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (!session) {
    router.replace("/auth");
    return <DashboardSkeleton />;
  }

  const user = session.user;
  const emailVerified = user.emailVerified;
  const createdAt = user.createdAt ? new Date(user.createdAt) : null;

  if (!emailVerified) {
    router.replace("/verify-email");
    return <DashboardSkeleton />;
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/auth" });
  };

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Profile", icon: User, comingSoon: true },
    { label: "Security", icon: Shield, comingSoon: true },
    { label: "Sessions", icon: Monitor, comingSoon: true },
    { label: "Activity Log", icon: List, comingSoon: true },
  ];

  const initials = getInitials(user.name);
  const firstName = getFirstName(user.name);

  const memberSinceDate = createdAt ? formatDate(createdAt) : "Unknown";
  const emailVerifiedDate = emailVerified ? new Date(emailVerified) : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iat = (session as any).iat;

  const activityItems: { icon: React.ElementType; label: string; time: string }[] = [
    {
      icon: Clock,
      label: "Current session",
      time: "Just now",
    },
    ...(emailVerifiedDate
      ? [
          {
            icon: CheckCircle,
            label: "Email verified",
            time: formatDate(emailVerifiedDate),
          },
        ]
      : []),
    {
      icon: Clock,
      label: "Account created",
      time: memberSinceDate,
    },
  ];

  const securityTips = [
    "Never share your password with anyone",
    "Use a strong, unique password for every account",
    "Always log out on shared or public devices",
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0f172a] h-screen fixed left-0 top-0 z-30">
        <div className="p-6">
          <h1 className="text-white text-xl font-bold tracking-tight">SecureGate</h1>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.comingSoon) {
              return (
                <ComingSoonTooltip key={item.label}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 cursor-not-allowed text-sm font-medium">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </ComingSoonTooltip>
              );
            }
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-indigo-600/20 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>{signingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Bottom Navigation - Mobile/Tablet */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a] z-30">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.comingSoon) {
              return (
                <div key={item.label} className="flex flex-col items-center gap-1 text-slate-400 cursor-not-allowed px-2">
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px]">{item.label}</span>
                </div>
              );
            }
            return (
              <button
                key={item.label}
                className={`flex flex-col items-center gap-1 px-2 ${
                  item.active ? "text-indigo-400" : "text-slate-400"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex flex-col items-center gap-1 text-slate-400 disabled:opacity-50 px-2"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-[10px]">{signingOut ? "..." : "Exit"}</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="md:ml-64 pb-20 md:pb-0">
        {/* Top Header Bar */}
        <header className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 dark:backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
          <h1 className="text-lg font-bold text-[#0f172a] dark:text-white md:hidden">SecureGate</h1>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[#0f172a] dark:text-white">{user.name || "User"}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                {emailVerified && (
                  <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">Verified</span>
                )}
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {initials}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
          {/* Welcome Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0f172a] dark:text-white">Welcome back, {firstName}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formatDateTime(currentTime)}</p>
              </div>
              {emailVerified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full w-fit">
                  <CheckCircle className="h-4 w-4" />
                  Verified Account
                </span>
              )}
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Status</p>
              <div className="mt-2 flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${emailVerified ? "bg-green-500" : "bg-red-500"}`} />
                <span className={`text-sm font-semibold ${emailVerified ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {emailVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Member Since</p>
              <p className="mt-2 text-sm font-semibold text-[#0f172a] dark:text-white">{memberSinceDate}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Login</p>
              <p className="mt-2 text-sm font-semibold text-[#0f172a] dark:text-white">
                {iat ? formatDate(new Date(iat * 1000)) : "Current session"}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Security</p>
              <p className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">Strong</p>
            </div>
          </div>

          {/* Security Checklist + Recent Activity row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Checklist */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-base font-semibold text-[#0f172a] dark:text-white mb-4">Security Checklist</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Email verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Password set</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Account active</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldOff className="h-5 w-5 text-slate-300 dark:text-slate-500 shrink-0" />
                  <span className="text-sm text-slate-400 dark:text-slate-500">Two-factor authentication</span>
                  <span className="ml-auto text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-base font-semibold text-[#0f172a] dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-700">
                {activityItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 py-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-[#6366f1]" />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{item.label}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{item.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div>
            <h3 className="text-base font-semibold text-[#0f172a] dark:text-white mb-4">Security Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityTips.map((tip, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-5 w-5 text-[#6366f1]" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
