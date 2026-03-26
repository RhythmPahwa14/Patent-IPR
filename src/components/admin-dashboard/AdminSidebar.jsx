"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { label: "Admin Dashboard", icon: "space_dashboard", href: "/admin" },
  { label: "All Filings", icon: "folder_managed", href: "/admin/filings" },
  { label: "Unassigned", icon: "person_off", href: "/admin/unassigned" },
  { label: "Agents", icon: "groups", href: "/admin/agents" },
];

const controlNav = [
  { label: "Assignments", icon: "assignment_ind", href: "/admin/assignments" },
  { label: "Decisions", icon: "gavel", href: "/admin/decisions" },
  { label: "Profile", icon: "person", href: "/admin/profile" },
];

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname();

  const NavItem = ({ item }) => {
    const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="w-60 h-screen bg-[#10243a] flex flex-col shrink-0 overflow-y-auto">
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#f6b73c] rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#10243a] text-base">admin_panel_settings</span>
          </div>
          <div className="leading-tight">
            <p className="text-white text-xs font-extrabold tracking-tight">PATENT-IPR</p>
            <p className="text-white/40 text-[9px] tracking-wider uppercase">Admin Console</p>
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
        <p className="text-[9px] font-semibold tracking-widest uppercase text-white/30 mb-2">Controls</p>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {controlNav.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      <div className="mt-auto p-3">
        <Link
          href="/admin/unassigned"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full bg-[#f6b73c] text-[#10243a] text-xs font-bold py-2.5 rounded-lg hover:bg-[#e3a72f] transition-colors"
        >
          <span className="material-symbols-outlined text-base">bolt</span>
          Quick Assign
        </Link>
      </div>
    </aside>
  );
}
