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
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F4F5F7] rounded-[3rem] p-8 md:p-16 grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full w-max shadow-sm border border-gray-100">
              <span className="material-symbols-outlined text-sm text-blue-500">support_agent</span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Helpdesk
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Start your IP filing with a professional team
            </h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              PATENT-IPR supports startups, SMEs, research groups, and enterprises
              with structured filing workflows for patents, trademarks, designs,
              and copyright across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="rounded-2xl border border-black/[0.04] bg-white flex-1 p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                  Response Window
                </p>
                <p className="text-sm font-bold text-slate-900">Within 1 business day</p>
              </div>
              <div className="rounded-2xl border border-black/[0.04] bg-white flex-1 p-5 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                  Consultation Hours
                </p>
                <p className="text-sm font-bold text-slate-900">Mon-Sat, 10am - 6pm</p>
              </div>
            </div>
          </div>

          {/* Right – Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-5"
          >
            <div className="mb-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Request a Consultation</h3>
              <p className="text-[15px] font-medium text-gray-500 mt-2 leading-relaxed">
                Share your requirement. Our team will contact you with scope,
                process, and next steps.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  placeholder="Company/Startup"
                  value={form.organization}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Phone (India)
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Service Needed
               </label>
               <select
                 name="service"
                 value={form.service}
                 onChange={handleChange}
                 className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all appearance-none"
               >
                 {services.map((s) => (
                   <option key={s} value={s}>
                     {s}
                   </option>
                 ))}
               </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Briefly describe your idea, current stage, and what support you need."
                value={form.message}
                onChange={handleChange}
                rows={3}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="mt-2">
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors text-[15px] tracking-wide shadow-lg hover:-translate-y-0.5"
              >
                Submit Request
              </button>
            </div>
            
            <p className="text-[11px] font-medium text-gray-400 text-center mt-2 px-4 leading-relaxed">
               By submitting, you agree to be contacted regarding your query and service requirements.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
