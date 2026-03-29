"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAgentDashboard, getAgentPatentFilings, getAgentNonPatentFilings } from "@/lib/api";

const STATUS_COLOR = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING: "bg-amber-100 text-amber-700",
  IN_REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function AgentDashboardPage() {
  const [dashStats, setDashStats] = useState(null);
  const [recentPatents, setRecentPatents] = useState([]);
  const [recentNonPatents, setRecentNonPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      const [dashResult, patentResult, nonPatentResult] = await Promise.all([
        getAgentDashboard(),
        getAgentPatentFilings({ page: 0, size: 6, sort: "assignedAt,desc" }),
        getAgentNonPatentFilings({ page: 0, size: 4, sort: "assignedAt,desc" }),
      ]);

      if (dashResult.ok) {
        setDashStats(dashResult.stats);
      } else {
        setError(dashResult.data?.message || "Unable to load dashboard.");
      }

      setRecentPatents(patentResult.items || []);
      setRecentNonPatents(nonPatentResult.items || []);
      setLoading(false);
    };

    load();
  }, []);

  const patentFilings = dashStats?.assignedPatentFilings || { total: 0, byStatus: {} };
  const nonPatentFilings = dashStats?.assignedNonPatentFilings || { total: 0, byStatus: {} };

  const stats = useMemo(() => {
    const patentTotal = patentFilings.total;
    const nonPatentTotal = nonPatentFilings.total;
    const totalAll = patentTotal + nonPatentTotal;

    const patentByStatus = patentFilings.byStatus || {};
    const nonPatentByStatus = nonPatentFilings.byStatus || {};

    const inReview = (patentByStatus.IN_REVIEW || 0) + (nonPatentByStatus.IN_REVIEW || 0);
    const approved = (patentByStatus.APPROVED || 0) + (nonPatentByStatus.APPROVED || 0);
    const pending = (patentByStatus.PENDING || 0) + (nonPatentByStatus.PENDING || 0);
    const rejected = (patentByStatus.REJECTED || 0) + (nonPatentByStatus.REJECTED || 0);

    return [
      {
        icon: "assignment",
        label: "TOTAL ASSIGNED",
        value: String(totalAll),
        sub: `${patentTotal} patent · ${nonPatentTotal} non-patent`,
        badge: totalAll > 0 ? "Live" : "No data",
        badgeColor: totalAll > 0 ? "text-green-600" : "text-gray-500",
      },
      {
        icon: "pending_actions",
        label: "PENDING",
        value: String(pending),
        sub: "Awaiting review",
        badge: "Queue",
        badgeColor: "text-amber-600",
      },
      {
        icon: "rule",
        label: "IN REVIEW",
        value: String(inReview),
        sub: "Being processed",
        badge: "Active",
        badgeColor: "text-blue-600",
      },
      {
        icon: "verified",
        label: "APPROVED",
        value: String(approved),
        sub: `${rejected} rejected`,
        badge: approved > 0 ? "Closed" : "No data",
        badgeColor: approved > 0 ? "text-green-600" : "text-gray-500",
        highlight: true,
      },
    ];
  }, [dashStats]);

  const reviewQueue = useMemo(() => {
    return recentPatents
      .filter((f) => ["PENDING", "IN_REVIEW"].includes(f.status))
      .slice(0, 6)
      .map((f) => ({
        id: f.id,
        displayId: f.referenceNumber || f.patentId || f.id,
        title: f.title || "Untitled Filing",
        applicant: f.applicantName || "Applicant",
        status: f.status || "PENDING",
        statusColor: STATUS_COLOR[f.status] || "bg-gray-100 text-gray-700",
        updated: formatDate(f.submittedAt),
        type: "Patent",
      }));
  }, [recentPatents]);

  const recentDecisions = useMemo(() => {
    const patentDecisions = recentPatents
      .filter((f) => ["APPROVED", "REJECTED"].includes(f.status))
      .slice(0, 3)
      .map((f) => ({
        id: f.id,
        displayId: f.referenceNumber || f.patentId || f.id,
        title: f.title || "Untitled",
        status: f.status,
        statusColor: STATUS_COLOR[f.status] || "bg-gray-100 text-gray-700",
        updated: formatDate(f.updatedAt || f.submittedAt),
        type: "Patent",
      }));

    const npDecisions = recentNonPatents
      .filter((f) => ["APPROVED", "REJECTED"].includes(f.status))
      .slice(0, 2)
      .map((f) => ({
        id: f.id,
        displayId: f.referenceNumber || f.id,
        title: f.title || f.referenceNumber || "Untitled",
        status: f.status,
        statusColor: STATUS_COLOR[f.status] || "bg-gray-100 text-gray-700",
        updated: formatDate(f.updatedAt || f.submittedAt),
        type: f.type || "Non-Patent",
      }));

    return [...patentDecisions, ...npDecisions].slice(0, 5);
  }, [recentPatents, recentNonPatents]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Agent Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track review workload, decisions, and case health.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border border-gray-100 p-5 ${s.highlight ? "ring-1 ring-[#f5a623]/30" : ""}`}>
            <div className="flex items-start justify-between mb-3">
              <span className="material-symbols-outlined text-gray-400 text-2xl">{s.icon}</span>
              <span className={`text-xs font-semibold ${s.badgeColor}`}>{s.badge}</span>
            </div>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-[#0d1b2a]">{loading ? "—" : s.value}</p>
            {s.sub && <p className="text-[10px] text-gray-400 mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Breakdown by filing type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Patent Filings Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(patentFilings.byStatus || {}).length === 0 ? (
              <p className="text-xs text-gray-400">No data available.</p>
            ) : (
              Object.entries(patentFilings.byStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider ${STATUS_COLOR[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>
                  <span className="text-sm font-semibold text-[#0d1b2a]">{count}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">Total Patent Filings</span>
            <span className="text-sm font-bold text-[#0d1b2a]">{loading ? "—" : patentFilings.total}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Non-Patent Filings Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(nonPatentFilings.byStatus || {}).length === 0 ? (
              <p className="text-xs text-gray-400">No data available.</p>
            ) : (
              Object.entries(nonPatentFilings.byStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider ${STATUS_COLOR[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>
                  <span className="text-sm font-semibold text-[#0d1b2a]">{count}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">Total Non-Patent Filings</span>
            <span className="text-sm font-bold text-[#0d1b2a]">{loading ? "—" : nonPatentFilings.total}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[#0d1b2a]">Patent Review Queue</h2>
              <p className="text-xs text-gray-400">Assigned patent filings awaiting action.</p>
            </div>
            <Link href="/agent/cases" className="text-xs font-semibold text-[#f5a623] hover:text-[#0d1b2a] transition-colors">All Cases</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Case ID", "Title", "Applicant", "Status", "Submitted", ""].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviewQueue.map((c, i) => (
                  <tr key={c.id || i} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === reviewQueue.length - 1 ? "border-0" : ""}`}>
                    <td className="px-6 py-4 text-xs font-semibold text-[#0d1b2a]">{c.displayId || "-"}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#0d1b2a]">{c.title}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{c.applicant}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded tracking-wider ${c.statusColor}`}>{c.status}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{c.updated}</td>
                    <td className="px-6 py-4">
                      <Link href={`/agent/cases/${encodeURIComponent(c.id || "")}`} className="text-xs font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">Review</Link>
                    </td>
                  </tr>
                ))}
                {!loading && reviewQueue.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No active patent filings in your queue.</td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">Loading queue...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Recent Non-Patent Filings</h3>
            <div className="space-y-3">
              {recentNonPatents.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0d1b2a]">{item.referenceNumber || item.id}</p>
                    <p className="text-[10px] text-gray-400">{item.type || "N/A"}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-1 rounded ${STATUS_COLOR[item.status] || "bg-gray-100 text-gray-700"}`}>{item.status || "-"}</span>
                </div>
              ))}
              {recentNonPatents.length === 0 && !loading && (
                <p className="text-xs text-gray-400">No non-patent filings assigned.</p>
              )}
            </div>
            <Link href="/agent/non-patent-cases" className="mt-4 text-xs font-semibold text-[#f5a623] hover:text-[#0d1b2a] block transition-colors">View all →</Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Recent Decisions</h3>
            <div className="space-y-3">
              {recentDecisions.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#0d1b2a]">{item.title}</p>
                    <p className="text-[10px] text-gray-400">{item.updated}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-1 rounded ${item.statusColor}`}>{item.status}</span>
                </div>
              ))}
              {recentDecisions.length === 0 && (
                <p className="text-xs text-gray-400">No decisions recorded yet.</p>
              )}
            </div>
          </div>

          <div className="bg-[#0d1b2a] rounded-xl p-5 text-white">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-3">Focus Today</p>
            <ul className="space-y-2 text-xs text-white/80">
              <li>Resolve queue items with applicant callbacks.</li>
              <li>Validate document completeness for new filings.</li>
              <li>Share updates with legal lead by end of day.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}