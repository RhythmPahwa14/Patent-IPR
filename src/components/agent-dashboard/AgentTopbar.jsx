"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken } from "@/lib/api";

export default function AgentTopbar({ searchPlaceholder = "Search cases, applicants, or reference IDs...", onMenuOpen }) {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Agent", role: "AGENT" });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const storedUser = getStoredUser();
    if (storedUser) {
      setUser({
        name: storedUser.name || "Agent",
        role: storedUser.role || "AGENT",
      });
    }
  }, [router]);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-3 px-4 shrink-0">
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>

      <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
        <span className="material-symbols-outlined text-gray-400 text-base">search</span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="text-sm text-gray-600 bg-transparent outline-none w-full placeholder:text-gray-400"
        />
      </div>

      <button className="sm:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
        <span className="material-symbols-outlined text-xl">search</span>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        <button className="relative p-1.5">
          <span className="material-symbols-outlined text-gray-500 text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <Link
          href="/agent/review"
          className="hidden lg:flex items-center gap-1.5 bg-[#0d1b2a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1a2f4a] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">rule</span>
          REVIEW QUEUE
        </Link>

        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-[#0d1b2a] leading-tight">{user.name}</p>
            <p className="text-[10px] text-gray-400">{user.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name?.charAt(0) ?? "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
