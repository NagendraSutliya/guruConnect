import type { Section } from "./section";
import type { Class } from "./class";

export interface Subject {
  _id: string;
  name: string;
  code: string;
  classId: Class;
  sectionId?: Section | null; // optional
}
