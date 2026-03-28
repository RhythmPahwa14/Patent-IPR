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
      className="w-full max-w-sm mx-auto bg-white rounded-3xl p-6 flex flex-col gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-slate-900 text-lg tracking-tight mb-1">
            {item.title}
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Client Success
          </div>
        </div>
        <span className="bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shrink-0">
          Verified
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center w-full aspect-video border border-gray-100 relative">
        <span className="material-symbols-outlined text-4xl text-gray-300 absolute">image</span>
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

      <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
           <span className="material-symbols-outlined text-blue-500 text-sm">info</span>
           <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Description</div>
        </div>
        <div className="text-sm font-medium text-slate-800 leading-relaxed">
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
    <section id="success-stories" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={headingRef}
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 mb-6 shadow-sm">
            <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
            <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
              Proof of work
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            Client Certifications
          </h2>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto tracking-tight">
            Real achievements granted to clients we helped file and successfully prosecute on the platform.
          </p>
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
