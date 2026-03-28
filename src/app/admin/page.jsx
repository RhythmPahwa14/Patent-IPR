"use client";
import { useEffect, useState } from "react";
import {
  getAdminDashboard,
  getAdminPatentFilings,
  getAdminNonPatentFilings,
  getAdminAgents,
  assignAdminPatentFiling,
  assignAdminNonPatentFiling,
  updateAdminPatentFilingStatus,
  updateAdminNonPatentFilingStatus,
} from "@/lib/api";

const STATUS_OPTIONS = ["PENDING", "IN_REVIEW", "APPROVED", "REJECTED"];

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

function StatusBadge({ status }) {
  if (!status) return <span className="text-gray-400">-</span>;
  const s = String(status).toUpperCase();
  let colorClass = "bg-gray-100 text-gray-700";
  
  if (s === "PENDING") colorClass = "bg-orange-100 text-orange-800";
  else if (s === "IN_REVIEW") colorClass = "bg-blue-100 text-blue-800";
  else if (s === "APPROVED") colorClass = "bg-green-100 text-green-800";
  else if (s === "REJECTED") colorClass = "bg-red-100 text-red-800";
  else if (s === "DRAFT") colorClass = "bg-slate-100 text-slate-700";

  return <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${colorClass}`}>{s}</span>;
}

function TopStatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col justify-center">
      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-2xl font-black text-[#10243a]">{value ?? 0}</p>
    </div>
  );
}

function FilingStatsCard({ title, total, byStatus }) {
  const statuses = Object.entries(byStatus || {});
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-3">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-[#10243a]">{title}</h3>
        <div className="bg-[#10243a] text-white font-bold px-3 py-1 rounded-full text-[10px] tracking-wide">
          TOTAL: {total || 0}
        </div>
      </div>
      <div className="flex-1">
        {statuses.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {statuses.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex-grow">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mr-4">{status}</span>
                <span className="text-sm font-black text-[#10243a]">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-gray-400 italic py-4">No filings to display.</div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [patentFilings, setPatentFilings] = useState([]);
  const [nonPatentFilings, setNonPatentFilings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    const [dashRes, patentRes, nonPatentRes, agentsRes] = await Promise.all([
      getAdminDashboard(),
      getAdminPatentFilings({ page: 0, size: 5, sort: "submittedAt,desc" }),
      getAdminNonPatentFilings({ page: 0, size: 5, sort: "submittedAt,desc" }),
      getAdminAgents(),
    ]);

    if (!dashRes.ok) {
      setError(dashRes.data?.message || "Unable to load dashboard stats.");
    } else {
      setStats(dashRes.stats);
    }

    setPatentFilings(patentRes.items || []);
    setNonPatentFilings(nonPatentRes.items || []);
    setAgents(agentsRes.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePatentAssign = async (filingId, agentId) => {
    if (!agentId) return;
    setBusyId(filingId);
    await assignAdminPatentFiling(filingId, agentId);
    await loadData();
    setBusyId("");
  };

  const handleNonPatentAssign = async (filingId, agentId) => {
    if (!agentId) return;
    setBusyId(filingId);
    await assignAdminNonPatentFiling(filingId, agentId);
    await loadData();
    setBusyId("");
  };

  const handlePatentStatus = async (filingId, status) => {
    if (!status) return;
    setBusyId(filingId);
    await updateAdminPatentFilingStatus(filingId, status);
    await loadData();
    setBusyId("");
  };

  const handleNonPatentStatus = async (filingId, status) => {
    if (!status) return;
    setBusyId(filingId);
    await updateAdminNonPatentFilingStatus(filingId, status);
    await loadData();
    setBusyId("");
  };

  const byStatus = (obj = {}) =>
    Object.entries(obj)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" · ") || "—";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243a]">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">System overview — users, filings, and agent workload.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* ── Dashboard Stats Overview ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        <TopStatCard label="Total Users" value={stats?.users?.total} />
        <TopStatCard label="Clients" value={stats?.users?.clients} />
        <TopStatCard label="Agents" value={stats?.users?.agents} />
        <TopStatCard label="Total Filings" value={(stats?.patentFilings?.total || 0) + (stats?.nonPatentFilings?.total || 0)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FilingStatsCard title="Patent Filings" total={stats?.patentFilings?.total} byStatus={stats?.patentFilings?.byStatus} />
        <FilingStatsCard title="Non-Patent Filings" total={stats?.nonPatentFilings?.total} byStatus={stats?.nonPatentFilings?.byStatus} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={loadData}
          className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* ── Recent Patent Filings ── */}
      <div>
        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Recent Patent Filings</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Reference", "Title", "Status", "Agent", "Assign Agent", "Update Status", "Submitted"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">Loading...</td></tr>
              )}
              {!loading && patentFilings.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{item.referenceNumber || item.id || "-"}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{item.title || "Untitled"}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-4 text-xs text-gray-600">
                    {item.assignedAgentName || item.assignedAgentId ? (
                      <span className="font-medium">{item.assignedAgentName || item.assignedAgentId}</span>
                    ) : (
                      <div className="flex flex-col">
                        <span className="italic text-gray-400">Unassigned</span>
                        <span className="text-[9px] text-gray-300 mt-1 max-w-[120px] leading-tight truncate" title={Object.keys(item.raw || {}).join(", ")}>
                          {Object.keys(item.raw || {}).join(", ")}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => handlePatentAssign(item.id, e.target.value)}
                      disabled={busyId === item.id}
                    >
                      <option value="">Select agent</option>
                      {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => handlePatentStatus(item.id, e.target.value)}
                      disabled={busyId === item.id || item.status === "DRAFT"}
                    >
                      <option value="">Update status</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{formatDate(item.submittedAt)}</td>
                </tr>
              ))}
              {!loading && patentFilings.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">No recent patent filings.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent Non-Patent Filings ── */}
      <div>
        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Recent Non-Patent Filings</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Reference", "Type", "Status", "Agent", "Assign Agent", "Update Status", "Submitted"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">Loading...</td></tr>
              )}
              {!loading && nonPatentFilings.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{item.referenceNumber || item.id || "-"}</td>
                  <td className="px-5 py-4 text-xs text-gray-600">{item.type || "-"}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-4 text-xs text-gray-600">{item.assignedAgentName || item.assignedAgentId || <span className="italic text-gray-400">Unassigned</span>}</td>
                  <td className="px-5 py-4">
                    <select
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => handleNonPatentAssign(item.id, e.target.value)}
                      disabled={busyId === item.id}
                    >
                      <option value="">Select agent</option>
                      {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => handleNonPatentStatus(item.id, e.target.value)}
                      disabled={busyId === item.id || item.status === "DRAFT"}
                    >
                      <option value="">Update status</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{formatDate(item.submittedAt)}</td>
                </tr>
              ))}
              {!loading && nonPatentFilings.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">No recent non-patent filings.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
