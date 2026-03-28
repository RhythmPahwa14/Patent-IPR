const features = [
  {
    icon: (
      <span className="material-symbols-outlined text-blue-500">timeline</span>
    ),
    title: "Interactive Case Timeline",
    desc: "Track every stage from Drafting to Grant with automated status updates.",
  },
  {
    icon: (
      <span className="material-symbols-outlined text-blue-500">forum</span>
    ),
    title: "Direct Messaging Hub",
    desc: "Communicate securely with your designated attorneys and paralegals.",
  },
  {
    icon: (
      <span className="material-symbols-outlined text-blue-500">request_quote</span>
    ),
    title: "IP Cost Estimator Tool",
    desc: "Get instant quotes for PCT filings estimated protocol registrations.",
  },
];

export default function Platform() {
  return (
    <section id="platform" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full mb-6 border border-gray-100">
            <span className="text-xs font-bold text-gray-700 tracking-wide uppercase">The Platform</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight">
            Smart Case Tracking &amp; Workflow
          </h2>
          <p className="text-gray-500 text-lg font-medium tracking-tight mb-10 max-w-lg">
            Our SaaS portal provides a real-time window into your legal processes. Stop guessing the status of your filings and start managing them with data-driven insights.
          </p>

          <div className="flex flex-col gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/50 shadow-sm">
                  {f.icon}
                </div>
                <div>
                  <div className="font-bold text-lg text-slate-900 mb-1">{f.title}</div>
                  <div className="text-gray-500 text-sm font-medium leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Dashboard mockup */}
        <div className="relative">
          <div className="bg-[#f8fafc] border border-gray-100 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-6 text-slate-900 relative z-10 hidden md:block">
            {/* Mockup header */}
            <div className="flex items-center gap-2 mb-6 ml-2">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>

            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Patent Application</div>
                <div className="text-base font-bold text-slate-900">AI Neural Network Optimizer</div>
              </div>
              <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
                Under Review
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-xs font-bold text-gray-500 mb-1">Filing Date</div>
                <div className="font-extrabold text-lg text-slate-900">Feb 13, 2026</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="text-xs font-bold text-gray-500 mb-1">Est. Asset Value</div>
                <div className="font-extrabold text-lg text-blue-600">INR 1.8 Lakh</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
               <div className="flex items-center justify-between w-full relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                  <div className="absolute top-1/2 left-0 w-[75%] h-1 bg-blue-500 -translate-y-1/2 z-0"></div>
                  {["Draft", "Filed", "Exam", "Review", "Grant"].map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-2 z-10">
                      <div className={`w-4 h-4 rounded-full border-4 border-white ${i <= 3 ? "bg-blue-500" : "bg-gray-200"}`} />
                      <div className={`text-[10px] font-bold ${i <= 3 ? "text-slate-900" : "text-gray-400"}`}>{step}</div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-blue-600 text-sm">person</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 mb-1">Attorney Update</div>
                  <div className="text-gray-500 text-xs font-medium leading-relaxed">
                    Your application has moved to the final review stage for the 2026 filing cycle. No further action needed.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative blur behind mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-200/50 blur-[80px] -z-10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
