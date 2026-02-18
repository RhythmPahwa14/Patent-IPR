const steps = [
  {
    num: "01",
    title: "Consultation",
    desc: "Initial assessment of IP potential.",
    active: true,
  },
  {
    num: "02",
    title: "Invention Review",
    desc: "Technical deep-dive into the idea.",
    active: false,
  },
  {
    num: "03",
    title: "IP Search",
    desc: "Comprehensive prior-art global search.",
    active: false,
  },
  {
    num: "04",
    title: "Drafting",
    desc: "Precise legal & technical specification.",
    active: false,
  },
  {
    num: "05",
    title: "Examination",
    desc: "Handling of office actions/objections.",
    active: false,
  },
  {
    num: "06",
    title: "Grant",
    desc: "Successful registration & certification.",
    active: true,
  },
];

export default function Methodology() {
  return (
    <section className="py-24 bg-[#f3f4f6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#0d1b2a] mb-4">
            Our Methodology
          </h2>
          <p className="text-gray-500 text-base">
            A structured path from your raw invention to a granted patent
            certificate.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative bg-white rounded-2xl pt-0 pb-7 px-5 shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Top accent bar */}
              <div
                className={`h-1 w-full mb-7 ${
                  step.active ? "bg-[#f5a623]" : "bg-gray-200"
                }`}
              />

              {/* Number circle */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold mb-5 ${
                  step.num === "01"
                    ? "bg-[#0d1b2a] text-white"
                    : step.num === "06"
                    ? "bg-[#f5a623] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.num}
              </div>

              <h3 className="font-bold text-[#0d1b2a] text-sm mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
