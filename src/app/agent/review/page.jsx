"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAgentPatents, updateAgentPatentStatus } from "@/lib/api";

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

export default function AgentReviewPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState("");
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError("");
      const result = await getAgentPatents();
      if (!result.ok) {
        setError(result.data?.message || "Unable to load review queue.");
        setAssignments([]);
        setLoading(false);
        return;
      }

      setAssignments(result.items || []);
      setLoading(false);
    };

    loadAssignments();
  }, []);

  const queue = useMemo(() => {
    return assignments
      .filter((item) => ["PENDING", "ASSIGNED"].includes(item.status))
      .map((item) => ({
        ...item,
        displayId: item.referenceNumber || item.patentId || item.id,
      }));
  }, [assignments]);

  const handleDecision = async (item, status) => {
    const id = item.patentId || item.id || item.referenceNumber;
    if (!id) return;
    setProcessingId(id);
    const result = await updateAgentPatentStatus(id, status);
    if (!result.ok) {
      setFeedback((prev) => ({
        ...prev,
        [id]: { type: "error", message: result.data?.message || "Unable to update status." },
      }));
      setProcessingId("");
      return;
    }

    setAssignments((prev) =>
      prev.map((entry) => (entry.patentId === id || entry.id === id || entry.referenceNumber === id
        ? { ...entry, status, updatedAt: new Date().toISOString() }
        : entry))
    );
    setFeedback((prev) => ({
      ...prev,
      [id]: { type: "success", message: `Marked as ${status}.` },
    }));
    setProcessingId("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1b2a]">Review Queue</h1>
          <p className="text-sm text-gray-500 mt-0.5">Approve or reject assigned filings from one workspace.</p>
        </div>
        <Link href="/agent/cases" className="text-sm font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">View all cases</Link>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-6 py-3">Case ID</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Title</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Applicant</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Submitted</th>
                <th className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item, i) => (
                <tr key={item.displayId || i} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === queue.length - 1 ? "border-0" : ""}`}>
                  <td className="px-6 py-4 text-xs font-semibold text-[#0d1b2a]">{item.displayId || "-"}</td>
                  <td className="px-4 py-4">
                    <Link href={`/agent/cases/${encodeURIComponent(item.displayId || "")}`} className="font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">
                      {item.title || "Untitled Filing"}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{item.applicantName || "-"}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded tracking-wider ${statusColorMap[item.status] || "bg-gray-100 text-gray-700"}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">{formatDate(item.submittedAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecision(item, "APPROVED")}
                        disabled={processingId === (item.patentId || item.id || item.referenceNumber)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(item, "REJECTED")}
                        disabled={processingId === (item.patentId || item.id || item.referenceNumber)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                    {feedback[item.patentId || item.id || item.referenceNumber] && (
                      <p className={`text-[10px] mt-2 ${feedback[item.patentId || item.id || item.referenceNumber].type === "error" ? "text-red-500" : "text-green-600"}`}>
                        {feedback[item.patentId || item.id || item.referenceNumber].message}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && queue.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No cases awaiting review.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">Loading queue...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}