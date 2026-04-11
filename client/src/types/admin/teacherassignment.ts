import type { Class } from "./class";
import type { Section } from "./section";
import type { Subject } from "./subject";

export interface Teacher {
  _id: string;
  name: string;
  email?: string;
  status: "active" | "inactive";
}

export interface Assignment {
  _id: string;
  teacherId: Teacher;
  classId: Class;
  sectionId?: Section | null;
  subjectId: Subject;
}

export interface FormState {
  teacherId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
}
