"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAgentPatentFilings, getAgentNonPatentFilings } from "@/lib/api";

const STATUS_FILTERS = ["All", "PENDING", "IN_REVIEW", "APPROVED", "REJECTED"];
const TYPE_FILTERS = ["All", "Patent", "TRADEMARK", "COPYRIGHT", "DESIGN"];

const STATUS_COLOR_MAP = {
  PENDING: "bg-amber-100 text-amber-700",
  IN_REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function AgentCasesPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeType, setActiveType] = useState("All");

  const [patentItems, setPatentItems] = useState([]);
  const [nonPatentItems, setNonPatentItems] = useState([]);
  const [patentPagination, setPatentPagination] = useState({ page: 0, size: 20, totalElements: 0, totalPages: 0 });
  const [nonPatentPagination, setNonPatentPagination] = useState({ page: 0, size: 20, totalElements: 0, totalPages: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data whenever filters change
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError("");

      const statusParam = activeStatus === "All" ? undefined : activeStatus;
      const searchParam = search.trim() || undefined;

      const fetchPatents = activeType === "All" || activeType === "Patent";
      const fetchNonPatents = activeType === "All" || ["TRADEMARK", "COPYRIGHT", "DESIGN"].includes(activeType);

      const [patentRes, nonPatentRes] = await Promise.all([
        fetchPatents
          ? getAgentPatentFilings({ status: statusParam, search: searchParam, page: 0, size: 100 })
          : Promise.resolve({ ok: true, items: [], pagination: { page: 0, size: 20, totalElements: 0, totalPages: 0 } }),
        fetchNonPatents
          ? getAgentNonPatentFilings({
              status: statusParam,
              filingType: activeType !== "All" && activeType !== "Patent" ? activeType : undefined,
              search: searchParam,
              page: 0,
              size: 100,
            })
          : Promise.resolve({ ok: true, items: [], pagination: { page: 0, size: 20, totalElements: 0, totalPages: 0 } }),
      ]);

      if (!patentRes.ok && !nonPatentRes.ok) {
        setError(patentRes.data?.message || "Unable to load assigned cases.");
      }

      setPatentItems(patentRes.items || []);
      setPatentPagination(patentRes.pagination || { page: 0, size: 20, totalElements: 0, totalPages: 0 });
      setNonPatentItems(nonPatentRes.items || []);
      setNonPatentPagination(nonPatentRes.pagination || { page: 0, size: 20, totalElements: 0, totalPages: 0 });
      setLoading(false);
    };

    loadAll();
  }, [activeStatus, activeType, search]);

  const combined = useMemo(() => {
    const patents = patentItems.map((item) => ({
      ...item,
      filingCategory: "patent",
      typeLabel: "Patent",
      displayId: item.referenceNumber || item.patentId || item.id,
    }));

    const nonPatents = nonPatentItems.map((item) => ({
      ...item,
      filingCategory: "non-patent",
      typeLabel: item.type || item.filingType || "Non-Patent",
      displayId: item.referenceNumber || item.id,
    }));

    return [...patents, ...nonPatents].sort((a, b) => {
      const ta = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const tb = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return tb - ta;
    });
  }, [patentItems, nonPatentItems]);

  const totalElements = patentPagination.totalElements + nonPatentPagination.totalElements;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1b2a]">Assigned Cases</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? "Loading..." : `${totalElements} total filing${totalElements !== 1 ? "s" : ""} assigned to you.`}
          </p>
        </div>
        <Link
          href="/agent/non-patent-cases"
          className="flex items-center gap-2 bg-[#0d1b2a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors"
        >
          <span className="material-symbols-outlined text-base">article</span>
          Non-Patent Filings
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
            placeholder="Search by case ID, applicant, or title..."
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
                activeStatus === s ? "bg-[#0d1b2a] text-white border-[#0d1b2a]" : "border-gray-200 text-gray-500 hover:border-[#0d1b2a]"
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
                activeType === t ? "bg-[#f5a623] text-white border-[#f5a623]" : "border-gray-200 text-gray-500 hover:border-[#f5a623]"
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
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-6 py-3">Case ID</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Title / Reference</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Filed</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-400">Loading assignments...</td>
                </tr>
              )}
              {!loading && combined.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No assignments found.</td>
                </tr>
              )}
              {combined.map((c, i) => {
                const detailHref =
                  c.filingCategory === "patent"
                    ? `/agent/cases/${encodeURIComponent(c.id || "")}`
                    : `/agent/non-patent-cases/${encodeURIComponent(c.id || "")}`;

                return (
                  <tr
                    key={c.displayId || i}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === combined.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-6 py-4 text-xs font-semibold text-[#0d1b2a]">{c.displayId || "-"}</td>
                    <td className="px-4 py-4">
                      <Link href={detailHref} className="font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">
                        {c.title || c.referenceNumber || "Untitled Filing"}
                      </Link>
                      {c.applicantName && <p className="text-xs text-gray-400 mt-0.5">Applicant: {c.applicantName}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded tracking-wider uppercase">
                        {c.typeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500">{formatDate(c.submittedAt)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded tracking-wider ${STATUS_COLOR_MAP[c.status] || "bg-gray-100 text-gray-700"}`}>
                        {c.status || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={detailHref} className="text-xs font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">
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