"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const rawRef = searchParams.get("ref") || "";
  const patentId = searchParams.get("patentId") || "";

  /* ── Format reference number as REQ-PT-{YEAR}-{SEQ} ── */
  const formatRef = (ref) => {
    if (!ref) return null;
    // If the API already returns the expected format, use it as-is
    if (/^REQ-PT-\d{4}-\d{3,}$/i.test(ref)) return ref.toUpperCase();
    return ref; // fallback: show whatever the API returned
  };

  const displayRef = formatRef(rawRef) || `REQ-PT-${new Date().getFullYear()}-001`;

  /* ── 10-second auto-redirect ── */
  useEffect(() => {
    if (countdown <= 0) {
      router.push("/dashboard");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router]);

  const circumference = 2 * Math.PI * 22; // r=22
  const strokeDash = circumference * (countdown / 10);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg w-full p-8 text-center space-y-6">
        {/* Check icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#0d1b2a]">Filing Submitted!</h1>
          <p className="text-sm text-gray-500">
            Your patent application has been successfully submitted. Our team will review it shortly.
          </p>
        </div>

        {/* Reference number card */}
        <div className="bg-[#f0f4f8] rounded-xl px-6 py-5 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Reference Number</p>
          <p className="text-2xl font-extrabold text-[#0d1b2a] tracking-wider font-mono">{displayRef}</p>
          {patentId && (
            <p className="text-xs text-gray-400 mt-1">
              Patent ID: <span className="font-semibold text-[#0d1b2a]">{patentId}</span>
            </p>
          )}
        </div>

        <p className="text-xs text-gray-400">
          A confirmation has been sent to your registered email address. Please save your reference number for future correspondence.
        </p>

        {/* Countdown ring + text */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#e5e7eb" strokeWidth="3" />
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="#0d1b2a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                style={{ transition: "stroke-dasharray 1s linear" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#0d1b2a]">
              {countdown}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Redirecting to dashboard in <span className="font-semibold text-[#0d1b2a]">{countdown}s</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => router.push("/dashboard/cases/new")}
            className="flex-1 border border-gray-200 text-[#0d1b2a] text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            New Filing
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-[#0d1b2a] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <span className="w-8 h-8 border-4 border-gray-200 border-t-[#0d1b2a] rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
