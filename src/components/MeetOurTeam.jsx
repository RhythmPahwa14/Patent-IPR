"use client";
import { useEffect, useRef, useState } from "react";

const team = [
  {
    initials: "RK",
    name: "Rajiv Khanna",
    title: "Managing Partner",
    specialization: "Patents & IP Strategy",
    bg: "bg-[#0d1b2a]",
    accentColor: "text-[#f5a623]",
    badge: "20+ yrs Experience",
    badgeBg: "bg-[#f5a623]/10 text-[#c5870a]",
    bio: "Former Senior Examiner at the Indian Patent Office. Led 300+ patent grants across biotech, software, and mechanical engineering sectors globally.",
    tags: ["Patent Prosecution", "PCT Filings", "IP Valuation"],
    linkedin: "#",
  },
  {
    initials: "SM",
    name: "Sophia Marchetti",
    title: "Lead Trademark Attorney",
    specialization: "Trademark & Brand Protection",
    bg: "bg-[#4a7c59]",
    accentColor: "text-white",
    badge: "Madrid Expert",
    badgeBg: "bg-white/20 text-white",
    bio: "Specializes in international trademark prosecution under the Madrid Protocol. Managed brand portfolios for Fortune 500 companies across 80+ jurisdictions.",
    tags: ["Madrid Protocol", "Brand Strategy", "Opposition Proceedings"],
    linkedin: "#",
  },
  {
    initials: "AN",
    name: "Arjun Nair",
    title: "Patent Counsel — Deep Tech",
    specialization: "AI, Software & Semiconductor",
    bg: "bg-[#1a3a5c]",
    accentColor: "text-[#f5a623]",
    badge: "Silicon Valley Trained",
    badgeBg: "bg-[#f5a623]/10 text-[#c5870a]",
    bio: "Expert in patent strategies for software-defined products and AI systems. Previously at Google's IP team and a founding patent counsel for two unicorn startups.",
    tags: ["AI Patents", "Software IP", "Freedom to Operate"],
    linkedin: "#",
  },
  {
    initials: "PT",
    name: "Dr. Preethi Thomas",
    title: "Pharma & Biotech IP Lead",
    specialization: "Life Sciences & Biotechnology",
    bg: "bg-purple-700",
    accentColor: "text-white",
    badge: "PhD Biochemistry",
    badgeBg: "bg-white/20 text-white",
    bio: "PhD in Biochemistry with 15 years of patent prosecution experience in pharmaceuticals and medical devices. Secured 120+ biotech patents worldwide.",
    tags: ["Biotech Patents", "Drug Formulations", "Clinical Trials IP"],
    linkedin: "#",
  },
  {
    initials: "KS",
    name: "Kavya Singh",
    title: "Design & Copyright Specialist",
    specialization: "Industrial Design & Copyright",
    bg: "bg-rose-600",
    accentColor: "text-white",
    badge: "EU Design Lead",
    badgeBg: "bg-white/20 text-white",
    bio: "Handles design rights across the EU, US, and India. Expert in copyright law for software, architecture, and creative works. Secured 200+ design registrations.",
    tags: ["Design Registration", "Copyright Law", "Creative Works"],
    linkedin: "#",
  },
  {
    initials: "ML",
    name: "Michael Lau",
    title: "IP Litigation & Enforcement",
    specialization: "Dispute Resolution & Licensing",
    bg: "bg-slate-700",
    accentColor: "text-[#f5a623]",
    badge: "ITC & Federal Courts",
    badgeBg: "bg-[#f5a623]/10 text-[#c5870a]",
    bio: "Veteran IP litigator with 18 years at the ITC and US Federal Courts. Specializes in enforcement strategies, licensing negotiations, and infringement defense.",
    tags: ["IP Litigation", "Licensing", "Infringement Defense"],
    linkedin: "#",
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
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Card top strip */}
      <div className={`${member.bg} px-6 pt-8 pb-6`}>
        <div className="flex items-start justify-between mb-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-xl font-black">
            {member.initials}
          </div>
          {/* Badge */}
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${member.badgeBg}`}
          >
            {member.badge}
          </span>
        </div>
        <div className="text-white font-black text-lg leading-tight">{member.name}</div>
        <div className={`text-sm font-semibold ${member.accentColor} mt-0.5`}>
          {member.title}
        </div>
        <div className="text-white/60 text-xs mt-1 uppercase tracking-widest font-semibold">
          {member.specialization}
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-5 flex flex-col gap-4">
        <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-2">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-50 border border-gray-200 text-[#0d1b2a] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* LinkedIn CTA */}
        <a
          href={member.linkedin}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0d1b2a] border border-gray-200 rounded-lg px-3 py-2 hover:border-[#f5a623] hover:text-[#f5a623] transition-colors w-fit"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          View LinkedIn
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
    <section id="team" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div
          ref={headingRef}
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d1b2a]">
              Our Experts
            </span>
          </div>
          <h2 className="text-4xl font-black text-[#0d1b2a] mb-4">
            Meet Our IP Legal Team
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            A multidisciplinary team of patent attorneys, trademark specialists,
            and IP strategists with decades of combined experience across
            technology, pharma, and creative sectors.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <p className="text-gray-400 text-sm mb-4">
            Want to work with our experts?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#0d1b2a] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1a3a5c] transition-colors"
          >
            Book a Free Consultation
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
