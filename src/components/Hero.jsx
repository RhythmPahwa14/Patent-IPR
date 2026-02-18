import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="pt-8 pb-20 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d1b2a]">
              Now Monitoring 70+ Assets
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-[#0d1b2a] leading-tight mb-2">
            Protect Your <br />
            Innovation with{" "}
            <span className="text-[#C5A059]">Smart IP</span>
            <br />
            Management
          </h1>

          <p className="text-gray-500 text-base leading-relaxed mb-4 max-w-md">
            End-to-end Patent, Trademark &amp; IP Filing with real-time case
            tracking. Join 1,000+ companies managing their intellectual assets
            globally.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 border-2 border-[#0d1b2a] text-[#0d1b2a] font-semibold px-6 py-3 rounded-md hover:bg-[#0d1b2a] hover:text-white transition-all"
            >
              Get Started
              <span>→</span>
            </Link>
            <Link
              href="#contact"
              className="text-[#0d1b2a] font-semibold px-6 py-3 hover:text-[#f5a623] transition-colors"
            >
              Book a Call
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10">
            <div>
              <div className="text-3xl font-black text-[#0d1b2a]">1000+</div>
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-0.5">
                Files Managed
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <div className="text-3xl font-black text-[#0d1b2a]">95%</div>
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-0.5">
                Success Rate
              </div>
            </div>
          </div>
        </div>

        {/* Right – Device Mockup */}
        <div className="relative flex justify-center">
          <div className="relative w-72 h-96 md:w-80 md:h-[26rem]">
            {/* Green background card */}
            <div className="absolute inset-0 bg-[#4a7c59] rounded-3xl translate-x-6 translate-y-6" />
            {/* White device frame */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full h-full flex items-center justify-center overflow-hidden border border-gray-100">
              {/* Tablet screen content */}
              <div className="w-full h-full bg-gray-50 rounded-3xl p-4 flex flex-col gap-3">
                <div className="h-3 w-20 bg-gray-200 rounded-full" />
                <div className="h-2 w-32 bg-gray-100 rounded-full" />
                <div className="flex-1 bg-white rounded-xl shadow-sm p-3 flex flex-col gap-2">
                  <div className="h-2 w-full bg-gray-100 rounded-full" />
                  <div className="h-2 w-3/4 bg-gray-100 rounded-full" />
                  <div className="h-2 w-1/2 bg-gray-100 rounded-full" />
                  <div className="mt-2 h-16 bg-[#f0f4f8] rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#4a7c59] opacity-60" />
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full" />
                  <div className="h-2 w-2/3 bg-gray-100 rounded-full" />
                </div>
                <div className="h-8 bg-[#0d1b2a] rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
