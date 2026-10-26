import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiPlus,
  FiCheckCircle,
  FiSave,
  FiX,
  FiClock,
  FiHelpCircle
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import FeesModuleNav from "../../../components/admin/fees/FeesModuleNav";

interface FeeRow {
  id: string;
  name: string;
  subtitle: string;
  frequency: "Quarterly" | "One-time" | "Annual";
  nurseryUkg: number;
  class1to5: number;
  class6to8: number;
  class9to10: number;
  class11to12: number;
  hasWarning?: boolean;
}

const INITIAL_FEE_ROWS: FeeRow[] = [
  {
    id: "f1",
    name: "Tuition",
    subtitle: "Exempt from GST",
    frequency: "Quarterly",
    nurseryUkg: 36000,
    class1to5: 48000,
    class6to8: 54000,
    class9to10: 60480,
    class11to12: 66000,
    hasWarning: true // 12% increase warning
  },
  {
    id: "f2",
    name: "Admission",
    subtitle: "New students only",
    frequency: "One-time",
    nurseryUkg: 15000,
    class1to5: 15000,
    class6to8: 15000,
    class9to10: 15000,
    class11to12: 15000
  },
  {
    id: "f3",
    name: "Annual charges",
    subtitle: "Activities, sports, insurance",
    frequency: "Annual",
    nurseryUkg: 6000,
    class1to5: 7200,
    class6to8: 8400,
    class9to10: 9600,
    class11to12: 9600
  },
  {
    id: "f4",
    name: "Computer",
    subtitle: "Class 1 onwards",
    frequency: "Annual",
    nurseryUkg: 0,
    class1to5: 3000,
    class6to8: 3600,
    class9to10: 3600,
    class11to12: 4200
  },
  {
    id: "f5",
    name: "Lab",
    subtitle: "Science stream adds ₹2,400",
    frequency: "Annual",
    nurseryUkg: 0,
    class1to5: 0,
    class6to8: 1800,
    class9to10: 2400,
    class11to12: 3600
  },
  {
    id: "f6",
    name: "Caution deposit",
    subtitle: "Refundable",
    frequency: "One-time",
    nurseryUkg: 5000,
    class1to5: 5000,
    class6to8: 5000,
    class9to10: 5000,
    class11to12: 5000
  }
];

export default function FeeStructure() {
  const { showToast } = useToast();
  const [feeRows, setFeeRows] = useState<FeeRow[]>(INITIAL_FEE_ROWS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState(
    "12% tuition hike for 9–10 reflects new Robotics & AI curriculum labs and smart interactive digital boards."
  );

  // New Head Form State
  const [newHeadName, setNewHeadName] = useState("");
  const [newHeadSubtitle, setNewHeadSubtitle] = useState("");
  const [newHeadFrequency, setNewHeadFrequency] = useState<"Quarterly" | "One-time" | "Annual">("Annual");
  const [newHeadAmount, setNewHeadAmount] = useState(2500);

  const handleCellChange = (
    id: string,
    field: "nurseryUkg" | "class1to5" | "class6to8" | "class9to10" | "class11to12",
    val: string
  ) => {
    const num = parseInt(val.replace(/,/g, "")) || 0;
    setFeeRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: num } : row))
    );
  };

  const handleAddNewHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadName.trim()) {
      showToast("Please enter a fee head name", "error");
      return;
    }
    const newRow: FeeRow = {
      id: `f-${Date.now()}`,
      name: newHeadName.trim(),
      subtitle: newHeadSubtitle.trim() || "Institutional charge",
      frequency: newHeadFrequency,
      nurseryUkg: newHeadAmount,
      class1to5: newHeadAmount,
      class6to8: newHeadAmount,
      class9to10: newHeadAmount,
      class11to12: newHeadAmount
    };
    setFeeRows(prev => [...prev, newRow]);
    setIsAddModalOpen(false);
    setNewHeadName("");
    setNewHeadSubtitle("");
    showToast(`Added fee head "${newRow.name}" to the structure`, "success");
  };

  const handleSendApproval = () => {
    setIsApprovalModalOpen(false);
    showToast("Fee structure submitted for Director & Management approval!", "success");
  };

  // Compute column totals
  const totalNurseryUkg = feeRows.reduce((sum, r) => sum + r.nurseryUkg, 0);
  const totalClass1to5 = feeRows.reduce((sum, r) => sum + r.class1to5, 0);
  const totalClass6to8 = feeRows.reduce((sum, r) => sum + r.class6to8, 0);
  const totalClass9to10 = feeRows.reduce((sum, r) => sum + r.class9to10, 0);
  const totalClass11to12 = feeRows.reduce((sum, r) => sum + r.class11to12, 0);

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12">
      {/* Module Navigation */}
      <FeesModuleNav activeTab="structure" />

      {/* Header Row (Matching 21-FeeStructure.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Fee structure · 2027-28 (draft)
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Annual amounts per student, category: Regular. Copied from 2026-27 on 1 Oct.
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FiPlus size={15} />
            <span>Add fee head</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsApprovalModalOpen(true)}
            className="min-h-[42px] px-4.5 rounded-control bg-primary hover:bg-[#08393F] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            <FiCheckCircle size={15} />
            <span>Send for approval</span>
          </button>
        </div>
      </div>

      {/* Warning Alert Banner (Matching 21-FeeStructure.html) */}
      <div className="bg-[#FFF6EC] border border-[#EBC99C] rounded-[10px] px-4 py-3 text-small text-[#5E3305] flex items-center gap-2.5">
        <FiAlertTriangle size={17} className="text-[#8F4A09] shrink-0" />
        <span>
          Tuition for Classes 9–10 is 12.0% higher than 2026-27, above the 10% limit set for this school. Add a reason or lower the amount.
        </span>
      </div>

      {/* Tabular Fee Matrix (Matching 21-FeeStructure.html) */}
      <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-small min-w-[900px]">
            <thead>
              <tr className="bg-[#F2F4F2] text-left text-ink border-b border-line">
                <th className="px-4 py-3 font-semibold w-52">Fee head</th>
                <th className="px-4 py-3 font-semibold w-28">Frequency</th>
                <th className="px-4 py-3 font-semibold text-right">Nursery–UKG</th>
                <th className="px-4 py-3 font-semibold text-right">Class 1–5</th>
                <th className="px-4 py-3 font-semibold text-right">Class 6–8</th>
                <th className="px-4 py-3 font-semibold text-right">Class 9–10</th>
                <th className="px-4 py-3 font-semibold text-right">Class 11–12</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1EF]">
              {feeRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className="flex flex-col">
                      <span className="font-semibold text-ink">{row.name}</span>
                      <span className="text-[12px] text-ink-secondary">{row.subtitle}</span>
                    </span>
                  </td>

                  <td className="px-4 py-2.5 text-ink-secondary font-medium text-xs">
                    {row.frequency}
                  </td>

                  {/* Nursery-UKG */}
                  <td className="px-4 py-2 text-right">
                    <input
                      type="text"
                      aria-label={`${row.name} Nursery-UKG amount`}
                      value={row.nurseryUkg.toLocaleString("en-IN")}
                      onChange={(e) => handleCellChange(row.id, "nurseryUkg", e.target.value)}
                      className="w-24 min-h-[34px] px-2 text-right rounded-[6px] border border-[#C9D1CD] bg-white font-mono text-[13px] text-ink focus:outline-none focus:border-primary transition-all"
                    />
                  </td>

                  {/* Class 1-5 */}
                  <td className="px-4 py-2 text-right">
                    <input
                      type="text"
                      aria-label={`${row.name} Class 1-5 amount`}
                      value={row.class1to5.toLocaleString("en-IN")}
                      onChange={(e) => handleCellChange(row.id, "class1to5", e.target.value)}
                      className="w-24 min-h-[34px] px-2 text-right rounded-[6px] border border-[#C9D1CD] bg-white font-mono text-[13px] text-ink focus:outline-none focus:border-primary transition-all"
                    />
                  </td>

                  {/* Class 6-8 */}
                  <td className="px-4 py-2 text-right">
                    <input
                      type="text"
                      aria-label={`${row.name} Class 6-8 amount`}
                      value={row.class6to8.toLocaleString("en-IN")}
                      onChange={(e) => handleCellChange(row.id, "class6to8", e.target.value)}
                      className="w-24 min-h-[34px] px-2 text-right rounded-[6px] border border-[#C9D1CD] bg-white font-mono text-[13px] text-ink focus:outline-none focus:border-primary transition-all"
                    />
                  </td>

                  {/* Class 9-10 (Highlighted Warning if tuition) */}
                  <td className="px-4 py-2 text-right">
                    <input
                      type="text"
                      aria-label={`${row.name} Class 9-10 amount`}
                      value={row.class9to10.toLocaleString("en-IN")}
                      onChange={(e) => handleCellChange(row.id, "class9to10", e.target.value)}
                      className={`w-24 min-h-[34px] px-2 text-right rounded-[6px] font-mono text-[13px] text-ink focus:outline-none transition-all ${
                        row.hasWarning
                          ? "border-2 border-[#B4610E] bg-[#FFF6EC] font-semibold"
                          : "border border-[#C9D1CD] bg-white focus:border-primary"
                      }`}
                    />
                  </td>

                  {/* Class 11-12 */}
                  <td className="px-4 py-2 text-right">
                    <input
                      type="text"
                      aria-label={`${row.name} Class 11-12 amount`}
                      value={row.class11to12.toLocaleString("en-IN")}
                      onChange={(e) => handleCellChange(row.id, "class11to12", e.target.value)}
                      className="w-24 min-h-[34px] px-2 text-right rounded-[6px] border border-[#C9D1CD] bg-white font-mono text-[13px] text-ink focus:outline-none focus:border-primary transition-all"
                    />
                  </td>
                </tr>
              ))}

              {/* Annual Total Row (Matching 21-FeeStructure.html) */}
              <tr className="border-t-2 border-line bg-[#F9FAF8] font-semibold">
                <td className="px-4 py-3 text-ink font-bold">Annual total</td>
                <td></td>
                <td className="px-4 py-3 text-right font-mono font-bold text-ink">
                  ₹{totalNurseryUkg.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-ink">
                  ₹{totalClass1to5.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-ink">
                  ₹{totalClass6to8.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-ink text-[#8F4A09]">
                  ₹{totalClass9to10.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-ink">
                  ₹{totalClass11to12.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Two Cards: Installment Plan & Concession Rules */}
      <div className="flex flex-wrap gap-5 items-start">
        {/* Card 1: Installment Plan (Quarterly) */}
        <section className="flex-1 min-w-[320px] bg-white border border-line rounded-card p-5 space-y-3 shadow-xs">
          <h2 className="text-base font-semibold text-ink">Installment plan · quarterly</h2>
          
          <div className="divide-y divide-[#EEF1EF] text-small">
            <div className="flex justify-between py-2.5">
              <span className="font-medium text-ink">Installment 1</span>
              <span className="text-ink-secondary">Due 15 Apr · 25% + one-time + annual</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="font-medium text-ink">Installment 2</span>
              <span className="text-ink-secondary">Due 15 Jul · 25% of tuition</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="font-medium text-ink">Installment 3</span>
              <span className="text-ink-secondary">Due 15 Oct · 25% of tuition</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="font-medium text-ink">Installment 4</span>
              <span className="text-ink-secondary">Due 15 Jan · 25% of tuition</span>
            </div>
          </div>

          <p className="text-[12.5px] text-ink-secondary pt-1 leading-relaxed">
            Late fee ₹20 per day after 7 grace days, capped at ₹500 per installment.
          </p>
        </section>

        {/* Card 2: Concession Rules */}
        <section className="flex-1 min-w-[320px] bg-white border border-line rounded-card p-5 space-y-3 shadow-xs">
          <h2 className="text-base font-semibold text-ink">Concession rules</h2>
          
          <div className="divide-y divide-[#EEF1EF] text-small">
            <div className="flex justify-between py-2.5 gap-3">
              <span className="font-medium text-ink">Sibling — 2nd child</span>
              <span className="text-ink-secondary text-right">10% of tuition · auto</span>
            </div>
            <div className="flex justify-between py-2.5 gap-3">
              <span className="font-medium text-ink">Sibling — 3rd child</span>
              <span className="text-ink-secondary text-right">15% of tuition · auto</span>
            </div>
            <div className="flex justify-between py-2.5 gap-3">
              <span className="font-medium text-ink">Staff ward</span>
              <span className="text-ink-secondary text-right">50% of tuition · HR verified</span>
            </div>
            <div className="flex justify-between py-2.5 gap-3">
              <span className="font-medium text-ink">RTE</span>
              <span className="text-ink-secondary text-right">100% of tuition · state portal no.</span>
            </div>
            <div className="flex justify-between py-2.5 gap-3">
              <span className="font-medium text-ink">Merit / need-based</span>
              <span className="text-ink-secondary text-right">Up to 25% · principal approval</span>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD FEE HEAD                                            */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface">
              <h3 className="font-semibold text-base text-ink">Add Fee Head</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-slate-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleAddNewHead} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Fee Head Name</label>
                <input
                  type="text"
                  placeholder="e.g. Smart Class & AI Lab"
                  value={newHeadName}
                  onChange={(e) => setNewHeadName(e.target.value)}
                  className="w-full h-9 px-3 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Subtitle / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Digital learning module and tablet fee"
                  value={newHeadSubtitle}
                  onChange={(e) => setNewHeadSubtitle(e.target.value)}
                  className="w-full h-9 px-3 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Frequency</label>
                <select
                  value={newHeadFrequency}
                  onChange={(e) => setNewHeadFrequency(e.target.value as any)}
                  className="w-full h-9 px-3 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="Annual">Annual</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Default Base Amount (₹)</label>
                <input
                  type="number"
                  value={newHeadAmount}
                  onChange={(e) => setNewHeadAmount(Number(e.target.value))}
                  className="w-full h-9 px-3 border border-line-input rounded-control font-mono text-xs text-ink focus:outline-none focus:border-primary"
                  min={0}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 bg-primary hover:bg-[#08393F] text-white rounded-control text-xs font-semibold shadow-xs"
                >
                  Add Head
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SEND FOR APPROVAL                                       */}
      {/* ============================================================== */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface">
              <h3 className="font-semibold text-base text-ink">Submit Fee Structure for Approval</h3>
              <button
                type="button"
                onClick={() => setIsApprovalModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-slate-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-ink-secondary leading-relaxed">
                This draft will be sent to the School Director and Board of Governors for official ratification.
              </p>

              <div className="bg-[#FFF6EC] border border-[#EBC99C] rounded-[8px] p-3 text-xs text-[#5E3305] space-y-1">
                <span className="font-bold block">Notice: 12% Hike on Classes 9–10</span>
                <span>Requires explicit management justification prior to publishing in parent prospectus.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Justification Note for Approving Committee
                </label>
                <textarea
                  rows={3}
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full p-2.5 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsApprovalModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendApproval}
                  className="px-4.5 py-2 bg-primary hover:bg-[#08393F] text-white rounded-control text-xs font-semibold shadow-xs"
                >
                  Confirm &amp; Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
