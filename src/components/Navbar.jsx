"use client";
import Link from "next/link";
import { useState } from "react";

const navLinks = ["Home", "Services", "Platform", "Pricing", "Contact"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#0d1b2a] text-2xl">verified_user</span>
          <span className="text-base font-extrabold tracking-tight text-[#0d1b2a]">PATENT<span className="text-[#C5A059]">-IPR</span></span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs font-semibold text-[#0d1b2a] uppercase tracking-widest hover:text-[#f5a623] transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-[#0d1b2a] px-4 py-2 hover:text-[#f5a623] transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="bg-[#0d1b2a] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a2f4a] transition-colors">
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-[#0d1b2a] mb-1 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <div className={`w-5 h-0.5 bg-[#0d1b2a] mb-1 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-[#0d1b2a] transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-8 py-5 flex flex-col gap-4">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs font-semibold uppercase tracking-widest text-[#0d1b2a] hover:text-[#f5a623] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <button
            className="bg-[#0d1b2a] text-white px-5 py-2.5 rounded-lg text-sm font-semibold text-center"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}
