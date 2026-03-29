import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a1926] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-12 h-full">
        {/* Logo */}
        <span className="font-medium text-white text-[24px] tracking-tight flex items-center justify-center gap-2">
          PATENT-IPR
        </span>

        {/* Links */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-[12px] font-bold uppercase tracking-[0.15em] text-[#9ca3af]">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Global Offices</Link>
          <Link href="/login" className="hover:text-white transition-colors">Client Portal</Link>
        </div>

        {/* Copyright */}
        <div className="text-[12px] font-medium text-[#6b7280] tracking-wider">
          © {new Date().getFullYear()} PATENT-IPR. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
