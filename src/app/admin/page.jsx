"use client";
import { useEffect, useMemo, useState } from "react";
import {
  assignAdminFiling,
  getAdminAgents,
  getAdminDashboard,
  reassignAdminFiling,
  updateAdminFilingStatus,
} from "@/lib/api";

const STATUS_OPTIONS = ["DRAFT", "PENDING", "APPROVED", "REJECTED"];

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function AdminDashboardPage() {
  const [filings, setFilings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyFilingId, setBusyFilingId] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    totalFilings: 0,
    unassigned: 0,
    inProgress: 0,
    decided: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError("");

    const [dashboardRes, agentsRes] = await Promise.all([
      getAdminDashboard({
        page: 0,
        size: 10,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        unassigned: unassignedOnly,
      }),
      getAdminAgents(),
    ]);

    if (!dashboardRes.ok) {
      setError(dashboardRes.data?.message || "Unable to load admin filings.");
      setFilings([]);
      setDashboardStats({
        totalFilings: 0,
        unassigned: 0,
        inProgress: 0,
        decided: 0,
      });
    } else {
      setFilings(dashboardRes.items || []);
      setDashboardStats(dashboardRes.stats || {
        totalFilings: 0,
        unassigned: 0,
        inProgress: 0,
        decided: 0,
      });
    }

    if (!agentsRes.ok) {
      setError((prev) => prev || agentsRes.data?.message || "Unable to load assignable agents.");
      setAgents([]);
    } else {
      setAgents(agentsRes.items || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter, unassignedOnly]);

  const stats = useMemo(() => {
    const fallback = {
      totalFilings: filings.length,
      unassigned: filings.filter((item) => !item.assignedAgentId).length,
      inProgress: filings.filter((item) => item.status === "PENDING").length,
      decided: filings.filter((item) => ["APPROVED", "REJECTED"].includes(item.status)).length,
    };

    return {
      total: dashboardStats.totalFilings ?? fallback.totalFilings,
      unassigned: dashboardStats.unassigned ?? fallback.unassigned,
      inProgress: dashboardStats.inProgress ?? fallback.inProgress,
      completed: dashboardStats.decided ?? fallback.decided,
    };
  }, [dashboardStats, filings]);

  const handleAssignAction = async (filing, nextAgentId) => {
    if (!nextAgentId) return;
    setBusyFilingId(filing.id);

    const action = filing.assignedAgentId ? reassignAdminFiling : assignAdminFiling;
    const response = await action(filing.id, nextAgentId);

    if (!response.ok) {
      setError(response.data?.message || "Unable to update assignment.");
      setBusyFilingId("");
      return;
    }

    await loadData();
    setBusyFilingId("");
  };

  const handleStatusAction = async (filingId, nextStatus) => {
    if (!nextStatus) return;
    setBusyFilingId(filingId);

    const response = await updateAdminFilingStatus(filingId, nextStatus);
    if (!response.ok) {
      setError(response.data?.message || "Unable to update filing status.");
      setBusyFilingId("");
      return;
    }

    await loadData();
    setBusyFilingId("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243a]">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Monitor filings, assign agents, and take approval decisions.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Total Filings</p>
          <p className="text-3xl font-bold text-[#10243a]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Unassigned</p>
          <p className="text-3xl font-bold text-[#10243a]">{stats.unassigned}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">In Progress</p>
          <p className="text-3xl font-bold text-[#10243a]">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Decided</p>
          <p className="text-3xl font-bold text-[#10243a]">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          <option value="patent">Patent</option>
          <option value="nonPatent">Non-Patent</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-gray-600 px-1">
          <input
            type="checkbox"
            checked={unassignedOnly}
            onChange={(e) => setUnassignedOnly(e.target.checked)}
          />
          Unassigned only
        </label>

        <button
          onClick={loadData}
          className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Filing ID",
                "Title",
                "Type",
                "Status",
                "Agent",
                "Assign/Reassign",
                "Decision",
                "Submitted",
              ].map((head) => (
                <th key={head} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filings.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{item.id || "-"}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{item.title || "Untitled Filing"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{item.type || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-700">{item.status || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">
                  {item.assignedAgentName || item.assignedAgentId || "Unassigned"}
                </td>
                <td className="px-5 py-4">
                  <select
                    className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={(e) => handleAssignAction(item, e.target.value)}
                    disabled={busyFilingId === item.id}
                  >
                    <option value="">Select agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <select
                    className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                    value=""
                    onChange={(e) => handleStatusAction(item.id, e.target.value)}
                    disabled={busyFilingId === item.id}
                  >
                    <option value="">Update status</option>
                    <option value="APPROVED">APPROVE</option>
                    <option value="REJECTED">REJECT</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-xs text-gray-500">{formatDate(item.submittedAt)}</td>
              </tr>
            ))}

            {!loading && filings.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">
                  No filings found for selected filters.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">
                  Loading admin data...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
