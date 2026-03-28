"use client";
import { useEffect, useState } from "react";
import {
  getAdminUsers,
  getAdminClients,
  updateAdminUserRole,
  deleteAdminUser,
  createAdminUser,
} from "@/lib/api";

const ROLES = ["client", "agent", "admin"];

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function AdminClientsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("client");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({ totalPages: 0, totalElements: 0 });
  const [busyId, setBusyId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "agent" });
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    const result = await getAdminUsers({
      role: roleFilter || undefined,
      search: search || undefined,
      page,
      size: 20,
    });

    if (!result.ok) {
      setError(result.data?.message || "Unable to load users.");
      setUsers([]);
      setMeta({ totalPages: 0, totalElements: 0 });
    } else {
      setUsers(result.items || []);
      setMeta({
        totalPages: result.pagination?.totalPages ?? 0,
        totalElements: result.pagination?.totalElements ?? 0,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [roleFilter, search, page]);

  const handleRoleUpdate = async (userId, role) => {
    if (!role) return;
    setBusyId(userId);
    const res = await updateAdminUserRole(userId, role);
    if (!res.ok) setError(res.data?.message || "Failed to update role.");
    else await load();
    setBusyId("");
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Permanently delete this user?")) return;
    setBusyId(userId);
    const res = await deleteAdminUser(userId);
    if (!res.ok) setError(res.data?.message || "Failed to delete user.");
    else await load();
    setBusyId("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);

    const res = await createAdminUser(createForm);
    if (!res.ok) {
      setCreateError(res.data?.message || "Failed to create user.");
    } else {
      setShowCreate(false);
      setCreateForm({ name: "", email: "", password: "", role: "agent" });
      await load();
    }
    setCreateLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#10243a]">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all users — clients, agents, and admins.</p>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors"
        >
          {showCreate ? "Cancel" : "+ Create User"}
        </button>
      </div>

      {/* Create User Form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-[#10243a] mb-4">Create Admin / Agent User</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input
                type="text"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                required
                value={createForm.email}
                onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={createForm.password}
                onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            {createError && <p className="text-xs text-red-500 col-span-2">{createError}</p>}
            <div className="col-span-2">
              <button
                type="submit"
                disabled={createLoading}
                className="bg-[#10243a] text-white rounded-lg px-6 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors disabled:opacity-50"
              >
                {createLoading ? "Creating…" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
        >
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}s</option>)}
        </select>

        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2"
        />

        <button onClick={load} className="bg-[#10243a] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#1a3655] transition-colors">
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["User ID", "Name", "Email", "Role", "Joined", "Change Role", "Actions"].map((head) => (
                <th key={head} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">Loading users...</td></tr>}
            {!loading && users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50">
                <td className="px-5 py-4 text-xs font-semibold text-[#10243a]">{user.id || "-"}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#10243a]">{user.name || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-600">{user.email || "-"}</td>
                <td className="px-5 py-4 text-xs text-gray-700 uppercase">{user.role || "client"}</td>
                <td className="px-5 py-4 text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                <td className="px-5 py-4">
                  <select
                    className="border border-gray-200 rounded-md px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                    disabled={busyId === user.id}
                  >
                    <option value="">Change role…</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={busyId === user.id}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Total: {meta.totalElements}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page <= 0}
            className="border border-gray-200 rounded px-3 py-1 text-xs disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-gray-600">Page {meta.totalPages === 0 ? 0 : page + 1} of {meta.totalPages}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={meta.totalPages === 0 || page >= meta.totalPages - 1}
            className="border border-gray-200 rounded px-3 py-1 text-xs disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
