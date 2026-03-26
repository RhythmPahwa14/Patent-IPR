"use client";
import Link from "next/link";
import { useMemo } from "react";
import { getEstimatorPrefillForService } from "@/lib/estimatorPrefill";

const FILING_OPTIONS = [
  {
    key: "patent",
    title: "Patent",
    description: "File inventions and technical innovations.",
    icon: "lightbulb",
    href: "/dashboard/cases/new/patent",
  },
  {
    key: "copyright",
    title: "Copyright",
    description: "Protect literary, artistic, software, and media works.",
    icon: "copyright",
    href: "/dashboard/cases/new/copyright",
  },
  {
    key: "trademark",
    title: "Trademark",
    description: "Register brand names, logos, and slogans.",
    icon: "verified",
    href: "/dashboard/cases/new/trademark",
  },
  {
    key: "design",
    title: "Design",
    description: "Protect product shape, visual appearance, and aesthetics.",
    icon: "design_services",
    href: "/dashboard/cases/new/design",
  },
];

function formatEstimatorTotal(prefill) {
  if (!prefill || typeof prefill.total !== "number") return "";
  return `Estimate: \u20b9${prefill.total.toLocaleString("en-IN")}`;
}

export default function NewCasePage() {
  const prefills = useMemo(() => {
    if (typeof window === "undefined") return {};
    return FILING_OPTIONS.reduce((acc, option) => {
      acc[option.key] = getEstimatorPrefillForService(option.key);
      return acc;
    }, {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Start New Filing</h1>
        <p className="text-sm text-gray-500 mt-1">Select one filing type to continue.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FILING_OPTIONS.map((option) => {
          const prefill = prefills[option.key];
          const estimateTotal = formatEstimatorTotal(prefill);

          return (
            <Link
              key={option.key}
              href={option.href}
              className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-[#0d1b2a] hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#f0f4f8] flex items-center justify-center shrink-0 group-hover:bg-[#0d1b2a] transition-colors">
                  <span className="material-symbols-outlined text-[#0d1b2a] group-hover:text-white transition-colors">
                    {option.icon}
                  </span>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-[#0d1b2a] transition-colors">chevron_right</span>
              </div>

              <h2 className="text-lg font-bold text-[#0d1b2a] mt-4">{option.title}</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{option.description}</p>

              {prefill && (
                <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                  <p className="text-[11px] font-semibold tracking-wide uppercase text-blue-600">Estimator data ready</p>
                  {estimateTotal && <p className="text-xs font-semibold text-[#0d1b2a] mt-0.5">{estimateTotal}</p>}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <p className="text-xs text-gray-500">
          Tip: You can run the Cost Estimator first, then start filing to auto-add estimate details into the selected form.
        </p>
      </div>
    </div>
  );
}
