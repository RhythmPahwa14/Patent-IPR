"use client";
import { useEffect, useState } from "react";
import {
  getAdminUnassignedFilings,
  getAdminAgents,
  assignAdminPatentFiling,
  assignAdminNonPatentFiling,
} from "@/lib/api";

const NON_PATENT_TYPES = ["TRADEMARK", "COPYRIGHT", "DESIGN"];

export default function AdminUnassignedPage() {
  const [items, setItems] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filingType, setFilingType] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    const [filingsRes, agentsRes] = await Promise.all([
      getAdminUnassignedFilings({ filingType: filingType || undefined, page: 0, size: 50 }),
      getAdminAgents(),
    ]);

    if (!filingsRes.ok) {
      setError(filingsRes.data?.message || "Unable to load unassigned filings.");
      setItems([]);
    } else {
      setItems(filingsRes.items || []);
    }

    setAgents(agentsRes.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filingType]);

  const handleAssign = async (item, agentId) => {
    if (!agentId) return;
    setBusyId(item.id);

    const isNonPatent = item.filingCategory === "non-patent" ||
      NON_PATENT_TYPES.includes(String(item.type || "").toUpperCase());
    const fn = isNonPatent ? assignAdminNonPatentFiling : assignAdminPatentFiling;

    const result = await fn(item.id, agentId);
    if (!result.ok) {
      setError(result.data?.message || "Unable to assign filing.");
      setBusyId("");
      return;
    }

    await load();
    setBusyId("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243a]">Unassigned Filings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Assign unclaimed filings to an available agent.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={filingType}
          onChange={(e) => setFilingType(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="patent">Patent</option>
          <option value="TRADEMARK">Trademark</option>
          <option value="COPYRIGHT">Copyright</option>
          <option value="DESIGN">Design</option>
        </select>

        <button onClick={load} className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors">
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Reference", "Title / Type", "Status", "Category", "Submitted", "Assign Agent"].map((head) => (
                <th key={head} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">Loading unassigned filings...</td></tr>}
            {!loading && items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{item.referenceNumber || item.id || "-"}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{item.title || item.type || "Untitled"}</td>
                <td className="px-5 py-4 text-xs text-gray-700">{item.status || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-600 capitalize">{item.filingCategory || "patent"}</td>
                <td className="px-5 py-4 text-xs text-gray-500">
                  {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : "-"}
                </td>
                <td className="px-5 py-4">
                  <select
                    className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={(e) => handleAssign(item, e.target.value)}
                    disabled={busyId === item.id}
                  >
                    <option value="">Select agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No unassigned filings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
