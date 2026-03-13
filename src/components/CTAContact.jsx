"use client";
import { useState } from "react";

const services = [
  "Patent Filing",
  "Trademark Filing",
  "Design Registration",
  "Copyright Registration",
  "Prior-Art Search",
  "FER / Examination Response",
  "IP Consultation",
];

export default function CTAContact() {
  const [form, setForm] = useState({
    fullName: "",
    organization: "",
    email: "",
    phone: "",
    city: "",
    service: "Patent Filing",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Request received. Our team will contact you shortly on email or phone.");
  };

  return (
    <section id="contact" className="py-24 bg-[#f7f7f8]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
        {/* Left */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="inline-flex items-center gap-2 bg-[#fff7e8] border border-[#f5a623]/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#0d1b2a]">
              PATENT-IPR Helpdesk
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-[#0d1b2a] leading-tight mb-4">
            Start Your IP Filing with a Professional Team
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-7">
            PATENT-IPR supports startups, SMEs, research groups, and enterprises
            with structured filing workflows for patents, trademarks, designs,
            and copyright across India.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                Response Window
              </p>
              <p className="text-sm font-bold text-[#0d1b2a] mt-1">Within 1 business day</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                Consultation Hours
              </p>
              <p className="text-sm font-bold text-[#0d1b2a] mt-1">Mon-Sat, 10:00 AM-6:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Right – Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-4"
        >
          <div>
            <h3 className="text-xl font-bold text-[#0d1b2a]">Request a Consultation</h3>
            <p className="text-sm text-gray-500 mt-1">
              Share your requirement. Our team will contact you with scope,
              process, and next steps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Organization
              </label>
              <input
                type="text"
                name="organization"
                placeholder="Company / Startup / Institute"
                value={form.organization}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Phone (India)
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors"
                required
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
              City / State
            </label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Chandigarh, Punjab"
              value={form.city}
              onChange={handleChange}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Briefly describe your idea, current filing stage, and what support you need."
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] focus:outline-none focus:border-[#f5a623] transition-colors resize-none"
            />
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            By submitting this form, you agree to be contacted regarding your
            IP filing query and service requirements.
          </p>

          <button
            type="submit"
            className="w-full bg-[#0d1b2a] text-white font-semibold py-3.5 rounded-lg hover:bg-[#1a2f4a] transition-colors text-sm tracking-wide"
          >
            Submit Request
          </button>
        </form>
      </div>
    </section>
  );
}
