import Link from "next/link";

// Pre-generate stars array to avoid hydration errors between server and client
const BACKGROUND_STARS = Array.from({ length: 45 }).map((_, i) => {
  // Use a simple seeded PRNG formula for stable random numbers
  const random = (seed) => {
    const x = Math.sin(seed + i * 13.5) * 10000;
    return x - Math.floor(x);
  };
  
  return {
    id: i,
    top: `${(random(1) * 90 + 2).toFixed(1)}%`,
    left: `${(random(2) * 95 + 2).toFixed(1)}%`,
    size: random(3) > 0.85 ? 3 : random(3) > 0.4 ? 2 : 1.5,
    opacity: (random(4) * 0.4 + 0.35).toFixed(2),
    color: random(5) > 0.8 ? '#d1f5d3' : random(5) > 0.6 ? '#e0f2fe' : '#ffffff',
    blur: random(6) > 0.7 ? 1 : 0,
    animateSpeed: (random(7) * 4 + 3).toFixed(1) // 3s to 7s
  };
});

export default function Hero() {
  return (
    <div className="bg-white px-2 pt-2 md:px-4 md:pt-4">
      {/* Outer container creating the bordered screen look */}
      <section
        id="home"
        className="relative pt-[110px] md:pt-[130px] pb-0 overflow-hidden bg-gradient-to-b from-[#8CA9C4] to-[#A5BFD8] flex flex-col items-center text-center rounded-[2rem] md:rounded-[2.5rem] border border-gray-200/20 shadow-[inset_0_3px_20px_rgba(255,255,255,0.2)]"
      >
        {/* The noise texture overlay to match letters.app grainy feel */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.06] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Large soft background orbs for depth */}
        <div className="absolute top-[-10%] left-[20%] w-[60%] h-[40%] bg-white/10 rounded-full mix-blend-screen opacity-80 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[50%] bg-[#e0f2fe] rounded-full mix-blend-overlay opacity-30 blur-[100px] pointer-events-none" />

        {/* The static scattered animated stars */}
        {BACKGROUND_STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full z-0 animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: star.opacity,
              filter: star.blur ? `blur(${star.blur}px)` : 'none',
              animationDuration: `${star.animateSpeed}s`,
              boxShadow: star.size >= 2 ? `0 0 ${star.size * 2}px ${star.color}` : 'none'
            }}
          />
        ))}

        <div className="max-w-[800px] mx-auto flex flex-col items-center z-40 w-full relative px-6">
          <h1 className="text-[42px] md:text-[60px] font-bold text-white tracking-[-0.03em] leading-[1.05] mb-4 md:mb-5 drop-shadow-sm">
            Smart IP Management, <br />
            Not Paperwork
          </h1>

          <p className="text-white/95 text-[16px] md:text-[18px] font-medium tracking-tight mb-6 md:mb-8 max-w-[660px] leading-relaxed drop-shadow-sm">
            File, manage, and protect your patents, trademarks, and copyrights — <span className="font-bold text-white">all in one platform</span>.<br/>
            Built for innovators, startups, and enterprises.
          </p>

          <Link
            href="/signup"
            className="bg-[#0f172a] text-white text-[16px] font-bold px-8 py-3.5 rounded-full hover:bg-black transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            Get Started for Free <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        {/* Decorative Envelope 'Before & After' mockup at the bottom */}
        <div className="relative w-full max-w-[800px] h-[260px] md:h-[320px] mt-2 md:mt-4 mx-auto flex justify-center items-end pointer-events-none z-20 transition-all duration-500">
          
          {/* Envelope Back Plate */}
          <div className="absolute bottom-0 w-[90%] md:w-[680px] h-[140px] md:h-[180px] bg-white/95 rounded-t-2xl md:rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-x border-gray-200 z-10" />

          {/* Cards Container */}
          <div className="absolute bottom-[40px] md:bottom-[60px] w-full flex justify-center items-end z-20 pointer-events-auto">
            
            {/* "Before" Card */}
            <div className="relative w-[240px] md:w-[300px] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 md:p-5 border border-gray-200 rotate-[-6deg] translate-x-12 md:translate-x-16 translate-y-10 md:translate-y-14 flex flex-col gap-2 transition-transform duration-500 hover:rotate-[-2deg] hover:-translate-y-2 z-20">
              {/* Pill Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] md:text-[15px] text-gray-500">edit_document</span>
                <span className="text-[11px] md:text-[12px] font-bold text-gray-700">Before</span>
              </div>
              
              <div className="mt-2 md:mt-3 flex flex-col gap-1.5 opacity-70">
                <div className="text-[12px] md:text-[14px] font-serif italic text-gray-400 rotate-[-1deg]">
                  Inventor: __John Doe <br />
                  App No: __Pending
                </div>
                <div className="w-full h-[1px] bg-gray-200 my-1" />
                <div className="text-[10px] md:text-[12px] font-serif italic text-red-500 font-bold rotate-[1deg]">
                  X Error: missing signatures, formatting incorrect.
                </div>
                <div className="w-[85%] h-1 bg-gray-200 rounded-full mt-1.5" />
                <div className="w-[60%] h-1 bg-gray-200 rounded-full" />
                <div className="w-[90%] h-1 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* "After" Card */}
            <div className="relative w-[260px] md:w-[320px] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-4 md:p-6 border border-gray-50 rotate-[4deg] -translate-x-6 md:-translate-x-10 translate-y-2 md:translate-y-3 flex flex-col gap-3 z-30 transition-transform duration-500 hover:rotate-[0deg] hover:-translate-y-4 pointer-events-auto">
              {/* Pill Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-blue-50 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] md:text-[15px] text-blue-600">verified</span>
                <span className="text-[11px] md:text-[12px] font-bold text-slate-800">After</span>
              </div>
              
              <div className="mt-2 md:mt-2 text-[12px] md:text-[13px] text-slate-600 font-medium leading-relaxed">
                 <div className="flex items-center gap-2 mb-2 md:mb-3 pb-2 md:pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                       <span className="material-symbols-outlined text-green-600 text-[16px] md:text-[18px]">task_alt</span>
                    </div>
                    <div>
                       <div className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patent USPTO</div>
                       <div className="text-[13px] md:text-[14px] font-black text-slate-800">Verified & Auto-filed</div>
                    </div>
                 </div>
                 Application perfectly structured. No paperwork required.
                 
                 <div className="mt-2 md:mt-3 bg-blue-50/60 p-2 rounded-lg flex items-center gap-2 border border-blue-100/50">
                    <span className="material-symbols-outlined text-blue-500 text-[14px]">cloud_sync</span>
                    <span className="text-[10px] md:text-[11px] font-bold text-blue-800">Synced to dashboard</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Envelope Front Flaps (overlapping the cards) */}
          <div className="absolute bottom-0 w-[90%] md:w-[680px] h-[140px] md:h-[180px] z-40 overflow-hidden rounded-b-[1.7rem] md:rounded-b-[2.2rem]">
            {/* Left inner shadow flap */}
            <div className="absolute top-0 left-0 w-1/2 h-[120%] bg-slate-100/80 backdrop-blur-[2px] border-r border-gray-200" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
            {/* Right inner shadow flap */}
            <div className="absolute top-0 right-0 w-1/2 h-[120%] bg-slate-100/80 backdrop-blur-[2px] border-l border-gray-200" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />
            {/* Main bottom front flap */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.06)]" style={{ clipPath: 'polygon(0 100%, 50% 35%, 100% 100%)' }} />
            {/* Bottom flap edge highlight */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-transparent border-t border-gray-100" style={{ clipPath: 'polygon(0 100%, 50% 35%, 100% 100%)' }} />
          </div>
        </div>
      </section>
    </div>
  );
}


