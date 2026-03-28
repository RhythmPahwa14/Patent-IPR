"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: <span className="material-symbols-outlined text-blue-600 text-3xl">policy</span>,
    title: "Patent Filing",
    desc: "Strategic international and domestic patent drafting, filing, and prosecution services.",
    stat: "120+ Active Applications",
    cta: "Start Filing",
    featured: true,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-700 text-3xl">verified</span>,
    title: "Trademark Protection",
    desc: "Secure your brand identity globally. Search, registration, and monitoring services.",
    stat: "300+ Registered Marks",
    cta: "Protect Brand",
    featured: false,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-700 text-3xl">copyright</span>,
    title: "Copyright Registration",
    desc: "Full-scope protection for creative works, software codes, and architectural designs.",
    stat: "500+ Works Registered",
    cta: "Register Now",
    featured: false,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-700 text-3xl">architecture</span>,
    title: "Design Registration",
    desc: "Protect the unique aesthetic elements of your products from visual infringement.",
    stat: "80+ Designs Protected",
    cta: "Explore Service",
    featured: false,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-700 text-3xl">monitoring</span>,
    title: "Portfolio Management",
    desc: "360° visibility into your IP assets. Renewals, alerts, valuation, and optimization.",
    stat: "1,000+ Assets Tracked",
    cta: "View Details",
    featured: false,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-700 text-3xl">calculate</span>,
    title: "Cost Estimator",
    desc: "Transparent filing fee calculator for global patent and trademark registration.",
    stat: "50+ Jurisdictions",
    cta: "Get Estimate",
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
        transitionDelay: `${index * 50}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={`relative group flex flex-col rounded-[2rem] p-8 transition-all duration-300
        ${service.featured
          ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-blue-100"
          : "bg-white/50 border border-black/[0.04] hover:bg-white hover:shadow-[0_8px_20px_rgb(0,0,0,0.04)]"
        }`}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center mb-6">
        {service.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
        {service.title}
        {service.featured && (
           <span className="ml-3 inline-block align-middle px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
             Popular
           </span>
        )}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 font-medium">
        {service.desc}
      </p>

      {/* Micro stat */}
      <div className="text-xs font-semibold text-gray-400 mb-6 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px]">analytics</span>
        {service.stat}
      </div>

      {/* CTA button */}
      <Link
        href="#contact"
        className={`inline-flex items-center justify-center w-max px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
          ${service.featured
            ? "bg-slate-900 text-white hover:bg-black hover:scale-105"
            : "bg-gray-100 text-slate-800 hover:bg-gray-200"
          }`}
      >
        {service.cta}
      </Link>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F4F5F7] rounded-[3rem] px-8 py-16 md:p-20 shadow-inner">
          {/* Heading */}
          <div className="text-center w-full flex flex-col justify-center items-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-gray-100">
              <span className="material-symbols-outlined text-sm text-blue-500">workspaces</span>
              <span className="text-xs font-bold text-gray-700 tracking-wide">Capabilities</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 text-center tracking-tight leading-tight mb-6">
              Protect every dimension of <br className="hidden md:block" /> your intellectual property
            </h2>
            <p className="text-center text-gray-500 text-lg max-w-2xl font-medium tracking-tight">
              End-to-end solutions for innovators, startups, and enterprises — from intelligent filing to continuous enforcement.
            </p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
