"use client";
import { useEffect, useState } from "react";
import { getAdminAgents, getAdminAssignments, reassignAdminFiling } from "@/lib/api";

const TYPE_OPTIONS = ["", "patent", "nonPatent"];

export default function AdminAssignmentsPage() {
  const [items, setItems] = useState([]);
  const [agents, setAgents] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    const [filingsRes, agentsRes] = await Promise.all([
      getAdminAssignments({ page: 0, size: 10, type: type || undefined }),
      getAdminAgents(),
    ]);

    if (!filingsRes.ok) {
      setError(filingsRes.data?.message || "Unable to load assignments.");
      setItems([]);
    } else {
      setItems(filingsRes.items || []);
    }

    if (!agentsRes.ok) {
      setError((prev) => prev || agentsRes.data?.message || "Unable to load agents.");
      setAgents([]);
    } else {
      setAgents(agentsRes.items || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [type]);

  const handleReassign = async (filingId, agentId) => {
    if (!agentId) return;

    setBusyId(filingId);
    const result = await reassignAdminFiling(filingId, agentId);
    if (!result.ok) {
      setError(result.data?.message || "Unable to reassign filing.");
      setBusyId("");
      return;
    }

    await load();
    setBusyId("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243a]">Assignments</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review active assignments and reassign when needed.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPE_OPTIONS.map((entry) => (
            <option key={entry || "all"} value={entry}>{entry || "All types"}</option>
          ))}
        </select>

        <button onClick={load} className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors">
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[940px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Reference", "Title", "Current Agent", "Type", "Status", "Reassign"].map((head) => (
                <th key={head} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">Loading assignments...</td></tr>}
            {!loading && items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{item.referenceNumber || item.id || "-"}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{item.title || "Untitled"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{item.assignedAgentName || item.assignedAgentId || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{item.type || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-700">{item.status || "-"}</td>
                <td className="px-5 py-4">
                  <select
                    className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={(e) => handleReassign(item.id, e.target.value)}
                    disabled={busyId === item.id}
                  >
                    <option value="">Select new agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No assignments found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
