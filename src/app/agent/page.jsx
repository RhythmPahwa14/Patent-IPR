"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAgentPatents } from "@/lib/api";

const STATUS_COLOR = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING: "bg-amber-100 text-amber-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

function daysBetween(start, end) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const diff = Math.abs(e.getTime() - s.getTime());
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export default function AgentDashboardPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError("");
      const result = await getAgentPatents();
      if (!result.ok) {
        setError(result.data?.message || "Unable to load assigned cases.");
        setAssignments([]);
        setLoading(false);
        return;
      }

      setAssignments(result.items || []);
      setLoading(false);
    };

    loadAssignments();
  }, []);

  const stats = useMemo(() => {
    const total = assignments.length;
    const active = assignments.filter((f) => ["PENDING", "ASSIGNED"].includes(f.status)).length;
    const approved = assignments.filter((f) => f.status === "APPROVED").length;
    const rejected = assignments.filter((f) => f.status === "REJECTED").length;

    return [
      {
        icon: "assignment",
        label: "TOTAL ASSIGNED",
        value: String(total),
        badge: total > 0 ? "Live" : "No data",
        badgeColor: total > 0 ? "text-green-600" : "text-gray-500",
      },
      {
        icon: "rule",
        label: "IN REVIEW",
        value: String(active),
        badge: "Queue",
        badgeColor: "text-amber-600",
      },
      {
        icon: "verified",
        label: "APPROVED",
        value: String(approved),
        badge: approved > 0 ? "Closed" : "No data",
        badgeColor: approved > 0 ? "text-green-600" : "text-gray-500",
        highlight: true,
      },
      {
        icon: "cancel",
        label: "REJECTED",
        value: String(rejected),
        badge: rejected > 0 ? "Action" : "No data",
        badgeColor: rejected > 0 ? "text-red-500" : "text-gray-500",
      },
    ];
  }, [assignments]);

  const reviewQueue = useMemo(() => {
    return assignments
      .filter((f) => ["PENDING", "ASSIGNED"].includes(f.status))
      .slice(0, 6)
      .map((f) => ({
        id: f.referenceNumber || f.patentId || f.id,
        title: f.title || "Untitled Filing",
        applicant: f.applicantName || "Applicant",
        status: f.status || "PENDING",
        statusColor: STATUS_COLOR[f.status] || "bg-gray-100 text-gray-700",
        updated: formatDate(f.submittedAt),
      }));
  }, [assignments]);

  const recentDecisions = useMemo(() => {
    return assignments
      .filter((f) => ["APPROVED", "REJECTED"].includes(f.status))
      .slice(0, 4)
      .map((f) => ({
        id: f.referenceNumber || f.patentId || f.id,
        title: f.title || "Untitled Filing",
        status: f.status || "APPROVED",
        statusColor: STATUS_COLOR[f.status] || "bg-gray-100 text-gray-700",
        updated: formatDate(f.updatedAt || f.submittedAt),
      }));
  }, [assignments]);

  const averageDecisionTime = useMemo(() => {
    const closed = assignments.filter((f) => ["APPROVED", "REJECTED"].includes(f.status));
    if (closed.length === 0) return "-";
    const totalDays = closed.reduce((acc, item) => {
      const delta = daysBetween(item.submittedAt, item.updatedAt);
      return acc + (delta ?? 0);
    }, 0);
    const avg = totalDays / closed.length;
    return Number.isFinite(avg) ? `${Math.round(avg)} days` : "-";
  }, [assignments]);

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
            <p className="text-3xl font-bold text-[#0d1b2a]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[#0d1b2a]">Review Queue</h2>
              <p className="text-xs text-gray-400">Priority cases awaiting decision.</p>
            </div>
            <Link href="/agent/review" className="text-xs font-semibold text-[#f5a623] hover:text-[#0d1b2a] transition-colors">Open Queue</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Case ID",
                    "Title",
                    "Applicant",
                    "Status",
                    "Submitted",
                    "",
                  ].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-6 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviewQueue.map((c, i) => (
                  <tr key={c.id || i} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === reviewQueue.length - 1 ? "border-0" : ""}`}>
                    <td className="px-6 py-4 text-xs font-semibold text-[#0d1b2a]">{c.id || "-"}</td>
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
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                      No active cases in your queue.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                      Loading queue...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Decision Rhythm</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Average decision time</span>
                <span className="text-sm font-semibold text-[#0d1b2a]">{averageDecisionTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Active queue</span>
                <span className="text-sm font-semibold text-[#0d1b2a]">{reviewQueue.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Resolved this cycle</span>
                <span className="text-sm font-semibold text-[#0d1b2a]">{recentDecisions.length}</span>
              </div>
            </div>
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