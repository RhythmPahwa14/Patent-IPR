﻿"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveEstimatorPrefill } from "@/lib/estimatorPrefill";

/* ─── Reusable Toggle switch ─── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-blue-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ─── Row helpers ─── */
function FeeRow({ icon, label, sub, amount, muted }) {
  return (
    <div className={`flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 ${muted ? "opacity-50" : ""}`}>
      {icon && (
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-gray-500 text-base">{icon}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${muted ? "text-gray-400 italic" : "text-[#0d1b2a]"}`}>{label}</p>
        {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
      </div>
      {amount && <span className={`text-sm font-bold shrink-0 ${muted ? "text-gray-400" : "text-[#0d1b2a]"}`}>{amount}</span>}
    </div>
  );
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0d1b2a]">{label}</p>
        {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-5 mb-1">{children}</p>
  );
}

function InfoBanner({ children }) {
  return (
    <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
      <span className="material-symbols-outlined text-blue-500 text-base mt-0.5 shrink-0">info</span>
      <p className="text-xs text-blue-700 leading-relaxed font-medium">{children}</p>
    </div>
  );
}

/* ─── Shared estimator shell ─── */
function EstimatorShell({ title, onBack, children, total, totalNote, onStartFiling }) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 md:px-7 py-4 border-b border-gray-100">
        <button onClick={onBack} className="text-[#0d1b2a] hover:text-gray-400 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back_ios</span>
        </button>
        <h2 className="text-base font-bold text-[#0d1b2a] flex-1">{title}</h2>
      </div>
      <div className="px-5 md:px-7 pb-4">{children}</div>
      <div className="border-t border-gray-100 px-5 md:px-7 pt-4 pb-5 bg-white">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total Estimated Cost</p>
            <p className="text-3xl font-bold text-[#0d1b2a]">{total}</p>
            {totalNote && <p className="text-[10px] text-gray-400 mt-0.5">{totalNote}</p>}
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">receipt_long</span>
          </div>
        </div>
        <button
          onClick={onStartFiling}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined text-base">rocket_launch</span>
          Start Filing
        </button>
      </div>
    </div>
  );
}

/* ─── Patent Estimator ─── */
function PatentEstimator({ onBack, onStartFiling }) {
  const BASE = 6600 + 6000;
  const OPT = { drafting: 8000, priorArt: 2000, earlyPub: 5000, expedited: 10000 };
  const [opts, setOpts] = useState({ drafting: false, priorArt: false, earlyPub: false, expedited: false });
  const toggle = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }));
  const total = BASE + Object.entries(opts).reduce((sum, [k, v]) => sum + (v ? OPT[k] : 0), 0);
  const handleStart = () => {
    const selectedOptions = [];
    if (opts.drafting) selectedOptions.push("Patent Drafting");
    if (opts.priorArt) selectedOptions.push("Prior Art Search");
    if (opts.earlyPub) selectedOptions.push("Early Publication");
    if (opts.expedited) selectedOptions.push("Expedited Examination");

    onStartFiling({
      service: "patent",
      total,
      selections: [
        "Entity Type: Individual / Startup / Small Entity",
        ...selectedOptions.map((option) => `Add-on: ${option}`),
      ],
      defaults: {},
    });
  };

  return (
    <EstimatorShell title="Patent Cost Estimator" onBack={onBack} total={`₹${total.toLocaleString("en-IN")}`} onStartFiling={handleStart}>
      <div className="pt-4">
        <InfoBanner>Applicable for Individuals / Startups / Small Entities</InfoBanner>
        <SectionLabel>Fixed Statutory Fees</SectionLabel>
        <FeeRow icon="description" label="Filing Fee" amount="₹6,600" />
        <FeeRow icon="fact_check" label="Ordinary Examination" amount="₹6,000" />
        <SectionLabel>Optional Services</SectionLabel>
        <ToggleRow label="Patent Drafting" sub="₹8,000" checked={opts.drafting} onChange={() => toggle("drafting")} />
        <ToggleRow label="Prior Art Search" sub="₹2,000" checked={opts.priorArt} onChange={() => toggle("priorArt")} />
        <ToggleRow label="Early Publication" sub="₹5,000" checked={opts.earlyPub} onChange={() => toggle("earlyPub")} />
        <ToggleRow label="Expedited Examination" sub="₹10,000" checked={opts.expedited} onChange={() => toggle("expedited")} />
        <SectionLabel>Post-Filing Services</SectionLabel>
        <div className="flex items-center gap-3 py-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0d1b2a]">FER Response</p>
            <p className="text-[11px] text-gray-400">Estimated Range</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-blue-600">₹5,000 – ₹10,000</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">per response</p>
          </div>
        </div>
      </div>
    </EstimatorShell>
  );
}

/* ─── Design Registration Estimator ─── */
function DesignEstimator({ onBack, onStartFiling }) {
  const BASE = 5000 + 1000;
  const DRAWINGS_ADD = 2500;
  const [drawings, setDrawings] = useState(false);
  const total = BASE + (drawings ? DRAWINGS_ADD : 0);
  const handleStart = () => {
    onStartFiling({
      service: "design",
      total,
      selections: [
        "Entity Type: Individual / Startup / Small Entity",
        drawings ? "3D Drawings Support: Yes" : "3D Drawings Support: No",
      ],
      defaults: {},
    });
  };

  return (
    <EstimatorShell title="Design Registration Estimator" onBack={onBack} total={`₹${total.toLocaleString("en-IN")}`} onStartFiling={handleStart}>
      <div className="pt-4">
        <InfoBanner>Applicable for Individuals / Startups / Small Entities</InfoBanner>
        <SectionLabel>Entity Type</SectionLabel>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
          <span className="text-sm text-[#0d1b2a]">Individual / Startup / Small Entity</span>
          <span className="material-symbols-outlined text-gray-400 text-base">lock</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-50 mt-2">
          <div>
            <p className="text-sm font-medium text-[#0d1b2a]">3D-Drawings (Optional)</p>
            <p className="text-[11px] text-gray-400">₹2,500 – ₹5,000</p>
          </div>
          <Toggle checked={drawings} onChange={setDrawings} />
        </div>
        <SectionLabel>Fee Breakdown</SectionLabel>
        <FeeRow icon="description" label="Filing Fee" amount="₹5,000" />
        <FeeRow icon="account_balance" label="Government Fee" amount="₹1,000" />
        <FeeRow icon="schedule" label="Avg. Timeline" amount="6-10 Months" muted />
      </div>
    </EstimatorShell>
  );
}

/* ─── Trademark Estimator ─── */
function TrademarkEstimator({ onBack, onStartFiling }) {
  const CLASS_GOV = 4500;
  const PROFESSIONAL = 5000;
  const OPT = { preFiling: 1500, logoDesign: 3000, expedited: 10000 };
  const [classes, setClasses] = useState(1);
  const [opts, setOpts] = useState({ preFiling: true, logoDesign: false, expedited: false });
  const toggle = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }));
  const govFee = CLASS_GOV * classes;
  const optTotal = Object.entries(opts).reduce((s, [k, v]) => s + (v ? OPT[k] : 0), 0);
  const total = govFee + PROFESSIONAL + optTotal;
  const handleStart = () => {
    const selectedOptions = [];
    if (opts.preFiling) selectedOptions.push("Pre-filing Search");
    if (opts.logoDesign) selectedOptions.push("Logo Design");
    if (opts.expedited) selectedOptions.push("Expedited Processing");

    onStartFiling({
      service: "trademark",
      total,
      selections: [
        `Classes selected: ${classes}`,
        ...selectedOptions.map((option) => `Add-on: ${option}`),
      ],
      defaults: {},
    });
  };

  return (
    <EstimatorShell
      title="Trademark Estimator"
      onBack={onBack}
      total={`₹${total.toLocaleString("en-IN")}`}
      totalNote={`Includes ${classes} Class${classes > 1 ? "es" : ""}`}
      onStartFiling={handleStart}
    >
      <div className="pt-4">
        <h3 className="text-xl font-bold text-[#0d1b2a]">Estimate Filing Cost</h3>
        <p className="text-xs text-gray-400 mt-1 mb-4">Tailored for Individuals, Startups, and Small Entities.</p>
        <SectionLabel>Number of Classes</SectionLabel>
        <div className="flex gap-2 mt-1 mb-1">
          {[1, 2, 3, 4].map((c) => (
            <button
              key={c}
              onClick={() => setClasses(c)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                classes === c ? "bg-blue-600 text-white border-blue-600" : "bg-white text-[#0d1b2a] border-gray-200 hover:border-gray-300"
              }`}
            >
              {c === 4 ? "4+" : `${c} Class`}
            </button>
          ))}
        </div>
        <SectionLabel>Standard Fees</SectionLabel>
        <FeeRow icon="account_balance" label="Government Fee" sub="Form TM-A Filing" amount={`₹${govFee.toLocaleString("en-IN")}`} />
        <FeeRow icon="gavel" label="Professional Fee" sub="Attorney Review & Filing" amount={`₹${PROFESSIONAL.toLocaleString("en-IN")}`} />
        <SectionLabel>Optional Add-Ons</SectionLabel>
        <ToggleRow label="Pre-filing Search" sub="₹1,500" checked={opts.preFiling} onChange={() => toggle("preFiling")} />
        <ToggleRow label="Logo Design" sub="₹3,000" checked={opts.logoDesign} onChange={() => toggle("logoDesign")} />
        <ToggleRow label="Expedited Processing" sub="₹10,000" checked={opts.expedited} onChange={() => toggle("expedited")} />
        <div className="mt-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-blue-500 text-base mt-0.5 shrink-0">info</span>
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-0.5">Important Note</p>
                <p className="text-xs text-blue-600 leading-relaxed">Estimated fees are for electronic filings (e-filing) for Individuals/Startups. Physical filings incur a 10% higher government surcharge. Final pricing may vary.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EstimatorShell>
  );
}

/* ─── Copyright Estimator ─── */
const WORK_TYPES = [
  { key: "literary", label: "Literary / Dramatic", icon: "description" },
  { key: "artistic", label: "Artistic", icon: "palette" },
  { key: "musical", label: "Musical", icon: "music_note" },
  { key: "film", label: "Cinematograph Film", icon: "movie" },
];

function CopyrightEstimator({ onBack, onStartFiling }) {
  const GOV = 500;
  const PROFESSIONAL = 3000;
  const EXPEDITED_COST = 5000;
  const [workType, setWorkType] = useState("literary");
  const [expedited, setExpedited] = useState(false);
  const total = GOV + PROFESSIONAL + (expedited ? EXPEDITED_COST : 0);
  const selectedWork = WORK_TYPES.find((w) => w.key === workType);
  const workTypeDefaults = {
    literary: "Literary",
    artistic: "Artistic",
    musical: "Music",
    film: "Cinematograph Film",
  };
  const handleStart = () => {
    onStartFiling({
      service: "copyright",
      total,
      selections: [
        `Work Type: ${selectedWork?.label || "Literary / Dramatic"}`,
        expedited ? "Expedited Registration: Yes" : "Expedited Registration: No",
      ],
      defaults: {
        workType: workTypeDefaults[workType] || "Literary",
      },
    });
  };

  return (
    <EstimatorShell
      title="Copyright Estimator"
      onBack={onBack}
      total={`₹${total.toLocaleString("en-IN")}`}
      totalNote={`Includes ${selectedWork?.label || "Literary Work"}`}
      onStartFiling={handleStart}
    >
      <div className="pt-4">
        <h3 className="text-xl font-bold text-[#0d1b2a]">Estimate Copyright Cost</h3>
        <p className="text-xs text-gray-400 mt-1 mb-4">For Individuals, Startups, and Creative Professionals.</p>
        <SectionLabel>Type of Work</SectionLabel>
        <div className="grid grid-cols-2 gap-2 mt-1 mb-1">
          {WORK_TYPES.map((w) => (
            <button
              key={w.key}
              onClick={() => setWorkType(w.key)}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border text-xs font-semibold transition-colors ${
                workType === w.key
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{w.icon}</span>
              {w.label}
            </button>
          ))}
        </div>
        <SectionLabel>Fee Breakdown</SectionLabel>
        <FeeRow icon="account_balance" label="Government Fee (Official)" sub="Official statutory fee" amount="₹500" />
        <FeeRow icon="description" label="Professional Filing Fee" sub="Agent processing fee" amount="₹3,000" />
        <SectionLabel>Optional Services</SectionLabel>
        <ToggleRow label="Expedited Registration" sub="₹5,000" checked={expedited} onChange={setExpedited} />
        <div className="mt-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-blue-500 text-base mt-0.5 shrink-0">info</span>
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-0.5">Fee Variation Notice</p>
                <p className="text-xs text-blue-600 leading-relaxed">Statutory fees are based on the standard rate for most literary and artistic works. Fees may vary for specific categories like Sound Recordings or Cinematograph Films as per the official Copyright Act.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EstimatorShell>
  );
}

/* ─── Service Chooser ─── */
const SERVICES = [
  { key: "patent",    title: "Patent",             desc: "Utility, provisional, and design patent filing estimates.", icon: "lightbulb" },
  { key: "trademark", title: "Trademark",           desc: "Brand names, logos, and slogan registration costs.",       icon: "verified" },
  { key: "copyright", title: "Copyright",           desc: "Literary, artistic, and musical work protection fees.",    icon: "copyright" },
  { key: "design",    title: "Design Registration", desc: "Industrial design and aesthetic layout estimates.",        icon: "design_services" },
];

/* ─── Page ─── */
function CostEstimatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceFromQuery = searchParams.get("service");
  const validServices = new Set(["patent", "trademark", "copyright", "design"]);
  const service = validServices.has(serviceFromQuery) ? serviceFromQuery : null;

  const openEstimator = (serviceKey) => {
    router.push(`/dashboard/cost-estimator?service=${serviceKey}`);
  };

  const goToEstimatorChooser = () => {
    router.push("/dashboard/cost-estimator");
  };

  const handleStartFiling = (prefillData) => {
    if (prefillData?.service) {
      saveEstimatorPrefill(prefillData);
    }

    const filingRouteByService = {
      patent: "/dashboard/cases/new/patent",
      trademark: "/dashboard/cases/new/trademark",
      copyright: "/dashboard/cases/new/copyright",
      design: "/dashboard/cases/new/design",
    };
    router.push(filingRouteByService[service] || "/dashboard/cases/new");
  };
  return (
    <div className={`mx-auto space-y-5 ${service ? "max-w-4xl" : "max-w-6xl"}`}>
      {!service && (
        <>
          <div>
            <h1 className="text-2xl font-bold text-[#0d1b2a]">IP Cost Estimator</h1>
            <p className="text-sm text-gray-500 mt-1">Get an instant fee breakdown for your IP filing.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0d1b2a] leading-tight">Which service would you like to estimate?</h2>
            <p className="text-sm text-gray-400 mt-1 mb-5 sm:mb-6">Select a category to get an instant fee breakdown for your filing.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => openEstimator(s.key)}
                  className="w-full text-left flex items-center gap-4 p-4 sm:p-5 border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-200 transition-all group min-h-[108px]"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-blue-600 text-2xl">{s.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-bold text-[#0d1b2a]">{s.title}</p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5 leading-snug">{s.desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 text-xl shrink-0">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {service === "patent"    && <PatentEstimator    onBack={goToEstimatorChooser} onStartFiling={handleStartFiling} />}
      {service === "design"    && <DesignEstimator    onBack={goToEstimatorChooser} onStartFiling={handleStartFiling} />}
      {service === "trademark" && <TrademarkEstimator onBack={goToEstimatorChooser} onStartFiling={handleStartFiling} />}
      {service === "copyright" && <CopyrightEstimator onBack={goToEstimatorChooser} onStartFiling={handleStartFiling} />}
    </div>
  );
}

export default function CostEstimatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="w-8 h-8 border-4 border-gray-200 border-t-[#0d1b2a] rounded-full animate-spin" />
        </div>
      }
    >
      <CostEstimatorContent />
    </Suspense>
  );
}
