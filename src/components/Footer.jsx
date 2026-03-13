import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#060f1a] py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <span className="font-black text-white text-base tracking-tight">
          PATENT<span className="text-[#f5a623]">-IPR</span>
        </span>

        {/* Links */}
        <div className="flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Global Offices</Link>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-gray-500">
          © 2026 PATENT-IPR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
