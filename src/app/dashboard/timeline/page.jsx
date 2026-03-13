"use client";

const timelineEvents = [];

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
          {timelineEvents.length === 0 && (
            <div className="ml-14 bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-400">
              No timeline events available yet. Updates will appear when backend data is synced.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
