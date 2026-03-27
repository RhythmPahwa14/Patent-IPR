"use client";
import { useEffect, useState } from "react";
import { getAdminClients } from "@/lib/api";

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    const result = await getAdminClients();
    if (!result.ok) {
      setError(result.data?.message || "Unable to load clients.");
      setClients([]);
      setLoading(false);
      return;
    }

    setClients(result.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#10243a]">Clients</h1>
        <p className="text-sm text-gray-500 mt-0.5">Registered client users in the admin system.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button onClick={load} className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors">
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Client ID", "Name", "Email", "Role", "Created"].map((head) => (
                <th key={head} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">Loading clients...</td></tr>}
            {!loading && clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-50">
                <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{client.id || "-"}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{client.name || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{client.email || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-700 uppercase">{client.role || "client"}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{formatDate(client.createdAt)}</td>
              </tr>
            ))}
            {!loading && clients.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">No clients found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
