"use client";
import { useState } from "react";

const docs = [];

const typeColors = { PDF: "bg-red-100 text-red-600", DOC: "bg-blue-100 text-blue-600", IMG: "bg-green-100 text-green-600" };

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const filtered = docs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.case.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1b2a]">Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">All files and documents across your portfolio cases.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0d1b2a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a2f4a] transition-colors">
          <span className="material-symbols-outlined text-base">upload</span> Upload
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-sm">
          <span className="material-symbols-outlined text-gray-400 text-base">search</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents..." className="text-sm text-gray-600 bg-transparent outline-none w-full placeholder:text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["File Name", "Case ID", "Category", "Size", "Date", ""].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${typeColors[d.type]}`}>{d.type}</span>
                    <span className="text-xs font-medium text-[#0d1b2a]">{d.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs font-semibold text-[#f5a623]">{d.case}</td>
                <td className="px-5 py-3.5 text-xs text-gray-500">{d.category}</td>
                <td className="px-5 py-3.5 text-xs text-gray-500">{d.size}</td>
                <td className="px-5 py-3.5 text-xs text-gray-500">{d.date}</td>
                <td className="px-5 py-3.5">
                  <button className="text-gray-400 hover:text-[#0d1b2a] transition-colors">
                    <span className="material-symbols-outlined text-base">download</span>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                  No documents available. Files will appear once fetched from backend.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
