"use client";
import Link from "next/link";

const stats = [
  {
    icon: "work",
    label: "TOTAL ACTIVE CASES",
    value: "--",
    badge: "No data",
    badgeColor: "text-gray-500",
    border: "border-gray-100",
  },
  {
    icon: "visibility",
    label: "IN EXAMINATION",
    value: "--",
    badge: "No data",
    badgeColor: "text-gray-500",
    border: "border-gray-100",
  },
  {
    icon: "verified",
    label: "GRANTED IPS",
    value: "--",
    badge: "No data",
    badgeColor: "text-gray-500",
    border: "border-[#f5a623]/30",
    highlight: true,
  },
  {
    icon: "videocam",
    label: "PENDING PAYMENTS",
    value: "--",
    badge: "No data",
    badgeColor: "text-gray-500",
    border: "border-gray-100",
  },
];

const cases = [];
const upcomingDeadlines = [];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Live portfolio data will appear here once synced from backend.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border ${s.border} p-5 ${s.highlight ? "ring-1 ring-[#f5a623]/30" : ""}`}>
            <div className="flex items-start justify-between mb-3">
              <span className="material-symbols-outlined text-gray-400 text-2xl">{s.icon}</span>
              <span className={`text-xs font-semibold ${s.badgeColor}`}>{s.badge}</span>
            </div>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-[#0d1b2a]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Portfolio Cases */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#0d1b2a]">My Portfolio Cases</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-6 py-3">Case ID</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Title &amp; Description</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Last Updated</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => (
                <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === cases.length - 1 ? "border-0" : ""}`}>
                  <td className="px-6 py-4 text-xs font-semibold text-[#0d1b2a]">{c.id}</td>
                  <td className="px-4 py-4">
                    <Link href={`/dashboard/cases/${c.id}`} className="font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors text-sm">{c.title}</Link>
                    <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{c.type}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded tracking-wider ${c.statusColor}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{c.updated}</td>
                  <td className="px-4 py-4">
                    <button className="text-gray-400 hover:text-[#0d1b2a] transition-colors">
                      <span className="material-symbols-outlined text-lg">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
              {cases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                    No cases available. Records will be shown after backend sync.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Showing {cases.length} cases</p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {[1, 2, 3].map((n) => (
              <button key={n} className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${n === 1 ? "bg-[#0d1b2a] text-white" : "text-gray-500 hover:bg-gray-100"}`}>{n}</button>
            ))}
            <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Legal Consultation CTA */}
        <div className="bg-[#0d1b2a] rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Need Legal Consultation?</h3>
          <p className="text-sm text-white/60 mb-4">Connect with our senior patent attorneys for strategic IP advice.</p>
          <Link href="/dashboard/messages" className="inline-flex items-center gap-2 bg-[#f5a623] text-[#0d1b2a] text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#e09610] transition-colors">
            <span className="material-symbols-outlined text-sm">chat</span> Start Consultation
          </Link>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-base font-bold text-[#0d1b2a] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f5a623] text-xl">schedule</span>
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {upcomingDeadlines.map((d) => (
              <div key={d.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${d.urgent ? "bg-red-500" : "bg-[#f5a623]"}`} />
                  <span className="text-xs text-[#0d1b2a] font-medium">{d.label}</span>
                </div>
                <span className={`text-xs font-semibold ${d.urgent ? "text-red-500" : "text-gray-400"}`}>{d.date}</span>
              </div>
            ))}
            {upcomingDeadlines.length === 0 && (
              <p className="text-sm text-gray-400">No upcoming deadlines yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
