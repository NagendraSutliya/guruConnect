// ================= BASE TYPES =================

export interface BaseStudent {
  _id: string;
  name: string;
  rollNo: string;
}

export interface BaseClassAssignment {
  _id: string;
  classId: { _id: string; name: string };
  sectionId: { _id: string; name: string };
}

// ================= ATTENDANCE =================

export interface AttendanceStudent extends BaseStudent {
  status: "pending" | "present" | "absent";
}

export type AttendanceClassAssignment = BaseClassAssignment;

// ================= RESULT =================

export interface ResultStudent extends BaseStudent {
  marks?: number;
  isEditing?: boolean;
}

export interface ResultClassAssignment extends BaseClassAssignment {
  subjectId: { _id: string; name: string };
}

// ================= UPLOAD MARKS =================

export type UploadMarksStudent = ResultStudent;

export type UploadMarksClassAssignment = ResultClassAssignment;
