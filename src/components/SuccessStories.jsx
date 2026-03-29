"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const certificateGallery = [
  {
    id: 1,
    image: "/001.jpg",
    title: "Client Patent Certification",
    note: "Patent certificate granted to our client with filing support from PATENT-IPR.",
  },
];

function CertificateGalleryCard({ item, index }) {
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
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className="w-full max-w-sm mx-auto bg-white rounded-[3rem] p-8 flex flex-col gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-[#e0eaf3] hover:shadow-[0_20px_40px_rgba(26,61,84,0.08)] hover:-translate-y-2 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-[#1a1a1a] text-[20px] tracking-tight mb-2">
            {item.title}
          </div>
          <div className="text-[11px] font-bold text-[#4b5563] uppercase tracking-widest">
            Client Success
          </div>
        </div>
        <span className="bg-[#134B42]/10 text-[#134B42] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shrink-0">
          Verified
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden bg-[#f8f9fa] flex items-center justify-center w-full aspect-video border border-[#e0eaf3] relative shadow-sm">
        <span className="material-symbols-outlined text-[32px] text-[#4b5563]/30 absolute">image</span>
        {/* 
          Using regular img tag for placeholder. In real app with valid path, Next image is better. 
          Fallbacks gracefully if /001.jpg is not present. 
        */}
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover relative z-10"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <div className="bg-[#eef2f6] border border-[#e0eaf3] rounded-2xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
           <span className="material-symbols-outlined text-[#1a3d54] text-[18px]">info</span>
           <div className="text-[11px] text-[#1a3d54] font-bold uppercase tracking-widest">Description</div>
        </div>
        <div className="text-[15px] font-normal text-[#4b5563] leading-relaxed">
          {item.note}
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
    <section id="success-stories" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={headingRef}
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="text-center mb-16 md:mb-24 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e0eaf3] shadow-sm rounded-full mb-6">
            <span className="text-[11px] font-bold text-[#4b5563] tracking-[0.15em] uppercase">
              Proof of work
            </span>
          </div>
          <h2 className="text-[44px] md:text-[60px] font-medium text-[#1a1a1a] tracking-tight leading-[1.05] mb-6">
            Client Certifications.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {certificateGallery.map((item, i) => (
            <CertificateGalleryCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
