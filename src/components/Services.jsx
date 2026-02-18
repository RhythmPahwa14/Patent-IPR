"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
      </svg>
    ),
    title: "Patent Filing",
    desc: "Strategic international and domestic patent drafting, filing, and prosecution services.",
    stat: "120+ Active Applications",
    cta: "Start Filing →",
    featured: true,
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Trademark Protection",
    desc: "Secure your brand identity globally. Search, registration, and monitoring services.",
    stat: "300+ Registered Marks",
    cta: "Protect Brand →",
    featured: false,
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Copyright Registration",
    desc: "Full-scope protection for creative works, software codes, and architectural designs.",
    stat: "500+ Works Registered",
    cta: "Register Now →",
    featured: false,
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "Design Registration",
    desc: "Protect the unique aesthetic elements of your products from visual infringement.",
    stat: "80+ Designs Protected",
    cta: "Explore Service →",
    featured: false,
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: "Portfolio Management",
    desc: "360° visibility into your IP assets. Renewals, alerts, valuation, and optimization.",
    stat: "1,000+ Assets Tracked",
    cta: "View Details →",
    featured: false,
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Cost Estimator",
    desc: "Transparent filing fee calculator for global patent and trademark registration.",
    stat: "50+ Jurisdictions Covered",
    cta: "Get Estimate →",
    featured: false,
  },
];

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${index * 80}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
      className={`relative group flex flex-col rounded-2xl p-8 cursor-pointer
        ${service.featured
          ? "bg-[#0d1b2a] border-2 border-[#f5a623] shadow-[0_20px_50px_rgba(13,27,42,0.18)]"
          : "bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]"
        }
        hover:-translate-y-1.5 transition-all duration-300`}
    >
      {/* Most Popular badge */}
      {service.featured && (
        <div className="absolute -top-3.5 left-8">
          <span className="bg-[#f5a623] text-[#0d1b2a] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300
          ${service.featured
            ? "bg-white/10 text-[#f5a623] group-hover:bg-[#f5a623] group-hover:text-[#0d1b2a]"
            : "bg-[#f0f4f8] text-[#0d1b2a] group-hover:bg-[#0d1b2a] group-hover:text-[#f5a623]"
          }`}
      >
        {service.icon}
      </div>

      {/* Title */}
      <h3 className={`text-lg font-black mb-3 ${service.featured ? "text-white" : "text-[#0d1b2a]"}`}>
        {service.title}
      </h3>

      {/* Description */}
      <p className={`text-sm leading-relaxed mb-4 flex-1 ${service.featured ? "text-gray-300" : "text-gray-500"}`}>
        {service.desc}
      </p>

      {/* Micro stat */}
      <div className={`text-xs font-semibold mb-6 flex items-center gap-1.5
        ${service.featured ? "text-[#f5a623]" : "text-[#4a7c59]"}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${service.featured ? "bg-[#f5a623]" : "bg-[#4a7c59]"}`} />
        {service.stat}
      </div>

      {/* CTA button */}
      <Link
        href="#contact"
        className={`inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-300
          ${service.featured
            ? "bg-[#f5a623] text-[#0d1b2a] hover:bg-white"
            : "border-2 border-[#0d1b2a] text-[#0d1b2a] hover:bg-[#0d1b2a] hover:text-white"
          }`}
      >
        {service.cta}
      </Link>
    </div>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      style={{ background: "linear-gradient(to bottom, #f8fafc, #ffffff)" }}
      className="py-28"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f5a623]">
            Our Expertise
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-[#0d1b2a] text-center mb-4 leading-tight">
          Protect Every Dimension of Your<br className="hidden md:block" /> Intellectual Property
        </h2>
        <p className="text-center text-gray-500 text-base mb-16 max-w-xl mx-auto">
          End-to-end solutions for innovators, startups, and enterprises — from filing to enforcement.
        </p>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* Trust microcopy */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
          {[
            "✔ Confidential Handling",
            "✔ 95% Filing Success Rate",
            "✔ Dedicated Case Manager",
          ].map((item) => (
            <span key={item} className="font-medium">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
