const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Interactive Case Timeline",
    desc: "Track every stage from Drafting to Grant with automated status updates.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    title: "Direct Messaging Hub",
    desc: "Communicate securely with your designated attorneys and paralegals.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
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
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f5a623] block mb-4">
            The Platform
          </span>
          <h2 className="text-4xl font-black text-[#0d1b2a] leading-tight mb-6">
            Smart Case Tracking &amp; Workflow
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-10">
            Our SaaS portal provides a real-time window into your legal
            processes. Stop guessing the status of your filings and start
            managing them with data-driven insights.
          </p>

          <div className="flex flex-col gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#f0f4f0] rounded-xl flex items-center justify-center text-[#4a7c59] shrink-0">
                  {f.icon}
                </div>
                <div>
                  <div className="font-bold text-[#0d1b2a] text-sm mb-1">{f.title}</div>
                  <div className="text-gray-500 text-sm leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Dashboard mockup */}
        <div className="relative">
          <div className="bg-[#0d1b2a] rounded-2xl shadow-2xl p-5 text-white">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Patent Application</div>
                <div className="text-base font-bold">AI Neural Network Optimizer</div>
              </div>
              <div className="bg-[#f5a623] text-[#0d1b2a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Under Review
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Filing Date</div>
                <div className="font-bold text-sm">Oct 24, 2023</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Est. Asset Value</div>
                <div className="font-bold text-sm text-[#f5a623]">$1.6M</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-1 mb-5">
              {["Draft", "Filed", "Exam", "Review", "Grant"].map((step, i) => (
                <div key={step} className="flex items-center gap-1 flex-1">
                  <div className={`h-1.5 flex-1 rounded-full ${i <= 2 ? "bg-[#f5a623]" : "bg-white/10"}`} />
                  {i === 4 && (
                    <div className={`w-3 h-3 rounded-full border-2 ${i <= 2 ? "border-[#f5a623] bg-[#f5a623]" : "border-white/20"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Messages */}
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Messages</div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4a7c59] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  JA
                </div>
                <div>
                  <div className="text-xs font-semibold mb-0.5">Jennifer (Attorney)</div>
                  <div className="text-gray-400 text-xs">Your application is moving to final review stage...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
