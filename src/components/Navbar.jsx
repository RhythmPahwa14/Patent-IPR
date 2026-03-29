"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = ["Home", "Services", "Platform", "Pricing", "Contact"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-[#e0eaf3]" : "bg-transparent border-b border-transparent"}`}>
      <header className="w-full max-w-7xl mx-auto px-6 lg:px-10 h-[80px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logobg.png" alt="PATENT-IPR Logo" className="w-8 h-8 object-contain rounded-sm" />
          <span className="text-[20px] font-bold tracking-tight text-[#1a1a1a]">
            Patent-IPR
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[14px] font-semibold text-[#4b5563] hover:text-[#1a3d54] transition-colors flex items-center gap-1 uppercase tracking-wider"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/login"
            className="text-[14px] font-semibold text-[#4b5563] hover:text-[#1a3d54] transition-colors uppercase tracking-wider"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 text-[13px] font-medium uppercase tracking-widest text-white bg-[#1a3d54] hover:bg-[#112a3c] rounded-full transition-colors shadow-md shadow-[#1a3d54]/10"
          >
            Signup
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 mb-1.5 transition-all bg-[#1a1a1a] ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-5 h-0.5 mb-1.5 transition-all bg-[#1a1a1a] ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 transition-all bg-[#1a1a1a] ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-white border-b border-black/10 p-6 flex flex-col gap-6 shadow-xl z-50">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[15px] font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="w-full h-px bg-black/10"></div>
          <Link
            href="/login"
            className="text-[15px] font-bold uppercase tracking-wider text-black w-full"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-black text-white py-3 text-[14px] font-bold uppercase tracking-widest text-center w-full"
            onClick={() => setMenuOpen(false)}
          >
            Signup
          </Link>
        </div>
      )}
    </div>
  );
}
