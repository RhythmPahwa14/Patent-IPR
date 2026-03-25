"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getClientPatents } from "@/lib/api";

const PAGE_SIZE = 10;
const statusFilters = ["All", "DRAFT", "PENDING", "APPROVED", "REJECTED"];

const statusColorMap = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [page, setPage] = useState(0);
  const [filings, setFilings] = useState([]);
  const [meta, setMeta] = useState({ page: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilingPopup, setShowFilingPopup] = useState(false);

  useEffect(() => {
    const loadFilings = async () => {
      setLoading(true);
      setError("");

      const result = await getClientPatents({
        page,
        size: PAGE_SIZE,
        sort: "submittedAt,desc",
        status: activeStatus === "All" ? undefined : activeStatus,
      });
      if (!result.ok) {
        setError(result.data?.message || "Unable to load your filings.");
        setFilings([]);
        setMeta({ page, size: PAGE_SIZE, totalElements: 0, totalPages: 0 });
        setLoading(false);
        return;
      }

      setFilings(result.items || []);
      setMeta({
        page: result.pagination?.page ?? page,
        size: result.pagination?.size ?? PAGE_SIZE,
        totalElements: result.pagination?.totalElements ?? 0,
        totalPages: result.pagination?.totalPages ?? 0,
      });
      setLoading(false);
    };

    loadFilings();
  }, [activeStatus, page]);

  const filtered = useMemo(() => {
    if (!search.trim()) return filings;
    const q = search.toLowerCase();
    return filings.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const ref = (c.referenceNumber || "").toLowerCase();
      const pid = (c.patentId || "").toLowerCase();
      return title.includes(q) || ref.includes(q) || pid.includes(q);
    });
  }, [filings, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1b2a]">My Cases</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all your intellectual property filings.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilingPopup(true)}
          className="flex items-center gap-2 bg-[#0d1b2a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Filing
        </button>
      </div>

      {showFilingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close filing menu"
            className="absolute inset-0 bg-[#0d1b2a]/40"
            onClick={() => setShowFilingPopup(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-2xl border border-gray-100 p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-[#0d1b2a]">Select Filing Type</h2>
                <p className="text-sm text-gray-500 mt-1">Choose a category to continue with filing.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowFilingPopup(false)}
                className="text-gray-400 hover:text-[#0d1b2a] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/cases/new"
                onClick={() => setShowFilingPopup(false)}
                className="flex items-center justify-center text-sm font-semibold text-[#0d1b2a] border border-gray-200 rounded-xl py-3 hover:border-[#0d1b2a] transition-colors"
              >
                Patent
              </Link>
              <Link
                href="/dashboard/cases/new/trademark"
                onClick={() => setShowFilingPopup(false)}
                className="flex items-center justify-center text-sm font-semibold text-[#0d1b2a] border border-gray-200 rounded-xl py-3 hover:border-[#0d1b2a] transition-colors"
              >
                Trademark
              </Link>
              <Link
                href="/dashboard/cases/new/copyright"
                onClick={() => setShowFilingPopup(false)}
                className="flex items-center justify-center text-sm font-semibold text-[#0d1b2a] border border-gray-200 rounded-xl py-3 hover:border-[#0d1b2a] transition-colors"
              >
                Copyright
              </Link>
              <Link
                href="/dashboard/cases/new/design"
                onClick={() => setShowFilingPopup(false)}
                className="flex items-center justify-center text-sm font-semibold text-[#0d1b2a] border border-gray-200 rounded-xl py-3 hover:border-[#0d1b2a] transition-colors"
              >
                Design Registration
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="material-symbols-outlined text-gray-400 text-base">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case ID or title..."
            className="text-sm text-gray-600 bg-transparent outline-none w-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => {
                setActiveStatus(s);
                setPage(0);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${activeStatus === s ? "bg-[#0d1b2a] text-white border-[#0d1b2a]" : "border-gray-200 text-gray-500 hover:border-[#0d1b2a]"}`}
            >
              {s}
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
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Title &amp; Description</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Jurisdiction</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Last Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-sm text-red-500">{error}</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-sm text-gray-400">Loading filings...</td>
                </tr>
              )}
              {filtered.map((c, i) => (
                <tr key={c.referenceNumber || c.patentId || i} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                  <td className="px-6 py-4 text-xs font-semibold text-[#0d1b2a]">{c.referenceNumber || "-"}</td>
                  <td className="px-4 py-4">
                    <Link href={`/dashboard/cases/${encodeURIComponent(c.referenceNumber || "")}`} className="font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">{c.title || "Untitled Filing"}</Link>
                    <p className="text-xs text-gray-400 mt-0.5">Patent ID: {c.patentId || "-"}</p>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">PATENT FILING</td>
                  <td className="px-4 py-4 text-xs text-gray-500">-</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded tracking-wider ${statusColorMap[c.status] || "bg-gray-100 text-gray-700"}`}>{c.status || "-"}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{formatDate(c.submittedAt)}</td>
                  <td className="px-4 py-4">
                    <button className="text-gray-400 hover:text-[#0d1b2a] transition-colors">
                      <span className="material-symbols-outlined text-lg">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">No cases found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {meta.totalElements} filings</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page <= 0}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-7 h-7 rounded text-xs font-semibold bg-[#0d1b2a] text-white">{meta.totalPages === 0 ? 0 : page + 1}</button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.totalPages === 0 || page >= meta.totalPages - 1}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
