const steps = [
  {
    num: "1",
    title: "Consultation",
    desc: "Initial assessment of IP potential.",
    active: true,
  },
  {
    num: "2",
    title: "Invention Review",
    desc: "Technical deep-dive into the idea.",
    active: false,
  },
  {
    num: "3",
    title: "IP Search",
    desc: "Comprehensive prior-art global search.",
    active: false,
  },
  {
    num: "4",
    title: "Drafting",
    desc: "Precise legal & technical specification.",
    active: false,
  },
  {
    num: "5",
    title: "Examination",
    desc: "Handling of office actions/objections.",
    active: false,
  },
  {
    num: "6",
    title: "Grant",
    desc: "Successful registration & certification.",
    active: true,
  },
];

export default function Methodology() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
           <div className="flex-1">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e0eaf3] rounded-full mb-6 shadow-sm">
               <span className="text-[11px] font-bold text-[#1a3d54] tracking-[0.15em] uppercase">Methodology</span>
             </div>
             <h2 className="text-[44px] md:text-[60px] font-medium text-[#1a1a1a] tracking-tight leading-[1.05]">
               The path <br className="hidden md:block" /> to protection.
             </h2>
           </div>
           <p className="text-[#4b5563] text-[18px] md:text-[20px] font-normal tracking-tight max-w-[400px] leading-relaxed pb-2">
             A structured, immutable timeline from your raw invention to a granted patent asset.
           </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative flex flex-col group"
            >
              <div className="h-0.5 w-full bg-gradient-to-r from-[#1a3d54]/20 to-transparent mb-6"></div>
              <div className="flex items-start gap-5">
                 <div className="text-[16px] font-medium text-[#1a3d54] mt-1 bg-[#1a3d54]/5 w-10 h-10 flex items-center justify-center rounded-full border border-[#1a3d54]/10">
                   {step.num.padStart(2, '0')}
                 </div>
                 <div>
                   <h3 className="text-[20px] font-bold text-[#1a1a1a] tracking-tight mb-2">
                     {step.title}
                   </h3>
                   <p className="text-[#4b5563] text-[16px] leading-relaxed">
                     {step.desc}
                   </p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
