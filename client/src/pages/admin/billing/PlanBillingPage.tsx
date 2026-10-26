import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import {
  MdCreditCard,
  MdCheckCircle,
  MdFileDownload,
  MdShoppingBag,
  MdClose,
  MdPrint,
} from "react-icons/md";

interface InvoiceRecord {
  id: string;
  forTitle: string;
  amount: string;
  status: "Paid" | "Pending";
  paidBy: string;
  date: string;
}

const INVOICE_HISTORY: InvoiceRecord[] = [
  {
    id: "INV/2627/0379",
    forTitle: "Standard plan · Oct 2026 – Mar 2027",
    amount: "₹2,80,800",
    status: "Paid",
    paidBy: "Bank transfer · 28 Sep",
    date: "28 Sep 2026",
  },
  {
    id: "INV/2627/0287",
    forTitle: "WhatsApp credits · 10,000 pack",
    amount: "₹4,500",
    status: "Paid",
    paidBy: "Online UPI · 12 Jun",
    date: "12 Jun 2026",
  },
  {
    id: "INV/2627/0198",
    forTitle: "Standard plan · Apr–Sep 2026",
    amount: "₹2,80,800",
    status: "Paid",
    paidBy: "Online NetBanking · 3 Apr",
    date: "03 Apr 2026",
  },
  {
    id: "CN/2627/0007",
    forTitle: "Credit note · duplicate charge adjustment on INV/2627/0377",
    amount: "₹4,500",
    status: "Paid",
    paidBy: "Adjusted against Ledger",
    date: "15 Apr 2026",
  },
];

export default function PlanBillingPage() {
  const { showToast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [showGstinModal, setShowGstinModal] = useState(false);

  // Credit pack state
  const [creditPack, setCreditPack] = useState<"whatsapp" | "sms">("whatsapp");
  const [creditQty, setCreditQty] = useState(10000);

  // Billing GST details state
  const [gstDetails, setGstDetails] = useState({
    legalName: "Shiksha Public School Society",
    gstin: "08AAAAA0000A1Z5",
    pan: "AAAAA0000A",
    billingAddress: "Sector 3, Mansarovar, Jaipur, Rajasthan 302020",
    billingEmail: "accounts@shikshapublic.edu.in",
  });

  const handleBuyCreditsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Order initiated for ${creditQty.toLocaleString()} ${creditPack.toUpperCase()} credits. Redirecting to payment gateway...`, "success");
    setShowBuyCreditsModal(false);
  };

  const handleSaveGst = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Tax & GSTIN billing details updated for future invoices.", "success");
    setShowGstinModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F3] font-sans text-[#17201D] p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto space-y-5">
        {/* Header matching Screen 45 */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#17201D]">Plan and billing</h1>
          <p className="text-sm text-[#4F5B57] mt-0.5">
            Your subscription to GuruConnect, invoices and message credits.
          </p>
        </div>

        {/* Top 2 Cards: Current plan & Message credits */}
        <div className="flex flex-wrap gap-4 items-stretch">
          {/* Card 1: Current plan */}
          <section className="flex-1 basis-[360px] bg-white border border-[#DDE2DE] rounded-xl p-5 flex flex-col gap-2.5 shadow-xs">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-[#17201D]">Current plan</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E4F1E8] text-[#1E5A33]">
                Active
              </span>
            </div>

            <div className="text-2xl font-semibold text-[#17201D]">Standard</div>

            <div className="flex justify-between text-sm pt-2 border-t border-[#EEF1EF]">
              <span className="text-[#4F5B57]">Billing period</span>
              <span className="font-medium text-[#17201D]">1 Apr 2026 – 31 Mar 2027</span>
            </div>

            <div className="flex justify-between text-sm pt-2 border-t border-[#EEF1EF]">
              <span className="text-[#4F5B57]">Billable students</span>
              <span className="font-medium text-[#17201D] font-mono">1,248 (counted on 1 Apr)</span>
            </div>

            <div className="flex justify-between text-sm pt-2 border-t border-[#EEF1EF]">
              <span className="text-[#4F5B57]">Add-ons</span>
              <span className="font-medium text-[#17201D]">None</span>
            </div>

            <div className="flex justify-between text-sm pt-2 border-t border-[#EEF1EF]">
              <span className="text-[#4F5B57]">Renews</span>
              <span className="font-medium text-[#17201D]">1 Apr 2027 · auto-renew off</span>
            </div>
          </section>

          {/* Card 2: Message credits */}
          <section className="flex-1 basis-[300px] bg-white border border-[#DDE2DE] rounded-xl p-5 flex flex-col gap-2.5 shadow-xs">
            <h2 className="text-base font-semibold text-[#17201D]">Message credits</h2>

            <div className="grid grid-cols-2 gap-3 py-1">
              <div className="flex flex-col">
                <span className="text-xs text-[#4F5B57]">SMS left</span>
                <span className="font-mono text-2xl font-bold text-[#17201D]">9,640</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#7A4106]">WhatsApp left</span>
                <span className="font-mono text-2xl font-bold text-[#7A4106]">3,120</span>
              </div>
            </div>

            <span className="text-xs text-[#4F5B57]">
              Used this month: 18,260 · OTP messages are free and never blocked
            </span>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowBuyCreditsModal(true)}
                className="h-11 px-5 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white text-sm font-semibold transition shadow-xs"
              >
                Buy credits
              </button>
            </div>
          </section>
        </div>

        {/* Middle Section: Change plan matching Screen 45 */}
        <section className="bg-white border border-[#DDE2DE] rounded-xl p-5 flex flex-col gap-3.5 shadow-xs">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-base font-semibold text-[#17201D]">Change plan</h2>
            <span className="text-xs text-[#4F5B57]">
              Upgrades start now with a prorated invoice; downgrades start at renewal.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Starter Plan */}
            <div className="border border-[#DDE2DE] bg-white rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-[#17201D]">Starter</span>
              </div>
              <span className="font-mono text-sm text-[#17201D]">₹250 / student / year</span>
              <p className="text-xs text-[#3B4643] leading-relaxed">
                Students, attendance, fees, notices, parent app.
              </p>
              <span className="text-xs text-[#4F5B57] mt-auto pt-2">
                Estimate for 1,248 students: ₹3,12,000 + GST
              </span>
              <button
                type="button"
                onClick={() => showToast("Downgrade to Starter queued for renewal on 1 Apr 2027.", "info")}
                className="h-10 px-4 rounded-lg border border-[#C9D1CD] bg-white hover:bg-[#F9FAF8] text-xs font-medium text-[#17201D] transition"
              >
                Downgrade at renewal
              </button>
            </div>

            {/* Standard Plan (Current) */}
            <div className="border-2 border-[#0E5A63] bg-[#F4F9F9] rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-[#17201D]">Standard</span>
                <span className="text-[11px] font-bold text-[#0E5A63] tracking-wider uppercase">CURRENT</span>
              </div>
              <span className="font-mono text-sm text-[#17201D]">₹450 / student / year</span>
              <p className="text-xs text-[#3B4643] leading-relaxed">
                Starter plus timetable, exams, HR and payroll, accounts.
              </p>
              <span className="text-xs text-[#4F5B57] mt-auto pt-2">
                Estimate for 1,248 students: ₹5,61,600 + GST
              </span>
              <button
                type="button"
                disabled
                className="h-10 px-4 rounded-lg border border-[#0E5A63] bg-[#0E5A63]/10 text-xs font-semibold text-[#0E5A63] cursor-default"
              >
                Current plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="border border-[#DDE2DE] bg-white rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-[#17201D]">Premium</span>
              </div>
              <span className="font-mono text-sm text-[#17201D]">₹700 / student / year</span>
              <p className="text-xs text-[#3B4643] leading-relaxed">
                Standard plus transport, hostel, library, inventory, multi-branch, WhatsApp.
              </p>
              <span className="text-xs text-[#4F5B57] mt-auto pt-2">
                Estimate for 1,248 students: ₹8,73,600 + GST
              </span>
              <button
                type="button"
                onClick={() => showToast("Upgrade request for Premium initiated. Prorated invoice generated.", "success")}
                className="h-10 px-4 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white text-xs font-semibold transition"
              >
                Upgrade now
              </button>
            </div>
          </div>
        </section>

        {/* Bottom Section: Invoices and payments matching Screen 45 */}
        <section className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-[#EEF1EF] flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-base font-semibold text-[#17201D]">Invoices and payments</h2>
            <button
              type="button"
              onClick={() => setShowGstinModal(true)}
              className="text-xs font-medium text-[#0E5A63] hover:underline"
            >
              Billing details and GSTIN
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[720px] border-collapse">
              <thead>
                <tr className="bg-[#F2F4F2] text-[#17201D] border-b border-[#DDE2DE]">
                  <th className="py-3 px-4 font-semibold">Invoice</th>
                  <th className="py-3 px-4 font-semibold">For</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Paid by</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1EF]">
                {INVOICE_HISTORY.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F9FAF8] transition">
                    <td className="py-2.5 px-4 font-mono text-xs font-medium text-[#17201D]">
                      {inv.id}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-[#17201D]">{inv.forTitle}</td>
                    <td className="py-2.5 px-4 text-xs font-mono text-right font-medium text-[#17201D]">
                      {inv.amount}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E4F1E8] text-[#1E5A33]">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-[#4F5B57]">{inv.paidBy}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="text-xs font-semibold text-[#0E5A63] hover:underline"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* =========================================================================
          MODAL: INVOICE PDF PREVIEW
         ========================================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DDE2DE] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EEF1EF] pb-3">
              <div>
                <h3 className="font-semibold text-base text-[#17201D]">Tax Invoice · {selectedInvoice.id}</h3>
                <span className="text-xs text-[#4F5B57]">{selectedInvoice.date}</span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-[#4F5B57] hover:text-[#17201D]"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="border border-[#DDE2DE] rounded-lg p-4 bg-[#F9FAF8] space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-[#0E5A63]">GuruConnect Cloud LMS Pvt Ltd</div>
                  <div className="text-[#4F5B57]">GSTIN: 08AAACG1234F1Z8</div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E4F1E8] text-[#1E5A33]">
                  Paid
                </span>
              </div>

              <div className="border-t border-[#DDE2DE] pt-2">
                <div className="text-[#4F5B57]">Billed to:</div>
                <div className="font-semibold text-[#17201D]">{gstDetails.legalName}</div>
                <div className="font-mono text-[#4F5B57]">GSTIN: {gstDetails.gstin}</div>
              </div>

              <div className="border-t border-[#DDE2DE] pt-2 flex justify-between">
                <span>{selectedInvoice.forTitle}</span>
                <span className="font-mono font-bold">{selectedInvoice.amount}</span>
              </div>

              <div className="border-t border-[#DDE2DE] pt-2 text-[11px] text-[#4F5B57]">
                Payment Reference: {selectedInvoice.paidBy}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="h-10 px-4 rounded-lg border border-[#C9D1CD] text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast("Invoice sent to printer spooler", "info");
                }}
                className="h-10 px-4 rounded-lg bg-[#0E5A63] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <MdPrint size={16} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BUY CREDITS
         ========================================================================= */}
      {showBuyCreditsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DDE2DE] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EEF1EF] pb-3">
              <h3 className="font-semibold text-base text-[#17201D]">Purchase Broadcast Message Pack</h3>
              <button
                onClick={() => setShowBuyCreditsModal(false)}
                className="text-[#4F5B57] hover:text-[#17201D]"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleBuyCreditsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Select Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCreditPack("whatsapp")}
                    className={`h-11 rounded-lg border text-xs font-semibold transition ${
                      creditPack === "whatsapp"
                        ? "border-[#0E5A63] bg-[#E3EFEF] text-[#08393F]"
                        : "border-[#C9D1CD] bg-white text-[#17201D]"
                    }`}
                  >
                    WhatsApp Business API
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreditPack("sms")}
                    className={`h-11 rounded-lg border text-xs font-semibold transition ${
                      creditPack === "sms"
                        ? "border-[#0E5A63] bg-[#E3EFEF] text-[#08393F]"
                        : "border-[#C9D1CD] bg-white text-[#17201D]"
                    }`}
                  >
                    DLT National SMS
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Bundle Size</label>
                <select
                  value={creditQty}
                  onChange={(e) => setCreditQty(Number(e.target.value))}
                  className="w-full h-11 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg text-xs"
                >
                  <option value={5000}>5,000 Messages (₹2,500 + GST)</option>
                  <option value={10000}>10,000 Messages (₹4,500 + GST)</option>
                  <option value={25000}>25,000 Messages (₹10,000 + GST)</option>
                  <option value={50000}>50,000 Messages (₹18,000 + GST)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBuyCreditsModal(false)}
                  className="h-10 px-4 rounded-lg border border-[#C9D1CD] text-[#17201D] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white font-semibold shadow-xs"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BILLING & GSTIN
         ========================================================================= */}
      {showGstinModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DDE2DE] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EEF1EF] pb-3">
              <h3 className="font-semibold text-base text-[#17201D]">Billing Details & GSTIN</h3>
              <button
                onClick={() => setShowGstinModal(false)}
                className="text-[#4F5B57] hover:text-[#17201D]"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGst} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Legal Registered Entity Name</label>
                <input
                  type="text"
                  value={gstDetails.legalName}
                  onChange={(e) => setGstDetails({ ...gstDetails, legalName: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">GSTIN</label>
                <input
                  type="text"
                  value={gstDetails.gstin}
                  onChange={(e) => setGstDetails({ ...gstDetails, gstin: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Official Billing Address</label>
                <textarea
                  rows={2}
                  value={gstDetails.billingAddress}
                  onChange={(e) => setGstDetails({ ...gstDetails, billingAddress: e.target.value })}
                  className="w-full p-2.5 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGstinModal(false)}
                  className="h-10 px-4 rounded-lg border border-[#C9D1CD] text-[#17201D] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white font-semibold shadow-xs"
                >
                  Save Billing Information
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
