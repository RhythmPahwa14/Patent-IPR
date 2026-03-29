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
    <section id="contact" className="py-24 md:py-32 bg-white border-b border-[#e0eaf3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#f8f9fa] border border-[#e0eaf3] rounded-[3rem] p-8 md:p-16 grid md:grid-cols-2 gap-12 lg:gap-24 items-start shadow-sm">
          {/* Left */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e0eaf3] rounded-full mb-2 w-max shadow-sm">
               <span className="text-[11px] font-bold text-[#4b5563] tracking-[0.15em] uppercase">Helpdesk</span>
            </div>

            <h2 className="text-[44px] md:text-[56px] font-medium text-[#1a1a1a] leading-[1.1] tracking-tight">
              Start your IP filing <br /> with the experts.
            </h2>
            <p className="text-[#4b5563] text-[18px] md:text-[20px] font-normal tracking-tight leading-relaxed max-w-[400px]">
              PATENT-IPR supports startups, SMEs, research groups, and enterprises
              with structured filing workflows for patents, trademarks, designs,
              and copyright.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <div className="border border-[#e0eaf3] bg-white rounded-2xl flex-1 p-6 shadow-sm">
                <p className="text-[11px] uppercase tracking-widest text-[#4b5563] font-bold mb-2">
                  Response Window
                </p>
                <p className="text-[18px] font-bold text-[#1a1a1a]">Within 1 business day</p>
              </div>
              <div className="border border-[#e0eaf3] bg-white rounded-2xl flex-1 p-6 shadow-sm">
                <p className="text-[11px] uppercase tracking-widest text-[#4b5563] font-bold mb-2">
                  Consultation
                </p>
                <p className="text-[18px] font-bold text-[#1a1a1a]">Mon-Sat, 10am - 6pm</p>
              </div>
            </div>
          </div>

          {/* Right – Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 w-full"
          >
            <div className="mb-4">
              <h3 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight mb-2">Request Consultation</h3>
              <p className="text-[16px] font-medium text-[#4b5563] leading-relaxed">
                Provide your details below. Our technical experts will reach out regarding next steps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="bg-white border text-[#1a1a1a] border-[#e0eaf3] rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-[#1a3d54] focus:ring-1 focus:ring-[#1a3d54] transition-all shadow-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-widest">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  placeholder="Company/Startup"
                  value={form.organization}
                  onChange={handleChange}
                  className="bg-white border text-[#1a1a1a] border-[#e0eaf3] rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-[#1a3d54] focus:ring-1 focus:ring-[#1a3d54] transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-white border text-[#1a1a1a] border-[#e0eaf3] rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-[#1a3d54] focus:ring-1 focus:ring-[#1a3d54] transition-all shadow-sm"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-widest">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  className="bg-white border text-[#1a1a1a] border-[#e0eaf3] rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-[#1a3d54] focus:ring-1 focus:ring-[#1a3d54] transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-widest">
                  Service Needed
               </label>
               <select
                 name="service"
                 value={form.service}
                 onChange={handleChange}
                 className="bg-white border text-[#1a1a1a] border-[#e0eaf3] rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-[#1a3d54] focus:ring-1 focus:ring-[#1a3d54] transition-all appearance-none shadow-sm"
               >
                 {services.map((s) => (
                   <option key={s} value={s}>
                     {s}
                   </option>
                 ))}
               </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-[#1a1a1a] uppercase tracking-widest">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Briefly describe your idea, current stage, and what support you need."
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="bg-white border text-[#1a1a1a] border-[#e0eaf3] rounded-xl px-4 py-3.5 text-[15px] font-medium focus:outline-none focus:border-[#1a3d54] focus:ring-1 focus:ring-[#1a3d54] transition-all resize-none shadow-sm"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-[#1a3d54] text-white px-8 py-4 uppercase tracking-widest text-[14px] font-medium hover:bg-[#112a3c] rounded-full transition-colors shadow-lg shadow-[#1a3d54]/20 hover:-translate-y-0.5"
              >
                Submit Request
              </button>
            </div>
            
            <p className="text-[11.5px] font-medium text-[#4b5563] mt-2 leading-relaxed text-center">
               By submitting, you agree to be contacted regarding your query and service requirements.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
