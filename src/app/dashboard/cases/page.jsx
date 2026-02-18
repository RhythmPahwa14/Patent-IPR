"use client";
import { useState } from "react";
import Link from "next/link";

const allCases = [
  { id: "US-10294-A", title: "AI-Driven Sorting System", desc: "Method for automated sorting using neural networks.", type: "Utility Patent", status: "GRANTED", statusColor: "bg-green-100 text-green-700", updated: "Oct 12, 2023", jurisdiction: "USPTO (USA)" },
  { id: "EU-22019-B", title: "Bio-Degradable Casing", desc: "Sustainable packaging for consumer electronics.", type: "Design Patent", status: "FILED", statusColor: "bg-[#0d1b2a] text-white", updated: "Nov 04, 2023", jurisdiction: "EPO (EU)" },
  { id: "US-11582-X", title: "Quantum Encryption Protocol", desc: "End-to-end security using quantum entanglement.", type: "Software Patent", status: "EXAMINATION", statusColor: "bg-gray-200 text-gray-700", updated: "Oct 29, 2023", jurisdiction: "USPTO (USA)" },
  { id: "CN-48921-C", title: "Lithium-Air Battery Cell", desc: "High density energy storage for EV applications.", type: "Chemical Patent", status: "FER ISSUED", statusColor: "bg-[#f5a623] text-white", updated: "Oct 15, 2023", jurisdiction: "CNIPA (China)" },
  { id: "JP-99231-K", title: "Mechanical Wind Turbine", desc: "Low-friction vertical axis rotor design.", type: "Mechanical Patent", status: "REJECTED", statusColor: "bg-red-500 text-white", updated: "Sep 20, 2023", jurisdiction: "JPO (Japan)" },
  { id: "IN-30241-M", title: "Solar Thermal Collector", desc: "High-efficiency parabolic trough collector design.", type: "Utility Patent", status: "FILED", statusColor: "bg-[#0d1b2a] text-white", updated: "Aug 15, 2023", jurisdiction: "IPO (India)" },
  { id: "US-77821-P", title: "Neural Interface Chip", desc: "Brain-computer interface with low-latency signal processing.", type: "Software Patent", status: "EXAMINATION", statusColor: "bg-gray-200 text-gray-700", updated: "Jul 30, 2023", jurisdiction: "USPTO (USA)" },
  { id: "GB-10021-Q", title: "Biodegradable Circuit Board", desc: "Eco-friendly PCB using natural polymer substrates.", type: "Design Patent", status: "GRANTED", statusColor: "bg-green-100 text-green-700", updated: "Jun 22, 2023", jurisdiction: "UKIPO (UK)" },
];

const statusFilters = ["All", "GRANTED", "FILED", "EXAMINATION", "FER ISSUED", "REJECTED"];

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = allCases.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeStatus === "All" || c.status === activeStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1b2a]">My Cases</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all your intellectual property filings.</p>
        </div>
        <Link
          href="/dashboard/cases/new"
          className="flex items-center gap-2 bg-[#0d1b2a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Filing
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="material-symbols-outlined text-gray-400 text-base">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case ID or title..."
            className="text-sm text-gray-600 bg-transparent outline-none w-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${activeStatus === s ? "bg-[#0d1b2a] text-white border-[#0d1b2a]" : "border-gray-200 text-gray-500 hover:border-[#0d1b2a]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-6 py-3">Case ID</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Title &amp; Description</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Jurisdiction</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Last Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                  <td className="px-6 py-4 text-xs font-semibold text-[#0d1b2a]">{c.id}</td>
                  <td className="px-4 py-4">
                    <Link href={`/dashboard/cases/${c.id}`} className="font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">{c.title}</Link>
                    <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{c.type}</td>
                  <td className="px-4 py-4 text-xs text-gray-500">{c.jurisdiction}</td>
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
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">No cases found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {allCases.length} active cases</p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-7 h-7 rounded text-xs font-semibold bg-[#0d1b2a] text-white">1</button>
            <button className="w-7 h-7 rounded text-xs font-semibold text-gray-500 hover:bg-gray-100">2</button>
            <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
