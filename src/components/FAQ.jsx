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
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 text-center mb-14 tracking-tight leading-tight">
          Frequently asked questions
        </h2>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-gray-50/50 border border-gray-100 rounded-[1.5rem] overflow-hidden hover:bg-gray-50 transition-colors"
            >
              <button
                className="w-full flex items-center justify-between px-8 py-6 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-bold text-slate-900 text-lg pr-4 tracking-tight group-hover:text-blue-600 transition-colors">
                  {faq.q}
                </span>
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 shrink-0 transition-transform ${
                    open === i ? "rotate-180 bg-blue-50 border-blue-100 text-blue-600" : ""
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </span>
              </button>
              {open === i && (
                <div className="px-8 pb-8 pt-2 text-gray-500 text-[15px] font-medium leading-relaxed">
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
