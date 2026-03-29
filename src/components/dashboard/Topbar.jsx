"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken } from "@/lib/api";

export default function DashboardTopbar({ title, searchPlaceholder = "Search case numbers, titles, or inventors...", onMenuOpen }) {
  const router = useRouter();
  const [user, setUser] = useState({ name: "User", role: "Client" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


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

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

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
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-[#0d1b2a] leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-400">{user.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.name?.charAt(0) ?? "U"}
            </div>
          </div>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
