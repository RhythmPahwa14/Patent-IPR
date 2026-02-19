"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardTopbar({ title, searchPlaceholder = "Search case numbers, titles, or inventors...", onMenuOpen }) {
  const router = useRouter();
  const [user, setUser] = useState({ name: "Sandeep Vashishtha", role: "Individual" });


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;

        const response = await fetch(
          "https://patent-ipr-backend-springboot-dug6aphbfrfuadh3.southindia-01.azurewebsites.net/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setUser({
            name: `${data.name} ${data.lastName}`,
            role: " ",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
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
        <Link
          href="/dashboard/cases/new"
          className="hidden lg:flex items-center gap-1.5 bg-[#0d1b2a] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#1a2f4a] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          NEW FILING
        </Link>

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
  );
}
