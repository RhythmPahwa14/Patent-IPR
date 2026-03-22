"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState(() => {
    const user = getStoredUser();
    return {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "CLIENT",
    };
  });
  const [saved, setSaved] = useState(false);

  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/login"); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account information and preferences.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-5 mb-7 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-2xl font-bold">
            {(form.name || "U").charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0d1b2a]">{form.name || "User"}</h2>
            <p className="text-sm text-gray-500">{form.role}</p>
            <p className="text-xs text-gray-400">{form.email || "-"}</p>
          </div>
          <button className="ml-auto text-xs font-semibold border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Change Photo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { label: "Name", key: "name" },
            { label: "Email Address", key: "email", type: "email" },
            { label: "Role", key: "role" },
          ].map(({ label, key, type = "text" }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-[#0d1b2a] block mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => handle(key, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#0d1b2a] transition-colors"
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Profile update API is not available in the provided backend contract yet. Save currently updates this screen only.
        </p>

        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
          <button onClick={save} className="bg-[#0d1b2a] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors">
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
          <button className="text-sm font-medium text-gray-500 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Change Password
          </button>
          <button onClick={logout} className="ml-auto text-sm font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">logout</span> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
