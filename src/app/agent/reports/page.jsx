"use client";
import { useEffect, useMemo, useState } from "react";
import { getAgentPatents } from "@/lib/api";

function daysBetween(start, end) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const diff = Math.abs(e.getTime() - s.getTime());
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export default function AgentReportsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError("");
      const result = await getAgentPatents();
      if (!result.ok) {
        setError(result.data?.message || "Unable to load reporting metrics.");
        setAssignments([]);
        setLoading(false);
        return;
      }

      setAssignments(result.items || []);
      setLoading(false);
    };

    loadAssignments();
  }, []);

  const metrics = useMemo(() => {
    const total = assignments.length;
    const approved = assignments.filter((f) => f.status === "APPROVED").length;
    const rejected = assignments.filter((f) => f.status === "REJECTED").length;
    const active = assignments.filter((f) => ["PENDING", "ASSIGNED"].includes(f.status)).length;
    const closed = assignments.filter((f) => ["APPROVED", "REJECTED"].includes(f.status));
    const approvalRate = total ? Math.round((approved / total) * 100) : 0;

    const decisionDays = closed
      .map((item) => daysBetween(item.submittedAt, item.updatedAt))
      .filter((d) => d !== null);
    const avgDecision = decisionDays.length
      ? `${Math.round(decisionDays.reduce((a, b) => a + b, 0) / decisionDays.length)} days`
      : "-";

    return {
      total,
      approved,
      rejected,
      active,
      approvalRate,
      avgDecision,
    };
  }, [assignments]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Agent Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Performance and workload analytics for your review portfolio.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Total Assigned</p>
          <p className="text-3xl font-bold text-[#0d1b2a] mt-2">{metrics.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Active Queue</p>
          <p className="text-3xl font-bold text-[#0d1b2a] mt-2">{metrics.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Approval Rate</p>
          <p className="text-3xl font-bold text-[#0d1b2a] mt-2">{metrics.approvalRate}%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Avg Decision Time</p>
          <p className="text-3xl font-bold text-[#0d1b2a] mt-2">{metrics.avgDecision}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-base font-bold text-[#0d1b2a] mb-4">Case Mix</h2>
        {loading ? (
          <p className="text-sm text-gray-400">Loading metrics...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-gray-100 rounded-lg p-4">
              <p className="text-xs text-gray-500">Approved</p>
              <p className="text-xl font-bold text-green-600 mt-2">{metrics.approved}</p>
            </div>
            <div className="border border-gray-100 rounded-lg p-4">
              <p className="text-xs text-gray-500">Rejected</p>
              <p className="text-xl font-bold text-red-500 mt-2">{metrics.rejected}</p>
            </div>
            <div className="border border-gray-100 rounded-lg p-4">
              <p className="text-xs text-gray-500">In Review</p>
              <p className="text-xl font-bold text-amber-600 mt-2">{metrics.active}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#0d1b2a] rounded-xl p-6 text-white">
        <h3 className="text-sm font-semibold">Weekly Focus</h3>
        <p className="text-xs text-white/70 mt-2">Prioritize high-value filings and clear pending reviews before the weekly sync.</p>
      </div>
    </div>
  );
}