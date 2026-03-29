"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAgentPatentFilingById, updateAgentPatentFilingStatus } from "@/lib/api";

const STATUS_STYLES = {
  PENDING: "text-amber-700 border-amber-300 bg-amber-100",
  IN_REVIEW: "text-blue-700 border-blue-300 bg-blue-100",
  APPROVED: "text-green-700 border-green-300 bg-green-100",
  REJECTED: "text-red-700 border-red-300 bg-red-100",
};

const ALLOWED_STATUSES = ["IN_REVIEW", "APPROVED", "REJECTED"];

function formatDate(value) {
  if (!value) return "N/A";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "N/A";
  return dt.toLocaleString();
}

export default function AgentCaseDetailPage() {
  const { id } = useParams();
  const filingId = decodeURIComponent(id || "");

  const [filing, setFiling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agentNote, setAgentNote] = useState("");
  const [actionState, setActionState] = useState({ submitting: false, message: "", type: "" });

  useEffect(() => {
    const loadCase = async () => {
      if (!filingId) {
        setLoading(false);
        setError("Invalid filing ID.");
        return;
      }

      setLoading(true);
      setError("");

      const result = await getAgentPatentFilingById(filingId);
      if (!result.ok) {
        setError(result.data?.message || "Filing not found or not assigned to you.");
        setFiling(null);
        setLoading(false);
        return;
      }

      setFiling(result.filing || null);
      setLoading(false);
    };

    loadCase();
  }, [filingId]);

  const statusClass = STATUS_STYLES[filing?.status] || "text-gray-700 border-gray-300 bg-gray-100";

  const milestones = useMemo(() => {
    if (!filing) return [];
    const s = filing.status;
    return [
      {
        label: "Submitted",
        date: filing.submittedAt,
        state: "done",
      },
      {
        label: "Assigned to Agent",
        date: filing.updatedAt || filing.submittedAt,
        state: s === "PENDING" ? "active" : "done",
      },
      {
        label: "Under Review",
        date: filing.updatedAt,
        state: s === "IN_REVIEW" ? "active" : ["APPROVED", "REJECTED"].includes(s) ? "done" : "pending",
      },
      {
        label: "Decision Logged",
        date: filing.updatedAt,
        state: ["APPROVED", "REJECTED"].includes(s) ? "done" : "pending",
      },
    ];
  }, [filing]);

  const submitDecision = async (status) => {
    if (!filingId) return;
    if (!ALLOWED_STATUSES.includes(status)) {
      setActionState({ submitting: false, message: "Invalid status selection.", type: "error" });
      return;
    }

    setActionState({ submitting: true, message: "", type: "" });
    const result = await updateAgentPatentFilingStatus(filingId, status, agentNote);

    if (!result.ok) {
      const msg =
        result.status === 409
          ? "Cannot update a DRAFT filing."
          : result.data?.message || "Unable to update status.";
      setActionState({ submitting: false, message: msg, type: "error" });
      return;
    }

    setFiling((prev) => (prev ? { ...prev, status, updatedAt: new Date().toISOString() } : prev));
    setActionState({ submitting: false, message: `Filing marked as ${status}.`, type: "success" });
    setAgentNote("");
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto py-10 text-sm text-gray-500">Loading case details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Link href="/agent/cases" className="text-sm text-[#0d1b2a] hover:underline">← Back to cases</Link>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!filing) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Link href="/agent/cases" className="text-sm text-[#0d1b2a] hover:underline">← Back to cases</Link>
        <p className="text-sm text-gray-500">No details found for this filing.</p>
      </div>
    );
  }

  const isDraft = filing.status === "DRAFT";

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/agent/cases" className="hover:text-[#0d1b2a] transition-colors">Assigned Cases</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[#0d1b2a] font-medium">{filing.referenceNumber || filingId}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold tracking-widest border px-2 py-0.5 rounded ${statusClass}`}>
                {filing.status || "-"}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">PATENT FILING</span>
            </div>
            <h1 className="text-xl font-bold text-[#0d1b2a]">{filing.title || "Untitled Filing"}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">tag</span>
                {filing.referenceNumber || "-"}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">fingerprint</span>
                {filing.patentId || filing.id || "-"}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                {formatDate(filing.submittedAt)}
              </span>
            </div>
          </div>

          {/* Decision Panel */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 min-w-[260px]">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Decision Panel</p>
            {isDraft ? (
              <p className="text-xs text-amber-600 mt-2 font-semibold">DRAFT filings cannot be updated.</p>
            ) : (
              <>
                <p className="text-xs text-gray-500 mt-1">Set status for this patent filing.</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => submitDecision("IN_REVIEW")}
                    disabled={actionState.submitting || filing.status === "IN_REVIEW"}
                    className="flex-1 bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-60"
                  >
                    In Review
                  </button>
                  <button
                    onClick={() => submitDecision("APPROVED")}
                    disabled={actionState.submitting}
                    className="flex-1 bg-green-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => submitDecision("REJECTED")}
                    disabled={actionState.submitting}
                    className="flex-1 bg-red-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
                <textarea
                  value={agentNote}
                  onChange={(e) => setAgentNote(e.target.value)}
                  placeholder="Optional agent note..."
                  className="mt-3 w-full text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#0d1b2a]"
                  rows={3}
                />
              </>
            )}
            {actionState.message && (
              <p className={`text-xs mt-2 ${actionState.type === "error" ? "text-red-500" : "text-green-600"}`}>
                {actionState.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#0d1b2a] mb-5">Review Timeline</h2>
            <div className="space-y-3">
              {milestones.map((step) => (
                <div key={step.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <p className="text-sm font-medium text-[#0d1b2a]">{step.label}</p>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(step.date)}</p>
                    <p className={`text-[10px] font-bold tracking-wider uppercase ${
                      step.state === "done" ? "text-green-600" : step.state === "active" ? "text-amber-600" : "text-gray-300"
                    }`}>
                      {step.state === "done" ? "Completed" : step.state === "active" ? "In Progress" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applicant Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#0d1b2a] mb-4">Applicant Details</h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-400">Name:</span> <span className="font-semibold text-[#0d1b2a]">{filing.applicantName || "-"}</span></p>
              <p><span className="text-gray-400">Email:</span> <span className="font-semibold text-[#0d1b2a]">{filing.applicantEmail || "-"}</span></p>
              <p><span className="text-gray-400">Mobile:</span> <span className="font-semibold text-[#0d1b2a]">{filing.applicantMobile || "-"}</span></p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Case Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Case Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Category</p>
                <p className="text-sm font-semibold text-[#0d1b2a] mt-0.5">{filing.fieldOfInvention || "-"}</p>
              </div>
              {filing.fieldOfInventionOther && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Other Field</p>
                  <p className="text-sm font-semibold text-[#0d1b2a] mt-0.5">{filing.fieldOfInventionOther}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Last Updated</p>
                <p className="text-sm font-semibold text-[#0d1b2a] mt-0.5">{formatDate(filing.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Abstract */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Abstract / Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {filing.abstractText || "No description available."}
            </p>
          </div>

          {/* Document */}
          <div className="bg-[#0d1b2a] rounded-xl p-5 text-white">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-3">Supporting Document</p>
            {filing.supportingDocumentUrl ? (
              <a
                href={filing.supportingDocumentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#e0eaf3] text-[#1a3d54] text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#d2deea] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Open Attachment
              </a>
            ) : (
              <p className="text-xs text-white/70">No attachment URL available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}