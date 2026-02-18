"use client";
import { useState } from "react";

const serviceCategories = ["Patent Application (Non-Provisional)", "Patent Application (Provisional)", "Trademark Registration", "Design Patent", "PCT International Filing", "Patent Renewal"];
const entityTypes = ["Small Entity (SME/Individual)", "Large Entity (Corporation)", "Micro Entity (Academic/Non-Profit)"];
const jurisdictions = [
  { label: "United States (USPTO)", flag: "🇺🇸" },
  { label: "European Patent Office (EPO)", flag: "🇪🇺" },
  { label: "China (CNIPA)", flag: "🇨🇳" },
  { label: "India (IPO)", flag: "🇮🇳" },
  { label: "Japan (JPO)", flag: "🇯🇵" },
  { label: "United Kingdom (UKIPO)", flag: "🇬🇧" },
];

function calcEstimate({ service, entity, claims, totalClaims, pages, accelerated, drawings }) {
  // Gov fees
  let basicFiling = entity === "Large Entity (Corporation)" ? 800 : 320;
  let searchFee = entity === "Large Entity (Corporation)" ? 660 : 330;
  let examFee = entity === "Large Entity (Corporation)" ? 800 : 400;
  const govTotal = basicFiling + searchFee + examFee;

  // Professional fees
  let drafting = 3500;
  let formalities = 850;
  let illustration = drawings ? 500 : 0;
  let expedite = accelerated ? 1200 : 0;
  const proTotal = drafting + formalities + illustration + expedite;

  return {
    govTotal,
    basicFiling,
    searchFee,
    examFee,
    proTotal,
    drafting,
    formalities,
    illustration,
    expedite,
    total: govTotal + proTotal,
  };
}

export default function CostEstimatorPage() {
  const [form, setForm] = useState({
    service: serviceCategories[0],
    entity: entityTypes[0],
    jurisdiction: jurisdictions[0].label,
    claims: "3",
    totalClaims: "20",
    pages: "25",
    accelerated: false,
    drawings: true,
  });
  const [estimate, setEstimate] = useState(null);

  const handle = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const calculate = () => {
    setEstimate(calcEstimate(form));
  };

  const quoteId = `#EST-${Math.floor(900000 + Math.random() * 99999)}-${new Date().getFullYear().toString().slice(-2)}`;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">IP Cost Estimator</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Plan your intellectual property budget with precision. Get real-time estimates for international filings, renewals, and professional fees based on current global regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="text-base font-bold text-[#0d1b2a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f5a623] text-xl">tune</span>
            Application Details
          </h2>

          {/* Service + Entity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">Service Category</label>
              <select value={form.service} onChange={(e) => handle("service", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#0d1b2a] bg-white">
                {serviceCategories.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">Entity Type</label>
              <select value={form.entity} onChange={(e) => handle("entity", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#0d1b2a] bg-white">
                {entityTypes.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Jurisdiction */}
          <div>
            <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">Primary Jurisdiction</label>
            <select value={form.jurisdiction} onChange={(e) => handle("jurisdiction", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#0d1b2a] bg-white">
              {jurisdictions.map((j) => <option key={j.label}>{j.flag} {j.label}</option>)}
            </select>
          </div>

          {/* Claims + Pages */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Independent Claims", key: "claims" },
              { label: "Total Claims", key: "totalClaims" },
              { label: "Pages", key: "pages" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">{label}</label>
                <input
                  type="number"
                  value={form[key]}
                  onChange={(e) => handle(key, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#0d1b2a]"
                />
              </div>
            ))}
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5">
            {[
              { key: "accelerated", label: "Request Accelerated Examination", sub: "(Prioritized Examination Track 1)" },
              { key: "drawings", label: "Professional formal drawings required", sub: "(estimated 4 sheets)" },
            ].map(({ key, label, sub }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={(e) => handle(key, e.target.checked)} className="w-4 h-4 accent-[#0d1b2a]" />
                <span className="text-sm text-[#0d1b2a]">{label} <span className="text-gray-400">{sub}</span></span>
              </label>
            ))}
          </div>

          {/* Calculate */}
          <button
            onClick={calculate}
            className="w-full bg-[#0d1b2a] text-white py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1a2f4a] transition-colors"
          >
            <span className="material-symbols-outlined text-base">calculate</span>
            Calculate Estimate
          </button>

          {/* Info */}
          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <span className="material-symbols-outlined text-blue-500 text-base mt-0.5">info</span>
            <p className="text-xs text-blue-700 leading-relaxed">
              Professional fees include drafting, filing, and communication for standard cases. More complex inventions or excessive office actions may incur additional hourly charges. Estimates exclude taxes where applicable.
            </p>
          </div>
        </div>

        {/* Estimate Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0d1b2a] rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#f5a623] text-xl">receipt_long</span>
              <h2 className="text-base font-bold">Estimate Summary</h2>
            </div>
            <p className="text-[10px] text-white/40 mb-5">QUOTE ID: {quoteId}</p>

            {estimate ? (
              <>
                {/* Gov fees */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Official Government Fees</span>
                    <span className="text-sm font-bold">${estimate.govTotal.toFixed(2)}</span>
                  </div>
                  {[
                    ["Basic Filing (Small Entity)", estimate.basicFiling],
                    ["Search Fee", estimate.searchFee],
                    ["Examination Fee", estimate.examFee],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-xs text-white/50 mb-1">
                      <span>{label}</span><span>${val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Pro fees */}
                <div className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Professional Service Fees</span>
                    <span className="text-sm font-bold">${estimate.proTotal.toFixed(2)}</span>
                  </div>
                  {[
                    ["Application Drafting (Standard)", estimate.drafting],
                    ["Filing Formalities & Review", estimate.formalities],
                    estimate.illustration > 0 && ["Formal Illustration Services", estimate.illustration],
                    estimate.expedite > 0 && ["Accelerated Examination Fee", estimate.expedite],
                  ].filter(Boolean).map(([label, val]) => (
                    <div key={label} className="flex justify-between text-xs text-white/50 mb-1">
                      <span>{label}</span><span>${val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 text-center">
                  <p className="text-[10px] tracking-widest uppercase text-white/40 mb-1">Total Estimated Cost</p>
                  <p className="text-4xl font-bold text-[#f5a623]">${estimate.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-white/30 mt-2 leading-relaxed">
                    Disclaimer: This is a preliminary estimate and does not constitute a formal agreement. Final pricing depends on specific technical complexities and legal requirements.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button className="flex items-center justify-center gap-1.5 border border-white/20 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-sm">download</span> PDF
                  </button>
                  <button className="flex items-center justify-center gap-1.5 border border-white/20 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-sm">bookmark</span> Save
                  </button>
                </div>
                <button className="w-full mt-2 bg-[#f5a623] text-[#0d1b2a] text-sm font-bold py-3 rounded-lg hover:bg-[#e09610] transition-colors">
                  Proceed with Filing
                </button>
              </>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-white/20 text-5xl">calculate</span>
                <p className="text-sm text-white/40 mt-3">Fill in the details and click<br />"Calculate Estimate" to see results.</p>
              </div>
            )}
          </div>

          {/* Office info */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Office Information</p>
            <p className="text-xs font-semibold text-[#0d1b2a]">United States Patent and Trademark Office</p>
            <p className="text-xs text-gray-400 mt-1">600 Dulany St, Alexandria, VA 22314, USA</p>
            <a href="https://www.uspto.gov" target="_blank" rel="noopener noreferrer" className="text-xs text-[#f5a623] hover:underline mt-1 block">www.uspto.gov</a>
          </div>
        </div>
      </div>
    </div>
  );
}
