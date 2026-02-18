const trustItems = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Encrypted Security",
    desc: "Bank-grade AES-256 encryption for all your sensitive patent docs and documents.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
    title: "Legal Expertise",
    desc: "Backed by senior attorneys with decades of experience in diverse technology sectors.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
      </svg>
    ),
    title: "Transparent Pricing",
    desc: "Fixed-fee models with no hidden hourly charges for filing and prosecution.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Global Network",
    desc: "Direct filing capabilities in 150+ countries via PCT and Madrid systems.",
  },
];

const industries = [
  { icon: "💻", label: "IT & Software" },
  { icon: "⚙️", label: "Mechanical" },
  { icon: "💊", label: "Pharma" },
  { icon: "🚀", label: "Startups" },
];

export default function WhyTrust() {
  return (
    <section className="py-24 bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
        {/* Left: Trust items */}
        <div>
          <h2 className="text-4xl font-black text-white mb-12">
            Why Trust PATENT-IPR?
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {trustItems.map((item) => (
              <div key={item.title}>
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-[#f5a623] mb-4">
                  {item.icon}
                </div>
                <div className="font-bold text-white text-sm mb-2">{item.title}</div>
                <div className="text-gray-400 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Industries card
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="font-bold text-white text-lg mb-6">Industries We Empower</h3>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {industries.map((ind) => (
              <div
                key={ind.label}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <span className="text-xl">{ind.icon}</span>
                <span className="text-white text-sm font-semibold">{ind.label}</span>
              </div>
            ))}
          </div> */}

          {/* Testimonial */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-gray-300 text-sm leading-relaxed italic mb-4">
              &ldquo;The only platform that understood our deep-tech requirements while keeping the legal process human.&rdquo;
            </p>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              — CTO, MedTech Innovations
            </div>
          </div>
        </div>
    </section>
  );
}
