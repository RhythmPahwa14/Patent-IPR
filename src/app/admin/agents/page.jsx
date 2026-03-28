"use client";
import { useEffect, useState } from "react";
import { getAdminAgents } from "@/lib/api";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    const result = await getAdminAgents();
    if (!result.ok) {
      setError(result.data?.message || "Unable to load agent workload.");
      setAgents([]);
      setLoading(false);
      return;
    }

    setAgents(result.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243a]">Agent Workload</h1>
        <p className="text-sm text-gray-500 mt-0.5">All agents with their current patent and non-patent filing counts.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button onClick={load} className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors">
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Agent ID", "Name", "Email", "Patent Filings", "Non-Patent Filings", "Total Filings"].map((head) => (
                <th key={head} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">Loading agent workload...</td></tr>
            )}
            {!loading && agents.map((agent) => (
              <tr key={agent.id} className="border-b border-gray-50">
                <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{agent.id || "-"}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{agent.name || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{agent.email || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-700">{agent.patentFilingsCount ?? 0}</td>
                <td className="px-5 py-4 text-xs text-gray-700">{agent.nonPatentFilingsCount ?? 0}</td>
                <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{agent.totalFilings ?? 0}</td>
              </tr>
            ))}
            {!loading && agents.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No agents found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
