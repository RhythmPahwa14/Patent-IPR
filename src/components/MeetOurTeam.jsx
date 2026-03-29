"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const team = [
  {
    photo: "/sartajvir-singh.png",
    name: "Dr. Sartajvir Singh",
    title: "Chief Scientific Officer - SEnSRS, IIT Ropar",
    specialization: "Registered IPR Professional",
    bg: "bg-gradient-to-br from-[#1a3d54]/5 to-[#1a3d54]/10",
    accentColor: "text-[#1a3d54]",
    badge: "Patent Agent IN/PA 5806",
    badgeBg: "bg-[#1a3d54] text-white",
    bio: "Dr. Sartajvir Singh is an academician and researcher at IIT Ropar with expertise in IPR practice, remote sensing, and computing technologies. He has filed 75 innovations/patents, with 35 granted/awarded.",
    tags: ["75+ Patent Filings", "35+ Grants", "100+ Publications"],
    linkedin: "https://www.linkedin.com/in/sartajvir/",
  },
];

function TeamCard({ member, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${index * 90}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className="group bg-white border border-[#e0eaf3] rounded-[3rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(26,61,84,0.08)] hover:-translate-y-2 transition-all duration-300"
    >
      {/* Card top strip */}
      <div className={`${member.bg} px-10 pt-12 pb-10 relative`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/50 blur-[50px] rounded-full"></div>
        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-sm bg-white">
             {/* Using a placeholder visual until the real image loads */}
             <div className="w-full h-full bg-[#1a3d54]/10 flex items-center justify-center relative">
               <span className="material-symbols-outlined text-[#1a3d54]/30 text-4xl">person</span>
               <Image
                 src={member.photo}
                 alt={member.name}
                 fill
                 className="object-cover relative z-10"
                 onError={(e) => { e.currentTarget.style.display = 'none'; }}
               />
             </div>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm ${member.badgeBg}`}
          >
            {member.badge}
          </span>
        </div>
        <div className="text-[#1a1a1a] font-bold text-3xl leading-tight tracking-tight relative z-10">{member.name}</div>
        <div className={`text-[15px] font-bold ${member.accentColor} mt-2 relative z-10 tracking-tight`}>
          {member.title}
        </div>
        <div className="text-[#4b5563] text-xs mt-2 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">school</span>
          {member.specialization}
        </div>
      </div>

      {/* Card body */}
      <div className="px-10 py-10 flex flex-col gap-8">
        <p className="text-[#4b5563] text-[16px] leading-relaxed font-normal">{member.bio}</p>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-2">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="bg-white border border-[#e0eaf3] text-[#1a3d54] text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* LinkedIn CTA */}
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-sm font-bold text-[#1a3d54] border-l-2 border-[#1a3d54] pl-4 hover:opacity-75 transition-opacity w-fit mt-2"
        >
          View LinkedIn Profile →
        </a>
      </div>
    </div>
  );
}

export default function MeetOurTeam() {
  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeadingVisible(true);
      },
      { threshold: 0.2 }
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="team" className="py-24 md:py-32 bg-[#f8f9fa] border-b border-[#e0eaf3]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div
          ref={headingRef}
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="text-center mb-16 md:mb-24 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e0eaf3] rounded-full mb-6 shadow-sm">
            <span className="text-[11px] font-bold text-[#4b5563] tracking-[0.15em] uppercase">
              Featured Expert
            </span>
          </div>
          <h2 className="text-[44px] md:text-[60px] font-medium text-[#1a1a1a] tracking-tight leading-[1.05] mb-6">
            Meet the expertise.
          </h2>
          <p className="text-[#4b5563] text-[18px] md:text-[20px] font-normal tracking-tight max-w-[600px] mx-auto leading-relaxed">
            A proven track record of guiding intellectual property through complex legal frameworks worldwide.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 max-w-[480px] mx-auto">
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
          }}
          className="mt-20 text-center flex items-center justify-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#1a3d54] text-white text-[14px] font-medium px-8 py-3.5 rounded-full uppercase tracking-widest hover:bg-[#112a3c] transition-colors shadow-lg shadow-[#1a3d54]/20 hover:-translate-y-0.5"
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
