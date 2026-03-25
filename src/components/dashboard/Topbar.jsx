"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken } from "@/lib/api";

export default function DashboardTopbar({ title, searchPlaceholder = "Search case numbers, titles, or inventors...", onMenuOpen }) {
  const router = useRouter();
  const [user, setUser] = useState({ name: "User", role: "Client" });
  const [showFilingPopup, setShowFilingPopup] = useState(false);


  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const storedUser = getStoredUser();
    if (storedUser) {
      setUser({
        name: storedUser.name || "User",
        role: storedUser.role || "Client",
      });
    }

  }, [router]);

  return (
    <>
    <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-3 px-4 shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <span className="material-symbols-outlined text-gray-400 text-base">search</span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="text-sm text-gray-600 bg-transparent outline-none w-full placeholder:text-gray-400"
        />
      </div>

      {/* Mobile search icon */}
      <button className="sm:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
        <span className="material-symbols-outlined text-xl">search</span>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-1.5">
          <span className="material-symbols-outlined text-gray-500 text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* New filing button — desktop only */}
        <button
          type="button"
          onClick={() => setShowFilingPopup(true)}
          className="hidden lg:flex items-center gap-1.5 bg-[#0d1b2a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1a2f4a] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          NEW FILING
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-[#0d1b2a] leading-tight">{user.name}</p>
            <p className="text-[10px] text-gray-400">{user.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name?.charAt(0) ?? "U"}
          </div>
        </div>
      </div>
    </header>

    {showFilingPopup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          aria-label="Close filing menu"
          className="absolute inset-0 bg-[#0d1b2a]/40"
          onClick={() => setShowFilingPopup(false)}
        />
        <div className="relative w-full max-w-xl bg-white rounded-2xl border border-gray-100 p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#0d1b2a]">Select Filing Type</h2>
              <p className="text-sm text-gray-500 mt-1">Choose a category to continue with filing.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowFilingPopup(false)}
              className="text-gray-400 hover:text-[#0d1b2a] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/dashboard/cases/new"
              onClick={() => setShowFilingPopup(false)}
              className="flex items-center justify-center text-sm font-semibold text-[#0d1b2a] border border-gray-200 rounded-xl py-3 hover:border-[#0d1b2a] transition-colors"
            >
              Patent
            </Link>
            <Link
              href="/dashboard/cases/new/trademark"
              onClick={() => setShowFilingPopup(false)}
              className="flex items-center justify-center text-sm font-semibold text-[#0d1b2a] border border-gray-200 rounded-xl py-3 hover:border-[#0d1b2a] transition-colors"
            >
              Trademark
            </Link>
            <Link
              href="/dashboard/cases/new/copyright"
              onClick={() => setShowFilingPopup(false)}
              className="flex items-center justify-center text-sm font-semibold text-[#0d1b2a] border border-gray-200 rounded-xl py-3 hover:border-[#0d1b2a] transition-colors"
            >
              Copyright
            </Link>
            <Link
              href="/dashboard/cases/new/design"
              onClick={() => setShowFilingPopup(false)}
              className="flex items-center justify-center text-sm font-semibold text-[#0d1b2a] border border-gray-200 rounded-xl py-3 hover:border-[#0d1b2a] transition-colors"
            >
              Design Registration
            </Link>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
