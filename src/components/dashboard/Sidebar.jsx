"use client";
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

export default function Sidebar() {
  const pathname = usePathname();

  const NavItem = ({ item }) => {
    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
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
    <aside className="w-48 min-h-screen bg-[#0d1b2a] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[#0d1b2a] text-base">verified_user</span>
          </div>
          <div className="leading-tight">
            <p className="text-white text-xs font-extrabold tracking-tight">PATENT-IPR</p>
            <p className="text-white/40 text-[9px] tracking-wider uppercase">Client Portal</p>
          </div>
        </div>
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
          className="flex items-center justify-center gap-2 w-full bg-[#f5a623] text-[#0d1b2a] text-xs font-bold py-2.5 rounded-lg hover:bg-[#e09610] transition-colors"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          New Case Filing
        </Link>
      </div>
    </aside>
  );
}
