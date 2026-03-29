const features = [
  {
    icon: (
      <span className="material-symbols-outlined text-[#1a3d54]">timeline</span>
    ),
    title: "Interactive Case Timeline",
    desc: "Track every stage from Drafting to Grant with rigorous status logs.",
  },
  {
    icon: (
      <span className="material-symbols-outlined text-[#1a3d54]">forum</span>
    ),
    title: "Direct Messaging Hub",
    desc: "Communicate securely with designated attorneys on a dedicated channel.",
  },
  {
    icon: (
      <span className="material-symbols-outlined text-[#1a3d54]">request_quote</span>
    ),
    title: "IP Cost Estimator Tool",
    desc: "Get instant, transparent quotes for global PCT filings.",
  },
];

export default function Platform() {
  return (
    <section id="platform" className="bg-[#eef2f6] border-y border-[#e0eaf3] py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e0eaf3] rounded-full mb-6 shadow-sm">
            <span className="text-[11px] font-bold text-[#4b5563] tracking-[0.15em] uppercase">The Platform</span>
          </div>
          <h2 className="text-[44px] md:text-[60px] font-medium text-[#1a1a1a] tracking-tight leading-[1.05] mb-6">
            Intelligent workflow & tracking.
          </h2>
          <p className="text-[#4b5563] text-[18px] md:text-[20px] font-normal tracking-tight max-w-[480px] leading-relaxed mb-12">
            A real-time window into your legal processes. Stop guessing the status of your filings and start managing them with data-driven precision.
          </p>

          <div className="flex flex-col gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-5">
                <div className="w-14 h-14 flex items-center justify-center shrink-0 rounded-2xl bg-white border border-[#e0eaf3] shadow-sm">
                  {f.icon}
                </div>
                <div>
                  <div className="font-bold text-[18px] text-[#1a1a1a] mb-1 tracking-tight">{f.title}</div>
                  <div className="text-[#4b5563] text-[16px] leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Dashboard mockup */}
        <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] border border-[#e0eaf3] shadow-[0_40px_100px_rgba(26,61,84,0.1)] bg-white/80 backdrop-blur-xl flex flex-col hidden md:flex rounded-[3rem] overflow-hidden">
             <div className="h-14 border-b border-[#e0eaf3] bg-gradient-to-b from-white/80 to-transparent flex items-center px-6 gap-3">
                 <div className="w-3 h-3 rounded-full bg-[#1a3d54]/20"></div>
                 <div className="w-3 h-3 rounded-full bg-[#1a3d54]/20"></div>
                 <div className="w-3 h-3 rounded-full bg-[#1a3d54]/20"></div>
                 <div className="ml-auto text-[11px] font-bold text-[#1a3d54]/60 uppercase tracking-widest">Patent-IPR System v2.0</div>
             </div>
             <div className="p-8 flex flex-col gap-6 flex-1 bg-gradient-to-br from-white to-[#f8f9fa]">
                 <div className="flex justify-between items-start border-b border-[#e0eaf3] pb-6">
                     <div>
                         <div className="text-[11px] uppercase tracking-widest text-[#4b5563] font-bold mb-2">Active Object</div>
                         <div className="text-[24px] font-bold text-[#1a1a1a] tracking-tight">AI Neural Network Optimizer</div>
                     </div>
                     <div className="bg-[#1a3d54] text-white text-[11px] font-bold px-4 py-2 uppercase tracking-widest rounded-full shadow-sm">
                         Under Review
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white border border-[#e0eaf3] rounded-2xl shadow-sm p-5">
                         <div className="text-[11px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Filing Date</div>
                         <div className="text-[20px] font-bold text-[#1a1a1a]">Feb 13, 2026</div>
                     </div>
                     <div className="bg-white border border-[#e0eaf3] rounded-2xl shadow-sm p-5">
                         <div className="text-[11px] font-bold text-[#4b5563] uppercase tracking-widest mb-1.5">Asset Value</div>
                         <div className="text-[20px] font-bold text-[#1a1a1a]">INR 1.8L</div>
                     </div>
                 </div>

                 <div className="bg-white border border-[#e0eaf3] rounded-2xl shadow-sm p-6 mt-2 relative overflow-hidden">
                     <div className="flex justify-between items-end relative z-10 w-full mb-3">
                         <div className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-widest">Progress</div>
                         <div className="text-[12px] font-bold text-[#1a3d54] uppercase tracking-widest">60%</div>
                     </div>
                     <div className="w-full h-2 bg-[#e0eaf3] rounded-full relative z-10 overflow-hidden">
                         <div className="w-[60%] h-full bg-[#1a3d54] rounded-full"></div>
                     </div>
                     <div className="flex justify-between mt-5 relative z-10">
                         {["Draft", "Filed", "Exam", "Review", "Grant"].map((step, i) => (
                             <div key={step} className={`text-[11px] font-bold uppercase tracking-widest ${i <= 3 ? "text-[#1a1a1a]" : "text-[#4b5563]/50"}`}>
                                 {step}
                             </div>
                         ))}
                     </div>
                 </div>

                 <div className="bg-white border border-[#e0eaf3] rounded-2xl shadow-sm p-6 flex gap-5 items-start">
                     <div className="w-10 h-10 bg-[#e0eaf3]/50 rounded-full shrink-0 flex items-center justify-center text-[#1a3d54]">
                         <span className="material-symbols-outlined text-[20px]">person</span>
                     </div>
                     <div>
                         <div className="text-[13px] font-bold text-[#1a1a1a] uppercase tracking-widest mb-1.5">Attorney Log</div>
                         <div className="text-[14px] text-[#4b5563] leading-relaxed">
                             Moved to final review stage. No further action needed.
                         </div>
                     </div>
                 </div>
             </div>
        </div>
      </div>
    </section>
  );
}
