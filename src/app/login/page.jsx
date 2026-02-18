"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = "https://patent-ipr-backend-springboot-dug6aphbfrfuadh3.southindia-01.azurewebsites.net";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ emailId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-10 px-6">
      {/* Logo */}
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#0d1b2a] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[#f5a623] text-xl">verified_user</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-[#0d1b2a]">PATENT-IPR</span>
            <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">Intellectual Property Rights</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#0d1b2a] mb-6">Welcome Back</h1>
        {/* <p className="text-sm text-gray-500 mb-8">
          Securely access your global patent portfolio and legal assets.
        </p> */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0d1b2a]">Email Address</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors">
              <span className="material-symbols-outlined text-gray-400 text-base">mail</span>
              <input
                type="email"
                name="emailId"
                value={form.emailId}
                onChange={handleChange}
                placeholder="legal@company.com"
                required
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#0d1b2a]">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-[#f5a623] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-3 gap-2 focus-within:border-[#0d1b2a] transition-colors">
              <span className="material-symbols-outlined text-gray-400 text-base">lock</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="flex-1 text-sm text-[#0d1b2a] outline-none placeholder:text-gray-400 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-[#0d1b2a] transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 -mt-2">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0d1b2a] text-white py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1a2f4a] transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Logging in…" : <>Log In to Dashboard <span className="material-symbols-outlined text-base">arrow_forward</span></>}
          </button>
        </form>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          <span className="material-symbols-outlined text-green-600 text-sm">lock</span>
          <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">AES-256 Bit Encrypted Secure Access</span>
        </div>
      </div>

      {/* Footer link */}
      <p className="text-sm text-gray-500">
        New to the firm?{" "}
        <Link href="/signup" className="font-semibold text-[#0d1b2a] hover:text-[#f5a623] transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
}
