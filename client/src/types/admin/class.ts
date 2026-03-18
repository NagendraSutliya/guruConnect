import type { AcademicYear } from "./academicYear";

export interface Class {
  _id: string;
  name: string;
  academicYearId: AcademicYear;
}
