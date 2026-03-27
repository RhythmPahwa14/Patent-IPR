"use client";
import { useEffect, useState } from "react";
import { getAdminFilings } from "@/lib/api";

const STATUS_OPTIONS = ["", "DRAFT", "PENDING", "APPROVED", "REJECTED"];
const TYPE_OPTIONS = ["", "patent", "nonPatent"];
const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function AdminFilingsPage() {
  const [filings, setFilings] = useState([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [unassigned, setUnassigned] = useState(false);
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      const result = await getAdminFilings({
        page,
        size: PAGE_SIZE,
        status: status || undefined,
        type: type || undefined,
        unassigned,
      });

      if (!result.ok) {
        setError(result.data?.message || "Unable to load filings.");
        setFilings([]);
        setMeta({ page, totalPages: 0, totalElements: 0 });
        setLoading(false);
        return;
      }

      setFilings(result.items || []);
      setMeta({
        page: result.pagination?.page ?? page,
        totalPages: result.pagination?.totalPages ?? 0,
        totalElements: result.pagination?.totalElements ?? 0,
      });
      setLoading(false);
    };

    load();
  }, [status, type, unassigned, page]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243a]">All Filings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Browse all patent and non-patent filings.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}>
          {STATUS_OPTIONS.map((entry) => (
            <option key={entry || "all"} value={entry}>{entry || "All statuses"}</option>
          ))}
        </select>

        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={type} onChange={(e) => { setType(e.target.value); setPage(0); }}>
          {TYPE_OPTIONS.map((entry) => (
            <option key={entry || "all"} value={entry}>{entry || "All types"}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-gray-600 px-1">
          <input type="checkbox" checked={unassigned} onChange={(e) => { setUnassigned(e.target.checked); setPage(0); }} />
          Unassigned only
        </label>

        <button onClick={() => setPage(0)} className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors">
          Apply Filters
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[980px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Reference", "Title", "Type", "Status", "Applicant", "Assigned Agent", "Submitted", "Updated"].map((head) => (
                <th key={head} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">Loading filings...</td></tr>
            )}
            {!loading && filings.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{item.referenceNumber || item.id || "-"}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{item.title || "Untitled"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{item.type || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-700">{item.status || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{item.applicantName || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{item.assignedAgentName || "Unassigned"}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{formatDate(item.submittedAt)}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{formatDate(item.updatedAt)}</td>
              </tr>
            ))}
            {!loading && filings.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">No filings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Total filings: {meta.totalElements}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page <= 0}
            className="border border-gray-200 rounded px-3 py-1 text-xs disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-gray-600">Page {meta.totalPages === 0 ? 0 : page + 1} of {meta.totalPages}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={meta.totalPages === 0 || page >= meta.totalPages - 1}
            className="border border-gray-200 rounded px-3 py-1 text-xs disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
