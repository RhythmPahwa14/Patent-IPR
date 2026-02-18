"use client";

const timelineEvents = [
  { date: "Feb 28, 2024", case: "US-11582-X", title: "FER Response Deadline", type: "DEADLINE", typeColor: "bg-red-100 text-red-600", urgent: true },
  { date: "Jan 18, 2024", case: "US-10294-A", title: "First Examination Report Issued", type: "MILESTONE", typeColor: "bg-amber-100 text-amber-700", urgent: false },
  { date: "Dec 04, 2023", case: "US-10294-A", title: "Examination Phase Completed", type: "COMPLETED", typeColor: "bg-green-100 text-green-700", urgent: false },
  { date: "Nov 15, 2023", case: "US-9921-A", title: "Prior Art Search Received", type: "DOCUMENT", typeColor: "bg-blue-100 text-blue-600", urgent: false },
  { date: "Nov 04, 2023", case: "EU-22019-B", title: "Application Filing Confirmed", type: "COMPLETED", typeColor: "bg-green-100 text-green-700", urgent: false },
  { date: "Oct 29, 2023", case: "US-11582-X", title: "Examination Phase Started", type: "MILESTONE", typeColor: "bg-amber-100 text-amber-700", urgent: false },
  { date: "Oct 15, 2023", case: "CN-48921-C", title: "FER Issued — Response Required", type: "ACTION", typeColor: "bg-purple-100 text-purple-600", urgent: false },
  { date: "Oct 12, 2023", case: "US-10294-A", title: "Patent Application Filed", type: "COMPLETED", typeColor: "bg-green-100 text-green-700", urgent: false },
  { date: "Sep 20, 2023", case: "JP-99231-K", title: "Application Rejected — Appeal Filed", type: "REJECTED", typeColor: "bg-red-100 text-red-600", urgent: false },
];

export default function TimelinePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Case Timeline</h1>
        <p className="text-sm text-gray-500 mt-0.5">Chronological view of events across all your cases.</p>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
        <div className="space-y-1">
          {timelineEvents.map((e, i) => (
            <div key={i} className="flex gap-5 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${e.urgent ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}>
                <span className={`material-symbols-outlined text-sm ${e.urgent ? "text-red-500" : "text-gray-400"}`}>
                  {e.type === "DEADLINE" ? "schedule" : e.type === "COMPLETED" ? "check_circle" : e.type === "DOCUMENT" ? "description" : e.type === "REJECTED" ? "cancel" : "flag"}
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
        </div>
      </div>
    </div>
  );
}
