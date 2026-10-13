import { useState } from "react";
import { MessageSquare, Plus, Search, ShieldCheck, AlertCircle, ArrowUpRight, CheckCircle2, X, SlidersHorizontal, ShoppingCart } from "lucide-react";

export default function SuperAdminCredits() {
  const [search, setSearch] = useState("");
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState<any | null>(null);

  const [schools, setSchools] = useState([
    { id: "1", name: "Vidya Bharati Group, Jaipur", smsLeft: "42,800", waLeft: "18,200", usedThisMonth: "21,460", status: "OK" },
    { id: "2", name: "Shiksha Public School, Alwar", smsLeft: "9,640", waLeft: "3,120", usedThisMonth: "18,260", status: "OK" },
    { id: "3", name: "Adarsh Vidya Niketan, Bikaner", smsLeft: "1,120", waLeft: "310", usedThisMonth: "12,940", status: "Low" },
    { id: "4", name: "Little Flowers School, Sikar", smsLeft: "0", waLeft: "0", usedThisMonth: "4,210", status: "Empty" },
    { id: "5", name: "Shiksha Career Academy, Kota", smsLeft: "6,900", waLeft: "—", usedThisMonth: "2,880", status: "OK" },
    { id: "6", name: "Gyan Jyoti School, Jodhpur", smsLeft: "380", waLeft: "—", usedThisMonth: "1,620", status: "Low" }
  ]);

  const [adjustForm, setAdjustForm] = useState({
    school: "Adarsh Vidya Niketan, Bikaner",
    channel: "SMS",
    amount: 5000,
    action: "add",
    reason: "Promised emergency quota topup awaiting annual fee settlement."
  });

  const [purchaseForm, setPurchaseForm] = useState({
    gateway: "SMS DLT (ValueFirst / Gupshup)",
    quantity: 500000,
    rate: 0.12,
    reference: "PO-2026-99182"
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Adjusted ${adjustForm.amount} ${adjustForm.channel} credits for ${adjustForm.school}. Audit entry saved.`);
    setShowAdjustModal(false);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Recorded gateway pool purchase of ${purchaseForm.quantity.toLocaleString()} credits. Total: ₹${(purchaseForm.quantity * purchaseForm.rate).toLocaleString()}`);
    setShowPurchaseModal(false);
  };

  const filteredSchools = schools.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Message Credits & Gateways
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Platform-wide SMS DLT and WhatsApp Business API credit pools. Transactional OTPs are always prioritized.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAdjustModal(true)}
            className="px-4 py-2.5 bg-white border border-line text-ink text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:bg-surface cursor-pointer"
          >
            Adjust School Credits
          </button>
          <button 
            onClick={() => setShowPurchaseModal(true)}
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Record Gateway Pool Purchase</span>
          </button>
        </div>
      </div>

      {/* 4-Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Platform Pool · SMS</span>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">1,82,400</div>
          <span className="text-xs text-ink-secondary">Cost ₹0.12 / SMS credit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Platform Pool · WhatsApp</span>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">64,900</div>
          <span className="text-xs text-ink-secondary">Utility & marketing rates separate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Delivered This Month</span>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">2,41,300</div>
          <span className="text-xs text-ink-secondary font-mono">1.58L SMS · 83.1K WhatsApp</span>
        </div>

        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
          <span className="text-xs font-bold text-amber-900 uppercase">Schools Under 10%</span>
          <div className="text-2xl font-extrabold text-amber-900 font-mono mt-1">7</div>
          <span className="text-xs font-bold text-amber-800">Auto-topup alert dispatched</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h2 className="text-base font-bold text-ink m-0">Schools by Balance Quota</h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search school quota..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface rounded-xl border border-line focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr className="bg-surface border-b border-line text-ink-secondary text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">School</th>
                <th className="py-3 px-4 text-right">SMS Balance</th>
                <th className="py-3 px-4 text-right">WhatsApp Balance</th>
                <th className="py-3 px-4 text-right">Consumed This Month</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredSchools.map((s, idx) => (
                <tr key={idx} className="hover:bg-primary-tint/10 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink">{s.name}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium">{s.smsLeft}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium">{s.waLeft}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-ink-secondary">{s.usedThisMonth}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      s.status === "OK" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : s.status === "Low"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={() => setSelectedLedger(s)}
                      className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-tint/40 rounded-lg border border-primary-soft/40 cursor-pointer"
                    >
                      Ledger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST CREDITS MODAL */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-line p-6 relative">
            <button onClick={() => setShowAdjustModal(false)} className="absolute top-4 right-4 text-ink-muted hover:text-ink cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink m-0">Adjust School Credits</h3>
            </div>
            <p className="text-xs text-ink-secondary mb-4">Manual allocation or topup for an institutional tenant.</p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">School</label>
                <select
                  value={adjustForm.school}
                  onChange={(e) => setAdjustForm({...adjustForm, school: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink"
                >
                  {schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Channel</label>
                  <select
                    value={adjustForm.channel}
                    onChange={(e) => setAdjustForm({...adjustForm, channel: e.target.value})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink"
                  >
                    <option value="SMS">SMS DLT</option>
                    <option value="WhatsApp">WhatsApp Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Quantity</label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={adjustForm.amount}
                    onChange={(e) => setAdjustForm({...adjustForm, amount: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Audit Reason *</label>
                <textarea
                  rows={2}
                  required
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({...adjustForm, reason: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAdjustModal(false)} className="px-4 py-2 border border-line text-ink-secondary rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md cursor-pointer">
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD POOL PURCHASE MODAL */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-line p-6 relative">
            <button onClick={() => setShowPurchaseModal(false)} className="absolute top-4 right-4 text-ink-muted hover:text-ink cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink m-0">Record Gateway Pool Purchase</h3>
            </div>
            <p className="text-xs text-ink-secondary mb-4">Add wholesale messaging units purchased from telecom gateways.</p>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Gateway Provider</label>
                <select
                  value={purchaseForm.gateway}
                  onChange={(e) => setPurchaseForm({...purchaseForm, gateway: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink"
                >
                  <option>SMS DLT (ValueFirst / Gupshup)</option>
                  <option>Meta WhatsApp Business Cloud API</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Credits Count</label>
                  <input
                    type="number"
                    min={10000}
                    step={10000}
                    value={purchaseForm.quantity}
                    onChange={(e) => setPurchaseForm({...purchaseForm, quantity: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Unit Rate (₹)</label>
                  <input
                    type="number"
                    step={0.01}
                    value={purchaseForm.rate}
                    onChange={(e) => setPurchaseForm({...purchaseForm, rate: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Vendor Purchase Invoice No.</label>
                <input
                  type="text"
                  required
                  value={purchaseForm.reference}
                  onChange={(e) => setPurchaseForm({...purchaseForm, reference: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink"
                  placeholder="e.g. INV-VF-98124"
                />
              </div>

              <div className="p-3 bg-surface rounded-xl border border-line flex justify-between text-xs font-bold">
                <span className="text-ink-secondary">Total PO Amount:</span>
                <span className="text-primary font-mono text-sm">₹{(purchaseForm.quantity * purchaseForm.rate).toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowPurchaseModal(false)} className="px-4 py-2 border border-line text-ink-secondary rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md cursor-pointer">
                  Record & Credit Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHOOL LEDGER MODAL */}
      {selectedLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-line p-6 relative">
            <button onClick={() => setSelectedLedger(null)} className="absolute top-4 right-4 text-ink-muted hover:text-ink cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-ink mb-1">{selectedLedger.name} · Credit Ledger</h3>
            <p className="text-xs text-ink-secondary mb-4">Complete debit/credit transaction records for this tenant.</p>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-surface rounded-xl border border-line">
                  <span className="text-[11px] text-ink-secondary uppercase font-bold">SMS Left</span>
                  <div className="text-base font-extrabold font-mono text-ink mt-0.5">{selectedLedger.smsLeft}</div>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-line">
                  <span className="text-[11px] text-ink-secondary uppercase font-bold">WhatsApp Left</span>
                  <div className="text-base font-extrabold font-mono text-ink mt-0.5">{selectedLedger.waLeft}</div>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-line">
                  <span className="text-[11px] text-ink-secondary uppercase font-bold">Monthly Usage</span>
                  <div className="text-base font-extrabold font-mono text-ink mt-0.5">{selectedLedger.usedThisMonth}</div>
                </div>
              </div>

              <div className="border border-line rounded-xl overflow-hidden mt-3">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface border-b border-line font-bold text-ink-secondary uppercase">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5 text-right">Debit / Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    <tr>
                      <td className="p-2.5 font-mono text-ink-secondary">12 Oct 09:15</td>
                      <td className="p-2.5"><span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded-md font-bold text-[10px]">DEBIT</span></td>
                      <td className="p-2.5 text-ink">Daily absentee notifications (SMS DLT)</td>
                      <td className="p-2.5 text-right font-mono font-bold text-rose-600">-640</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-ink-secondary">10 Oct 14:30</td>
                      <td className="p-2.5"><span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px]">CREDIT</span></td>
                      <td className="p-2.5 text-ink">Annual package quota allocation</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-700">+10,000</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-ink-secondary">08 Oct 11:20</td>
                      <td className="p-2.5"><span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded-md font-bold text-[10px]">DEBIT</span></td>
                      <td className="p-2.5 text-ink">Term exam progress card dispatch (WhatsApp)</td>
                      <td className="p-2.5 text-right font-mono font-bold text-rose-600">-1,200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setSelectedLedger(null)} className="px-4 py-2 bg-nav-bg text-white rounded-xl text-xs font-bold cursor-pointer">
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
