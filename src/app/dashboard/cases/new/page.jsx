"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = ["Case Details", "Jurisdiction", "Documents", "Review"];

export default function NewCasePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: "", type: "Utility Patent", description: "", jurisdiction: "United States (USPTO)", claims: "", inventors: "" });

  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">New Case Filing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Submit a new intellectual property filing request.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${i <= step ? "text-[#0d1b2a]" : "text-gray-300"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i < step ? "bg-[#0d1b2a] border-[#0d1b2a] text-white" : i === step ? "border-[#0d1b2a] text-[#0d1b2a]" : "border-gray-200 text-gray-300"}`}>
                {i < step ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
              </div>
              <span className="text-xs font-semibold hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-[#0d1b2a]" : "bg-gray-100"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        {step === 0 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Case Details</h2>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">Invention Title *</label>
              <input value={form.title} onChange={(e) => handle("title", e.target.value)} placeholder="e.g. AI-Driven Sorting System" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">Patent Type *</label>
              <select value={form.type} onChange={(e) => handle("type", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] bg-white">
                {["Utility Patent", "Design Patent", "Software Patent", "Chemical Patent", "Mechanical Patent"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">Description / Abstract</label>
              <textarea value={form.description} onChange={(e) => handle("description", e.target.value)} rows={4} placeholder="Brief description of the invention..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">Inventor(s)</label>
              <input value={form.inventors} onChange={(e) => handle("inventors", e.target.value)} placeholder="e.g. John Doe, Jane Smith" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a]" />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Jurisdiction</h2>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">Primary Jurisdiction *</label>
              <select value={form.jurisdiction} onChange={(e) => handle("jurisdiction", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] bg-white">
                {["United States (USPTO)", "European Patent Office (EPO)", "China (CNIPA)", "India (IPO)", "Japan (JPO)", "United Kingdom (UKIPO)"].map((j) => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">Number of Claims</label>
              <input type="number" value={form.claims} onChange={(e) => handle("claims", e.target.value)} placeholder="e.g. 20" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a]" />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Documents</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-[#0d1b2a] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-gray-300 text-4xl">upload_file</span>
              <p className="text-sm font-semibold text-[#0d1b2a] mt-2">Drag & drop files here</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PNG up to 50 MB</p>
              <button className="mt-4 text-xs font-semibold border border-gray-200 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Browse Files</button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Review & Submit</h2>
            <div className="space-y-3">
              {[
                ["Invention Title", form.title || "—"],
                ["Patent Type", form.type],
                ["Jurisdiction", form.jurisdiction],
                ["Claims", form.claims || "—"],
                ["Inventors", form.inventors || "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-semibold text-[#0d1b2a]">{val}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="border border-gray-200 text-[#0d1b2a] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} className="flex-1 bg-[#0d1b2a] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors">
              Continue
            </button>
          ) : (
            <button onClick={() => router.push("/dashboard/cases")} className="flex-1 bg-[#f5a623] text-[#0d1b2a] text-sm font-bold py-2.5 rounded-lg hover:bg-[#e09610] transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">send</span> Submit Filing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
