"use client";
import { useEffect, useState } from "react";
import { getAdminDecisions, updateAdminFilingStatus } from "@/lib/api";

const TYPE_OPTIONS = ["", "patent", "nonPatent"];
const STATUS_OPTIONS = ["", "APPROVED", "REJECTED"];

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function AdminDecisionsPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    const result = await getAdminDecisions({ page: 0, size: 10, status: status || undefined, type: type || undefined });
    if (!result.ok) {
      setError(result.data?.message || "Unable to load decisions.");
      setItems([]);
      setLoading(false);
      return;
    }

    setItems(result.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [status, type]);

  const handleDecision = async (id, nextStatus) => {
    if (!nextStatus) return;

    setBusyId(id);
    const result = await updateAdminFilingStatus(id, nextStatus);
    if (!result.ok) {
      setError(result.data?.message || "Unable to update decision.");
      setBusyId("");
      return;
    }

    await load();
    setBusyId("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243a]">Decisions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track approved and rejected filings.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((entry) => (
            <option key={entry || "all"} value={entry}>{entry || "All decisions"}</option>
          ))}
        </select>

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
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Reference", "Title", "Type", "Status", "Updated", "Action"].map((head) => (
                <th key={head} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">Loading decisions...</td></tr>}
            {!loading && items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{item.referenceNumber || item.id || "-"}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{item.title || "Untitled"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{item.type || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-700">{item.status || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{formatDate(item.updatedAt)}</td>
                <td className="px-5 py-4">
                  <select
                    className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={(e) => handleDecision(item.id, e.target.value)}
                    disabled={busyId === item.id}
                  >
                    <option value="">Set decision</option>
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                  </select>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No decisions found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
