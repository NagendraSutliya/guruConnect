import { useState } from "react";
import { BookMarked, Scale, FileText, CheckCircle2, Plus, Save, Clock, ChevronRight, X, Sparkles, AlertCircle } from "lucide-react";

export default function SuperAdminMasters() {
  const [activeTab, setActiveTab] = useState<"templates" | "statutory">("templates");
  const [saveAlert, setSaveAlert] = useState(false);
  const [selectedTemplateForEdit, setSelectedTemplateForEdit] = useState<any | null>(null);
  const [showAddStatutoryModal, setShowAddStatutoryModal] = useState(false);

  const [statutoryRates, setStatutoryRates] = useState([
    { rate: "PF — Employee Share", value: "12.0%", effective: "01 Apr 2026", notification: "EPFO Notification G.S.R. 221(E)", status: "In force" },
    { rate: "PF — Employer Share (EPS 8.33% + EPF 3.67%)", value: "12.0%", effective: "01 Apr 2026", notification: "EPFO Notification G.S.R. 221(E)", status: "In force" },
    { rate: "PF Wage Ceiling", value: "₹15,000 / mo", effective: "01 Apr 2026", notification: "Ministry of Labour & Employment", status: "In force" },
    { rate: "ESI — Employee Contribution", value: "0.75%", effective: "01 Jul 2025", notification: "ESIC Gazetted Rule 51", status: "In force" },
    { rate: "ESI — Employer Contribution", value: "3.25%", effective: "01 Jul 2025", notification: "ESIC Gazetted Rule 51", status: "In force" },
    { rate: "ESI Wage Threshold", value: "₹21,000 / mo", effective: "01 Jul 2025", notification: "ESIC Central Notification", status: "In force" },
    { rate: "Gratuity Ceiling", value: "₹20,00,000", effective: "29 Mar 2025", notification: "Payment of Gratuity Act", status: "In force" }
  ]);

  const [assessmentTemplates, setAssessmentTemplates] = useState([
    { board: "CBSE Secondary (Class IX–X)", version: "2026-27 v2", status: "Published", schools: 74, circular: "CBSE/ACAD/2026/Cir-12", classes: "IX–X" },
    { board: "RBSE Secondary (Class IX–X)", version: "2026-27 v1", status: "Published", schools: 62, circular: "RBSE/Sec/2026/891", classes: "IX–X" },
    { board: "CBSE Senior Secondary (Class XI–XII)", version: "2026-27 v1", status: "Published", schools: 58, circular: "CBSE/ACAD/2026/Cir-18", classes: "XI–XII" },
    { board: "RBSE Secondary 2027-28 v1", version: "2027-28 v1", status: "Draft", schools: 0, circular: "RBSE circular draft", classes: "IX–X" }
  ]);

  // Components state for editor modal
  const [templateComponents, setTemplateComponents] = useState([
    { name: "Internal assessment", max: 20, weightage: 20, rule: "Best of 2 periodic tests" },
    { name: "Practical / project", max: 20, weightage: 20, rule: "Science & mathematics labs" },
    { name: "Half-yearly exam", max: 80, weightage: 30, rule: "Written midterm assessment" },
    { name: "Annual board / final exam", max: 80, weightage: 30, rule: "Comprehensive summative" }
  ]);

  // Form for statutory modal
  const [newStatutory, setNewStatutory] = useState({
    rate: "",
    value: "",
    effective: "01 Apr 2027",
    notification: "Gazetted notification"
  });

  const handleSave = () => {
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  const handleSaveTemplateEditor = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Template schema saved for ${selectedTemplateForEdit.board}. Changes will be queued for publish.`);
    setSelectedTemplateForEdit(null);
  };

  const handleAddStatutorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatutory.rate || !newStatutory.value) return;
    setStatutoryRates([
      ...statutoryRates,
      { ...newStatutory, status: "In force" }
    ]);
    setShowAddStatutoryModal(false);
    setNewStatutory({ rate: "", value: "", effective: "01 Apr 2027", notification: "Gazetted notification" });
  };

  const totalWeightage = templateComponents.reduce((sum, c) => sum + c.weightage, 0);

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Global Masters & Statutory Standards
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Standard curricular report card schemas and nationwide statutory payroll deduction rates.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4 text-gold" />
          <span>Save Changes</span>
        </button>
      </div>

      {saveAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fadeIn">
          ✓ Master configuration synchronized. Changes pushed to school academic calendars.
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-line">
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "templates"
              ? "border-primary text-primary"
              : "border-transparent text-ink-secondary hover:text-ink"
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Curricular Assessment Templates</span>
        </button>

        <button
          onClick={() => setActiveTab("statutory")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "statutory"
              ? "border-primary text-primary"
              : "border-transparent text-ink-secondary hover:text-ink"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Statutory Rates (PF, ESI, TDS)</span>
        </button>
      </div>

      {/* TAB 1: ASSESSMENT TEMPLATES */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-line flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-ink m-0">Board Grading Engines</h2>
                <span className="text-xs text-ink-secondary">Defines term components, FA/SA weightages, and 8-point scale</span>
              </div>
              <button 
                onClick={() => setSelectedTemplateForEdit(assessmentTemplates[0])}
                className="px-3.5 py-1.5 bg-primary-tint text-primary hover:bg-primary hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                + New Version
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[750px]">
                <thead>
                  <tr className="bg-surface border-b border-line text-ink-secondary text-[11px] uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Board & Level</th>
                    <th className="py-3 px-4">Engine Version</th>
                    <th className="py-3 px-4">Source Circular</th>
                    <th className="py-3 px-4">Live Schools</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {assessmentTemplates.map((item, idx) => (
                    <tr key={idx} className="hover:bg-primary-tint/10 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-ink">{item.board}</td>
                      <td className="py-3.5 px-4 font-mono font-medium text-ink">{item.version}</td>
                      <td className="py-3.5 px-4 text-ink-secondary font-mono text-xs">{item.circular}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-ink">{item.schools}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.status === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => setSelectedTemplateForEdit(item)}
                          className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-tint/40 rounded-lg border border-primary-soft/40 cursor-pointer"
                        >
                          Edit Components
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 8-Point Scale Preview Card */}
          <div className="p-5 bg-white rounded-2xl border border-line shadow-2xs space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Standard 8-Point Grading Scale (CBSE/RBSE)</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
              {[
                { grade: "A1", range: "91–100%" },
                { grade: "A2", range: "81–90%" },
                { grade: "B1", range: "71–80%" },
                { grade: "B2", range: "61–70%" },
                { grade: "C1", range: "51–60%" },
                { grade: "C2", range: "41–50%" },
                { grade: "D", range: "33–40%" },
                { grade: "E", range: "< 33% (Needs Help)" }
              ].map((g) => (
                <div key={g.grade} className="p-2.5 bg-surface rounded-xl border border-line text-center">
                  <div className="font-extrabold text-ink text-sm">{g.grade}</div>
                  <div className="text-[11px] text-ink-secondary font-medium font-mono">{g.range}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATUTORY RATES */}
      {activeTab === "statutory" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-line flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-ink m-0">National Statutory Payroll Matrix</h2>
                <span className="text-xs text-ink-secondary">EPFO, ESIC, and Gratuity values applied automatically across all tenant payrolls</span>
              </div>
              <button 
                onClick={() => setShowAddStatutoryModal(true)}
                className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                + Add Statutory Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-surface border-b border-line text-ink-secondary text-[11px] uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Statutory Component</th>
                    <th className="py-3 px-4">Prescribed Value</th>
                    <th className="py-3 px-4">Effective From</th>
                    <th className="py-3 px-4">Gazette / Official Notification</th>
                    <th className="py-3 px-4">Legal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {statutoryRates.map((row, idx) => (
                    <tr key={idx} className="hover:bg-primary-tint/10 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-ink">{row.rate}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">{row.value}</td>
                      <td className="py-3.5 px-4 font-mono text-ink-secondary text-xs">{row.effective}</td>
                      <td className="py-3.5 px-4 text-ink-secondary text-xs">{row.notification}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-subtle border border-line text-xs text-ink-secondary flex items-center justify-between">
            <span>Changes to statutory percentages require compliance validation before publication. Historical payrolls are preserved.</span>
            <span className="font-bold text-ink">Ministry of Labour & Employment Compliance v26.1</span>
          </div>
        </div>
      )}

      {/* TEMPLATE EDITOR MODAL (Specification 11) */}
      {selectedTemplateForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-line p-6 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-line">
              <div>
                <span className="text-xs font-bold text-primary uppercase">Template Editor</span>
                <h2 className="text-xl font-bold text-ink m-0">{selectedTemplateForEdit.board} · {selectedTemplateForEdit.version}</h2>
              </div>
              <button onClick={() => setSelectedTemplateForEdit(null)} className="p-1 text-ink-muted hover:text-ink cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplateEditor} className="overflow-y-auto py-4 space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Source Circular</label>
                  <input
                    type="text"
                    defaultValue={selectedTemplateForEdit.circular}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Circular Date</label>
                  <input
                    type="text"
                    defaultValue="15 Jun 2026"
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Applicable Classes</label>
                  <input
                    type="text"
                    defaultValue={selectedTemplateForEdit.classes}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-ink m-0">Term Assessment Components</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    totalWeightage === 100 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}>
                    Total Weightage: {totalWeightage}% {totalWeightage === 100 ? "✓" : "(Must equal 100%)"}
                  </span>
                </div>

                <div className="border border-line rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface border-b border-line font-bold text-ink-secondary uppercase">
                      <tr>
                        <th className="p-2.5">Component</th>
                        <th className="p-2.5 text-right w-24">Max Marks</th>
                        <th className="p-2.5 text-right w-24">Weightage %</th>
                        <th className="p-2.5">Evaluation Rule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/60">
                      {templateComponents.map((comp, i) => (
                        <tr key={i}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={comp.name}
                              onChange={(e) => {
                                const updated = [...templateComponents];
                                updated[i].name = e.target.value;
                                setTemplateComponents(updated);
                              }}
                              className="w-full px-2 py-1 bg-surface rounded-lg border border-line text-xs font-medium text-ink"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={comp.max}
                              onChange={(e) => {
                                const updated = [...templateComponents];
                                updated[i].max = Number(e.target.value);
                                setTemplateComponents(updated);
                              }}
                              className="w-full text-right px-2 py-1 bg-surface rounded-lg border border-line text-xs font-mono font-bold text-ink"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={comp.weightage}
                              onChange={(e) => {
                                const updated = [...templateComponents];
                                updated[i].weightage = Number(e.target.value);
                                setTemplateComponents(updated);
                              }}
                              className="w-full text-right px-2 py-1 bg-surface rounded-lg border border-line text-xs font-mono font-bold text-ink"
                            />
                          </td>
                          <td className="p-2 text-ink-secondary text-[11px]">{comp.rule}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setSelectedTemplateForEdit(null)}
                  className="px-4 py-2 border border-line text-ink-secondary rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Schema Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STATUTORY ROW MODAL (Specification 12) */}
      {showAddStatutoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-line p-6 relative">
            <button onClick={() => setShowAddStatutoryModal(false)} className="absolute top-4 right-4 text-ink-muted hover:text-ink cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-ink mb-1">Add Statutory Payroll Rate</h3>
            <p className="text-xs text-ink-secondary mb-4">Official labour/tax rate mandated by central government notification.</p>

            <form onSubmit={handleAddStatutorySubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Component Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EDLI — Employer Contribution"
                  value={newStatutory.rate}
                  onChange={(e) => setNewStatutory({...newStatutory, rate: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Mandated Percentage / Value *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0.50% or ₹15,000"
                  value={newStatutory.value}
                  onChange={(e) => setNewStatutory({...newStatutory, value: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Effective Date</label>
                <input
                  type="text"
                  value={newStatutory.effective}
                  onChange={(e) => setNewStatutory({...newStatutory, effective: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line font-mono text-ink text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Gazette / Notification Reference</label>
                <input
                  type="text"
                  value={newStatutory.notification}
                  onChange={(e) => setNewStatutory({...newStatutory, notification: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddStatutoryModal(false)} className="px-4 py-2 border border-line text-ink-secondary rounded-xl text-xs font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">
                  Add Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
