"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getAdminPatentFilingById, getAdminNonPatentFilingById } from "@/lib/api";

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

export default function AdminFilingDetail({ params, searchParams }) {
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const unwrappedSearchParams = searchParams instanceof Promise ? use(searchParams) : searchParams;
  
  const id = unwrappedParams.id;
  const type = unwrappedSearchParams.type || "patent";
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filing, setFiling] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFiling() {
      setLoading(true);
      setError("");
      try {
        let res;
        if (type === "patent") {
          res = await getAdminPatentFilingById(id);
        } else {
          res = await getAdminNonPatentFilingById(id);
        }
        
        if (!res.ok) {
          setError(res.data?.message || "Failed to load filing details.");
        } else {
          setFiling(res.filing);
        }
      } catch (err) {
        setError("Error loading filing details.");
      } finally {
        setLoading(false);
      }
    }
    loadFiling();
  }, [id, type]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading filing details...</div>;
  }

  if (error || !filing) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error || "Filing not found."}</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-[#10243a] text-white rounded-lg hover:bg-[#1a3655] text-sm font-semibold transition-colors">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
        <button onClick={() => router.back()} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-gray-600">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#10243a]">Filing Detail</h1>
          <p className="text-sm text-gray-500 mt-0.5">Reference: {filing.referenceNumber || filing.id || "-"}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#10243a] mb-2">{filing.title || "Untitled"}</h2>
            <StatusBadge status={filing.status} />
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Type</p>
            <p className="text-sm font-bold text-[#10243a] uppercase">{type}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-widest text-[#f5a623] uppercase border-b border-gray-100 pb-2">Applicant Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Name</p>
                <p className="font-semibold text-sm text-[#10243a]">{filing.applicantName || filing.client?.name || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Email</p>
                <p className="font-semibold text-sm text-[#10243a] truncate">{filing.applicantEmail || filing.client?.email || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Mobile</p>
                <p className="font-semibold text-sm text-[#10243a]">{filing.applicantMobile || filing.client?.mobile || "-"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-widest text-[#f5a623] uppercase border-b border-gray-100 pb-2">Filing Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Category / Class</p>
                <p className="font-semibold text-sm text-[#10243a]">{filing.type || filing.fieldOfInvention || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Notes / Other</p>
                <p className="font-semibold text-sm text-[#10243a] truncate">{filing.fieldOfInventionOther || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Assigned Agent</p>
                <p className="font-semibold text-sm text-[#10243a]">{filing.assignedAgentName || filing.assignedAgentId || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-100">
             <h3 className="text-[11px] font-bold tracking-widest text-[#f5a623] uppercase border-b border-gray-100 pb-2">Abstract / Description</h3>
             <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                   {filing.abstractText || filing.description || "No description provided."}
                </p>
             </div>
        </div>

        {filing.supportingDocumentUrl && (
             <div className="pt-6 border-t border-gray-100">
                 <h3 className="text-[11px] font-bold tracking-widest text-gray-400 uppercase pb-3">Supporting Document</h3>
                 <a href={filing.supportingDocumentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#10243a] text-white rounded-xl hover:bg-[#1a3655] shadow-md transition-colors text-sm font-semibold hover:-translate-y-0.5 duration-200">
                     <span className="material-symbols-outlined text-[20px]">description</span>
                     View Attached Document
                 </a>
             </div>
        )}
      </div>
    </div>
  );
}
