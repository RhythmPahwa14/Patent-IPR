"use client";
import { useState } from "react";

const docs = [
  { id: 1, name: "First_Examination_Report_2024.pdf", case: "US-10294-A", type: "PDF", size: "2.1 MB", date: "Jan 18, 2024", category: "Examination" },
  { id: 2, name: "Patent_Grant_Certificate.pdf", case: "US-10294-A", type: "PDF", size: "0.8 MB", date: "Oct 12, 2023", category: "Certificate" },
  { id: 3, name: "Application_Draft_Final.docx", case: "EU-22019-B", type: "DOC", size: "1.4 MB", date: "Nov 04, 2023", category: "Application" },
  { id: 4, name: "Prior_Art_Search_Report.pdf", case: "US-9921-A", type: "PDF", size: "3.8 MB", date: "Nov 15, 2023", category: "Search Report" },
  { id: 5, name: "Office_Action_Response.docx", case: "US-11582-X", type: "DOC", size: "2.2 MB", date: "Oct 29, 2023", category: "Response" },
  { id: 6, name: "Formal_Drawings_v2.png", case: "CN-48921-C", type: "IMG", size: "4.5 MB", date: "Oct 15, 2023", category: "Drawings" },
  { id: 7, name: "Rejection_Notice.pdf", case: "JP-99231-K", type: "PDF", size: "1.1 MB", date: "Sep 20, 2023", category: "Notice" },
];

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
          </tbody>
        </table>
      </div>
    </div>
  );
}
