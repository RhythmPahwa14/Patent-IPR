"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

const STATUS_STYLES = {
  DRAFT: "text-gray-700 border-gray-300 bg-gray-100",
  PENDING: "text-amber-700 border-amber-300 bg-amber-100",
  APPROVED: "text-green-700 border-green-300 bg-green-100",
  REJECTED: "text-red-700 border-red-300 bg-red-100",
};

function formatDate(value) {
  if (!value) return "N/A";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "N/A";
  return dt.toLocaleString();
}

export default function CaseDetailPage() {
  const { id } = useParams();
  const referenceNumber = decodeURIComponent(id || "");

  const [filing, setFiling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCase = async () => {
      if (!referenceNumber) {
        setLoading(false);
        setError("Invalid reference number.");
        return;
      }

      setLoading(true);
      setError("");
      const result = await apiRequest(`/api/v1/patents/${encodeURIComponent(referenceNumber)}`);

      if (!result.ok) {
        setError(result.data?.message || "Unable to load patent details.");
        setFiling(null);
        setLoading(false);
        return;
      }

      setFiling(result.data?.data || null);
      setLoading(false);
    };

    loadCase();
  }, [referenceNumber]);

  const statusClass = STATUS_STYLES[filing?.status] || "text-gray-700 border-gray-300 bg-gray-100";

  const milestones = useMemo(() => {
    if (!filing) return [];

    const base = [
      {
        label: "Draft Created",
        date: filing.updatedAt || filing.submittedAt,
        state: filing.status === "DRAFT" ? "active" : "done",
      },
      {
        label: "Submitted",
        date: filing.submittedAt,
        state: filing.status === "DRAFT" ? "pending" : "done",
      },
      {
        label: "Review Decision",
        date: filing.updatedAt,
        state: filing.status === "PENDING" ? "active" : filing.status === "APPROVED" || filing.status === "REJECTED" ? "done" : "pending",
      },
    ];

    return base;
  }, [filing]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 text-sm text-gray-500">Loading case details...</div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Link href="/dashboard/cases" className="text-sm text-[#0d1b2a] hover:underline">Back to cases</Link>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!filing) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Link href="/dashboard/cases" className="text-sm text-[#0d1b2a] hover:underline">Back to cases</Link>
        <p className="text-sm text-gray-500">No details found for this filing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/dashboard/cases" className="hover:text-[#0d1b2a] transition-colors">Cases</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[#0d1b2a] font-medium">{filing.referenceNumber || referenceNumber}</span>
      </div>

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
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">tag</span>{filing.referenceNumber || "-"}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">fingerprint</span>{filing.patentId || "-"}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>{formatDate(filing.submittedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#0d1b2a] mb-5">Filing Progress</h2>
            <div className="space-y-3">
              {milestones.map((step) => (
                <div key={step.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <p className="text-sm font-medium text-[#0d1b2a]">{step.label}</p>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDate(step.date)}</p>
                    <p className={`text-[10px] font-bold tracking-wider uppercase ${step.state === "done" ? "text-green-600" : step.state === "active" ? "text-amber-600" : "text-gray-300"}`}>
                      {step.state === "done" ? "Completed" : step.state === "active" ? "In Progress" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Invention Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Field of Invention</p>
                <p className="text-sm font-semibold text-[#0d1b2a] mt-0.5">{filing.fieldOfInvention || "-"}</p>
              </div>
              {filing.fieldOfInventionOther && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Other Field</p>
                  <p className="text-sm font-semibold text-[#0d1b2a] mt-0.5">{filing.fieldOfInventionOther}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Updated At</p>
                <p className="text-sm font-semibold text-[#0d1b2a] mt-0.5">{formatDate(filing.updatedAt)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Abstract</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{filing.abstractText || "No abstract available."}</p>
          </div>

          <div className="bg-[#0d1b2a] rounded-xl p-5 text-white">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-3">Document</p>
            {filing.supportingDocumentUrl ? (
              <a
                href={filing.supportingDocumentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#f5a623] text-[#0d1b2a] text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#e09610] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Open Supporting Document
              </a>
            ) : (
              <p className="text-xs text-white/70">No supporting document URL available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
