"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = ["Home", "Services", "Platform", "Pricing", "Contact"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-5 md:pt-8 transition-all px-4 md:px-8">
      <header
        className={`w-full max-w-7xl px-6 md:px-10 h-[60px] flex items-center justify-between rounded-full transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-lg shadow-sm border border-gray-200 text-slate-900" : "bg-transparent text-white"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="PATENT-IPR Logo" className="w-7 h-7 object-contain rounded-md shadow-sm" />
          <span className="text-xl font-bold tracking-tight">
            PATENT<span className={scrolled ? "text-blue-600" : "text-white"}>-IPR</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`text-[15px] font-semibold transition-opacity flex items-center gap-1.5 ${
                scrolled ? "text-slate-600 hover:text-black" : "text-white/95 hover:text-white"
              }`}
            >
              {item} {['Use cases', 'Features'].includes(item) && <span className="material-symbols-outlined text-[16px] opacity-70">expand_more</span>}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className={`text-[15px] font-bold transition-opacity ${
              scrolled ? "text-slate-700 hover:text-black" : "text-white hover:opacity-80"
            }`}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className={`px-6 py-2.5 rounded-full text-[15px] font-bold transition-transform hover:-translate-y-0.5 ${
              scrolled
                ? "bg-[#0f172a] text-white hover:bg-black"
                : "bg-white text-[#0f172a] hover:bg-gray-50 shadow-[0_4px_14px_0_rgba(255,255,255,0.2)]"
            }`}
          >
            Sign up
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-full"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 mb-1.5 transition-all ${scrolled ? "bg-slate-900" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-5 h-0.5 mb-1.5 transition-all ${scrolled ? "bg-slate-900" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 transition-all ${scrolled ? "bg-slate-900" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white border border-gray-200 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl z-50">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[15px] font-bold text-slate-700 hover:text-black transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="w-full h-px bg-gray-100 my-2"></div>
          <Link
            href="/login"
            className="text-[15px] font-bold text-slate-700 text-center"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-[#0f172a] text-white py-3 rounded-full text-[15px] font-bold text-center"
            onClick={() => setMenuOpen(false)}
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
