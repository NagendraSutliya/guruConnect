import { useState } from "react";
import { 
  Receipt, 
  Search, 
  Plus, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  X,
  CreditCard
} from "lucide-react";

export default function SuperAdminBilling() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const initialInvoices = [
    {
      id: "INV/2627/0431",
      school: "Shiksha Career Academy, Kota",
      planDesc: "Starter · trial conversion · 1,120 students",
      baseAmount: "1,34,400",
      gst: "24,192",
      total: "1,58,592",
      dueDate: "25 Oct 2026",
      status: "Due",
      gstin: "08AAKCS9921B1Z2",
      hsn: "998313"
    },
    {
      id: "INV/2627/0428",
      school: "Bal Vidya Mandir, Ajmer",
      planDesc: "Standard · 640 students · session 26-27",
      baseAmount: "1,53,600",
      gst: "27,648",
      total: "1,81,248",
      dueDate: "18 Oct 2026",
      status: "Overdue",
      gstin: "08AABBV1102C1Z4",
      hsn: "998313"
    },
    {
      id: "INV/2627/0422",
      school: "Delhi Public Academy, Jaipur",
      planDesc: "Premium · 1,850 students + WhatsApp Add-on",
      baseAmount: "7,03,000",
      gst: "1,26,540",
      total: "8,29,540",
      dueDate: "10 Oct 2026",
      status: "Paid",
      gstin: "08AAPDJ7710K1ZP",
      hsn: "998313"
    },
    {
      id: "INV/2627/0415",
      school: "Gyan Jyoti Public School, Bikaner",
      planDesc: "Standard · 410 students",
      baseAmount: "98,400",
      gst: "17,712",
      total: "1,16,112",
      dueDate: "02 Oct 2026",
      status: "Overdue",
      gstin: "08AAAGJ3341H1ZU",
      hsn: "998313"
    },
    {
      id: "INV/2627/0401",
      school: "Sunrise Convent School, Udaipur",
      planDesc: "Standard · 790 students",
      baseAmount: "1,89,600",
      gst: "34,128",
      total: "2,23,728",
      dueDate: "01 Oct 2026",
      status: "Paid",
      gstin: "08AABCS9912F1Z9",
      hsn: "998313"
    }
  ];

  const [invoices, setInvoices] = useState(initialInvoices);

  const stats = {
    invoicedMonth: "₹3,48,200",
    invoicedCount: invoices.length,
    receivedMonth: "₹2,64,000",
    receivedCount: invoices.filter(i => i.status === "Paid").length,
    overdueAmount: "₹1,42,100",
    overdueSchools: invoices.filter(i => i.status === "Overdue").length,
    renewalsNext30: 17
  };

  // New Invoice Form State
  const [newInvoiceData, setNewInvoiceData] = useState({
    school: "Adarsh Vidya Niketan Trust, Jodhpur",
    gstin: "08AAKCS9921B1Z2",
    placeOfSupply: "Rajasthan (08) · CGST + SGST",
    itemDesc: "Data import service — 3 files & Staff Training",
    sac: "998431",
    qty: 1,
    rate: 15000,
    dueDate: "30 Oct 2026"
  });

  const handleCreateInvoiceSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    const taxable = newInvoiceData.qty * newInvoiceData.rate;
    const gstVal = taxable * 0.18;
    const totalVal = taxable + gstVal;
    const newId = `INV/2627/04${Math.floor(10 + Math.random() * 89)}`;

    const newInv = {
      id: newId,
      school: newInvoiceData.school,
      planDesc: `${newInvoiceData.itemDesc} (Qty: ${newInvoiceData.qty})`,
      baseAmount: taxable.toLocaleString("en-IN"),
      gst: gstVal.toLocaleString("en-IN"),
      total: totalVal.toLocaleString("en-IN"),
      dueDate: newInvoiceData.dueDate,
      status: isDraft ? "Due" : "Due",
      gstin: newInvoiceData.gstin,
      hsn: newInvoiceData.sac
    };

    setInvoices([newInv, ...invoices]);
    setShowNewInvoiceModal(false);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesTab = activeTab === "All" || inv.status === activeTab;
    const matchesSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
                          inv.school.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Billing & Invoices
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            GST-compliant invoices, automated Razorpay settlement, and overdue collection log.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border border-line hover:bg-surface text-ink text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-xs">
            Export GST Report (GSTR-1)
          </button>
          <button
            onClick={() => setShowNewInvoiceModal(true)}
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Generate New Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Overview 4-grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Invoiced This Month</span>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">{stats.invoicedMonth}</div>
          <span className="text-xs text-ink-secondary font-medium">{stats.invoicedCount} invoices raised</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Received This Month</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">{stats.receivedMonth}</div>
          <span className="text-xs text-ink-secondary font-medium">{stats.receivedCount} successful payments</span>
        </div>

        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
          <span className="text-xs font-bold text-amber-900 uppercase">Overdue Balance</span>
          <div className="text-2xl font-extrabold text-amber-900 font-mono mt-1">{stats.overdueAmount}</div>
          <span className="text-xs font-bold text-amber-800">{stats.overdueSchools} schools past grace</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Renewals in 30 Days</span>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">{stats.renewalsNext30}</div>
          <span className="text-xs text-ink-secondary font-medium">Auto-debit active on 9</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden space-y-4">
        
        {/* Table Filter Header */}
        <div className="p-4 border-b border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {["All", "Due", "Paid", "Overdue"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab
                    ? "bg-nav-bg text-white"
                    : "text-ink-secondary hover:text-ink hover:bg-surface"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-ink-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by invoice ID or school..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface border-b border-line text-ink-secondary text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">School & Plan</th>
                <th className="py-3 px-4 text-right">Taxable</th>
                <th className="py-3 px-4 text-right">GST (18%)</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-primary-tint/10 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary cursor-pointer hover:underline" onClick={() => setSelectedInvoice(inv)}>
                    {inv.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-ink">{inv.school}</div>
                    <div className="text-[11px] text-ink-secondary">{inv.planDesc}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-ink-secondary">
                    ₹{inv.baseAmount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-ink-secondary">
                    ₹{inv.gst}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-ink">
                    ₹{inv.total}
                  </td>
                  <td className="py-3.5 px-4 text-ink-secondary text-xs">
                    {inv.dueDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      inv.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : inv.status === "Overdue"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-tint/40 rounded-lg transition-colors border border-primary-soft/40"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* INVOICE DETAIL MODAL (Specification 08) */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-line flex items-center justify-between bg-surface">
              <div>
                <span className="text-xs font-bold text-primary uppercase">Tax Invoice</span>
                <h2 className="text-xl font-bold font-mono text-ink m-0">{selectedInvoice.id}</h2>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-1.5 text-ink-secondary hover:text-ink rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-line text-xs">
                <div>
                  <span className="text-ink-secondary uppercase font-bold block mb-1">Billed To</span>
                  <div className="font-bold text-sm text-ink">{selectedInvoice.school}</div>
                  <div className="text-ink-secondary font-mono">GSTIN: {selectedInvoice.gstin}</div>
                </div>
                <div className="text-right">
                  <span className="text-ink-secondary uppercase font-bold block mb-1">Service Supplier</span>
                  <div className="font-bold text-sm text-ink">guruConnect Technologies Pvt Ltd</div>
                  <div className="text-ink-secondary font-mono">GSTIN: 08AABCG9910D1ZZ</div>
                  <div className="text-ink-secondary">SAC Code: {selectedInvoice.hsn}</div>
                </div>
              </div>

              {/* Line items table */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Line Items</span>
                <div className="border border-line rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface border-b border-line font-bold">
                      <tr>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5 text-right">Taxable</th>
                        <th className="p-2.5 text-right">CGST (9%)</th>
                        <th className="p-2.5 text-right">SGST (9%)</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2.5 font-medium">{selectedInvoice.planDesc}</td>
                        <td className="p-2.5 text-right font-mono">₹{selectedInvoice.baseAmount}</td>
                        <td className="p-2.5 text-right font-mono">₹{(parseFloat(selectedInvoice.gst.replace(/,/g, '')) / 2).toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono">₹{(parseFloat(selectedInvoice.gst.replace(/,/g, '')) / 2).toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-ink">₹{selectedInvoice.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status pill & settlement */}
              <div className="p-4 bg-surface rounded-xl border border-line flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-ink-secondary font-medium">Payment status:</span>
                  <span className="font-bold text-ink">{selectedInvoice.status}</span>
                </div>
                <div className="text-ink-secondary">
                  Due date: <span className="font-bold text-ink font-mono">{selectedInvoice.dueDate}</span>
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-line bg-surface flex justify-between items-center">
              <button className="px-4 py-2 text-xs font-bold text-ink-secondary hover:text-ink flex items-center gap-1.5 border border-line rounded-xl">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button onClick={() => setSelectedInvoice(null)} className="px-5 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-xs">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NEW INVOICE MODAL (Specification 09) */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-line overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-line flex items-center justify-between bg-surface">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-bold text-ink m-0">Generate Tax Invoice</h2>
                  <span className="text-xs text-ink-secondary">One-off platform billing & professional services</span>
                </div>
              </div>
              <button onClick={() => setShowNewInvoiceModal(false)} className="p-1.5 text-ink-secondary hover:text-ink rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleCreateInvoiceSubmit(e, false)} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Billed To (School / Trust) *</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceData.school}
                    onChange={(e) => setNewInvoiceData({...newInvoiceData, school: e.target.value})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink"
                    placeholder="e.g. Adarsh Vidya Niketan Trust"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={newInvoiceData.gstin}
                    onChange={(e) => setNewInvoiceData({...newInvoiceData, gstin: e.target.value})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink"
                    placeholder="e.g. 08AAKCS9921B1Z2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Place of Supply</label>
                  <select
                    value={newInvoiceData.placeOfSupply}
                    onChange={(e) => setNewInvoiceData({...newInvoiceData, placeOfSupply: e.target.value})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink"
                  >
                    <option>Rajasthan (08) · CGST 9% + SGST 9%</option>
                    <option>Inter-State · IGST 18%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newInvoiceData.dueDate}
                    onChange={(e) => setNewInvoiceData({...newInvoiceData, dueDate: e.target.value})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-line space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Invoice Line Item</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-ink mb-1">Description *</label>
                    <input
                      type="text"
                      required
                      value={newInvoiceData.itemDesc}
                      onChange={(e) => setNewInvoiceData({...newInvoiceData, itemDesc: e.target.value})}
                      className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink"
                      placeholder="Service description"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-ink mb-1">SAC Code</label>
                    <input
                      type="text"
                      value={newInvoiceData.sac}
                      onChange={(e) => setNewInvoiceData({...newInvoiceData, sac: e.target.value})}
                      className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-ink mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={newInvoiceData.qty}
                      onChange={(e) => setNewInvoiceData({...newInvoiceData, qty: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink mb-1">Unit Rate (₹ Taxable) *</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={newInvoiceData.rate}
                    onChange={(e) => setNewInvoiceData({...newInvoiceData, rate: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink max-w-xs"
                  />
                </div>
              </div>

              {/* Live Calculation Box */}
              <div className="p-4 bg-surface rounded-xl border border-line space-y-1.5 text-xs">
                <div className="flex justify-between text-ink-secondary">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono font-bold text-ink">₹{(newInvoiceData.qty * newInvoiceData.rate).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-ink-secondary">
                  <span>GST (18%):</span>
                  <span className="font-mono font-bold text-ink">₹{((newInvoiceData.qty * newInvoiceData.rate) * 0.18).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-line">
                  <span>Grand Total:</span>
                  <span className="font-mono text-primary text-base">₹{((newInvoiceData.qty * newInvoiceData.rate) * 1.18).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={(e) => handleCreateInvoiceSubmit(e, true)}
                  className="px-4 py-2 border border-line text-ink-secondary hover:text-ink font-bold rounded-xl text-xs"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md text-xs"
                >
                  Issue & Email Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
