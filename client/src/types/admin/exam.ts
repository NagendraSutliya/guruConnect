import type { Section } from "./section";
import type { Class } from "./class";
// import type { Subject } from "./subject";

// export interface Exam {
//   _id: string;
//   name: string;
//   date: string; // ISO string
//   startTime?: string;
//   endTime?: string;
//   classId?: Class;
//   sectionId?: Section;
//   subjectId?: Subject;
// }

// export interface Option {
//   _id: string;
//   name: string;
// }

// export interface Class {
//   _id: string;
//   name: string;
// }

// export interface Section {
//   _id: string;
//   name: string;
// }

export interface Exam {
  _id: string;
  name: string;
  classId?: Class;
  sectionId?: Section;
  subjects?: any[];
  status?: "upcoming" | "active" | "completed";
}
