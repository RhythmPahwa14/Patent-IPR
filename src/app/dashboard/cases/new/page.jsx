"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const steps = ["Case Details", "Applicant Info", "Documents", "Review"];

const FIELD_OPTIONS = [
  "Mechanical Engineering",
  "Chemical",
  "Software",
  "Electronics",
  "Biotechnology",
  "Materials Science",
  "Aerospace",
  "Other",
];

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://patent-ipr-backend-springboot-dug6aphbfrfuadh3.southindia-01.azurewebsites.net").replace(/\/+$/, "");

export default function NewCasePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [abstractError, setAbstractError] = useState("");

  const [form, setForm] = useState({
    title: "",
    fieldOfInvention: "Mechanical Engineering",
    fieldOfInventionOther: "",
    abstract: "",
    applicantName: "",
    applicantEmail: "",
    applicantMobile: "",
    supportingDocument: "",
  });

  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validateAbstract = (value) => {
    const text = (value || "").trim();
    const words = text.length === 0 ? 0 : text.split(/\s+/).filter(Boolean).length;
    if (words === 0) {
      setAbstractError("Abstract is required (minimum 30 words).");
      return false;
    }
    if (words < 30) {
      setAbstractError("Abstract must be at least 30 words.");
      return false;
    }
    if (words > 200) {
      setAbstractError("Abstract must be at most 200 words.");
      return false;
    }
    setAbstractError("");
    return true;
  };

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => handle("supportingDocument", e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    // validate abstract before submitting
    if (!validateAbstract(form.abstract)) {
      setSubmitting(false);
      setError("Please fix validation errors before submitting.");
      return;
    }

    try {
      const params = new URLSearchParams({
        title: form.title,
        fieldOfInvention: form.fieldOfInvention,
        abstract: form.abstract,
        applicantName: form.applicantName,
        applicantEmail: form.applicantEmail,
        applicantMobile: form.applicantMobile,
      });
      if (form.fieldOfInvention === "Other" && form.fieldOfInventionOther) {
        params.set("fieldOfInventionOther", form.fieldOfInventionOther);
      }

      const res = await fetch(`${API_BASE}/api/v1/patents/submit?${params.toString()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supportingDocument: form.supportingDocument }),
      });

      const data = await res.json();

      if (!res.ok) {
        const fieldErrors = data.errors?.map((e) => `${e.field ? e.field + ": " : ""}${e.message}`).join(" | ");
        const errMsg = fieldErrors || data.message || "Submission failed. Please try again.";
        setError(errMsg);
        return;
      }

      const ref = encodeURIComponent(data.data?.referenceNumber || "");
      const pid = encodeURIComponent(data.data?.patentId || "");
      router.push(`/dashboard/cases/success?ref=${ref}&patentId=${pid}`);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const abstractWordCount = (form.abstract || "").trim().length === 0
    ? 0
    : (form.abstract || "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">New Patent Filing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Submit a new patent filing application.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${i <= step ? "text-[#0d1b2a]" : "text-gray-300"}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  i < step
                    ? "bg-[#0d1b2a] border-[#0d1b2a] text-white"
                    : i === step
                    ? "border-[#0d1b2a] text-[#0d1b2a]"
                    : "border-gray-200 text-gray-300"
                }`}
              >
                {i < step ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
              </div>
              <span className="text-xs font-semibold hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-[#0d1b2a]" : "bg-gray-100"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        {/* ── Step 0: Case Details ── */}
        {step === 0 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Case Details</h2>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
                Invention Title <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => handle("title", e.target.value)}
                placeholder="e.g. AI-Driven Sorting System"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
                Field of Invention <span className="text-red-500">*</span>
              </label>
              <select
                value={form.fieldOfInvention}
                onChange={(e) => handle("fieldOfInvention", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] bg-white"
              >
                {FIELD_OPTIONS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            {form.fieldOfInvention === "Other" && (
              <div>
                <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
                  Specify Field of Invention
                </label>
                <input
                  value={form.fieldOfInventionOther}
                  onChange={(e) => handle("fieldOfInventionOther", e.target.value)}
                  placeholder="Describe the field of invention"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a]"
                />
              </div>
            )}
            <div>
                <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.abstract}
                  onChange={(e) => {
                    const v = e.target.value;
                    handle("abstract", v);
                    validateAbstract(v);
                  }}
                  rows={4}
                  placeholder="Brief description of the invention..."
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] resize-none ${
                    abstractError ? "border-red-200 bg-red-50" : "border-gray-200"
                  }`}
                />
                {abstractError && <p className="text-xs text-red-500 mt-1">{abstractError}</p>}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">{abstractWordCount} words</p>
                  <p className={`text-xs ${abstractWordCount > 200 ? "text-red-500" : "text-gray-400"}`}>
                    {abstractWordCount > 200
                      ? `${abstractWordCount - 200} over limit`
                      : `${200 - abstractWordCount} words remaining`}
                  </p>
                </div>
            </div>
          </>
        )}

        {/* ── Step 1: Applicant Info ── */}
        {step === 1 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Applicant Information</h2>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.applicantName}
                onChange={(e) => handle("applicantName", e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.applicantEmail}
                onChange={(e) => handle("applicantEmail", e.target.value)}
                placeholder="e.g. john@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.applicantMobile}
                onChange={(e) => handle("applicantMobile", e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a]"
              />
            </div>
          </>
        )}

        {/* ── Step 2: Documents ── */}
        {step === 2 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Supporting Document</h2>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                fileName ? "border-[#0d1b2a] bg-[#f0f4f8]" : "border-gray-200 hover:border-[#0d1b2a]"
              }`}
            >
              <span className="material-symbols-outlined text-gray-400 text-4xl">
                {fileName ? "description" : "upload_file"}
              </span>
              {fileName ? (
                <>
                  <p className="text-sm font-semibold text-[#0d1b2a] mt-2">{fileName}</p>
                  <p className="text-xs text-gray-400 mt-1">Click to change file</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-[#0d1b2a] mt-2">Drag & drop file here</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PNG up to 50 MB</p>
                  <button
                    type="button"
                    className="mt-4 text-xs font-semibold border border-gray-200 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Browse Files
                  </button>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.png,.jpg"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </>
        )}

        {/* ── Step 3: Review ── */}
        {step === 3 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Review & Submit</h2>
            <div className="space-y-0">
              {[
                ["Invention Title", form.title || "—"],
                [
                  "Field of Invention",
                  form.fieldOfInvention === "Other"
                    ? form.fieldOfInventionOther || "Other"
                    : form.fieldOfInvention,
                ],
                ["Abstract", form.abstract || "—"],
                ["Applicant Name", form.applicantName || "—"],
                ["Email", form.applicantEmail || "—"],
                ["Mobile", form.applicantMobile || "—"],
                ["Supporting Document", fileName || "No file uploaded"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400 w-40 shrink-0">{label}</span>
                  <span className="text-xs font-semibold text-[#0d1b2a] text-right break-all">{val}</span>
                </div>
              ))}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}
          </>
        )}

        {/* ── Navigation ── */}
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              onClick={() => { setStep((s) => s - 1); setError(""); }}
              disabled={submitting}
              className="border border-gray-200 text-[#0d1b2a] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={() => {
                if (step === 0) {
                  if (!validateAbstract(form.abstract)) return;
                }
                setStep((s) => s + 1);
              }}
              className="flex-1 bg-[#0d1b2a] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-[#f5a623] text-[#0d1b2a] text-sm font-bold py-2.5 rounded-lg hover:bg-[#e09610] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0d1b2a]/30 border-t-[#0d1b2a] rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">send</span>
                  Submit Filing
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
