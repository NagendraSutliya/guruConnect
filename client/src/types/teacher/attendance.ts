export interface Student {
  _id: string;
  name: string;
  rollNo: string;
  status: "pending" | "present" | "absent";
}

export interface ClassAssignment {
  _id: string;
  classId: { _id: string; name: string };
  sectionId: { _id: string; name: string };
}
