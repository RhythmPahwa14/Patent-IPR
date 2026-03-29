import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0d1b2a] py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
              <Image
                src="/logobg.png"
                alt="Patent-IPR logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">PATENT-IPR</span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-white transition-colors">Portal</Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} PATENT-IPR
          </div>
        </div>
      </div>
    </footer>
  );
}
