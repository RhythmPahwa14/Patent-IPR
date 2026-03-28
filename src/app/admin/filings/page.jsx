"use client";
import { useEffect, useState } from "react";
import {
  getAdminPatentFilings,
  getAdminNonPatentFilings,
  getAdminAgents,
  assignAdminPatentFiling,
  assignAdminNonPatentFiling,
  updateAdminPatentFilingStatus,
  updateAdminNonPatentFilingStatus,
  setAdminPatentFilingEstimation,
} from "@/lib/api";

const STATUS_OPTIONS = ["PENDING", "IN_REVIEW", "APPROVED", "REJECTED"];
const NON_PATENT_TYPES = ["TRADEMARK", "COPYRIGHT", "DESIGN"];
const PAGE_SIZE = 20;

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

function StatusBadge({ status }) {
  if (!status) return <span className="text-gray-400">-</span>;
  const s = String(status).toUpperCase();
  let colorClass = "bg-gray-100 text-gray-700";
  
  if (s === "PENDING") colorClass = "bg-orange-100 text-orange-800";
  else if (s === "IN_REVIEW") colorClass = "bg-blue-100 text-blue-800";
  else if (s === "APPROVED") colorClass = "bg-green-100 text-green-800";
  else if (s === "REJECTED") colorClass = "bg-red-100 text-red-800";
  else if (s === "DRAFT") colorClass = "bg-slate-100 text-slate-700";

  return <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${colorClass}`}>{s}</span>;
}

export default function AdminFilingsPage() {
  const [tab, setTab] = useState("patent"); // "patent" | "non-patent"
  const [patentFilings, setPatentFilings] = useState([]);
  const [nonPatentFilings, setNonPatentFilings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [filingTypeFilter, setFilingTypeFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [page, setPage] = useState(0);
  const [patentMeta, setPatentMeta] = useState({ totalPages: 0, totalElements: 0 });
  const [nonPatentMeta, setNonPatentMeta] = useState({ totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [estimationInput, setEstimationInput] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError("");

    const [patentRes, nonPatentRes, agentsRes] = await Promise.all([
      getAdminPatentFilings({
        status: statusFilter || undefined,
        search: searchFilter || undefined,
        page,
        size: PAGE_SIZE,
      }),
      getAdminNonPatentFilings({
        status: statusFilter || undefined,
        filingType: filingTypeFilter || undefined,
        search: searchFilter || undefined,
        page,
        size: PAGE_SIZE,
      }),
      getAdminAgents(),
    ]);

    if (!patentRes.ok) setError(patentRes.data?.message || "Unable to load patent filings.");
    setPatentFilings(patentRes.items || []);
    setPatentMeta({ totalPages: patentRes.pagination?.totalPages ?? 0, totalElements: patentRes.pagination?.totalElements ?? 0 });

    if (!nonPatentRes.ok) setError((prev) => prev || nonPatentRes.data?.message || "Unable to load non-patent filings.");
    setNonPatentFilings(nonPatentRes.items || []);
    setNonPatentMeta({ totalPages: nonPatentRes.pagination?.totalPages ?? 0, totalElements: nonPatentRes.pagination?.totalElements ?? 0 });

    setAgents(agentsRes.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, filingTypeFilter, searchFilter, page]);

  const resetFilters = () => {
    setStatusFilter("");
    setFilingTypeFilter("");
    setSearchFilter("");
    setPage(0);
  };

  const handlePatentAssign = async (filingId, agentId) => {
    if (!agentId) return;
    setBusyId(filingId);
    const res = await assignAdminPatentFiling(filingId, agentId);
    if (!res.ok) setError(res.data?.message || "Failed to assign agent.");
    else await loadData();
    setBusyId("");
  };

  const handleNonPatentAssign = async (filingId, agentId) => {
    if (!agentId) return;
    setBusyId(filingId);
    const res = await assignAdminNonPatentFiling(filingId, agentId);
    if (!res.ok) setError(res.data?.message || "Failed to assign agent.");
    else await loadData();
    setBusyId("");
  };

  const handlePatentStatus = async (filingId, status) => {
    if (!status) return;
    setBusyId(filingId);
    const res = await updateAdminPatentFilingStatus(filingId, status);
    if (!res.ok) setError(res.data?.message || "Failed to update status.");
    else await loadData();
    setBusyId("");
  };

  const handleNonPatentStatus = async (filingId, status) => {
    if (!status) return;
    setBusyId(filingId);
    const res = await updateAdminNonPatentFilingStatus(filingId, status);
    if (!res.ok) setError(res.data?.message || "Failed to update status.");
    else await loadData();
    setBusyId("");
  };

  const handleSetEstimation = async (filingId) => {
    const val = estimationInput[filingId];
    if (val === undefined || val === "") return;
    setBusyId(filingId);
    const res = await setAdminPatentFilingEstimation(filingId, Number(val));
    if (!res.ok) setError(res.data?.message || "Failed to set estimation.");
    else await loadData();
    setBusyId("");
  };

  const meta = tab === "patent" ? patentMeta : nonPatentMeta;
  const filings = tab === "patent" ? patentFilings : nonPatentFilings;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243a]">All Filings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Browse and manage patent and non-patent filings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[["patent", "Patent Filings"], ["non-patent", "Non-Patent Filings"]].map(([value, label]) => (
          <button
            key={value}
            onClick={() => { setTab(value); setPage(0); }}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              tab === value ? "border-[#10243a] text-[#10243a]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
        >
          <option value="">All statuses</option>
          {["DRAFT", "PENDING", "IN_REVIEW", "APPROVED", "REJECTED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {tab === "non-patent" && (
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={filingTypeFilter}
            onChange={(e) => { setFilingTypeFilter(e.target.value); setPage(0); }}
          >
            <option value="">All types</option>
            {NON_PATENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}

        <input
          type="text"
          placeholder={tab === "patent" ? "Search title, ref, applicant…" : "Search ref or identifier…"}
          value={searchFilter}
          onChange={(e) => { setSearchFilter(e.target.value); setPage(0); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2"
        />

        <button onClick={resetFilters} className="border border-gray-200 text-gray-600 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
          Clear
        </button>

        <button onClick={loadData} className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors">
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Patent filings table */}
      {tab === "patent" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Reference", "Title", "Status", "Applicant", "Assigned Agent", "Assign Agent", "Update Status", "Estimation (₹)", "Submitted"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">Loading patent filings...</td></tr>}
              {!loading && patentFilings.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{item.referenceNumber || item.id || "-"}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{item.title || "Untitled"}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-4 text-xs text-gray-600">{item.applicantName || "-"}</td>
                  <td className="px-5 py-4 text-xs text-gray-600">{item.assignedAgentName || item.assignedAgentId || <span className="italic text-gray-400">Unassigned</span>}</td>
                  <td className="px-5 py-4">
                    <select
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => handlePatentAssign(item.id, e.target.value)}
                      disabled={busyId === item.id}
                    >
                      <option value="">Select agent</option>
                      {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => handlePatentStatus(item.id, e.target.value)}
                      disabled={busyId === item.id || item.status === "DRAFT"}
                    >
                      <option value="">Update status</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        placeholder={item.estimation != null ? String(item.estimation) : "—"}
                        value={estimationInput[item.id] ?? ""}
                        onChange={(e) => setEstimationInput((prev) => ({ ...prev, [item.id]: e.target.value }))}
                        className="border border-gray-200 rounded-md px-2 py-1 text-xs w-20"
                        disabled={busyId === item.id}
                      />
                      <button
                        onClick={() => handleSetEstimation(item.id)}
                        className="text-xs bg-[#10243a] text-white rounded-md px-2 py-1 hover:bg-[#1a3655] disabled:opacity-40 transition-colors"
                        disabled={busyId === item.id || !estimationInput[item.id]}
                      >
                        Set
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{formatDate(item.submittedAt)}</td>
                </tr>
              ))}
              {!loading && patentFilings.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No patent filings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Non-patent filings table */}
      {tab === "non-patent" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Reference", "Type", "Status", "Assigned Agent", "Assign Agent", "Update Status", "Submitted"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">Loading non-patent filings...</td></tr>}
              {!loading && nonPatentFilings.map((item) => (
                <tr key={item.id} className="border-b border-gray-50">
                  <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{item.referenceNumber || item.id || "-"}</td>
                  <td className="px-5 py-4 text-xs text-gray-600">{item.type || "-"}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-4 text-xs text-gray-600">{item.assignedAgentName || item.assignedAgentId || <span className="italic text-gray-400">Unassigned</span>}</td>
                  <td className="px-5 py-4">
                    <select
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => handleNonPatentAssign(item.id, e.target.value)}
                      disabled={busyId === item.id}
                    >
                      <option value="">Select agent</option>
                      {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                      defaultValue=""
                      onChange={(e) => handleNonPatentStatus(item.id, e.target.value)}
                      disabled={busyId === item.id || item.status === "DRAFT"}
                    >
                      <option value="">Update status</option>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{formatDate(item.submittedAt)}</td>
                </tr>
              ))}
              {!loading && nonPatentFilings.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">No non-patent filings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Total: {meta.totalElements}</p>
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
