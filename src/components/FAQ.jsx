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
        <h2 className="text-4xl font-black text-[#0d1b2a] text-center mb-14">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl overflow-hidden hover:border-[#f5a623] transition-colors"
            >
              <button
                className="w-full flex items-center justify-between px-7 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-[#0d1b2a] text-base pr-4">
                  {faq.q}
                </span>
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 text-sm shrink-0 transition-transform ${
                    open === i ? "rotate-180 border-[#f5a623] text-[#f5a623]" : ""
                  }`}
                >
                  ↓
                </span>
              </button>
              {open === i && (
                <div className="px-7 pb-5 text-gray-500 text-sm leading-relaxed">
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
