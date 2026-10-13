import { useState } from "react";
import { CheckCircle2, ChevronRight, Copy, Plus } from "lucide-react";

const steps = [
  { id: 1, name: "School profile", status: "completed" },
  { id: 2, name: "Branches", status: "completed" },
  { id: 3, name: "Academic session", status: "completed" },
  { id: 4, name: "Classes & sections", status: "current" },
  { id: 5, name: "Subjects", status: "upcoming" },
  { id: 6, name: "Timings & holidays", status: "upcoming" },
  { id: 7, name: "Number series", status: "upcoming" },
  { id: 8, name: "Grading scheme", status: "upcoming" },
  { id: 9, name: "Staff & roles", status: "upcoming" },
];

const classData = [
  { class: "Nursery", wing: "Pre-primary", sections: ["A", "B"], seats: 30, rte: 15 },
  { class: "LKG", wing: "Pre-primary", sections: ["A", "B"], seats: 30, rte: null },
  { class: "UKG", wing: "Pre-primary", sections: ["A", "B"], seats: 30, rte: null },
  { class: "Class 1", wing: "Primary", sections: ["A", "B", "C"], seats: 40, rte: 10 },
  { class: "Class 2", wing: "Primary", sections: ["A", "B"], seats: 40, rte: 10 },
  { class: "Class 3", wing: "Primary", sections: ["A", "B"], seats: 40, rte: 10 },
];

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(4);
  const [classes, setClasses] = useState(classData);

  const addSection = (index: number) => {
    const newClasses = [...classes];
    const lastSection = newClasses[index].sections[newClasses[index].sections.length - 1] || '@';
    const nextSection = String.fromCharCode(lastSection.charCodeAt(0) + 1);
    newClasses[index].sections.push(nextSection);
    setClasses(newClasses);
  };

  const updateSeats = (index: number, seats: number) => {
    const newClasses = [...classes];
    newClasses[index].seats = seats;
    setClasses(newClasses);
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto flex flex-col gap-8 w-full font-sans animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="text-sm text-ink-secondary font-medium flex items-center gap-1">
          Settings <ChevronRight size={14} /> School setup
        </div>
        <h1 className="text-3xl font-semibold text-ink m-0 tracking-tight">
          Set up your school
        </h1>
        <div className="text-[15px] text-ink-secondary">
          Step {currentStep} of {steps.length} · progress saves automatically, you can leave and come back
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 bg-surface-hover rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Navigation Sidebar */}
        <ol className="flex-none w-full md:w-64 m-0 p-3 list-none bg-white border border-line rounded-card flex flex-col gap-1 shadow-sm">
          {steps.map((step) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            
            return (
              <li 
                key={step.id} 
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-3 min-h-[48px] px-3 rounded-control cursor-pointer transition-colors ${
                  isCurrent ? "bg-primary-light/30" : "hover:bg-surface"
                }`}
              >
                <span className={`w-7 h-7 flex-none rounded-full flex items-center justify-center text-xs font-semibold ${
                  isCompleted ? "bg-primary text-white" :
                  isCurrent ? "bg-white text-primary shadow-sm border border-primary/20" :
                  "bg-surface-hover text-ink-secondary"
                }`}>
                  {isCompleted ? <CheckCircle2 size={16} strokeWidth={3} /> : step.id}
                </span>
                <span className={`text-[15px] ${
                  isCompleted ? "font-medium text-ink" :
                  isCurrent ? "font-semibold text-ink" :
                  "font-medium text-ink-secondary"
                }`}>
                  {step.name}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Content Area */}
        <section className="flex-1 w-full bg-white border border-line rounded-card p-6 md:p-8 flex flex-col gap-8 shadow-sm">
          {currentStep === 4 ? (
            <>
              {/* Step 4 Content: Classes & Sections */}
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex flex-col gap-2 max-w-2xl">
                  <h2 className="text-xl font-semibold text-ink m-0 tracking-tight">Classes and sections</h2>
                  <p className="text-[15px] text-ink-secondary m-0 leading-relaxed">
                    Add the sections for each class and the seats in each. Seat counts drive admission availability and the RTE 25% quota.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-line rounded-control bg-white hover:bg-surface text-sm font-semibold text-ink transition-colors shadow-sm">
                  <Copy size={16} />
                  Copy from 2025-26
                </button>
              </div>

              <div className="overflow-x-auto border border-line rounded-card shadow-sm">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-surface border-b border-line">
                      <th className="py-3 px-4 font-semibold text-[15px] text-ink">Class</th>
                      <th className="py-3 px-4 font-semibold text-[15px] text-ink">Wing</th>
                      <th className="py-3 px-4 font-semibold text-[15px] text-ink">Sections</th>
                      <th className="py-3 px-4 font-semibold text-[15px] text-ink text-right">Seats / section</th>
                      <th className="py-3 px-4 font-semibold text-[15px] text-ink text-right">Total seats</th>
                      <th className="py-3 px-4 font-semibold text-[15px] text-ink text-right">RTE seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((cls, idx) => (
                      <tr key={idx} className="border-b border-line last:border-b-0 hover:bg-surface/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[15px] text-ink">{cls.class}</td>
                        <td className="py-3 px-4 text-[14px] text-ink-secondary font-medium">{cls.wing}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 flex-wrap items-center">
                            {cls.sections.map((sec, sIdx) => (
                              <span key={sIdx} className="px-3 py-1 bg-primary-light/20 text-primary-dark font-semibold text-[13px] rounded-md border border-primary/10">
                                {sec}
                              </span>
                            ))}
                            <button 
                              onClick={() => addSection(idx)}
                              className="w-7 h-7 flex items-center justify-center rounded-md border-2 border-dashed border-line-input text-ink-secondary hover:text-primary hover:border-primary hover:bg-primary-light/10 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input 
                            type="number" 
                            value={cls.seats}
                            onChange={(e) => updateSeats(idx, parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1.5 border border-line-input rounded-md text-right text-[15px] font-medium text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors inline-block bg-white shadow-sm"
                          />
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[15px] text-ink font-semibold">
                          {cls.sections.length * cls.seats}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[15px] text-ink-secondary">
                          {cls.rte ? cls.rte : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4 pt-6 border-t border-line">
                <button 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  className="px-6 py-2.5 rounded-control text-[15px] font-semibold text-ink-secondary hover:text-ink hover:bg-surface transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  className="px-8 py-2.5 rounded-control bg-primary hover:bg-primary-dark text-white text-[15px] font-semibold shadow-sm transition-colors flex items-center gap-2"
                >
                  Save & Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-ink-secondary">
              <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center">
                <span className="text-2xl font-bold text-ink/30">{currentStep}</span>
              </div>
              <h2 className="text-xl font-medium text-ink m-0">
                {steps.find(s => s.id === currentStep)?.name}
              </h2>
              <p className="text-[15px]">This step is under construction.</p>
              
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  className="px-6 py-2 rounded-control border border-line text-[14px] font-semibold text-ink hover:bg-surface transition-colors"
                >
                  Previous Step
                </button>
                <button 
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  className="px-6 py-2 rounded-control bg-primary text-white text-[14px] font-semibold hover:bg-primary-dark transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
