import { useState } from "react";
import { Check, ShieldCheck, Sparkles, Save, Info } from "lucide-react";

export default function SuperAdminPlans() {
  const [plans, setPlans] = useState([
    {
      id: "starter",
      name: "Starter",
      schoolsCount: 58,
      pricePerStudent: "120",
      minYearlyBill: "24,000",
      branches: 1,
      storage: "5 GB",
      features: [
        { label: "Students and admissions CRM", enabled: true },
        { label: "Attendance with instant parent alerts", enabled: true },
        { label: "Fees and online UPI QR payments", enabled: true },
        { label: "Notices and parent app diary", enabled: true },
        { label: "Clash-free timetable scheduling", enabled: false },
        { label: "CBSE & RBSE report cards engine", enabled: false },
        { label: "Staff HR, biometric leave & payroll", enabled: false },
        { label: "Day book accounts & Tally export", enabled: false },
        { label: "Bus transport routes & hostel rooms", enabled: false },
        { label: "Library circulation & inventory", enabled: false }
      ]
    },
    {
      id: "standard",
      name: "Standard",
      schoolsCount: 61,
      pricePerStudent: "240",
      minYearlyBill: "48,000",
      branches: 2,
      storage: "25 GB",
      features: [
        { label: "Students and admissions CRM", enabled: true },
        { label: "Attendance with instant parent alerts", enabled: true },
        { label: "Fees and online UPI QR payments", enabled: true },
        { label: "Notices and parent app diary", enabled: true },
        { label: "Clash-free timetable scheduling", enabled: true },
        { label: "CBSE & RBSE report cards engine", enabled: true },
        { label: "Staff HR, biometric leave & payroll", enabled: true },
        { label: "Day book accounts & Tally export", enabled: true },
        { label: "Bus transport routes & hostel rooms", enabled: false },
        { label: "Library circulation & inventory", enabled: false }
      ]
    },
    {
      id: "premium",
      name: "Premium",
      schoolsCount: 43,
      pricePerStudent: "380",
      minYearlyBill: "95,000",
      branches: 5,
      storage: "100 GB",
      features: [
        { label: "Students and admissions CRM", enabled: true },
        { label: "Attendance with instant parent alerts", enabled: true },
        { label: "Fees and online UPI QR payments", enabled: true },
        { label: "Notices and parent app diary", enabled: true },
        { label: "Clash-free timetable scheduling", enabled: true },
        { label: "CBSE & RBSE report cards engine", enabled: true },
        { label: "Staff HR, biometric leave & payroll", enabled: true },
        { label: "Day book accounts & Tally export", enabled: true },
        { label: "Bus transport routes & hostel rooms", enabled: true },
        { label: "Library circulation & inventory", enabled: true }
      ]
    }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleFeature = (planIdx: number, featIdx: number) => {
    const updated = [...plans];
    updated[planIdx].features[featIdx].enabled = !updated[planIdx].features[featIdx].enabled;
    setPlans(updated);
  };

  const updatePrice = (planIdx: number, field: "pricePerStudent" | "minYearlyBill", val: string) => {
    const updated = [...plans];
    updated[planIdx][field] = val;
    setPlans(updated);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Plans and Pricing
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Price changes automatically apply to new subscriptions and renewals, never mid-term contracts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-gold" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <span>✓ Pricing configuration saved successfully across all regions.</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {plans.map((plan, planIdx) => (
          <div key={plan.id} className="bg-white rounded-2xl border border-line p-6 shadow-2xs space-y-5">
            
            {/* Plan Header */}
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div>
                <h2 className="text-xl font-extrabold text-ink m-0">{plan.name}</h2>
                <span className="text-xs text-ink-secondary font-medium">{plan.schoolsCount} schools subscribed</span>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary-tint px-2.5 py-1 rounded-full border border-primary-soft/40">
                Tier {planIdx + 1}
              </span>
            </div>

            {/* Price Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Price per student / year (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary font-mono text-sm">₹</span>
                  <input
                    type="text"
                    value={plan.pricePerStudent}
                    onChange={(e) => updatePrice(planIdx, "pricePerStudent", e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-surface text-ink font-mono font-bold text-base rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Minimum yearly billing floor (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary font-mono text-sm">₹</span>
                  <input
                    type="text"
                    value={plan.minYearlyBill}
                    onChange={(e) => updatePrice(planIdx, "minYearlyBill", e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-surface text-ink font-mono font-bold text-base rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Feature Modules Checklist */}
            <div className="space-y-2 pt-2 border-t border-line">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">Modules Included</span>
              <div className="space-y-2">
                {plan.features.map((feat, featIdx) => (
                  <label key={featIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-ink cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={feat.enabled}
                      onChange={() => toggleFeature(planIdx, featIdx)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className={feat.enabled ? "font-medium text-ink" : "text-ink-secondary"}>
                      {feat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quota Specs */}
            <div className="p-3 bg-surface rounded-xl border border-line text-xs text-ink-secondary space-y-1 pt-3">
              <div className="flex justify-between">
                <span>Multi-branch support:</span>
                <span className="font-bold text-ink">{plan.branches} branch{plan.branches > 1 ? "es" : ""}</span>
              </div>
              <div className="flex justify-between">
                <span>Encrypted cloud storage:</span>
                <span className="font-bold text-ink">{plan.storage}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl bg-surface-subtle border border-line flex items-center gap-3 text-xs text-ink-secondary">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <span>GST at 18% (SAC 998313 — Information technology software services) is automatically levied on checkout.</span>
      </div>

    </div>
  );
}
