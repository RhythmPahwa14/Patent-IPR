"use client";
import { useState } from "react";

const services = [
  "Patent Filing",
  "Trademark Protection",
  "Copyright Registration",
  "Design Registration",
  "Portfolio Management",
  "Cost Estimator",
];

export default function CTAContact() {
  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    phone: "",
    service: "Patent Filing",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Request sent! We'll get back to you within 24 hours.");
  };

  return (
    <section id="contact" className="py-24 bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            Ready to Secure Your Intellectual Property?
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10">
            Consult with our expert IP attorneys today. Get a clear roadmap for
            your filings and a detailed cost estimate within 24 hours.
          </p>

          {/* Online attorneys badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-5 py-2.5">
            {/* Avatar cluster */}
            <div className="flex -space-x-2">
              {["bg-[#4a7c59]", "bg-[#f5a623]", "bg-blue-500"].map((bg, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full ${bg} border-2 border-[#0d1b2a] flex items-center justify-center text-white text-[9px] font-bold`}
                >
                  {["JA", "MR", "KL"][i]}
                </div>
              ))}
            </div>
            <span className="text-white text-sm font-semibold">
              12 Attorneys Online Now
            </span>
          </div>
        </div>

        {/* Right – Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Work Email
              </label>
              <input
                type="email"
                name="workEmail"
                placeholder="john@company.com"
                value={form.workEmail}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (234) 567 890"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Service Needed
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors bg-white"
              >
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Briefly describe your innovation…"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0d1b2a] text-white font-semibold py-3.5 rounded-lg hover:bg-[#1a2f4a] transition-colors text-sm tracking-wide"
          >
            Send Request
          </button>
        </form>
      </div>
    </section>
  );
}
