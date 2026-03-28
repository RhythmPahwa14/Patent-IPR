"use client";
import { useEffect, useState } from "react";
import { getAgentProfile } from "@/lib/api";

export default function AgentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getAgentProfile();
      if (result.ok) {
        setProfile(result.profile);
      } else {
        setError("Unable to load profile.");
        setProfile({ name: "Agent", email: "", role: "agent" });
      }
      setLoading(false);
    };
    load();
  }, []);

  const displayProfile = profile || { name: "Agent", email: "", role: "agent" };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Agent Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your workspace preferences and profile details.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0d1b2a] text-white flex items-center justify-center text-lg font-bold">
            {loading ? "?" : displayProfile.name?.charAt(0) || "A"}
          </div>
          <div>
            <p className="text-lg font-semibold text-[#0d1b2a]">{loading ? "Loading..." : displayProfile.name}</p>
            <p className="text-sm text-gray-400 uppercase tracking-wider">{displayProfile.role}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p>
            <p className="font-semibold text-[#0d1b2a] mt-1">{displayProfile.email || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">User ID</p>
            <p className="font-semibold text-[#0d1b2a] mt-1 text-xs font-mono">{displayProfile.id || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Role</p>
            <p className="font-semibold text-[#0d1b2a] mt-1 capitalize">{displayProfile.role || "agent"}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Specialization</p>
            <p className="font-semibold text-[#0d1b2a] mt-1">Patent & IP Review</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-[#0d1b2a]">Notification Preferences</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-500">
            <label className="flex items-center justify-between">
              <span>New assignment alerts</span>
              <input type="checkbox" defaultChecked className="accent-[#0d1b2a]" />
            </label>
            <label className="flex items-center justify-between">
              <span>Daily queue summary</span>
              <input type="checkbox" defaultChecked className="accent-[#0d1b2a]" />
            </label>
            <label className="flex items-center justify-between">
              <span>Status update notifications</span>
              <input type="checkbox" defaultChecked className="accent-[#0d1b2a]" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-[#0d1b2a]">Security</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-500">
            <p>Two-factor authentication: <span className="font-semibold text-green-600">Enabled</span></p>
            <p>Session: <span className="font-semibold text-[#0d1b2a]">Active</span></p>
            <button className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[#0d1b2a]">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Manage Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}