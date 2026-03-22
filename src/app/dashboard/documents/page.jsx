"use client";
import { useEffect, useMemo, useState } from "react";
import { apiRequest, getClientPatents } from "@/lib/api";

const typeColors = { PDF: "bg-red-100 text-red-600", DOC: "bg-blue-100 text-blue-600", IMG: "bg-green-100 text-green-600" };

function detectType(url = "") {
  const lower = url.toLowerCase();
  if (lower.endsWith(".pdf")) return "PDF";
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) return "DOC";
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".webp")) return "IMG";
  return "DOC";
}

function formatDate(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      setError("");

      const result = await getClientPatents({ page: 0, size: 100, sort: "submittedAt,desc" });
      if (!result.ok) {
        setError(result.data?.message || "Unable to load documents.");
        setDocs([]);
        setLoading(false);
        return;
      }

      const filings = result.items || [];

      const detailed = await Promise.all(
        filings.slice(0, 30).map(async (f) => {
          const ref = f.referenceNumber;
          if (!ref) return null;
          const detailResult = await apiRequest(`/api/v1/patents/${encodeURIComponent(ref)}`);
          if (!detailResult.ok) return null;
          return detailResult.data?.data || null;
        })
      );

      const items = detailed
        .filter((f) => f && f.supportingDocumentUrl)
        .map((f) => ({
          id: f.referenceNumber || f.patentId,
          name: `${f.referenceNumber || "Filing"}-supporting-document`,
          case: f.referenceNumber || "-",
          category: f.fieldOfInvention || "Patent",
          size: "-",
          date: formatDate(f.submittedAt),
          type: detectType(f.supportingDocumentUrl),
          url: f.supportingDocumentUrl,
        }));

      setDocs(items);
      setLoading(false);
    };

    loadDocuments();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return docs.filter((d) => d.name.toLowerCase().includes(q) || d.case.toLowerCase().includes(q));
  }, [docs, search]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d1b2a]">Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">All files and documents across your portfolio cases.</p>
        </div>
        <button disabled className="flex items-center gap-2 bg-[#0d1b2a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg opacity-60 cursor-not-allowed">
          <span className="material-symbols-outlined text-base">upload</span> Upload
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

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
                  {d.url ? (
                    <a href={d.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#0d1b2a] transition-colors">
                      <span className="material-symbols-outlined text-base">download</span>
                    </a>
                  ) : (
                    <span className="text-gray-300 material-symbols-outlined text-base">download</span>
                  )}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                  No supporting documents available.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                  Loading documents...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
