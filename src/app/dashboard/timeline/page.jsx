"use client";
import { useEffect, useMemo, useState } from "react";
import { getClientPatents } from "@/lib/api";

const STATUS_BADGE = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleString();
}

export default function TimelinePage() {
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTimeline = async () => {
      setLoading(true);
      setError("");
      const result = await getClientPatents({ page: 0, size: 100, sort: "submittedAt,desc" });

      if (!result.ok) {
        setError(result.data?.message || "Unable to load timeline.");
        setFilings([]);
        setLoading(false);
        return;
      }

      setFilings(result.items || []);
      setLoading(false);
    };

    loadTimeline();
  }, []);

  const timelineEvents = useMemo(() => {
    return filings.flatMap((f) => {
      const submitted = f.submittedAt
        ? [{
            id: `${f.referenceNumber}-submitted`,
            title: `Filing submitted: ${f.title || "Untitled Filing"}`,
            case: f.referenceNumber || "-",
            type: "SUBMITTED",
            urgent: false,
            typeColor: "bg-blue-100 text-blue-700",
            date: formatDate(f.submittedAt),
          }]
        : [];

      const status = [{
        id: `${f.referenceNumber}-status`,
        title: `Current status: ${f.status || "UNKNOWN"}`,
        case: f.referenceNumber || "-",
        type: f.status || "STATUS",
        urgent: f.status === "REJECTED",
        typeColor: STATUS_BADGE[f.status] || "bg-gray-100 text-gray-700",
        date: formatDate(f.updatedAt || f.submittedAt),
      }];

      return [...submitted, ...status];
    });
  }, [filings]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Case Timeline</h1>
        <p className="text-sm text-gray-500 mt-0.5">Chronological view of events across all your cases.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
        <div className="space-y-1">
          {timelineEvents.map((e) => (
            <div key={e.id} className="flex gap-5 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${e.urgent ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}>
                <span className={`material-symbols-outlined text-sm ${e.urgent ? "text-red-500" : "text-gray-400"}`}>
                  {e.type === "SUBMITTED" ? "send" : e.type === "APPROVED" ? "check_circle" : e.type === "REJECTED" ? "cancel" : "flag"}
                </span>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex-1 mb-3 hover:border-gray-200 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0d1b2a]">{e.title}</p>
                    <p className="text-xs font-bold text-[#f5a623] mt-0.5">{e.case}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-[9px] font-bold tracking-wider px-2 py-0.5 rounded ${e.typeColor}`}>{e.type}</span>
                    <p className="text-[10px] text-gray-400 mt-1">{e.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && timelineEvents.length === 0 && (
            <div className="ml-14 bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-400">
              No timeline events available yet.
            </div>
          )}
          {loading && (
            <div className="ml-14 bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-400">
              Loading timeline...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
