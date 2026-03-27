"use client";
import { useEffect, useState } from "react";
import { getAdminProfile } from "@/lib/api";

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    const result = await getAdminProfile();
    if (!result.ok) {
      setError(result.data?.message || "Unable to load admin profile.");
      setProfile(null);
      setLoading(false);
      return;
    }

    setProfile(result.profile || null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#10243a]">Admin Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Identity and system-level summary for this admin account.</p>
        </div>
        <button onClick={load} className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors">
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading && <div className="bg-white rounded-xl border border-gray-100 p-8 text-sm text-gray-400">Loading profile...</div>}

      {!loading && profile && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Name</p>
              <p className="text-lg font-semibold text-[#10243a]">{profile.name || "-"}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Email</p>
              <p className="text-lg font-semibold text-[#10243a]">{profile.email || "-"}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Role</p>
              <p className="text-sm font-semibold text-[#10243a] uppercase">{profile.role || "admin"}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Created</p>
              <p className="text-sm font-semibold text-[#10243a]">{formatDate(profile.createdAt)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Agents</p>
              <p className="text-2xl font-bold text-[#10243a]">{profile.summary?.totalAgents ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Clients</p>
              <p className="text-2xl font-bold text-[#10243a]">{profile.summary?.totalClients ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Total Filings</p>
              <p className="text-2xl font-bold text-[#10243a]">{profile.summary?.totalFilings ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Active</p>
              <p className="text-2xl font-bold text-[#10243a]">{profile.summary?.activeFilings ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">Decided</p>
              <p className="text-2xl font-bold text-[#10243a]">{profile.summary?.decidedFilings ?? 0}</p>
            </div>
          </div>
        </>
      )}

      {!loading && !profile && !error && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-sm text-gray-400">No admin profile data available.</div>
      )}
    </div>
  );
}
