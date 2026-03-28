import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <span className="font-bold text-white text-lg tracking-tight flex items-center gap-2">
          <img src="/logo.jpg" alt="PATENT-IPR Logo" className="w-6 h-6 object-contain rounded-sm" />
          PATENT<span className="text-blue-500">-IPR</span>
        </span>

        {/* Links */}
        <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Global Offices</Link>
        </div>

        {/* Copyright */}
        <div className="text-[11px] font-medium text-slate-500">
          © 2026 PATENT-IPR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
