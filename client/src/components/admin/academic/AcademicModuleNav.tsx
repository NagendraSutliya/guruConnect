import React from "react";

interface Props {
  activeTab: "timetable" | "homework";
  onTabChange: (tab: "timetable" | "homework") => void;
  extraContext?: string;
}

export default function AcademicModuleNav({ activeTab, onTabChange, extraContext }: Props) {
  return (
    <div className="text-small text-ink-secondary flex flex-wrap items-center gap-2">
      {/* Timetable Tab */}
      {activeTab === "timetable" ? (
        <span className="text-ink font-semibold">Timetable</span>
      ) : (
        <button
          type="button"
          onClick={() => onTabChange("timetable")}
          className="text-primary hover:underline font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 text-small"
        >
          Timetable
        </button>
      )}

      <span>·</span>

      {/* Homework & Syllabus Tab */}
      {activeTab === "homework" ? (
        <span className="text-ink font-semibold">Homework & Syllabus</span>
      ) : (
        <button
          type="button"
          onClick={() => onTabChange("homework")}
          className="text-primary hover:underline font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 text-small"
        >
          Homework & Syllabus
        </button>
      )}

      {extraContext && (
        <>
          <span>·</span>
          <span className="font-mono text-micro text-ink-muted">{extraContext}</span>
        </>
      )}
    </div>
  );
}
