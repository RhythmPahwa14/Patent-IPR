"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const steps = ["Case Details", "Applicant Info", "Documents", "Review"];

export default function GenericFilingForm({
  filingType,
  heading,
  subheading,
  sections,
  referencePrefix,
  caseIdLabel,
}) {
  const router = useRouter();
  const fileInputRefs = useRef({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const allFields = [
    ...(sections?.details?.required || []),
    ...(sections?.details?.optional || []),
    ...(sections?.applicant?.required || []),
    ...(sections?.applicant?.optional || []),
    ...(sections?.documents?.required || []),
    ...(sections?.documents?.optional || []),
  ];

  const initialValues = allFields.reduce((acc, field) => {
    if (field.type === "checkbox") {
      acc[field.key] = false;
      return acc;
    }
    if (field.type === "multiselect") {
      acc[field.key] = [];
      return acc;
    }
    acc[field.key] = field.defaultValue || "";
    return acc;
  }, {});

  const [form, setForm] = useState(initialValues);
  const [fileNames, setFileNames] = useState({});

  const handle = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFile = (key, files) => {
    if (!files || files.length === 0) return;
    const field = allFields.find((f) => f.key === key);
    const isMultiple = Boolean(field?.multiple);
    const selectedFiles = isMultiple ? Array.from(files) : files[0];
    setForm((prev) => ({ ...prev, [key]: selectedFiles }));
    setFileNames((prev) => ({
      ...prev,
      [key]: isMultiple ? Array.from(files).map((file) => file.name).join(", ") : files[0].name,
    }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const renderField = (field) => {
    const commonLabel = (
      <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">
        {field.label} {field.required ? <span className="text-red-500">*</span> : null}
      </label>
    );

    if (field.type === "textarea") {
      return (
        <div key={field.key}>
          {commonLabel}
          <textarea
            value={form[field.key] || ""}
            onChange={(e) => handle(field.key, e.target.value)}
            rows={field.rows || 4}
            placeholder={field.placeholder || ""}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] resize-none ${
              fieldErrors[field.key] ? "border-red-200 bg-red-50" : "border-gray-200"
            }`}
          />
          {fieldErrors[field.key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[field.key]}</p>}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.key}>
          {commonLabel}
          <select
            value={form[field.key] || field.options?.[0] || ""}
            onChange={(e) => handle(field.key, e.target.value)}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] bg-white ${
              fieldErrors[field.key] ? "border-red-200 bg-red-50" : "border-gray-200"
            }`}
          >
            {(field.options || []).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {fieldErrors[field.key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[field.key]}</p>}
        </div>
      );
    }

    if (field.type === "radio") {
      return (
        <div key={field.key}>
          {commonLabel}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(field.options || []).map((option) => (
              <label key={option} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0d1b2a]">
                <input
                  type="radio"
                  name={field.key}
                  checked={form[field.key] === option}
                  onChange={() => handle(field.key, option)}
                  className="accent-[#0d1b2a]"
                />
                {option}
              </label>
            ))}
          </div>
          {fieldErrors[field.key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[field.key]}</p>}
        </div>
      );
    }

    if (field.type === "multiselect") {
      return (
        <div key={field.key}>
          {commonLabel}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(field.options || []).map((option) => {
              const checked = (form[field.key] || []).includes(option);
              return (
                <label key={option} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0d1b2a]">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const current = form[field.key] || [];
                      handle(
                        field.key,
                        checked ? current.filter((item) => item !== option) : [...current, option]
                      );
                    }}
                    className="accent-[#0d1b2a]"
                  />
                  {option}
                </label>
              );
            })}
          </div>
          {fieldErrors[field.key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[field.key]}</p>}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <div key={field.key} className="pt-1">
          <label className="flex items-start gap-2 text-sm text-[#0d1b2a]">
            <input
              type="checkbox"
              checked={Boolean(form[field.key])}
              onChange={(e) => handle(field.key, e.target.checked)}
              className="mt-0.5 accent-[#0d1b2a]"
            />
            <span>{field.label}</span>
          </label>
          {fieldErrors[field.key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[field.key]}</p>}
        </div>
      );
    }

    if (field.type === "file") {
      return (
        <div key={field.key}>
          {commonLabel}
          <div
            onClick={() => fileInputRefs.current[field.key]?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              fileNames[field.key] ? "border-[#0d1b2a] bg-[#f0f4f8]" : "border-gray-200 hover:border-[#0d1b2a]"
            }`}
          >
            <span className="material-symbols-outlined text-gray-400 text-3xl">{fileNames[field.key] ? "description" : "upload_file"}</span>
            {fileNames[field.key] ? (
              <>
                <p className="text-sm font-semibold text-[#0d1b2a] mt-2 break-all">{fileNames[field.key]}</p>
                <p className="text-xs text-gray-400 mt-1">Click to change file</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-[#0d1b2a] mt-2">Upload {field.label}</p>
                <p className="text-xs text-gray-400 mt-1">{field.acceptHint || "PDF, DOCX, PNG, JPG"}</p>
              </>
            )}
          </div>
          <input
            ref={(node) => {
              fileInputRefs.current[field.key] = node;
            }}
            type="file"
            accept={field.accept || ".pdf,.docx,.png,.jpg"}
            multiple={Boolean(field.multiple)}
            className="hidden"
            onChange={(e) => handleFile(field.key, e.target.files)}
          />
          {fieldErrors[field.key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[field.key]}</p>}
        </div>
      );
    }

    return (
      <div key={field.key}>
        {commonLabel}
        <input
          type={field.type === "date" ? "date" : "text"}
          value={form[field.key] || ""}
          onChange={(e) => handle(field.key, e.target.value)}
          placeholder={field.placeholder || ""}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0d1b2a] ${
            fieldErrors[field.key] ? "border-red-200 bg-red-50" : "border-gray-200"
          }`}
        />
        {fieldErrors[field.key] && <p className="text-xs text-red-500 mt-1">{fieldErrors[field.key]}</p>}
      </div>
    );
  };

  const validateFields = (fields) => {
    const errors = {};
    fields.forEach((field) => {
      if (!field.required) return;
      const value = form[field.key];
      if (field.type === "checkbox" && !value) {
        errors[field.key] = "This consent is required.";
      } else if (field.type === "multiselect" && (!Array.isArray(value) || value.length === 0)) {
        errors[field.key] = "Please select at least one option.";
      } else if (field.type === "file" && !fileNames[field.key]) {
        errors[field.key] = "Please upload the required file.";
      } else if (field.type !== "checkbox" && field.type !== "file" && String(value || "").trim() === "") {
        errors[field.key] = "This field is required.";
      }
    });

    setFieldErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setError("");
    const reviewRequired = [
      ...(sections?.details?.required || []),
      ...(sections?.applicant?.required || []),
      ...(sections?.documents?.required || []),
    ];
    if (!validateFields(reviewRequired)) {
      setError("Please fix validation errors before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 650));
      const year = new Date().getFullYear();
      const sequence = String(Math.floor(100 + Math.random() * 900));
      const ref = `REQ-${referencePrefix}-${year}-${sequence}`;
      const generatedId = `${referencePrefix}-${Date.now().toString().slice(-6)}`;
      router.push(
        `/dashboard/cases/success?ref=${encodeURIComponent(ref)}&type=${encodeURIComponent(filingType)}&id=${encodeURIComponent(generatedId)}&idLabel=${encodeURIComponent(caseIdLabel)}`
      );
    } catch (submitErr) {
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentStepRequired =
    step === 0
      ? sections?.details?.required || []
      : step === 1
      ? sections?.applicant?.required || []
      : step === 2
      ? sections?.documents?.required || []
      : [];

  const currentStepOptional =
    step === 0
      ? sections?.details?.optional || []
      : step === 1
      ? sections?.applicant?.optional || []
      : step === 2
      ? sections?.documents?.optional || []
      : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">{heading}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{subheading}</p>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${index <= step ? "text-[#0d1b2a]" : "text-gray-300"}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  index < step
                    ? "bg-[#0d1b2a] border-[#0d1b2a] text-white"
                    : index === step
                    ? "border-[#0d1b2a] text-[#0d1b2a]"
                    : "border-gray-200 text-gray-300"
                }`}
              >
                {index < step ? <span className="material-symbols-outlined text-sm">check</span> : index + 1}
              </div>
              <span className="text-xs font-semibold hidden sm:block">{label}</span>
            </div>
            {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${index < step ? "bg-[#0d1b2a]" : "bg-gray-100"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        {step === 0 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Case Details</h2>
            <div className="space-y-4">{(sections?.details?.required || []).map(renderField)}</div>
            {(sections?.details?.optional || []).length > 0 && (
              <>
                <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Optional Details</h3>
                <div className="space-y-4">{(sections?.details?.optional || []).map(renderField)}</div>
              </>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Applicant Information</h2>
            <div className="space-y-4">{(sections?.applicant?.required || []).map(renderField)}</div>
            {(sections?.applicant?.optional || []).length > 0 && (
              <>
                <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Optional Details</h3>
                <div className="space-y-4">{(sections?.applicant?.optional || []).map(renderField)}</div>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Supporting Document</h2>
            <div className="space-y-4">{(sections?.documents?.required || []).map(renderField)}</div>
            {(sections?.documents?.optional || []).length > 0 && (
              <>
                <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Optional Details</h3>
                <div className="space-y-4">{(sections?.documents?.optional || []).map(renderField)}</div>
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-base font-bold text-[#0d1b2a]">Review & Submit</h2>
            <div className="space-y-0">
              {allFields.map((field) => {
                let value = form[field.key];
                if (field.type === "checkbox") value = value ? "Yes" : "No";
                if (field.type === "multiselect") value = Array.isArray(value) && value.length ? value.join(", ") : "—";
                if (field.type === "file") value = fileNames[field.key] || "No file uploaded";
                if (field.type !== "checkbox" && field.type !== "multiselect" && field.type !== "file") {
                  value = String(value || "").trim() || "—";
                }
                return [field.label, value];
              }).map(([label, value]) => (
                <div key={label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400 w-40 shrink-0">{label}</span>
                  <span className="text-xs font-semibold text-[#0d1b2a] text-right break-all">{value}</span>
                </div>
              ))}
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600 font-medium">{error}</div>}
          </>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              onClick={() => {
                setStep((current) => current - 1);
                setError("");
              }}
              disabled={submitting}
              className="border border-gray-200 text-[#0d1b2a] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}

          {step < steps.length - 1 ? (
            <button
              onClick={() => {
                if (!validateFields(currentStepRequired)) {
                  setError("Please complete required fields before continuing.");
                  return;
                }
                setError("");
                setStep((current) => current + 1);
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