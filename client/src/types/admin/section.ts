import type { Class } from "./class";

export interface Section {
  _id: string;
  name: string;
  classId: Class | null; // keep it nullable for optional class references
}
