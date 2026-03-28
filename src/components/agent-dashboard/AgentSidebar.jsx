"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { label: "Dashboard", icon: "dashboard", href: "/agent" },
  { label: "Patent Filings", icon: "assignment", href: "/agent/cases" },
  { label: "Non-Patent Filings", icon: "article", href: "/agent/non-patent-cases" },
  { label: "Documents", icon: "description", href: "/agent/documents" },
  { label: "Messages", icon: "mail", href: "/agent/messages" },
];

const adminNav = [
  { label: "Reports", icon: "insights", href: "/agent/reports" },
  { label: "Profile", icon: "person", href: "/agent/profile" },
];

export default function AgentSidebar({ onClose }) {
  const pathname = usePathname();

  const NavItem = ({ item }) => {
    const active = pathname === item.href || (item.href !== "/agent" && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="w-56 h-screen bg-[#0d1b2a] flex flex-col shrink-0 overflow-y-auto">
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#0d1b2a] text-base">shield_person</span>
          </div>
          <div className="leading-tight">
            <p className="text-white text-xs font-extrabold tracking-tight">PATENT-IPR</p>
            <p className="text-white/40 text-[9px] tracking-wider uppercase">Agent Console</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-white/40 hover:text-white transition-colors ml-2"
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-2 pt-4">
        {mainNav.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <div className="mt-6 px-4">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-white/30 mb-2">Operations</p>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {adminNav.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <div className="mt-auto p-3">
        <Link
          href="/agent/review"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full bg-[#f5a623] text-[#0d1b2a] text-xs font-bold py-2.5 rounded-lg hover:bg-[#e09610] transition-colors"
        >
          <span className="material-symbols-outlined text-base">playlist_add_check</span>
          Start Review
        </Link>
      </div>
    </aside>
  );
}