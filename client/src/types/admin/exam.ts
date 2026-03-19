import type { Section } from "./section";
import type { Class } from "./class";

export interface Exam {
  _id: string;
  name: string;
  classId?: Class;
  sectionId?: Section;
  subjects?: any[];
  status?: "upcoming" | "active" | "completed";
}
