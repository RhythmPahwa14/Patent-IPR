"use client";
import Link from "next/link";

const services = [
  {
    icon: <span className="material-symbols-outlined text-[#1a3d54] text-3xl">policy</span>,
    title: "Patent Filing",
    desc: "Strategic international and domestic patent drafting, filing, and prosecution services.",
    stat: "120+ Active Applications",
    cta: "Start Filing",
    featured: true,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-500 text-3xl">verified</span>,
    title: "Trademark Protection",
    desc: "Secure your brand identity globally. Search, registration, and monitoring services.",
    stat: "300+ Registered Marks",
    cta: "Protect Brand",
    featured: false,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-500 text-3xl">copyright</span>,
    title: "Copyright Registration",
    desc: "Full-scope protection for creative works, software codes, and architectural designs.",
    stat: "500+ Works Registered",
    cta: "Register Now",
    featured: false,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-500 text-3xl">architecture</span>,
    title: "Design Registration",
    desc: "Protect the unique aesthetic elements of your products from visual infringement.",
    stat: "80+ Designs Protected",
    cta: "Explore Service",
    featured: false,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-500 text-3xl">monitoring</span>,
    title: "Portfolio Management",
    desc: "360° visibility into your IP assets. Renewals, alerts, valuation, and optimization.",
    stat: "1,000+ Assets Tracked",
    cta: "View Details",
    featured: false,
  },
  {
    icon: <span className="material-symbols-outlined text-gray-500 text-3xl">calculate</span>,
    title: "Cost Estimator",
    desc: "Transparent filing fee calculator for global patent and trademark registration.",
    stat: "50+ Jurisdictions",
    cta: "Get Estimate",
    featured: false,
  },
];

function ServiceCard({ service, index }) {
  return (
    <div className={`relative group flex flex-col p-8 sm:p-10 rounded-[2.5rem] bg-white transition-all duration-300 border
        ${service.featured
          ? "border-[#1a3d54]/20 shadow-[0_20px_40px_rgba(26,61,84,0.08)] -translate-y-2 z-10"
          : "border-[#e0eaf3] shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1"
        }`}
    >
      <div className={`w-14 h-14 flex items-center justify-center mb-8 rounded-2xl ${service.featured ? "bg-gradient-to-br from-[#1a3d54]/10 to-transparent" : "bg-[#f8f9fa]"} border border-[#e0eaf3]`}>
        {service.icon}
      </div>

      <h3 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight mb-3">
        {service.title}
        {service.featured && (
           <span className="ml-3 inline-block align-middle px-2.5 py-1 bg-[#1a3d54] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
             Popular
           </span>
        )}
      </h3>

      <p className="text-[#4b5563] text-[16px] leading-relaxed mb-8 flex-1">
        {service.desc}
      </p>

      <div className="text-[13px] font-semibold text-[#1a1a1a] mb-8 flex items-center gap-2 border-t border-[#e0eaf3] pt-6">
        <span className="material-symbols-outlined text-[16px] text-[#1a3d54]">analytics</span>
        {service.stat}
      </div>

      <Link
        href="#contact"
        className={`inline-flex items-center w-max text-[14px] font-medium transition-all
          ${service.featured
            ? "bg-[#1a3d54] text-white px-6 py-2.5 rounded-full hover:bg-[#112a3c] shadow-md shadow-[#1a3d54]/20 hover:-translate-y-0.5"
            : "flex items-center gap-3 border-l-2 border-[#1a3d54] pl-4 text-[#1a3d54] hover:opacity-75 font-bold"
          }`}
      >
        {service.cta} {service.featured ? "" : ""}
      </Link>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e0eaf3] shadow-sm rounded-full mb-6">
            <span className="text-[11px] font-bold text-[#4b5563] tracking-[0.15em] uppercase">Capabilities</span>
          </div>
          
          <h2 className="text-[44px] md:text-[60px] font-medium text-[#1a1a1a] tracking-tight leading-[1.05] mb-6">
            Protect every dimension <br className="hidden md:block"/> of intellectual property.
          </h2>
          <p className="text-[#4b5563] text-[18px] md:text-[20px] font-normal tracking-tight max-w-[600px] leading-relaxed">
            End-to-end solutions for innovators, startups, and enterprises — from intelligent filing to continuous global enforcement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
