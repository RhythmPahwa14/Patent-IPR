import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#e0eaf3] to-[#f8f9fa] shadow-[inset_0_40px_100px_rgba(30,58,138,0.03)] pt-32 pb-24 md:pt-20 md:pb-40 px-6 overflow-hidden border-b border-[#e0eaf3]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          <div className="mb-6">
          </div>

          <h1 className="text-[56px] sm:text-[72px] xl:text-[88px] font-medium text-[#1a1a1a] tracking-tight leading-[1.05] mb-8">
            Smart IP Management <br /> Not Paperwork.
          </h1>

          <p className="text-[#4b5563] text-[18px] md:text-[22px] font-normal tracking-tight mb-12 max-w-[540px] leading-relaxed">
            File, manage, and protect your patents, trademarks, and copyrights - all in one platform.
            Built for innovators, startups, and enterprises.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 w-full sm:w-auto">
            <Link
              href="/signup"
              className="bg-[#1a3d54] text-white text-[14px] font-medium px-8 py-3.5 rounded-full uppercase tracking-widest hover:bg-[#112a3c] hover:-translate-y-0.5 transition-all shadow-xl shadow-[#1a3d54]/20"
            >
              Portal login
            </Link>
            <Link
              href="#contact"
              className="flex items-center gap-3 border-l-2 border-[#1a3d54] pl-5 text-[#1a3d54] text-[15px] font-bold hover:opacity-75 transition-opacity"
            >
              Book a meeting
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative w-full h-[400px] md:h-[600px] flex items-center justify-center pointer-events-none mt-10 lg:mt-0">
           {/* Abstract 3D graphic representation simulating Delcap's flowing assets */}
           <div className="absolute right-[-30%] top-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-gradient-to-bl from-[#1a3d54]/10 to-transparent rounded-full blur-[80px] opacity-70"></div>
           
           <div className="absolute right-[-15%] top-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-gradient-to-br from-[#ffffff] to-[#eef2f6] rounded-[3rem] rotate-12 shadow-[0_40px_100px_rgba(26,61,84,0.15)] border border-white/60 backdrop-blur-md overflow-hidden flex flex-col hover:rotate-[10deg] transition-all duration-700">
              <div className="w-full h-1/3 border-b border-[#e0eaf3] bg-gradient-to-b from-white/80 to-transparent p-8 flex flex-col gap-4">
                 <div className="w-1/2 h-3 bg-[#1a3d54]/10 rounded-full"></div>
                 <div className="w-3/4 h-8 bg-[#1a3d54]/90 rounded-full"></div>
              </div>
              <div className="w-full flex-1 p-8 flex flex-col gap-6 relative">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a3d5408_1px,transparent_1px),linear-gradient(to_bottom,#1a3d5408_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                 <div className="w-full h-24 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#e0eaf3] relative z-10 flex items-center px-6">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center border border-green-100 mr-4">
                        <span className="material-symbols-outlined text-green-500">task_alt</span>
                    </div>
                    <div>
                        <div className="h-2 w-16 bg-[#1a3d54]/20 rounded-full mb-2"></div>
                        <div className="h-3 w-32 bg-[#1a3d54]/60 rounded-full"></div>
                    </div>
                 </div>
                 <div className="w-full h-24 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#e0eaf3] relative z-10 flex items-center px-6 opacity-70">
                    <div className="w-12 h-12 rounded-full bg-[#1a3d54]/5 flex items-center justify-center border border-[#1a3d54]/10 mr-4">
                        <span className="material-symbols-outlined text-[#1a3d54]/40">sync</span>
                    </div>
                    <div>
                        <div className="h-2 w-20 bg-[#1a3d54]/20 rounded-full mb-2"></div>
                        <div className="h-3 w-40 bg-[#1a3d54]/40 rounded-full"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
