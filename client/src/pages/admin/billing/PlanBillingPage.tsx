import React, { useState } from "react";
import {
  FiCreditCard,
  FiCheckCircle,
  FiMessageSquare,
  FiSmartphone,
  FiDownload,
  FiShoppingBag,
  FiShield
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface Invoice {
  invoiceNo: string;
  forItem: string;
  amount: number;
  status: "Paid" | "Pending";
  paidBy: string;
}

const INVOICES: Invoice[] = [
  { invoiceNo: "INV/2627/0379", forItem: "Standard Annual Subscription · Oct 2026 – Mar 2027", amount: 149760, status: "Paid", paidBy: "Bank transfer · 28 Sep" },
  { invoiceNo: "INV/2627/0287", forItem: "WhatsApp Business Credits · 10,000 pack", amount: 4500, status: "Paid", paidBy: "Online UPI · 12 Jun" },
  { invoiceNo: "INV/2627/0198", forItem: "Standard Annual Subscription · Apr–Sep 2026", amount: 149760, status: "Paid", paidBy: "Online NetBanking · 3 Apr" }
];

export default function PlanBillingPage() {
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "standard" | "premium">("standard");

  const handleBuyCredits = () => {
    showToast("Opening WhatsApp & SMS credit bundle store...", "info");
  };

  const handleDownloadInvoice = (invNo: string) => {
    showToast(`Downloading tax invoice ${invNo} with GSTIN details (PDF)...`, "success");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Plan & Billing</h1>
        <p className="text-xs text-navy-muted mt-0.5">
          Your institution subscription to GuruConnect, official invoices, and message broadcast credits.
        </p>
      </div>

      {/* Top 2 Cards: Current Plan & Message Credits matching Screen 45 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Current Plan Card */}
        <div className="md:col-span-7 bg-surface border border-line rounded-panel p-5 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-navy">Current Active Plan</h2>
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active
            </span>
          </div>

          <div className="text-2xl font-bold text-navy">Institutional Standard</div>

          <div className="divide-y divide-line/60 space-y-2 pt-1">
            <div className="flex justify-between pt-2">
              <span className="text-navy-muted">Billing Cycle</span>
              <span className="font-medium text-navy">1 Apr 2026 – 31 Mar 2027</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-navy-muted">Enrolled Billable Students</span>
              <span className="font-mono font-bold text-navy">1,248 (Counted on 1 Apr)</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-navy-muted">Annual Renewal</span>
              <span className="font-medium text-navy">1 Apr 2027 · Auto-renewal off</span>
            </div>
          </div>
        </div>

        {/* Message Credits Card */}
        <div className="md:col-span-5 bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4 text-xs">
          <h2 className="font-semibold text-sm text-navy">Notification & SMS Credits</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-page rounded-control border border-line/60 space-y-0.5">
              <span className="text-navy-muted text-[11px]">SMS Balance</span>
              <div className="font-mono text-2xl font-bold text-navy">9,640</div>
            </div>
            <div className="p-3 bg-page rounded-control border border-line/60 space-y-0.5">
              <span className="text-amber-800 text-[11px] font-medium">WhatsApp Left</span>
              <div className="font-mono text-2xl font-bold text-amber-800">3,120</div>
            </div>
          </div>

          <div className="text-navy-muted text-[11px]">
            Consumed this month: 18,260 · Emergency OTP login messages are always free and never blocked.
          </div>

          <button
            onClick={handleBuyCredits}
            className="w-full py-2.5 bg-teal hover:bg-teal-hover text-white rounded-control font-bold text-xs shadow-xs transition"
          >
            Buy Message Credits
          </button>
        </div>
      </div>

      {/* Plan Tier Comparison from Screen 45 */}
      <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
        <div>
          <h2 className="font-bold text-base text-navy">Plan Tiers & Upgrades</h2>
          <p className="text-xs text-navy-muted">
            Upgrades start immediately with a prorated tax invoice; downgrades take effect at annual renewal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Starter */}
          <div className="border border-line rounded-panel p-4 space-y-3 bg-surface flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="font-bold text-base text-navy">Starter</div>
              <div className="font-mono text-sm font-semibold text-teal">₹150 / student / year</div>
              <p className="text-navy-muted leading-relaxed">
                Core student database, biometric attendance, counter fee collection, notices, and parent portal app.
              </p>
            </div>
            <button
              onClick={() => showToast("Downgrade request queued for renewal date.", "info")}
              className="w-full py-2 border border-line rounded-control bg-page hover:bg-surface font-semibold text-navy text-xs"
            >
              Downgrade at Renewal
            </button>
          </div>

          {/* Standard (Current) */}
          <div className="border-2 border-teal bg-teal/5 rounded-panel p-4 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-navy">Standard</span>
                <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-teal text-white">
                  CURRENT PLAN
                </span>
              </div>
              <div className="font-mono text-sm font-semibold text-teal">₹240 / student / year</div>
              <p className="text-navy leading-relaxed font-medium">
                Starter plus automated timetable generator, examination report cards, staff HR, biometric payroll, and accounts day book.
              </p>
            </div>
            <button
              disabled
              className="w-full py-2 rounded-control bg-teal/20 text-teal font-bold text-xs cursor-default"
            >
              Currently Active
            </button>
          </div>

          {/* Premium */}
          <div className="border border-line rounded-panel p-4 space-y-3 bg-surface flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="font-bold text-base text-navy">Enterprise Premium</div>
              <div className="font-mono text-sm font-semibold text-teal">₹360 / student / year</div>
              <p className="text-navy-muted leading-relaxed">
                Standard plus GPS bus tracking, hostel beds, library barcode scanner, inventory assets, and multi-branch sync.
              </p>
            </div>
            <button
              onClick={() => showToast("Initiating Enterprise Premium upgrade invoice...", "success")}
              className="w-full py-2 bg-teal hover:bg-teal-hover text-white rounded-control font-bold text-xs shadow-xs transition"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table from Screen 45 */}
      <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
        <div className="p-4 border-b border-line flex items-center justify-between gap-3 bg-page/30">
          <h2 className="font-bold text-sm text-navy">Invoices & Tax Receipts</h2>
          <span className="text-xs text-navy-muted">GSTIN: 08AABCG1290K1Z9 Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                <th className="py-3 px-4 w-36">Invoice No.</th>
                <th className="py-3 px-4">Item & Billing Period</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Settlement Mode</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {INVOICES.map(inv => (
                <tr key={inv.invoiceNo} className="hover:bg-page/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-navy">{inv.invoiceNo}</td>
                  <td className="py-3 px-4 font-medium text-navy">{inv.forItem}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-navy">
                    ₹{inv.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-navy-muted">{inv.paidBy}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv.invoiceNo)}
                      className="text-teal font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <FiDownload size={13} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
