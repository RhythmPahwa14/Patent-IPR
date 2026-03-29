"use client";
import { useState } from "react";

const faqs = [
  {
    q: "How long does a patent filing process take?",
    a: "The timeline varies by jurisdiction and complexity. A typical US utility patent takes 2–3 years from filing to grant. We provide an Interactive Case Timeline on our platform so you can track every stage in real-time.",
  },
  {
    q: "Is my IP data secure on your platform?",
    a: "Absolutely. We use bank-grade AES-256 encryption for all documents and communications. Our infrastructure is ISO 27001 certified and undergoes regular third-party security audits.",
  },
  {
    q: "Can you handle international patent filings?",
    a: "Yes. We have direct filing capabilities in 150+ countries via PCT (Patent Cooperation Treaty) and Madrid systems, supported by our global network of registered IP attorneys.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#f8f9fa] border-b border-[#e0eaf3]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-[44px] md:text-[60px] font-medium text-[#1a1a1a] tracking-tight leading-[1.05] mb-16 text-center">
          Frequently asked questions.
        </h2>

        <div className="flex flex-col border-t border-[#e0eaf3]">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-[#e0eaf3] hover:bg-white transition-colors"
            >
              <button
                className="w-full flex items-center justify-between py-6 text-left group px-6"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-bold text-[#1a1a1a] text-[18px] md:text-[22px] pr-4 tracking-tight transition-colors">
                  {faq.q}
                </span>
                <span
                  className={`flex items-center justify-center text-[#1a3d54] shrink-0 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                >
                  <span className="material-symbols-outlined text-[28px]">expand_more</span>
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-8 pt-2 text-[#4b5563] text-[16px] md:text-[18px] leading-relaxed max-w-3xl">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
