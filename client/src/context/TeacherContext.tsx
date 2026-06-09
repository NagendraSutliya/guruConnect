import React, { createContext, useContext, useState } from "react";

interface TeacherContextType {
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
  selectedSubjectId: string;
  setSelectedSubjectId: (id: string) => void;
  selectedExamId: string;
  setSelectedExamId: (id: string) => void;
  resultStudents: any[];
  setResultStudents: React.Dispatch<React.SetStateAction<any[]>>;
  draftStudents: any[];
  setDraftStudents: React.Dispatch<React.SetStateAction<any[]>>;
  attendanceStudents: any[];
  setAttendanceStudents: React.Dispatch<React.SetStateAction<any[]>>;
  resetFilters: () => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  
  const [resultStudents, setResultStudents] = useState<any[]>([]);
  const [draftStudents, setDraftStudents] = useState<any[]>([]);
  const [attendanceStudents, setAttendanceStudents] = useState<any[]>([]);

  const resetFilters = () => {
    setSelectedClassId("");
    setSelectedSectionId("");
    setSelectedSubjectId("");
    setSelectedExamId("");
    setResultStudents([]);
    setDraftStudents([]);
    setAttendanceStudents([]);
  };

  return (
    <TeacherContext.Provider
      value={{
        selectedClassId,
        setSelectedClassId,
        selectedSectionId,
        setSelectedSectionId,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedExamId,
        setSelectedExamId,
        resultStudents,
        setResultStudents,
        draftStudents,
        setDraftStudents,
        attendanceStudents,
        setAttendanceStudents,
        resetFilters
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error("useTeacher must be used within a TeacherProvider");
  }
  return context;
};
