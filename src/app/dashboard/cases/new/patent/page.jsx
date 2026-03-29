"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitClientPatent } from "@/lib/api";
import { getEstimatorPrefillForService } from "@/lib/estimatorPrefill";

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewCasePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fileName, setFileName] = useState("");
  const [estimatorPrefill, setEstimatorPrefill] = useState(null);
  const [touched, setTouched] = useState({});

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

  useEffect(() => {
    const prefill = getEstimatorPrefillForService("patent");
    setEstimatorPrefill(prefill);
    if (prefill?.defaults && typeof prefill.defaults === "object") {
      setForm((prev) => ({ ...prev, ...prefill.defaults }));
    }
  }, []);

  const setFieldTouched = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handle = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setFieldTouched(k);
    setSubmitError("");
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

  const getTitleError = () => {
    const title = String(form.title || "").trim();
    if (!title) return "Title is required";
    if (title.length < 5 || title.length > 500) return "Title must be between 5 and 500 characters";
    return "";
  };

  const getFieldOfInventionError = () => {
    const field = String(form.fieldOfInvention || "").trim();
    if (!field) return "Field of invention is required";
    if (field.length < 3 || field.length > 100) {
      return "Field of invention must be between 3 and 100 characters";
    }
    return "";
  };

  const getFieldOfInventionOtherError = () => {
    if (String(form.fieldOfInvention || "").trim() !== "Other") return "";
    const fieldOther = String(form.fieldOfInventionOther || "").trim();
    if (!fieldOther) return "Field of invention (Other) is required";
    if (fieldOther.length < 3 || fieldOther.length > 100) {
      return "Field of invention (Other) must be between 3 and 100 characters";
    }
    return "";
  };

  const getAbstractError = () => {
    const abstract = String(form.abstract || "").trim();
    if (!abstract) return "Abstract is required";
    if (abstract.length < 20 || abstract.length > 2000) {
      return "Abstract must be between 20 and 2000 characters";
    }
    return "";
  };

  const getApplicantNameError = () => {
    const applicantName = String(form.applicantName || "").trim();
    if (!applicantName) return "Applicant name is required";
    if (applicantName.length < 3 || applicantName.length > 100) {
      return "Applicant name must be between 3 and 100 characters";
    }
    return "";
  };

  const getApplicantEmailError = () => {
    const applicantEmail = String(form.applicantEmail || "").trim();
    if (!applicantEmail) return "Applicant email is required";
    if (!EMAIL_REGEX.test(applicantEmail)) return "Invalid email format";
    return "";
  };

  const getApplicantMobileError = () => {
    const mobileDigits = String(form.applicantMobile || "").replace(/\D/g, "");
    if (!mobileDigits) return "Applicant mobile is required";
    if (!/^\d{10,15}$/.test(mobileDigits)) return "Invalid mobile number format";
    return "";
  };

  const fieldErrors = {
    title: getTitleError(),
    fieldOfInvention: getFieldOfInventionError(),
    fieldOfInventionOther: getFieldOfInventionOtherError(),
    abstract: getAbstractError(),
    applicantName: getApplicantNameError(),
    applicantEmail: getApplicantEmailError(),
    applicantMobile: getApplicantMobileError(),
  };

  const shouldShowFieldError = (key) => Boolean(touched[key] && fieldErrors[key]);

  const getStepRequiredKeys = (currentStep) => {
    if (currentStep === 0) {
      return [
        "title",
        "fieldOfInvention",
        ...(form.fieldOfInvention === "Other" ? ["fieldOfInventionOther"] : []),
        "abstract",
      ];
    }

    if (currentStep === 1) {
      return ["applicantName", "applicantEmail", "applicantMobile"];
    }

    return [];
  };

  const validateForStepContinue = (currentStep) => {
    const keys = getStepRequiredKeys(currentStep);
    if (keys.length === 0) return false;
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(keys.map((key) => [key, true])),
    }));
    return keys.some((key) => Boolean(fieldErrors[key]));
  };

  const handleSubmit = async () => {
    setSubmitError("");
    const requiredStep0 = getStepRequiredKeys(0);
    const requiredStep1 = getStepRequiredKeys(1);
    const allRequired = [...new Set([...requiredStep0, ...requiredStep1])];

    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(allRequired.map((key) => [key, true])),
    }));

    const hasStep0Error = requiredStep0.some((key) => Boolean(fieldErrors[key]));
    if (hasStep0Error) {
      setStep(0);
      setSubmitError("Please fix highlighted fields.");
      return;
    }

    const hasStep1Error = requiredStep1.some((key) => Boolean(fieldErrors[key]));
    if (hasStep1Error) {
      setStep(1);
      setSubmitError("Please fix highlighted fields.");
      return;
    }

    const normalizedMobile = String(form.applicantMobile || "").replace(/\D/g, "");

    setSubmitting(true);

    try {
      const result = await submitClientPatent({
        title: form.title,
        description: form.abstract,
        abstractText: form.abstract,
        fieldOfInvention: form.fieldOfInvention,
        fieldOfInventionOther: form.fieldOfInventionOther,
        applicantName: form.applicantName,
        applicantEmail: form.applicantEmail,
        applicantMobile: normalizedMobile,
        supportingDocument: form.supportingDocument,
      });

      if (!result.ok) {
        const data = result.data || {};
        const fieldErrors = data.errors?.map((e) => `${e.field ? e.field + ": " : ""}${e.message}`).join(" | ");
        const apiMessage = data?.message || data?.error || data?.data?.message || "";
        const errMsg =
          fieldErrors ||
          apiMessage ||
          (result.status === 401 || result.status === 403
            ? "Your session is not authorized for filing. Please login with a client account."
            : "Submission failed. Please try again.");
        setSubmitError(errMsg);
        return;
      }

      const payload = result.data?.data || result.data || {};
      const ref = encodeURIComponent(payload.referenceNumber || "");
      const pid = encodeURIComponent(payload.patentId || payload.id || "");
      router.push(`/dashboard/cases/success?ref=${ref}&patentId=${pid}`);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const estimatorTotalDisplay =
    typeof estimatorPrefill?.total === "number"
      ? `INR ${estimatorPrefill.total.toLocaleString("en-IN")}`
      : null;
  const abstractWords = String(form.abstract || "").trim().length
    ? String(form.abstract || "").trim().split(/\s+/).length
    : 0;
  const abstractChars = String(form.abstract || "").trim().length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">New Patent Filing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Submit a new patent filing application.</p>
      </div>

      {estimatorPrefill && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase">Cost Estimator Data Added</p>
          {estimatorTotalDisplay && (
            <p className="text-base font-semibold text-[#0d1b2a] mt-1">Estimated Total: {estimatorTotalDisplay}</p>
          )}
          {Array.isArray(estimatorPrefill.selections) && estimatorPrefill.selections.length > 0 && (
            <div className="mt-2 space-y-1">
              {estimatorPrefill.selections.map((entry) => (
                <p key={entry} className="text-xs text-[#0d1b2a]">- {entry}</p>
              ))}
            </div>
          )}
        </div>
      )}

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
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] ${
                  shouldShowFieldError("title") ? "border-red-400" : "border-gray-200"
                }`}
              />
              {shouldShowFieldError("title") && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
                Field of Invention <span className="text-red-500">*</span>
              </label>
              <select
                value={form.fieldOfInvention}
                onChange={(e) => handle("fieldOfInvention", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] bg-white ${
                  shouldShowFieldError("fieldOfInvention") ? "border-red-400" : "border-gray-200"
                }`}
              >
                {FIELD_OPTIONS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
              {shouldShowFieldError("fieldOfInvention") && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.fieldOfInvention}</p>
              )}
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
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] ${
                    shouldShowFieldError("fieldOfInventionOther") ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {shouldShowFieldError("fieldOfInventionOther") && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.fieldOfInventionOther}</p>
                )}
              </div>
            )}
            <div>
                <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.abstract}
                  onChange={(e) => handle("abstract", e.target.value)}
                  rows={4}
                  placeholder="Brief description of the invention..."
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] resize-none ${
                    shouldShowFieldError("abstract") ? "border-red-400" : "border-gray-200"
                  }`}
                />
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500">
                    Live Count: {abstractWords} words, {abstractChars}/2000 characters
                  </p>
                  <p className={`text-xs ${abstractChars >= 20 && abstractChars <= 2000 ? "text-green-600" : "text-amber-600"}`}>
                    Min 20 chars
                  </p>
                </div>
                {shouldShowFieldError("abstract") && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.abstract}</p>
                )}
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
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] ${
                  shouldShowFieldError("applicantName") ? "border-red-400" : "border-gray-200"
                }`}
              />
              {shouldShowFieldError("applicantName") && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.applicantName}</p>
              )}
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
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] ${
                  shouldShowFieldError("applicantEmail") ? "border-red-400" : "border-gray-200"
                }`}
              />
              {shouldShowFieldError("applicantEmail") && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.applicantEmail}</p>
              )}
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
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] ${
                  shouldShowFieldError("applicantMobile") ? "border-red-400" : "border-gray-200"
                }`}
              />
              {shouldShowFieldError("applicantMobile") && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.applicantMobile}</p>
              )}
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
                ...(estimatorTotalDisplay ? [["Estimated Cost", estimatorTotalDisplay]] : []),
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400 w-40 shrink-0">{label}</span>
                  <span className="text-xs font-semibold text-[#0d1b2a] text-right break-all">{val}</span>
                </div>
              ))}
            </div>
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600 font-medium">
                {submitError}
              </div>
            )}
          </>
        )}

        {/* ── Navigation ── */}
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              onClick={() => { setStep((s) => s - 1); setSubmitError(""); }}
              disabled={submitting}
              className="border border-gray-200 text-[#0d1b2a] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={() => {
                const hasStepErrors = validateForStepContinue(step);
                if (hasStepErrors) {
                  return;
                }
                setSubmitError("");
                setStep((s) => s + 1);
              }}
              className="flex-1 bg-[#1a3d54] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#153144] transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-[#e0eaf3] text-[#1a3d54] text-sm font-bold py-2.5 rounded-lg hover:bg-[#d2deea] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
