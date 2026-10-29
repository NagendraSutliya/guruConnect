import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import {
  MdShoppingBag,
  MdClose,
  MdPrint,
  MdReceiptLong,
  MdCheck,
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

type PlanTier = "starter" | "standard" | "premium";

interface PlanItem {
  id: PlanTier;
  name: string;
  price: string;
  description: string;
  estimate: string;
  isCurrent: boolean;
  actionToast: string;
}

const AVAILABLE_PLANS: PlanItem[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₹250 / student / year",
    description: "Students, attendance, fees, notices, parent app.",
    estimate: "₹3,12,000",
    isCurrent: false,
    actionToast: "Downgrade to Starter queued for renewal on 1 Apr 2027.",
  },
  {
    id: "standard",
    name: "Standard",
    price: "₹450 / student / year",
    description: "Starter plus timetable, exams, HR and payroll, accounts.",
    estimate: "₹5,61,600",
    isCurrent: true,
    actionToast: "Your institute is currently subscribed to the Standard plan.",
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹700 / student / year",
    description: "Standard plus transport, hostel, library, inventory, multi-branch, WhatsApp.",
    estimate: "₹8,73,600",
    isCurrent: false,
    actionToast: "Upgrade request for Premium initiated. Prorated invoice generated.",
  },
];

export default function PlanBillingPage() {
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("standard");
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
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching Settings, Reports, Users & Communication) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Plan & billing
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Plan and billing
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Your subscription to GuruConnect, invoices and message credits.
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowGstinModal(true)}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <MdReceiptLong size={16} className="text-ink-secondary" />
            <span>Billing details & GSTIN</span>
          </button>
          <button
            type="button"
            onClick={() => setShowBuyCreditsModal(true)}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-2 active:scale-[0.98]"
          >
            <MdShoppingBag size={16} />
            <span>Buy credits</span>
          </button>
        </div>
      </div>

      {/* Top 2 Cards: Current plan & Message credits */}
      <div className="flex flex-wrap gap-5 items-stretch">
        {/* Card 1: Current plan */}
        <section className="flex-1 basis-[360px] min-w-[280px] bg-white border border-line rounded-card p-5 flex flex-col gap-3 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-line-row">
            <h2 className="text-base font-semibold text-ink">Current plan</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success-bg text-success-text">
              Active
            </span>
          </div>

          <div className="text-2xl font-semibold text-ink tracking-tight">Standard</div>

          <div className="flex justify-between items-center text-[13.5px] pt-2 border-t border-line-row">
            <span className="text-ink-secondary">Billing period</span>
            <span className="font-medium text-ink">1 Apr 2026 – 31 Mar 2027</span>
          </div>

          <div className="flex justify-between items-center text-[13.5px] pt-2 border-t border-line-row">
            <span className="text-ink-secondary">Billable students</span>
            <span className="font-medium text-ink font-mono">1,248 (counted on 1 Apr)</span>
          </div>

          <div className="flex justify-between items-center text-[13.5px] pt-2 border-t border-line-row">
            <span className="text-ink-secondary">Add-ons</span>
            <span className="font-medium text-ink">None</span>
          </div>

          <div className="flex justify-between items-center text-[13.5px] pt-2 border-t border-line-row">
            <span className="text-ink-secondary">Renews</span>
            <span className="font-medium text-ink">1 Apr 2027 · auto-renew off</span>
          </div>
        </section>

        {/* Card 2: Message credits */}
        <section className="flex-1 basis-[300px] min-w-[280px] bg-white border border-line rounded-card p-5 flex flex-col gap-3 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-line-row">
            <h2 className="text-base font-semibold text-ink">Message credits</h2>
            <span className="text-xs text-ink-secondary">Real-time balance</span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-ink-secondary">SMS left</span>
              <span className="font-mono text-2xl font-bold text-ink">9,640</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-warning-text">WhatsApp left</span>
              <span className="font-mono text-2xl font-bold text-warning-text">3,120</span>
            </div>
          </div>

          <div className="text-xs text-ink-secondary leading-relaxed bg-surface-subtle p-2.5 rounded-control border border-line-row">
            Used this month: <span className="font-mono font-medium text-ink">18,260</span> · OTP messages are free and never blocked
          </div>

          <div className="pt-1 mt-auto">
            <button
              type="button"
              onClick={() => setShowBuyCreditsModal(true)}
              className="min-h-[40px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-2 active:scale-[0.98]"
            >
              <MdShoppingBag size={16} />
              <span>Buy credits</span>
            </button>
          </div>
        </section>
      </div>

      {/* Middle Section: Change plan matching Screen 45 */}
      <section className="bg-white border border-line rounded-card p-5 flex flex-col gap-4 shadow-xs">
        <div className="flex justify-between items-baseline gap-2 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-ink">Change plan</h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              Click any plan to select. Upgrades start now with a prorated invoice; downgrades start at renewal.
            </p>
          </div>
          {selectedPlan !== "standard" && (
            <span className="text-xs font-semibold text-primary bg-primary-tint px-2.5 py-1 rounded-full border border-primary/20 animate-fadeIn">
              Selected: {AVAILABLE_PLANS.find((p) => p.id === selectedPlan)?.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AVAILABLE_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`rounded-card p-4 flex flex-col gap-3 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "border-2 border-primary bg-primary-row ring-2 ring-primary/20 shadow-sm"
                    : "border border-line bg-white hover:border-line-input hover:bg-surface-subtle"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-primary text-white"
                          : "border border-line-input bg-white"
                      }`}
                    >
                      {isSelected && <MdCheck size={12} />}
                    </div>
                    <span className="text-base font-semibold text-ink">{plan.name}</span>
                  </div>
                  {plan.isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary-tint border border-primary/30">
                      CURRENT
                    </span>
                  )}
                </div>

                <span
                  className={`font-mono text-[15px] font-semibold transition-colors ${
                    isSelected ? "text-primary-dark" : "text-ink"
                  }`}
                >
                  {plan.price}
                </span>

                <p className="text-xs text-ink-body2 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                <div
                  className={`text-xs text-ink-secondary mt-auto pt-2 border-t ${
                    isSelected ? "border-primary-tint-border" : "border-line-row"
                  }`}
                >
                  Estimate for 1,248 students:{" "}
                  <span className="font-mono font-medium text-ink">{plan.estimate}</span> + GST
                </div>

                <div className="pt-1">
                  {plan.isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className={`w-full min-h-[38px] px-4 rounded-control text-xs font-semibold cursor-default text-center flex items-center justify-center gap-1.5 transition ${
                        isSelected
                          ? "bg-primary text-white"
                          : "border border-line-input bg-surface-subtle text-ink-secondary"
                      }`}
                    >
                      <MdCheck size={16} />
                      <span>Current plan</span>
                    </button>
                  ) : isSelected ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(plan.actionToast, plan.id === "premium" ? "success" : "info");
                      }}
                      className={`w-full min-h-[38px] px-4 rounded-control text-xs font-semibold transition cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs ${
                        plan.id === "premium"
                          ? "bg-primary hover:bg-primary-dark text-white"
                          : "border-2 border-primary bg-white hover:bg-primary-tint text-primary-dark"
                      }`}
                    >
                      <span>{plan.id === "premium" ? "Upgrade now" : "Downgrade at renewal"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan.id);
                      }}
                      className="w-full min-h-[38px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-medium text-ink transition cursor-pointer text-center"
                    >
                      <span>Select {plan.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Section: Invoices and payments matching Screen 45 */}
      <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-line-row flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="text-base font-semibold text-ink">Invoices and payments</h2>
            <span className="text-xs text-ink-secondary">View past tax invoices, credit notes and payment receipts</span>
          </div>
          <button
            type="button"
            onClick={() => setShowGstinModal(true)}
            className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline cursor-pointer flex items-center gap-1"
          >
            <MdReceiptLong size={15} />
            <span>Billing details and GSTIN</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed w-full min-w-[760px] border-collapse text-left">
            <colgroup>
              <col className="w-[170px]" />
              <col className="w-auto" />
              <col className="w-[140px]" />
              <col className="w-[110px]" />
              <col className="w-[200px]" />
              <col className="w-[80px]" />
            </colgroup>
            <thead>
              <tr className="bg-surface-head text-ink border-b border-line text-xs font-semibold">
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-4">For</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Paid by</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-row">
              {INVOICE_HISTORY.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-subtle transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-medium text-ink">
                    {inv.id}
                  </td>
                  <td className="py-3 px-4 text-xs text-ink">{inv.forTitle}</td>
                  <td className="py-3 px-4 text-xs font-mono text-right font-semibold text-ink">
                    {inv.amount}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success-text whitespace-nowrap">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-ink-secondary">{inv.paidBy}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(inv)}
                      className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline cursor-pointer"
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

      {/* =========================================================================
          MODAL: INVOICE PDF PREVIEW
         ========================================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-card border border-line max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-line-row pb-3">
              <div>
                <h3 className="font-semibold text-base text-ink">Tax Invoice · {selectedInvoice.id}</h3>
                <span className="text-xs text-ink-secondary">{selectedInvoice.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-control flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="border border-line rounded-control p-4 bg-surface-subtle space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-primary">GuruConnect Cloud LMS Pvt Ltd</div>
                  <div className="text-ink-secondary">GSTIN: 08AAACG1234F1Z8</div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success-bg text-success-text">
                  Paid
                </span>
              </div>

              <div className="border-t border-line-row pt-2">
                <div className="text-ink-secondary">Billed to:</div>
                <div className="font-semibold text-ink">{gstDetails.legalName}</div>
                <div className="font-mono text-ink-secondary">GSTIN: {gstDetails.gstin}</div>
              </div>

              <div className="border-t border-line-row pt-2 flex justify-between">
                <span>{selectedInvoice.forTitle}</span>
                <span className="font-mono font-bold text-ink">{selectedInvoice.amount}</span>
              </div>

              <div className="border-t border-line-row pt-2 text-[11px] text-ink-secondary">
                Payment Reference: {selectedInvoice.paidBy}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-line-row">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="min-h-[38px] px-4 rounded-control border border-line-input text-xs font-medium text-ink hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast("Invoice sent to printer spooler", "info");
                }}
                className="min-h-[38px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <MdPrint size={16} /> <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BUY CREDITS
         ========================================================================= */}
      {showBuyCreditsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-card border border-line max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-line-row pb-3">
              <h3 className="font-semibold text-base text-ink">Purchase Broadcast Message Pack</h3>
              <button
                type="button"
                onClick={() => setShowBuyCreditsModal(false)}
                className="w-8 h-8 rounded-control flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleBuyCreditsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-secondary font-medium mb-1">Select Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCreditPack("whatsapp")}
                    className={`h-11 rounded-control border text-xs font-semibold transition cursor-pointer ${
                      creditPack === "whatsapp"
                        ? "border-primary bg-primary-tint text-primary-dark"
                        : "border-line-input bg-white text-ink hover:bg-slate-50"
                    }`}
                  >
                    WhatsApp Business API
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreditPack("sms")}
                    className={`h-11 rounded-control border text-xs font-semibold transition cursor-pointer ${
                      creditPack === "sms"
                        ? "border-primary bg-primary-tint text-primary-dark"
                        : "border-line-input bg-white text-ink hover:bg-slate-50"
                    }`}
                  >
                    DLT National SMS
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-ink-secondary font-medium mb-1">Bundle Size</label>
                <select
                  value={creditQty}
                  onChange={(e) => setCreditQty(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-surface-subtle border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition-colors"
                >
                  <option value={5000}>5,000 Messages (₹2,500 + GST)</option>
                  <option value={10000}>10,000 Messages (₹4,500 + GST)</option>
                  <option value={25000}>25,000 Messages (₹10,000 + GST)</option>
                  <option value={50000}>50,000 Messages (₹18,000 + GST)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-line-row">
                <button
                  type="button"
                  onClick={() => setShowBuyCreditsModal(false)}
                  className="min-h-[38px] px-4 rounded-control border border-line-input text-ink font-medium hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[38px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold shadow-xs transition-colors cursor-pointer text-xs"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-card border border-line max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-line-row pb-3">
              <h3 className="font-semibold text-base text-ink">Billing Details & GSTIN</h3>
              <button
                type="button"
                onClick={() => setShowGstinModal(false)}
                className="w-8 h-8 rounded-control flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGst} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-secondary font-medium mb-1">Legal Registered Entity Name</label>
                <input
                  type="text"
                  value={gstDetails.legalName}
                  onChange={(e) => setGstDetails({ ...gstDetails, legalName: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-subtle border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-secondary font-medium mb-1">GSTIN</label>
                <input
                  type="text"
                  value={gstDetails.gstin}
                  onChange={(e) => setGstDetails({ ...gstDetails, gstin: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-subtle border border-line-input rounded-control font-mono text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-secondary font-medium mb-1">Official Billing Address</label>
                <textarea
                  rows={2}
                  value={gstDetails.billingAddress}
                  onChange={(e) => setGstDetails({ ...gstDetails, billingAddress: e.target.value })}
                  className="w-full p-2.5 bg-surface-subtle border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-line-row">
                <button
                  type="button"
                  onClick={() => setShowGstinModal(false)}
                  className="min-h-[38px] px-4 rounded-control border border-line-input text-ink font-medium hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[38px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold shadow-xs transition-colors cursor-pointer text-xs"
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
