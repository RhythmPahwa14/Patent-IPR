"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = "https://patent-ipr-backend-springboot-dug6aphbfrfuadh3.southindia-01.azurewebsites.net";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    emailId: "",
    phone: "",
    password: "",
    individual: true,
    agreed: false,
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setError("");
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.emailId.trim()) errs.emailId = "Email is required";
    if (!form.password || form.password.length < 8 || !/[^a-zA-Z0-9]/.test(form.password))
      errs.password = "Must be at least 8 characters with one special symbol";
    if (!form.agreed) errs.agreed = "You must agree to the terms";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setLoading(true);
    setError("");
    try {
      const parts = form.fullName.trim().split(" ");
      const name = parts[0];
      const lastName = parts.slice(1).join(" ") || parts[0];
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          lastName,
          emailId: form.emailId,
          individual: form.individual,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-10 px-6 pt-16">
      {/* Logo */}
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0d1b2a] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[#f5a623] text-xl">verified_user</span>
          </div>
          <span className="text-sm font-extrabold tracking-tight text-[#0d1b2a]">PATENT-IPR</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#0d1b2a] mb-4">Create Your Account</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0d1b2a]">Full Name</label>
            <div className={`flex items-center border rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors ${fieldErrors.fullName ? "border-red-400" : "border-gray-200"}`}>
              <span className="material-symbols-outlined text-gray-400 text-base">person</span>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
              />
            </div>
            {fieldErrors.fullName && <p className="text-xs text-red-500">{fieldErrors.fullName}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0d1b2a]">Email</label>
            <div className={`flex items-center border rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors ${fieldErrors.emailId ? "border-red-400" : "border-gray-200"}`}>
              <span className="material-symbols-outlined text-gray-400 text-base">mail</span>
              <input
                type="email"
                name="emailId"
                value={form.emailId}
                onChange={handleChange}
                placeholder="name@company.com"
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
              />
            </div>
            {fieldErrors.emailId && <p className="text-xs text-red-500">{fieldErrors.emailId}</p>}
          </div>

          {/* Phone
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0d1b2a]">Phone Number</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors">
              <span className="material-symbols-outlined text-gray-400 text-base">call</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
              />
            </div>
          </div> */}

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0d1b2a]">Password</label>
            <div className={`flex items-center border rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors ${fieldErrors.password ? "border-red-400" : "border-gray-200"}`}>
              <span className="material-symbols-outlined text-gray-400 text-base">lock</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
              />
            </div>
            <p className={`text-xs ${fieldErrors.password ? "text-red-500" : "text-gray-400"}`}>
              Must be at least 8 characters with one special symbol
            </p>
          </div>

          {/* Account Type */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-[#0d1b2a]">Account type:</label>
            <button
              type="button"
              onClick={() => setForm({ ...form, individual: true })}
              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${form.individual ? "bg-[#0d1b2a] text-white border-[#0d1b2a]" : "border-gray-300 text-gray-500"}`}
            >
              Individual
            </button>
            {/* <button
              type="button"
              onClick={() => setForm({ ...form, individual: false })}
              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${!form.individual ? "bg-[#0d1b2a] text-white border-[#0d1b2a]" : "border-gray-300 text-gray-500"}`}
            >
              Firm
            </button> */}
          </div>

          {/* Terms */}
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                name="agreed"
                id="agreed"
                checked={form.agreed}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 accent-[#0d1b2a] cursor-pointer"
              />
              <label htmlFor="agreed" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-[#0d1b2a] font-semibold underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#0d1b2a] font-semibold underline">Privacy Policy</Link>.
              </label>
            </div>
            {fieldErrors.agreed && <p className="text-xs text-red-500 ml-6">{fieldErrors.agreed}</p>}
          </div>

          {/* API error */}
          {error && <p className="text-xs text-red-500 -mt-2">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0d1b2a] text-white py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1a2f4a] transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Creating account…" : <>Create Account <span className="material-symbols-outlined text-base">arrow_forward</span></>}
          </button>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-sm text-gray-500 pb-4">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">
          Log in here
        </Link>
      </p>
    </div>
  );
}
