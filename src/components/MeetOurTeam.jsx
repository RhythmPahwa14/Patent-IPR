"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const team = [
  {
    photo: "/sartajvir-singh.png",
    name: "Dr. Sartajvir Singh",
    title: "Chief Scientific Officer - SEnSRS, IIT Ropar",
    specialization: "Registered IPR Professional",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    accentColor: "text-blue-700",
    badge: "Patent Agent IN/PA 5806",
    badgeBg: "bg-blue-600 text-white",
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
      className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
    >
      {/* Card top strip */}
      <div className={`${member.bg} px-8 pt-10 pb-8 relative`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-[40px] rounded-full"></div>
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-sm bg-white">
             {/* Using a placeholder visual until the real image loads */}
             <div className="w-full h-full bg-blue-100 flex items-center justify-center relative">
               <span className="material-symbols-outlined text-blue-300 text-3xl">person</span>
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
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${member.badgeBg}`}
          >
            {member.badge}
          </span>
        </div>
        <div className="text-slate-900 font-bold text-2xl leading-tight tracking-tight relative z-10">{member.name}</div>
        <div className={`text-sm font-bold ${member.accentColor} mt-1 relative z-10 tracking-tight`}>
          {member.title}
        </div>
        <div className="text-gray-500 text-xs mt-1.5 uppercase tracking-widest font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">school</span>
          {member.specialization}
        </div>
      </div>

      {/* Card body */}
      <div className="px-8 py-8 flex flex-col gap-6">
        <p className="text-gray-500 text-sm leading-relaxed font-medium">{member.bio}</p>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-2">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-50 border border-gray-100 text-slate-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
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
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0A66C2] bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-2.5 hover:bg-blue-50 transition-colors w-fit"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          View LinkedIn Profile
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
    <section id="team" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div
          ref={headingRef}
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 bg-white shadow-sm border border-gray-100 rounded-full px-4 py-2 mb-6">
            <span className="material-symbols-outlined text-blue-500 text-sm">stars</span>
            <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
              Featured Expert
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            Meet the expertise
          </h2>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto tracking-tight">
            A proven track record of guiding intellectual property through complex legal frameworks worldwide.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 max-w-[440px] mx-auto">
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
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-full hover:bg-black hover:scale-105 transition-all shadow-lg"
          >
            Book a Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
