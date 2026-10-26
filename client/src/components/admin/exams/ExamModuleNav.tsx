import React from "react";

export type ExamTab = "setup" | "marks" | "results";

interface ExamModuleNavProps {
  activeTab: ExamTab;
  onTabChange: (tab: ExamTab) => void;
  termSchemeContext?: string;
}

export default function ExamModuleNav({
  activeTab,
  onTabChange,
  termSchemeContext = "Term 1 · CBSE Middle (VI–VIII) scheme",
}: ExamModuleNavProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-secondary mb-1">
      <span className="font-medium text-ink-secondary">Examinations ›</span>

      {/* Setup Tab */}
      {activeTab === "setup" ? (
        <span className="text-ink font-semibold">Setup</span>
      ) : (
        <button
          type="button"
          onClick={() => onTabChange("setup")}
          className="text-primary hover:text-primary-hover hover:underline font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
        >
          Setup
        </button>
      )}

      <span>·</span>

      {/* Marks Entry Tab */}
      {activeTab === "marks" ? (
        <span className="text-ink font-semibold">Marks entry</span>
      ) : (
        <button
          type="button"
          onClick={() => onTabChange("marks")}
          className="text-primary hover:text-primary-hover hover:underline font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
        >
          Marks entry
        </button>
      )}

      <span>·</span>

      {/* Results Tab */}
      {activeTab === "results" ? (
        <span className="text-ink font-semibold">Results</span>
      ) : (
        <button
          type="button"
          onClick={() => onTabChange("results")}
          className="text-primary hover:text-primary-hover hover:underline font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 text-[13px]"
        >
          Results
        </button>
      )}

      {termSchemeContext && (
        <>
          <span className="text-line-input">·</span>
          <span className="text-xs text-ink-muted">{termSchemeContext}</span>
        </>
      )}
    </div>
  );
}
