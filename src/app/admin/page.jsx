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

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-3xl font-bold text-[#10243a]">{value ?? 0}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
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

      {/* ── User stats ── */}
      <div>
        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Users</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={stats?.users?.total} />
          <StatCard label="Clients" value={stats?.users?.clients} />
          <StatCard label="Agents" value={stats?.users?.agents} />
        </div>
      </div>

      {/* ── Filing stats ── */}
      <div>
        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Patent Filings</h2>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          <StatCard label="Total Patent Filings" value={stats?.patentFilings?.total} />
          <StatCard label="By Status" value={null} sub={byStatus(stats?.patentFilings?.byStatus)} />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Non-Patent Filings</h2>
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          <StatCard label="Total Non-Patent Filings" value={stats?.nonPatentFilings?.total} />
          <StatCard label="By Status" value={null} sub={byStatus(stats?.nonPatentFilings?.byStatus)} />
        </div>
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
                  <td className="px-5 py-4 text-xs text-gray-700">{item.status || "-"}</td>
                  <td className="px-5 py-4 text-xs text-gray-600">{item.assignedAgentName || item.assignedAgentId || "Unassigned"}</td>
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
                  <td className="px-5 py-4 text-xs text-gray-700">{item.status || "-"}</td>
                  <td className="px-5 py-4 text-xs text-gray-600">{item.assignedAgentName || item.assignedAgentId || "Unassigned"}</td>
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
