"use client";

const payments = [];

const totalDue = payments.filter((p) => p.status === "DUE").reduce((s, p) => s + p.amount, 0);
const totalPaid = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);

export default function PaymentsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0d1b2a]">Payments</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage invoices and fees across your IP portfolio.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "PENDING DUE", value: `$${totalDue.toLocaleString()}`, icon: "warning", color: "text-red-500" },
          { label: "PAID THIS YEAR", value: `$${totalPaid.toLocaleString()}`, icon: "check_circle", color: "text-green-600" },
          { label: "TOTAL INVOICES", value: payments.length, icon: "receipt_long", color: "text-[#0d1b2a]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
              <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-[#0d1b2a]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0d1b2a]">Invoice History</h2>
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-sm">download</span> Export
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Invoice ID", "Case", "Description", "Amount", "Status", "Date", ""].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold tracking-widest text-gray-400 uppercase px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === payments.length - 1 ? "border-0" : ""}`}>
                <td className="px-5 py-3.5 text-xs font-semibold text-[#0d1b2a]">{p.id}</td>
                <td className="px-5 py-3.5 text-xs font-semibold text-[#f5a623]">{p.case}</td>
                <td className="px-5 py-3.5 text-xs text-gray-500">{p.desc}</td>
                <td className="px-5 py-3.5 text-sm font-bold text-[#0d1b2a]">${p.amount.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded tracking-wider ${p.statusColor}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-500">{p.date}</td>
                <td className="px-5 py-3.5">
                  {p.status === "DUE" && (
                    <button className="text-xs font-semibold text-white bg-[#0d1b2a] px-3 py-1.5 rounded-lg hover:bg-[#1a2f4a] transition-colors">Pay Now</button>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">
                  No invoices available. Billing records will appear after backend sync.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
