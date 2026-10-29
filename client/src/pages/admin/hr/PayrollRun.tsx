import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiDownload,
  FiPrinter,
  FiSend,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiX,
  FiFileText
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import api from "../../../api/axiosInstance";

interface SalaryLineItem {
  id: string;
  name: string;
  role: string;
  empId: string;
  payableDays: number;
  gross: number;
  pf: number;
  esi?: number;
  tds?: number;
  otherDed?: number;
  netPay: number;
  isLWP?: boolean;
}

const SALARY_REGISTER: SalaryLineItem[] = [
  {
    id: "1",
    name: "Sunita Rathore",
    role: "TGT Science",
    empId: "EMP-0142",
    payableDays: 30,
    gross: 52400,
    pf: 1800,
    tds: 2100,
    otherDed: 200,
    netPay: 48300
  },
  {
    id: "2",
    name: "Vikram Singh",
    role: "TGT Maths",
    empId: "EMP-0118",
    payableDays: 27.5,
    gross: 46480,
    pf: 1800,
    tds: 1200,
    otherDed: 200,
    netPay: 43280,
    isLWP: true
  },
  {
    id: "3",
    name: "Rachna Bose",
    role: "PGT English",
    empId: "EMP-0097",
    payableDays: 30,
    gross: 61800,
    pf: 1800,
    tds: 3900,
    otherDed: 200,
    netPay: 55900
  },
  {
    id: "4",
    name: "Pooja Meena",
    role: "PRT",
    empId: "EMP-0231",
    payableDays: 15,
    gross: 14250,
    pf: 1710,
    esi: 107,
    netPay: 12433,
    isLWP: true
  },
  {
    id: "5",
    name: "Deepak Choudhary",
    role: "PET",
    empId: "EMP-0150",
    payableDays: 30,
    gross: 34600,
    pf: 1800,
    otherDed: 200,
    netPay: 32600
  },
  {
    id: "6",
    name: "Kamla Devi",
    role: "TGT Hindi",
    empId: "EMP-0076",
    payableDays: 30,
    gross: 44200,
    pf: 1800,
    tds: 600,
    otherDed: 3200,
    netPay: 38600
  },
  {
    id: "7",
    name: "Mohan Lal",
    role: "Driver, Bus 4",
    empId: "EMP-0164",
    payableDays: 30,
    gross: 19800,
    pf: 1800,
    esi: 149,
    netPay: 17851
  },
  {
    id: "8",
    name: "Rakesh Jain",
    role: "PGT Accountancy",
    empId: "EMP-0104",
    payableDays: 30,
    gross: 56800,
    pf: 1800,
    tds: 2700,
    otherDed: 200,
    netPay: 52100
  }
];

export default function PayrollRun() {
  const { showToast } = useToast();
  const [salaries] = useState<SalaryLineItem[]>(SALARY_REGISTER);
  const [search, setSearch] = useState("");
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isApprovalSent, setIsApprovalSent] = useState(false);

  const [selectedException, setSelectedException] = useState<{
    name: string;
    description: string;
    adjustment: string;
  } | null>(null);

  const [selectedPayslip, setSelectedPayslip] = useState<SalaryLineItem | null>(null);

  const [adminData, setAdminData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("admin");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!adminData?.instituteName) {
      api
        .get("/admin/profile")
        .then((res) => {
          if (res.data?.data) {
            const profile = res.data.data;
            setAdminData((prev: any) => {
              const updated = {
                ...prev,
                instituteName: profile.instituteName || prev?.instituteName,
                campusName: profile.campusName || prev?.campusName,
                address: profile.address || prev?.address,
                city: profile.city || prev?.city,
                board: profile.board || prev?.board,
                affiliationNo: profile.affiliationNo || prev?.affiliationNo,
                phone: profile.phone || prev?.phone,
                logoUrl: profile.logoUrl || prev?.logoUrl,
              };
              localStorage.setItem("admin", JSON.stringify(updated));
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  const instituteName = adminData?.instituteName || "GuruConnect Institute";
  const instituteSubtitle = [
    adminData?.campusName ? `${adminData.campusName}` : (adminData?.city ? `${adminData.city} Campus` : null),
    adminData?.address || null,
    adminData?.board ? `Affiliated to ${adminData.board}` : null,
  ].filter(Boolean).join(" · ") || (adminData?.city ? `${adminData.city} · Affiliated to State/CBSE Board` : "Mansarovar Campus, Jaipur · Affiliated to CBSE");

  const filtered = salaries.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.empId.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownloadBankFile = () => {
    const csvContent =
      "Account No,Beneficiary Name,IFSC,Amount,Remarks\n" +
      filtered
        .map(
          (s, idx) =>
            `"91820100${1000 + idx}","${s.name}","HDFC0001242",${s.netPay},"Salary Sep 2026"`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HDFC_Corporate_NEFT_Disbursement_Sep2026.csv`;
    a.click();
    showToast("NEFT / Corporate Bank payment batch file downloaded!", "success");
  };

  const handleSendApproval = () => {
    setIsApprovalSent(true);
    setIsApprovalModalOpen(false);
    showToast("September 2026 payroll run submitted for Principal approval!", "success");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 30-Payroll.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Payroll › Monthly runs
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            September 2026 payroll
          </h1>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadBankFile}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FiDownload size={14} className="text-ink-secondary" />
            <span>Bank NEFT file</span>
          </button>
          <button
            type="button"
            onClick={() => setIsApprovalModalOpen(true)}
            disabled={isApprovalSent}
            className={`min-h-[42px] px-4 rounded-control text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
              isApprovalSent
                ? "bg-emerald-700 cursor-default"
                : "bg-primary hover:bg-primary-dark active:scale-[0.98]"
            }`}
          >
            <FiSend size={14} />
            <span>{isApprovalSent ? "Approval pending with Principal" : "Send for principal approval"}</span>
          </button>
        </div>
      </div>

      {/* 5-Step Stepper (Matching 30-Payroll.html) */}
      <ol className="list-none m-0 p-0 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        {/* Step 1 */}
        <li className="p-3 rounded-control bg-white border border-line flex flex-col gap-0.5 shadow-xs">
          <span className="font-semibold text-emerald-800 text-[11px] flex items-center gap-1">
            <FiCheck size={13} /> Done
          </span>
          <span className="font-semibold text-ink text-[13.5px]">Lock attendance</span>
        </li>

        {/* Step 2 */}
        <li className="p-3 rounded-control bg-white border border-line flex flex-col gap-0.5 shadow-xs">
          <span className="font-semibold text-emerald-800 text-[11px] flex items-center gap-1">
            <FiCheck size={13} /> Done
          </span>
          <span className="font-semibold text-ink text-[13.5px]">Calculate</span>
        </li>

        {/* Step 3 */}
        <li className="p-3 rounded-control bg-primary-tint border border-primary flex flex-col gap-0.5 shadow-xs">
          <span className="font-semibold text-primary text-[11px]">
            {isApprovalSent ? "Completed" : "In progress"}
          </span>
          <span className="font-semibold text-ink text-[13.5px]">Review exceptions</span>
        </li>

        {/* Step 4 */}
        <li
          className={`p-3 rounded-control border flex flex-col gap-0.5 shadow-xs ${
            isApprovalSent
              ? "bg-warning-bg border-warning-border"
              : "bg-white border-line text-ink-secondary"
          }`}
        >
          <span
            className={`font-semibold text-[11px] ${
              isApprovalSent ? "text-warning-text" : "text-ink-secondary"
            }`}
          >
            {isApprovalSent ? "Pending review" : "Waiting"}
          </span>
          <span className="font-semibold text-ink text-[13.5px]">Principal approval</span>
        </li>

        {/* Step 5 */}
        <li className="p-3 rounded-control bg-white border border-line flex flex-col gap-0.5 text-ink-secondary shadow-xs">
          <span className="font-semibold text-[11px]">Waiting</span>
          <span className="font-semibold text-ink text-[13.5px]">Bank file &amp; payslips</span>
        </li>
      </ol>

      {/* 4 Summary KPI Cards (Matching 30-Payroll.html) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1 */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Employees</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">86</span>
          <span className="text-[11.5px] text-ink-secondary">All categories</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Gross salary</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">₹31,48,200</span>
          <span className="text-[11.5px] text-ink-secondary">Before deductions</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Deductions</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">₹3,92,640</span>
          <span className="text-[11.5px] text-ink-secondary">PF, TDS, ESI &amp; PT</span>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Net payable</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-primary font-bold">
            ₹27,55,560
          </span>
          <span className="text-[11.5px] text-emerald-700 font-medium">Disbursable on 1 Oct</span>
        </div>
      </div>

      {/* 4 Exceptions to Review Section (Matching 30-Payroll.html) */}
      <section className="bg-white border border-line rounded-card p-5 space-y-3 shadow-xs">
        <h2 className="text-base font-semibold text-ink">4 exceptions to review</h2>

        <div className="divide-y divide-line/60 text-[13.5px]">
          <div className="flex justify-between items-center gap-3 py-2.5">
            <div>
              <b className="font-semibold text-ink">Pooja Meena</b>{" "}
              <span className="text-ink-secondary">· joined 16 Sep, pro-rata pay for 15 days</span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedException({
                  name: "Pooja Meena (EMP-0231)",
                  description: "New joinee joined mid-month on 16 September.",
                  adjustment: "Calculated pro-rata basic + DA for 15 working days: ₹14,250 gross."
                })
              }
              className="min-h-[36px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-xs"
            >
              Open
            </button>
          </div>

          <div className="flex justify-between items-center gap-3 py-2.5">
            <div>
              <b className="font-semibold text-ink">Vikram Singh</b>{" "}
              <span className="text-ink-secondary">
                · 2 days leave without pay, 4 late arrivals (0.5 day deducted)
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedException({
                  name: "Vikram Singh (EMP-0118)",
                  description: "2 unapproved absence days + 4 late arrivals over 10 min grace.",
                  adjustment: "Total 2.5 days salary deduction applied (27.5 payable days)."
                })
              }
              className="min-h-[36px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-xs"
            >
              Open
            </button>
          </div>

          <div className="flex justify-between items-center gap-3 py-2.5">
            <div>
              <b className="font-semibold text-ink">Rakesh Jain</b>{" "}
              <span className="text-ink-secondary">
                · salary revision from 1 Sep, arrears for August pending
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedException({
                  name: "Rakesh Jain (EMP-0104)",
                  description: "Annual increment effective 1 September.",
                  adjustment: "Gross revised to ₹56,800 + ₹4,200 arrears included in net pay."
                })
              }
              className="min-h-[36px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-xs"
            >
              Open
            </button>
          </div>

          <div className="flex justify-between items-center gap-3 py-2.5">
            <div>
              <b className="font-semibold text-ink">Kamla Devi</b>{" "}
              <span className="text-ink-secondary">· loan EMI ₹3,000 ends this month</span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedException({
                  name: "Kamla Devi (EMP-0076)",
                  description: "Final installment 12 of 12 for Staff Welfare Loan.",
                  adjustment: "₹3,000 loan deduction completes; zero deduction from October."
                })
              }
              className="min-h-[36px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-xs"
            >
              Open
            </button>
          </div>
        </div>
      </section>

      {/* Salary Register Table Section (Screen 30) */}
      <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
        <div className="p-4 border-b border-line flex flex-wrap justify-between items-center gap-3">
          <h3 className="font-semibold text-sm text-ink">
            Salary Register ({filtered.length} employees)
          </h3>
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={14} />
            <input
              type="search"
              placeholder="Search employee or EMP ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-page border border-line rounded-control text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13.5px] min-w-[900px]">
            <thead>
              <tr className="bg-surface-head border-b border-line text-left text-ink font-semibold">
                <th className="py-2.5 px-4">Employee</th>
                <th className="py-2.5 px-4 text-right">Payable days</th>
                <th className="py-2.5 px-4 text-right">Gross</th>
                <th className="py-2.5 px-4 text-right">PF</th>
                <th className="py-2.5 px-4 text-right">ESI</th>
                <th className="py-2.5 px-4 text-right">TDS</th>
                <th className="py-2.5 px-4 text-right">Other ded.</th>
                <th className="py-2.5 px-4 text-right">Net pay</th>
                <th className="py-2.5 px-4 text-center">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-page/50 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-ink">{row.name}</span>
                      <span className="text-[12px] text-ink-secondary">{row.role}</span>
                    </div>
                  </td>
                  <td
                    className={`py-2.5 px-4 text-right font-mono font-medium ${
                      row.isLWP ? "text-warning-inline" : "text-ink"
                    }`}
                  >
                    {row.payableDays}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono">
                    ₹{row.gross.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-ink-secondary">
                    ₹{row.pf.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-ink-secondary">
                    {row.esi ? `₹${row.esi.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-ink-secondary">
                    {row.tds ? `₹${row.tds.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-ink-secondary">
                    {row.otherDed ? `₹${row.otherDed.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-ink">
                    ₹{row.netPay.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedPayslip(row)}
                      className="px-2.5 py-1 text-xs rounded-control border border-line hover:border-primary text-primary font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Exception Resolution Detail Modal */}
      {selectedException && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">
                Payroll Exception: {selectedException.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedException(null)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-page border border-line rounded-control space-y-1">
                <span className="font-semibold text-ink">Audit Finding:</span>
                <p className="text-ink-secondary">{selectedException.description}</p>
              </div>

              <div className="p-3 bg-primary-tint border border-primary/30 rounded-control space-y-1 text-primary">
                <span className="font-semibold">Applied Formula &amp; Adjustment:</span>
                <p>{selectedException.adjustment}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  setSelectedException(null);
                  showToast("Exception accepted and verified for salary register!", "success");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
              >
                Confirm &amp; Keep Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Monthly Payslip Preview & Print Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-lg shadow-xl p-6 space-y-5 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <span className="font-semibold text-xs text-ink-secondary uppercase tracking-wider">
                Salary Slip · September 2026
              </span>
              <button
                type="button"
                onClick={() => setSelectedPayslip(null)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Official Payslip Printable Box */}
            <div className="border border-line rounded-card p-5 space-y-4 bg-white text-ink">
              <div className="text-center border-b border-line pb-3 space-y-1">
                {adminData?.logoUrl && (
                  <img
                    src={adminData.logoUrl}
                    alt={instituteName}
                    className="w-10 h-10 object-contain mx-auto mb-1 rounded-md"
                  />
                )}
                <div className="font-bold text-base text-primary tracking-wide uppercase">{instituteName}</div>
                <div className="text-[11px] text-ink-secondary">{instituteSubtitle}</div>
                <div className="font-semibold text-xs text-ink pt-1">SALARY SLIP FOR SEPTEMBER 2026</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span>Employee:</span> <b>{selectedPayslip.name}</b></div>
                <div><span>EMP Code:</span> <b className="font-mono">{selectedPayslip.empId}</b></div>
                <div><span>Designation:</span> <b>{selectedPayslip.role}</b></div>
                <div><span>Payable Days:</span> <b>{selectedPayslip.payableDays} of 30</b></div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-line py-3">
                <div className="space-y-1">
                  <div className="font-bold text-ink border-b border-line/60 pb-1">Earnings</div>
                  <div className="flex justify-between"><span>Basic Pay:</span><span className="font-mono">₹{Math.round(selectedPayslip.gross * 0.6).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span>DA / HRA:</span><span className="font-mono">₹{Math.round(selectedPayslip.gross * 0.4).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between font-bold pt-1 border-t border-line/60">
                    <span>Total Gross:</span>
                    <span className="font-mono">₹{selectedPayslip.gross.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-ink border-b border-line/60 pb-1">Deductions</div>
                  <div className="flex justify-between"><span>PF:</span><span className="font-mono">₹{selectedPayslip.pf.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span>TDS / Taxes:</span><span className="font-mono">₹{(selectedPayslip.tds || 0).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span>Other:</span><span className="font-mono">₹{(selectedPayslip.otherDed || 0).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between font-bold pt-1 border-t border-line/60 text-red-700">
                    <span>Total Ded:</span>
                    <span className="font-mono">₹{(selectedPayslip.gross - selectedPayslip.netPay).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-primary-tint rounded-control flex justify-between items-center text-sm font-bold text-primary">
                <span>NET SALARY PAYABLE:</span>
                <span className="font-mono text-base">₹{selectedPayslip.netPay.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <FiPrinter size={14} /> Print Payslip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Approval Confirmation Modal */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Submit Payroll for Principal Approval</h3>
              <button
                type="button"
                onClick={() => setIsApprovalModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-ink-secondary">
                You are submitting <b>September 2026 payroll</b> for final sanction by Principal / Chairman:
              </p>
              <div className="border border-line rounded-control p-3 bg-page space-y-1 font-mono">
                <div className="flex justify-between"><span>Total Staff:</span><b>86 employees</b></div>
                <div className="flex justify-between"><span>Total Gross:</span><b>₹31,48,200</b></div>
                <div className="flex justify-between"><span>Total Deductions:</span><b>₹3,92,640</b></div>
                <div className="flex justify-between text-primary font-bold"><span>Total Net Disbursement:</span><b>₹27,55,560</b></div>
              </div>
              <p className="text-[11px] text-ink-secondary">
                Upon Principal digital signature, the corporate bank file and encrypted payslips will be generated automatically.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setIsApprovalModalOpen(false)}
                className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendApproval}
                className="px-4.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
              >
                Confirm &amp; Send to Principal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
