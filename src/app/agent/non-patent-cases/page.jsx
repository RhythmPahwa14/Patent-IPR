"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAgentNonPatentFilings } from "@/lib/api";

const STATUS_FILTERS = ["All", "PENDING", "IN_REVIEW", "APPROVED", "REJECTED"];
const TYPE_FILTERS = ["All", "TRADEMARK", "COPYRIGHT", "DESIGN"];

const STATUS_COLOR_MAP = {
  PENDING: "bg-amber-100 text-amber-700",
  IN_REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const TYPE_COLOR_MAP = {
  TRADEMARK: "bg-purple-100 text-purple-700",
  COPYRIGHT: "bg-indigo-100 text-indigo-700",
  DESIGN: "bg-teal-100 text-teal-700",
};

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function AgentNonPatentCasesPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeType, setActiveType] = useState("All");

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 20, totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      const result = await getAgentNonPatentFilings({
        status: activeStatus === "All" ? undefined : activeStatus,
        filingType: activeType === "All" ? undefined : activeType,
        search: search.trim() || undefined,
        page: 0,
        size: 100,
      });

      if (!result.ok) {
        setError(result.data?.message || "Unable to load non-patent filings.");
        setItems([]);
      } else {
        setItems(result.items || []);
        setPagination(result.pagination || { page: 0, size: 20, totalElements: 0, totalPages: 0 });
      }

      setLoading(false);
    };

    load();
  }, [activeStatus, activeType, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1b2a]">Non-Patent Filings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? "Loading..." : `${pagination.totalElements || items.length} total filings assigned — Trademark, Copyright, Design.`}
          </p>
        </div>
        <Link
          href="/agent/cases"
          className="flex items-center gap-2 border border-[#1a3d54] text-[#1a3d54] text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a3d54] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-base">science</span>
          Patent Filings
        </Link>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="material-symbols-outlined text-gray-400 text-base">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reference number or filing identifier..."
            className="text-sm text-gray-600 bg-transparent outline-none w-full placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="material-symbols-outlined text-gray-400 text-base hover:text-gray-600">close</button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest self-center mr-1">Status:</span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                activeStatus === s ? "bg-[#1a3d54] text-white border-[#1a3d54]" : "border-gray-200 text-gray-500 hover:border-[#1a3d54]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest self-center mr-1">Type:</span>
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                activeType === t ? "bg-[#e0eaf3] text-[#1a3d54] border-[#e0eaf3]" : "border-gray-200 text-gray-500 hover:border-[#e0eaf3]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-6 py-3">Reference #</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Filing Type</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Applicant</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Filed</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-400">Loading filings...</td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No non-patent filings assigned.</td>
                </tr>
              )}
              {items.map((c, i) => {
                const displayId = c.referenceNumber || c.id;
                const filingType = (c.type || c.filingType || "").toUpperCase();
                return (
                  <tr
                    key={displayId || i}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === items.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-6 py-4 text-xs font-semibold text-[#0d1b2a]">{displayId || "-"}</td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider ${TYPE_COLOR_MAP[filingType] || "bg-gray-100 text-gray-600"}`}>
                        {filingType || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600">{c.applicantName || "-"}</td>
                    <td className="px-4 py-4 text-xs text-gray-500">{formatDate(c.submittedAt)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded tracking-wider ${STATUS_COLOR_MAP[c.status] || "bg-gray-100 text-gray-700"}`}>
                        {c.status || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/agent/non-patent-cases/${encodeURIComponent(c.id || "")}`}
                        className="text-xs font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
