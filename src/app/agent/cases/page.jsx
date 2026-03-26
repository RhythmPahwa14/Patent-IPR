"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAgentPatents } from "@/lib/api";

const statusFilters = ["All", "ASSIGNED", "PENDING", "APPROVED", "REJECTED"];

const statusColorMap = {
  ASSIGNED: "bg-blue-100 text-blue-700",
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

export default function AgentCasesPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError("");
      const result = await getAgentPatents();
      if (!result.ok) {
        setError(result.data?.message || "Unable to load assigned cases.");
        setAssignments([]);
        setLoading(false);
        return;
      }

      setAssignments(result.items || []);
      setLoading(false);
    };

    loadAssignments();
  }, []);

  const filtered = useMemo(() => {
    const statusFiltered = activeStatus === "All"
      ? assignments
      : assignments.filter((c) => c.status === activeStatus);
    if (!search.trim()) return statusFiltered;
    const q = search.toLowerCase();
    return statusFiltered.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const ref = (c.referenceNumber || "").toLowerCase();
      const pid = (c.patentId || c.id || "").toLowerCase();
      const applicant = (c.applicantName || "").toLowerCase();
      return title.includes(q) || ref.includes(q) || pid.includes(q) || applicant.includes(q);
    });
  }, [assignments, activeStatus, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1b2a]">Assigned Cases</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and action all cases allocated to you.</p>
        </div>
        <Link href="/agent/review" className="flex items-center gap-2 bg-[#0d1b2a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors">
          <span className="material-symbols-outlined text-base">rule</span>
          Review Queue
        </Link>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="material-symbols-outlined text-gray-400 text-base">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case ID, applicant, or title..."
            className="text-sm text-gray-600 bg-transparent outline-none w-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${activeStatus === s ? "bg-[#0d1b2a] text-white border-[#0d1b2a]" : "border-gray-200 text-gray-500 hover:border-[#0d1b2a]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-6 py-3">Case ID</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Title &amp; Applicant</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Filed</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-400">Loading assignments...</td>
                </tr>
              )}
              {filtered.map((c, i) => (
                <tr key={c.referenceNumber || c.patentId || c.id || i} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                  <td className="px-6 py-4 text-xs font-semibold text-[#0d1b2a]">{c.referenceNumber || c.patentId || "-"}</td>
                  <td className="px-4 py-4">
                    <Link href={`/agent/cases/${encodeURIComponent(c.referenceNumber || c.patentId || "")}`} className="font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">
                      {c.title || "Untitled Filing"}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">Applicant: {c.applicantName || "-"}</p>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{formatDate(c.submittedAt)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded tracking-wider ${statusColorMap[c.status] || "bg-gray-100 text-gray-700"}`}>{c.status || "-"}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{formatDate(c.updatedAt || c.submittedAt)}</td>
                  <td className="px-4 py-4">
                    <Link href={`/agent/cases/${encodeURIComponent(c.referenceNumber || c.patentId || "")}`} className="text-xs font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No assignments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}