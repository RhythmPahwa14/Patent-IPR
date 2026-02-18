"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const caseData = {
  "US-10294-A": {
    id: "US-10294-A", title: "AI-Driven Sorting System", type: "PATENT APPLICATION",
    status: "ACTIVE CASE", filedDate: "Oct 12, 2023", jurisdiction: "USPTO (USA)",
    priorityDate: "Oct 10, 2022", publicationDate: "Apr 15, 2023", pctFiling: "PCT/US2022/10294",
    attorney: { name: "Sarah Vance", role: "Senior Patent Counsel" },
    daysActive: 98, documents: 14,
    progression: [
      { label: "Application Filed", desc: "Initial submission and formal verification", date: "Oct 12, 2023", status: "completed" },
      { label: "Examination Phase", desc: "Technical review of patentability claims", date: "Dec 04, 2023", status: "completed" },
      { label: "FER Issued", desc: "First Examination Report currently under review", date: "Jan 18, 2024", status: "in-review", alert: "Response due by Feb 28, 2024" },
      { label: "Scheduled Hearing", desc: "Oral proceedings with the controller", date: "TBD", status: "pending" },
      { label: "Final Grant", desc: "Issue of Letters Patent and Certificate", date: "TBD", status: "pending" },
    ],
    docs: [
      { name: "First_Examination_Report_2024.pdf", type: "PDF", size: "2.1 MB" },
      { name: "Application_Draft_v3.docx", type: "DOC", size: "1.4 MB" },
      { name: "Prior_Art_Search.pdf", type: "PDF", size: "3.8 MB" },
    ],
  },
};

const fallback = {
  id: "", title: "Case Details", type: "PATENT APPLICATION", status: "ACTIVE CASE",
  filedDate: "N/A", jurisdiction: "N/A", priorityDate: "N/A", publicationDate: "N/A", pctFiling: "N/A",
  attorney: { name: "Sarah Vance", role: "Senior Patent Counsel" },
  daysActive: 0, documents: 0,
  progression: [
    { label: "Application Filed", desc: "Initial submission and formal verification", date: "N/A", status: "completed" },
    { label: "Examination Phase", desc: "Technical review of patentability claims", date: "N/A", status: "pending" },
    { label: "FER Issued", desc: "First Examination Report currently under review", date: "N/A", status: "pending" },
    { label: "Scheduled Hearing", desc: "Oral proceedings with the controller", date: "TBD", status: "pending" },
    { label: "Final Grant", desc: "Issue of Letters Patent and Certificate", date: "TBD", status: "pending" },
  ],
  docs: [],
};

export default function CaseDetailPage() {
  const { id } = useParams();
  const c = caseData[id] ?? { ...fallback, id, title: id };

  const StepIcon = ({ status }) => {
    if (status === "completed") return <div className="w-6 h-6 rounded-full bg-[#0d1b2a] flex items-center justify-center"><span className="material-symbols-outlined text-white text-sm">check</span></div>;
    if (status === "in-review") return <div className="w-6 h-6 rounded-full border-2 border-[#f5a623] bg-white flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-[#f5a623]" /></div>;
    return <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-white" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/dashboard/cases" className="hover:text-[#0d1b2a] transition-colors">Cases</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-[#0d1b2a] font-medium">Case ID: {c.id}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-widest text-[#f5a623] border border-[#f5a623]/30 px-2 py-0.5 rounded">{c.status}</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{c.type}</span>
            </div>
            <h1 className="text-xl font-bold text-[#0d1b2a]">{c.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">tag</span>{c.id}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>{c.filedDate}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">language</span>{c.jurisdiction}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="flex items-center gap-2 bg-[#0d1b2a] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors">
              <span className="material-symbols-outlined text-sm">download</span> Download Certificate
            </button>
            <button className="flex items-center gap-2 border border-gray-200 text-[#0d1b2a] text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              Action Needed
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Progression + Docs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Case Progression */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-[#0d1b2a] mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f5a623] text-xl">show_chart</span>
              Case Progression
            </h2>
            <div className="relative">
              {c.progression.map((step, i) => (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <StepIcon status={step.status} />
                    {i < c.progression.length - 1 && <div className={`w-0.5 flex-1 my-1 min-h-[2rem] ${step.status === "completed" ? "bg-[#0d1b2a]" : "bg-gray-200"}`} />}
                  </div>
                  <div className="pb-6 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-semibold ${step.status === "pending" ? "text-gray-400" : "text-[#0d1b2a]"}`}>{step.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                        {step.alert && (
                          <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                            <span className="material-symbols-outlined text-amber-500 text-sm">info</span>
                            <span className="text-xs text-amber-700 font-medium">{step.alert}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-medium text-gray-500">{step.date}</p>
                        <p className={`text-[10px] font-bold tracking-wider mt-0.5 uppercase ${step.status === "completed" ? "text-green-600" : step.status === "in-review" ? "text-amber-500" : "text-gray-300"}`}>
                          {step.status === "completed" ? "Completed" : step.status === "in-review" ? "In Review" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Repository */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#0d1b2a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f5a623] text-xl">folder</span>
                Document Repository
              </h2>
              <button className="text-xs font-semibold text-[#f5a623] hover:underline">View All Files</button>
            </div>
            <div className="space-y-3">
              {c.docs.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-[10px] font-bold text-red-500">{doc.type}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0d1b2a]">{doc.name}</p>
                      <p className="text-[10px] text-gray-400">{doc.size}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-[#0d1b2a] transition-colors">
                    <span className="material-symbols-outlined text-base">download</span>
                  </button>
                </div>
              ))}
              {c.docs.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No documents yet.</p>}
            </div>
          </div>
        </div>

        {/* Right: Priority Info + Attorney + Stats */}
        <div className="space-y-5">
          {/* Priority Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Priority Information</h3>
            <div className="space-y-3">
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">Priority Date</p><p className="text-sm font-semibold text-[#0d1b2a] mt-0.5">{c.priorityDate}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">Publication Date</p><p className="text-sm font-semibold text-[#0d1b2a] mt-0.5">{c.publicationDate}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wider">International Filing (PCT)</p><p className="text-sm font-semibold text-[#0d1b2a] mt-0.5">{c.pctFiling}</p></div>
            </div>
          </div>

          {/* Assigned Attorney */}
          <div className="bg-[#0d1b2a] rounded-xl p-5 text-white">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4">Assigned Attorney</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#f5a623]/20 border-2 border-[#f5a623] flex items-center justify-center text-[#f5a623] font-bold text-sm">
                {c.attorney.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold">{c.attorney.name}</p>
                <p className="text-xs text-white/50">{c.attorney.role}</p>
              </div>
            </div>
            <Link href="/dashboard/messages" className="flex items-center justify-center gap-2 w-full bg-[#f5a623] text-[#0d1b2a] text-xs font-bold py-2.5 rounded-lg hover:bg-[#e09610] transition-colors mb-2">
              <span className="material-symbols-outlined text-sm">mail</span> Message Attorney
            </Link>
            <button className="flex items-center justify-center gap-2 w-full border border-white/20 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-sm">schedule</span> Schedule Call
            </button>
          </div>

          {/* Case Stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Case Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-[#0d1b2a]">{c.daysActive}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Days Active</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-[#0d1b2a]">{c.documents}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
