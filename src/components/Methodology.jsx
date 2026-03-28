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
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-6 shadow-sm border border-gray-100">
            <span className="material-symbols-outlined text-sm text-blue-500">route</span>
            <span className="text-xs font-bold text-gray-700 tracking-wide uppercase">Methodology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
            The path to protection
          </h2>
          <p className="text-gray-500 text-lg font-medium tracking-tight">
            A structured, intelligent path from your raw invention to a granted patent.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative bg-white rounded-3xl p-8 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                 <div
                   className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors
                     ${step.active
                       ? "bg-blue-600 text-white"
                       : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                     }`}
                 >
                   {step.num}
                 </div>
                 <h3 className="font-bold text-xl text-slate-900 tracking-tight">
                   {step.title}
                 </h3>
              </div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed pl-14">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
