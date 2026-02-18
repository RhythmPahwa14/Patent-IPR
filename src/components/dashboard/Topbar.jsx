"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardTopbar({ title, searchPlaceholder = "Search case numbers, titles, or inventors..." }) {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Alexander Sterling", role: "Global IP Director" });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-4 px-6 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <span className="material-symbols-outlined text-gray-400 text-base">search</span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="text-sm text-gray-600 bg-transparent outline-none w-full placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <button className="relative p-1">
          <span className="material-symbols-outlined text-gray-500 text-xl">notifications</span>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* New filing button — shown on some pages */}
        <Link
          href="/dashboard/cases/new"
          className="hidden md:flex items-center gap-1.5 bg-[#0d1b2a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1a2f4a] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          NEW FILING
        </Link>

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-[#0d1b2a] leading-tight">{user.name}</p>
            <p className="text-[10px] text-gray-400">{user.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-xs font-bold">
            {user.name?.charAt(0) ?? "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
