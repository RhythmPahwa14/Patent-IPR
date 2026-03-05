"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "98%", label: "Patent Grant Rate" },
  { value: "1,200+", label: "Cases Won" },
  { value: "150+", label: "Countries Covered" },
  { value: "24 hrs", label: "Avg. Response Time" },
];

const stories = [
  {
    company: "NovaBio Therapeutics",
    industry: "Pharmaceutical",
    tag: "Patent Grant",
    tagColor: "bg-[#4a7c59]",
    quote:
      "PATENT-IPR helped us secure protection for our novel drug-delivery system across 40+ countries. Their prior-art search was exhaustive, and the claim drafting was airtight. We received a grant notice in under 26 months — record time for a complex biotech patent.",
    outcome: "US & PCT Patent Granted in 26 months",
    stat: "+40 countries protected",
    avatar: "NB",
    name: "Dr. Priya Sharma",
    title: "Chief Scientific Officer",
    avatarBg: "bg-[#4a7c59]",
  },
  {
    company: "Voltaic Systems Inc.",
    industry: "Clean Energy",
    tag: "Trademark Win",
    tagColor: "bg-blue-600",
    quote:
      "We were facing a trademark infringement dispute that threatened our entire brand. PATENT-IPR's attorneys built a rock-solid case and within 6 months, we secured full rights to our mark. Their platform gave real-time visibility into every stage of the process.",
    outcome: "Trademark dispute resolved — full rights retained",
    stat: "Brand value protected: $4.2M",
    avatar: "VS",
    name: "Marcus Reid",
    title: "CEO & Co-Founder",
    avatarBg: "bg-blue-600",
  },
  {
    company: "ArchForm Design Studio",
    industry: "Industrial Design",
    tag: "Design Registration",
    tagColor: "bg-[#f5a623]",
    quote:
      "Registering design patents across the EU and India used to feel impossible. PATENT-IPR streamlined the whole process — from prior-art searches to final registration — in a single dashboard. We now protect 15 new product designs every quarter without hassle.",
    outcome: "15 design rights registered per quarter",
    stat: "IP portfolio grew 3× in 12 months",
    avatar: "AF",
    name: "Ananya Fernandez",
    title: "Head of Product Design",
    avatarBg: "bg-purple-500",
  },
  {
    company: "SwiftLogix Technologies",
    industry: "AI & Software",
    tag: "Copyright Protection",
    tagColor: "bg-rose-500",
    quote:
      "As an AI startup, our software core is our biggest asset. PATENT-IPR helped us copyright our algorithms, file provisional patents, and set up a monitoring system for potential infringements. Their team genuinely understands deep-tech — that's rare in IP law.",
    outcome: "3 software patents filed, 2 already granted",
    stat: "Secured $2M seed round with IP portfolio",
    avatar: "SL",
    name: "Kevin Liang",
    title: "CTO, SwiftLogix",
    avatarBg: "bg-rose-500",
  },
];

function StoryCard({ story, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${index * 100}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}
      className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-black text-[#0d1b2a] text-lg leading-tight">
            {story.company}
          </div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
            {story.industry}
          </div>
        </div>
        <span
          className={`${story.tagColor} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap`}
        >
          {story.tag}
        </span>
      </div>

      {/* Quote */}
      <div className="relative">
        <span className="absolute -top-3 -left-1 text-5xl text-[#f5a623] font-black leading-none select-none">
          &ldquo;
        </span>
        <p className="text-gray-500 text-sm leading-relaxed pt-4 italic">
          {story.quote}
        </p>
      </div>

      {/* Outcome pill */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#4a7c59] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <span className="text-xs font-semibold text-[#0d1b2a]">
            {story.outcome}
          </span>
        </div>
        <div className="text-xs text-gray-400 pl-6">{story.stat}</div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
        <div
          className={`w-9 h-9 rounded-full ${story.avatarBg} flex items-center justify-center text-white text-xs font-black shrink-0`}
        >
          {story.avatar}
        </div>
        <div>
          <div className="text-sm font-bold text-[#0d1b2a]">{story.name}</div>
          <div className="text-xs text-gray-400">{story.title}</div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessStories() {
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
    <section id="success-stories" className="py-24 bg-[#f3f4f6]">
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
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d1b2a]">
              Client Success Stories
            </span>
          </div>
          <h2 className="text-4xl font-black text-[#0d1b2a] mb-4">
            Real Results. Real Innovation.
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            From early-stage startups to global enterprises — our clients trust
            PATENT-IPR to protect what matters most.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                transitionDelay: `${i * 80}ms`,
                opacity: headingVisible ? 1 : 0,
                transform: headingVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
              className="bg-[#0d1b2a] rounded-2xl px-6 py-5 text-center"
            >
              <div className="text-3xl font-black text-[#f5a623]">{s.value}</div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Story Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <StoryCard key={story.company} story={story} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
