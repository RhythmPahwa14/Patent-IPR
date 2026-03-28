"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken } from "@/lib/api";

export default function AdminTopbar({ searchPlaceholder = "Search filings, agents, or IDs...", onMenuOpen }) {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Admin", role: "ADMIN" });

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (!token) {
      router.push("/login");
      return;
    }

    const role = String(storedUser?.role || "").toLowerCase();
    if (role !== "admin") {
      router.push(role === "agent" ? "/agent" : "/dashboard");
      return;
    }

    if (storedUser) {
      setUser({
        name: storedUser.name || "Admin",
        role: storedUser.role || "ADMIN",
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
        {/* <button className="relative p-1.5">
          <span className="material-symbols-outlined text-gray-500 text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button> */}

        <Link
          href="/admin/unassigned"
          className="hidden lg:flex items-center gap-1.5 bg-[#10243a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1a3655] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">assignment_ind</span>
          ASSIGN CASES
        </Link>

        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-[#10243a] leading-tight">{user.name}</p>
            <p className="text-[10px] text-gray-400">{user.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#10243a] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name?.charAt(0) ?? "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
