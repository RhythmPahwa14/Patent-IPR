"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "My Cases", icon: "folder_open", href: "/dashboard/cases" },
  { label: "Case Timeline", icon: "show_chart", href: "/dashboard/timeline" },
  { label: "Documents", icon: "description", href: "/dashboard/documents" },
];

const adminNav = [
  { label: "Cost Estimator", icon: "calculate", href: "/dashboard/cost-estimator" },
  { label: "Messages", icon: "mail", href: "/dashboard/messages" },
  { label: "Payments", icon: "payment", href: "/dashboard/payments" },
  { label: "Profile", icon: "person", href: "/dashboard/profile" },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();

  const NavItem = ({ item }) => {
    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
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
    <aside className="w-52 h-screen bg-[#0d1b2a] flex flex-col shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 shrink-0">
            <Image
              src="/logobg.png"
              alt="Patent-IPR logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <p className="text-white text-xs font-extrabold tracking-tight">PATENT-IPR</p>
            <p className="text-white/40 text-[9px] tracking-wider uppercase">Client Portal</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden text-white/40 hover:text-white transition-colors ml-2"
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-1 px-2 pt-4">
        {mainNav.map((item) => <NavItem key={item.href} item={item} />)}
      </nav>

      {/* Administrative */}
      <div className="mt-6 px-4">
        <p className="text-[9px] font-semibold tracking-widest uppercase text-white/30 mb-2">Administrative</p>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {adminNav.map((item) => <NavItem key={item.href} item={item} />)}
      </nav>

      {/* New Case Filing */}
      <div className="mt-auto p-3">
        <Link
          href="/dashboard/cases/new"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full bg-[#c7dafc] text-[#0d1b2a] text-xs font-bold py-2.5 rounded-lg hover:bg-[#dce6f2] transition-colors"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          New Case Filing
        </Link>
      </div>
    </aside>
  );
}
